/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
/// <reference path="../IoTUtils/Utils.js" />

var FS = FS || {};

FS.CustomerAsset = {
    localization: null,

    customerAssetOnLoad: function () {
        MobileCRM.Localization.initialize(FS.CustomerAsset.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customRegisterDevices, FS.CustomerAsset.registerDevicesCommandButton.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customAssociateDevice, FS.CustomerAsset.associateDeviceButtonOnClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customSendIoTCommand, FS.SendCommandHelper.SendCommandButton.onButtonClick, true, null);
        MobileCRM.Metadata.requestObject(
            function (metaData) {
                if (metaData && metaData.entities) {
                    // Check if user has Read permission to IoT Device Command entity
                    if (metaData.entities[FS.Schema.IoTDeviceCommand.name] && metaData.entities[FS.Schema.IoTDeviceCommand.name].canRead()) {
                        FS.Utils.formIsValidEndpoint(function (isValid) {
                            MobileCRM.UI.EntityForm.requestObject(
                                function (entityForm) {
                                    // Hide the tab which has 'create new' permission when endpoint is invalid and hide the tab which doesn't have 'create new' permission when endpoint is valid
                                    FS.Utils.hideRightAssociatedView(entityForm, FS.Schema.IoTDeviceCommand.name, !isValid);
                                }, FS.Utils.showParsedError, null);
                        }, FS.Utils.showParsedError);
                    }

                    // Check if user has Read permission to IoT Device entity
                    if (metaData.entities[FS.Schema.IoTDevice.name] && metaData.entities[FS.Schema.IoTDevice.name].canRead()) {
                        // Check if user has right permissions to Connection and ConnectionRole entities
                        if (metaData.entities[FS.Schema.Connection.name] && metaData.entities[FS.Schema.Connection.name].canRead() && metaData.entities[FS.Schema.Connection.name].canCreate() &&
                            metaData.entities[FS.Schema.ConnectionRole.name] && metaData.entities[FS.Schema.ConnectionRole.name].canRead() &&
                            metaData.entities[FS.Schema.IoTDeviceCommand.name] && metaData.entities[FS.Schema.IoTDeviceCommand.name].canRead()) {

                            // Only show the Device ID when there are no connected devices
                            MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                var entity = entityForm && entityForm.entity;
                                var assetId = entity && entity.properties && entity.properties[FS.Schema.CustomerAsset.properties.msdyn_customerAssetId];

                                FS.CustomerAsset.getFetchOfGetDevicesFromAsset(assetId).execute("JSON", function (assetDevices) {
                                    MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                        if (entityForm2 && entityForm2.entity) {
                                            var detailView = entityForm2.getDetailView(FS.Common.TabNames.CustomerAsset_ConnectedDeviceAttributes);
                                            var deviceIdItem = detailView.getItemByName(FS.Schema.CustomerAsset.properties.msdyn_deviceid);
                                            if (deviceIdItem) {
                                                deviceIdItem.isVisible = assetDevices.length === 0;
                                            }
                                        }
                                    }, MobileCRM.bridge.alert);
                                }, FS.Utils.showParsedError, null);
                            }, MobileCRM.bridge.alert);

                            FS.Utils.formIsValidEndpoint(function (isValid) {
                                if (!isValid) {
                                    // Disable SendIoTCommand, Associate Device and Register Device commands when Service Endpoint is invalid
                                    FS.CustomerAsset.disableIoTCommands();
                                }
                            }, FS.Utils.showParsedError);
                        } else {
                            FS.CustomerAsset.disableIoTCommands();
                        }
                    } else {
                        // Hide Connected Device Attributes tab when user doesn't have permission to read IoT Device entity
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                            if (entityForm && entityForm.entity) {
                                entityForm.setTabVisibility(FS.Common.TabNames.CustomerAsset_ConnectedDeviceAttributes, false);
                            }
                        }, MobileCRM.bridge.alert);

                        FS.CustomerAsset.disableIoTCommands();
                    }
                }
            }, MobileCRM.bridge.alert, null);
    },

    disableIoTCommands: function () {
        MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customRegisterDevices, false);
        MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customAssociateDevice, false);
        MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customSendIoTCommand, false);

        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm && entityForm.entity && entityForm.entity.properties) {
                entityForm.entity.properties[FS.Common.SharedVariables.customRegisterDevicesEnabled] = false;
                entityForm.entity.properties[FS.Common.SharedVariables.customAssociateDeviceEnabled] = false;
                entityForm.entity.properties[FS.Common.SharedVariables.customSendIoTCommandEnabled] = false;
            }
        }, MobileCRM.bridge.alert);
    },

    createRegisterCustomEntityPayload: function (customerAsset) {
        var assetSchema = FS.Schema.CustomerAsset;
        return {
            DeviceIds: customerAsset.properties[assetSchema.properties.msdyn_deviceid] || "",
            EntityIds: customerAsset.properties[assetSchema.properties.msdyn_customerAssetId],
            EntityLogicalName: FS.Schema.CustomerAsset.name,
            Names: customerAsset.properties[assetSchema.properties.msdyn_name],
        };
    },

    registerDevicesCommandButton: {
        onButtonClick: function (entityForm) {
            var entity = entityForm && entityForm.entity;
            var assetId = entity && entity.properties && entity.properties[FS.Schema.CustomerAsset.properties.msdyn_customerAssetId];

            FS.CustomerAsset.getFetchOfGetDevicesFromAsset(assetId).execute("JSON", function (assetDevices) {
                if (assetDevices.length === 0) {
                    FS.CustomerAsset.createDefaultDevice(entity);
                    return;
                }

                var isAnyDeviceRegistered = false;
                for (var i = 0; i < assetDevices.length; i++) {
                    var deviceRegistrationStatus = assetDevices[i] && assetDevices[i][FS.Schema.IoTDevice.properties.msdyn_registrationStatus];
                    if (parseInt(deviceRegistrationStatus) === FS.Enums.msdyn_iotdevice_msdyn_registrationStatus.StatusRegistered) {
                        isAnyDeviceRegistered = true;
                        break;
                    }
                }

                if (isAnyDeviceRegistered) {
                    var yesItem = FS.CustomerAsset.localization.get("Cmd.Yes");
                    var noItem = FS.CustomerAsset.localization.get("Cmd.No");
                    var items = [yesItem, noItem];

                    FS.Common.messageBox(
                        FS.CustomerAsset.localization.get("Alert.SomeDevicesAlreadyRegisteredWhenRegisterDeviceInCustomerAsset"), items,
                        function (button) {
                            if (button === yesItem) {
                                FS.CustomerAsset.registerDevices(assetDevices);
                            }
                        }
                    );
                } else {
                    FS.CustomerAsset.registerDevices(assetDevices);
                }
            }, FS.Utils.showParsedError, null);
        }
    },

    registerDevices: function (iotDevices) {
        if (!iotDevices || iotDevices.length === 0) {
            return;
        }

        var iotDeviceIds = [];
        for (var i = 0; i < iotDevices.length; i++) {
            var deviceId = iotDevices[i] && iotDevices[i][FS.Schema.IoTDevice.properties.msdyn_iotDeviceId];
            if (deviceId) {
                iotDeviceIds.push(deviceId);
            }
        }
        var devices = {
            IoTDeviceIds: iotDeviceIds.join(','),
        };
        MobileCRM.Services.Workflow.Action.execute(FS.Common.Workflows.registerIoTDevice, devices, function () {
            MobileCRM.bridge.alert(FS.CustomerAsset.localization.get("Alert.DevicesBeingRegisteredWhenRegisterDeviceInCustomerAsset"));
        }, FS.Utils.showParsedError, null);
    },

    createDefaultDevice: function (customerAsset) {
        MobileCRM.Services.Workflow.Action.execute(FS.Common.Workflows.registerCustomEntity, FS.CustomerAsset.createRegisterCustomEntityPayload(customerAsset), function () {
            MobileCRM.bridge.alert(FS.CustomerAsset.localization.get("Alert.NoConnectedDevicesWhenRegisterDeviceInCustomerAsset"));
        }, FS.Utils.showParsedError, null);
    },

    getFetchOfGetDevicesFromAsset: function (assetId) {
        var iotDeviceAttributes = [
            FS.Schema.IoTDevice.properties.msdyn_registrationStatus,
            FS.Schema.IoTDevice.properties.msdyn_iotDeviceId
        ];
        return FS.Utils.getFetchOfGetDevicesFromAsset(assetId, iotDeviceAttributes, []);
    },


    associateDeviceButtonOnClick: function (entityForm) {
        var entity = entityForm && entityForm.entity;

        if (entity) {
            MobileCRM.DynamicEntity.loadById(
                FS.Schema.ConnectionRole.name,
                FS.Common.ConnectedDeviceRoleId,
                function (connectionRole) {
                    var initialValues = {};
                    initialValues[FS.Schema.Connection.properties.record2roleid] = connectionRole;
                    initialValues[FS.Schema.Connection.properties.record1id] = entity;

                    MobileCRM.UI.FormManager.showNewDialog(FS.Schema.Connection.name, null, { "@initialize": initialValues });
                },
                FS.Utils.showParsedError, null);
        }
    },

    storeLocalization: function (localization) {
        FS.CustomerAsset.localization = localization;
    }
};