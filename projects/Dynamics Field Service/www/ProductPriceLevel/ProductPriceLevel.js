var FS = FS || {};

FS.ProductPriceLevel = {
    localization: null,

    productPriceLevelOnLoad: function () {
        MobileCRM.UI.EntityForm.onSave(FS.ProductPriceLevel.handleSave, true, null);
        MobileCRM.Localization.initialize(FS.ProductPriceLevel.storeLocalization, MobileCRM.bridge.alert);
    },

    storeLocalization: function (localization) {
        FS.ProductPriceLevel.localization = localization;
    },

    handleSave: function (entityForm) {
        var saveHandler = entityForm.suspendSave();

        var entity = entityForm && entityForm.entity;
        var priceList = entity && entity.properties && entity.properties[FS.Schema.ProductPriceLevel.properties.priceLevelId];
        var product = entity && entity.properties && entity.properties[FS.Schema.ProductPriceLevel.properties.productId];
        var unit = entity && entity.properties && entity.properties[FS.Schema.ProductPriceLevel.properties.uoMId];
        var productPriceLevelId = entity && entity.properties && entity.properties[FS.Schema.ProductPriceLevel.properties.productPriceLevelId];

        // Need to verify that no other product price level record has this same combination of price list, product, and unit
        if (priceList && product && unit) {
            var fetchSimilarProductPriceLevels = new MobileCRM.FetchXml.Entity(FS.Schema.ProductPriceLevel.name);
            fetchSimilarProductPriceLevels.addAttribute(FS.Schema.ProductPriceLevel.properties.priceLevelId);
            fetchSimilarProductPriceLevels.addAttribute(FS.Schema.ProductPriceLevel.properties.productId);
            fetchSimilarProductPriceLevels.addAttribute(FS.Schema.ProductPriceLevel.properties.uoMId);
            fetchSimilarProductPriceLevels.filter = new MobileCRM.FetchXml.Filter();
            fetchSimilarProductPriceLevels.filter.where(FS.Schema.ProductPriceLevel.properties.priceLevelId, "eq", priceList.id);
            fetchSimilarProductPriceLevels.filter.where(FS.Schema.ProductPriceLevel.properties.productId, "eq", product.id);
            fetchSimilarProductPriceLevels.filter.where(FS.Schema.ProductPriceLevel.properties.uoMId, "eq", unit.id);
            fetchSimilarProductPriceLevels.filter.where(FS.Schema.ProductPriceLevel.properties.productPriceLevelId, "ne", productPriceLevelId);
            var fetch = new MobileCRM.FetchXml.Fetch(fetchSimilarProductPriceLevels);

            fetch.execute("Array", function (results) {
                if (results && results.length > 0) {
                    saveHandler.resumeSave(FS.ProductPriceLevel.localization.get("Alert.UniquePriceListItem"));
                }
                else {
                    saveHandler.resumeSave();
                }
            }, function (error) {
                saveHandler.resumeSave(error);
            }, null);
        }
        // else: these are required fields, so Woodford will alert that one or more of these values is missing and cancel the save before this logic is called
    }
};