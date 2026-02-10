/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
/// <reference path="../IoTUtils/Utils.js" />
var FS = FS || {};

FS.IoTDevice = {
    localization: null,

    ioTDeviceOnLoad: function () {
        MobileCRM.Localization.initialize(FS.IoTDevice.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customPullDeviceData, FS.IoTDevice.pullDeviceDataButton.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customSendIoTCommand, FS.SendCommandHelper.SendCommandButton.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customRegisterDevice, FS.IoTDevice.registerDeviceButton.onButtonClick, true, null);

        FS.Utils.formIsValidEndpoint(function (isValid) {
            if (!isValid) {
                MobileCRM.UI.EntityForm.requestObject(
                    function (entityForm) {
                        if (entityForm) {
                            // Hide the tab which has 'create new' permission
                            FS.Utils.hideRightAssociatedView(entityForm, FS.Schema.IoTDeviceCommand.name, true);
                            // Hide the tab of Device Status when Service Endpoint is invalid
                            entityForm.setTabVisibility(FS.Common.TabNames.IoTDevice_DeviceStatusTab, false);
                            // Hide the Power BI tab
                            entityForm.setTabVisibility(FS.Common.TabNames.IoTDevice_PowerBITab, false);

                            // Disable Pull Device Data and SendIoTCommand and Register Device commands when Service Endpoint is invalid
                            MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customPullDeviceData, false);
                            MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customSendIoTCommand, false);
                            MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customRegisterDevice, false);
                            if (entityForm.entity && entityForm.entity.properties) {
                                entityForm.entity.properties[FS.Common.SharedVariables.customPullDeviceDataEnabled] = false;
                                entityForm.entity.properties[FS.Common.SharedVariables.customSendIoTCommandEnabled] = false;
                                entityForm.entity.properties[FS.Common.SharedVariables.customRegisterDeviceEnabled] = false;
                            }
                        }
                    }, FS.Utils.showParsedError, null);
            } else {
                MobileCRM.UI.EntityForm.requestObject(
                    function (entityForm) {
                        // Hide the tab which doesn't have 'create new' permission
                        FS.Utils.hideRightAssociatedView(entityForm, FS.Schema.IoTDeviceCommand.name, false);
                        var entity = entityForm && entityForm.entity;
                        if (entity) {
                            // Hide  the tab of Device Status when entity is new
                            entityForm.setTabVisibility(FS.Common.TabNames.IoTDevice_DeviceStatusTab, !entity.isNew);
                            // Hide PowerBI tab when entity is new
                            entityForm.setTabVisibility(FS.Common.TabNames.IoTDevice_PowerBITab, !entity.isNew);
                        }
                    }, FS.Utils.showParsedError, null);
            }
        }, FS.Utils.showParsedError);
    },

    pullDeviceDataButton: {
        onButtonClick: function (entityForm) {
            var entity = entityForm && entityForm.entity;

            if (entity != null && entity.properties[FS.Schema.IoTDevice.properties.msdyn_registrationStatus] == FS.Enums.msdyn_iotdevice_msdyn_registrationStatus.StatusRegistered) {
                var devices = {
                    IoTDeviceIds: entity.properties[FS.Schema.IoTDevice.properties.msdyn_iotDeviceId]
                };
                MobileCRM.Services.Workflow.Action.execute(FS.Common.Workflows.pullIoTDeviceData, devices, function () {
                    MobileCRM.bridge.alert(FS.IoTDevice.localization.get("Alert.PullingDeviceDataInBackground"));
                }, FS.Utils.showParsedError, null);
            } else {
                MobileCRM.bridge.alert(FS.IoTDevice.localization.get("Alert.DeviceNotRegistered"));
            }
        }
    },

    registerDeviceButton: {
        onButtonClick: function (entityForm) {
            var entity = entityForm && entityForm.entity;
            if (entity !== null) {
                switch (entityForm.entity.properties[FS.Schema.IoTDevice.properties.msdyn_registrationStatus]) {
                    case FS.Enums.msdyn_iotdevice_msdyn_registrationStatus.StatusInProgress:
                        FS.Common.messageBox(
                            FS.IoTDevice.localization.get("Alert.ConfirmationWhenDeviceBeingRegistered"),
                            [FS.IoTDevice.localization.get("Cmd.Yes"), FS.IoTDevice.localization.get("Cmd.No")],
                            function() { FS.IoTDevice.registerConfirmationCallback(arguments[0], entity); });
                        break;
                    case FS.Enums.msdyn_iotdevice_msdyn_registrationStatus.StatusRegistered:
                        FS.Common.messageBox(
                            FS.IoTDevice.localization.get("Alert.ConfirmationWhenDeviceAlreadyRegistered"),
                            [FS.IoTDevice.localization.get("Cmd.Yes"), FS.IoTDevice.localization.get("Cmd.No")],
                            function() { FS.IoTDevice.registerConfirmationCallback(arguments[0], entity); });
                        break;
                    default:
                        FS.IoTDevice.registerDevice(entity);
                        break;
                }
            }
        }
    },

    registerConfirmationCallback: function (selectedAnswer, entity) {
        if (selectedAnswer === FS.IoTDevice.localization.get("Cmd.Yes")) {
            FS.IoTDevice.registerDevice(entity);
        }
    },

    registerDeviceSuccessfullCallback: function() {
        MobileCRM.bridge.alert(FS.IoTDevice.localization.get("Alert.DeviceBeingRegisteredInBackground"));
    },

    registerDevice: function(entity) {
        var devices = {
            IoTDeviceIds: entity.properties[FS.Schema.IoTDevice.properties.msdyn_iotDeviceId]
        };
        MobileCRM.Services.Workflow.Action.execute(FS.Common.Workflows.registerIoTDevice, devices, FS.IoTDevice.registerDeviceSuccessfullCallback, FS.Utils.showParsedError, null);
    },

    storeLocalization: function (localization) {
        FS.IoTDevice.localization = localization;
    }
};