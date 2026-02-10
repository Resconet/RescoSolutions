/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};
FS.FollowUpWOHelper = FS.FollowUpWOHelper || {};

FS.FollowUpWOHelper.FollowUpButton = {
    localization: null,
    canCreateWO: null,

    onButtonClick: function (entityForm) {
        var entity = entityForm && entityForm.entity;

        // Set localization
        if (entity.entityName === FS.Schema.BookableResourceBooking.name) {
            FS.FollowUpWOHelper.FollowUpButton.localization = FS.BookableResourceBooking.localization;
        }
        else if (entity.entityName === FS.Schema.WorkOrder.name) {
            FS.FollowUpWOHelper.FollowUpButton.localization = FS.WorkOrder.localization;
        }

        if (FS.FollowUpWOHelper.FollowUpButton.canCreateWO === null) {
            FS.FollowUpWOHelper.FollowUpButton.setCanCreateWO(entityForm, FS.FollowUpWOHelper.FollowUpButton.confirmCreateFollowUp);
        }
        else {
            FS.FollowUpWOHelper.FollowUpButton.confirmCreateFollowUp(entityForm);
        }
    },

    setCanCreateWO: function (entityForm, callback) {
        MobileCRM.Metadata.requestObject(function (metadata) {
            MobileCRM.MetaEntity.loadByName(
                FS.Schema.WorkOrder.name,
                function (metaEntity) {
                    FS.FollowUpWOHelper.FollowUpButton.canCreateWO = metaEntity.canCreate(); // True if user has Work Order create permissions
                    if (callback) {
                        callback(entityForm);
                    }
                }, MobileCRM.bridge.alert, null);
        }, MobileCRM.bridge.alert, null);
    },

    confirmCreateFollowUp: function (entityForm) {
        if (FS.FollowUpWOHelper.FollowUpButton.canCreateWO && FS.FollowUpWOHelper.FollowUpButton.localization) {
            FS.Common.messageBox(
                            FS.FollowUpWOHelper.FollowUpButton.localization.get("Alert.WorkOrder_RunFollowUp"),
                            [FS.FollowUpWOHelper.FollowUpButton.localization.get("Cmd.Yes"),
                            FS.FollowUpWOHelper.FollowUpButton.localization.get("Cmd.No")],
                            function (button) {
                                FS.FollowUpWOHelper.FollowUpButton.postConfirmClick(button, entityForm);
                            }
                        );
        }
        else if (FS.FollowUpWOHelper.FollowUpButton.localization) {
            MobileCRM.bridge.alert(FS.FollowUpWOHelper.FollowUpButton.localization.get("Alert.WorkOrder_NoCreatePermission"));
        }
    },

    postConfirmClick: function (button, entityForm) {
        if (button === FS.FollowUpWOHelper.FollowUpButton.localization.get("Cmd.Yes")) {
            FS.FollowUpWOHelper.FollowUpButton.createFollowUpWO(entityForm);
        }
    },

    createFollowUpWO: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        if (entity) {
            if (entity.entityName === FS.Schema.BookableResourceBooking.name) {
                var workOrderRef = entity.properties && entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder];
                if (workOrderRef) {
                    MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrder.name, workOrderRef.id, function (workOrder) {
                        FS.FollowUpWOHelper.FollowUpButton.openNewFollowUpWO(workOrder);
                    });
                }
            }
            else if (entity.entityName === FS.Schema.WorkOrder.name) {
                FS.FollowUpWOHelper.FollowUpButton.openNewFollowUpWO(entity);
            }
        }
    },

    openNewFollowUpWO: function (entity) {
        var initialValues = {};
        var propertiesToIncludeInCopy = [
                FS.Schema.WorkOrder.properties.exchangeRate,
                FS.Schema.WorkOrder.properties.msdyn_address1,
                FS.Schema.WorkOrder.properties.msdyn_address2,
                FS.Schema.WorkOrder.properties.msdyn_address3,
                FS.Schema.WorkOrder.properties.msdyn_addressName,
                FS.Schema.WorkOrder.properties.msdyn_billingAccount,
                FS.Schema.WorkOrder.properties.msdyn_bookingSummary,
                FS.Schema.WorkOrder.properties.msdyn_city,
                FS.Schema.WorkOrder.properties.msdyn_country,
                FS.Schema.WorkOrder.properties.msdyn_customerAsset,
                FS.Schema.WorkOrder.properties.msdyn_instructions,
                FS.Schema.WorkOrder.properties.msdyn_latitude,
                FS.Schema.WorkOrder.properties.msdyn_longitude,
                FS.Schema.WorkOrder.properties.msdyn_postalCode,
                FS.Schema.WorkOrder.properties.msdyn_priceList,
                FS.Schema.WorkOrder.properties.msdyn_primaryIncidentDescription,
                FS.Schema.WorkOrder.properties.msdyn_primaryIncidentEstimatedDuration,
                FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType,
                FS.Schema.WorkOrder.properties.msdyn_priority,
                FS.Schema.WorkOrder.properties.msdyn_reportedByContact,
                FS.Schema.WorkOrder.properties.msdyn_serviceAccount,
                FS.Schema.WorkOrder.properties.msdyn_serviceRequest,
                FS.Schema.WorkOrder.properties.msdyn_serviceTerritory,
                FS.Schema.WorkOrder.properties.msdyn_stateOrProvince,
                FS.Schema.WorkOrder.properties.msdyn_taxCode,
                FS.Schema.WorkOrder.properties.msdyn_taxable,
                FS.Schema.WorkOrder.properties.msdyn_timeFromPromised,
                FS.Schema.WorkOrder.properties.msdyn_timeToPromised,
                FS.Schema.WorkOrder.properties.msdyn_workOrderSummary,
                FS.Schema.WorkOrder.properties.msdyn_workOrderType,
                FS.Schema.WorkOrder.properties.transactionCurrencyId];

        // Copies the property values of all properties in the properties list
        for (var i = 0; i < propertiesToIncludeInCopy.length; i++) {
            var property = propertiesToIncludeInCopy[i];
            if (entity.properties.hasOwnProperty(property)) {
                initialValues[property] = entity.properties[property];
            }
        }

        initialValues[FS.Schema.WorkOrder.properties.msdyn_systemStatus] = FS.Enums.msdyn_workordermsdyn_SystemStatus.OpenUnscheduled;
        initialValues[FS.Schema.WorkOrder.properties.msdyn_parentWorkOrder] = entity.properties[FS.Schema.WorkOrder.properties.msdyn_parentWorkOrder] == null ? entity : entity.properties[FS.Schema.WorkOrder.properties.msdyn_parentWorkOrder];
        initialValues[FS.Schema.WorkOrder.properties.msdyn_isMobile] = true;

        MobileCRM.UI.FormManager.showNewDialog(FS.Schema.WorkOrder.name, null, { "@initialize": initialValues });
    }
};