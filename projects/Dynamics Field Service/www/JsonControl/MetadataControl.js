var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/**
 * This code was generated from a script.
 * Manual changes to this file will be overwritten if the code is regenerated.
 *
 * @license Copyright (c) Microsoft Corporation. All rights reserved.
 */
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="Typings/mscrm.d.ts" />
/// <reference path="Typings/mscrmcomponents.d.ts" />
/// <reference path="Typings/moment.d.ts" />
/// <reference path="Typings/mscommonlib.d.ts" />
/// <reference path="CommonReferences.ts" /> 
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="privatereferences.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        'use strict';
        var MetadataControl = (function () {
            /**
             * Empty constructor.
             */
            function MetadataControl() {
            }
            /**
             * This function should be used for any initial setup necessary for your control.
             * @params context The "Input Bag" containing the parameters and other control metadata.
             * @params notifyOutputchanged The method for this control to notify the framework that it has new outputs
             * @params state The user state for this control set from setState in the last session
             * @params container The div element to draw this control in
             */
            MetadataControl.prototype.init = function (context, notifyOutputChanged) {
                this._notifyOutputChanged = notifyOutputChanged;
                this._metadataProvider = new Metadata.MetadataProvider();
                this._editorManager = new Metadata.EditorManager();
            };
            /**
             * This function will recieve an "Input Bag" containing the values currently assigned to the parameters in your manifest
             * It will send down the latest values (static or dynamic) that are assigned as defined by the manifest & customization experience
             * as well as resource, client, and theming info (see mscrm.d.ts)
             * @params context The "Input Bag" as described above
             */
            MetadataControl.prototype.updateView = function (context) {
                return this.updateViewInternal(context);
            };
            MetadataControl.prototype.updateViewInternal = function (context) {
                if (this.isMetadataRetrievalRequired(context)) {
                    this._metadataProvider.initialize(context);
                    this._metadataProvider.retrieveJson().then(function (metadata) {
                        context.utils.requestRender();
                    }, function (errorMessage) {
                        console.log(errorMessage);
                    });
                }
                this._editorManager.initialize(context, this._metadataProvider.metadataJson, this.isControlDisabled(context), this._notifyOutputChanged);
                return this._editorManager.render();
            };
            MetadataControl.prototype.isMetadataRetrievalRequired = function (context) {
                return !this.isControlDisabled(context) &&
                    context &&
                    (
                    // If there is a change in the action's parameter, we need to retrieve the metadata again by calling the action.
                    (context.updatedProperties &&
                        context.updatedProperties.indexOf("ActionParam") >= 0)
                        ||
                            // Or if this is the first time the control is initialized and there is a valid action to call.
                            (context.parameters &&
                                context.parameters.ActionName &&
                                context.parameters.ActionName.raw != null &&
                                !this._metadataProvider.isInitialized()));
            };
            MetadataControl.prototype.isControlDisabled = function (context) {
                return context && context.mode.isControlDisabled;
            };
            /**
             * This function will return an "Output Bag" to the Crm Infrastructure
             * The ouputs will contain a value for each property marked as "input-output"/"bound" in your manifest
             * i.e. if your manifest has a property "value" that is an "input-output", and you want to set that to the local variable "myvalue" you should return:
             * {
             *		value: myvalue
             * };
             * @returns The "Output Bag" containing values to pass to the infrastructure
             */
            MetadataControl.prototype.getOutputs = function () {
                return { value: this._editorManager.valueJson };
            };
            /**
             * This function will be called when the control is destroyed
             * It should be used for cleanup and releasing any memory the control is using
             */
            MetadataControl.prototype.destroy = function () {
            };
            return MetadataControl;
        }());
        Metadata.MetadataControl = MetadataControl;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation. All rights reserved.
*/
/// <reference path="inputsoutputs.g.ts" />
/// <reference path="MetadataControl.ts" /> 
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var EditorFactory = (function () {
            function EditorFactory() {
            }
            EditorFactory.getEditor = function (propertyKey, value, metadata, isControlDisabled, context, updateCallback, parentId) {
                var property = EditorFactory.getProperty(value, metadata);
                var label = property.additionalProps.DisplayName ? property.additionalProps.DisplayName : propertyKey;
                property.additionalProps["propertyKey"] = propertyKey;//#region FieldService
                switch (property.type.toLowerCase()) {
                    case EditorFactory.TYPES.STRING:
                        if (moment(property.value, moment.ISO_8601, true).isValid()) {
                            return new Metadata.DateTimeEditor(new Date(property.value), "", label, property.additionalProps, isControlDisabled, context, updateCallback);
                        }
                        else {
                            return new Metadata.TextEditor(property.value, Metadata.TextEditor.TYPES.SINGLELINE, label, property.additionalProps, isControlDisabled, context, updateCallback);
                        }
                    case EditorFactory.TYPES.DATETIME:
                        var dateValue = property.value;
                        // If the value is in string format, convert to Date.
                        if (moment(property.value, moment.ISO_8601, true).isValid()) {
                            dateValue = new Date(property.value);
                        }
                        return new Metadata.DateTimeEditor(dateValue, "", label, property.additionalProps, isControlDisabled, context, updateCallback);
                    case EditorFactory.TYPES.NUMBER:
                    case EditorFactory.TYPES.INT:
                    case EditorFactory.TYPES.INT32:
                    case EditorFactory.TYPES.DOUBLE:
                        return new Metadata.NumberEditor(property.value, property.type.toLowerCase(), label, property.additionalProps, isControlDisabled, context, updateCallback);
                    case EditorFactory.TYPES.BOOLEAN:
                        return new Metadata.BooleanEditor(property.value, property.type.toLowerCase(), label, property.additionalProps, isControlDisabled, context, updateCallback);
                    case EditorFactory.TYPES.OBJECT:
                        // TODO: Handle arrays which are also objects. There could be other object types that are not really suitable for objecteditor.
                        if (property.value == null || EditorFactory.isObject(property.value)) {
                            return new Metadata.ObjectEditor(property.value, label, metadata, isControlDisabled, context, updateCallback, parentId);
                        }
                    default:
                        return new Metadata.TextEditor(JSON.stringify(property.value), Metadata.TextEditor.TYPES.MULTIPLE, label, property.additionalProps, isControlDisabled, context, updateCallback);
                }
            };
            EditorFactory.getProperty = function (value, metadata) {
                var property = {
                    value: value,
                    type: typeof (value),
                    additionalProps: {}
                };
                if (metadata) {
                    if (typeof (metadata) !== EditorFactory.TYPES.OBJECT) {
                        // No metadata provided. Instead a static value is provided which will overwrite the existing value and should not be changed.
                        property.value = metadata;
                        property.type = typeof (metadata);
                        property.additionalProps.Editable = false;
                    }
                    else {
                        var metadataLowerCaseKeys = EditorFactory.toLowerCaseKeys(metadata);
                        if (metadataLowerCaseKeys.type) {
                            if (!Metadata.Validator.validateType(value, metadataLowerCaseKeys)) {
                                // If the existing value is invalid for the given metadata, overwrite with the metadata's default value.
                                property.value = metadataLowerCaseKeys.hasOwnProperty("default") ? metadataLowerCaseKeys.default : null;
                            }
                            property.type = metadataLowerCaseKeys.type.toLowerCase();
                            EditorFactory.setAdditionalProperties(property, metadataLowerCaseKeys);
                        }
                        else {
                            // Metadata lacks type or its a nested property. Default to a null object if no object value is present.
                            if (typeof (value) !== EditorFactory.TYPES.OBJECT) {
                                property.value = null;
                                property.type = EditorFactory.TYPES.OBJECT;
                            }
                        }
                    }
                }
                return property;
            };
            EditorFactory.toLowerCaseKeys = function (obj) {
                return Object.keys(obj).reduce(function (accumulator, key) {
                    accumulator[key.toLowerCase()] = obj[key];
                    return accumulator;
                }, {});
            };
            EditorFactory.isNumberType = function (type) {
                return (type.toLowerCase() === EditorFactory.TYPES.NUMBER
                    || type.toLowerCase() === EditorFactory.TYPES.INT
                    || type.toLowerCase() === EditorFactory.TYPES.INT32
                    || type.toLowerCase() === EditorFactory.TYPES.DOUBLE);
            };
            EditorFactory.isObject = function (value) {
                return value && typeof (value) === 'object' && value.constructor === Object;
            };
            EditorFactory.isEmptyObject = function (value) {
                return Object.keys(value).length === 0 && value.constructor === Object;
            };
            EditorFactory.setAdditionalProperties = function (property, metadata) {
                // CCF does not handle the properties in a case agnostic way, so we need to remap the properties one by one.
                if (metadata.hasOwnProperty("default")) {
                    property.additionalProps.DefaultValue = metadata.default;
                }
                if (metadata.hasOwnProperty("editable")) {
                    property.additionalProps.Editable = metadata.editable;
                }
                if (metadata.hasOwnProperty("visible")) {
                    property.additionalProps.Visible = metadata.visible;
                }
                if (metadata.hasOwnProperty("precision")) {
                    property.additionalProps.Precision = metadata.precision;
                }
                if (metadata.hasOwnProperty("minvalue")) {
                    property.additionalProps.MinValue = metadata.minvalue;
                }
                if (metadata.hasOwnProperty("maxvalue")) {
                    property.additionalProps.MaxValue = metadata.maxvalue;
                }
                if (metadata.hasOwnProperty("maxlength")) {
                    property.additionalProps.MaxLength = metadata.maxlength;
                }
                if (metadata.hasOwnProperty("onlabel")) {
                    property.additionalProps.OnLabel = metadata.onlabel;
                }
                if (metadata.hasOwnProperty("offlabel")) {
                    property.additionalProps.OffLabel = metadata.offlabel;
                }
                if (metadata.hasOwnProperty("displayname")) {
                    property.additionalProps.DisplayName = metadata.displayname;
                }
            };
            return EditorFactory;
        }());
        EditorFactory.TYPES = {
            STRING: "string",
            NUMBER: "number",
            INT: "int",
            INT32: "int32",
            DOUBLE: "double",
            OBJECT: "object",
            BOOLEAN: "boolean",
            DATETIME: "datetime"
        };
        Metadata.EditorFactory = EditorFactory;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var EditorManager = (function () {
            function EditorManager() {
            }
            Object.defineProperty(EditorManager.prototype, "rootContainerProps", {
                get: function () {
                    var props = {
                        key: "MetadataControlContainer",
                        id: "MetadataControlContainer",
                        style: {
                            width: "95%",
                            flexDirection: "column"
                        }
                    };
                    return props;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(EditorManager.prototype, "valueJson", {
                get: function () {
                    return this._valueJson;
                },
                enumerable: true,
                configurable: true
            });
            EditorManager.prototype.initialize = function (context, metadataJson, isControlDisabled, notifyOutputChanged) {
                this._context = context;
                this._valueJson = context.parameters.value.raw;
                this._valueJsonObject = Metadata.OdataProvider.parseJSON(this.valueJson);
                if (this._metadataJson !== metadataJson) {
                    // Metadata changed, flush the saved state.
                    EditorManager.collapsedObjectIds = [];
                    EditorManager.textViewObjectIds = [];
                    EditorManager.errorViewObjectIds = [];
                }
                this._metadataJson = metadataJson;
                this._metadataJsonObject = Metadata.OdataProvider.parseJSON(this._metadataJson);
                this._isControlDisabled = isControlDisabled;
                this._notifyOutputChanged = notifyOutputChanged;
            };
            EditorManager.prototype.render = function () {
                var containerProps = this.rootContainerProps;
                containerProps["accessibilityLabel"] = this._context.parameters.value.attributes.DisplayName;
                if (this.isValueInvalid() && this._metadataJsonObject == null) {
                    // Value is not a valid json and there is no metadata.
                    // Default to textarea field. 
                    var textEditor = new Metadata.TextEditor(this.valueJson, Metadata.TextEditor.TYPES.MULTIPLE, null, null, this._isControlDisabled, this._context, this.updateHandler.bind(this));
                    return this._context.factory.createElement("CONTAINER", containerProps, textEditor.render());
                }
                else {
                    // The value is a valid json or metadata exists.
                    var objectEditor = new Metadata.ObjectEditor(this._valueJsonObject, null, this._metadataJsonObject, this._isControlDisabled, this._context, this.objectUpdateHandler.bind(this), "");
                    return this._context.factory.createElement("CONTAINER", containerProps, objectEditor.render());
                }
            };
            EditorManager.prototype.isValueInvalid = function () {
                return (this._valueJson != null && this._valueJsonObject == null);
            };
            EditorManager.prototype.objectUpdateHandler = function (value, isInitializing) {
                if (typeof (value) === Metadata.EditorFactory.TYPES.OBJECT) {
                    this._valueJsonObject = value;
                    value = JSON.stringify(this._valueJsonObject);
                }
                else {
                    // Value is invalid json string.
                    this._valueJsonObject = {};
                }
                this.updateHandler(value, isInitializing);
            };
            EditorManager.prototype.updateHandler = function (value, isInitializing) {
                if (this._valueJson !== value) {
                    this._valueJson = value;
                    if (!this._isControlDisabled) {
                        // Push updates only when the control is enabled.
                        this._notifyOutputChanged();
                    }
                }
            };
            return EditorManager;
        }());
        EditorManager.collapsedObjectIds = [];
        EditorManager.textViewObjectIds = [];
        EditorManager.errorViewObjectIds = [];
        Metadata.EditorManager = EditorManager;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var BaseEditor = (function () {
            function BaseEditor(value, type, label, props, isControlDisabled, context, updateCallback) {
                if (typeof (value) === "undefined") {
                    value = null;
                }
                if (value === null) {
                    if (props != null && props.hasOwnProperty("DefaultValue")) {
                        value = props.DefaultValue;
                    }
                }
                this._value = value;
                this._type = type;
                this._label = label;
                this._props = props;
                this._isControlDisabled = isControlDisabled;
                this._context = context;
                this._updateCallback = updateCallback;
                var baseId = this._label ? (props && props.hasOwnProperty("propertyKey") && props["propertyKey"] ? props["propertyKey"] : label) : "MetadataControlDefaultId";// FieldService
                this._descriptorDomId = "MetadataControl-" + baseId;
                this._componentId = this._context.accessibility.getUniqueId(baseId);
            }
            Object.defineProperty(BaseEditor.prototype, "value", {
                get: function () {
                    return this._value;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(BaseEditor.prototype, "label", {
                get: function () {
                    return this._label;
                },
                enumerable: true,
                configurable: true
            });
            BaseEditor.prototype.getAttributes = function () {
                return this._props;
            };
            BaseEditor.prototype.render = function () {
                // This will initialize the parent editor with the values.
                this._updateCallback(this.value, true);
                var components = [];
                if (!this.isFieldHidden()) {
                    components.push(this.renderLabel());
                    components.push(this.renderValue());
                }
                return components;
            };
            BaseEditor.prototype.renderLabel = function () {
                if (this.label == null) {
                    return null;
                }
                var controlId = this._descriptorDomId + "-" + this._componentId + "-" + this.getComponentExtension();
                return this._context.factory.createElement("LABEL", {
                    key: this.label,
                    forElementId: controlId,
                    style: {
                        "padding": "1px 6px",
                        "margin-top": "3px"
                    }
                }, this.label);
            };
            BaseEditor.prototype.isFieldDisabled = function () {
                return this._props && this._props.hasOwnProperty("Editable") && !this._props.Editable;
            };
            BaseEditor.prototype.isFieldHidden = function () {
                return this._props && this._props.hasOwnProperty("Visible") && !this._props.Visible;
            };
            BaseEditor.prototype.appendProps = function (props) {
                if (this._isControlDisabled || this.isFieldDisabled()) {
                    props.controlstates = {
                        isControlDisabled: true
                    };
                }
                props.descriptor = {
                    Id: this._context.accessibility.getUniqueId(this._descriptorDomId + "-Id"),
                    Name: this._context.accessibility.getUniqueId(this._descriptorDomId + "-Name"),
                    DomId: this._descriptorDomId,
                    Visible: true,
                    Disabled: (this._isControlDisabled || this.isFieldDisabled())
                };
            };
            return BaseEditor;
        }());
        Metadata.BaseEditor = BaseEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var BooleanEditor = (function (_super) {
            __extends(BooleanEditor, _super);
            function BooleanEditor(value, type, label, props, isControlDisabled, context, updateCallback) {
                var _this = _super.call(this, value, type, label, props, isControlDisabled, context, updateCallback) || this;
                // Defaults.
                _this._offLabel = "0";
                _this._onLabel = "1";
                _this._offLabel = _this._props.hasOwnProperty("OffLabel") ? _this._props.OffLabel : _this._offLabel;
                _this._onLabel = _this._props.hasOwnProperty("OnLabel") ? _this._props.OnLabel : _this._onLabel;
                return _this;
            }
            Object.defineProperty(BooleanEditor.prototype, "booleanContainerProps", {
                get: function () {
                    return {
                        key: this.label + "BooleanContainer",
                        id: this.label + "BooleanContainer",
                        accessibilityLabel: this.label,
                        style: {
                            margin: "1%"
                        }
                    };
                },
                enumerable: true,
                configurable: true
            });
            BooleanEditor.prototype.renderValue = function () {
                return this._context.factory.createElement("CONTAINER", this.booleanContainerProps, this._context.factory.createComponent(BooleanEditor.FlipSwitchControlType, this.label, this.getProps()));
            };
            BooleanEditor.prototype.getProps = function () {
                var _this = this;
                var props = {
                    parameters: {
                        "value": {
                            Usage: 3 /*PropertyUsage.FalseBound*/,
                            Static: true,
                            Callback: function (value) {
                                _this._updateCallback(value, false);
                            },
                            Primary: true,
                            Attributes: this.getAttributes(),
                            Value: this.value,
                            Type: "boolean"
                        }
                    }
                };
                this.appendProps(props);
                return props;
            };
            BooleanEditor.prototype.getAttributes = function () {
                var attributes = _super.prototype.getAttributes.call(this);
                attributes.Type = "boolean";
                attributes.DefaultValue = false;
                attributes.Options = [
                    {
                        "Label": this._offLabel,
                        "Value": 0
                    },
                    {
                        "Label": this._onLabel,
                        "Value": 1
                    }
                ];
                return attributes;
            };
            BooleanEditor.prototype.getComponentExtension = function () {
                // The accessibility label is set on the boolean container so component extension is not needed
                return "";
            };
            return BooleanEditor;
        }(Metadata.BaseEditor));
        BooleanEditor.FlipSwitchControlType = "MscrmControls.FlipSwitch.FlipSwitchControl";
        Metadata.BooleanEditor = BooleanEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var DateTimeEditor = (function (_super) {
            __extends(DateTimeEditor, _super);
            function DateTimeEditor(value, type, label, props, isControlDisabled, context, updateCallback) {
                return _super.call(this, value, type, label, props, isControlDisabled, context, updateCallback) || this;
            }
            DateTimeEditor.prototype.renderValue = function () {
                return this._context.factory.createComponent(DateTimeEditor.DateTimeControlType, this._componentId, this.getProps());
            };
            DateTimeEditor.prototype.getProps = function () {
                var _this = this;
                var props = {
                    parameters: {
                        "value": {
                            Usage: 3 /*PropertyUsage.FalseBound*/,
                            Static: true,
                            Callback: function (value) {
                                _this._updateCallback(value, false);
                            },
                            Primary: true,
                            Attributes: this.getAttributes(),
                            Value: this.value,
                            Type: "DateAndTime.DateAndTime"
                        }
                    }
                };
                this.appendProps(props);
                return props;
            };
            DateTimeEditor.prototype.getAttributes = function () {
                var attributes = _super.prototype.getAttributes.call(this);
                attributes.Format = "datetime";
                attributes.Type = "datetime";
                attributes.Behavior = 1;
                return attributes;
            };
            DateTimeEditor.prototype.getComponentExtension = function () {
                return "date-time-input";
            };
            return DateTimeEditor;
        }(Metadata.BaseEditor));
        DateTimeEditor.DateTimeControlType = "MscrmControls.FieldControls.DateTimeControl";
        Metadata.DateTimeEditor = DateTimeEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var NumberEditor = (function (_super) {
            __extends(NumberEditor, _super);
            function NumberEditor(value, type, label, props, isControlDisabled, context, updateCallback) {
                var _this = _super.call(this, value, type, label, props, isControlDisabled, context, updateCallback) || this;
                // Defaults.
                _this._precision = 3;
                if (_this._props.hasOwnProperty("Precision") && _this._props.Precision != null) {
                    _this._precision = _this._props.Precision;
                }
                else if (_this.value != null) {
                    _this._precision = _this.findPrecision(_this.value);
                }
                return _this;
            }
            NumberEditor.prototype.renderValue = function () {
                return this._context.factory.createComponent(this.getControlType(), this._componentId, this.getProps());
            };
            NumberEditor.prototype.getProps = function () {
                var _this = this;
                var props = {
                    parameters: {
                        "value": {
                            Usage: 3 /*PropertyUsage.FalseBound*/,
                            Static: true,
                            Callback: function (value) {
                                if (isNaN(value)) {
                                    value = null;
                                }
                                // If value is a valid number, round the value to the configured precision.
                                value = _this.roundValue(value);
                                _this._updateCallback(value, false);
                            },
                            Primary: true,
                            Attributes: this.getAttributes(),
                            Value: this.value
                        }
                    }
                };
                this.appendProps(props);
                return props;
            };
            NumberEditor.prototype.getControlType = function () {
                switch (this._type) {
                    case Metadata.EditorFactory.TYPES.INT:
                    case Metadata.EditorFactory.TYPES.INT32:
                        return NumberEditor.WholeNumberControlType;
                    case Metadata.EditorFactory.TYPES.DOUBLE:
                    default:
                        return NumberEditor.DecimalNumberControlType;
                }
            };
            NumberEditor.prototype.getAttributes = function () {
                var attributes = _super.prototype.getAttributes.call(this);
                switch (this._type) {
                    case Metadata.EditorFactory.TYPES.INT:
                    case Metadata.EditorFactory.TYPES.INT32:
                        attributes.Type = "integer";
                        attributes.Format = "0";
                        break;
                    case Metadata.EditorFactory.TYPES.DOUBLE:
                    default:
                        attributes.Type = "decimal";
                        attributes.Precision = this._precision;
                }
                return attributes;
            };
            NumberEditor.prototype.getComponentExtension = function () {
                switch (this._type) {
                    case Metadata.EditorFactory.TYPES.INT:
                    case Metadata.EditorFactory.TYPES.INT32:
                        return "whole-number-text-input";
                    case Metadata.EditorFactory.TYPES.DOUBLE:
                    default:
                        return "decimal-number-text-input";
                }
            };
            NumberEditor.prototype.roundValue = function (value) {
                if (value == null) {
                    return null;
                }
                if (this._type === Metadata.EditorFactory.TYPES.INT || this._type === Metadata.EditorFactory.TYPES.INT32) {
                    return Math.round(value);
                }
                else {
                    var factor = Math.pow(10, this._precision);
                    var tempNumber = value * factor;
                    var roundedTempNumber = Math.round(tempNumber);
                    return roundedTempNumber / factor;
                }
            };
            NumberEditor.prototype.findPrecision = function (value) {
                if (!isFinite(value)) {
                    return 0;
                }
                var exp = 1, precision = 0;
                while (Math.round(value * exp) / exp != value) {
                    exp *= 10;
                    precision++;
                    if (precision >= NumberEditor.MAX_PRECISION) {
                        return NumberEditor.MAX_PRECISION;
                    }
                }
                return precision;
            };
            return NumberEditor;
        }(Metadata.BaseEditor));
        NumberEditor.FloatingPointControlType = "MscrmControls.FieldControls.FloatingPointNumberInput";
        NumberEditor.WholeNumberControlType = "MscrmControls.FieldControls.WholeNumberControl";
        NumberEditor.DecimalNumberControlType = "MscrmControls.FieldControls.DecimalNumberControl";
        NumberEditor.DurationControlType = "MscrmControls.FieldControls.DurationControl";
        NumberEditor.MAX_PRECISION = 15;
        Metadata.NumberEditor = NumberEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var ObjectEditor = (function (_super) {
            __extends(ObjectEditor, _super);
            function ObjectEditor(value, label, metadata, isControlDisabled, context, updateCallback, parentId) {
                var _this = _super.call(this, value, null, label, null, isControlDisabled, context, updateCallback) || this;
                _this._childEditors = [];
                _this._errors = [];
                _this._metadataJsonObject = metadata;
                _this._parentId = parentId;
                return _this;
            }
            Object.defineProperty(ObjectEditor.prototype, "objectContainerProps", {
                get: function () {
                    var props = {
                        key: this.label + "Container",
                        id: this.label + "Container",
                        style: {
                            margin: this.isRoot() ? "1% 0%" : "1% 3%",
                            flexDirection: "column"
                        }
                    };
                    return props;
                },
                enumerable: true,
                configurable: true
            });
            ObjectEditor.prototype.renderLabel = function () {
                // Initialize any errors now to render the error icon and message area in the label.
                this.initializeErrors();
                var labelRenderer = new Metadata.ObjectLabelRenderer(this.value, this.label, this.errors, this._context, this.fullyQualifiedId, this.isRoot(), this.isTextView(), this.isErrorViewOpen(), this.isCollapsed());
                return labelRenderer.render();
            };
            ObjectEditor.prototype.renderValue = function () {
                if (!this._value) {
                    this._value = {};
                }
                var childComponents = [];
                var containerProps = this.objectContainerProps;
                if (!this.isCollapsed()) {
                    if (!this.isTextView()) {
                        // If metadata is given, iterate over the properties in metadata object and construct editors using metadata and value.
                        // Otherwise, iterate over the value object and construct editors using only the value.
                        var targetObject = this._metadataJsonObject ? this._metadataJsonObject : this._value;
                        for (var property in targetObject) {
                            if (targetObject.hasOwnProperty(property)) {
                                this.buildChildEditors(property);
                            }
                        }
                    }
                    if (this._childEditors.length > 0) {
                        this._value = {}; // Remove the stale value object. The valid keys in the value (those that have a match in metadata) will be reconstructed when child editors initialize.
                        for (var i = 0; i < this._childEditors.length; i++) {
                            childComponents = childComponents.concat(this._childEditors[i].render());
                        }
                    }
                    else {
                        containerProps["accessibilityLabel"] = this.label ? this.label : this._context.parameters.value.attributes.DisplayName;
                        var textEditor = new Metadata.TextEditor(Metadata.EditorFactory.isEmptyObject(this._value) ? "" : JSON.stringify(this.value), Metadata.TextEditor.TYPES.MULTIPLE, null, null, this._isControlDisabled, this._context, this.updateHandler.bind(this, null));
                        childComponents = childComponents.concat(textEditor.render());
                    }
                }
                else {
                    // Collapsed.
                    this._updateCallback(this.value, true);
                }
                return this._context.factory.createElement("CONTAINER", containerProps, childComponents);
            };
            ObjectEditor.prototype.initializeErrors = function () {
                // Skip validation if the control is disabled.
                if (!this._isControlDisabled) {
                    var validator = new Metadata.Validator(this._context);
                    validator.validateJsonWithMetadata(this._value, this._metadataJsonObject);
                    this._errors = this.isTextView() ? validator.getErrors() : validator.getInvalidValueErrors(); // Get all errors if the control is in free form edit. If it is in designer view, there won't be missing or additional properties.
                }
            };
            Object.defineProperty(ObjectEditor.prototype, "errors", {
                get: function () {
                    return this._errors;
                },
                enumerable: true,
                configurable: true
            });
            ObjectEditor.prototype.getComponentExtension = function () {
                // Accessibility labels are set on the child editors so component extension for the object editor itself is not needed
                return "";
            };
            ObjectEditor.prototype.isRoot = function () {
                return this.label == null;
            };
            ObjectEditor.prototype.buildChildEditors = function (property) {
                var editor = Metadata.EditorFactory.getEditor(property, this._value[property], this._metadataJsonObject ? this._metadataJsonObject[property] : null, this._isControlDisabled, this._context, this.updateHandler.bind(this, property), this.fullyQualifiedId);
                this._childEditors = this._childEditors.concat(editor);
            };
            ObjectEditor.prototype.updateHandler = function (property, value, isInitializing) {
                var jsonValue = null;
                if (typeof (value) === Metadata.EditorFactory.TYPES.STRING && value.length > 0 && value[0] === "{") {
                    // If the string is a potential json, attempt to parse.
                    jsonValue = Metadata.OdataProvider.parseJSON(value);
                }
                if (property) {
                    this._value[property] = jsonValue != null ? jsonValue : value;
                }
                else {
                    // From text area editor.
                    this._value = jsonValue != null ? jsonValue : value;
                }
                this._updateCallback(this._value, isInitializing);
            };
            Object.defineProperty(ObjectEditor.prototype, "rootId", {
                get: function () {
                    if (this._context.parameters.value.attributes) {
                        return this._context.parameters.value.attributes.LogicalName + "Root";
                    }
                    else {
                        return "Root";
                    }
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ObjectEditor.prototype, "fullyQualifiedId", {
                get: function () {
                    return this.isRoot() ? this.rootId : this._parentId + "." + this.label;
                    // TODO: This may conflict with another property that has a period in its key? Come up with a workaround.
                },
                enumerable: true,
                configurable: true
            });
            ObjectEditor.prototype.isCollapsed = function () {
                return Metadata.EditorManager.collapsedObjectIds.indexOf(this.fullyQualifiedId) > -1;
            };
            ObjectEditor.prototype.isTextView = function () {
                return Metadata.EditorManager.textViewObjectIds.indexOf(this.fullyQualifiedId) > -1;
            };
            ObjectEditor.prototype.isErrorViewOpen = function () {
                return Metadata.EditorManager.errorViewObjectIds.indexOf(this.fullyQualifiedId) > -1;
            };
            return ObjectEditor;
        }(Metadata.BaseEditor));
        Metadata.ObjectEditor = ObjectEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var ObjectLabelRenderer = (function () {
            function ObjectLabelRenderer(value, label, errors, context, fullyQualifiedId, isRoot, isTextView, isErrorViewOpen, isCollapsed) {
                this._value = value;
                this._label = label;
                this._errors = errors != null ? errors : [];
                this._context = context;
                this._fullyQualifiedId = fullyQualifiedId;
                this._isRoot = isRoot;
                this._isTextView = isTextView;
                this._isErrorViewOpen = isErrorViewOpen;
                this._isCollapsed = isCollapsed;
            }
            ObjectLabelRenderer.prototype.render = function () {
                var headerComponents = [];
                // Root object header will have text view/designer view icon.
                // Other object headers will have the expand/collapse, property label and text/designer view icon.
                if (!this._isRoot) {
                    headerComponents.push(this.renderExpandCollapseIcon());
                    headerComponents.push(this.renderBaseLabelButton());
                }
                // Ensures that if SwitchToViewJSON has not been set or is true, button will display.
                if (this._context.parameters.SwitchToViewJSON.raw !== "no") {
                    headerComponents.push(this.renderTextDesignerIcon());
                }
                if (this.isErrorIconNeeded()) {
                    // If the json is being edited in free form, render an error icon or a validation success icon.
                    // If the object is in designer view, render an icon only if there are errors.
                    headerComponents.push(this.renderErrorIcon(this._errors.length > 0));
                }
                var mainHeaderComponent = this._context.factory.createElement("CONTAINER", {
                    key: this._label + "LabelContainer",
                    id: this._label + "LabelContainer",
                    style: {
                        "margin-top": "1px",
                        "margin-left": this._isRoot ? "" : "-2.0rem",
                        "border-width": "1px",
                        flexDirection: "row"
                    }
                }, headerComponents);
                if (this.isErrorIconNeeded() && this._isErrorViewOpen) {
                    return this.getHeaderAndErrorComponent(mainHeaderComponent, this._errors);
                }
                else {
                    return mainHeaderComponent;
                }
            };
            ObjectLabelRenderer.prototype.getHeaderAndErrorComponent = function (mainHeaderComponent, errors) {
                var headerAndErrorComponent = [];
                headerAndErrorComponent.push(mainHeaderComponent);
                for (var i in errors) {
                    var errorComponent = this._context.factory.createElement("CONTAINER", {
                        key: this._label + "ErrorContainer" + i,
                        style: {
                            color: "red",
                            backgroundColor: "rgba(234, 6, 0, 0.1)",
                            "margin-top": "2px",
                            "padding": "5px"
                        }
                    }, errors[i]);
                    headerAndErrorComponent.push(errorComponent);
                }
                if (errors.length <= 0) {
                    var errorComponent = this._context.factory.createElement("CONTAINER", {
                        key: this._label + "ErrorContainer",
                        style: {
                            color: "green",
                            backgroundColor: "rgba(6, 234, 0, 0.1)",
                            "margin-top": "2px",
                            "padding": "5px"
                        }
                    }, this._context.resources.getString("NoValidationErrors"));
                    headerAndErrorComponent.push(errorComponent);
                }
                return this._context.factory.createElement("CONTAINER", {
                    key: this._label + "HeaderContainer",
                    id: this._label + "HeaderContainer",
                    style: {
                        flexDirection: "column"
                    }
                }, headerAndErrorComponent);
            };
            ObjectLabelRenderer.prototype.isErrorIconNeeded = function () {
                return this._isTextView || this._errors.length > 0;
            };
            ObjectLabelRenderer.prototype.renderExpandCollapseIcon = function () {
                var expandCollapseIconId = "microsoftIcon_expandcollapse";
                var expandCollapseIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: this._label + expandCollapseIconId,
                    key: this._label + expandCollapseIconId,
                    tabIndex: -1,
                    type: this._isCollapsed ? 3 : 0 // 0 - expanded; 3 - collapsed.
                });
                var hoverColor = "transparent";
                var descriptorText = this._isCollapsed ? this._context.resources.getString("ExpandSection") : this._context.resources.getString("CollapseSection");
                var buttonProps = this.getButtonProps(this._label + "expandCollapseContainer", this.onExpandCollapseClick.bind(this), hoverColor, descriptorText);
                buttonProps.accessibilityLabel = descriptorText;
                return this.getButton(expandCollapseIcon, buttonProps);
            };
            ObjectLabelRenderer.prototype.renderBaseLabelButton = function () {
                var component = this._context.factory.createElement("CONTAINER", {
                    key: this._label,
                }, this._label);
                var descriptorText = this._isCollapsed ? this._context.resources.getString("ExpandSection") : this._context.resources.getString("CollapseSection");
                var buttonProps = this.getLabelButtonProps(this._label + "baseLabelButton", this.onExpandCollapseClick.bind(this), descriptorText);
                buttonProps.accessibilityLabel = descriptorText;
                return this.getButton(component, buttonProps);
            };
            ObjectLabelRenderer.prototype.renderTextDesignerIcon = function () {
                var textDesignerIconId = "microsoftIcon_textdesigner";
                var textDesignerIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: this._label + textDesignerIconId,
                    key: this._label + textDesignerIconId,
                    tabIndex: -1,
                    type: this._isTextView ? 56 : 110 // 4 - edit;  12 - ellipsis; 33 - details; 110 - switch process; 56 - backbutton; 180 - pencilIcon
                });
                var hoverColor = "rgb(226,226,226)";
                var descriptorText = this._isTextView ? this._context.resources.getString("SwitchToDesignerView") : this._context.resources.getString("SwitchToTextView");
                var buttonProps = this.getButtonProps(this._label + "textDesignerContainer", this.onTextDesignerClick.bind(this), hoverColor, descriptorText);
                buttonProps.accessibilityLabel = descriptorText;
                return this.getButton(textDesignerIcon, buttonProps);
            };
            ObjectLabelRenderer.prototype.renderErrorIcon = function (errorsFound) {
                var errorIconId = "microsoftIcon_error";
                var errorIcon = this._context.factory.createElement("MICROSOFTICON", {
                    id: this._label + errorIconId,
                    key: this._label + errorIconId,
                    tabIndex: -1,
                    type: errorsFound ? 9 : 25 // 179 - InformationIcon; 9 - close; 25 - checkmark.
                });
                var hoverColor = errorsFound ? "rgba(234, 6, 0, 0.1)" : "rgba(6, 234, 0, 0.1)";
                var descriptorText = this._context.resources.getString("ClickToSeeMoreDetails");
                var buttonProps = this.getButtonProps(this._label + "errorContainer", this.onErrorIconClick.bind(this), hoverColor, descriptorText);
                buttonProps.accessibilityLabel = errorsFound ? this._context.resources.getString("ValidationErrors") : this._context.resources.getString("NoValidationErrors");
                buttonProps.style.color = errorsFound ? "red" : "green";
                buttonProps.style.margin = "0px 2px";
                buttonProps.style.fontWeight = "bold";
                return this.getButton(errorIcon, buttonProps);
            };
            ObjectLabelRenderer.prototype.getButton = function (component, buttonProperties) {
                return this._context.factory.createElement("Button", buttonProperties, component);
            };
            ObjectLabelRenderer.prototype.getLabelButtonProps = function (buttonId, onClickHandler, descriptorText) {
                return {
                    id: buttonId,
                    className: buttonId,
                    onClick: onClickHandler,
                    tabIndex: -1,
                    title: descriptorText,
                    style: {
                        display: "flex",
                        backgroundColor: "transparent",
                        border: "transparent",
                        textAlign: "center",
                        fontSize: "14px",
                        cursor: "pointer",
                        fontFamily: "Segoe UI Semibold, SegoeUI-Semibold, Segoe UI Semibold, Segoe UI Regular, Segoe UI"
                    }
                };
            };
            ObjectLabelRenderer.prototype.getButtonProps = function (buttonId, onClickHandler, hoverColor, descriptorText) {
                var setHoverBackground = {
                    backgroundColor: hoverColor
                };
                return {
                    id: buttonId,
                    className: buttonId,
                    onClick: onClickHandler,
                    tabIndex: 0,
                    title: descriptorText,
                    style: {
                        height: this._context.theming.measures.measure250,
                        width: this._context.theming.measures.measure250,
                        "min-width": this._context.theming.measures.measure200,
                        lineHeight: this._context.theming.measures.measure200,
                        overflow: "hidden",
                        backgroundColor: "transparent",
                        border: "transparent",
                        color: "#000000",
                        textAlign: "center",
                        "fontWeight": "normal",
                        display: "table",
                        cursor: "pointer",
                        ":hover": setHoverBackground
                    }
                };
            };
            ObjectLabelRenderer.prototype.onExpandCollapseClick = function (event) {
                var _this = this;
                setTimeout(function () {
                    var index = Metadata.EditorManager.collapsedObjectIds.indexOf(_this._fullyQualifiedId);
                    index > -1 ? Metadata.EditorManager.collapsedObjectIds.splice(index, 1) : Metadata.EditorManager.collapsedObjectIds.push(_this._fullyQualifiedId);
                    _this._context.utils.requestRender();
                }, 50);
            };
            ObjectLabelRenderer.prototype.onTextDesignerClick = function (event) {
                var _this = this;
                setTimeout(function () {
                    var index = Metadata.EditorManager.textViewObjectIds.indexOf(_this._fullyQualifiedId);
                    index > -1 ? Metadata.EditorManager.textViewObjectIds.splice(index, 1) : Metadata.EditorManager.textViewObjectIds.push(_this._fullyQualifiedId);
                    _this._context.utils.requestRender();
                }, 50);
            };
            ObjectLabelRenderer.prototype.onErrorIconClick = function (event) {
                var _this = this;
                setTimeout(function () {
                    var index = Metadata.EditorManager.errorViewObjectIds.indexOf(_this._fullyQualifiedId);
                    index > -1 ? Metadata.EditorManager.errorViewObjectIds.splice(index, 1) : Metadata.EditorManager.errorViewObjectIds.push(_this._fullyQualifiedId);
                    _this._context.utils.requestRender();
                }, 50);
            };
            return ObjectLabelRenderer;
        }());
        Metadata.ObjectLabelRenderer = ObjectLabelRenderer;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var TextEditor = (function (_super) {
            __extends(TextEditor, _super);
            function TextEditor(value, type, label, props, isControlDisabled, context, updateCallback) {
                var _this = _super.call(this, value, type, label, props, isControlDisabled, context, updateCallback) || this;
                // Defaults.
                _this._maxLength = 8192;
                if (_this.value != null) {
                    _this._value = Metadata.EditorFactory.isObject(_this.value) ? JSON.stringify(_this.value) : _this.value.toString();
                }
                return _this;
            }
            TextEditor.prototype.renderValue = function () {
                return this._context.factory.createComponent(TextEditor.TextControlType, this._componentId, this.getProps());
            };
            TextEditor.prototype.getProps = function () {
                var _this = this;
                var props = {
                    parameters: {
                        "value": {
                            Usage: 3 /*PropertyUsage.FalseBound*/,
                            Static: true,
                            Callback: function (value) {
                                _this._updateCallback(value, false);
                            },
                            Primary: true,
                            Attributes: this.getAttributes(),
                            Value: this.value,
                            Type: this._type
                        }
                    }
                };
                this.appendProps(props);
                return props;
            };
            TextEditor.prototype.getAttributes = function () {
                var attributes = _super.prototype.getAttributes.call(this) || {};
                if (attributes.MaxLength == null) {
                    attributes.MaxLength = this._maxLength;
                }
                return attributes;
            };
            TextEditor.prototype.getComponentExtension = function () {
                return "text-box-text";
            };
            return TextEditor;
        }(Metadata.BaseEditor));
        TextEditor.TextControlType = "MscrmControls.FieldControls.TextBoxControl";
        TextEditor.TYPES = {
            SINGLELINE: "SingleLine.Text",
            MULTIPLE: "Multiple"
        };
        Metadata.TextEditor = TextEditor;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
/// <reference path="../privatereferences.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var Validator = (function () {
            function Validator(context) {
                this.init();
                this._context = context;
            }
            Validator.prototype.init = function () {
                this._missingProps = [];
                this._unrecognizedProps = [];
                this._invalidValueErrors = [];
            };
            Validator.prototype.validateJsonWithMetadata = function (valueJsonObject, metadataJsonObject, parentProperty) {
                if (parentProperty === void 0) { parentProperty = null; }
                if (metadataJsonObject != null) {
                    for (var property in metadataJsonObject) {
                        var fullyQualifiedPropertyName = parentProperty ? parentProperty + "." + property : property;
                        if (metadataJsonObject.hasOwnProperty(property)) {
                            if (valueJsonObject == null || !valueJsonObject.hasOwnProperty(property)) {
                                // Value missing for the metadata property.
                                this._missingProps.push(fullyQualifiedPropertyName);
                            }
                            else {
                                // Value exists. Check for type match.
                                if (typeof (metadataJsonObject[property]) === Metadata.EditorFactory.TYPES.OBJECT) {
                                    // Valid metadata is provided.
                                    var metadataLowerCaseKeys = Metadata.EditorFactory.toLowerCaseKeys(metadataJsonObject[property]);
                                    if (metadataLowerCaseKeys.type) {
                                        if (valueJsonObject[property] != null) {
                                            if (!Validator.validateType(valueJsonObject[property], metadataLowerCaseKeys)) {
                                                this._invalidValueErrors.push(MscrmCommon.ControlUtils.String.Format(this._context.resources.getString("InvalidTypeError"), fullyQualifiedPropertyName, metadataLowerCaseKeys.type));
                                            }
                                            else {
                                                // Type is valid. Do the range validations.
                                                var errors = Validator.validateRange(valueJsonObject[property], metadataLowerCaseKeys, fullyQualifiedPropertyName, this._context);
                                                this._invalidValueErrors = this._invalidValueErrors.concat(errors);
                                            }
                                        }
                                    }
                                    else {
                                        // Metadata lacks type. It could be a nested property. Validate recursively.
                                        this.validateJsonWithMetadata(valueJsonObject[property], metadataJsonObject[property], fullyQualifiedPropertyName);
                                    }
                                }
                            }
                        }
                    }
                    //#region FieldService
                    if (typeof valueJsonObject !== 'object') {
                        return;
                    }
                    //#endregion
                    for (var property in valueJsonObject) {
                        var fullyQualifiedPropertyName = parentProperty ? parentProperty + "." + property : property;
                        if (valueJsonObject.hasOwnProperty(property) && !metadataJsonObject.hasOwnProperty(property)) {
                            // Unknown property is present in the value that doesn't exist in metadata.
                            this._unrecognizedProps.push(fullyQualifiedPropertyName);
                        }
                    }
                }
            };
            Validator.validateType = function (value, metadata) {
                var isValid = true;
                if (metadata.type.toLowerCase() !== typeof (value)) {
                    // The type doesn't match directly with the metadata. 
                    // But it may still be valid for some cases:
                    // If the value is an iso date string and the metadata is a datetime type.
                    if ((metadata.type.toLowerCase() === Metadata.EditorFactory.TYPES.DATETIME && moment(value, moment.ISO_8601, true).isValid())
                        || (!isNaN(value) && typeof (value) != Metadata.EditorFactory.TYPES.BOOLEAN && Metadata.EditorFactory.isNumberType(metadata.type))
                        || (metadata.type.toLowerCase() === Metadata.EditorFactory.TYPES.BOOLEAN && (value == 1 || value == 0))
                        || (metadata.type.toLowerCase() === Metadata.EditorFactory.TYPES.STRING)) {
                        isValid = true;
                    }
                    else {
                        isValid = false;
                    }
                }
                // TODO: Retain invalid values (without saving) and flag errors?
                return isValid;
            };
            Validator.validateRange = function (value, metadata, fullyQualifiedPropertyName, context) {
                var errors = [];
                switch (metadata.type.toLowerCase()) {
                    case Metadata.EditorFactory.TYPES.STRING:
                        if (metadata.hasOwnProperty("maxlength") && metadata.maxlength != null && value.length > metadata.maxlength) {
                            errors.push(MscrmCommon.ControlUtils.String.Format(context.resources.getString("MaxLengthError"), fullyQualifiedPropertyName, metadata.maxlength));
                        }
                        break;
                    case Metadata.EditorFactory.TYPES.NUMBER:
                    case Metadata.EditorFactory.TYPES.INT:
                    case Metadata.EditorFactory.TYPES.INT32:
                    case Metadata.EditorFactory.TYPES.DOUBLE:
                    case Metadata.EditorFactory.TYPES.DATETIME:
                        if (metadata.hasOwnProperty("minvalue") && metadata.minvalue != null && value < metadata.minvalue) {
                            errors.push(MscrmCommon.ControlUtils.String.Format(context.resources.getString("MinValueError"), fullyQualifiedPropertyName, metadata.minvalue));
                        }
                        if (metadata.hasOwnProperty("maxvalue") && metadata.maxvalue != null && value > metadata.maxvalue) {
                            errors.push(MscrmCommon.ControlUtils.String.Format(context.resources.getString("MaxValueError"), fullyQualifiedPropertyName, metadata.maxvalue));
                        }
                        break;
                }
                return errors;
            };
            Validator.prototype.getErrors = function () {
                var errors = [];
                if (this._missingProps.length > 0) {
                    errors.push(MscrmCommon.ControlUtils.String.Format(this._context.resources.getString("MissingPropertiesError"), this._missingProps.join(", ")));
                }
                if (this._unrecognizedProps.length > 0) {
                    errors.push(MscrmCommon.ControlUtils.String.Format(this._context.resources.getString("UnrecognizedPropertiesError"), this._unrecognizedProps.join(", ")));
                }
                for (var i in this._invalidValueErrors) {
                    errors.push(this._invalidValueErrors[i]);
                }
                return errors;
            };
            Validator.prototype.getInvalidValueErrors = function () {
                var errors = [];
                for (var i in this._invalidValueErrors) {
                    errors.push(this._invalidValueErrors[i]);
                }
                return errors;
            };
            return Validator;
        }());
        Metadata.Validator = Validator;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../privatereferences.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var OdataProvider = (function () {
            function OdataProvider() {
            }
            // Executes a CRM Request
            // httpRequest = HTTP method. Ex. "GET" or "POST"
            // crmRequest = CRM request
            // E.g.: "msdyn_RegisterIoTDevice" for a global action. 
            // E.g.: "msdyn_iotalerts(B635DCB3-4F28-E611-8106-00155DBD6A1E)/Microsoft.Dynamics.CRM.msdyn_ParentIoTAlerts" for a bound action.
            // requestParams = List of arguments for the request contained in JSON object.
            // successCallback = Method to be called on success. Takes a string argument that contains the response of the query.
            // failureCallback = Method to be called on failure. Takes a string argument that contains the response of the query.
            OdataProvider.executeRequest = function (httpRequest, crmRequest, requestParams, successCallback, failureCallback) {
                var endpoint = this.odataEndpointUrl + crmRequest;
                var request = new XMLHttpRequest();
                request.open(httpRequest, endpoint, true);
                request.setRequestHeader("Accept", "application/json");
                request.setRequestHeader("Content-Type", "application/json; charset=utf-8");
                request.setRequestHeader("OData-MaxVersion", "4.0");
                request.setRequestHeader("OData-Version", "4.0");
                var _this = this;
                request.onreadystatechange = function () {
                    // https://msdn.microsoft.com/en-us/library/gg334279.aspx describes the values.
                    if (this.readyState == 4) {
                        request.onreadystatechange = null;
                        if (this.status == 204 || this.status == 200) {
                            if (successCallback) {
                                successCallback(_this.parseJSON(this.response));
                            }
                        }
                        else {
                            if (failureCallback) {
                                failureCallback(_this.parseJSON(this.response));
                            }
                        }
                    }
                };
                if (requestParams) {
                    request.send(JSON.stringify(requestParams));
                }
                else {
                    request.send();
                }
            };
            ;
            OdataProvider.parseJSON = function (json) {
                var result = null;
                if (json) {
                    try {
                        result = JSON.parse(json);
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
                return result;
            };
            ;
            return OdataProvider;
        }());
        OdataProvider.odataEndpointUrl = window.Xrm.Page.context.getClientUrl() + '/api/data/v8.1/';
        Metadata.OdataProvider = OdataProvider;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
/**
* @license Copyright (c) Microsoft Corporation.  All rights reserved.
*/
/// <reference path="../privatereferences.ts"/>
var MscrmControls;
(function (MscrmControls) {
    var Metadata;
    (function (Metadata) {
        var MetadataProvider = (function () {
            function MetadataProvider() {
                this.ODATA_RESPONSE_PROPERTY_KEY = "@odata.context";
                this.ODATA_TYPE_PROPERTY_KEY = "@odata.type";
                this.ODATA_TYPE_PREFIX = "Microsoft.Dynamics.CRM";
                this._actionName = "";
                this._actionParamName = "";
                this._actionParam = null;
                this._metadataJson = "";
            }
            Object.defineProperty(MetadataProvider.prototype, "metadataJson", {
                get: function () {
                    return this._metadataJson;
                },
                enumerable: true,
                configurable: true
            });
            MetadataProvider.prototype.isInitialized = function () {
                return this._context != null;
            };
            MetadataProvider.prototype.initialize = function (context) {
                this._context = context;
                this._actionName = this._context.parameters.ActionName.raw;
                this._actionParamName = this._context.parameters.ActionParamName.raw;
                var actionParamValue = this._context.parameters.ActionParam.raw;
                if (actionParamValue && typeof (actionParamValue) === "object" && actionParamValue.constructor === Array && actionParamValue.length > 0) {
                    // For lookup reference, construct entity reference and pass it to the action call.
                    this._actionParam = {};
                    this._actionParam[this.ODATA_TYPE_PROPERTY_KEY] = this.ODATA_TYPE_PREFIX + "." + actionParamValue[0].LogicalName;
                    this._actionParam[actionParamValue[0].LogicalName + "id"] = actionParamValue[0].Id.toString();
                }
                else {
                    this._actionParam = actionParamValue;
                }
                this._metadataJson = "";
            };
            MetadataProvider.prototype.retrieveJson = function () {
                var _this = this;
                return new Promise(function (resolve, reject) {
                    if (_this._actionName) {
                        var requestParams = null;
                        if (_this._actionParamName && _this._actionParam) {
                            requestParams = {};
                            requestParams[_this._actionParamName] = _this._actionParam;
                        }
                        Metadata.OdataProvider.executeRequest("POST", _this._actionName, requestParams, _this.handleResponse.bind(_this, resolve, reject), _this.handleError.bind(_this, reject));
                    }
                    else {
                        reject(_this._context.resources.getString("NoActionName"));
                    }
                });
            };
            MetadataProvider.prototype.handleResponse = function (resolve, reject, response) {
                if (response) {
                    for (var property in response) {
                        if (response.hasOwnProperty(property) && property.toLowerCase() !== this.ODATA_RESPONSE_PROPERTY_KEY) {
                            this._metadataJson = response[property];
                            resolve(this._metadataJson);
                            break;
                        }
                    }
                }
                else {
                    reject(this._context.resources.getString("MetadataFetchError"));
                }
            };
            MetadataProvider.prototype.handleError = function (reject, errorObject) {
                // TODO: Display in the error section of the custom control.
                reject(errorObject ? errorObject.error.message : this._context.resources.getString("MetadataFetchError"));
            };
            return MetadataProvider;
        }());
        Metadata.MetadataProvider = MetadataProvider;
    })(Metadata = MscrmControls.Metadata || (MscrmControls.Metadata = {}));
})(MscrmControls || (MscrmControls = {}));
//# sourceMappingURL=MetadataControl.js.map