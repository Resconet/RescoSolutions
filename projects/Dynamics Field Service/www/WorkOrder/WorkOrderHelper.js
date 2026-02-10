var FS = FS || {};

FS.WorkOrderHelper = {
    // Sets the Work Order Product or Service's fields onLoad
    setLoadValues: function (entityForm, schemaName) {
        if (entityForm && entityForm.entity && entityForm.entity.properties) {
            var entityProperties = entityForm.entity.properties;

            if (entityProperties[schemaName.properties.msdyn_priceList] == null) {
                FS.WorkOrderHelper.setDefaultValuesFromWorkOrder(entityForm.entity, schemaName);
            }
            if (entityProperties[schemaName.properties.msdyn_customerAsset] == null) {
                FS.WorkOrderHelper.setCustomerAsset(entityForm.entity, schemaName);
            }

            if (entityForm.entity.entityName === FS.Schema.WorkOrderProduct.name) {
                if (entityForm.entity.isNew && entityProperties[FS.Schema.WorkOrderProduct.properties.msdyn_warehouse] == null) {
                    FS.WorkOrderProduct.setWarehouse(entityForm.entity);
                }
            }
        }
    },

    // Sets the Work Order Product or Service's Discount Amount, Discount Percent, Quantity, and Unit Amount fields when the Line Status changed from Estimated to Used
    checkEstimateToUsedChanged: function (entity, schemaName, initial) {
        if (entity && entity.properties) {
            var used, estimated;
            if (entity.entityName === FS.Schema.WorkOrderProduct.name) {
                used = FS.Enums.msdyn_workorderproductmsdyn_LineStatus.Used;
                estimated = FS.Enums.msdyn_workorderproductmsdyn_LineStatus.Estimated;
            }
            else if (entity.entityName === FS.Schema.WorkOrderService.name) {
                used = FS.Enums.msdyn_workorderservicemsdyn_LineStatus.Used;
                estimated = FS.Enums.msdyn_workorderservicemsdyn_LineStatus.Estimated;
            }
            var lineStatus = entity.properties[schemaName.properties.msdyn_lineStatus];
            if (!entity.isNew && lineStatus === used && initial === estimated) {
                if (entity.entityName === FS.Schema.WorkOrderProduct.name) {
                    FS.WorkOrderHelper.copyAndNullifyIfNeeded(entity, [{ pricingAttribute: FS.Schema.WorkOrderProduct.properties.msdyn_quantity, estimateAttribute: FS.Schema.WorkOrderProduct.properties.msdyn_estimateQuantity }]);
                }
                else if (entity.entityName === FS.Schema.WorkOrderService.name) {
                    FS.WorkOrderHelper.copyAndNullifyIfNeeded(entity, [{ pricingAttribute: FS.Schema.WorkOrderService.properties.msdyn_duration, estimateAttribute: FS.Schema.WorkOrderService.properties.msdyn_estimateDuration }]);
                }
                FS.WorkOrderHelper.copyAndNullifyIfNeeded(entity, [
                    { pricingAttribute: schemaName.properties.msdyn_discountAmount, estimateAttribute: schemaName.properties.msdyn_estimateDiscountAmount },
                    { pricingAttribute: schemaName.properties.msdyn_discountPercent, estimateAttribute: schemaName.properties.msdyn_estimateDiscountPercent },
                    { pricingAttribute: schemaName.properties.msdyn_unitAmount, estimateAttribute: schemaName.properties.msdyn_estimateUnitAmount },
                    { pricingAttribute: schemaName.properties.msdyn_unitCost, estimateAttribute: schemaName.properties.msdyn_estimateUnitCost }
                ]);
            }
        }
    },

    copyAndNullifyIfNeeded: function (entity, pairs) {
        for (var i = 0; i < pairs.length; i++) {
            entity.properties[pairs[i].pricingAttribute] = entity.properties[pairs[i].estimateAttribute] || null;
        }
    },

    // Clears the values in the Pricing tab if Line Status is Estimated
    clearPricingTab: function (entity, schemaName) {
        if (entity && entity.properties) {
            var lineStatus = entity.properties[schemaName.properties.msdyn_lineStatus];
            var estimated;
            if (entity.entityName === FS.Schema.WorkOrderProduct.name) {
                estimated = FS.Enums.msdyn_workorderproductmsdyn_LineStatus.Estimated;
            }
            else if (entity.entityName === FS.Schema.WorkOrderService.name) {
                estimated = FS.Enums.msdyn_workorderservicemsdyn_LineStatus.Estimated;
            }
            if (lineStatus === estimated) {
                if (entity.entityName === FS.Schema.WorkOrderProduct.name) {
                    entity.properties[schemaName.properties.msdyn_quantity] = null;
                    entity.properties[schemaName.properties.msdyn_qtyToBill] = null;
                }
                else if (entity.entityName === FS.Schema.WorkOrderService.name) {
                    entity.properties[schemaName.properties.msdyn_minimumChargeAmount] = null;
                    entity.properties[schemaName.properties.msdyn_minimumChargeDuration] = null;
                }
                entity.properties[schemaName.properties.msdyn_unitAmount] = null;
                entity.properties[schemaName.properties.msdyn_subtotal] = null;
                entity.properties[schemaName.properties.msdyn_discountPercent] = null;
                entity.properties[schemaName.properties.msdyn_discountAmount] = null;
                entity.properties[schemaName.properties.msdyn_totalAmount] = null;
                entity.properties[schemaName.properties.msdyn_unitCost] = null;
                entity.properties[schemaName.properties.msdyn_additionalCost] = null;
                entity.properties[schemaName.properties.msdyn_commissionCosts] = null;
                entity.properties[schemaName.properties.msdyn_totalCost] = null;
            }
        }
    },

    // Sets the Work Order Product or Service's Description, Taxable, Name, and Unit fields
    setDefaultValuesFromProduct: function (entity, schemaName, value) {
        if (entity && entity.properties) {
            var entityField = entity.properties[value];
            if (entityField) {
                var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.Product.name);
                fetchEntity.addAttribute(FS.Schema.Product.properties.description); // index 0
                fetchEntity.addAttribute(FS.Schema.Product.properties.msdyn_taxable); // index 1
                fetchEntity.addAttribute(FS.Schema.Product.properties.name); // index 2
                fetchEntity.addAttribute(FS.Schema.Product.properties.defaultUoMId); // index 3
                fetchEntity.filter = new MobileCRM.FetchXml.Filter();
                fetchEntity.filter.where(FS.Schema.Product.properties.productId, "eq", entityField.id);

                var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
                fetch.execute("Array",
                    function (results) {
                        if (results && results.length > 0) {
                            var fetchedProduct = results[0];
                            if (fetchedProduct) {
                                MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                    entityForm.entity.properties[schemaName.properties.msdyn_description] = fetchedProduct[0];
                                    entityForm.entity.properties[schemaName.properties.msdyn_taxable] = fetchedProduct[1] == "True";
                                    entityForm.entity.properties[schemaName.properties.msdyn_name] = fetchedProduct[2];
                                    entityForm.entity.properties[schemaName.properties.msdyn_unit] = fetchedProduct[3];
                                }, MobileCRM.bridge.alert);
                            }
                        }
                    }, MobileCRM.bridge.alert, null);
            }
        }
    },

    // Sets the Work Order Product's Price List and Currency fields
    setDefaultValuesFromWorkOrder: function (entity, schemaName) {
        if (entity && entity.properties) {
            var workOrder = entity.properties[schemaName.properties.msdyn_workOrder];
            if (workOrder) {
                var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.WorkOrder.name);
                fetchEntity.addAttribute(FS.Schema.WorkOrder.properties.msdyn_priceList); // index 0
                fetchEntity.addAttribute(FS.Schema.WorkOrder.properties.transactionCurrencyId); // index 1
                fetchEntity.filter = new MobileCRM.FetchXml.Filter();
                fetchEntity.filter.where(FS.Schema.WorkOrder.properties.woNumber, "eq", workOrder.id);

                var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
                fetch.execute("Array",
                    function (results) {
                        if (results && results.length > 0) {
                            var fetchedWorkOrder = results[0];
                            if (fetchedWorkOrder) {
                                MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                    entityForm.entity.properties[schemaName.properties.msdyn_priceList] = fetchedWorkOrder[0];
                                    entityForm.entity.properties[schemaName.properties.transactionCurrencyId] = fetchedWorkOrder[1];
                                }, MobileCRM.bridge.alert);
                            }
                        }
                    }, MobileCRM.bridge.alert, null);
            }
        }
    },

    // Sets the Work Order Product or Service's Customer Asset field
    setCustomerAsset: function (entity, schemaName) {
        if (entity && entity.properties) {
            var customerAsset = entity.properties[schemaName.properties.msdyn_customerAsset];
            //Only Set if current CustomerAsset has not been set
            if (customerAsset == null) {
                var workOrderIncident = entity.properties[schemaName.properties.msdyn_workOrderIncident];
                // Set the CustomerAsset of WorkOrderIncident that is on this Work Order Product or Service
                if (workOrderIncident) {
                    FS.WorkOrderHelper.fetchWorkOrderIncidents(workOrderIncident.id, [FS.Schema.WorkOrderIncident.properties.msdyn_customerAsset], FS.Schema.WorkOrderIncident.properties.msdyn_workOrderIncidentId,
                        function (results) {
                            if (results && results.length > 0) {
                                var fetchedWOIncident = results[0];
                                if (fetchedWOIncident) {
                                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                        entityForm.entity.properties[schemaName.properties.msdyn_customerAsset] = fetchedWOIncident[0];
                                    }, MobileCRM.bridge.alert);
                                }
                            }
                        }, MobileCRM.bridge.alert, null);
                }
                else { //Set the CustomerAsset of the first (non-primary) WorkOrderIncident from the same WorkOrder that is on this Work Order Product or Service
                    var workOrder = entity.properties[schemaName.properties.msdyn_workOrder];
                    if (workOrder) {
                        FS.WorkOrderHelper.fetchWorkOrderIncidents(workOrder.id, [FS.Schema.WorkOrderIncident.properties.msdyn_customerAsset], FS.Schema.WorkOrderIncident.properties.msdyn_workOrder,
                            function (results) {
                                if (results && results.length > 0) {
                                    var fetchedWOIncident = results[0];
                                    if (fetchedWOIncident && fetchedWOIncident[0]) {
                                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                            entityForm.entity.properties[schemaName.properties.msdyn_customerAsset] = fetchedWOIncident[0];
                                        }, MobileCRM.bridge.alert);
                                    }
                                }
                            }, MobileCRM.bridge.alert, null);
                    }
                }
            }
        }
    },

    fetchWorkOrderIncidents: function (id, attributes, fetchType, success, failure, scope) {
        var fetchEntity = new MobileCRM.FetchXml.Entity(FS.Schema.WorkOrderIncident.name);
        for (var i = 0; i < attributes.length; i++) {
            fetchEntity.addAttribute(attributes[i]);
        }
        fetchEntity.filter = new MobileCRM.FetchXml.Filter();
        fetchEntity.filter.where(fetchType, "eq", id);

        var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);
        fetch.execute("Array", success, failure, scope);
    }
};