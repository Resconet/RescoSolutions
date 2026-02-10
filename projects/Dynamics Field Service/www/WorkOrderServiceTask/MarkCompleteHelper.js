var FS = FS || {};

FS.MarkCompleteHelper = {
    loadWOSTAndComplete: function (entityId) {
        if (entityId) {
            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrderServiceTask.name, entityId, function (serviceTask) {
                serviceTask.properties[FS.Schema.WorkOrderServiceTask.properties.msdyn_percentComplete] = 100;
                serviceTask.save(function (error) {
                    if (error) {
                        MobileCRM.bridge.alert(error);
                    }
                });
            }, MobileCRM.bridge.alert);
        }
    }
};