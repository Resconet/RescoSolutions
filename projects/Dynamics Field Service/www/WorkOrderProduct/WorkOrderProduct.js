var FS = FS || {};

FS.WorkOrderProduct = {
    initialLineStatus: null,

    workOrderProductOnLoad: function () {
        MobileCRM.UI.EntityForm.onChange(FS.WorkOrderProduct.handleChange, true, null);
        MobileCRM.UI.EntityForm.requestObject(
            function (entityForm) {
                FS.WorkOrderProduct.savePreValues(entityForm);
                FS.WorkOrderHelper.setLoadValues(entityForm, FS.Schema.WorkOrderProduct);
            }, MobileCRM.bridge.alert);
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;
        if (changedItem && editedEntity && editedEntity.properties) {
            switch (changedItem) {
                case FS.Schema.WorkOrderProduct.properties.msdyn_lineStatus:
                    FS.WorkOrderHelper.checkEstimateToUsedChanged(editedEntity, FS.Schema.WorkOrderProduct, FS.WorkOrderProduct.initialLineStatus);
                    FS.WorkOrderHelper.clearPricingTab(editedEntity, FS.Schema.WorkOrderProduct);
                    FS.WorkOrderProduct.initialLineStatus = editedEntity.properties[FS.Schema.WorkOrderProduct.properties.msdyn_lineStatus];
                    break;
                case FS.Schema.WorkOrderProduct.properties.msdyn_product:
                    FS.WorkOrderHelper.setDefaultValuesFromProduct(editedEntity, FS.Schema.WorkOrderProduct, FS.Schema.WorkOrderProduct.properties.msdyn_product);
                    break;
                default:
                    break;
            }
        }
    },

    // Sets initialLineStatus 
    savePreValues: function (entityForm) {
        if (entityForm && entityForm.entity && entityForm.entity.properties) {
            var entityProperties = entityForm.entity.properties;
            FS.WorkOrderProduct.initialLineStatus = entityProperties[FS.Schema.WorkOrderProduct.properties.msdyn_lineStatus];
        }
    },

    // Sets the Work Order Product's Warehouse field
    setWarehouse: function (entity) {
        if (entity && entity.properties) {
            MobileCRM.Configuration.requestObject(
                function (config) {
                    if (config && config.settings) {
                        var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.BookableResource.name);
                        fetchEntity.addAttribute(FS.Schema.BookableResource.properties.msdyn_warehouse); // index 0
                        fetchEntity.filter = new MobileCRM.FetchXml.Filter();
                        fetchEntity.filter.where(FS.Schema.BookableResource.properties.userId, "eq", config.settings.systemUserId);
                        fetchEntity.filter.where(FS.Schema.BookableResource.properties.msdyn_warehouse, "not-null");

                        var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
                        fetch.execute("Array",
                            function (results) {
                                if (results && results.length > 0) {
                                    var fetchedBR = results[0];
                                    if (fetchedBR) {
                                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                            entityForm.entity.properties[FS.Schema.WorkOrderProduct.properties.msdyn_warehouse] = fetchedBR[0];
                                        }, MobileCRM.bridge.alert);
                                    }
                                }
                            }, MobileCRM.bridge.alert, null);
                    }
                }, MobileCRM.bridge.alert, null);
        }
    }
};