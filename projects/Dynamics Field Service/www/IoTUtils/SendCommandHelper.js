/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};
FS.SendCommandHelper = FS.SendCommandHelper || {};

FS.SendCommandHelper.SendCommandButton = {
    localization: null,
    canSendCommand: null,

    onButtonClick: function (entityForm) {
        var entity = entityForm && entityForm.entity;

        // Set localization
        if (entity.entityName === FS.Schema.IoTAlert.name) {
            FS.SendCommandHelper.SendCommandButton.localization = FS.IoTAlert.localization;
        }
        else if (entity.entityName === FS.Schema.IoTDevice.name) {
            FS.SendCommandHelper.SendCommandButton.localization = FS.IoTDevice.localization;
        }

        if (FS.SendCommandHelper.SendCommandButton.canSendCommand === null) {
            FS.SendCommandHelper.SendCommandButton.setCanSendCommand(entityForm, FS.SendCommandHelper.SendCommandButton.resumeAfterCheckSendPermission);
        }
        else {
            FS.SendCommandHelper.SendCommandButton.resumeAfterCheckSendPermission(entityForm);
        }
    },

    setCanSendCommand: function (entityForm, callback) {
        MobileCRM.Metadata.requestObject(function (metadata) {
            MobileCRM.MetaEntity.loadByName(
                FS.Schema.IoTDeviceCommand.name,
                function (metaEntity) {
                    FS.SendCommandHelper.SendCommandButton.canSendCommand = metaEntity.canCreate(); // True if user has IoT Device Command send permissions
                    if (callback) {
                        callback(entityForm);
                    }
                }, FS.Utils.showParsedError, null);
        }, FS.Utils.showParsedError, null);
    },

    resumeAfterCheckSendPermission: function (entityForm) {
        if (FS.SendCommandHelper.SendCommandButton.canSendCommand) {
            FS.SendCommandHelper.SendCommandButton.sendDeviceCommand(entityForm);
        }
        else if (FS.SendCommandHelper.SendCommandButton.localization) {
            MobileCRM.bridge.alert(FS.SendCommandHelper.SendCommandButton.localization.get("Alert.IoTDeviceCommand_NoSendPermission"));
        }
    },

    sendDeviceCommand: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        if (entity) {

            if (entity.entityName === FS.Schema.IoTAlert.name) {
                showNewCommandDialog(
                    entity.properties && entity.properties[FS.Schema.IoTAlert.properties.msdyn_device],
                    entity.properties && entity.properties[FS.Schema.IoTAlert.properties.msdyn_deviceId],
                    entity,
                    null
                );
            }
            else if (entity.entityName === FS.Schema.IoTDevice.name) {
                showNewCommandDialog(
                    entity,
                    entity.properties && entity.properties[FS.Schema.IoTDevice.properties.msdyn_deviceId],
                    null,
                    null
                );
            }
            else if (entity.entityName === FS.Schema.CustomerAsset.name) {
                showNewCommandDialog(null, null, null, entity);
            }
            else if (entity.entityName === FS.Schema.WorkOrder.name) {
                var alertEntity = entity.properties && entity.properties[FS.Schema.WorkOrder.properties.msdyn_iotalert];
                var customerAssetEntity = entity.properties && entity.properties[FS.Schema.WorkOrder.properties.msdyn_customerAsset];

                if (alertEntity && !alertEntity.isNew) {
                    // WorkOrder has assigned IoT Alert record
                    MobileCRM.DynamicEntity.loadById(alertEntity.entityName, alertEntity.id,
                        function (iotAlert) {
                            showNewCommandDialog(
                                iotAlert && iotAlert.properties[FS.Schema.IoTAlert.properties.msdyn_device],
                                iotAlert && iotAlert.properties[FS.Schema.IoTAlert.properties.msdyn_deviceId],
                                iotAlert,
                                customerAssetEntity
                            );
                        }, FS.Utils.showparsederror, null);
                }
                else if (customerAssetEntity) {
                    // WorkOrder has assigned Customer Asset
                    showNewCommandDialog(null, null, null, customerAssetEntity);
                }
                else {
                    showNewCommandDialog();
                }
            }
            else {
                showNewCommandDialog();
            }
        }

        function showNewCommandDialog(device, deviceId, parentAlert, customerAsset) {

            var initialValues = {};

            if (device) {
                initialValues[FS.Schema.IoTDeviceCommand.properties.msdyn_device] = device;
            }

            if (deviceId) {
                initialValues[FS.Schema.IoTDeviceCommand.properties.msdyn_deviceId] = deviceId;
            }

            if (parentAlert) {
                initialValues[FS.Schema.IoTDeviceCommand.properties.msdyn_parentAlert] = parentAlert;
            }

            if (customerAsset) {
                initialValues[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset] = customerAsset;
            }

            MobileCRM.UI.FormManager.showNewDialog(FS.Schema.IoTDeviceCommand.name, null, { "@initialize": initialValues });
        }
    }
};