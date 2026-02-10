//#region *** Global helper functions *** 
function uuid() {
    // Create a random UUID
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

(function () {
    // Find a a certain element meeting predicate in a collection of HTML Elements
    var _findFunc = function (predicate) {
        if (!predicate) return null;
        for (var i = 0; i < this.length; i++) {
            var e = this[i];
            if (predicate(e)) {
                return e;
            }
        }
    };

    HTMLCollection.prototype.find = _findFunc;
    NodeList.prototype.find = _findFunc;

    // Find if a certain element in a collection of HTML elements exists
    NodeList.prototype.some = function (predicate) {
        if (!predicate)
            return false;

        for (var i = 0; i < this.length; i++) {
            var e = this[i];
            if (predicate(e))
                return true;
        }
        return false;
    };
})();
//#endregion



var JsonControlRenderer = function (control, context, containerId, fieldName, options) {

    var self = this;

    //#region *** Functions required for private variables initialization ***
    this.isValidNonEmptyJson = function (data) {
        try {
            if (typeof data === 'object') {
                return Object.keys(data).length !== 0;
            } else {
                var json = JSON.parse(data);
                return typeof json === 'object' && Object.keys(json).length !== 0;
            }
        } catch (e) {
            return false;
        }
    }

    this.getObjectDataFromFieldValue = function (value) {
        try {
            var jsonObject = JSON.parse(value);
            return jsonObject;
        } catch (e) {
            return value;
        }
    }
    //#endregion

    //#region *** Private variables *** 
    var configuredControlMode = options && options.view ? options.view : 'Designer'; // default to 'Designer' if not configured
    var pathConnector = "@#^&"; // used to track which node is on which level so as to find right key and update JSON object correctly
    var expandCollapseContainerIdentifier = "expandCollapseContainer";
    var textDesignerContainerIdentifier = "textDesignerContainer";
    var defaultColor = '#000';
    this.colors = {
        FormItemLabelForeground: null,
        FormItemForeground: null
    };
    var isDirty = false; // Whenever user types in data, mark the form as dirty so that the changes can be saved when user exits or clicks save directly

    var controlContainer = document.getElementById(containerId); // field container div
    controlContainer.innerHTML = '';

    ///<summary>
    /// metadataJson is a json string of the validation metrics which users define in IoT Web client and will be used to validate user's input
    /// metadataObject is its corresponding json object 
    ///</summary>
    var metadataJson = self.isValidNonEmptyJson(control._metadataProvider._metadataJson) ? control._metadataProvider._metadataJson : null;
    var metadataObject = metadataJson ? JSON.parse(metadataJson) : null;

    ///<summary>
    /// JSON Object if it is valid josn. Otherwise, it is plain text
    /// It is root data and its value will be stored in the field of the entity when user saves the form or exits
    ///</summary>
    var objectData = self.getObjectDataFromFieldValue(context.parameters.value.raw);

    ///<summary>
    /// Stores the validation result of each nested json object
    ///</summary>
    this.validationState = {
        PropertyValidations: {
            // Should hold  collection of the validation results of nested object nodes.
            // something like 
            // "null": {success: true, errorMessage: null}
        }
    };
    //#endregion


    //#region *** Public methods ***
    this.renderControl = function () {
        if (!self.isValidNonEmptyJson(context.parameters.value.raw)) {
            context.parameters.value.raw = "{}"; // Still need to draw the switch button for main editor
            control._metadataProvider._metadataJson = null;
        }
        var updatedViewNode = control.updateView(context);
        const renderCallback = function () {
            self.renderControlInternal(null, updatedViewNode, configuredControlMode);
            self.applyCustomColors();
        };

        var colorsNames = Object.keys(self.colors);
        FS.Utils.checkNetwork(function () {
            self.downloadCustomColors(renderCallback, colorsNames);
        }, function () {
            for (var i = 0; i < colorsNames.length; i++) {
                self.colors[colorsNames[i]] = defaultColor;
            }
            renderCallback();
        });
    };

    this.getJsonForTransfer = function () {
        self.triggerOnChangeForActiveElement();
        return self.getFieldValue();
    };
    //#endregion


    //#region *** Render Component Element functions *** 
    this.renderControlInternal = function (parent, node, controlMode) {
        if (!node) {
            return;
        }

        var nodeType = node._type;
        switch (nodeType) {
            case "CONTAINER":
                self.renderContainer(parent, node, controlMode);
                break;
            case 'Button':
                self.renderButton(parent, node, controlMode);
                break;
            case "LABEL":
                self.renderLabel(parent, node);
                break;
            case "MscrmControls.FieldControls.WholeNumberControl":
                var attr = node._properties.parameters.value.Attributes;
                var minValue = attr["minvalue"] || attr["MinValue"];
                var maxValue = attr["maxvalue"] || attr["MaxValue"];
                self.renderIntegerEditor(parent, node, minValue, maxValue);
                break;
            case "MscrmControls.FieldControls.DecimalNumberControl":
                var attr = node._properties.parameters.value.Attributes;
                var minValue = attr["minvalue"] || attr["MinValue"];
                var maxValue = attr["maxvalue"] || attr["MaxValue"];
                self.renderDoubleEditor(parent, node, minValue, maxValue, node._properties.parameters.value.Attributes.Precision);
                break;
            case "MscrmControls.FieldControls.DateTimeControl":
                self.renderDatetime(parent, node);
                break;
            case "MICROSOFTICON":
                self.renderMicrosoftIcon(parent, node);
                break;
            case "MscrmControls.FlipSwitch.FlipSwitchControl":
                self.renderBooleanEditor(parent, node);
                break;
            case "MscrmControls.FieldControls.TextBoxControl":
                self.renderTextEditor(parent, node, node._properties.parameters.value.Type);
                break;
            case undefined:
                self.renderUndefinedType(parent, node);
                break;
            default:
                self.renderTextEditor(parent, node, 'Multiple');
                break;
        }
    }

    ///<summary>
    /// Renders general "CONTAINER" element
    ///</summary>
    this.renderContainer = function (parent, node, controlMode) {
        try {
            if (node.componentId === "MetadataControlContainer") {
                // This is the root container
                controlContainer.innerHTML = '';
                var metadataControlContainer = document.createElement('div');
                metadataControlContainer.id = uuid() + "_" + node.componentId;
                if (node._properties && node._properties.style) {
                    self.applyStyle(node._properties.style, metadataControlContainer);
                }
                controlContainer.appendChild(metadataControlContainer);

                if (node.children) {
                    for (var c in node.children) {
                        var childNode = node.children[c];
                        controlMode = controlMode || configuredControlMode;
                        self.renderControlInternal(metadataControlContainer, childNode, controlMode);
                    }
                }
            } else {
                if (!parent) {
                    return;
                }
                var container = document.createElement('div');
                container.id = uuid() + "_" + node.componentId;
                container.componentId = node.componentId;
                container.path = node.path;
                container.validationPath = node.validationPath;
                if (node.path) {
                    container.setAttribute('node-path', node.path);
                }
                container.classList.add('jsonctrl-property-container');

                if (node.componentId && node.componentId.indexOf("LabelContainer") >= 0) {
                    container.classList.add('jsonctrl-property-label-container');
                }
                parent.appendChild(container);

                if (self.isNullContainer(node)) {
                    var switchViewButton = parent.querySelectorAll("button").find(function (b) {
                        return b.id && b.id.indexOf("null" + textDesignerContainerIdentifier) >= 0;
                    });
                    if (typeof objectData === 'string' && objectData.length > 0) {
                        switchViewButton.controlMode = "JSON"; // Make it JSON mode when it is non-empty string
                        self.updateButtonInnerElements(switchViewButton);
                    }
                    self.createTextAreaJsonEditor(container, "null", objectData, switchViewButton);
                } else {
                    if (node.children) {
                        if (self.isObjectArray(node.children)) {
                            for (var ithChild = 0; ithChild < node.children.length; ithChild++) {
                                var childNode = node.children[ithChild];
                                if (childNode && childNode._properties && (childNode._properties.key || childNode._properties.descriptor)) {
                                    var pKey = childNode._properties.key || childNode._properties.descriptor.DomId;
                                    var pKeyShort = pKey && pKey.replace('Label', '').replace('Container', '').replace('MetadataControl-', '');
                                    childNode.path = container.path ? container.path + pathConnector + pKeyShort : pKeyShort;
                                    childNode.validationPath = container.validationPath ? container.validationPath + pathConnector + pKeyShort : pKeyShort;

                                    // Check if this node contains any json object child node
                                    if (childNode.componentId && childNode.componentId.indexOf("LabelContainer") >= 0) {
                                        var valueNode = node.children[ithChild + 1];
                                        if (self.checkJsonWhenHavingMetadataAndRenderInvalidJsonAsTextArea(container, childNode, valueNode, controlMode)) {
                                            ithChild += 1; // skip the valueContainer
                                            continue;
                                        }
                                    }
                                }

                                self.renderControlInternal(container, childNode, controlMode);
                            }

                            // Add validation button and message containers if this node contains JSON Object
                            if (node.componentId && node.componentId.indexOf("LabelContainer") >= 0) {
                                var nvPath = node.validationPath || "null";
                                self.createValidateButtonIfNotExistsAndSetRightValidationPathIfExists(container, controlMode, node.componentId.replace("LabelContainer", ''), nvPath);
                                var validationMessageContainers = controlContainer.querySelectorAll('.validation-message-container') || [];
                                var found = validationMessageContainers.some(function (current) {
                                    return current.getAttribute && current.getAttribute('property-validation-path') === nvPath;
                                });
                                if (!found) {
                                    var validationMessageContainer = document.createElement('div');
                                    validationMessageContainer.classList.add('validation-message-container');
                                    validationMessageContainer.setAttribute("property-validation-path", nvPath);
                                    parent.appendChild(validationMessageContainer);
                                }
                            }
                        } else {
                            self.renderControlInternal(container, node.children, controlMode);
                        }
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    ///<summary>
    /// Renders a button
    ///</summary>
    this.renderButton = function (parent, node, controlMode) {
        var btn = document.createElement('button');
        btn.id = uuid() + '_' + node.componentId;
        btn.componentId = node.componentId;
        if (btn.componentId && btn.componentId.indexOf(textDesignerContainerIdentifier) >= 0) {
            btn.controlMode = controlMode || configuredControlMode;
        } else if (btn.id.indexOf(expandCollapseContainerIdentifier) >= 0) {
            btn.collapsed = false; // default
        }
        btn.classList.add('json-control-btn-default');
        btn.node = node;
        if (btn.id.indexOf("errorContainer") >= 0) {
            btn.setAttribute("property-validation-path", node.validationPath || "null");
            var cm = controlMode || configuredControlMode;
            if (cm === 'Designer') {
                btn.style.display = "none";
            }
            btn.onclick = self.validateButtonClick;
        }
        else {
            btn.onclick = function () {
                try {
                    if (this.id.indexOf(textDesignerContainerIdentifier) >= 0) { // View switch clicked between JSON view and tree data view
                        self.switchViewButtonOnClick(btn);
                    } else if (this.id.indexOf(expandCollapseContainerIdentifier) >= 0) { // Expand/collapse feature
                        self.expandCollapseButtonOnClick(btn);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
        }

        var childNode = node.children;
        if (childNode) {
            self.renderControlInternal(btn, childNode);
        } else {
            var span = document.createElement('span');
            span.id = uuid() + "_" + childNode.componentId;
            span.innerText = "JSON/Tree";
            btn.appendChild(span);
        }
        if (btn.id && btn.id.indexOf("errorContainer") >= 0) {
            parent.appendChild(btn);
        } else {
            var validateButton = parent.children.find(function (ch) { return ch && ch.id && ch.id.indexOf("errorContainer") >= 0; });
            if (validateButton)
                parent.insertBefore(btn, validateButton);
            else
                parent.appendChild(btn);
        }
    }

    ///<summary>
    /// Label Renderer
    ///</summary>
    this.renderLabel = function (parent, node) {
        var label = document.createElement('label');
        label.innerText = node.children;
        label.htmlFor = node._properties.forElementId;
        self.applyStyle(node._properties.style, label);
        parent.appendChild(label);
    }

    ///<summary>
    /// Textbox or textarea renderer
    ///</summary>
    this.renderTextEditor = function (parent, node, textFieldType) {
        var nodeInput;
        if (textFieldType === 'Multiple')
            nodeInput = document.createElement('textarea');
        else
            nodeInput = document.createElement('input');

        nodeInput.setAttribute('maxlength', node._properties.parameters.value.Attributes.MaxLength);
        self.setUpInputNode(parent, node, nodeInput);
    }

    ///<summary>
    /// Integer number renderer
    ///</summary>
    this.renderIntegerEditor = function (parent, node, minValue, maxValue) {
        self.renderNumberEditor(parent, node, 1, minValue, maxValue, 'number');
    }

    ///<summary>
    /// Double number renderer
    ///</summary>
    this.renderDoubleEditor = function (parent, node, minValue, maxValue, precision = 0) {
        var step = "1";
        if (precision !== 0) {
            var precisionZeros = '0.';
            for (var i = 0; i < precision - 1; i++) {
                precisionZeros += '0';
            }
            step = precisionZeros + '1';
        }

        self.renderNumberEditor(parent, node, step, minValue, maxValue, 'number');
    }

    ///<summary>
    /// Common number renderer
    ///</summary>
    this.renderNumberEditor = function (parent, node, step, minValue, maxValue, type = 'text') {
        var nodeInput = document.createElement('input');
        if (type !== 'text' && metadataObject) {
            nodeInput.type = type;
            if (step)
                nodeInput.step = step;
            else
                nodeInput.step = 1;

            if (minValue !== undefined)
                nodeInput.min = minValue;

            if (maxValue !== undefined)
                nodeInput.max = maxValue;
        } else {
            nodeInput.type = 'text';
        }
        self.setUpInputNode(parent, node, nodeInput);
    }

    this.setUpInputNode = function (parent, node, nodeInput) {
        var inputContainer = document.createElement('div');
        inputContainer.id = uuid() + "_" + node._properties.descriptor.DomId;
        inputContainer.setAttribute('role', 'presentation');
        if (node._properties && node._properties.style) {
            self.applyStyle(node._properties.style, inputContainer);
        }

        parent.appendChild(inputContainer);

        nodeInput.id = uuid() + "_" + node._properties.descriptor.Id;
        nodeInput.style.width = "100%";

        if (node.path) {
            nodeInput.setAttribute('node-path', node.path);
        }

        if (options.readonly) {
            nodeInput.readOnly = true;
        }

        nodeInput.oninput = self.onInputEventHandler;
        nodeInput.onchange = self.onChangeEventHandler;

        nodeInput.value = node._properties.parameters.value.Value;
        nodeInput.placeholder = '---';

        inputContainer.appendChild(nodeInput);
        self.checkHideOrDisableField(inputContainer, node._properties.parameters.value.Attributes);
    }

    this.onInputEventHandler = function (event) {
        if (!isDirty) {
            self.setDirty(true);
            isDirty = true;
        }
    }

    ///<summary>
    /// Action when a value is unputted and focus is lost. Separate function is necessary for min and max value checks
    ///</summary>
    this.onChangeEventHandler = function (event) {
        var nv = self.getValueFromEvent(event);
        // Replace smart quotes with straight quotes => fix the issue that smart/curly quotes of iOS won't work for JSON control
        nv = nv.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

        // objectData will always be a valid non-empty json object when there is a textbox in the control as textArea will handle the root editor case
        var nodePath = this.getAttribute('node-path'); // nodePath will have always at least one item
        var nodeProps = nodePath.split(pathConnector), obj = objectData, subJsonMetadataObject = metadataObject, propName;
        var validationProps = [];
        for (var i = 0; i < nodeProps.length; i++) {
            var p = nodeProps[i].replace('Container', '');
            validationProps.push(p);

            if (subJsonMetadataObject && subJsonMetadataObject.hasOwnProperty(p))
                subJsonMetadataObject = subJsonMetadataObject[p];

            if (i === nodeProps.length - 1) {
                // Stop at previous level
                propName = p;
                break;
            }

            if (obj.hasOwnProperty(p)) {
                obj = obj[p];
            }
        }

        // Validate the input if there is non-empty metadata
        if (subJsonMetadataObject && typeof subJsonMetadataObject === 'object' && Object.keys(subJsonMetadataObject).length !== 0) {
            var retValue;
            var metadataType = subJsonMetadataObject && subJsonMetadataObject.Type || 'string';
            if (metadataType) {
                retValue = self.validateAndParseOnChange(subJsonMetadataObject, nv);
            }
            obj[propName] = retValue;
            event.target.value = retValue;
        } else {
            if (self.isValidNonEmptyJson(nv)) {
                // Re-render the whole tree when new value in a text box is a valid json and there is no metadata json
                nv = nv.replace(/\s*{\s*}\s*/, '""');//replace empty braces with quotes to prevent unwanted MetadataControlDefaultId field from rendering
                var jsonObj = JSON.parse(nv);
                obj[propName] = jsonObj;
                self.reRenderTree();
            } else {
                obj[propName] = nv;
                event.target.value = nv;
            }
        }

        self.saveJsonObjectToField();
    }

    ///<summary>
    /// Datetime field renderer
    ///</summary>
    this.renderDatetime = function (parent, node) {
        var inputContainer = document.createElement('div');
        inputContainer.id = uuid() + "_" + node._properties.descriptor.DomId;
        inputContainer.setAttribute('role', 'presentation');

        if (node._properties && node._properties.style) {
            self.applyStyle(node._properties.style, inputContainer);
        }

        parent.appendChild(inputContainer);

        var nodeInput = document.createElement('input');
        nodeInput.id = uuid() + "_" + node._properties.descriptor.Id;
        nodeInput.type = 'datetime-local';
        nodeInput.placeholder = 'mm/dd/yyyy --:-- --';
        if (node.path) {
            nodeInput.setAttribute('node-path', node.path);
        }

        inputContainer.appendChild(nodeInput);
        self.checkHideOrDisableField(inputContainer, node._properties.parameters.value.Attributes);

        nodeInput.readOnly = options.readonly || nodeInput.readOnly;
        // Give it text type so as to fix the bug that iOS browser doesn't lock the datetime field even if its readOnly attribute is true
        if (nodeInput.readOnly) {
            nodeInput.type = 'text';
        }

        nodeInput.onchange = function (event) {
            var nv = self.getValueFromEvent(event);
            var nodePath = this.getAttribute('node-path');
            var nodeProps = nodePath.split(pathConnector), obj = objectData, subJsonMetadataObject = metadataObject, propName;
            var validationProps = [];
            for (var i = 0; i < nodeProps.length; i++) {
                var p = nodeProps[i].replace('Container', '');
                validationProps.push(p);

                if (subJsonMetadataObject && subJsonMetadataObject.hasOwnProperty(p))
                    subJsonMetadataObject = subJsonMetadataObject[p];

                if (i === nodeProps.length - 1) {
                    // Stop at previous level
                    propName = p;
                    break;
                }

                if (obj.hasOwnProperty(p)) {
                    obj = obj[p];
                }
            }
            var retValue = nv;
            if (subJsonMetadataObject && typeof subJsonMetadataObject === 'object' && Object.keys(subJsonMetadataObject).length !== 0) {
                retValue = self.validateAndParseOnChange(subJsonMetadataObject, nv);
            }

            event.target.value = retValue;

            if (moment(retValue).isValid()) {
                obj[propName] = moment(retValue).toISOString();
            } else {
                obj[propName] = null;
            }

            self.saveJsonObjectToField();
        };

        nodeInput.addEventListener('focus', function (e) {
            var element = e.target;
            if (element.value === "") {
                if (!nodeInput.readOnly) {
                    element.value = moment().format('YYYY-MM-DDTHH:mm');
                    nodeInput.classList.remove("emptyDate");
                    nodeInput.dispatchEvent(new Event('change'));
                }
            }

        });

        nodeInput.addEventListener('blur', function () {
            if (nodeInput.value === "") {
                if (!nodeInput.readOnly) {
                    nodeInput.classList.add("emptyDate");
                    nodeInput.dispatchEvent(new Event('change'));
                }
            }
        });

        if (node._properties.parameters.value.Value !== null) {
            if (!nodeInput.readOnly) {
                nodeInput.value = moment(node._properties.parameters.value.Value).format('YYYY-MM-DDTHH:mm');
            } else {
                nodeInput.value = moment(node._properties.parameters.value.Value).format('YYYY-MM-DD HH:mm');
            }
        } else {
            nodeInput.classList.add("emptyDate");
        }
    }

    ///<summary>
    /// Renders "MICROSOFTICON" element (all icons in buttons).
    ///</summary>
    this.renderMicrosoftIcon = function (parent, node) {
        var iElement = document.createElement('span');
        if (node.componentId && node.componentId.indexOf('microsoftIcon_textdesigner') >= 0) {
            var btnControlMode = parent.controlMode; // parent is a button reference
            if (btnControlMode === "JSON") {
                iElement.classList.add('switch-to-designer-view');
            } else {
                iElement.classList.add('switch-to-json-view');
            }
        } else if (node.componentId &&
            node.componentId.indexOf("microsoftIcon_expandcollapse") >= 0) {
            var collapsed = parent.collapsed;
            if (typeof collapsed !== 'undefined') {
                iElement.classList.add(collapsed ? 'expand-button' : 'collapse-button');
            }
        } else if (node.componentId && node.componentId.indexOf("nullmicrosoftIcon_error") >= 0) {
            var validationPath = parent.node && parent.node.validationPath;
            if (!validationPath)
                validationPath === "null";
            var validationResult = self.validationState.PropertyValidations[validationPath];
            if (!validationResult || validationResult.success) {
                iElement.classList.add('validation-message-valid');
            } else {
                iElement.classList.add('validation-message-error');
            }
        }

        parent.appendChild(iElement);
    }

    ///<summary>
    /// Renders boolean editor
    ///</summary>
    this.renderBooleanEditor = function (parent, node) {
        if (node._properties.parameters && node._properties.parameters.value && node._properties.parameters.value.Type === "boolean") { // checkbox
            parent.classList.add('boolean-switch-container');
            var switchLabel = document.createElement('label');
            switchLabel.classList.add('switch');
            var slider = document.createElement('span');
            slider.className = 'slider round';
            var checkBox = document.createElement('input');
            checkBox.type = 'checkbox';
            checkBox.id = uuid() + "_" + node._properties.descriptor.DomId;
            var propertyName = node._properties.descriptor.DomId && node._properties.descriptor.DomId.replace("MetadataControl-", "");
            if (propertyName) {
                checkBox.setAttribute("prop-name", propertyName);
            }
            var nodePath = parent.getAttribute('node-path');
            if (nodePath) {
                checkBox.setAttribute('node-path', nodePath);
            }

            checkBox.checked = node._properties.parameters.value.Value;

            checkBox.onchange = function (e) {
                var nv = e.target.checked;
                var nodePath = e.target.getAttribute('node-path'), propName = e.target.getAttribute('prop-name');
                var obj = objectData, nodeProps = nodePath.split(pathConnector);
                for (var i = 0; i < nodeProps.length; i++) {
                    var p = nodeProps[i].replace("Container", '');
                    if (obj.hasOwnProperty(propName)) {
                        obj[propName] = nv;
                        break;
                    }
                    if (obj[p]) {
                        obj = obj[p];
                    }
                }

                var onLabel = e.target.getAttribute('OnLabel');
                var offLabel = e.target.getAttribute('OffLabel');
                var isChecked = e.target.checked;

                if (isChecked && onLabel)
                    e.target.parentElement.parentElement.querySelector("span.boolean-switch-label").innerHTML = onLabel;
                else if (!isChecked && offLabel)
                    e.target.parentElement.parentElement.querySelector("span.boolean-switch-label").innerHTML = offLabel;
                else
                    e.target.parentElement.parentElement.querySelector("span.boolean-switch-label").innerHTML = '';

                self.saveJsonObjectToField();
            };

            switchLabel.appendChild(checkBox);
            switchLabel.appendChild(slider);
            parent.appendChild(switchLabel);

            var onLabel = node._properties.parameters.value.Attributes.OnLabel;
            var offLabel = node._properties.parameters.value.Attributes.OffLabel;

            if (onLabel)
                checkBox.setAttribute('OnLabel', onLabel);

            if (offLabel)
                checkBox.setAttribute('OffLabel', offLabel);

            var span = document.createElement("span");
            span.className = "boolean-switch-label";

            if (checkBox.checked && onLabel !== undefined) {
                span.innerHTML = onLabel;
            }
            else {
                if (!checkBox.checked && offLabel !== undefined) {
                    span.innerHTML = offLabel;
                }
            }

            parent.appendChild(span);
            var defaultValue = node._properties.parameters.value.Attributes.DefaultValue;
            if (defaultValue !== undefined)
                checkBox.dispatchEvent(new Event('change'));

            self.checkHideOrDisableField(parent, node._properties.parameters.value.Attributes);
            checkBox.disabled = options.readonly || checkBox.readOnly;
        }
    }

    ///<summary>
    /// Renders undefined type
    ///</summary>
    this.renderUndefinedType = function (parent, node) {
        if (typeof node === 'string') {
            // This node is the text on the Label button
            try {
                parent.outerHTML = '<span>' + node + '</span>';
            }
            catch (e) {
                console.error(e);
            }
        }
    }
    //#endregion


    //#region *** Validation helper functions ***
    ///<summary>
    /// Renders validation button if the JSON is correct.
    ///</summary>
    this.createValidateButtonIfNotExistsAndSetRightValidationPathIfExists = function (container, controlMode, propertyName, validationPath) {
        container = container || controlContainer.querySelector('.jsonctrl-property-container'); // labelContainer
        if (!container || !container.children || !container.children.length)
            return;

        for (var i = 0; i < container.children.length; i++) {
            var el = container.children[i];
            if (el && el.id && el.id.indexOf("errorContainer") >= 0) {
                // Set the validation path
                el.setAttribute("property-validation-path", validationPath || "null");
                return;
            }
        }

        var node = {
            _type: "Button",
            validationPath: validationPath,
            componentId: propertyName + "errorContainer",
            _properties: {
                id: propertyName + "errorContainer",
                className: propertyName + "errorContainer",
                tabIndex: 0,
                title: "Validate"
            },
            children: {
                _type: "MICROSOFTICON",
                componentId: propertyName + "microsoftIcon_error",
                _properties: {
                    id: propertyName + "microsoftIcon_error",
                    key: propertyName + "microsoftIcon_error",
                    tabIndex: -1,
                    type: 9
                }
            }
        };

        self.renderButton(container, node, controlMode);
    }

    this.validateButtonClick = function () {
        // validate object and display validation result
        var nvPath = this.getAttribute('property-validation-path') || this.node && this.node.validationPath; // "this" is "Validate" button

        var controlMode;
        var btnContainer = this.parentElement;
        for (var i = 0; i < btnContainer.children.length; i++) {
            var b = btnContainer.children[i];
            if (b && b.id.indexOf(textDesignerContainerIdentifier) >= 0) {
                controlMode = b.controlMode;
            }
        }

        self.validateObjectMetadata(nvPath);
        self.updateValidateButtonIcon(nvPath, controlMode);
        self.updateValidationMessage(nvPath);
    }

    this.getSubJsonObjectAndSubJsonMetadataObjectFromValidationPath = function (validationPath) {
        var validationPathSegments = validationPath && validationPath !== "null" ? validationPath.split(pathConnector) : [];

        var subJsonMetadataObject = metadataObject;
        var subJsonObject = objectData;
        if (typeof objectData === 'object') {
            for (var i = 0; i < validationPathSegments.length; i++) {
                var prop = validationPathSegments[i];
                if (subJsonObject.hasOwnProperty(prop))
                    subJsonObject = subJsonObject[prop];

                if (subJsonMetadataObject) {
                    if (subJsonMetadataObject.hasOwnProperty(prop))
                        subJsonMetadataObject = subJsonMetadataObject[prop];
                    else {
                        subJsonMetadataObject = {};
                    }
                }
            }
        }

        return {
            subJsonObject: subJsonObject, // subJsonObject may be {}, "", any string, or json object
            subJsonMetadataObject: subJsonMetadataObject
        };
    }

    ///<summary>
    /// Validates current object properties against the metadata.
    ///</summary>
    this.validateObjectMetadata = function (validationPath) {
        var ret = self.getSubJsonObjectAndSubJsonMetadataObjectFromValidationPath(validationPath);
        var subJsonObject = ret.subJsonObject;
        var subJsonMetadataObject = ret.subJsonMetadataObject;

        // Validate if the data is valid json when there is no metadata json
        if (!metadataJson) {
            var validationResult = self.validationState.PropertyValidations[validationPath ? validationPath : "null"] || { isShown: false };
            if (self.isValidJson(subJsonObject)) {
                validationResult.success = true;
                validationResult.errorMessage = null;
            } else {
                validationResult.success = false;
                validationResult.errorMessage = context.resources.getString("InvalidJSONError");
            }

            self.validationState.PropertyValidations[validationPath ? validationPath : "null"] = validationResult;
            return;
        }

        // Validate the objectData when there is metadata
        var validator = new MscrmControls.Metadata.Validator(context);
        validator.validateJsonWithMetadata(subJsonObject, subJsonMetadataObject);

        var validationErrors = [];
        var missingProps = validator._missingProps || [];
        var invalidTypeValues = validator._invalidValueErrors || [];
        var unrecognizedProps = typeof subJsonObject === 'object' ? validator._unrecognizedProps : []; // No sense to check unrecognized props if the target is not object.
        if (missingProps.length > 0) {
            validationErrors.push(MscrmCommon.ControlUtils.String.Format(context.resources.getString("MissingPropertiesError"), missingProps.join(", ")));
        }

        for (var i = 0; i < invalidTypeValues.length; i++) {
            validationErrors.push(invalidTypeValues[i]);
        }

        if (unrecognizedProps.length > 0) {
            validationErrors.push(MscrmCommon.ControlUtils.String.Format(context.resources.getString("UnrecognizedPropertiesError"), unrecognizedProps.join(", ")));
        }

        var vResult = self.validationState.PropertyValidations[validationPath ? validationPath : "null"];
        if (validationErrors && validationErrors.length) {
            if (vResult) {
                vResult.success = false;
                vResult.errorMessage = validationErrors.join(',');
            } else {
                self.validationState.PropertyValidations[validationPath ? validationPath : "null"] = { success: false, errorMessage: validationErrors.join(',') };
            }
        } else {
            if (vResult) {
                vResult.success = true;
                vResult.errorMessage = null;
            } else {
                self.validationState.PropertyValidations[validationPath ? validationPath : "null"] = { success: true, errorMessage: null };
            }
        }
    }

    ///<summary>
    /// Update the validation button icon.
    ///</summary>
    this.updateValidateButtonIcon = function (validationPath, controlMode) {
        var validationButton, buttons = controlContainer.querySelectorAll('button') || [];
        for (var i = 0; i < buttons.length; i++) {
            var btn = buttons[i];
            if (btn && btn.getAttribute('property-validation-path') === validationPath) {
                validationButton = btn;
                break;
            }
        }

        if (validationButton) {
            var validationResult = self.validationState.PropertyValidations[validationPath];
            if (validationResult && !validationResult.success) {
                validationButton.style.display = "block";
            } else {
                if (controlMode === 'Designer') {
                    validationButton.style.display = "none";
                } else {
                    validationButton.style.display = "block";
                }
            }

            var span = validationButton.children[0];
            if (!span)
                return;

            while (span.classList.length) {
                span.classList.remove(span.classList.item(0));
            }

            // Update validation button icon
            span.classList.add(!validationResult || validationResult.success ? 'validation-message-valid' : 'validation-message-error');
        }
    }

    ///<summary>
    /// Shows/hides validation message and updates its content.
    ///</summary>
    this.updateValidationMessage = function (validationPath, keepPrevVisibility = false) {
        validationPath = validationPath || "null";

        var containers = controlContainer.querySelectorAll('.validation-message-container') || [];
        var container = containers.find(function (c) {
            return c && c.getAttribute('property-validation-path') === validationPath;
        });

        if (!container) {
            return;
        }

        var validationMessageContainer = container.children.find(
            function (ch) { return ch && ch.getAttribute("role") === "validation-message-content"; });

        if (!validationMessageContainer) {
            validationMessageContainer = document.createElement('div');
            validationMessageContainer.setAttribute("role", "validation-message-content");
            container.appendChild(validationMessageContainer);
        }

        var validationResult = self.validationState.PropertyValidations[validationPath];
        if (typeof validationResult.isShown === 'undefined') {
            validationResult.isShown = false;
        } else {
            if (!keepPrevVisibility)
                validationResult.isShown = !validationResult.isShown;
        }

        var isVisible = validationResult.isShown;
        container.style.display = isVisible ? "block" : "none";

        if (!validationResult)
            return;

        // Update validation message content
        while (validationMessageContainer.classList.length) {
            validationMessageContainer.classList.remove(validationMessageContainer.classList.item(0));
        }

        if (!validationResult.success) {
            validationMessageContainer.classList.add('validation-error');
            validationMessageContainer.innerText = validationResult.errorMessage;
        } else {
            validationMessageContainer.classList.add('validation-success');
            validationMessageContainer.innerText = context.resources.getString('ValidationSuccess');
        }
    }

    ///<summary>
    /// Updates validation message and handles validation button visibility when a user switches data view mode.
    ///</summary>
    this.showOrHideValidationMessageInViewSwitch = function (validationPath, controlMode) {
        validationPath = validationPath || "null";
        var validationContainers = controlContainer.querySelectorAll('.validation-message-container') || [];
        var validationContainer;
        for (var i = 0; i < validationContainers.length; i++) {
            var container = validationContainers[i];
            if (container.getAttribute('property-validation-path') === validationPath) {
                validationContainer = container;
                break;
            }
        }

        if (!validationContainer) return;
        if (controlMode === 'Designer') {
            // Hide validation message by default in Tree Mode
            validationContainer.style.display = "none";
        } else {
            self.validateObjectMetadata(validationPath);
            self.updateValidationMessage(validationPath, true);
            var prevValidation = self.validationState.PropertyValidations[validationPath];
            if (prevValidation && prevValidation.isShown) {
                validationContainer.style.display = "block";
            }
        }
    }
    //#endregion


    //#region *** Expand/Collapse | Switch View Button helper functions ***
    this.getSubJsonObjectAndHTMLValueContainer = function (btnContainer) {
        var subJsonKey = (btnContainer.id.split('_')[1] || '').replace('LabelContainer', '');
        if (subJsonKey === null || subJsonKey === '') {
            return;
        }

        var subJsonObject, subJsonMetadataObject;
        if (metadataObject) {
            subJsonMetadataObject = metadataObject;
        } else {
            subJsonMetadataObject = {};
        }

        if (subJsonKey === "null") {
            // Root editor
            subJsonObject = objectData;
            subJsonMetadataObject = metadataObject;
        } else {
            subJsonObject = objectData;
            var validationButton = btnContainer.querySelectorAll("button").find(function (b) {
                return b.id && b.id.indexOf(subJsonKey + "errorContainer") >= 0;
            });

            var nodePath = validationButton.getAttribute("property-validation-path");
            if (nodePath) {
                var nodeProps = nodePath.split(pathConnector);
                for (var i in nodeProps) {
                    var p = nodeProps[i].replace('Container', '');
                    if (subJsonObject.hasOwnProperty(p))
                        subJsonObject = subJsonObject[p];
                    if (subJsonMetadataObject.hasOwnProperty(p))
                        subJsonMetadataObject = subJsonMetadataObject[p];
                }
            }

            if (subJsonObject.hasOwnProperty(subJsonKey)) {
                subJsonObject = subJsonObject[subJsonKey];
            }
            if (subJsonMetadataObject.hasOwnProperty(subJsonKey)) {
                subJsonMetadataObject = subJsonMetadataObject[subJsonKey];
            }
        }

        var parentContainer = btnContainer.parentElement;
        var targetContainerPattern = subJsonKey + 'Container';

        // Find the valueContainer
        var subJsonHtmlValueContainer;
        for (var i = 0; i < parentContainer.children.length; i++) {
            var cn = parentContainer.children[i];
            if (cn && cn.id && cn.id.indexOf(targetContainerPattern) >= 0) {
                subJsonHtmlValueContainer = cn;
                break;
            }
        }

        if (!subJsonHtmlValueContainer) {
            return;
        }

        // subJsonObject may be a string when objectData is string or user types in invalid json in JSON mode
        return {
            subJsonObject: subJsonObject, // subJsonObject may be {}, "", any string, or json object
            subJsonMetadataObject: subJsonMetadataObject,
            subJsonHtmlValueContainer: subJsonHtmlValueContainer
        };
    }

    ///<summary>
    /// Update value containers of the sub json when a user switches the view of this sub json.
    ///</summary>
    this.updateSubJsonValueContainer = function (switchViewButton) {
        try {
            var btnContainer = switchViewButton.parentElement;
            var subJsonKey = (btnContainer.id.split('_')[1] || '').replace('LabelContainer', '');

            var ret = self.getSubJsonObjectAndHTMLValueContainer(btnContainer);
            var subJsonObject = ret.subJsonObject;
            var subJsonHtmlValueContainer = ret.subJsonHtmlValueContainer;
            var subJsonMetadataObject = ret.subJsonMetadataObject;

            var validationPath;
            var parentContainer = subJsonHtmlValueContainer && subJsonHtmlValueContainer.parentElement;
            if (!parentContainer) {
                return;
            }

            var labelContainer = parentContainer.children.find(function (ch) { return ch && ch.id && ch.id.indexOf(subJsonKey + "LabelContainer") >= 0; });
            if (!labelContainer) {
                return;
            }

            var _validationButton = labelContainer.children.find(function (ch) { return ch && ch.getAttribute('property-validation-path'); });
            if (_validationButton) {
                validationPath = _validationButton.getAttribute('property-validation-path');
                self.showOrHideValidationMessageInViewSwitch(validationPath, switchViewButton.controlMode);
                self.updateValidateButtonIcon(validationPath, switchViewButton.controlMode);
            }

            // Clear the value container and redraw the container
            subJsonHtmlValueContainer.innerHTML = '';

            if (switchViewButton.controlMode === "JSON" || !self.isValidNonEmptyJson(subJsonObject)) {
                if (typeof subJsonObject === 'string' && subJsonObject.length > 0) {
                    switchViewButton.controlMode = "JSON"; // Make it JSON mode when it is non-empty string
                }

                self.createTextAreaJsonEditor(subJsonHtmlValueContainer, subJsonKey, subJsonObject, switchViewButton);
            } else {
                // Only call updateView when switching back to Tree Mode and the json is valid and non-empty
                var clonedContext = self.cloneContext();
                clonedContext.parameters.value.raw = JSON.stringify(subJsonObject);

                var jsnc = new MscrmControls.Metadata.MetadataControl();
                jsnc.init({}, function () { });
                jsnc._metadataProvider._metadataJson = subJsonMetadataObject && typeof subJsonMetadataObject === 'object' && Object.keys(subJsonMetadataObject).length !== 0 ? JSON.stringify(subJsonMetadataObject) : null;

                var rootNodeOfUpdatedView = jsnc.updateView(clonedContext);

                // Find the target updated view data which will be displayed under this clicked button
                var targetNodeOfUpdatedView;
                for (var c = 0; c < rootNodeOfUpdatedView.children.length; c++) {
                    var child = rootNodeOfUpdatedView.children[c];
                    if (!child)
                        continue;

                    // When id = labelKey + "LabelContainer", its children is just those switch/collapse button elements
                    // When id = labelKey + "Container", its children is elements corresponding to the subjson
                    // subJsonHtmlValueContainer will be used as the parent container. nullContainer is just used to find its all children
                    if (child.componentId && child.componentId.indexOf('nullContainer') >= 0) { // subJsonHtmlValueContainer will be used 
                        targetNodeOfUpdatedView = child;
                        break;
                    }
                }

                if (targetNodeOfUpdatedView && targetNodeOfUpdatedView.children) {
                    for (var ithChild = 0; ithChild < targetNodeOfUpdatedView.children.length; ithChild++) {
                        var childNode = targetNodeOfUpdatedView.children[ithChild];
                        if (!childNode)
                            continue;

                        var pKey = childNode._properties.key || childNode._properties.descriptor.DomId;
                        var pKeyShort = pKey && pKey.replace('Label', '').replace('Container', '').replace('MetadataControl-', '');

                        validationPath = validationPath === 'null' ? null : validationPath;
                        childNode.path = validationPath ? validationPath + pathConnector + pKeyShort : pKeyShort;
                        childNode.validationPath = validationPath ? validationPath + pathConnector + pKeyShort : pKeyShort;

                        // Check if this node contains any json object child node
                        if (childNode.componentId && childNode.componentId.indexOf("LabelContainer") >= 0) {
                            var valueNode = targetNodeOfUpdatedView.children[ithChild + 1];
                            if (self.checkJsonWhenHavingMetadataAndRenderInvalidJsonAsTextArea(subJsonHtmlValueContainer, childNode, valueNode, switchViewButton.controlMode)) {
                                ithChild += 1; // skip the valueContainer
                                continue;
                            }
                        }

                        self.renderControlInternal(subJsonHtmlValueContainer, childNode, switchViewButton.controlMode);
                    }
                }
            }

            self.applyCustomColors();
        } catch (err) {
            console.error(err);
        }
    }

    ///<summary>
    /// General handler which handles the event when JSON is edited.
    ///</summary>
    this.onJsonAreaChange = function (editor, event, switchViewButton) {
        var isMainEditor = editor.getAttribute('main-editor') === 'true';
        var nv = self.getValueFromEvent(event);
        // Replace smart quotes with straight quotes => fix the issue that smart/curly quotes of iOS won't work for JSON control
        nv = nv.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
        event.target.value = nv;

        var newObject, validationPath;
        try {
            newObject = self.getObjectDataFromFieldValue(nv.replace(/{\s*}/, '""'));//replace empty braces with quotes to prevent unwanted MetadataControlDefaultId field from rendering
        } catch (e) {
            newObject = nv;
        }

        if (isMainEditor) {
            objectData = newObject;
            validationPath = "null";
        } else {
            // child object JSON editing
            var subJsonKey = editor.getAttribute('sub-json-key'), validationPathSegments = [], nodeProps = [];
            var validationButton = switchViewButton.parentElement.querySelectorAll("button").find(function (b) {
                return b.id && b.id.indexOf(subJsonKey + "errorContainer") >= 0;
            });

            var nodePath = validationButton.getAttribute("property-validation-path");
            if (!nodePath) {
                objectData[subJsonKey] = newObject;
            } else {
                nodeProps = nodePath.split(pathConnector);
                var obj = objectData;
                for (var i = 0; i < nodeProps.length; i++) {
                    var p = nodeProps[i].replace('Container', '');
                    validationPathSegments.push(p);
                    if (p === subJsonKey && i === nodeProps.length - 1) {
                        obj[p] = newObject;
                        break;
                    }

                    if (obj[p]) {
                        obj = obj[p];
                    }
                }

                validationPath = validationPathSegments.length ? validationPathSegments.join(pathConnector) : "null";
            }
        }

        // Disalbe the switchViewButton when the subJons is invalid json
        switchViewButton.style.display = self.isValidJson(newObject) ? "block" : "none";

        // Update Validation message and icon
        self.validateObjectMetadata(validationPath);
        self.updateValidateButtonIcon(validationPath, switchViewButton.controlMode);
        self.updateValidationMessage(validationPath, true);

        self.saveJsonObjectToField();

        if (switchViewButton && switchViewButton.controlMode === 'Designer' && self.isValidNonEmptyJson(newObject)) {
            switchViewButton.controlMode = "JSON";
            switchViewButton.click();
        }
    }

    this.createTextAreaJsonEditor = function (subJsonHtmlValueContainer, subJsonKey, subJsonObject, switchViewButton) {
        var textAreaContainer = document.createElement('div');
        textAreaContainer.id = uuid() + "_" + "text-box-container";
        textAreaContainer.classList.add('jsonctrl-property-container');

        var textArea = document.createElement('textarea');
        textArea.id = uuid() + "_" + subJsonHtmlValueContainer.componentId + "-text-box-text";
        textArea.setAttribute('sub-json-key', subJsonKey);
        textArea.rows = 4;
        textArea.value = self.getJsonStringFromObject(subJsonObject);
        if (subJsonHtmlValueContainer.id.indexOf("nullContainer") >= 0) {
            textArea.setAttribute('main-editor', "true");
        }

        textArea.oninput = function (event) { self.onJsonAreaChange(textArea, event, switchViewButton); };
        // Disalbe the switchViewButton when the subJons is invalid json
        switchViewButton.style.display = self.isValidJson(subJsonObject) ? "block" : "none";

        if (options.readonly) {
            textArea.readOnly = true;
        }

        textAreaContainer.appendChild(textArea);
        subJsonHtmlValueContainer.appendChild(textAreaContainer);
    }

    this.updateButtonInnerElements = function (btn) {
        // update button inner elements
        var btnSpan;
        if (btn && btn.componentId.indexOf(expandCollapseContainerIdentifier) >= 0) {
            btnSpan = btn.children[0];
            while (btnSpan && btnSpan.classList.length > 0) {
                btnSpan.classList.remove(btnSpan.classList.item(0));
            }

            btnSpan.classList.add(btn.collapsed ? 'expand-button' : 'collapse-button');
        } else if (btn.componentId.indexOf(textDesignerContainerIdentifier) >= 0) {
            btnSpan = btn.children[0];
            while (btnSpan && btnSpan.classList.length > 0) {
                btnSpan.classList.remove(btnSpan.classList.item(0));
            }

            if (btn.controlMode === "JSON") {
                btnSpan.classList.add('switch-to-designer-view');
            } else {
                btnSpan.classList.add('switch-to-json-view');
            }
        }
    }

    this.switchViewButtonOnClick = function (btn) {
        var btnContainer = btn.parentElement;

        // check if subJsonValueContainer is collapsed
        var isCollapsed = false;
        for (var i = 0; i < btnContainer.children.length; i++) {
            var b = btnContainer.children[i];
            if (b && b.componentId.indexOf(expandCollapseContainerIdentifier) >= 0) {
                isCollapsed = b.collapsed;
                break;
            }
        }

        btn.controlMode = btn.controlMode === 'JSON' ? 'Designer' : 'JSON';
        if (!isCollapsed) {
            self.updateSubJsonValueContainer(btn);
        }

        self.updateButtonInnerElements(btn);
    }

    this.expandCollapseButtonOnClick = function (btn) {
        // For each sub-json which needs to be expanded or collapsed, it will have a key / label
        var btnContainer = btn.parentElement;

        // subJsonContainer is the container including both label/button Container and sub-json/value Container
        var subJsonContainer = btnContainer.parentElement;
        if (!subJsonContainer) {
            return; // It should not be at all
        }

        var subJsonKey = (btnContainer.id.split('_')[1] || '').replace('LabelContainer', '');

        // Find the valueContainer of this sub-json
        var valueContainerToCollapseOrExpand;
        for (var i = 0; i < subJsonContainer.children.length; i++) {
            var e = subJsonContainer.children[i];
            if (e && e.id.indexOf(subJsonKey + 'Container') >= 0) {
                valueContainerToCollapseOrExpand = e;
                break;
            }
        }
        if (!valueContainerToCollapseOrExpand) {
            return;
        }

        if (valueContainerToCollapseOrExpand.innerHTML) {
            // Collapse - remove content of the container being collapsed.
            valueContainerToCollapseOrExpand.innerHTML = '';
            btn.collapsed = true;
        } else {
            // Expand - redraw the container
            btn.collapsed = false;

            var labelKey = btn.id.substring(btn.id.indexOf("_") + 1, btn.id.indexOf(expandCollapseContainerIdentifier));
            var switchViewButton = btn.parentElement.querySelectorAll("button").find(function (b) {
                return b.id && b.id.indexOf(labelKey + textDesignerContainerIdentifier) >= 0;
            });

            self.updateSubJsonValueContainer(switchViewButton);
        }

        self.updateButtonInnerElements(btn);
    }

    this.checkJsonWhenHavingMetadataAndRenderInvalidJsonAsTextArea = function (container, labelNode, valueNode, controlMode) {
        // When there is metadata and the mode is Designer, need to check if the subJson is valid and non-empty
        // Case 1: save invalid json data and reopen the form 
        // Case 2: enter invalid data at a level and click higher-level switch button twice
        if (metadataJson && controlMode === 'Designer') {
            var ret = self.getSubJsonObjectAndSubJsonMetadataObjectFromValidationPath(labelNode.validationPath);
            if (!self.isValidNonEmptyJson(ret.subJsonObject)) {
                // Render buttons for this Label Container
                self.renderControlInternal(container, labelNode, controlMode);

                // Render the valueContainer as a text area
                var subJsonHtmlValueContainer = document.createElement('div');
                subJsonHtmlValueContainer.id = uuid() + "_" + valueNode.componentId;
                subJsonHtmlValueContainer.componentId = valueNode.componentId;
                subJsonHtmlValueContainer.path = valueNode.path;
                subJsonHtmlValueContainer.validationPath = valueNode.validationPath;
                if (valueNode.path) {
                    subJsonHtmlValueContainer.setAttribute('node-path', valueNode.path);
                }
                subJsonHtmlValueContainer.classList.add('jsonctrl-property-container');

                var subJsonKey = valueNode.componentId && valueNode.componentId.replace('Container', '');
                var switchViewButton = container.querySelectorAll("button").find(function (b) {
                    return b.id && b.id.indexOf(subJsonKey + textDesignerContainerIdentifier) >= 0;
                });
                if (typeof ret.subJsonObject === 'string' && ret.subJsonObject.length > 0) {
                    switchViewButton.controlMode = "JSON"; // Make it JSON mode when it is non-empty string
                }

                self.updateButtonInnerElements(switchViewButton);

                self.createTextAreaJsonEditor(subJsonHtmlValueContainer, subJsonKey, ret.subJsonObject, switchViewButton);
                container.append(subJsonHtmlValueContainer);

                // Update Validation button
                if (!self.validationState.PropertyValidations[labelNode.validationPath]) {
                    self.validateObjectMetadata(labelNode.validationPath);
                }

                self.updateValidateButtonIcon(labelNode.validationPath, controlMode);
                self.updateValidationMessage(labelNode.validationPath, true);
                return true; // Json is invalid or tempty and render a text area
            } else {
                return false; // Json is valid and non-empty
            }
        } else {
            return false; // Json is valid and non-empty
        }
    }
    //#endregion

    //#region *** General Utils Functions ***
    this.isValidJson = function (data) {
        try {
            if (typeof data === 'object' || data === '') { // If it is empty, we still consider it valid so as not to show validation error
                return true;
            } else {
                var json = JSON.parse(data);
                return typeof json === 'object';
            }
        } catch (e) {
            return false;
        }
    }

    this.getJsonStringFromObject = function (jsonObject) {
        try {
            if (typeof jsonObject !== "object") {
                return jsonObject;
            }

            if (Object.keys(jsonObject).length === 0) { // jsonObject is {}
                return "";
            }

            return JSON.stringify(jsonObject);
        } catch (e) {
            console.error(e);
        }
    }

    this.saveJsonObjectToField = function () {
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            var entity = entityForm && entityForm.entity;
            if (entity && entity.properties) {
                entity.properties[fieldName] = self.getFieldValue();
            }
            return true;
        });
    }

    this.cloneContext = function () {
        var newContext = {};
        for (var p in context) {
            newContext[p] = context[p];
        }
        return newContext;
    }

    // A special null container is generated when the objectData is empty json or invalid json
    this.isNullContainer = function (node) {
        return node !== undefined && node !== null && node.componentId !== undefined && node.componentId.indexOf("nullContainer") >= 0 && node.children !== undefined && node.children.length === 2 && node.children[0] === null &&
            node.children[1]._type === "MscrmControls.FieldControls.TextBoxControl";
    }

    this.reRenderTree = function () {
        var rootJson = JSON.stringify(objectData);
        var ctx1 = self.cloneContext();
        ctx1.parameters.value.raw = rootJson;
        var ctrl = new MscrmControls.Metadata.MetadataControl();
        ctrl.init({}, function () { });
        var newData = ctrl.updateView(ctx1);
        controlContainer.innerHTML = '';
        self.renderControlInternal(null, newData, 'Designer');
    }

    this.getValueFromEvent = function (event) {
        var v1 = event.srcElement && event.srcElement.value,
            v2 = event.target && event.target.value;
        return v1 || v2;
    }

    this.checkHideOrDisableField = function (fieldDivContainer, attributes) {
        if (attributes.hasOwnProperty("Visible") && !attributes["Visible"]) {
            fieldDivContainer.style.display = "none";
        }

        if (attributes.hasOwnProperty("Editable") && !attributes["Editable"]) {
            var inputElements = fieldDivContainer.querySelectorAll("input, select, checkbox, textarea");
            inputElements.forEach(function (element) {
                element.readOnly = true;
            });
        }
    }

    this.applyStyle = function (style, element) {
        if (!style || !element) {
            return;
        }

        for (var i in style) {
            var ps = style[i];
            element.style[i] = ps;
        }
    }

    this.isObjectArray = function (object) {
        if (typeof Array.isArray === 'undefined') {
            Array.isArray = function (obj) {
                return Object.prototype.toString.call(obj) === '[object Array]';
            };
        }

        return Array.isArray(object);
    }

    this.triggerOnChangeForActiveElement = function () {
        var activeElement = document.activeElement;
        if (activeElement.nodeName === "INPUT" || activeElement.nodeName === "TEXTAREA") {
            activeElement.dispatchEvent(new Event('change'));
        }
    }

    this.getFieldValue = function () {
        var fieldValue = self.getJsonStringFromObject(objectData);
        return fieldValue === '' ? null : fieldValue;
    }

    ///<summary>
    /// This method checks if the entered value meets the metadata requirements
    ///</summary>
    this.validateAndParseOnChange = function (metadataObject, nv) {
        var metadataType = metadataObject && metadataObject.Type || 'string';
        var retValue;
        if (metadataType) {
            var minValue = metadataObject["MinValue"] !== undefined ? metadataObject["MinValue"] : Number.MIN_SAFE_INTEGER;
            var maxValue = metadataObject["MaxValue"] !== undefined ? metadataObject["MaxValue"] : Number.MAX_SAFE_INTEGER;
            switch (metadataType.toLowerCase()) {
                case 'int':
                case 'int32':
                case 'decimal':
                    retValue = !isNaN(nv) ? parseInt(nv) : 0;
                    if (retValue < minValue)
                        retValue = minValue;
                    else if (retValue > maxValue)
                        retValue = maxValue;

                    break;
                case 'double':
                    var precision = metadataObject["Precision"] !== undefined ? metadataObject["Precision"] : 0;
                    retValue = !isNaN(nv) ? parseFloat(nv) : 0;
                    if (retValue < minValue)
                        retValue = minValue;
                    else if (retValue > maxValue)
                        retValue = maxValue;

                    var factor = Math.pow(10, precision);
                    var tempNumber = retValue * factor;
                    var roundedTempNumber = Math.round(tempNumber);
                    retValue = roundedTempNumber / factor;
                    break;
                case 'string':
                    if (metadataObject["MaxLength"] && nv.length > metadataObject["MaxLength"]) {
                        retValue = nv.substring(0, metadataObject["MaxLength"]);
                    } else {
                        retValue = nv;
                    }
                    break;
                case 'datetime':
                    var enteredDate = moment(nv).format('YYYY-MM-DDTHH:mm');
                    var minData = metadataObject["MinValue"];
                    var maxDate = metadataObject["MaxValue"];
                    if (minData && moment(minData).isAfter(enteredDate)) {
                        enteredDate = moment(minData).format('YYYY-MM-DDTHH:mm');
                    }

                    if (maxDate && moment(maxDate).isBefore(enteredDate)) {
                        enteredDate = moment(maxDate).format('YYYY-MM-DDTHH:mm');
                    }

                    if (moment(nv).isValid()) {
                        retValue = enteredDate;
                    } else {
                        retValue = "";
                    }
                    break;
                default:
                    retValue = nv;
                    break;
            }
        }
        return retValue;
    }

    this.setDirty = function (isDirty) {
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            entityForm["isDirty"] = isDirty;
            return true;
        });

    }
    //#endregion

    //#region *** Custom Colors functions *** 
    this.applyCustomColors = function () {
        var titles = document.getElementsByClassName('title-paragraph');
        setHtmlElementsColor(titles, self.colors.FormItemLabelForeground);

        if (self.colors.FormItemLabelForeground !== defaultColor) {
            var labels = document.getElementsByTagName('label');
            setHtmlElementsColor(labels, self.colors.FormItemLabelForeground);
        }

        var inputs = document.getElementsByTagName('input');
        setHtmlElementsColor(inputs, self.colors.FormItemForeground);

        var jsonControlButtons = document.getElementsByClassName('json-control-btn-default');
        setHtmlElementsColor(jsonControlButtons, self.colors.FormItemForeground);

        var booleanSwitchLabel = document.querySelectorAll('span.boolean-switch-label');
        setHtmlElementsColor(booleanSwitchLabel, self.colors.FormItemForeground);

        function setHtmlElementsColor(htmlElementsCollection, color) {
            for (var i = 0; i < htmlElementsCollection.length; i++) {
                htmlElementsCollection[i].style.color = color;
            }
        }
    }

    this.downloadCustomColors = function (callback, colorsNames) {
        const requiredColor = colorsNames.find(colorName => self.colors[colorName] === null);
        if (requiredColor === undefined) {
            callback();
            return;
        }

        MobileCRM.Application.getAppColor(requiredColor, (color) => {
            self.colors[requiredColor] = color;
            self.downloadCustomColors(callback, colorsNames);
        });
    }
    //#endregion
};