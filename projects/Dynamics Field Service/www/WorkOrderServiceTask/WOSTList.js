/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Common.js" />

var FS = FS || {};

FS.WOSTList = {
    wostlOnLoad: function () {
        MobileCRM.UI.EntityList.onCommand(FS.Common.CustomCommands.customMarkCompleteList, FS.WOSTList.markComplete, true, null);
    },

    markComplete: function (entityList) {
        var selectedEntities = entityList && entityList.context && entityList.context.entities;
        if (selectedEntities) {
            for (var i = 0; i < selectedEntities.length; i++) {
                if (selectedEntities[i]) {
                    FS.MarkCompleteHelper.loadWOSTAndComplete(selectedEntities[i].id);
                }
            }
        }
    }
};