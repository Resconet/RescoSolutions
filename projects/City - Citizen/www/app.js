var _this = this;
var Program = (function () {
    function Program() {
    }
    Object.defineProperty(Program, "Instance", {
        get: function () {
            if (!Program.s_instance) {
                Program.s_instance = new Program();
            }
            return Program.s_instance;
        },
        enumerable: true,
        configurable: true
    });
    Program.prototype.Run = function () {
        this.DisableiOSScrolling();
        this.ProcessComponent = new Resco.UI.Components.ProcessComponent("process", "Add Report");
        this.ProcessComponent.Initialize(this.StartRender.bind(this));
    };
    Program.prototype.StartRender = function () {
    };
    Program.prototype.DisableiOSScrolling = function () {
        if (MobileCRM.bridge && MobileCRM.bridge.platform == "iOS") {
            MobileCRM.bridge.command("setScrollBounce", false);
        }
    };
    return Program;
}());
window.onload = function () {
    if (Resco.Utils.IsRunningInMobileApp()) {
        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            if (entityForm.entity.isNew)
                Program.Instance.Run();
        }, MobileCRM.bridge.alert, _this);
    }
    else
        Program.Instance.Run();
};
