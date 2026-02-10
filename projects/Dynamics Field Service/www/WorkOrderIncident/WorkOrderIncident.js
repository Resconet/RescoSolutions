/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};

FS.WorkOrderIncident = {
    localization: null,

    workOrderIncidentOnLoad: function () {
        MobileCRM.UI.EntityForm.onChange(FS.WorkOrderIncident.handleChange, true, null);
        MobileCRM.UI.EntityForm.onSave(FS.WorkOrderIncident.handleSave, true, null);
        MobileCRM.Localization.initialize(FS.WorkOrderIncident.storeLocalization, MobileCRM.bridge.alert);
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;

        if (changedItem === FS.Schema.WorkOrderIncident.properties.msdyn_incidentType) {
            FS.WorkOrderIncident.setDefaultValuesFromIncidentType(editedEntity);
        }
    },

    handleSave: function (entityForm) {
        var saveHandler = entityForm.suspendSave();
        FS.WorkOrderIncident.validate(entityForm).then(function () {
            MobileCRM.UI.EntityForm.requestObject(function (requestedForm) {
                var editedEntity = requestedForm && requestedForm.entity;
                if (editedEntity && editedEntity.properties) {
                    editedEntity.properties[FS.Schema.WorkOrderIncident.properties.msdyn_isMobile] = true;
                    if (editedEntity.isNew
                    || (entityForm.relationship && entityForm.relationship.sourceProperty === FS.Schema.WorkOrder.name)) {
                        FS.WorkOrderIncident.setPrimaryIncidentType(requestedForm, saveHandler);
                    } else {
                        saveHandler.resumeSave();
                    }
                } else {
                    saveHandler.resumeSave();
                }
            }, MobileCRM.bridge.alert);
        }, function (err) { saveHandler.resumeSave(err.message); });
    },

    setDefaultValuesFromIncidentType: function (editedEntity) {
        var entityProperties = editedEntity && editedEntity.properties;
        var incidentTypeRef = entityProperties && entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_incidentType];
        var name = entityProperties && entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_name];
        if (incidentTypeRef) {
            MobileCRM.DynamicEntity.loadById(FS.Schema.IncidentType.name, incidentTypeRef.id, function (incidentType) {
                var incidentTypeProperties = incidentType && incidentType.properties;
                if (incidentTypeProperties) {
                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var incidentTypeName = incidentTypeProperties[FS.Schema.IncidentType.properties.msdyn_name];
                        if (incidentTypeName !== undefined) {
                            entityForm.entity.properties[FS.Schema.WorkOrderIncident.properties.msdyn_name] = incidentTypeName;
                        }

                        var description = incidentTypeProperties[FS.Schema.IncidentType.properties.msdyn_description];
                        if (description !== undefined) {
                            entityForm.entity.properties[FS.Schema.WorkOrderIncident.properties.msdyn_description] = description;
                        }

                        var estimatedDuration = incidentTypeProperties[FS.Schema.IncidentType.properties.msdyn_estimatedDuration];
                        if (estimatedDuration !== undefined) {
                            entityForm.entity.properties[FS.Schema.WorkOrderIncident.properties.msdyn_estimatedDuration] = estimatedDuration;
                        }
                    }, MobileCRM.bridge.alert);
                }
            }, MobileCRM.bridge.alert, null);
        } else if (name) {
            MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                if (entityForm && entityForm.entity && entityForm.entity.properties) {
                    entityForm.entity.properties[FS.Schema.WorkOrderIncident.properties.msdyn_name] = null;
                }
            }, MobileCRM.bridge.alert);
        }
    },

    setPrimaryIncidentType: function (entityForm, saveHandler) {
        var editedEntity = entityForm && entityForm.entity;
        var entityProperties = editedEntity && editedEntity.properties;

        if (editedEntity.isOnline || !entityProperties) {
            saveHandler.resumeSave();
            return;
        }

        //Check if this is the Primary Work Order Incident
        var isPrimary = entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_isPrimary];
        var workOrderRef = entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_workOrder];
        if (isPrimary === true && workOrderRef) {
            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrder.name, workOrderRef.id, function (workOrder) {
                //Get the Primary Incident Type of the Work Order
                var primaryIncidentTypeRef = workOrder && workOrder.properties && workOrder.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType];
                var incidentTypeRef = entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_incidentType];
                // Work Order has a different Incident Type than the Incident Type of this Work Order Incident
                if ((primaryIncidentTypeRef && incidentTypeRef && primaryIncidentTypeRef.id !== incidentTypeRef.id) ||
                    (!primaryIncidentTypeRef && incidentTypeRef)) {
                    workOrder.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType] = incidentTypeRef;
                    workOrder.save(function (err) {
                        if (!err) {
                            MobileCRM.bridge.raiseGlobalEvent(FS.Common.Events.workOrderPrimaryIncidentTypeChanged, {});
                        }
                        saveHandler.resumeSave(err);
                    });

                } else {
                    saveHandler.resumeSave();
                }
            }, function () { saveHandler.resumeSave(); }, null);
        } else {
            saveHandler.resumeSave();
        }
    },

    validate: function (entityForm) {
        var editedEntity = entityForm && entityForm.entity;
        var entityProperties = editedEntity && editedEntity.properties;
        //Validate work Order Primary Work Order Incident offline only. Online will be checked by Server
        if (!editedEntity.isOnline &&
            entityProperties &&
            entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_isPrimary] &&
            entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_workOrder] &&
            editedEntity.id) {
            return FS.WorkOrderIncident.validatePrimaryWorkOrderIncident(entityProperties);
        } else {
            return Promise.resolve();
        }
    },

    // Validate primary work order incident to make sure there is only 1 primary incident for the parent work order
    validatePrimaryWorkOrderIncident: function (entityProperties) {
        var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.WorkOrderIncident.name);
        fetchEntity.addAttribute(FS.Schema.WorkOrderIncident.properties.msdyn_workOrderIncidentId);
        fetchEntity.filter = new MobileCRM.FetchXml.Filter();
        fetchEntity.filter.where(FS.Schema.WorkOrderIncident.properties.msdyn_workOrderIncidentId, "ne", entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_workOrderIncidentId]);
        fetchEntity.filter.where(FS.Schema.WorkOrderIncident.properties.statusCode, "eq", FS.Enums.msdyn_workorderincidentStatus.Active);
        fetchEntity.filter.where(FS.Schema.WorkOrderIncident.properties.msdyn_workOrder, "eq", entityProperties[FS.Schema.WorkOrderIncident.properties.msdyn_workOrder].id);
        fetchEntity.filter.where(FS.Schema.WorkOrderIncident.properties.msdyn_isPrimary, "eq", true);

        var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
        return new Promise(function (resolve, reject) {
            fetch.execute("Array", function (results) {
                if (results.length > 0) {
                    reject(new Error(FS.WorkOrderIncident.localization.get("Alert.WorkOrderIncident_OnlyOnePrimaryWorkOrderIncidentAllowed")));
                } else {
                    resolve();
                }
            }, function (err) {
                reject(new Error(err));
            }, null);
        });
    },

    storeLocalization: function (localization) {
        FS.WorkOrderIncident.localization = localization;
    }
};