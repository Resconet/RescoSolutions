var FS = FS || {};

FS.Utils = {
    formIsValidEndpoint: function (successCallback, failureCallback) {
        MobileCRM.Metadata.requestObject(
            function (metaData) {
                if (metaData && metaData.entities && metaData.entities[FS.Schema.ServiceEndpoint.name] && metaData.entities[FS.Schema.ServiceEndpoint.name].canRead()) {
                    // Taken from CFS Repo logic
                    var entity = new MobileCRM.FetchXml.Entity(FS.Schema.ServiceEndpoint.name);
                    entity.addAttribute(FS.Schema.ServiceEndpoint.properties.path);
                    var fetch = new MobileCRM.FetchXml.Fetch(entity);
                    fetch.execute(
                        "Array",  // Take the results as an array of arrays with field values
                        function (result) {
                            var isValid = result && result.length === 1 && result[0].length === 1 && result[0][0] !== null && result[0][0].trim().length > 0 && result[0][0] !== FS.Common.LegacyDefaultEndpointPath;
                            if (successCallback) {
                                successCallback(isValid);
                            }
                        },
                        function (err) {
                            if (failureCallback) {
                                failureCallback(err);
                            } else {
                                MobileCRM.bridge.alert(err);
                            }
                        },
                        null
                    );
                } else {
                    if (successCallback) {
                        successCallback(false);
                    }
                }
            }, MobileCRM.bridge.alert, null);
    },

    showParsedError: function (err) {
        try {
            var responseText;
            try {
                responseText = JSON.parse(err).responseText;
            } catch (e) {
                var startText = 'responseText:"';
                if (err.indexOf(startText) >= 0 && err.indexOf('",responseType') >= 0) {
                    responseText = err.substring(err.indexOf(startText) + startText.length, err.indexOf('",responseType'));
                } else {
                    responseText = err;
                }
            }
            MobileCRM.bridge.alert(responseText);
        }
        catch (e) {
            MobileCRM.bridge.alert(err);
        }
    },

    // Set the msdyn_name of IoT Device Command form
    setCommandName: function (entity) {
        if (entity.entityName === FS.Schema.IoTDeviceCommand.name) {
            var commandName = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] ? entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command].primaryName : "Command";
            if (entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_sendtoallconnecteddevices]) {
                var assetName = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset] ? " to " + entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_customerasset].primaryName : "";
                entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_name] = commandName + " sent" + assetName;
            } else {
                var deviceName = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device] ? " to " + entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_device].primaryName : "";
                entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_name] = commandName + " sent" + deviceName;
            }
        }
    },

    getFetchOfGetDevicesFromAsset: function (assetId, iotDeviceAttributes, connectionAttributes) {
        var ioTDevice = new MobileCRM.FetchXml.Entity(FS.Schema.IoTDevice.name);
        if (iotDeviceAttributes) {
            for (var i = 0; i < iotDeviceAttributes.length; i++) {
                ioTDevice.addAttribute(iotDeviceAttributes[i]);
            }
        }

        var connection = ioTDevice.addLink(FS.Schema.Connection.name, FS.Schema.Connection.properties.record2id, FS.Schema.IoTDevice.properties.msdyn_iotDeviceId, FS.Common.JoinType.inner);
        if (connectionAttributes) {
            for (var i = 0; i < connectionAttributes.length; i++) {
                connection.addAttribute(connectionAttributes[i]);
            }
        }

        connection.filter = new MobileCRM.FetchXml.Filter();
        connection.filter.where(FS.Schema.Connection.properties.record1id, "eq", assetId);
        connection.filter.where(FS.Schema.Connection.properties.record2roleid, "eq", FS.Common.ConnectedDeviceRoleId);

        return new MobileCRM.FetchXml.Fetch(ioTDevice);
    },

    checkNetwork: function (hasNetworkCallback, noNetworkCallback) {
        MobileCRM.isInternetConnected(
            function (result) {
                if (result && result.connected) {
                    if (hasNetworkCallback) {
                        hasNetworkCallback();
                    }
                } else {
                    console.log("No Internet now!");
                    if (noNetworkCallback) {
                        noNetworkCallback();
                    }
                }
            },
            FS.Utils.showParsedError, null);
    },

    // Hide the associated view tab whose 'Create New' permission matches input param 'tabHasCreateNewPermission'
    hideRightAssociatedView: function (entityForm, associatedEntityName, tabHasCreateNewPermission) {
        if (entityForm && entityForm.associatedViews) {
            for (var i = 0; i < entityForm.associatedViews.length; i++) {
                var associatedView = entityForm.associatedViews[i];
                if (associatedView && associatedView.entityName === associatedEntityName && associatedView.allowCreateNew === tabHasCreateNewPermission) {
                    associatedView.listView.isVisible = false;
                    return;
                }
            }
        }
    }
};
