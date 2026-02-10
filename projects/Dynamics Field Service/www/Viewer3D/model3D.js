var FS = FS || {};

FS.Viewer3D = {    localization: null,    // setup viewer refresh, on property change    onViewerLoad: function () {        MobileCRM.Localization.initialize(FS.Viewer3D.storeLocalizationAndChangeTitle, MobileCRM.bridge.alert);        MobileCRM.UI.EntityForm.requestObject(FS.Viewer3D.setModelSource, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onChange(FS.Viewer3D.setModelSource, true, null);
    },    storeLocalizationAndChangeTitle: function (localization) {        FS.Viewer3D.localization = localization;
        var localizedTitle = localization && localization.get("Title.Viewer3D");
        if (localizedTitle) {
            document.title = localizedTitle;
        }
    },    // model source structure (URL and loader type)    ModelSource: function (url, loader) {
        this.URL = url;        this.Loader = loader;        return this;
    },    // convert Base64 string to byte array    base64toTypedArray: function (base64content) {
        var binaryContent = window.atob(base64content);        var typedArray = new Uint8Array(binaryContent.length);        for (var i = 0; i < binaryContent.length; i++) {
            typedArray[i] = binaryContent.charCodeAt(i);
        }        return typedArray;
    },    setModelSource: function (entityForm) {
        var storageType = entityForm.entity.properties[FS.Schema.ThreeDimensionalModel.properties.msdyn_storageType];        // query attachments from notes        if (storageType == FS.Enums.msdyn_3dmodel_msdyn_storagetype.Notes) {
            FS.Viewer3D.getFileFromNotes(entityForm, function (result) {                // set attachment as source                FS.Viewer3D.setViewerModelSource(result);
            });
        }        else if (storageType == FS.Enums.msdyn_3dmodel_msdyn_storagetype.URL) {
            var fileFromRecord = FS.Viewer3D.getFileFromEntity(entityForm);            if (fileFromRecord) {
                FS.Viewer3D.setViewerModelSource(fileFromRecord);
            }
        }
    },    getFileFromEntity: function (entityForm) {
        var loaderTypes = {};        loaderTypes[FS.Enums.msdyn_3dmodel_msdyn_filetype.GLTF] = ".gltf";        loaderTypes[FS.Enums.msdyn_3dmodel_msdyn_filetype.GLB] = ".glb";        loaderTypes[FS.Enums.msdyn_3dmodel_msdyn_filetype.OBJ] = ".obj";        loaderTypes[FS.Enums.msdyn_3dmodel_msdyn_filetype.FBX] = ".fbx";        var fileUrlAttr = entityForm.entity.properties[FS.Schema.ThreeDimensionalModel.properties.msdyn_fileURL];        var fileTypeAttr = entityForm.entity.properties[FS.Schema.ThreeDimensionalModel.properties.msdyn_fileType];        var modelUrl = fileUrlAttr;        var modelFileType = fileTypeAttr;        var decodedLoaderType = loaderTypes[modelFileType];        if ((!modelUrl) || (modelUrl.length == 0)) {
            return null;
        }        return new FS.Viewer3D.ModelSource(modelUrl, decodedLoaderType);
    },    createFetchForNotes: function (entityId) {
        var fetchNotes = new MobileCRM.FetchXml.Entity(FS.Schema.Annotation.name);        fetchNotes.addAttribute(FS.Schema.Annotation.properties.annotationId);        fetchNotes.addAttribute(FS.Schema.Annotation.properties.fileName);        fetchNotes.addAttribute(FS.Schema.Annotation.properties.modifiedOn);        fetchNotes.addAttribute(FS.Schema.Annotation.properties.isDocument);        fetchNotes.orderBy(FS.Schema.Annotation.properties.modifiedOn, "true");        var objectIdFilter = new MobileCRM.FetchXml.Filter();        objectIdFilter.where(FS.Schema.Annotation.properties.objectId, "eq", entityId);        var fileTypeFilter = new MobileCRM.FetchXml.Filter();        fileTypeFilter.type = "or";        fileTypeFilter.where(FS.Schema.Annotation.properties.fileName, "like", "%.glb");        fileTypeFilter.where(FS.Schema.Annotation.properties.fileName, "like", "%.gltf");        fileTypeFilter.where(FS.Schema.Annotation.properties.fileName, "like", "%.obj");        fileTypeFilter.where(FS.Schema.Annotation.properties.fileName, "like", "%.fbx");        fetchNotes.addFilter();        fetchNotes.filter.filters = [objectIdFilter, fileTypeFilter];        return new MobileCRM.FetchXml.Fetch(fetchNotes);
    },    getFileFromNotes: function (entityForm, callback) {
        var entityId = entityForm && entityForm.entity && entityForm.entity.id;        var zeroGuid = "{00000000-0000-0000-0000-000000000000}";        if ((!entityId) || (entityId.length == 0) || (entityId == zeroGuid)) {
            return;
        }        var fetch = FS.Viewer3D.createFetchForNotes(entityId);        var fetchedNote;        fetch.execute("Array", function (results) {
            if (results && results[0]) {
                fetchedNote = results[0];                var noteId = results[0][0];                MobileCRM.DynamicEntity.loadDocumentBody(FS.Schema.Annotation.name, noteId, function (documentBody) {
                    if (documentBody && fetchedNote) {
                        var entity = fetchedNote;                        var extension = "." + entity[1].split('.').pop();                        var binaryData = FS.Viewer3D.base64toTypedArray(documentBody);                        var blob = new Blob([binaryData], { type: 'application/octet-stream' });                        var reader = new FileReader();                        reader.onload = function (e) {
                            callback(new FS.Viewer3D.ModelSource(reader.result, extension));
                        };                        reader.readAsDataURL(blob);
                    }
                },                    function (error) {
                        MobileCRM.bridge.alert(error);
                    }, null);
            }
        },            function (error) {
                MobileCRM.bridge.alert(error);
            }, null);
    },    setViewerModelSource: function (source) {
        var modelUrl = source && source.URL;        var loaderType = source && source.Loader;        var viewerElement = document.getElementById("viewport");        var viewerEnabled = !!(modelUrl && loaderType && (modelUrl.length > 0));        if (viewerEnabled) {
            var config = {
                extends: 'minimal',                model: {
                    url: modelUrl,                    loader: loaderType,
                    normalize: true,
                    animation: {
                        autoStart: true
                    }
                },
                camera: {}
            };            // clean viewer            viewerElement.innerHTML = "";            // create viewer            new BabylonViewer.DefaultViewer(viewerElement, config);
        }    }
};