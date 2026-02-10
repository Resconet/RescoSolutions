var FS = FS || {};

FS.WorkOrderService = {
    initialLineStatus: null,

    workOrderServiceOnLoad: function () {
        MobileCRM.UI.EntityForm.onChange(FS.WorkOrderService.handleChange, true, null);
        MobileCRM.UI.EntityForm.requestObject(
            function (entityForm) {
                FS.WorkOrderService.savePreValues(entityForm);
                FS.WorkOrderHelper.setLoadValues(entityForm, FS.Schema.WorkOrderService);
            }, MobileCRM.bridge.alert);
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;
        if (changedItem && editedEntity && editedEntity.properties) {
            switch (changedItem) {
                case FS.Schema.WorkOrderService.properties.msdyn_lineStatus:
                    FS.WorkOrderHelper.checkEstimateToUsedChanged(editedEntity, FS.Schema.WorkOrderService, FS.WorkOrderService.initialLineStatus);
                    FS.WorkOrderHelper.clearPricingTab(editedEntity, FS.Schema.WorkOrderService);
                    FS.WorkOrderService.initialLineStatus = editedEntity.properties[FS.Schema.WorkOrderService.properties.msdyn_lineStatus];
                    break;
                case FS.Schema.WorkOrderService.properties.msdyn_service:
                    FS.WorkOrderHelper.setDefaultValuesFromProduct(editedEntity, FS.Schema.WorkOrderService, FS.Schema.WorkOrderService.properties.msdyn_service);
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
            FS.WorkOrderService.initialLineStatus = entityProperties[FS.Schema.WorkOrderService.properties.msdyn_lineStatus];
        }
    }
};