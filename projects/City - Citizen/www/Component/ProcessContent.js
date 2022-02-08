var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Resco;
(function (Resco) {
    var UI;
    (function (UI) {
        var Components;
        (function (Components) {
            var Process;
            (function (Process) {
                var ProcessContent = (function () {
                    function ProcessContent(name, label, state, processComponent) {
                        this.name = name;
                        this.label = label;
                        this.state = state;
                        this.processComponent = processComponent;
                    }
                    ProcessContent.prototype.Initialize = function () {
                    };
                    ProcessContent.prototype.Render = function (where) {
                    };
                    ProcessContent.prototype.SetVisibility = function (visible) {
                        if (visible) {
                            $("#" + this.name).show();
                        }
                        else {
                            $("#" + this.name).css("display", "none");
                        }
                    };
                    return ProcessContent;
                }());
                Process.ProcessContent = ProcessContent;
                var Category = (function () {
                    function Category(name, label) {
                        this.name = name;
                        this.label = label;
                        this.subcategories = new Array();
                    }
                    return Category;
                }());
                Process.Category = Category;
                var ProcessContentCategory = (function (_super) {
                    __extends(ProcessContentCategory, _super);
                    function ProcessContentCategory(name, label, state, processComponent) {
                        var _this = _super.call(this, name, label, state, processComponent) || this;
                        _this.categoryTemplate = "<li id='{{Name}}' class='main-category'>\
												<a id='{{Name}}_A' class='toggle'>{{Label}}</a>\
												<ul id='{{Name}}_inner' class='inner'>\
												</ul>\
											</li>";
                        _this.subcategoryTemplate = "<li id={{Name}} class='sub-category'>{{Label}}</li>";
                        _this.template = "<div id='{{Name}}' class='process-container'><ul class='accordion'></ul></div>";
                        _this.categories = new Array();
                        return _this;
                    }
                    ProcessContentCategory.prototype.Initialize = function () {
                    };
                    ProcessContentCategory.prototype.RetrieveCategories = function (categoriesRetrieved, failure) {
                        if (Resco.Utils.IsRunningInMobileApp()) {
                            var entity = new MobileCRM.FetchXml.Entity("fs_incidenttemplate");
                            entity.addAttribute("name");
                            entity.addAttribute("id");
                            entity.addAttribute("incidenttemplatecategoryid");
                            var linkEntity = entity.addLink("fs_incidenttemplatecategory", "id", "incidenttemplatecategoryid", "inner");
                            linkEntity.addAttribute("index");
                            linkEntity.alias = "category";
                            var fetch = new MobileCRM.FetchXml.Fetch(entity);
                            fetch.execute("DynamicEntities", function (results) {
                                for (var i = 0; i < results.length; i++) {
                                    var cat = null;
                                    var catID = results[i].properties.incidenttemplatecategoryid.id;
                                    var catName = results[i].properties.incidenttemplatecategoryid.primaryName;
                                    var catIndex = results[i].properties["category.index"];
                                    for (var j = 0; j < this.categories.length; j++) {
                                        if (this.categories[j].name == catID)
                                            cat = this.categories[j];
                                    }
                                    if (!cat) {
                                        cat = new Category(catID, catName);
                                        cat.index = catIndex;
                                        this.categories.push(cat);
                                    }
                                    var subCatID = results[i].properties.id;
                                    var subCatName = results[i].properties.name;
                                    var subCat = new Category(subCatID, subCatName);
                                    cat.subcategories.push(subCat);
                                }
                                this.categories.sort(function (a, b) { return a.index - b.index; });
                                categoriesRetrieved();
                            }, failure, this);
                        }
                        else {
                            var cat1 = new Category("Litterandtrash", "Litter and trash");
                            cat1.subcategories.push(new Category("Litter", "Litter"));
                            cat1.subcategories.push(new Category("MissedTrashorRecycling", "Missed Trash or Recycling"));
                            cat1.subcategories.push(new Category("OverflowingTrashCan", "Overflowing Trash Can"));
                            var cat2 = new Category("HealthHazards", "Health Hazards");
                            cat2.subcategories.push(new Category("DeadAnimalPickup", "Dead Animal Pick-up"));
                            cat2.subcategories.push(new Category("NeedleCleanup", "Needle Clean-up"));
                            cat2.subcategories.push(new Category("RodentSighting", "Rodent Sighting"));
                            var cat3 = new Category("Streetandparkdamage", "Street and park damage");
                            cat3.subcategories.push(new Category("BrokenParkEquipment", "Broken Park Equipment"));
                            cat3.subcategories.push(new Category("BrokenSidewalk", "Broken Sidewalk"));
                            this.categories.push(cat1);
                            this.categories.push(cat2);
                            this.categories.push(cat3);
                            categoriesRetrieved();
                        }
                    };
                    ProcessContentCategory.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.ReplaceVariable(this.template, "{{Name}}", this.name);
                        _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{Label}}", this.label);
                        var content = where.append(_HTML);
                        this.RenderCategories(content.find(".accordion"));
                    };
                    ProcessContentCategory.prototype.RenderCategories = function (where) {
                        for (var i = 0; i < this.categories.length; i++) {
                            var category = this.categories[i];
                            var _HTML = Resco.Utils.ReplaceVariable(this.categoryTemplate, "{{Name}}", category.name);
                            _HTML = Resco.Utils.ReplaceVariable(_HTML, "{{Label}}", category.label);
                            where.append(_HTML);
                            var content_A = where.find("#" + category.name + "_A");
                            content_A.click(this.CategoryClick.bind(this));
                            var subcontent = where.find("#" + category.name + "_inner");
                            ;
                            if (category.subcategories.length > 0) {
                                for (var j = 0; j < category.subcategories.length; j++) {
                                    var subcategory = category.subcategories[j];
                                    var _subHTML = Resco.Utils.PrepareHTMLTemplateSimple(this.subcategoryTemplate, subcategory.name, subcategory.label);
                                    subcontent.append(_subHTML);
                                    var _sub = subcontent.find("#" + subcategory.name);
                                    _sub.click(this.SubCategoryClick.bind(this));
                                }
                            }
                        }
                    };
                    ProcessContentCategory.prototype.CategoryClick = function (event) {
                        event.preventDefault();
                        var element = $(event.currentTarget);
                        var elementNext = element.next();
                        var elementParent = element.parent();
                        if (elementNext.hasClass('show')) {
                            elementNext.removeClass('show');
                            elementNext.slideUp(350);
                        }
                        else {
                            var parentsParent = elementParent.parent();
                            var parentsParentInnerLi = parentsParent.find('li .inner');
                            parentsParentInnerLi.removeClass('show');
                            parentsParentInnerLi.slideUp(350);
                            elementNext.toggleClass('show');
                            elementNext.slideToggle(350);
                        }
                    };
                    ProcessContentCategory.prototype.SubCategoryClick = function (event) {
                        if (Resco.Utils.IsRunningInMobileApp()) {
                            var entity = new MobileCRM.FetchXml.Entity("fs_incidenttemplate");
                            entity.addAttribute("name");
                            entity.addAttribute("id");
                            var filter = new MobileCRM.FetchXml.Filter();
                            filter.where("name", "eq", event.currentTarget.textContent);
                            entity.filter = filter;
                            var fetch = new MobileCRM.FetchXml.Fetch(entity);
                            fetch.count = 1;
                            fetch.execute("DynamicEntities", function (result) {
                                if (result.length != 0) {
                                    this.processComponent.SetDataObjectValues({ "incidenttemplateid": new MobileCRM.Reference(result[0].entityName, result[0].id, result[0].primaryName) });
                                    this.state.complete = true;
                                    this.processComponent.RefreshNavigation();
                                    this.processComponent.ItemClick(this.processComponent.state_Photo);
                                }
                            }, MobileCRM.bridge.alert, this);
                        }
                    };
                    return ProcessContentCategory;
                }(ProcessContent));
                Process.ProcessContentCategory = ProcessContentCategory;
                var ProcessContentFormItem = (function () {
                    function ProcessContentFormItem(name, label, processForm) {
                        this.name = name;
                        this.label = label;
                        this.processForm = processForm;
                    }
                    ProcessContentFormItem.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentFormItem.prototype.Render = function (where) {
                        return;
                    };
                    ProcessContentFormItem.prototype.SetVisibility = function (visible) {
                        if (visible) {
                            $("#" + this.name).show();
                        }
                        else {
                            $("#" + this.name).hide();
                        }
                    };
                    return ProcessContentFormItem;
                }());
                Process.ProcessContentFormItem = ProcessContentFormItem;
                var ProcessContentFormCapturePhotoItem = (function (_super) {
                    __extends(ProcessContentFormCapturePhotoItem, _super);
                    function ProcessContentFormCapturePhotoItem(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.emptyTemplate = "<div id='{{Name}}_EmptyDiv' class='container-border'><h1 class='take-photo-heading {{Name}}_Empty' >Take a photo</h1><a href='#' class='take-photo-link {{Name}}_Empty'><img src='Images/ProcessContent/take_photo.png' alt='take-a-photo' class='take-photo-icon {{Name}}_Empty'></a></div>";
                        _this.imageTemplate = "<img id='{{Name}}_PhotoElement'src='{{ImageData}}' alt='photo' class='taken-photo'>";
                        _this.divTemplate = "<div id='{{Name}}' class='take-photo-container'></div>";
                        _this.template = _this.divTemplate;
                        _this.imageData = null;
                        _this.note = null;
                        return _this;
                    }
                    ProcessContentFormCapturePhotoItem.prototype.Initialize = function () {
                        this.note = MobileCRM.DynamicEntity.createNew("annotation");
                        this.note.properties.filename = "photo.jpg";
                        this.note.properties.mimetype = "image/jpeg";
                        this.note.properties.subject = "photo";
                        this.note.properties.isdocument = 1;
                        return;
                    };
                    ProcessContentFormCapturePhotoItem.prototype.Render = function (where) {
                        this.m_whereToRender = where;
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label });
                        where.append(_HTML);
                        var photo = where.find("#" + this.name);
                        _HTML = Resco.Utils.PrepareHTMLTemplate(this.emptyTemplate, { "Name": this.name });
                        photo.append(_HTML);
                        _HTML = Resco.Utils.PrepareHTMLTemplate(this.imageTemplate, { "Name": this.name, "ImageData": this.imageData });
                        photo.append(_HTML);
                        var _empty = photo.find("#" + this.name + "_EmptyDiv");
                        var _image = photo.find("#" + this.name + "_PhotoElement");
                        if (this.imageData) {
                            _image.show();
                            _empty.hide();
                        }
                        else {
                            _image.hide();
                            _empty.show();
                        }
                        photo.click(this.PhotoClickAction.bind(this));
                    };
                    ProcessContentFormCapturePhotoItem.prototype.RefreshRender = function () {
                        var _empty = this.m_whereToRender.find("#" + this.name + "_EmptyDiv");
                        var _image = this.m_whereToRender.find("#" + this.name + "_PhotoElement");
                        if (this.imageData) {
                            _image.attr("src", this.imageData);
                            _image.show();
                            _empty.hide();
                            var _reviewImage = $("#" + "imageitem" + "_image");
                            _reviewImage.attr("src", this.imageData);
                        }
                        else {
                            _image.hide();
                            _empty.show();
                        }
                    };
                    ProcessContentFormCapturePhotoItem.prototype.PhotoClickAction = function (event) {
                        if (this.clickAction) {
                            this.clickAction(event);
                            return;
                        }
                        if (this.imageData) {
                            this.ExistingPhotoAction();
                        }
                        else {
                            this.EmptyPhotoAction();
                        }
                    };
                    ProcessContentFormCapturePhotoItem.prototype.EmptyPhotoAction = function () {
                        this.CapturePhoto();
                    };
                    ProcessContentFormCapturePhotoItem.prototype.ExistingPhotoAction = function () {
                        this.CapturePhoto();
                    };
                    ProcessContentFormCapturePhotoItem.prototype.CapturePhoto = function () {
                        if (!Resco.Utils.IsRunningInMobileApp())
                            return;
                        var service = new MobileCRM.Services.DocumentService();
                        service.allowChooseVideo = false;
                        service.capturePhoto(function (res) {
                            if (!res.filePath)
                                return;
                            MobileCRM.Application.readFileAsBase64(res.filePath, function (base64) {
                                this.imageData = "data:image/jpeg;base64," + base64;
                                this.processForm.state.complete = true;
                                this.processForm.processComponent.RefreshNavigation();
                                this.RefreshRender();
                                this.note.properties.documentbody = base64;
                                this.note.properties.filesize = base64.length / 4;
                            }, MobileCRM.bridge.alert, this);
                        }, MobileCRM.bridge.alert, this);
                    };
                    return ProcessContentFormCapturePhotoItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormCapturePhotoItem = ProcessContentFormCapturePhotoItem;
                var ProcessContentFormGalleryPhotoItem = (function (_super) {
                    __extends(ProcessContentFormGalleryPhotoItem, _super);
                    function ProcessContentFormGalleryPhotoItem(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.orTemplate = "<p class='choose-photo'>or</p>";
                        _this.chooseTemplate = "<a id='{{Name}}_choose' href='#' class='choose-photo'>Choose from gallery</a>";
                        _this.divTemplate = "<div id='{{Name}}' class='choose-from-gallery'></div>";
                        _this.template = _this.divTemplate;
                        return _this;
                    }
                    ProcessContentFormGalleryPhotoItem.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentFormGalleryPhotoItem.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label });
                        where.append(_HTML);
                        var gallery = where.find("#" + this.name);
                        gallery.append(this.orTemplate);
                        _HTML = Resco.Utils.PrepareHTMLTemplate(this.chooseTemplate, { "Name": this.name });
                        gallery.append(_HTML);
                        var choose = gallery.find("#" + this.name + "_choose");
                        if (this.clickAction)
                            choose.click(this.clickAction);
                    };
                    return ProcessContentFormGalleryPhotoItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormGalleryPhotoItem = ProcessContentFormGalleryPhotoItem;
                var ProcessContentForm = (function (_super) {
                    __extends(ProcessContentForm, _super);
                    function ProcessContentForm(name, label, state, className, processComponent) {
                        var _this = _super.call(this, name, label, state, processComponent) || this;
                        _this.items = new Array();
                        _this.divClassName = className;
                        _this.template = "<div id='{{Name}}' class='{{DivClassName}}'></div>";
                        return _this;
                    }
                    ProcessContentForm.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentForm.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "DivClassName": this.divClassName });
                        where.append(_HTML);
                        var _div = where.find("#" + this.name);
                        for (var i = 0; i < this.items.length; i++) {
                            this.items[i].Render(_div);
                        }
                    };
                    ProcessContentForm.prototype.SetVisibility = function (visible) {
                        if (visible) {
                            $("#" + this.name).show();
                        }
                        else {
                            $("#" + this.name).hide();
                        }
                    };
                    return ProcessContentForm;
                }(ProcessContent));
                Process.ProcessContentForm = ProcessContentForm;
                var ProcessContentPhotoForm = (function (_super) {
                    __extends(ProcessContentPhotoForm, _super);
                    function ProcessContentPhotoForm(name, label, state, className, processComponent) {
                        return _super.call(this, name, label, state, className, processComponent) || this;
                    }
                    ProcessContentPhotoForm.prototype.Initialize = function () {
                        this.photoItem = new ProcessContentFormCapturePhotoItem("photoitem", "Take a photo", this);
                        this.galleryItem = new ProcessContentFormGalleryPhotoItem("galleryitem", "Choose from gallery", this);
                        this.galleryItem.clickAction = this.GalleryClickAction.bind(this);
                        this.items.push(this.photoItem);
                        this.items.push(this.galleryItem);
                        for (var i = 0; i < this.items.length; i++)
                            this.items[i].Initialize();
                    };
                    ProcessContentPhotoForm.prototype.GalleryClickAction = function (event) {
                        if (!Resco.Utils.IsRunningInMobileApp())
                            return;
                        var service = new MobileCRM.Services.DocumentService();
                        service.allowChooseVideo = false;
                        service.selectPhoto(function (res) {
                            if (!res.filePath)
                                return;
                            MobileCRM.Application.readFileAsBase64(res.filePath, function (base64) {
                                this.photoItem.imageData = "data:image/jpeg;base64," + base64;
                                this.state.complete = true;
                                this.processComponent.RefreshNavigation();
                                this.photoItem.RefreshRender();
                                this.photoItem.note.properties.documentbody = base64;
                                this.note.properties.filesize = base64.length / 4;
                            }, MobileCRM.bridge.alert, this);
                        }, MobileCRM.bridge.alert, this);
                    };
                    ProcessContentPhotoForm.prototype.SaveContent = function (contentSaved) {
                        if (this.photoItem && this.photoItem.note)
                            this.photoItem.note.save(contentSaved);
                    };
                    return ProcessContentPhotoForm;
                }(ProcessContentForm));
                Process.ProcessContentPhotoForm = ProcessContentPhotoForm;
                var ProcessContentFormMapItem = (function (_super) {
                    __extends(ProcessContentFormMapItem, _super);
                    function ProcessContentFormMapItem(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.mapTemplate = "<div id='{{Name}}' class='search-map'><iframe src='{{MapSrc}}' width='100%' height='100%' frameborder='0' style='border:0' allowfullscreen></iframe></div>";
                        _this.template = _this.mapTemplate;
                        return _this;
                    }
                    ProcessContentFormMapItem.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "MapSrc": this.mapSrc });
                        where.append(_HTML);
                    };
                    return ProcessContentFormMapItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormMapItem = ProcessContentFormMapItem;
                var ProcessContentFormGoogleMapItem = (function (_super) {
                    __extends(ProcessContentFormGoogleMapItem, _super);
                    function ProcessContentFormGoogleMapItem(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.googleMapDiv = "<div id='{{Name}}' class='search-map'></div>";
                        _this.googleMapScript = "<script async defer src='{{MapSrc}}'></script>";
                        _this.googleMapSrc = "https://maps.googleapis.com/maps/api/js?key={{ApiKey}}&callback=window.Resco.Process.MapReady";
                        _this.isMapReady = false;
                        _this.isMapRendered = false;
                        _this.noMapDataText = "No Map Data";
                        var isGoogleApiNotLoaded = !_this.IsGoogleMapsApiLoaded();
                        _this.template = _this.googleMapDiv + (isGoogleApiNotLoaded ? _this.googleMapScript : "");
                        if (isGoogleApiNotLoaded)
                            _this.RegisterMapReadyHandler();
                        else
                            _this.MapReady();
                        _this.ResolveCurrentLocation();
                        return _this;
                    }
                    Object.defineProperty(ProcessContentFormGoogleMapItem.prototype, "usePlacehoder", {
                        get: function () {
                            return !this.googleMapAPIKey;
                        },
                        enumerable: true,
                        configurable: true
                    });
                    ProcessContentFormGoogleMapItem.prototype.IsGoogleMapsApiLoaded = function () {
                        var IsLoaded = true;
                        try {
                            var g = google;
                            var gm = google.maps;
                        }
                        catch (err) {
                            IsLoaded = false;
                        }
                        return IsLoaded;
                    };
                    ProcessContentFormGoogleMapItem.prototype.RegisterMapReadyHandler = function () {
                        var w = window;
                        w.Resco = w.Resco || {};
                        w.Resco.Process = w.Resco.Process || {};
                        var handlerName = this.name;
                        w.Resco.Process["MapReady"] = this.MapReady.bind(this);
                    };
                    ProcessContentFormGoogleMapItem.prototype.MapReady = function () {
                        this.isMapReady = true;
                    };
                    ProcessContentFormGoogleMapItem.prototype.RenderMap = function () {
                        if (!this.isMapReady)
                            return;
                        if (this.usePlacehoder)
                            return;
                        this.DisplayNoMapData($("#" + this.name), false);
                        this.latitude = (this.latitude ? this.latitude : 0);
                        this.longitude = (this.longitude ? this.longitude : 0);
                        var location = { lat: this.latitude, lng: this.longitude };
                        this.map = new google.maps.Map(document.getElementById(this.name), {
                            zoom: 14,
                            center: location,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                        this.mapMarker = new google.maps.Marker({
                            position: location,
                            map: this.map
                        });
                        this.isMapRendered = true;
                    };
                    ProcessContentFormGoogleMapItem.prototype.Render = function (where) {
                        var GoogleAPIKey = this.googleMapAPIKey;
                        this.mapSrc = Resco.Utils.ReplaceVariable(this.googleMapSrc, "{{ApiKey}}", GoogleAPIKey);
                        this.mapSrc = Resco.Utils.ReplaceVariable(this.mapSrc, "{{Name}}", this.name);
                        _super.prototype.Render.call(this, where);
                        if (this.usePlacehoder)
                            this.noMapDataText = "Google Map API Key not provided in project - Map will not be displayed. Please contact administrator.<br />(Address resolution will still work.)";
                        this.DisplayNoMapData(where, true);
                    };
                    ProcessContentFormGoogleMapItem.prototype.DisplayNoMapData = function (where, show) {
                        if (show) {
                            var NoMapDataTemplate = "<table id='{{Name}}_nomap' class=\"emptyListTextTable\"><tr><td><div class=\"emptyListText\">" + this.noMapDataText + "</div></td></tr></table>";
                            NoMapDataTemplate = Resco.Utils.PrepareHTMLTemplate(NoMapDataTemplate, { "Name": this.name });
                            var mapDiv = where.find("#" + this.name);
                            mapDiv.append(NoMapDataTemplate);
                        }
                        else {
                            var NoMapDataItem = where.find("#" + this.name + "_nomap");
                            NoMapDataItem.detach();
                        }
                    };
                    ProcessContentFormGoogleMapItem.prototype.RefreshMap = function () {
                        if (!this.isMapRendered)
                            this.RenderMap();
                    };
                    ProcessContentFormGoogleMapItem.prototype.ResolveCurrentLocation = function () {
                        MobileCRM.Platform.getLocation(function (location) {
                            this.SetMapLocation(location.latitude, location.longitude);
                        }, this.FailedLocationResolution, this, 10, 500, 5000);
                    };
                    ProcessContentFormGoogleMapItem.prototype.FailedLocationResolution = function (error) {
                        if (!this.street)
                            return;
                        var _form = this.processForm;
                        _form.SetAddressValuesToEntity();
                    };
                    ProcessContentFormGoogleMapItem.prototype.SetMapLocation = function (lat, long, resolveAddress) {
                        if (resolveAddress === void 0) { resolveAddress = true; }
                        this.latitude = lat;
                        this.longitude = long;
                        if (this.map && this.mapMarker) {
                            this.map.setCenter(new google.maps.LatLng(lat, long));
                            this.mapMarker.setPosition(new google.maps.LatLng(lat, long));
                        }
                        if (resolveAddress) {
                            MobileCRM.Services.GeoAddress.fromLocation(this.latitude, this.longitude, function (address) {
                                this.streetNumber = Resco.Utils.SafeString(address.streetNumber);
                                this.street = Resco.Utils.SafeString(address.street);
                                this.city = Resco.Utils.SafeString(address.city);
                                this.zip = Resco.Utils.SafeString(address.zip);
                                this.stateOrProvince = Resco.Utils.SafeString(address.stateOrProvince);
                                this.country = Resco.Utils.SafeString(address.country);
                                this.processForm.SetAddressValuesToEntity();
                            }, this.FailedLocationResolution, this);
                        }
                    };
                    ProcessContentFormGoogleMapItem.prototype.SetMapLocationViaAddress = function () {
                        if (!Resco.Utils.IsRunningInMobileApp())
                            return;
                        var addr = new MobileCRM.Services.GeoAddress();
                        addr.country = this.country;
                        addr.city = this.city;
                        addr.street = this.street;
                        addr.streetNumber = this.streetNumber;
                        addr.toLocation(function (location) {
                            this.SetMapLocation(location.latitude, location.longitude);
                        }, this.FailedLocationResolution, this);
                    };
                    return ProcessContentFormGoogleMapItem;
                }(ProcessContentFormMapItem));
                Process.ProcessContentFormGoogleMapItem = ProcessContentFormGoogleMapItem;
                var ProcessContentMapForm = (function (_super) {
                    __extends(ProcessContentMapForm, _super);
                    function ProcessContentMapForm() {
                        return _super !== null && _super.apply(this, arguments) || this;
                    }
                    ProcessContentMapForm.prototype.Initialize = function () {
                        this.search = new ProcessContentFormInputButtonItem("addressSearch", "Search", this, this.AddressFieldChanged.bind(this), "findcurrentlocation", "Images/ProcessContent/gps.png", this.SetCurrentLocation.bind(this));
                        this.search.itemClass = "search";
                        this.items.push(this.search);
                        this.mapItem = new ProcessContentFormGoogleMapItem("mapitem", "Select location", this);
                        this.mapItem.Initialize();
                        this.items.push(this.mapItem);
                        this.addressDescription = new ProcessContentFormInputItem("addressDescription", "Add description of location", this, this.DescriptionChanged.bind(this));
                        this.addressDescription.template = "<div id='{{Name}}_div' class='specific-desc-container'><textarea rows='1' cols='50' placeholder='{{Label}}' id='{{Name}}' class='{{ItemClass}}'></textarea></div>";
                        this.addressDescription.itemClass = "special-desc";
                        this.items.push(this.addressDescription);
                    };
                    ProcessContentMapForm.prototype.SetAddressValuesToEntity = function () {
                        this.processComponent.SetDataObjectValues({
                            "address1_line1": this.mapItem.street + (this.mapItem.streetNumber ? " " + this.mapItem.streetNumber : ""),
                            "address1_city": this.mapItem.city,
                            "address1_postalcode": this.mapItem.zip,
                            "address1_stateorprovince": this.mapItem.stateOrProvince,
                            "address1_latitude": this.mapItem.latitude,
                            "address1_longitude": this.mapItem.longitude
                        });
                        if (this.mapItem.street || (this.mapItem.latitude && this.mapItem.longitude))
                            this.state.complete = true;
                        else
                            this.state.complete = false;
                    };
                    ProcessContentMapForm.prototype.AddressFieldChanged = function () {
                        var _input = this.search.content;
                        var _split = _input.split(",");
                        this.mapItem.city = "";
                        this.mapItem.country = "";
                        this.mapItem.latitude = 0;
                        this.mapItem.longitude = 0;
                        this.mapItem.stateOrProvince = "";
                        this.mapItem.street = "";
                        this.mapItem.streetNumber = "";
                        this.mapItem.zip = "";
                        var _splitLength = _split.length;
                        if (_splitLength > 0) {
                            this.mapItem.street = _split[0];
                            if (_splitLength > 1) {
                                this.mapItem.city = _split[1];
                            }
                            if (_splitLength > 2) {
                                this.mapItem.country = _split[2];
                            }
                            var _mapItem = this.mapItem;
                            _mapItem.SetMapLocationViaAddress();
                        }
                    };
                    ProcessContentMapForm.prototype.SetCurrentLocation = function () {
                        var _mapItem = this.mapItem;
                        _mapItem.ResolveCurrentLocation();
                    };
                    ProcessContentMapForm.prototype.DescriptionChanged = function () {
                        this.processComponent.SetDataObjectValues({
                            "description": this.addressDescription.content
                        });
                    };
                    return ProcessContentMapForm;
                }(ProcessContentForm));
                Process.ProcessContentMapForm = ProcessContentMapForm;
                var ProcessContentFormImageItem = (function (_super) {
                    __extends(ProcessContentFormImageItem, _super);
                    function ProcessContentFormImageItem(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.divTemplate = "<div id='{{Name}}' class='photo-container'><img id='{{Name}}_image' src='{{ImageData}}' alt='photo' class='taken-photo'></div>";
                        _this.template = _this.divTemplate;
                        _this.imageData = null;
                        return _this;
                    }
                    ProcessContentFormImageItem.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentFormImageItem.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label, "ImageData": this.imageData });
                        where.append(_HTML);
                    };
                    return ProcessContentFormImageItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormImageItem = ProcessContentFormImageItem;
                var ProcessContentFormInputItem = (function (_super) {
                    __extends(ProcessContentFormInputItem, _super);
                    function ProcessContentFormInputItem(name, label, processForm, onChangeHandler) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.inputTemplate = "<input id='{{Name}}' placeholder='{{Label}}' type='text' class='{{ItemClass}}'>";
                        _this.itemClass = "comments-field";
                        _this.registerOnInput = false;
                        _this.template = _this.inputTemplate;
                        _this.onChangeHandler = onChangeHandler;
                        return _this;
                    }
                    ProcessContentFormInputItem.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentFormInputItem.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label, "ItemClass": this.itemClass });
                        where.append(_HTML);
                        var _item = where.find("#" + this.name);
                        _item.change(this.OnChange.bind(this));
                        if (this.registerOnInput) {
                            this.htmlItem = _item[0];
                            this.htmlItem.oninput = function () {
                                this.content = this.htmlItem.value;
                                if (this.onChangeHandler)
                                    this.onChangeHandler();
                            }.bind(this);
                        }
                    };
                    ProcessContentFormInputItem.prototype.OnChange = function (event) {
                        this.content = event.currentTarget.value;
                        if (this.onChangeHandler)
                            this.onChangeHandler();
                    };
                    return ProcessContentFormInputItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormInputItem = ProcessContentFormInputItem;
                var ProcessContentFormInputItemReadOnly = (function (_super) {
                    __extends(ProcessContentFormInputItemReadOnly, _super);
                    function ProcessContentFormInputItemReadOnly(name, label, processForm, onChangeHandler) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.readOnlyTemplate = "<input id='{{Name}}' placeholder='{{Label}}' type='text' class='{{ItemClass}}' readonly color='#DEDEDE'>";
                        _this.template = _this.readOnlyTemplate;
                        return _this;
                    }
                    return ProcessContentFormInputItemReadOnly;
                }(ProcessContentFormInputItem));
                Process.ProcessContentFormInputItemReadOnly = ProcessContentFormInputItemReadOnly;
                var ProcessContentFormInputButtonItem = (function (_super) {
                    __extends(ProcessContentFormInputButtonItem, _super);
                    function ProcessContentFormInputButtonItem(name, label, processForm, onChangeHandler, buttonName, buttonImage, buttonClick) {
                        var _this = _super.call(this, name, label, processForm, onChangeHandler) || this;
                        _this.divTemplate = "<div id='{{Name}}_div' class='search-container'>{{ItemHTML}}<img id='{{ButtonName}}' class='button-icon' src='{{ButtonImage}}'></div>";
                        _this.buttonName = buttonName;
                        _this.buttonImage = buttonImage;
                        _this.buttonClickHandler = buttonClick;
                        _this.template = _this.divTemplate;
                        return _this;
                    }
                    ProcessContentFormInputButtonItem.prototype.Render = function (where) {
                        var _itemHTML = Resco.Utils.PrepareHTMLTemplate(this.inputTemplate, { "Name": this.name, "Label": this.label, "ItemClass": this.itemClass });
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "ItemHTML": _itemHTML, "ButtonName": this.buttonName, "ButtonImage": this.buttonImage });
                        where.append(_HTML);
                        var _item = where.find("#" + this.name);
                        _item.change(this.OnChange.bind(this));
                        if (this.registerOnInput) {
                            this.htmlItem = _item[0];
                            this.htmlItem.oninput = function () {
                                this.content = this.htmlItem.value;
                                if (this.onChangeHandler)
                                    this.onChangeHandler();
                            }.bind(this);
                        }
                        var _button = where.find("#" + this.buttonName);
                        _button.click(this.ButtonClick.bind(this));
                    };
                    ProcessContentFormInputButtonItem.prototype.ButtonClick = function (event) {
                        this.buttonClickHandler();
                    };
                    return ProcessContentFormInputButtonItem;
                }(ProcessContentFormInputItem));
                Process.ProcessContentFormInputButtonItem = ProcessContentFormInputButtonItem;
                var ProcessContentFormButtonItem = (function (_super) {
                    __extends(ProcessContentFormButtonItem, _super);
                    function ProcessContentFormButtonItem(name, label, processForm, onClickHandler) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.buttonTemplate = "<div id='{{Name}}_div' class='submit-button-container'><button id='{{Name}}' class='submit-button'>{{Label}}</button></div>";
                        _this.template = _this.buttonTemplate;
                        _this.onClickHandler = onClickHandler;
                        return _this;
                    }
                    ProcessContentFormButtonItem.prototype.Initialize = function () {
                        return;
                    };
                    ProcessContentFormButtonItem.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label });
                        where.append(_HTML);
                        var _item = where.find("#" + this.name);
                        _item.click(this.OnClick.bind(this));
                    };
                    ProcessContentFormButtonItem.prototype.OnClick = function (event) {
                        if (this.onClickHandler)
                            this.onClickHandler();
                    };
                    return ProcessContentFormButtonItem;
                }(ProcessContentFormItem));
                Process.ProcessContentFormButtonItem = ProcessContentFormButtonItem;
                var ProcessContentFormInputSection = (function (_super) {
                    __extends(ProcessContentFormInputSection, _super);
                    function ProcessContentFormInputSection(name, label, processForm) {
                        var _this = _super.call(this, name, label, processForm) || this;
                        _this.divTemplate = "<div id='{{Name}}' class='comments-form'></div>";
                        _this.items = new Array();
                        _this.template = _this.divTemplate;
                        return _this;
                    }
                    ProcessContentFormInputSection.prototype.Initialize = function () {
                        this.items.push(new ProcessContentFormInputItemReadOnly("location_input", "Location", this.processForm, this.onChangeHandler.bind(this)));
                        this.items.push(new ProcessContentFormInputItemReadOnly("category_input", "Category", this.processForm, this.onChangeHandler.bind(this)));
                        this.items.push(new ProcessContentFormInputItemReadOnly("specificdescription_input", "Specific description", this.processForm, this.onChangeHandler.bind(this)));
                        this.items.push(new ProcessContentFormInputItemReadOnly("reporter_input", "Reporter", this.processForm, this.onChangeHandler.bind(this)));
                        return;
                    };
                    ProcessContentFormInputSection.prototype.Render = function (where) {
                        var _HTML = Resco.Utils.PrepareHTMLTemplate(this.template, { "Name": this.name, "Label": this.label });
                        where.append(_HTML);
                        var _items = where.find("#" + this.name);
                        for (var i = 0; i < this.items.length; i++)
                            this.items[i].Render(_items);
                    };
                    ProcessContentFormInputSection.prototype.SetItemValue = function (itemid, value) {
                        $("#" + itemid).val(value);
                    };
                    return ProcessContentFormInputSection;
                }(ProcessContentFormItem));
                Process.ProcessContentFormInputSection = ProcessContentFormInputSection;
                var ProcessContentFormInputForm = (function (_super) {
                    __extends(ProcessContentFormInputForm, _super);
                    function ProcessContentFormInputForm(name, label, state, className, processComponent) {
                        return _super.call(this, name, label, state, className, processComponent) || this;
                    }
                    ProcessContentFormInputForm.prototype.Initialize = function () {
                        this.photoItem = new ProcessContentFormImageItem("imageitem", "Photo", this);
                        this.inputItem = new ProcessContentFormInputSection("inputitem", "Add details", this);
                        this.inputItem.onChangeHandler = this.OnChange.bind(this);
                        this.inputItem.Initialize();
                        this.buttonItem = new ProcessContentFormButtonItem("submitbutton", "Submit", this, this.SaveForm.bind(this));
                        this.items.push(this.photoItem);
                        this.items.push(this.inputItem);
                        this.items.push(this.buttonItem);
                    };
                    ProcessContentFormInputForm.prototype.ReloadDataFromForm = function () {
                        if (Resco.Utils.IsRunningInMobileApp()) {
                            MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                                var address = this.ConstructAddress(entityForm.entity);
                                this.inputItem.SetItemValue("location_input", address);
                                if (entityForm.entity.properties["incidenttemplateid"])
                                    this.inputItem.SetItemValue("category_input", entityForm.entity.properties["incidenttemplateid"].primaryName);
                                if (entityForm.entity.properties["description"])
                                    this.inputItem.SetItemValue("specificdescription_input", entityForm.entity.properties["description"]);
                                this.inputItem.SetItemValue("reporter_input", this.userName);
                            }, MobileCRM.bridge.alert, this);
                        }
                    };
                    ProcessContentFormInputForm.prototype.ConstructAddress = function (entity) {
                        var address = entity.properties["address1_line1"];
                        address = this.AddFieldToAddress(entity.properties["address1_line2"], address);
                        address = this.AddFieldToAddress(entity.properties["address1_line3"], address);
                        address = this.AddFieldToAddress(entity.properties["address1_city"], address);
                        address = this.AddFieldToAddress(entity.properties["address1_stateorprovince"], address);
                        address = this.AddFieldToAddress(entity.properties["address1_country"], address);
                        address = this.AddFieldToAddress(entity.properties["address1_postalcode"], address);
                        return address;
                    };
                    ProcessContentFormInputForm.prototype.AddFieldToAddress = function (field, address) {
                        if (address && address.length > 0 && field)
                            return address + ", " + field;
                        else
                            return address;
                    };
                    ProcessContentFormInputForm.prototype.OnChange = function () {
                        if (this.inputItem.items[2].content)
                            this.processComponent.SetDataObjectValues({ "description": this.inputItem.items[2].content });
                    };
                    ProcessContentFormInputForm.prototype.SaveForm = function () {
                        if (!Resco.Utils.IsRunningInMobileApp)
                            return;
                        MobileCRM.UI.EntityForm.save();
                    };
                    return ProcessContentFormInputForm;
                }(ProcessContentForm));
                Process.ProcessContentFormInputForm = ProcessContentFormInputForm;
            })(Process = Components.Process || (Components.Process = {}));
        })(Components = UI.Components || (UI.Components = {}));
    })(UI = Resco.UI || (Resco.UI = {}));
})(Resco || (Resco = {}));
