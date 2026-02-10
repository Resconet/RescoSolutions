/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};

FS.WorkOrderServiceTask = {
    localization: null,

    workOrderServiceTaskOnLoad: function () {
        MobileCRM.Localization.initialize(FS.WorkOrderServiceTask.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onChange(FS.WorkOrderServiceTask.handleChange, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customMarkComplete, FS.WorkOrderServiceTask.markComplete, true, null);

        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm && entityForm.entity && entityForm.entity.properties && !entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_customerAsset]) {
                FS.WorkOrderServiceTask.setCustomerAsset(entityForm);
            }

            FS.WorkOrderServiceTask.setWorkOrder(entityForm);
            FS.WorkOrderServiceTask.setGuideLookupField(entityForm);
        }, MobileCRM.bridge.alert);
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;

        switch (changedItem) {
            case FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrderIncident:
                FS.WorkOrderServiceTask.setCustomerAsset(entityForm);
                break;
            case FS.Schema.WorkOrderServiceTask.properties.msdyn_taskType:
                FS.WorkOrderServiceTask.setDefaults(entityForm);
                break;
            default:
                break;
        }
    },

    markComplete: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        var entityProperties = entity && entity.properties;

        if (entityProperties) {
            entityProperties[FS.Schema.WorkOrderServiceTask.properties.msdyn_percentComplete] = 100;
            MobileCRM.UI.EntityForm.saveAndClose();
        }
    },

    setDefaults: function (entityForm) {
        if (entityForm
            && entityForm.entity
            && entityForm.entity.properties) {
            if (entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_taskType]) {
                var taskType = entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_taskType];

                MobileCRM.DynamicEntity.loadById(FS.Schema.ServiceTaskType.name, taskType.id, function (taskType) {
                    MobileCRM.UI.EntityForm.requestObject(function (requestedForm) {
                        if (taskType.properties && requestedForm && requestedForm.entity && requestedForm.entity.properties) {
                            requestedForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_estimatedDuration] =
                                taskType.properties[FS.Schema.ServiceTaskType.properties.msdyn_estimatedDuration] || null;
                            requestedForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_description] =
                                taskType.properties[FS.Schema.ServiceTaskType.properties.msdyn_description] || null;
                        }
                    }, MobileCRM.bridge.alert);
                }, MobileCRM.bridge.alert, null);
            } else {
                entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_estimatedDuration] = null;
                entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_description] = null;
            }
        }
    },

    setWorkOrder: function (entityForm) {
        if (entityForm && entityForm.entity && entityForm.entity.properties
            && !entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrder]
            && entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrderIncident]) {

            var woIncident = entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrderIncident];

            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderIncident.name, woIncident.id, function (workOrderIncident) {
                if (workOrderIncident.properties) {
                    MobileCRM.UI.EntityForm.requestObject(function (requestedForm) {
                        if (requestedForm && requestedForm.entity && requestedForm.entity.properties) {
                            requestedForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrder] = workOrderIncident.properties[FS.Schema.WorkOrderIncident.properties.msdyn_workOrder] || null;
                        }
                    }, MobileCRM.bridge.alert);
                }
            }, MobileCRM.bridge.alert, null);
        }
    },

    setCustomerAsset: function (entityForm) {
        if (entityForm && entityForm.entity && entityForm.entity.properties
            && entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrder]
            && !entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_customerAsset]) {
            var workOrder = entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrder];

            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrder.name, workOrder.id, function (fetchedWorkOrder) {
                if (fetchedWorkOrder.properties) {
                    MobileCRM.UI.EntityForm.requestObject(function (requestedForm) {
                        if (requestedForm && requestedForm.entity && requestedForm.entity.properties) {
                            requestedForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_customerAsset] = fetchedWorkOrder.properties[FS.Schema.WorkOrder.properties.msdyn_customerAsset] || null;
                        }
                    }, MobileCRM.bridge.alert);
                }
            }, MobileCRM.bridge.alert, null);
        }
        if (entityForm
            && entityForm.entity
            && entityForm.entity.properties
            && entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrderIncident]) {
            var workOrderIncident = entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_workOrderIncident];

            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderIncident.name, workOrderIncident.id, function (woIncident) {
                if (woIncident.properties) {
                    MobileCRM.UI.EntityForm.requestObject(function (requestedForm) {
                        if (requestedForm && requestedForm.entity && requestedForm.entity.properties) {
                            requestedForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_customerAsset] = woIncident.properties[FS.Schema.WorkOrderIncident.properties.msdyn_customerAsset] || null;
                        }
                    }, MobileCRM.bridge.alert);
                }
            }, MobileCRM.bridge.alert, null);
        }
    },

    setGuideLookupField: function (entityForm) {
        // Show Guide lookup field if Guide entity and Guide lookup field are enabled and a Guide is associated with this service task
        var guideLinkItemName = "guideLinkItemName"; // A unique identifier for Guide LinkItem and won't be displayed to the user

        if (entityForm) {
            var detailView = entityForm.getDetailView(FS.Common.TabNames.WorkOrderServiceTask_GeneralTab);
            var linkItem = detailView.getItemByName(guideLinkItemName);
            if (linkItem) {
                detailView.removeItem(detailView.getItemIndex(guideLinkItemName));
            }

            if (entityForm.entity && entityForm.entity.properties && entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_guideid]) {
                linkItem = new MobileCRM.UI.DetailViewItems.LinkItem(guideLinkItemName, FS.WorkOrderServiceTask.localization.get("msdyn_workorderservicetask.msdyn_guideid"));
                var guideid = entityForm.entity.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_guideid].id;
                MobileCRM.DynamicEntity.loadById(FS.Schema.Guide.name, guideid, function (retrievedGuide) {
                    if (retrievedGuide) {
                        linkItem.value = retrievedGuide.properties[FS.Schema.Guide.properties.msmrw_name];
                        detailView.registerClickHandler(linkItem, FS.WorkOrderServiceTask.onGuideLookupLinkItemClick);
                        detailView.insertItem(linkItem, -1); // Place the item as the last one.
                    }
                }, MobileCRM.bridge.alert, null);
            }
        }
    },

    onGuideLookupLinkItemClick: function(itemName, detailViewName) {
        /// <param name="itemName" type="String">The name of detail view item which has been clicked.</params>
        /// <param name="detailViewName" type="String">The name of detail view which contains the clicked item.</params>
        MobileCRM.bridge.alert(FS.WorkOrderServiceTask.localization.get("Alert.OpenHoloLensToSeeGuideofServiceTask"));
    },

    storeLocalization: function (localization) {
        FS.WorkOrderServiceTask.localization = localization;
    }
};