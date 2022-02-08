var Resco;
(function (Resco) {
    var UI;
    (function (UI) {
        var Components;
        (function (Components) {
            var Process;
            (function (Process) {
                var ProcessFooter = (function () {
                    function ProcessFooter(name, label, processComponent) {
                        this.m_defaultTemplate = "<div id='{{Name}}' class='next-previous-container'>\
			<a id='{{Name}}_prev' class='previous pagination'>« Previous</a>\
			<a id='{{Name}}_next' class='next pagination' >Next »</a>\
		</div>";
                        this.m_defaultDividerTemplate = "<img src='Images/ProcessNavigation/arrow_right.png' alt='arrow' class='process-arrow_right'>";
                        this.name = name;
                        this.label = label;
                        this.processComponent = processComponent;
                        this.template = this.m_defaultTemplate;
                    }
                    ProcessFooter.prototype.Render = function (where) {
                        this.m_where = where;
                        var _HTML = Resco.Utils.ReplaceVariable(this.template, "{{Name}}", this.name);
                        where.append(_HTML);
                        var _item = where.find("#" + this.name + "_prev");
                        _item.click(this.ClickedPrev.bind(this));
                        _item = where.find("#" + this.name + "_next");
                        _item.click(this.ClickedNext.bind(this));
                    };
                    ProcessFooter.prototype.ClickedPrev = function (event) {
                        this.processComponent.MoveToPreviousState();
                    };
                    ProcessFooter.prototype.ClickedNext = function (event) {
                        this.processComponent.MoveToNextState();
                    };
                    ProcessFooter.prototype.RefreshFooter = function () {
                        if (this.processComponent.currentState.name == "category") {
                            this.m_where.find("#" + this.name + "_prev").hide();
                        }
                        else if (this.processComponent.currentState.name == "comments") {
                            this.m_where.find("#" + this.name + "_next").hide();
                        }
                        else {
                            this.m_where.find(".pagination").show();
                        }
                    };
                    return ProcessFooter;
                }());
                Process.ProcessFooter = ProcessFooter;
            })(Process = Components.Process || (Components.Process = {}));
        })(Components = UI.Components || (UI.Components = {}));
    })(UI = Resco.UI || (Resco.UI = {}));
})(Resco || (Resco = {}));
