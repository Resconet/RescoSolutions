var Resco;
(function (Resco) {
    var UI;
    (function (UI) {
        var Components;
        (function (Components) {
            var Process;
            (function (Process) {
                var ProcessStateItem = (function () {
                    function ProcessStateItem(state, imageName, clickAction, template) {
                        this.m_defaultTemplate = "<a href='#' id='{{Name}}' class='process-steps {{AddClass}}'><img src='Images/ProcessNavigation/{{ImageName}}' alt='{{Label}}' class='process-navigation-icon'></a>";
                        this.state = state;
                        this.imageName = imageName;
                        this.template = (template ? template : this.m_defaultTemplate);
                        this.clickAction = clickAction;
                    }
                    return ProcessStateItem;
                }());
                Process.ProcessStateItem = ProcessStateItem;
                var ProcessNavigation = (function () {
                    function ProcessNavigation(name, label, processComponent) {
                        this.m_defaultTemplate = "<div id='{{Name}}' class='process-navigation'></div>";
                        this.m_defaultDividerTemplate = "<img src='Images/ProcessNavigation/arrow_right.png' alt='arrow' class='process-arrow_right'>";
                        this.name = name;
                        this.label = label;
                        this.processComponent = processComponent;
                        this.stateItems = new Array();
                        this.template = this.m_defaultTemplate;
                        this.dividerTemplate = this.m_defaultDividerTemplate;
                    }
                    ProcessNavigation.prototype.AddItem = function (item) {
                        this.stateItems.push(item);
                    };
                    ProcessNavigation.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.ReplaceVariable(this.template, "{{Name}}", this.name);
                        where.prepend(_HTML);
                        var navigation = where.find("#" + this.name);
                        for (var i = 0; i < this.stateItems.length; i++) {
                            this.RenderItem(navigation, this.stateItems[i]);
                            if (i != this.stateItems.length - 1)
                                this.RenderDivider(navigation);
                        }
                    };
                    ProcessNavigation.prototype.RenderItem = function (where, item) {
                        var _HTML = Resco.Utils.ReplaceVariable(item.template, "{{Name}}", item.state.name);
                        _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{Label}}", item.state.label);
                        var imageName = (item.state.complete ? "Complete/" + item.imageName : item.imageName);
                        _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{ImageName}}", imageName);
                        var additionalClass = (item.state == this.processComponent.currentState ? "current" : "");
                        _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{AddClass}}", additionalClass);
                        where.append(_HTML);
                        var _item = where.find("#" + item.state.name);
                        _item.click(item.clickAction.bind(this));
                    };
                    ProcessNavigation.prototype.RenderDivider = function (where) {
                        where.append(this.dividerTemplate);
                    };
                    ProcessNavigation.prototype.HandleItemClick = function (event) {
                        var id = event.target.id;
                        var items = this.stateItems.filter(function (item) { return item.state.name === id; });
                        var item = items && items.length > 0 ? items[0] : null;
                        if (item && item.clickAction) {
                            item.clickAction();
                        }
                    };
                    return ProcessNavigation;
                }());
                Process.ProcessNavigation = ProcessNavigation;
            })(Process = Components.Process || (Components.Process = {}));
        })(Components = UI.Components || (UI.Components = {}));
    })(UI = Resco.UI || (Resco.UI = {}));
})(Resco || (Resco = {}));
