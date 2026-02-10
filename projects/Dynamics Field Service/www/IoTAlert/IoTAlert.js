/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
/// <reference path="../IoTUtils/Utils.js" />
var FS = FS || {};

FS.IoTAlert = {
    localization: null,

    ioTAlertOnLoad: function () {
        MobileCRM.Localization.initialize(FS.IoTAlert.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customSendIoTCommand, FS.SendCommandHelper.SendCommandButton.onButtonClick, true, null);

        FS.Utils.formIsValidEndpoint(function (isValid) {
            if (!isValid) {
                MobileCRM.UI.EntityForm.requestObject(
                    function (entityForm) {
                        if (entityForm) {
                            // Disable SendIoTCommand when Service Endpoint is invalid
                            MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customSendIoTCommand, false);
                            if (entityForm.entity && entityForm.entity.properties) {
                                entityForm.entity.properties[FS.Common.SharedVariables.customSendIoTCommandEnabled] = false;
                            }

                            // Hide the tab which has 'create new' permission
                            FS.Utils.hideRightAssociatedView(entityForm, FS.Schema.IoTDeviceCommand.name, true);
                            // Hide the PowerBI tab when Service Endpoint is invalid
                            entityForm.setTabVisibility(FS.Common.TabNames.IoTAlert_PowerBITab, false);
                        }
                    }, FS.Utils.showParsedError, null);
            } else {
                MobileCRM.UI.EntityForm.requestObject(
                    function (entityForm) {
                        // Hide the tab which doesn't have 'create new' permission
                        FS.Utils.hideRightAssociatedView(entityForm, FS.Schema.IoTDeviceCommand.name, false);
                    }, FS.Utils.showParsedError, null);
            }
        }, FS.Utils.showParsedError);
    },

    storeLocalization: function (localization) {
        FS.IoTAlert.localization = localization;
    }
};