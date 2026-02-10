// JavaScript source code
/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};
var DripScheduling = function () {
    var self = this;
    var executionContext = null;
    var IncludedBookingStatuses = [
        690970002, //OnBreak
        690970003, //InProgress
        690970001, //Traveling
    ];
    var AdditionalBookingStatuses = [
        690970005, //Canceled
        690970000 //Scheduled
    ];
    var fetch = null;
    var bookingsToDrip = 0;
    var linkEntity = null;
    self.createDataSource = function () {
        var dataSource = new MobileCRM.UI.ListDataSource();
        // loadNextChunk method must be implemented explicitly
        dataSource.loadNextChunk = self.loadNextChunk;
        return dataSource;
    };
    self.loadNextChunk = function (page) {
        if (page > 1) { // We return all records in one page. So just let the upper level know we are done.
            this.chunkReady([]);
            return;
        }
        fetch = this.fetch;
        //store initial execution context
        executionContext = this;
        MobileCRM.Configuration.requestObject(self.requestObjectCallback, MobileCRM.bridge.alert, null);
    };
    self.requestObjectCallback = function (config) {
        var userId = config.settings.systemUserId;
        var fetchEntity = self.setUpAndGetFetchEntity(userId);
        var brFetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
        brFetch.execute("Array", self.fetchEntityCallback,
            function (e) { }, null);
    };
    self.setUpAndGetFetchEntity = function (userId) {
        var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.BookableResource.name);
        fetchEntity.addAttribute(FS.Schema.BookableResource.properties.bookableResourceId);
        fetchEntity.addAttribute(FS.Schema.BookableResource.properties.msdyn_enableDripScheduling);
        fetchEntity.addAttribute(FS.Schema.BookableResource.properties.msdyn_bookingsToDrip);

        fetchEntity.filter = new MobileCRM.FetchXml.Filter();
        fetchEntity.filter.where(FS.Schema.BookableResource.properties.userId, "eq", userId);
        return fetchEntity;
    };
    self.fetchEntityCallback = function (results) {
        var bookableResourceId, isDripSchedulingOn;
        if (results && results.length) {
            var response = results[0];
            bookableResourceId = response[0];
            isDripSchedulingOn = response[1] == 'True';
            bookingsToDrip = response[2] ? Number(response[2]) : 1;
            if (!isDripSchedulingOn) {
                // usual fetch with default sync filter
                fetch.execute("DynamicEntities", function (entities) {
                    executionContext.chunkReady(entities);
                }, MobileCRM.bridge.alert, this);
                return;
            }
            // WARNING: Do not add new attributes to the fetch - they will be ignored.
            fetch.count = bookingsToDrip;
            self.setUpAndGetEntityFilter(fetch.entity, bookableResourceId);

            linkEntity = self.setUpAndGetLinkEntity(fetch);

            fetch.execute("DynamicEntities", self.fetchForAdditionalEntities,
                MobileCRM.bridge.alert, this);
        }
    };
    self.setUpAndGetEntityFilter = function (entity, bookableResourceId) {
        var filter = new MobileCRM.FetchXml.Filter();
        filter.where("starttime", "today", null);
        if (bookableResourceId)
            filter.where("resource", "eq", bookableResourceId);

        var originalFilter = entity.filter;
        if (originalFilter && ((originalFilter.conditions && originalFilter.conditions.length > 0) || (originalFilter.filters && originalFilter.filters.length > 0))) {
            // Combine new filter with original filter which came from the view definition.
            var combinedFilter = new MobileCRM.FetchXml.Filter();
            combinedFilter.type = "and";
            combinedFilter.filters = [filter, originalFilter];
            return combinedFilter;
        }
        return filter; // Set the new filter to fetch entity
    }
    self.setUpAndGetLinkEntity = function (fetch) {
        var linkEntity = fetch.entity.addLink("bookingstatus", "bookingstatusid", "bookingstatus", "inner");
        linkEntity.addFilter().isIn("msdyn_fieldservicestatus", IncludedBookingStatuses);
        return linkEntity;
    }
    self.fetchForAdditionalEntities = function (entities) {
        // If there are not enough records, try Scheduled and Canceled bookings too.
        if (entities.length < bookingsToDrip) {
            fetch.count = bookingsToDrip - entities.length; // Load upto drip limit of records.
            linkEntity.filter.conditions[0].values = AdditionalBookingStatuses; // replace the included statuses.

            fetch.execute("DynamicEntities", function (entities2) {
                // Append the second list of entities.
                entities = entities.concat(entities2);
                // And return.
                executionContext.chunkReady(entities);
            }, MobileCRM.bridge.alert, executionContext);
        }
        else {
            // Otherwise just return what we've got.
            executionContext.chunkReady(entities);
        }
    };
};
FS.DripScheduling = {
    onLoad: function () {
        var factory = function () {
            var dripScheduling = new DripScheduling();
            return dripScheduling.createDataSource();
        };
        MobileCRM.UI.EntityList.setDataSourceFactory(factory);
    }
};