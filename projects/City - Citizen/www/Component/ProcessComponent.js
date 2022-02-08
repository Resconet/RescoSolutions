var Resco;
(function (Resco) {
    var UI;
    (function (UI) {
        var Components;
        (function (Components) {
            var ProcessComponent = (function () {
                function ProcessComponent(name, label) {
                    this.isFooterVisible = false;
                    this.states = new Array();
                    this.name = name;
                    this.label = label;
                    this.navigation = null;
                    this.content = new Array();
                    this.footer = null;
                }
                ProcessComponent.prototype.Initialize = function (renderStartCallback) {
                    this.state_Category = new Components.ProcessState("category", "Category");
                    this.state_Photo = new Components.ProcessState("photo", "Photo");
                    this.state_Location = new Components.ProcessState("location", "Location");
                    this.state_Comments = new Components.ProcessState("comments", "Comments");
                    this.states.push(this.state_Category);
                    this.states.push(this.state_Photo);
                    this.states.push(this.state_Location);
                    this.states.push(this.state_Comments);
                    this.navigation = new Resco.UI.Components.Process.ProcessNavigation("navigation", "Navigation", this);
                    var categoryItem = new Resco.UI.Components.Process.ProcessStateItem(this.state_Category, "category_icon.png", this.Click_Category.bind(this));
                    var photoItem = new Resco.UI.Components.Process.ProcessStateItem(this.state_Photo, "photo_icon.png", this.Click_Photo.bind(this));
                    var locationItem = new Resco.UI.Components.Process.ProcessStateItem(this.state_Location, "location_icon.png", this.Click_Location.bind(this));
                    var commentsItem = new Resco.UI.Components.Process.ProcessStateItem(this.state_Comments, "comments_icon.png", this.Click_Comments.bind(this));
                    this.navigation.AddItem(categoryItem);
                    this.navigation.AddItem(photoItem);
                    this.navigation.AddItem(locationItem);
                    this.navigation.AddItem(commentsItem);
                    var categoryContent = new Resco.UI.Components.Process.ProcessContentCategory("category_component", "Category", this.state_Category, this);
                    categoryContent.Initialize();
                    this.content.push(categoryContent);
                    var photoContent = new Resco.UI.Components.Process.ProcessContentPhotoForm("photo_component", "Take a photo", this.state_Photo, "process-container", this);
                    photoContent.Initialize();
                    this.content.push(photoContent);
                    var mapContent = new Resco.UI.Components.Process.ProcessContentMapForm("map_component", "Select location", this.state_Location, "process-container", this);
                    mapContent.Initialize();
                    this.content.push(mapContent);
                    var inputContent = new Resco.UI.Components.Process.ProcessContentFormInputForm("input_component", "Add details", this.state_Comments, "process-container", this);
                    inputContent.Initialize();
                    this.content.push(inputContent);
                    this.footer = new Resco.UI.Components.Process.ProcessFooter("prevnext", "Prev, Next", this);
                    this.currentState = this.state_Category;
                    this.m_initCallbacksCount = 0;
                    this.m_initCallbacksCount++;
                    categoryContent.RetrieveCategories(this.InitialCallbackHandler.bind(this), this.StartFailure.bind(this));
                    this.m_initCallbacksCount++;
                    this.RetrieveConfiguration(this.InitialCallbackHandler.bind(this));
                    this.m_initCallbacksCount++;
                    this.RetrieveConfiguration(this.InitialCallbackHandler.bind(this));
                    if (MobileCRM.bridge) {
                        MobileCRM.UI.EntityForm.onSave(this.SaveHandler, true, this);
                        MobileCRM.UI.EntityForm.onPostSave(this.PostSaveHandler, true, this);
                    }
                };
                ProcessComponent.prototype.InitialCallbackHandler = function () {
                    if (--this.m_initCallbacksCount == 0)
                        this.InitiateDrawing();
                };
                ProcessComponent.prototype.InitiateDrawing = function () {
                    this.Render($(".content"));
                    this.ItemClick(this.states[0]);
                    this.footer.RefreshFooter();
                };
                ProcessComponent.prototype.StartFailure = function (error) {
                    if (MobileCRM.bridge)
                        MobileCRM.bridge.alert(error);
                    else
                        alert(error);
                };
                ProcessComponent.prototype.PostSaveHandler = function (entityForm) {
                    var photoContent = this.content[1];
                    if (!photoContent.photoItem.imageData)
                        return;
                    photoContent.photoItem.note.properties.objectid = new MobileCRM.Reference(entityForm.entity.entityName, entityForm.entity.id);
                    var saveHandler = entityForm.suspendPostSave();
                    photoContent.SaveContent(saveHandler.resumePostSave);
                };
                ProcessComponent.prototype.SaveHandler = function (entityForm) {
                    if (!entityForm.entity.properties.name || !entityForm.entity.properties.incidenttemplateid ||
                        (!entityForm.entity.properties.address1_line1 && !entityForm.entity.properties.address1_latitude && !entityForm.entity.properties.address1_longitude)) {
                        entityForm.context.errorMessage = "Please provide data about the Incident (address, type...)";
                        return true;
                    }
                    if (!entityForm.entity.properties.address1_longitude || !entityForm.entity.properties.address1_latitude)
                        return false;
                    var saveHandler = entityForm.suspendSave();
                    this.DetectDuplicate(entityForm.entity, saveHandler);
                };
                ProcessComponent.prototype.DetectDuplicate = function (originalEntity, saveHandler, showLookup) {
                    if (showLookup === void 0) { showLookup = false; }
                    var entity = new MobileCRM.FetchXml.Entity("incident");
                    entity.addAttribute("name");
                    entity.addAttribute("id");
                    entity.addAttribute("address1_latitude");
                    entity.addAttribute("address1_longitude");
                    var filter = new MobileCRM.FetchXml.Filter();
                    filter.where("incidenttemplateid", "eq", originalEntity.properties.incidenttemplateid.id);
                    filter.notIn("statuscode", [5, 6, 10003, 10004, 10005, 10006]);
                    var rectangle = {};
                    this.GetLatLongRectangle(originalEntity.properties.address1_latitude, originalEntity.properties.address1_longitude, 100, rectangle);
                    filter.where("address1_latitude", "ge", rectangle["latL"]);
                    filter.where("address1_latitude", "le", rectangle["latR"]);
                    filter.where("address1_longitude", "ge", rectangle["longT"]);
                    filter.where("address1_longitude", "le", rectangle["longB"]);
                    entity.filter = filter;
                    var fetch = new MobileCRM.FetchXml.Fetch(entity);
                    fetch.execute("DynamicEntities", function (results) {
                        if (results.length <= 0) {
                            saveHandler.resumeSave();
                            return;
                        }
                        if (showLookup) {
                        }
                        else {
                            var closestId = this.FindClosestRecord(originalEntity.properties.address1_latitude, originalEntity.properties.address1_longitude, results);
                            var popup = new MobileCRM.UI.MessageBox("Possible duplicate found! Do you want to view the duplicate record or proceed with saving?");
                            popup.items = ["View the duplicate", "Proceed with save"];
                            popup.multiLine = true;
                            popup.show(function (button) {
                                if (button == "View the duplicate") {
                                    MobileCRM.UI.FormManager.showEditDialog("incident", closestId, null);
                                    saveHandler.resumeSave("#NoMessage#");
                                }
                                else
                                    saveHandler.resumeSave();
                            });
                        }
                    }, function (err) {
                        this.DuplicateFailure(err, saveHandler);
                    }, this);
                };
                ProcessComponent.prototype.DuplicateFailure = function (error, saveHandler) {
                    saveHandler.resumeSave();
                };
                ProcessComponent.prototype.GetLatLongRectangle = function (lat, long, precisionMeters, output) {
                    var latPrecision = precisionMeters / 111321.0;
                    var longPrecision = Math.abs(precisionMeters / (Math.cos(lat) * 111321.0));
                    output["latL"] = lat - latPrecision;
                    output["latR"] = lat + latPrecision;
                    output["longT"] = long - longPrecision;
                    output["longB"] = long + longPrecision;
                };
                ProcessComponent.prototype.FindClosestRecord = function (lat, long, records) {
                    var result = "";
                    var distance = Number.MAX_VALUE;
                    for (var i = 0; i < records.length; i++) {
                        var curRec = records[i];
                        var latDif = Math.abs(lat) - Math.abs(curRec.properties.address1_latitude);
                        var longDif = Math.abs(long) - Math.abs(curRec.properties.address1_longitude);
                        var diff = Math.sqrt(latDif * latDif + longDif * longDif);
                        if (diff < distance) {
                            distance = diff;
                            result = curRec.id;
                        }
                    }
                    return result;
                };
                ProcessComponent.prototype.RetrieveConfiguration = function (callback) {
                    if (!Resco.Utils.IsRunningInMobileApp) {
                        callback();
                        return;
                    }
                    MobileCRM.Configuration.requestObject(function (config) {
                        var _content = this.content[3];
                        _content.userName = config.settings.customerUserId.primaryName;
                        var _map = this.content[2];
                        var _googleMap = _map.mapItem;
                        _googleMap.googleMapAPIKey = config.settings.googleApiKey;
                        callback();
                    }, this.StartFailure.bind(this), this);
                };
                ProcessComponent.prototype.MoveToPreviousState = function () {
                    switch (this.currentState.name) {
                        case "category":
                            break;
                        case "photo":
                            this.ItemClick(this.state_Category);
                            break;
                        case "location":
                            this.ItemClick(this.state_Photo);
                            break;
                        case "comments":
                            this.ItemClick(this.state_Location);
                            break;
                    }
                };
                ProcessComponent.prototype.MoveToNextState = function () {
                    switch (this.currentState.name) {
                        case "category":
                            this.ItemClick(this.state_Photo);
                            break;
                        case "photo":
                            this.ItemClick(this.state_Location);
                            break;
                        case "location":
                            var inputForm = this.content[3];
                            inputForm.ReloadDataFromForm();
                            this.ItemClick(this.state_Comments);
                            break;
                        case "comments":
                            break;
                    }
                };
                ProcessComponent.prototype.ItemClick = function (state) {
                    switch (state.name) {
                        case "photo":
                            if (!this.state_Category.complete)
                                return;
                            break;
                        case "location":
                            if (!this.state_Photo.complete)
                                return;
                            break;
                        case "comments":
                            if (!this.state_Location.complete)
                                return;
                            break;
                    }
                    if (this.currentState != state) {
                        this.currentState = state;
                        this.RefreshNavigation();
                        this.footer.RefreshFooter();
                    }
                    if (state.name == "location") {
                        var locationContent = this.content[2];
                        var mapItem = locationContent.mapItem;
                        mapItem.RefreshMap();
                    }
                    this.SetContentVisible(state);
                };
                ProcessComponent.prototype.SetContentVisible = function (state) {
                    for (var i = 0; i < this.content.length; i++) {
                        this.content[i].SetVisibility(false);
                    }
                    switch (state.name) {
                        case "category":
                            this.content[0].SetVisibility(true);
                            break;
                        case "photo":
                            this.content[1].SetVisibility(true);
                            break;
                        case "location":
                            this.content[2].SetVisibility(true);
                            break;
                        case "comments":
                            this.content[3].SetVisibility(true);
                            break;
                    }
                };
                ProcessComponent.prototype.Click_Category = function (event) {
                    event.preventDefault();
                    this.ItemClick(this.state_Category);
                };
                ProcessComponent.prototype.Click_Photo = function (event) {
                    event.preventDefault();
                    this.ItemClick(this.state_Photo);
                };
                ProcessComponent.prototype.Click_Location = function (event) {
                    event.preventDefault();
                    this.ItemClick(this.state_Location);
                };
                ProcessComponent.prototype.Click_Comments = function (event) {
                    event.preventDefault();
                    var inputForm = this.content[3];
                    inputForm.ReloadDataFromForm();
                    this.ItemClick(this.state_Comments);
                };
                ProcessComponent.prototype.Render = function (where) {
                    this.m_renderWhere = where;
                    this.navigation.Render(where);
                    for (var i = 0; i < this.content.length; i++) {
                        this.content[i].Render(where);
                    }
                    this.footer.Render(where);
                };
                ProcessComponent.prototype.SetDataObjectValues = function (namesAndValues) {
                    if (Resco.Utils.IsRunningInMobileApp()) {
                        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                            for (var i in namesAndValues) {
                                entityForm.entity.properties[i] = namesAndValues[i];
                            }
                            var incidenttemplate = entityForm.entity.properties["incidenttemplateid"];
                            var incidenttemplatename = (incidenttemplate ? incidenttemplate.primaryName : "");
                            var addressline = entityForm.entity.properties["address1_line1"];
                            var addresscity = entityForm.entity.properties["address1_city"];
                            var addresstext = (addressline ? addressline : addresscity);
                            entityForm.entity.properties["name"] = incidenttemplatename + " @ " + addresstext;
                        }, MobileCRM.bridge.alert, this);
                    }
                };
                ProcessComponent.prototype.RefreshNavigation = function () {
                    this.m_renderWhere.find("#" + this.navigation.name).remove();
                    this.navigation.Render(this.m_renderWhere);
                };
                return ProcessComponent;
            }());
            Components.ProcessComponent = ProcessComponent;
        })(Components = UI.Components || (UI.Components = {}));
    })(UI = Resco.UI || (Resco.UI = {}));
})(Resco || (Resco = {}));
