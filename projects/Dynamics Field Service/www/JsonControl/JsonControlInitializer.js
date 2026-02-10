(function (w) {
        w.Xrm = w.Xrm || {};
        w.Xrm.Page = w.Xrm.Page || {};
        w.Xrm.Page.context = w.Xrm.Page.context || {};
        if (typeof w.Xrm.Page.context.getClientUrl == 'undefined') {
            w.Xrm.Page.context.getClientUrl = function () {
                return ""; // is not used in the mobile, only in web
            };
        }
})(window);