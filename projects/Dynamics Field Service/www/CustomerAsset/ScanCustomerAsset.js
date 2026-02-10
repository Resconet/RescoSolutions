var FS = FS || {};

FS.ScanCustomerAsset = {
    localization: null,
    scanCustomerAssetButtonId: "ScanCustomerAssetButton",

    customerAssetOnLoad: function (goNow) {
        MobileCRM.Localization.initialize(FS.ScanCustomerAsset.storeLocalization, MobileCRM.bridge.alert);
        FS.ScanCustomerAsset.changeButtonColor();
        MobileCRM.UI.IFrameForm.requestObject(function (iFrame) {
            if (iFrame && iFrame.form && iFrame.form.caption)
                iFrame.form.caption = "";
        }, MobileCRM.bridge.alert, null);
        if (goNow) {
            FS.ScanCustomerAsset.scanCustomerAsset();
        }
    },

    changeButtonColor: function () {
        // Overrides default white background and black text to the apps styles
        MobileCRM.Application.getAppColor("TitleBackground", function (backgroundColor) {
            MobileCRM.Application.getAppColor("TitleForeground", function (foregroundColor) {
                if (backgroundColor && foregroundColor) {
                    var element = document.getElementById(FS.ScanCustomerAsset.scanCustomerAssetButtonId);
                    if (element) {
                        element.style.backgroundColor = backgroundColor;
                        element.style.color = foregroundColor;                        element.style.borderColor = backgroundColor;
                    }
                }
            }, MobileCRM.bridge.alert);
        }, MobileCRM.bridge.alert);
    },

    scanCustomerAsset: function () {
        MobileCRM.Platform.scanBarCode(function (res) {
            if (res && res.length > 0) {
                // If the code is an id for a Customer Asset in the db, open the Customer Asset form
                MobileCRM.DynamicEntity.loadById(FS.Schema.CustomerAsset.name, res[0], function (customerAsset) {
                    MobileCRM.UI.FormManager.showEditDialog(FS.Schema.CustomerAsset.name, customerAsset.id, null);
                }, function (error) {
                    MobileCRM.bridge.alert(FS.ScanCustomerAsset.localization.get("Alert.BadBarcode"));
                });
            }
            else if (FS.ScanCustomerAsset.localization) {
                MobileCRM.bridge.alert(FS.ScanCustomerAsset.localization.get("Alert.NoBarcode"));
            }
            else {
                MobileCRM.bridge.alert("No barcode");
            }
        }, function (error) {
                if (error !== "Failed")
                {
                    MobileCRM.bridge.alert(error);
                }
        });
    },

    storeLocalization: function (localization) {
        FS.ScanCustomerAsset.localization = localization;
        document.getElementById(FS.ScanCustomerAsset.scanCustomerAssetButtonId).value = FS.ScanCustomerAsset.localization.get("Cmd.ScanCustomerAsset");
    }
};