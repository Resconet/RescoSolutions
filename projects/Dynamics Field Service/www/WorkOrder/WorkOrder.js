/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
/// <reference path="FollowUpWOHelper.js" />
/// <reference path="../IoTUtils/SendCommandHelper.js" />
var FS = FS || {};

FS.WorkOrder = {
    oldSystemStatus: null,
    isBillingAccountTaxExempt: false,
    salesTaxCode: null,
    isTaxableWorkType: false,
    originalServiceAccount: null,
    localization: null,

    workOrderOnLoad: function () {
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customFollowUp, FS.FollowUpWOHelper.FollowUpButton.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customRemoteAssist, FS.RemoteAssist.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customSendIoTCommand, FS.SendCommandHelper.SendCommandButton.onButtonClick, true, null);

        FS.RemoteAssist.showHideRemoteAssistButton();
        MobileCRM.Localization.initialize(FS.WorkOrder.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onChange(FS.WorkOrder.handleChange, true, null);
        MobileCRM.UI.EntityForm.onSave(FS.WorkOrder.handleSave, true, null);
        MobileCRM.bridge.onGlobalEvent(FS.Common.Events.workOrderPrimaryIncidentTypeChanged, FS.WorkOrder.handlePrimaryIncidentTypeChange, true);
        FS.FollowUpWOHelper.FollowUpButton.setCanCreateWO(null, null);

        MobileCRM.Metadata.requestObject(
            function (metaData) {
                if (metaData && metaData.entities) {
                    if (metaData.entities[FS.Schema.IoTAlert.name] && metaData.entities[FS.Schema.IoTAlert.name].canRead()) {
                        FS.Utils.formIsValidEndpoint(function (isValid) {
                            if (!isValid) {
                                // Disable SendIoTCommand when Service Endpoint is invalid
                                MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customSendIoTCommand, false);
                                MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                    if (entityForm && entityForm.entity && entityForm.entity.properties) {
                                        entityForm.entity.properties[FS.Common.SharedVariables.customSendIoTCommandEnabled] = false;
                                    }
                                }, MobileCRM.bridge.alert);
                            }
                        }, FS.Utils.showParsedError);
                    } else {
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                            if (entityForm && entityForm.entity) {
                                // Hide msdyn_iotalert field when user doesn't have permission to read IoT Alert entity
                                var detailView = entityForm.getDetailView(FS.Common.TabNames.WorkOrder_GeneralTab);
                                var iotAlertItem = detailView.getItemByName(FS.Schema.WorkOrder.properties.msdyn_iotalert);
                                if (iotAlertItem) {
                                    iotAlertItem.isVisible = false;
                                }

                                // Disable SendIoTCommand when user doesn't have permission to read IoT Alert entity
                                MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customSendIoTCommand, false);
                                if (entityForm.entity.properties) {
                                    entityForm.entity.properties[FS.Common.SharedVariables.customSendIoTCommandEnabled] = false;
                                }
                            }
                        }, MobileCRM.bridge.alert);
                    }
                }
            }, MobileCRM.bridge.alert, null);

        // set "System Status" field to "Open-Unscheduled" on newly created work orders
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm && entityForm.entity && entityForm.entity.properties && entityForm.entity.isNew) {
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_systemStatus] = FS.Enums.msdyn_workordermsdyn_SystemStatus.OpenUnscheduled;
            }
            else if (entityForm && entityForm.entity && entityForm.entity.properties) {
                FS.WorkOrder.originalServiceAccount = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount];

                var billingAccount = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_billingAccount];
                if (billingAccount) {
                    MobileCRM.DynamicEntity.loadById(FS.Schema.Account.name, billingAccount.id, function (retrievedBillingAccount) {
                        FS.WorkOrder.isBillingAccountTaxExempt = retrievedBillingAccount.properties[FS.Schema.Account.properties.msdyn_taxExempt] == null ? FS.WorkOrder.isBillingAccountTaxExempt : retrievedBillingAccount.properties[FS.Schema.Account.properties.msdyn_taxExempt];
                    },
                    MobileCRM.bridge.alert);
                }

                var woType = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_workOrderType];
                if (woType) {
                    MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderType.name, woType.id, function (retrievedWOType) {
                        FS.WorkOrder.isTaxableWorkType = retrievedWOType.properties[FS.Schema.WorkOrderType.properties.msdyn_taxable] == null ? FS.WorkOrder.isTaxableWorkType : retrievedWOType.properties[FS.Schema.WorkOrderType.properties.msdyn_taxable];
                    },
                    MobileCRM.bridge.alert);
                }

                var taxCode = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxCode];
                if (taxCode) {
                    FS.WorkOrder.salesTaxCode = taxCode;
                }
                else {
                    var serviceAccount = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount];
                    if (serviceAccount) {
                        MobileCRM.DynamicEntity.loadById(FS.Schema.Account.name, serviceAccount.id, function (retrievedServiceAccount) {
                            if (retrievedServiceAccount && retrievedServiceAccount.properties) {
                                FS.WorkOrder.salesTaxCode = retrievedServiceAccount.properties[FS.Schema.Account.properties.msdyn_salesTaxCode] == null ? FS.WorkOrder.salesTaxCode : retrievedServiceAccount.properties[FS.Schema.Account.properties.msdyn_salesTaxCode];
                            }
                        },
                        MobileCRM.bridge.alert);
                    }
                }
            }
        }, MobileCRM.bridge.alert);
    },

    // To be called when a field is changed on the form
    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;
        if (editedEntity && editedEntity.properties) {
            switch (changedItem) {
                case FS.Schema.WorkOrder.properties.msdyn_serviceAccount:
                    FS.WorkOrder.setDefaultValuesFromAccount(editedEntity);
                    break;

                case FS.Schema.WorkOrder.properties.msdyn_billingAccount:
                    FS.WorkOrder.billingAccountChanged(editedEntity);
                    break;

                case FS.Schema.WorkOrder.properties.msdyn_taxable:
                    var taxable = editedEntity.properties[FS.Schema.WorkOrder.properties.msdyn_taxable];
                    if (taxable) {
                        FS.WorkOrder.setTaxable(entityForm);
                    }
                    else {
                        editedEntity.properties[FS.Schema.WorkOrder.properties.msdyn_taxCode] = null;
                    }
                    break;

                case FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType:
                    FS.WorkOrder.setIncidentFields(editedEntity);
                    break;

                case FS.Schema.WorkOrder.properties.msdyn_workOrderType:
                    var woType = editedEntity.properties[FS.Schema.WorkOrder.properties.msdyn_workOrderType];
                    if (woType) {
                        MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderType.name, woType.id, function (retrievedWOType) {
                            if (retrievedWOType && retrievedWOType.properties) {
                                FS.WorkOrder.isTaxableWorkType = retrievedWOType.properties[FS.Schema.WorkOrderType.properties.msdyn_taxable] == null ? FS.WorkOrder.isTaxableWorkType : retrievedWOType.properties[FS.Schema.WorkOrderType.properties.msdyn_taxable];
                                MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                    FS.WorkOrder.setTaxable(entityForm2);
                                }, MobileCRM.bridge.alert);
                            }
                        },
                        MobileCRM.bridge.alert);
                    }

                    var serviceAccount = editedEntity && editedEntity.properties && editedEntity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount];
                    if (serviceAccount) {
                        MobileCRM.DynamicEntity.loadById(FS.Schema.Account.name, serviceAccount.id, function (retrievedAccount) {
                            MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                FS.WorkOrder.setPriceList(entityForm2, retrievedAccount);
                            }, MobileCRM.bridge.alert);
                        },
                        MobileCRM.bridge.alert);
                    }
                    else {
                        FS.WorkOrder.setPriceList(entityForm, null);
                    }
                    break;

                default:
                    break;
            }
        }
    },

    handleSave: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        var saveHandler = entityForm.suspendSave();

        if (entity && entity.properties && (entity.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentDescription] || entity.properties[FS.Schema.WorkOrder.properties.msdyn_customerAsset]) && !entity.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType]) {
            FS.WorkOrder.checkRelatedIncidentExists(entity, saveHandler, FS.WorkOrder.checkRelatedEntitiesDoNotHaveCustomerAsset);
        }
        else {
            FS.WorkOrder.checkRelatedEntitiesDoNotHaveCustomerAsset(entity, saveHandler);
        }
    },

    checkRelatedIncidentExists: function (entity, saveHandler, callback) {
        var fetchRelatedIncidents = new MobileCRM.FetchXml.Entity(FS.Schema.WorkOrderIncident.name);
        fetchRelatedIncidents.addAttribute(FS.Schema.WorkOrderIncident.properties.msdyn_workOrder);
        fetchRelatedIncidents.filter = new MobileCRM.FetchXml.Filter();
        fetchRelatedIncidents.filter.where(FS.Schema.WorkOrderIncident.properties.msdyn_workOrder, "eq", entity.id);

        var fetch = new MobileCRM.FetchXml.Fetch(fetchRelatedIncidents);
        fetch.execute("Array", function (results) {
            if (results && results.length > 0) {
                callback(entity, saveHandler);
            }
            else {
                saveHandler.resumeSave(FS.WorkOrder.localization.get("Alert.WorkOrder_IncidentTypeRequired"));
            }
        }, function (error) {
            saveHandler.resumeSave(error.message);
        });
    },

    checkRelatedEntitiesDoNotHaveCustomerAsset: function (entity, saveHandler) {
        if (entity && !entity.isNew && entity.properties && entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount] && FS.WorkOrder.originalServiceAccount && entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount].id != FS.WorkOrder.originalServiceAccount.id) {
            var woIncidentFetch = FS.WorkOrder.relatedEntityHasCustomerAsset(entity.id, FS.Schema.WorkOrderIncident);
            var woServiceTaskFetch = FS.WorkOrder.relatedEntityHasCustomerAsset(entity.id, FS.Schema.WorkOrderServiceTask);
            var woProductFetch = FS.WorkOrder.relatedEntityHasCustomerAsset(entity.id, FS.Schema.WorkOrderProduct);
            var woServiceFetch = FS.WorkOrder.relatedEntityHasCustomerAsset(entity.id, FS.Schema.WorkOrderService);

            var keepChecking = true;

            var handleResultOrCallback = function (callback, results) {
                if (keepChecking) {
                    if (results && results.length > 0) {
                        FS.WorkOrder.invalidateServiceAccountChange(saveHandler);
                        keepChecking = false;
                    }
                    else {
                        return callback();
                    }
                }
            };

            FS.Common.executeFetch(woIncidentFetch, "Array", null)
            .then(handleResultOrCallback.bind(null, FS.Common.executeFetch.bind(null, woServiceTaskFetch, "Array", null)))
            .then(handleResultOrCallback.bind(null, FS.Common.executeFetch.bind(null, woProductFetch, "Array", null)))
            .then(handleResultOrCallback.bind(null, FS.Common.executeFetch.bind(null, woServiceFetch, "Array", null)))
            .then(handleResultOrCallback.bind(null, saveHandler.resumeSave))
            .catch(function (error) {
                saveHandler.resumeSave(error.message);
            });
        }
        else {
            saveHandler.resumeSave();
        }
    },

    invalidateServiceAccountChange: function (saveHandler) {
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm && entityForm.entity && entityForm.entity.properties) {
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount] = FS.WorkOrder.originalServiceAccount;
                FS.WorkOrder.setDefaultValuesFromAccount(entityForm.entity);
            }
        }, MobileCRM.bridge.alert);
        saveHandler.resumeSave(FS.WorkOrder.localization.get("Alert.WorkOrder_ServiceAccount"));
    },

    relatedEntityHasCustomerAsset: function (workOrderId, relatedEntitySchema) {
        var fetchRelatedEntity = new MobileCRM.FetchXml.Entity(relatedEntitySchema.name);
        fetchRelatedEntity.addAttribute(relatedEntitySchema.properties.msdyn_workOrder);
        fetchRelatedEntity.filter = new MobileCRM.FetchXml.Filter();
        fetchRelatedEntity.filter.where(relatedEntitySchema.properties.msdyn_workOrder, "eq", workOrderId);
        fetchRelatedEntity.filter.where(relatedEntitySchema.properties.msdyn_customerAsset, "not-null");

        return new MobileCRM.FetchXml.Fetch(fetchRelatedEntity);
    },

    // Use the assigned Service Account to set corresponding fields on this Work Order
    setDefaultValuesFromAccount: function (editedEntity) {
        var serviceAccount = editedEntity && editedEntity.properties && editedEntity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceAccount];

        if (serviceAccount) {
            MobileCRM.DynamicEntity.loadById(FS.Schema.Account.name, serviceAccount.id, function (retrievedAccount) {
                if (retrievedAccount && retrievedAccount.properties) {
                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        if (entityForm && entityForm.entity && entityForm.entity.properties) {
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_addressName] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Name] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_address1] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Line1] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_address2] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Line2] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_address3] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Line3] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_city] = retrievedAccount.properties[FS.Schema.Account.properties.address1_City] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_stateOrProvince] = retrievedAccount.properties[FS.Schema.Account.properties.address1_StateOrProvince] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_country] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Country] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_postalCode] = retrievedAccount.properties[FS.Schema.Account.properties.address1_PostalCode] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_longitude] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Longitude] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_latitude] = retrievedAccount.properties[FS.Schema.Account.properties.address1_Latitude] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_instructions] = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_workOrderInstructions] || null;

                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxCode] = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_salesTaxCode] || null;
                            FS.WorkOrder.salesTaxCode = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_salesTaxCode] || null;

                            FS.WorkOrder.setPriceList(entityForm, retrievedAccount);

                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_billingAccount] = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_billingAccount] || retrievedAccount;
                            FS.WorkOrder.billingAccountChanged(entityForm.entity);

                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.transactionCurrencyId] = retrievedAccount.properties[FS.Schema.Account.properties.transactionCurrencyId] || null;
                            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_serviceTerritory] = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_serviceTerritory] || null;
                        }
                    }, MobileCRM.bridge.alert);
                }
            },
            MobileCRM.bridge.alert);
        }
    },

    // Set the price list from the specified account or, if there is no default price level for that account, use the Work Order Type's price list
    setPriceList: function (entityForm, account) {
        if (account && account.properties && account.properties[FS.Schema.Account.properties.defaultPriceLevelId]) {
            entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_priceList] = account.properties[FS.Schema.Account.properties.defaultPriceLevelId];
        }
        else {
            var woType = entityForm && entityForm.entity && entityForm.entity.properties && entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_workOrderType];
            if (woType) {
                MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderType.name, woType.id, function (retrievedWOType) {
                    if (retrievedWOType && retrievedWOType.properties) {
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                            if (entityForm2 && entityForm2.entity && entityForm2.entity.properties) {
                                entityForm2.entity.properties[FS.Schema.WorkOrder.properties.msdyn_priceList] = retrievedWOType.properties[FS.Schema.WorkOrderType.properties.msdyn_priceList] || null;
                            }
                        }, MobileCRM.bridge.alert);
                    }
                },
                MobileCRM.bridge.alert);
            }
        }
    },

    // Set the taxable and sales tax code fields based on if the billing account is tax exempt or not and if the work order type is taxable
    setTaxable: function (entityForm) {
        if (entityForm && entityForm.entity && entityForm.entity.properties) {
            var taxable = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxable];

            if (!FS.WorkOrder.isBillingAccountTaxExempt) {
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxable] = FS.WorkOrder.isTaxableWorkType;
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxCode] = FS.WorkOrder.isTaxableWorkType ? FS.WorkOrder.salesTaxCode : null;
            }
            else if (taxable) {
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxable] = false;
                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_taxCode] = null;
            }
        }
    },
    
    billingAccountChanged: function (entity) {
        if (entity && entity.properties) {
            var billingAccount = entity.properties[FS.Schema.WorkOrder.properties.msdyn_billingAccount];
            if (billingAccount) {
                MobileCRM.DynamicEntity.loadById(FS.Schema.Account.name, billingAccount.id, function (retrievedAccount) {
                    if (retrievedAccount && retrievedAccount.properties) {
                        FS.WorkOrder.isBillingAccountTaxExempt = retrievedAccount.properties[FS.Schema.Account.properties.msdyn_taxExempt] == null ? false : retrievedAccount.properties[FS.Schema.Account.properties.msdyn_taxExempt];
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                            FS.WorkOrder.setTaxable(entityForm);
                        }, MobileCRM.bridge.alert);
                    }
                },
                MobileCRM.bridge.alert);
            }
        }
    },

    // Set the primary incident related fields based on the specified primary incident type
    setIncidentFields: function (entity) {
        if (entity && entity.properties) {
            var primaryIncidentType = entity.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentType];
            if (primaryIncidentType) {
                MobileCRM.DynamicEntity.loadById(FS.Schema.IncidentType.name, primaryIncidentType.id, function (retrievedIncidentType) {
                    if (retrievedIncidentType && retrievedIncidentType.properties) {
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                            if (entityForm && entityForm.entity && entityForm.entity.properties) {
                                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentEstimatedDuration] = retrievedIncidentType.properties[FS.Schema.IncidentType.properties.msdyn_estimatedDuration] || null;
                                entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_primaryIncidentDescription] = retrievedIncidentType.properties[FS.Schema.IncidentType.properties.msdyn_description] || null;

                                var currentType = entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_workOrderType];
                                if (!currentType) {
                                    entityForm.entity.properties[FS.Schema.WorkOrder.properties.msdyn_workOrderType] = retrievedIncidentType.properties[FS.Schema.IncidentType.properties.msdyn_defaultWorkOrderType];
                                }
                            }
                        }, MobileCRM.bridge.alert);
                    }
                },
                MobileCRM.bridge.alert);
            }
        }
    },

    handlePrimaryIncidentTypeChange: function () {
        MobileCRM.UI.EntityForm.refreshForm();
    },

    storeLocalization: function (localization) {
        FS.WorkOrder.localization = localization;
    }
};