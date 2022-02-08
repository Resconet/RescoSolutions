
const _stateNames = {
    Scheduled: 1,
    Travel: 2,
    Work: 3,
    Completed: 4,
    Canceled: 5,
    Break: 100
}

var g_initialized = false;
var g_config = null;
var g_form = null;
var g_entity = null;

function initialize(initCallback) {

    // reset global variables
    g_initialized = false;
    g_config = null;
    g_form = null;
    g_entity = null;

    // load localization
    MobileCRM.Localization.initialize(function () {

        // load configuration
        MobileCRM.Configuration.requestObject(
            function (config) {
                /// <param name="config" type="MobileCRM.Configuration">/<param>
                g_config = config;

                // load metadata to get entity fields (Resco Cloud and Dynamics 365 have different fields)
                MobileCRM.Metadata.requestObject(function (metadata) {

                    // load entity form
                    requestEntityForm(function (entityForm) {
                        g_form = entityForm;
                        g_entity = g_form.entity;
                        g_initialized = true;
                        initCallback();
                    })

                }, displayErrorMesage);

                // we have done no changes, thus return false to disallow sending the changes back to the app.
                return false;
            },
            displayErrorMesage,
            null
        );

    }, displayErrorMesage);
       
}

function requestEntityForm(formCallback) {
    MobileCRM.UI.EntityForm.requestObject(formCallback, displayErrorMesage, null);
}

function displayErrorMesage(errorText) {
    var popup = new MobileCRM.UI.MessageBox(errorText);
    let okButtonText = MobileCRM.Localization.getTextOrDefault("Cmd.Ok", "OK");
    popup.items = [okButtonText];
    /// If title is too long set the 'multi-line' to true
    popup.multiLine = true;
    popup.show(
        function (button) {
            return;
        }
    );
}

function activateState(stateName, refreshCallback) {

    // we need configuration, entity form ... to work properly. if we don't have them, get them first.
    if (!g_initialized) {
        initialize(function () { activateState(stateName, refreshCallback); });
        return;
    }

    // find open time sheet entry
    getOpenTimeSheetEntry(function (fetchResult) {

        // at least one open time sheet entry was found
        if (fetchResult && fetchResult.length > 0) {

            var tse = fetchResult[0];
            // check if the time sheet entry is for current form's record
            if (checkValidTSE(tse)) {
                closeTSE(tse);
            } else {
                errorOtherTimesheetOpen(tse);
                return;
            }
        }

        // for completion don't create new entry
        if (stateName !== _stateNames.Completed) {
            createNewTimeSheetEntry(stateName, function () {
                // after the timesheet entry has been succesfully created   
                refreshCallback();
            });
        }

        if (stateName == _stateNames.Completed || stateName == _stateNames.Canceled) {
            changeEntityStatus(stateName);
        }

        // visual refresh
        refreshCallback();
    });
}


// find time sheet entry which doesn't have end time filled in
function getOpenTimeSheetEntry(fetchCallback) {
    var entity = new MobileCRM.FetchXml.Entity("resco_timesheetentry");
    entity.addAttributes();
    entity.orderBy("resco_starttime", true);

    var filterEmptyEndtime = new MobileCRM.FetchXml.Filter();
    filterEmptyEndtime.where("resco_endtime", "null");

    var filterCurrentUser = new MobileCRM.FetchXml.Filter();
    filterCurrentUser.where("ownerid", "eq-userid");

    var finalFilter = new MobileCRM.FetchXml.Filter();
    finalFilter.filters.push(filterEmptyEndtime);
    finalFilter.filters.push(filterCurrentUser);
    finalFilter.type = "and";
    entity.filter = finalFilter;

    var fetch = new MobileCRM.FetchXml.Fetch(entity);
    fetch.execute("DynamicEntities", fetchCallback, displayErrorMesage, null);
}

// check if the time sheet entry is for current entity
function checkValidTSE(tse) {

    // all properties in place and appointmentid equal to form's appointment
    if (tse && tse.properties &&
        tse.properties.resco_appointmentid &&
        tse.properties.resco_appointmentid.id === g_entity.id)
        return true;
    else
        return false;

}

// set current time as end time for an tse and save it
function closeTSE(tse) {
    if (tse && tse.properties) {
        tse.properties.resco_endtime = new Date();
        calculateTSEDuration(tse);
        tse.save(function (err) {
            if (err) displayErrorMesage(err);
        });
    }
}

function calculateTSEDuration(tse) {
    var startTime = new Date(tse.properties.resco_starttime);
    var endTime = new Date(tse.properties.resco_endtime);
    var durationMs = endTime - startTime;
    var durationHours = durationMs / 3600000.0;
    tse.properties.resco_durationhours = durationHours;
}

function errorOtherTimesheetOpen(tse) {
    var appointmentName = tse.properties.resco_appointmentid.primaryName;
    var popupText = MobileCRM.Localization.getTextOrDefault("Routes.Messages.AnotherTimesheetOpen", "Unable to perform this action. Another Timesheet Entry is open for {0}");
    popupTextSplits = popupText.split("{0}");
    popupText = popupTextSplits.join(appointmentName);
    var popup = new MobileCRM.UI.MessageBox(popupText);        
    var openButtonText = MobileCRM.Localization.getTextOrDefault("Routes.Open", "Open") + " " + appointmentName;
    var okButtonText = MobileCRM.Localization.getTextOrDefault("Cmd.Ok", "OK");
    popup.items = [openButtonText, okButtonText];
    /// If title is too long set the 'multi-line' to true
    popup.multiLine = true;
    popup.show(
        function (button) {
            if (button === openButtonText) {
                var appointmentRef = tse.properties.resco_appointmentid;
                MobileCRM.UI.FormManager.showEditDialog(appointmentRef.entityName, appointmentRef.id, null);
            }
            return;
        }
    );
}

// find an existing timesheet or create a new one
function prepareTimesheet(timesheetCallback) {
    findCurrentTimesheet(function (fetchResults) {
        var timeSheet = null;
        if (fetchResults && fetchResults.length > 0) {
            timeSheet = fetchResults[0];
            timesheetCallback(timeSheet);
        } else {
            createNewTimesheet(timesheetCallback);
        }
    });
}

// create new timesheet entry for current state
function createNewTimeSheetEntry(stateName, successCallback) {

    // at first check if timesheet for this week exists
    prepareTimesheet(function (timesheet) {

        if (timesheet && timesheet.properties && timesheet.properties.statuscode != 1) {
            errorTimesheetSubmitted();
            return;
        }

        // get timesheetentry entity primary field name
        var metaEntity = MobileCRM.Metadata.getEntity("resco_timesheetentry");
        var primaryFieldName = metaEntity.primaryFieldName;

        // create new timesheet entry
        var newTSE = MobileCRM.DynamicEntity.createNew("resco_timesheetentry");
        newTSE.properties.resco_appointmentid = new MobileCRM.Reference(g_entity.entityName, g_entity.id, g_entity.primaryName);
        newTSE.properties.resco_category = getTSECategory(stateName);
        newTSE.properties.resco_ismanaged = 0; // indicates that the record has been created automatically
        newTSE.properties[primaryFieldName] = MobileCRM.Localization.getTextOrDefault("resco_timesheetentry.resco_category." + newTSE.properties.resco_category, "Timesheet Entry");
        newTSE.properties.resco_starttime = new Date();
        newTSE.properties.resco_timesheetid = new MobileCRM.Reference(timesheet.entityName, timesheet.id, timesheet.primaryName);
        newTSE.save(function (err) {
            if (err) {
                var popupText = MobileCRM.Localization.getTextOrDefault("Routes.Messages.TimesheetSaveError", "New Timesheet Entry can't be created. Additional info:");
                displayErrorMesage(popupText + " " + err);
            } else {
                successCallback();
            }
        });
    });
}

var _TSECategories = {
    Work: 0,
    Break: 1,
    Travel: 2
};

// get category value to corresponding state name
function getTSECategory(stateName) {
    if (stateName == _stateNames.Work)
        return _TSECategories.Work;
    if (stateName == _stateNames.Travel)
        return _TSECategories.Travel;
    if (stateName == _stateNames.Break)
        return _TSECategories.Break;
}

// show an error message if there is a problem with parent time sheet
function errorTimesheetSubmitted() {
    var popupText = MobileCRM.Localization.getTextOrDefault("Routes.Messages.TimesheetSubmitted", "The operation couldn't be performed. Unable to find an open Timesheet for this week. A Timesheet for this week has already been submitted.");
    var popup = new MobileCRM.UI.MessageBox(popupText);
    var okButtonText = MobileCRM.Localization.getTextOrDefault("Cmd.Ok", "OK");
    popup.items = [okButtonText];
    /// If title is too long set the 'multi-line' to true
    popup.multiLine = true;
    popup.show(
        function (button) {
            return;
        }
    );
}

function findCurrentTimesheet(fetchCallback) {
    
    var entity = new MobileCRM.FetchXml.Entity("resco_timesheet");
    entity.addAttributes();
    // entity.orderBy("resco_startdate", true);

    var today = new Date();
    var weekStartDate = getWeekFrameDate(today, false);
    var weekEndDate = getWeekFrameDate(today, true);

    var filterStartTime = new MobileCRM.FetchXml.Filter();
    filterStartTime.where("resco_startdate", "on-or-after", weekStartDate);

    var filterEndTime = new MobileCRM.FetchXml.Filter();
    filterEndTime.where("resco_enddate", "on-or-after", weekEndDate);

    var filterCurrentUser = new MobileCRM.FetchXml.Filter();
    filterCurrentUser.where("ownerid", "eq-userid");

    var finalFilter = new MobileCRM.FetchXml.Filter();
    finalFilter.filters.push(filterStartTime);
    finalFilter.filters.push(filterEndTime);
    finalFilter.filters.push(filterCurrentUser);    
    finalFilter.type = "and";
    entity.filter = finalFilter;

    var fetch = new MobileCRM.FetchXml.Fetch(entity);
    fetch.execute("DynamicEntities", fetchCallback, displayErrorMesage, null);
}

function createNewTimesheet(timesheetCallback) {
    var today = new Date();
    var weekStartDate = getWeekFrameDate(today, false);
    var weekEndDate = getWeekFrameDate(today, true);

    // get timesheet entity primary field name
    var metaEntity = MobileCRM.Metadata.getEntity("resco_timesheet");
    var primaryFieldName = metaEntity.primaryFieldName;

    // create new timesheet
    var newTimesheet = MobileCRM.DynamicEntity.createNew("resco_timesheet");
    newTimesheet.properties.resco_startdate = weekStartDate;
    newTimesheet.properties.resco_enddate = weekEndDate;        
    newTimesheet.properties[primaryFieldName] = MobileCRM.Localization.getTextOrDefault("resco_timesheet", "Timesheet");

    newTimesheet.save(function (err) {
        if (err) {
            displayErrorMesage(err);
        }
        else {
            timesheetCallback(this);
        }
    });
}

// returns start date or end date of week containing the day
function getWeekFrameDate(day, returnEnd) {

    var dayOfWeek = day.getDay(); // sunday = 0, monday = 1
    var invertDayOfWeek = 6 - dayOfWeek;

    var dateToReturn = new Date(day);
    dateToReturn.setDate(dateToReturn.getDate() + (returnEnd ? invertDayOfWeek : -1 * dayOfWeek));

    return dateToReturn;
}

function changeEntityStatus(status) {
    requestEntityForm(function (form) {
        form.entity.properties.statuscode = (status == _stateNames.Completed ? 3 : 4); // 3 = completed, 4 = canceled
        MobileCRM.UI.EntityForm.saveAndClose();
        return true;
    });
}

//////////////////////////////////////////////////////////////////////////

function getCurrentState(stateCallback) {
    // we need configuration, entity form ... to work properly. if we don't have them, get them first.
    if (!g_initialized) {
        initialize(function () { getCurrentState(stateCallback); });
        return;
    }

    var stateObj = {
        State: _stateNames.Scheduled,
        BreakActive: false
    };

    // completed
    if (g_entity.properties.statuscode == 3) {
        stateObj.State = _stateNames.Completed;
        stateObj.BreakActive = false;
        stateCallback(stateObj);
        return;
    }

    // canceled
    if (g_entity.properties.statuscode == 4) {
        stateObj.State = _stateNames.Canceled;
        stateObj.BreakActive = false;
        stateCallback(stateObj);
        return;
    }

    // get open timesheet entry for this record
    getAppointmentTimeSheetEntry(true, function (fetchResult) {

        // no open time sheet entry found - the state is 'scheduled'
        if (!fetchResult || fetchResult.length <= 0) {
            stateCallback(stateObj);
            return;
        }

        // we have open time sheet entries
        // lets check if the first one is break
        var firstTSE = fetchResult[0];
        if (!firstTSE || !firstTSE.properties) {
            stateCallback(stateObj); // revert to default
            return;
        }

        if (firstTSE.properties.resco_category == _TSECategories.Break) {

            // we need to get last closed timesheet entry as well to see what was on break (travel / work)
            getAppointmentTimeSheetEntry(false, function (closedTSEs) {
                // no closed time sheet entry found - revert the state to 'scheduled' (default)
                if (!closedTSEs || closedTSEs.length <= 0) {
                    stateCallback(stateObj);
                    return;
                }

                // there is a closed TSE
                var secondTSE = closedTSEs[0];
                if (secondTSE && secondTSE.properties && secondTSE.properties.resco_category != undefined && secondTSE.properties.resco_category != _TSECategories.Break)
                    stateObj.State = getStateNameFromCategory(secondTSE.properties.resco_category);
                else {
                    // something went wrong => revert to 'scheduled' state (default)
                    stateCallback(stateObj);
                    return;
                }

                stateObj.BreakActive = true;
                stateCallback(stateObj);
                return;
            });

        } else {

            stateObj.State = getStateNameFromCategory(firstTSE.properties.resco_category);
            stateObj.BreakActive = false;
            stateCallback(stateObj);
            return;

        }

    });
}

// find time sheet entry from current user for this appointment
// parameter open defines if the end time should be provided or not (open = end time is not provided)
function getAppointmentTimeSheetEntry(open, fetchCallback) {
    var entity = new MobileCRM.FetchXml.Entity("resco_timesheetentry");
    entity.addAttributes();
    entity.orderBy("resco_starttime", true);

    var filterAppointment = new MobileCRM.FetchXml.Filter();
    filterAppointment.where("resco_appointmentid", "eq", g_entity.id);

    var filterEndtime = new MobileCRM.FetchXml.Filter();
    filterEndtime.where("resco_endtime", (open ? "null" : "not-null"));

    var filterCurrentUser = new MobileCRM.FetchXml.Filter();
    filterCurrentUser.where("ownerid", "eq-userid");

    var finalFilter = new MobileCRM.FetchXml.Filter();
    finalFilter.filters.push(filterAppointment);
    finalFilter.filters.push(filterEndtime);
    finalFilter.filters.push(filterCurrentUser);
    finalFilter.type = "and";
    entity.filter = finalFilter;

    var fetch = new MobileCRM.FetchXml.Fetch(entity);
    fetch.execute("DynamicEntities", fetchCallback, displayErrorMesage, null);
}

function getStateNameFromCategory(TSECategory) {
    if (TSECategory == _TSECategories.Work)
        return _stateNames.Work;
    if (TSECategory == _TSECategories.Travel)
        return _stateNames.Travel;
    if (TSECategory == _TSECategories.Break)
        return _stateNames.Break;
}

//////////////////////////////////////////////////////////////////////////