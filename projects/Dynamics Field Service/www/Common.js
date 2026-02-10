var FS = FS || {};

FS.Common = {
    messageBox: function (message, items, callback) {
        /// <summary>Show message in the message box.</summary>
        /// <param name='message' type='String'>A message.</param>
        /// <param name='items' type='Array'>Button items.</param>
        /// <param name='callback' type='function(Object)'>Callback that will be executed.</param>

        var popup = new MobileCRM.UI.MessageBox(message);
        popup.items = items;
        popup.multiLine = true; // Ensures that the message fits
        popup.show(callback);
    },

    Events: {
        workOrderPrimaryIncidentTypeChanged: "workOrderPrimaryIncidentTypeChanged"
    },

    CustomCommands: {
        customAdvanced: "custom_Advanced",
        customAssociateDevice: "custom_AssociateDevice",
        customFollowUp: "custom_FollowUp",
        customMarkComplete: "custom_MarkComplete",
        customMarkCompleteList: "custom_MarkCompleteList",
        customPullDeviceData: "custom_PullDeviceData",
        customRegisterDevice: "custom_RegisterDevice",
        customRegisterDevices: "custom_RegisterDevices",
        customRemoteAssist: "custom_RemoteAssist",
        customSendIoTCommand: "custom_SendIoTCommand"
    }, 

    executeFetch: function (fetch, output, scope) {
        /// <summary>Promise based wrapper for MobileCRM.FetchXml.Fetch.execute method.</summary>
        /// <remarks>See <see cref="MobileCRM.FetchXml.Fetch.execute">MobileCRM.FetchXml.Fetch.execute</see> for further details.</remarks>
        return new Promise(function (resolve, reject) {
            fetch.execute(
                output,
                resolve,
                function (error) {
                    reject(new Error(error));
                },
                scope);
        });
    },

    RemoteAssistLabels: {
        BookingId: "d365BookingId",
        ContactSearch: "contactSearch",
        DeepLink: "ramobile:",
        OrgUrl: "d365InstanceUrl",
        SupportContactAADId: "contactAadObjectId",
        SystemUserAADId: "userAadObjectId",
        WorkOrderId: "d365WorkOrderId"
    },

    TabNames: {
        BRB_BookingTab: "Booking",
        CustomerAsset_ConnectedDeviceAttributes: "Connected Device Attributes",
        IoTCommand_GeneralTab: "General",
        TimeOffRequest_GeneralTab: "General",
        IoTDevice_DeviceStatusTab: "Status",
        IoTDevice_PowerBITab: "PowerBI",
        IoTAlert_PowerBITab: "PowerBI",
        WorkOrderServiceTask_GeneralTab: "General",
        WorkOrder_GeneralTab: "General"
    },

    Workflows: {
        authorizeConversation: "msdyn_AuthorizeConversation",
        getBingSpeechToken: "msdyn_GetBingSpeechToken",
        pullIoTDeviceData: "msdyn_PullDataForIoTDevice",
        registerIoTDevice: "msdyn_RegisterIoTDevice",
        registerCustomEntity: "msdyn_RegisterCustomEntity"
    },

    LookupViewNames: {
        defaultIoTDevice: "IoT Device Lookup View",
        defaultIoTDeviceCommandDefinition: "IoT Device Command Definition Lookup View"
    },

    JoinType: {
        inner: "inner",
        outer: "outer"
    },

    SharedVariables: {
        customAssociateDeviceEnabled: "custom_AssociateDeviceEnabled",
        customPullDeviceDataEnabled: "custom_PullDeviceDataEnabled",
        customRegisterDeviceEnabled: "custom_RegisterDeviceEnabled",
        customRegisterDevicesEnabled: "custom_RegisterDevicesEnabled",
        customSendIoTCommandEnabled: "custom_SendIoTCommandEnabled"
    },

    ConnectedDeviceRoleId: "{9C86F660-5F5B-E611-810B-00155DBD6A1D}",
    LegacyDefaultEndpointPath: "ks1testcrmf1-crm",
    SaveHandlerResumeSaveNoMessage: "#NoMessage#"
};