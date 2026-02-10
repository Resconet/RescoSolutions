/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
var FS = FS || {};

FS.IoTCommand = {
    localization: null,

    ioTCommandOnLoad: function () {
        MobileCRM.Localization.initialize(FS.IoTCommand.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onChange(FS.IoTCommand.handleChange, true, null);
        MobileCRM.UI.EntityForm.onSave(FS.IoTCommand.handleSave, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customAdvanced, function (entityForm) {
            MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customAdvanced, false);
        }, true, null);

        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            var entity = entityForm && entityForm.entity;

            if (entity != null && entity.isNew) {
                FS.Utils.setCommandName(entity);

                FS.IoTCommand.setAssetField(entityForm);
                FS.IoTCommand.setDeviceLookup(entityForm, false);
                FS.IoTCommand.setCommandLookup(entityForm);
            }
        }, FS.Utils.showParsedError, null);
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;
        if (changedItem != null && editedEntity != null) {
            switch (changedItem) {
                case FS.Schema.IoTDeviceCommand.properties.msdyn_device:
                    editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_deviceId] = null;
                    FS.Utils.setCommandName(editedEntity);
                    FS.IoTCommand.setAssetField(entityForm);
                    FS.IoTCommand.setCommandLookup(entityForm);
                    break;
                case FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset:
                    // reset the device
                    if (editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset] !== undefined) {
                        editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device] = null;
                    }
                    
                    FS.IoTCommand.setDeviceLookup(entityForm, false);
                    FS.Utils.setCommandName(editedEntity);
                    break;
                case FS.Schema.IoTDeviceCommand.properties.msdyn_sendtoallconnecteddevices:
                    if (editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_sendtoallconnecteddevices]) {
                        FS.IoTCommand.setDeviceLookup(entityForm, false);
                    }
                    FS.Utils.setCommandName(editedEntity);
                    break;
                case FS.Schema.IoTDeviceCommand.properties.msdyn_command:
                    FS.Utils.setCommandName(editedEntity);
                    break;
                default:
                    break;
            }
        }
    },

    // Default the asset field from device.
    setAssetField: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        var assetEntity = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset];
        // If asset is not already set.
        if (!assetEntity) {
            var device = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device];
            if (device) {
                var deviceid_1 = device.id;

                var fetch = FS.IoTCommand.getFetchOfGetAssetsFromDevice(deviceid_1);
                fetch.execute(
                    "Array",
                    function (assets) {
                        if (assets && assets.length > 0) {
                            MobileCRM.DynamicEntity.loadById(FS.Schema.CustomerAsset.name, assets[0][0], function (retrievedAsset) {
                                if (retrievedAsset) {
                                    MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                        if (entityForm2 && entityForm2.entity && entityForm2.entity.properties) {
                                            entityForm2.entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset] = retrievedAsset;
                                            FS.Utils.setCommandName(entityForm2.entity);
                                            FS.IoTCommand.setDeviceLookup(entityForm2, false);
                                        }
                                    }, FS.Utils.showParsedError, null);
                                }
                            }, FS.Utils.showParsedError, null);
                        }
                    },
                    FS.Utils.showParsedError,
                    null
                );
            }
        }
    },

    // Set the filter on device's lookup according to selected asset.
    setDeviceLookup: function (entityForm, reset) {
        var entity = entityForm && entityForm.entity;

        var asset = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset];

        // Create new device lookup view.
        var dv = entityForm.getDetailView(FS.Common.TabNames.IoTCommand_GeneralTab);
        var dialogSetup = new MobileCRM.UI.DetailViewItems.LookupSetup();

        if (asset) {
            var fetch = FS.IoTCommand.getFetchOfGetDevicesFromAsset(asset.id);
            fetch.serializeToXml(function (fetchXMLStr) {
                dialogSetup.addFilter(FS.Schema.IoTDevice.name, fetchXMLStr);
                var dialogOnly = false; // Allow both inline lookup and expanded lookup dialog
                dv.updateLinkItemViews(dv.getItemIndex(FS.Schema.IoTDeviceCommand.properties.msdyn_device), dialogSetup, null, dialogOnly);

                // Default the device field.
                FS.IoTCommand.setDeviceField(reset, entityForm, fetch);
            }, FS.Utils.showParsedError, null);
        } else {
            dialogSetup.addView(FS.Schema.IoTDevice.name, FS.Common.LookupViewNames.defaultIoTDevice, true);
            var dialogOnly = false; // Allow both inline lookup and expanded lookup dialog
            dv.updateLinkItemViews(dv.getItemIndex(FS.Schema.IoTDeviceCommand.properties.msdyn_device), dialogSetup, null, dialogOnly);
        }
    },

    // Default the device field from asset.
    setDeviceField: function (reset, entityForm, fetch) {
        var entity = entityForm && entityForm.entity;
        var device = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device];
        var asset = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset];
        // If reset is requested or if device is not already set.
        if (reset || !device) {
            if (asset) {
                fetch.execute(
                    "Array",
                    function (devices) {
                        if (devices && devices.length > 0) {
                            var deviceAlreadySet = false;
                            var deviceId;

                            if (device) {
                                // Find if the device already set is a valid device for the selected asset.
                                for (var i = 0; i < devices.length; i++) {
                                    deviceId = devices[i][0]; // id is at index 0 based on the fetchXML
                                    if (deviceId === device.id) {
                                        deviceAlreadySet = true;
                                        break;
                                    }
                                }
                            } else {
                                deviceId = devices[0][0];
                            }

                            // Overwrite the device field if needed.
                            if (!deviceAlreadySet) {
                                MobileCRM.DynamicEntity.loadById(FS.Schema.IoTDevice.name, deviceId, function (retrievedDevice) {
                                    if (retrievedDevice) {
                                        MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                            if (entityForm2 && entityForm2.entity && entityForm2.entity.properties) {
                                                entityForm2.entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device] = retrievedDevice;
                                                entityForm2.entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_deviceId] = null;
                                                FS.Utils.setCommandName(entityForm2.entity);
                                                FS.IoTCommand.setCommandLookup(entityForm2);
                                            }
                                        }, FS.Utils.showParsedError, null);
                                    }
                                }, FS.Utils.showParsedError, null);
                            }
                        }
                    },
                    FS.Utils.showParsedError,
                    null
                );
            }
        }
    },

    // Set the filter on command's lookup according to selected device.
    setCommandLookup: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        var device = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device];

        // Create new command lookup view.
        var dv = entityForm.getDetailView(FS.Common.TabNames.IoTCommand_GeneralTab);
        var dialogSetup = new MobileCRM.UI.DetailViewItems.LookupSetup();

        if (device) {
            var fetch = FS.IoTCommand.getFetchOfGetCommandsFromDevice(device.id);
            fetch.serializeToXml(function (fetchXMLStr) {
                dialogSetup.addFilter(FS.Schema.IoTDeviceCommandDefinition.name, fetchXMLStr);
                var dialogOnly = false; // Allow both inline lookup and expanded lookup dialog
                dv.updateLinkItemViews(dv.getItemIndex(FS.Schema.IoTDeviceCommand.properties.msdyn_command), dialogSetup, null, dialogOnly);

                // Default the command field.
                FS.IoTCommand.setCommandField(entityForm, fetch);
            }, FS.Utils.showParsedError, null);
        } else {
            dialogSetup.addView(FS.Schema.IoTDeviceCommandDefinition.name, FS.Common.LookupViewNames.defaultIoTDeviceCommandDefinition, true);
            var dialogOnly = false; // Allow both inline lookup and expanded lookup dialog
            dv.updateLinkItemViews(dv.getItemIndex(FS.Schema.IoTDeviceCommand.properties.msdyn_command), dialogSetup, null, dialogOnly);
        }
    },

    // Default the command field from device.
    setCommandField: function (entityForm, fetch) {
        var entity = entityForm && entityForm.entity;
        var device = entity && entity.properties && entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device];
        if (device) {
            fetch.execute(
                "Array",
                function (commands) {
                    if (commands && commands.length > 0) {
                        MobileCRM.DynamicEntity.loadById(FS.Schema.IoTDeviceCommandDefinition.name, commands[0][0], function (retrievedCommand) {
                            if (retrievedCommand) {
                                MobileCRM.UI.EntityForm.requestObject(function (entityForm2) {
                                    if (entityForm2 && entityForm2.entity && entityForm2.entity.properties) {
                                        entityForm2.entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] = retrievedCommand;
                                        FS.Utils.setCommandName(entityForm2.entity);
                                    }
                                }, FS.Utils.showParsedError, null);
                            }
                        }, FS.Utils.showParsedError, null);
                    }
                },
                FS.Utils.showParsedError,
                null
            );
        }
    },

    getFetchOfGetDevicesFromAsset: function (assetId) {
        var iotDeviceAttributes = [
            FS.Schema.IoTDevice.properties.msdyn_iotDeviceId,
            FS.Schema.IoTDevice.properties.msdyn_name,
            FS.Schema.IoTDevice.properties.createdon
        ];
        var connectionAttributes = [
            FS.Schema.Connection.properties.record1id,
            FS.Schema.Connection.properties.record2id,
            FS.Schema.Connection.properties.record2roleid
        ];
        return FS.Utils.getFetchOfGetDevicesFromAsset(assetId, iotDeviceAttributes, connectionAttributes);
    },

    getFetchOfGetAssetsFromDevice: function (deviceId) {
        var assets = new MobileCRM.FetchXml.Entity(FS.Schema.CustomerAsset.name);
        assets.addAttribute(FS.Schema.CustomerAsset.properties.msdyn_customerAssetId);
        assets.addAttribute(FS.Schema.CustomerAsset.properties.msdyn_name);

        var connection = assets.addLink(FS.Schema.Connection.name, FS.Schema.Connection.properties.record1id, FS.Schema.CustomerAsset.properties.msdyn_customerAssetId, FS.Common.JoinType.inner);
        connection.addAttribute(FS.Schema.Connection.properties.record1id);
        connection.addAttribute(FS.Schema.Connection.properties.record2id);
        connection.addAttribute(FS.Schema.Connection.properties.record2roleid);

        connection.filter = new MobileCRM.FetchXml.Filter();
        connection.filter.where(FS.Schema.Connection.properties.record2id, "eq", deviceId);
        connection.filter.where(FS.Schema.Connection.properties.record2roleid, "eq", FS.Common.ConnectedDeviceRoleId);

        return new MobileCRM.FetchXml.Fetch(assets);
    },

    getFetchOfGetCommandsFromDevice: function (deviceId) {
        var commands = new MobileCRM.FetchXml.Entity(FS.Schema.IoTDeviceCommandDefinition.name);
        commands.addAttribute(FS.Schema.IoTDeviceCommandDefinition.properties.msdyn_iotdevicecommanddefinitionid);
        commands.addAttribute(FS.Schema.IoTDeviceCommandDefinition.properties.msdyn_name);
        commands.addAttribute(FS.Schema.IoTDeviceCommandDefinition.properties.createdon);

        var devicecategorycommands = commands.addLink(FS.Schema.IoTDeviceCategoryCommands.name, FS.Schema.IoTDeviceCategoryCommands.properties.msdyn_iotdevicecommanddefinitionid, FS.Schema.IoTDeviceCommandDefinition.properties.msdyn_iotdevicecommanddefinitionid, FS.Common.JoinType.inner);
        devicecategorycommands.addAttribute(FS.Schema.IoTDeviceCategoryCommands.properties.msdyn_iotdevicecategoryid);

        var devices = devicecategorycommands.addLink(FS.Schema.IoTDevice.name, FS.Schema.IoTDevice.properties.msdyn_category, FS.Schema.IoTDeviceCategoryCommands.properties.msdyn_iotdevicecategoryid, FS.Common.JoinType.inner);
        devices.addAttribute(FS.Schema.IoTDevice.properties.msdyn_iotDeviceId);
        devices.addAttribute(FS.Schema.IoTDevice.properties.msdyn_category);

        devices.filter = new MobileCRM.FetchXml.Filter();
        devices.filter.where(FS.Schema.IoTDevice.properties.msdyn_iotDeviceId, "eq", deviceId);

        return new MobileCRM.FetchXml.Fetch(commands);
    },

    handleSave: function (entityForm) {
        var saveHandler = entityForm.suspendSave();

        var entity = entityForm && entityForm.entity;
        if (entity && entity.properties) {
            var commandProperty = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command];
            var messageProperty = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_message];
            var isMessageSet = messageProperty && messageProperty.trim().length > 0;
            if (commandProperty || isMessageSet) {
                FS.Common.messageBox(
                    FS.IoTCommand.localization.get("Alert.SaveCommandConfirmation"),
                    [FS.IoTCommand.localization.get("Cmd.Yes"), FS.IoTCommand.localization.get("Cmd.No")],
                    function (button) {
                        if (button === FS.IoTCommand.localization.get("Cmd.Yes")) {
                            FS.Utils.checkNetwork(function () {
                                entity.save(function (err) {
                                    if (err === null) {
                                        saveHandler.resumeSave(FS.Common.SaveHandlerResumeSaveNoMessage);
                                        entityForm.cancelValidation();
                                        MobileCRM.UI.EntityForm.closeWithoutSaving();
                                    } else {
                                        saveHandler.resumeSave(err);
                                    }
                                }, true);
                            }, function () {
                                saveHandler.resumeSave(FS.IoTCommand.localization.get("Msg.InternetConnectionRequiredToUseIoTCommands"));
                            });
                        } else {
                            // Cancel the save operation without showing an error
                            saveHandler.resumeSave(FS.Common.SaveHandlerResumeSaveNoMessage);
                        }
                    }
                );
            }
            else {
                var message = FS.IoTCommand.localization.get("Alert.CommandAndMessageMustNotBothEmpty");
                saveHandler.resumeSave(message);
            }
        }
        else {
            saveHandler.resumeSave(FS.Common.SaveHandlerResumeSaveNoMessage);
        }
    },

    storeLocalization: function (localization) {
        FS.IoTCommand.localization = localization;
    }
};