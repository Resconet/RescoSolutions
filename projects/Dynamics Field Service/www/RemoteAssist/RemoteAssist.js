/// <reference path="../JSBridge.js" />
/// <reference path="../JSBridgeExtension.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />

var FS = FS || {};

FS.RemoteAssist = {
    localization: null,

    showHideRemoteAssistButton: function () {
        // Hides the Remote Assist button
        MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customRemoteAssist, false);

        // If the device is an Android device, shows the Remote Assist button
        MobileCRM.Platform.getDeviceInfo(function (info) {
            if (info && info.oSVersion && info.oSVersion.toUpperCase().includes("ANDROID")) {
                MobileCRM.UI.EntityForm.enableCommand(FS.Common.CustomCommands.customRemoteAssist, true);
            }
        }, MobileCRM.bridge.alert);
    },

    onButtonClick: function (entityForm) {
        var deepLinkData = {};
        var entity = entityForm && entityForm.entity;

        if (entity && entity.entityName && entity.properties) {
            if (entity.entityName === FS.Schema.BookableResourceBooking.name) {
                var bookingId = entity.id;
                var workOrderId = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder]
                    && entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder].id;
                FS.RemoteAssist.localization = FS.BookableResourceBooking.localization;

                // If the Booking and Work Order have Ids
                if (bookingId && workOrderId) {
                    deepLinkData[FS.Common.RemoteAssistLabels.BookingId] = bookingId;
                    deepLinkData[FS.Common.RemoteAssistLabels.WorkOrderId] = workOrderId;
                    // Get the Work Order's Support Contact Id before getting the Support Contact info
                    // then get org URL and system user before sending deep link
                    FS.RemoteAssist.getSupportContactId(deepLinkData);
                }
            }
            else if (entity.entityName === FS.Schema.WorkOrder.name) {
                var workOrderId2 = entity.id;
                FS.RemoteAssist.localization = FS.WorkOrder.localization;

                // If the Work Order has an Id
                if (workOrderId2) {
                    deepLinkData[FS.Common.RemoteAssistLabels.WorkOrderId] = workOrderId2;
                    var supportContactId = entity.properties[FS.Schema.WorkOrder.properties.msdyn_supportContact]
                        && entity.properties[FS.Schema.WorkOrder.properties.msdyn_supportContact].id;

                    // Get the Support Contact's User's AAD Object Id, email, name, and phone number
                    // then get org URL and system user before sending deep link
                    FS.RemoteAssist.getSupportContactUserInfo(deepLinkData, supportContactId);
                }
            }
        }
    },

    getSupportContactId: function (deepLinkData) {
        // Get the Work Order's Support Contact
        MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrder.name, deepLinkData[FS.Common.RemoteAssistLabels.WorkOrderId], function (retrievedWorkOrder) {
            supportContactId = retrievedWorkOrder && retrievedWorkOrder.properties
                && retrievedWorkOrder.properties[FS.Schema.WorkOrder.properties.msdyn_supportContact]
                && retrievedWorkOrder.properties[FS.Schema.WorkOrder.properties.msdyn_supportContact].id;

            // Get the Support User's AAD Object Id
            FS.RemoteAssist.getSupportContactUserInfo(deepLinkData, supportContactId);
        }, function (error) {
            MobileCRM.bridge.alert(FS.RemoteAssist.localization.get("Alert.NoWorkOrder"));
        });
    },

    getSupportContactUserInfo: function (deepLinkData, supportContactId) {
        // Get the Bookable Resource that is the Support Contact
        MobileCRM.DynamicEntity.loadById(FS.Schema.BookableResource.name, supportContactId, function (retrievedSupportContact) {
            var userId = retrievedSupportContact && retrievedSupportContact.properties
                && retrievedSupportContact.properties[FS.Schema.BookableResource.properties.userId]
                && retrievedSupportContact.properties[FS.Schema.BookableResource.properties.userId].id;

            if (userId) {
                // Get the Support Contact's User
                MobileCRM.DynamicEntity.loadById(FS.Schema.User.name, userId, function (retrievedSupportUser) {
                    // Get the User's AAD Object Id, Email address, Phone number, and Name
                    var retrievedSupportUserProperties = retrievedSupportUser && retrievedSupportUser.properties;
                    if (retrievedSupportUserProperties) {
                        var supportContactAADId = retrievedSupportUserProperties[FS.Schema.User.properties.azureActiveDirectoryObjectId];
                        var primaryEmail = retrievedSupportUserProperties[FS.Schema.User.properties.primaryEmail];
                        var mainPhone = retrievedSupportUserProperties[FS.Schema.User.properties.mainPhone];
                        var mobilePhone = retrievedSupportUserProperties[FS.Schema.User.properties.mobilePhone];
                        var fullName = retrievedSupportUserProperties[FS.Schema.User.properties.fullName];
                        var i = 1;

                        //primaryEmail is required, but phone numbers and name are optional
                        if (primaryEmail) {
                            deepLinkData[FS.Common.RemoteAssistLabels.SupportContactAADId] = supportContactAADId;
                            deepLinkData[FS.Common.RemoteAssistLabels.ContactSearch] = [];
                            deepLinkData[FS.Common.RemoteAssistLabels.ContactSearch][0] = primaryEmail;

                            if (mainPhone) {
                                deepLinkData[FS.Common.RemoteAssistLabels.ContactSearch][i++] = mainPhone;
                            }
                            else if (mobilePhone) {
                                deepLinkData[FS.Common.RemoteAssistLabels.ContactSearch][i++] = mobilePhone;
                            }

                            if (fullName) {
                                deepLinkData[FS.Common.RemoteAssistLabels.ContactSearch][i] = fullName;
                            }

                            // Get the Organization URL and the System User's AAD Object Id
                            FS.RemoteAssist.getOrgUrlAndSystemUserAndSendDeepLink(deepLinkData);
                        }
                    }
                }, function (error) {
                    MobileCRM.bridge.alert(FS.RemoteAssist.localization.get("Alert.NoSupportContactUser"));
                });
            }
        }, function (error) {
            MobileCRM.bridge.alert(FS.RemoteAssist.localization.get("Alert.NoSupportContact"));
        });
    },

    getOrgUrlAndSystemUserAndSendDeepLink: function (deepLinkData) {
        MobileCRM.Configuration.requestObject(function (config) {
            if (config && config.settings) {
                var systemUserId = config.settings.systemUserId;
                var orgUrl = config.settings.url;

                // If the System User Id and Org Url are not null
                if (systemUserId && orgUrl) {
                    deepLinkData[FS.Common.RemoteAssistLabels.OrgUrl] = orgUrl;

                    // Get the System User
                    MobileCRM.DynamicEntity.loadById(FS.Schema.User.name, systemUserId, function (retrievedSystemUser) {
                        var systemUserAADId = retrievedSystemUser && retrievedSystemUser.properties
                            && retrievedSystemUser.properties[FS.Schema.User.properties.azureActiveDirectoryObjectId];

                        if (systemUserAADId) {
                            deepLinkData[FS.Common.RemoteAssistLabels.SystemUserAADId] = systemUserAADId;

                            // Sends the Json object via deep link to the Remote Assist app
                            FS.RemoteAssist.sendDeepLink(deepLinkData);
                        }
                    }, MobileCRM.bridge.alert);
                }
            }

            // Returning false because nothing was updated in the config object
            return false;
        }, MobileCRM.bridge.alert);
    },

    sendDeepLink: function (deepLinkData) {
        if (deepLinkData) {
            MobileCRM.RemoteAssist.sendDeepLink(FS.Common.RemoteAssistLabels.DeepLink + window.btoa(JSON.stringify(deepLinkData)));
        }
    }
};