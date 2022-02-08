var Resco;
(function (Resco) {
    var UI;
    (function (UI) {
        var Components;
        (function (Components) {
            var ProcessState = (function () {
                function ProcessState(name, label) {
                    this.name = name;
                    this.label = label;
                    this.complete = false;
                }
                return ProcessState;
            }());
            Components.ProcessState = ProcessState;
        })(Components = UI.Components || (UI.Components = {}));
    })(UI = Resco.UI || (Resco.UI = {}));
})(Resco || (Resco = {}));
