var Resco;
(function (Resco) {
    var Utils = (function () {
        function Utils() {
        }
        Utils.ReplaceVariable = function (template, variableName, variableValue) {
            return template.replace(new RegExp(Resco.Utils.escapeRegExp(variableName), 'g'), variableValue);
        };
        Utils.PrepareHTMLTemplateSimple = function (template, name, label) {
            var _HTML = Resco.Utils.ReplaceVariable(template, "{{Name}}", name);
            _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{Label}}", label);
            return _HTML;
        };
        Utils.PrepareHTMLTemplate = function (template, replaceWith) {
            var _HTML = template;
            for (var i in replaceWith) {
                _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{" + i + "}}", replaceWith[i]);
            }
            return _HTML;
        };
        Utils.escapeRegExp = function (string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        Utils.GenerateRandomGUID = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };
        Utils.IsRunningInMobileApp = function () {
            if (MobileCRM.bridge)
                return true;
            else
                return false;
        };
        Utils.DisplayError = function (error) {
            Resco.Utils.DisplayAlert("Error", error);
        };
        Utils.DisplayAlert = function (title, message) {
            Resco.Utils.DisplaySimpleConfirmation(title, message, function () { });
        };
        Utils.DisplaySimpleConfirmation = function (title, message, callback) {
            var confirm = $["confirm"];
            confirm({
                animationBounce: 1, animationSpeed: 200,
                animation: 'opacity', closeAnimation: 'opacity',
                title: title, content: message, buttons: { ok: callback }
            });
        };
        Utils.WriteToLocalFile = function (path, text, append, success, failed, scope) {
            if (MobileCRM.bridge)
                MobileCRM.Application.writeFile(path, text, append, success, failed, scope);
            else
                success();
        };
        Utils.ReadFromLocalFile = function (path, success, failed, scope) {
            if (MobileCRM.bridge)
                MobileCRM.Application.readFile(path, success, failed, scope);
            else
                success("Not implemented");
        };
        Utils.FileExists = function (path, success, failed, scope) {
            if (MobileCRM.bridge)
                MobileCRM.Application.fileExists(path, success, failed, scope);
            else
                success(false);
        };
        Utils.DeleteFile = function (path, success, failed, scope) {
            if (MobileCRM.bridge)
                MobileCRM.Application.deleteFile(path, success, failed, scope);
            else
                success();
        };
        Utils.SafeString = function (text) {
            if (!text)
                return "";
            else
                return text;
        };
        return Utils;
    }());
    Resco.Utils = Utils;
})(Resco || (Resco = {}));
