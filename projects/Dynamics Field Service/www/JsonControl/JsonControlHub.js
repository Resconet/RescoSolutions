/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Common.js" />
/// <reference path="JsonControlRenderer.js" />
/// <reference path="MetadataControl.js" />

// JsonControl Hub
var FS = FS || {};

FS.JsonControlHub = {
    localization: null,

    ///<summary>
    /// Root div container fo fields using Json control:
    /// key is field name
    /// value is div name of the filed which uses Json control, namely div id
    ///</summary>
    divNames: {
        msdyn_devicereportedproperties: "msdyn_devicereportedproperties_div",
        msdyn_devicesettings: "msdyn_devicesettings_div",
        msdyn_tags: "msdyn_tags_div",
        msdyn_message: "msdyn_message_div",
        msdyn_alertdata: "msdyn_alertdata_div"
    },

    ///<summary>
    /// When retrieving metadata failed due to no internet connection, switch back to the previous cached value
    /// key is name of the field which uses Json control and needs to retrieve metadata
    /// value is cached field value
    ///</summary>
    cachedFieldValues: {
        [FS.Schema.IoTDeviceCommand.properties.msdyn_command]: null,
        [FS.Schema.IoTDevice.properties.msdyn_category]: null
    },

    ///<summary>
    /// A pool contains all Json control renders: 
    /// key is div name of the filed which uses Json control
    /// value is its corresponading JsonControlRender object
    ///</summary>
    controlRendererPool: {},

    ///<summary>
    /// A pool contains all json controls: 
    /// key is the field name which uses Json control
    /// value is IFrame functions: onLoad, handleChange, handleSave
    /// Note: If there are new fields that will use Json control, add them to the pool.
    ///</summary>
    bootPool: {
        // Alert Data Json control
        [FS.Schema.IoTAlert.properties.msdyn_alertdata]: {
            onLoad: function () {
                MobileCRM.Localization.initialize(function (localization) {
                    FS.JsonControlHub.localization = localization;

                    FS.JsonControlHub.createFieldTitleParagraghElement(document, FS.JsonControlHub.localization.get("msdyn_iotalert.msdyn_alertdata"), "center");
                    FS.JsonControlHub.createFieldDivContainer(document, FS.JsonControlHub.divNames.msdyn_alertdata);

                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var entity = entityForm && entityForm.entity;

                        var alertDataValue = entity.properties[FS.Schema.IoTAlert.properties.msdyn_alertdata];
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_alertdata] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTAlert.properties.msdyn_alertdata, FS.JsonControlHub.divNames.msdyn_alertdata, null, alertDataValue, true);
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_alertdata].renderControl();
                    });
                }, FS.Utils.showParsedError);
            }
        },

        // Command Message Json control
        [FS.Schema.IoTDeviceCommand.properties.msdyn_message]: {
            handleChange: function (entityForm) {
                var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
                var editedEntity = entityForm && entityForm.entity;

                function _reRenderCommandMessage(entity) {
                    if (entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] === undefined || entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] === null) {
                        var readonly = !entity.isNew;
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDeviceCommand.properties.msdyn_message, FS.JsonControlHub.divNames.msdyn_message, null, null, readonly);
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message].renderControl();
                        // Update the cache
                        FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDeviceCommand.properties.msdyn_command] = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command];
                    } else {
                        var params = {
                            IoTCommandDefinition: entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command]
                        };

                        FS.Utils.checkNetwork(function () {
                            MobileCRM.Services.Workflow.Action.execute("msdyn_GetIoTCommandMetadata", params, function (metadata) {
                                var readonly = !entity.isNew;
                                FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDeviceCommand.properties.msdyn_message, FS.JsonControlHub.divNames.msdyn_message, metadata["CommandMetadata"], null, readonly);
                                FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message].renderControl();
                                // Update the cache
                                FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDeviceCommand.properties.msdyn_command] = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command];
                            }, function (err) {
                                FS.JsonControlHub.switchBackToCacheValue(FS.Schema.IoTDeviceCommand.properties.msdyn_command);
                                FS.Utils.showParsedError(err);
                            }, null);
                        }, function () {
                            // No network
                            FS.JsonControlHub.switchBackToCacheValue(FS.Schema.IoTDeviceCommand.properties.msdyn_command);
                            var noNetworkMessage = FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseIoTCommands");
                            FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_message, noNetworkMessage);
                            MobileCRM.bridge.alert(noNetworkMessage);
                        });

                    }
                }

                switch (changedItem) {
                    case FS.Schema.IoTDeviceCommand.properties.msdyn_command:
                        // When command definition changes, reset the message
                        editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_message] = null;
                        _reRenderCommandMessage(editedEntity);
                        break;
                    case FS.Schema.IoTDeviceCommand.properties.msdyn_device:
                        // When device changes, reset the message
                        editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] = null;
                        editedEntity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_message] = null;
                        _reRenderCommandMessage(editedEntity);
                        break;
                    default:
                        break;
                }
            },

            handleSave: function (entityForm) {
                var entity = entityForm && entityForm.entity;
                entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_message] = FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message].getJsonForTransfer();
                return true;
            },

            onLoad: function () {
                MobileCRM.Localization.initialize(function (localization) {
                    FS.JsonControlHub.localization = localization;

                    FS.JsonControlHub.createFieldTitleParagraghElement(document, FS.JsonControlHub.localization.get("msdyn_iotdevicecommand.msdyn_message"), "center");
                    FS.JsonControlHub.createFieldDivContainer(document, FS.JsonControlHub.divNames.msdyn_message);

                    MobileCRM.UI.EntityForm.onChange(FS.JsonControlHub.bootPool[FS.Schema.IoTDeviceCommand.properties.msdyn_message].handleChange, true, null);
                    MobileCRM.UI.EntityForm.onSave(FS.JsonControlHub.bootPool[FS.Schema.IoTDeviceCommand.properties.msdyn_message].handleSave, true, null);

                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var entity = entityForm && entityForm.entity;
                        // Cache initial command value
                        FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDeviceCommand.properties.msdyn_command] = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] === undefined ? null : entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command];

                        var messageValue = entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_message];
                        if (entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] === null || entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command] === undefined) {
                            var readonly = !entity.isNew;
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDeviceCommand.properties.msdyn_message, FS.JsonControlHub.divNames.msdyn_message, null, messageValue, readonly);
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message].renderControl();
                        } else {
                            var params = {
                                IoTCommandDefinition: entity.properties[FS.Schema.IoTDeviceCommand.properties.msdyn_command]
                            };

                            FS.Utils.checkNetwork(function () {
                                MobileCRM.Services.Workflow.Action.execute("msdyn_GetIoTCommandMetadata", params, function (metadata) {
                                    var readonly = !entity.isNew;
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDeviceCommand.properties.msdyn_message, FS.JsonControlHub.divNames.msdyn_message, metadata["CommandMetadata"], messageValue, readonly);
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_message].renderControl();
                                }, FS.Utils.showParsedError, null);
                            }, function () {
                                // No network
                                var noNetworkMessage = FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseIoTCommands");
                                FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_message, noNetworkMessage);
                                MobileCRM.bridge.alert(noNetworkMessage);
                            });
                        }
                    });
                }, FS.Utils.showParsedError);
            }
        },

        // Device Reported Properties Json control
        [FS.Schema.IoTDevice.properties.msdyn_devicereportedproperties]: {
            onLoad: function () {
                MobileCRM.Localization.initialize(function (localization) {
                    FS.JsonControlHub.localization = localization;

                    FS.JsonControlHub.createFieldTitleParagraghElement(document, FS.JsonControlHub.localization.get("msdyn_iotdevice.msdyn_devicereportedproperties"), "center");
                    FS.JsonControlHub.createFieldDivContainer(document, FS.JsonControlHub.divNames.msdyn_devicereportedproperties);

                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var entity = entityForm && entityForm.entity;

                        var deviceReportedPropertiesValue = entity.properties[FS.Schema.IoTDevice.properties.msdyn_devicereportedproperties];
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicereportedproperties] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_devicereportedproperties, FS.JsonControlHub.divNames.msdyn_devicereportedproperties, null, deviceReportedPropertiesValue, true);
                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicereportedproperties].renderControl();
                    });
                }, FS.Utils.showParsedError);
            }
        },

        // Device Settings Json control
        [FS.Schema.IoTDevice.properties.msdyn_devicesettings]: {
            handleChange: function (entityForm) {
                var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
                var editedEntity = entityForm && entityForm.entity;

                switch (changedItem) {
                    case FS.Schema.IoTDevice.properties.msdyn_category:
                        // When device category changes, reset device settings and tags
                        editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_devicesettings] = null;
                        editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_tags] = null;

                        if (editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_category] === undefined || editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_category] === null) {
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_devicesettings, FS.JsonControlHub.divNames.msdyn_devicesettings, null);
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings].renderControl();

                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_tags, FS.JsonControlHub.divNames.msdyn_tags, null);
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags].renderControl();
                            // Update the cache
                            FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDevice.properties.msdyn_category] = editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_category];
                        } else {
                            var params = {
                                DeviceCategory: editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_category]
                            };

                            FS.Utils.checkNetwork(function () {
                                MobileCRM.Services.Workflow.Action.execute("msdyn_IoTGetEditablePropertiesMetadata", params, function (settingsMetadata) {
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_devicesettings, FS.JsonControlHub.divNames.msdyn_devicesettings, settingsMetadata["Metadata"]);
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings].renderControl();

                                    MobileCRM.Services.Workflow.Action.execute("msdyn_IoTGetTagsMetadata", params, function (tagsMetadata) {
                                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_tags, FS.JsonControlHub.divNames.msdyn_tags, tagsMetadata["Metadata"]);
                                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags].renderControl();

                                        // Update the cache
                                        FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDevice.properties.msdyn_category] = editedEntity.properties[FS.Schema.IoTDevice.properties.msdyn_category];
                                    }, function (err) {
                                        FS.JsonControlHub.switchBackToCacheValue(FS.Schema.IoTDevice.properties.msdyn_category);
                                        FS.Utils.showParsedError(err);
                                    }, null);
                                }, function (err) {
                                    FS.JsonControlHub.switchBackToCacheValue(FS.Schema.IoTDevice.properties.msdyn_category);
                                    FS.Utils.showParsedError(err);
                                }, null);
                            }, function () {
                                // No network
                                FS.JsonControlHub.switchBackToCacheValue(FS.Schema.IoTDevice.properties.msdyn_category);
                                var noNetworkMessage = FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseDeviceSettings");
                                FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_devicesettings, noNetworkMessage);
                                MobileCRM.bridge.alert(noNetworkMessage);
                                FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_tags, FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseDeviceTags"));
                            });
                        }
                        break;
                    default:
                        break;
                }
            },

            handleSave: function (entityForm) {
                var entity = entityForm && entityForm.entity;
                entity.properties[FS.Schema.IoTDevice.properties.msdyn_devicesettings] = FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings].getJsonForTransfer();
                entity.properties[FS.Schema.IoTDevice.properties.msdyn_tags] = FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags].getJsonForTransfer();
                return true;
            },

            onLoad: function () {
                MobileCRM.Localization.initialize(function (localization) {
                    FS.JsonControlHub.localization = localization;

                    FS.JsonControlHub.createFieldTitleParagraghElement(document, FS.JsonControlHub.localization.get("msdyn_iotdevice.msdyn_devicesettings"), "left");
                    FS.JsonControlHub.createFieldDivContainer(document, FS.JsonControlHub.divNames.msdyn_devicesettings);

                    var hr = document.createElement('hr');
                    hr.style.opacity = 0.3;
                    hr.style.marginLeft = "2%";
                    document.getElementsByTagName('body')[0].appendChild(hr);

                    FS.JsonControlHub.createFieldTitleParagraghElement(document, FS.JsonControlHub.localization.get("msdyn_iotdevice.msdyn_tags"), "left");
                    FS.JsonControlHub.createFieldDivContainer(document, FS.JsonControlHub.divNames.msdyn_tags);

                    MobileCRM.UI.EntityForm.onChange(FS.JsonControlHub.bootPool[FS.Schema.IoTDevice.properties.msdyn_devicesettings].handleChange, true, null);
                    MobileCRM.UI.EntityForm.onSave(FS.JsonControlHub.bootPool[FS.Schema.IoTDevice.properties.msdyn_devicesettings].handleSave, true, null);

                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var entity = entityForm && entityForm.entity;
                        // Cache initial device category
                        FS.JsonControlHub.cachedFieldValues[FS.Schema.IoTDevice.properties.msdyn_category] = entity.properties[FS.Schema.IoTDevice.properties.msdyn_category] === undefined ? null : entity.properties[FS.Schema.IoTDevice.properties.msdyn_category];

                        var deviceSettingsValue = entity.properties[FS.Schema.IoTDevice.properties.msdyn_devicesettings];
                        var tagsValue = entity.properties[FS.Schema.IoTDevice.properties.msdyn_tags];
                        if (entity.properties[FS.Schema.IoTDevice.properties.msdyn_category] === null || entity.properties[FS.Schema.IoTDevice.properties.msdyn_category] === undefined) {
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_devicesettings, FS.JsonControlHub.divNames.msdyn_devicesettings, null, deviceSettingsValue);
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings].renderControl();
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_tags, FS.JsonControlHub.divNames.msdyn_tags, null, tagsValue);
                            FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags].renderControl();
                        } else {
                            var params = {
                                DeviceCategory: entity.properties[FS.Schema.IoTDevice.properties.msdyn_category]
                            };

                            FS.Utils.checkNetwork(function () {
                                MobileCRM.Services.Workflow.Action.execute("msdyn_IoTGetEditablePropertiesMetadata", params, function (metadata) {
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_devicesettings, FS.JsonControlHub.divNames.msdyn_devicesettings, metadata["Metadata"], deviceSettingsValue);
                                    FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_devicesettings].renderControl();

                                    MobileCRM.Services.Workflow.Action.execute("msdyn_IoTGetTagsMetadata", params, function (metadata) {
                                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags] = FS.JsonControlHub.getControlRenderer(FS.Schema.IoTDevice.properties.msdyn_tags, FS.JsonControlHub.divNames.msdyn_tags, metadata["Metadata"], tagsValue);
                                        FS.JsonControlHub.controlRendererPool[FS.JsonControlHub.divNames.msdyn_tags].renderControl();
                                    }, FS.Utils.showParsedError, null);
                                }, FS.Utils.showParsedError, null);
                            }, function () {
                                // No network
                                var noNetworkMessage = FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseDeviceSettings");
                                FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_devicesettings, noNetworkMessage);
                                FS.JsonControlHub.showRightMessageWhenFailingToRetrieveMetadata(FS.JsonControlHub.divNames.msdyn_tags, FS.JsonControlHub.localization.get("Msg.InternetConnectionRequiredToUseDeviceTags"));
                                MobileCRM.bridge.alert(noNetworkMessage);
                            });
                        }
                    });
                }, FS.Utils.showParsedError);
            }
        }
    },

    getControlRenderer: function (fieldName, divName, metadataJsonStr, rawJsonStr = null, readonly = false) {
        var metadataControl = new MscrmControls.Metadata.MetadataControl();
        metadataControl.init({}, function () { });

        var raw = null;
        if (rawJsonStr === null) {
            if (metadataJsonStr === null) {
                // Show an empty textbox instead of showing nothing when there is no metadata and no field value 
                raw = '{}';
            } else {
                // Transform the type description object into null and put this json as ObjectData. Otherwise, the ObjectData in renders won't work.
                raw = JSON.stringify(FS.JsonControlHub.getRawJsonFromMetadataJson(JSON.parse(metadataJsonStr)));
            }
        } else {
            // Take it if the field already has a json value
            raw = rawJsonStr;
        }

        var controlContext = {
            mode: {
                isControlDisabled: false
            },
            parameters: {
                value: {
                    raw: raw,
                    attributes: {
                        DisplayName: "Message"
                    }
                },
                SwitchToViewJSON: {
                    raw: "yes"
                }
            },
            accessibility: {
                getUniqueId: function (baseId) {
                    return uuid() + "-" + baseId;
                }
            },
            factory: {
                createElement: function (type, containerProps, children) {
                    var element = {};
                    element.children = children ? children : [];
                    element._type = type;
                    element.componentId = containerProps.id;
                    element._properties = containerProps;
                    return element;
                },
                createComponent: function (type, containerProps, editorRender) {
                    var component = {};
                    component._type = type;
                    var props = component._properties = {};

                    if (type === "LABEL") {
                        component._children = containerProps;
                        props.forElement = "";
                        props.key = containerProps;
                        props.style = {
                            padding: "1px 6px",
                            "margin-top": "3px"
                        };
                    } else {
                        component._children = [];
                        props.descriptor = editorRender.descriptor;
                        props.parameters = editorRender.parameters;
                    }

                    return component;
                }
            },
            resources: {
                getString: function (name) {
                    // Add localization to messages here
                    switch (name) {
                        case "SwitchToDesignerView":
                            return "To Design";
                        case "MissingPropertiesError":
                            return "The following properties are missing: {0}";
                        case "UnrecognizedPropertiesError":
                            return "The following properties are not recognized: {0}";
                        case "ValidationErrors":
                            return "JSON data is invalid.";
                        case "InvalidTypeError":
                            return "Property: {0} is expected to be of type: {1}";
                        case "ValidationSuccess":
                            return "There are no validation errors.";
                        case "MaxLengthError":
                            return "Property: {0}'s max length is {1}";
                        case "MinValueError":
                            return "Property: {0}'s min value is {1}";
                        case "MaxValueError":
                            return "Property: {0}'s max value is {1}";
                        case "InvalidJSONError":
                            return "The following JSON data is invalid";
                        default:
                            return "No localization Message is found: " + name;
                    }
                }
            },
            theming: {
                measures: {
                    measure250: 250,
                    measure200: 200
                }
            }
        };

        if (metadataJsonStr !== null) {
            metadataControl._metadataProvider._metadataJson = metadataJsonStr;
        }

        return new JsonControlRenderer(metadataControl, controlContext, divName, fieldName, { view: 'Designer', readonly: readonly });
    },

    getRawJsonFromMetadataJson: function (metadataJson) {
        if (metadataJson !== Object(metadataJson)) {
            return metadataJson;
        }

        if (metadataJson.hasOwnProperty("Type") && metadataJson.hasOwnProperty("Editable") && metadataJson.hasOwnProperty("Visible")) {
            if (metadataJson.hasOwnProperty("Default")) {
                return metadataJson["Default"];
            } else {
                var type = metadataJson["Type"].toLowerCase();
                return type === "string" ? "" : (type === "boolean" ? false : null);
            }
        } else {
            for (var prop in metadataJson) {
                metadataJson[prop] = this.getRawJsonFromMetadataJson(metadataJson[prop]);
            }
            return metadataJson;
        }
    },

    createFieldTitleParagraghElement: function (document, title, align = "left") {
        var paraElement = document.createElement('p');
        paraElement.innerHTML = title;
        paraElement.className = 'title-paragraph';
        paraElement.align = align;
        document.getElementsByTagName('body')[0].appendChild(paraElement);
    },

    createFieldDivContainer: function (document, divId) {
        var div = document.createElement('div');
        div.id = divId;
        document.getElementsByTagName('body')[0].appendChild(div);
        document.body.style.backgroundColor = "transparent"; // Fix Windows black background bug
    },

    switchBackToCacheValue: function (fieldName) {
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm && entityForm.entity && entityForm.entity.properties) {
                entityForm.entity.properties[fieldName] = FS.JsonControlHub.cachedFieldValues[fieldName] === undefined ? null : FS.JsonControlHub.cachedFieldValues[fieldName];
            }
        }, FS.Utils.showParsedError, null);
    },

    showRightMessageWhenFailingToRetrieveMetadata: function (fieldDivName, errMessage) {
        var divContainer = document.getElementById(fieldDivName);
        divContainer.innerHTML = '';
        var paraElement = document.createElement('p');
        paraElement.classList.add('err-message');
        paraElement.innerHTML = errMessage;
        divContainer.appendChild(paraElement);
    }
};