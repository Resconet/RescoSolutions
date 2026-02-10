/// <reference path="../JSBridge.js" />
/// <reference path="../Schema.js" />
/// <reference path="../Enums.js" />
/// <reference path="../Common.js" />
/// <reference path="TravelingCalculations.js" />

var FS = FS || {};

FS.BookableResourceBooking = {
    originalEndTime: null,
    currentFSStatus: null,
    lastTimestampStatus: null,
    localization: null,

    // Static variable to hold defaultBookingCommittedStatus that is retrieved on form load
    // Necessary because onChange event can not set field to a value that has to be fetched async
    defaultBookingCommittedStatus: null,

    bookableResourceBookingOnLoad: function () {
        MobileCRM.Localization.initialize(FS.BookableResourceBooking.storeLocalization, MobileCRM.bridge.alert);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customFollowUp, FS.FollowUpWOHelper.FollowUpButton.onButtonClick, true, null);
        MobileCRM.UI.EntityForm.onCommand(FS.Common.CustomCommands.customRemoteAssist, FS.RemoteAssist.onButtonClick, true, null);
        FS.RemoteAssist.showHideRemoteAssistButton();
        MobileCRM.UI.EntityForm.onChange(FS.BookableResourceBooking.handleChange, true, null);
        MobileCRM.UI.EntityForm.onSave(FS.BookableResourceBooking.handleSave, true, null);
        FS.BookableResourceBooking.getDefaultBookingCommittedStatus();
        FS.FollowUpWOHelper.FollowUpButton.setCanCreateWO(null, null);

        MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
            var entityProperties = entityForm && entityForm.entity && entityForm.entity.properties;
            FS.BookableResourceBooking.originalEndTime = entityProperties && entityProperties[FS.Schema.BookableResourceBooking.properties.endTime] || new Date();
            var bookingStatus = entityProperties && entityProperties[FS.Schema.BookableResourceBooking.properties.bookingStatus];
            var isNew = entityForm && entityForm.entity && entityForm.entity.isNew;
            var fStatus = FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Empty;
            var crewMemberType = entityProperties && entityProperties[FS.Schema.BookableResourceBooking.properties.msdyn_crewmembertype];

            if (bookingStatus) {
                MobileCRM.DynamicEntity.loadById(FS.Schema.BookingStatus.name,
                    bookingStatus.id,
                    function (fetchedBookingStatus) {
                        if (fetchedBookingStatus && fetchedBookingStatus.properties) {
                            fStatus = fetchedBookingStatus.properties[FS.Schema.BookingStatus.properties.msdyn_fieldServiceStatus];
                            FS.TravelingCalculations.populateStatus(fStatus, true);
                        }
                        FS.BookableResourceBooking.storeBookingStatusFSStatuses(fStatus);
                        MobileCRM.UI.EntityForm.requestObject(
                            function (entityForm) {
                                FS.BookableResourceBooking.setBookingStatusFieldIsEnabled(entityForm); // Needs FS.BookableResourceBooking.currentFSStatus to be initialized
                            },
                            MobileCRM.bridge.alert);
                    }, MobileCRM.bridge.alert);
                FS.TravelingCalculations.populateOldValues(entityForm.entity);
            }

            if (isNew) {
                FS.BookableResourceBooking.storeBookingStatusFSStatuses(fStatus);
                FS.BookableResourceBooking.setBookingStatusFieldIsEnabled(entityForm); // Needs FS.BookableResourceBooking.currentFSStatus to be initialized
                if (entityProperties) {
                    entityProperties[FS.Schema.BookableResourceBooking.properties.msdyn_bookingMethod] = FS.Enums.BookableResourceBookingmsdyn_BookingMethod.Mobile;
                }
            }

            var isCrewMemberTypeSet = typeof crewMemberType === "number";
            if (isCrewMemberTypeSet &&
                crewMemberType !== FS.Enums.BookableResourceBookingmsdyn_crewmembertype.None &&
                crewMemberType !== -1) { // Resco Mobile is defaulting OptionSet fields to -1 (not to NULL) handle this as None
                switch (crewMemberType) {
                    case FS.Enums.BookableResourceBookingmsdyn_crewmembertype.None:
                        break;
                    case FS.Enums.BookableResourceBookingmsdyn_crewmembertype.Leader:
                        var crewLeaderMessage = FS.BookableResourceBooking.localization.get("Alert.YouAreTheCrewLeader");
                        MobileCRM.bridge.alert(crewLeaderMessage);
                        FS.BookableResourceBooking.setCrewRelatedFieldsEnabled(entityForm, true);
                        break;
                    case FS.Enums.BookableResourceBookingmsdyn_crewmembertype.Member:
                    default:
                        var crewMemberMessage = FS.BookableResourceBooking.localization.get("Alert.YouAreACrewMember");
                        MobileCRM.UI.EntityForm.enableCommand("UpdateGPS", false);
                        MobileCRM.bridge.alert(crewMemberMessage);
                        FS.BookableResourceBooking.setCrewRelatedFieldsEnabled(entityForm, false);
                        break;
                }
            }
            else {
                FS.BookableResourceBooking.setCrewRelatedFieldsEnabled(entityForm, true);
            }

            FS.BookableResourceBooking.checkCurrency(entityForm);
        }, MobileCRM.bridge.alert);
    },

    checkCurrency: function (entityForm) {
        var entityProperties = entityForm && entityForm.entity && entityForm.entity.properties;
        var msdynWorkOrder = entityProperties && entityProperties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder];

        if (msdynWorkOrder) {
            MobileCRM.DynamicEntity.loadById(FS.Schema.WorkOrder.name,
                msdynWorkOrder.id,
                function (workOrder) {
                    MobileCRM.UI.EntityForm.requestObject(function (entityForm) {
                        var entityProperties = entityForm && entityForm.entity && entityForm.entity.properties;

                        var workOrderCurrencyId = workOrder &&
                            workOrder.properties &&
                            workOrder.properties[FS.Schema.WorkOrder.properties.transactionCurrencyId];

                        if (workOrderCurrencyId) {
                            entityProperties[FS.Schema.BookableResourceBooking.properties.transactionCurrencyId] =
                                workOrderCurrencyId;
                        }
                    }, MobileCRM.bridge.alert);
                });
        }
    },

    storeBookingStatusFSStatuses: function (fsStatus) {
        FS.BookableResourceBooking.currentFSStatus = fsStatus;
        FS.BookableResourceBooking.lastTimestampStatus = fsStatus;
    },

    handleChange: function (entityForm) {
        var changedItem = entityForm && entityForm.context && entityForm.context.changedItem;
        var editedEntity = entityForm && entityForm.entity;
        if (changedItem && editedEntity && editedEntity.properties) {
            switch (changedItem) {
                case FS.Schema.BookableResourceBooking.properties.msdyn_workOrder:
                    // Set booking status to default if it is not already set and there is a work order assigned
                    if (FS.BookableResourceBooking.defaultBookingCommittedStatus
                        && !editedEntity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus]
                        && editedEntity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder]) {

                        editedEntity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus] = FS.BookableResourceBooking.defaultBookingCommittedStatus;
                        FS.BookableResourceBooking.handleBookingStatusChange(editedEntity);
                    }
                    FS.BookableResourceBooking.checkCurrency(entityForm);
                    break;
                case FS.Schema.BookableResourceBooking.properties.startTime:
                case FS.Schema.BookableResourceBooking.properties.endTime:
                    FS.BookableResourceBooking.updateDuration(editedEntity);
                    break;
                case FS.Schema.BookableResourceBooking.properties.bookingStatus:
                    FS.BookableResourceBooking.handleBookingStatusChange(editedEntity);
                    break;
                default:
                    break;
            }
        }
    },

    handleBookingStatusChange: function (entity) {
        var bookingStatus = entity && entity.properties && entity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus];
        if (bookingStatus == null) {
            FS.TravelingCalculations.populateStatus(null, false);
        }
        else {
            MobileCRM.DynamicEntity.loadById(FS.Schema.BookingStatus.name, entity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus].id,
                function (fetchedStatus) {
                    if (fetchedStatus && fetchedStatus.properties) {
                        var currentStatus = fetchedStatus.properties[FS.Schema.BookingStatus.properties.msdyn_fieldServiceStatus];
                        FS.TravelingCalculations.populateStatus(currentStatus, false);
                        FS.BookableResourceBooking.currentFSStatus = currentStatus;
                        if (currentStatus === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress
                            || currentStatus === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Completed) {
                            MobileCRM.UI.EntityForm.requestObject(
                                function (entityForm) {
                                    // if work order status is changing to "In Progress" and "Arrival Time" field is null, we set "Arrival Time" field equal to current date.
                                    if (currentStatus === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress
                                        && !Boolean(entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime])) {
                                        entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime] = new Date();
                                    }
                                    // if work order status is changing to "Completed" and "End Time" field is not actual, we set "End Time" field equal to current date.
                                    else if (currentStatus === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Completed
                                        && (!Boolean(entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.endTime])
                                            || entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.endTime].valueOf()
                                            === FS.BookableResourceBooking.originalEndTime.valueOf())) {
                                        entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.endTime] = new Date();
                                        FS.BookableResourceBooking.updateDuration(entityForm.entity);
                                    }
                                }, MobileCRM.bridge.alert);
                        }
                    }
                }, MobileCRM.bridge.alert, null);
        }
    },

    updateDuration: function (editedEntity) {
        if (!!editedEntity.properties[FS.Schema.BookableResourceBooking.properties.startTime] &&
            !!editedEntity.properties[FS.Schema.BookableResourceBooking.properties.endTime]) {
            var startDate = editedEntity.properties[FS.Schema.BookableResourceBooking.properties.startTime].setSeconds(0, 0);
            var endDate = editedEntity.properties[FS.Schema.BookableResourceBooking.properties.endTime].setSeconds(0, 0);
            var subtractResult = Math.floor((endDate - startDate) / (1000 * 60)); // Convert to minutes

            editedEntity.properties[FS.Schema.BookableResourceBooking.properties.duration] = subtractResult < 0 ? 0 : subtractResult;
        }
    },

    handleSave: function (entityForm) {
        var entity = entityForm && entityForm.entity;
        var bookingStatusId = entity && entity.properties && entity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus] && entity.properties[FS.Schema.BookableResourceBooking.properties.bookingStatus].id;
        var workOrder = entity && entity.properties && entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder];

        FS.TravelingCalculations.populateNewValues(entity);

        // Only allow save for booking with work order if Field Service Status is not empty
        if (workOrder) {
            // If Booking Status has no Field Service Status, result comes back as -1
            if (FS.BookableResourceBooking.currentFSStatus <= 0) {
                entityForm.context.errorMessage = FS.BookableResourceBooking.localization.get("Alert.BookingStatus_FieldServiceStatusMissing");
                // Return true to apply changed values
                return true;
            }
        }

        var errorMessage = FS.TravelingCalculations.runTravelingCalculations(entity);
        if (errorMessage) {
            entityForm.context.errorMessage = errorMessage;
            // Return true to apply changed values
            return true;
        }

        // update msdyn_preventTimestampCreation to make it dirty after timestamps generation
        if (entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_preventTimestampCreation] === true) {
            entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_preventTimestampCreation] = false;
        }

        var saveHandler = entityForm.suspendSave();
        MobileCRM.Configuration.requestObject(function (config) {
            if (config && config.isOnline === false) {
                FS.BookableResourceBooking.createBookingTimestamp(entity, saveHandler); // Resumes save
            }
            else {
                saveHandler.resumeSave();
            }
        }, function (error) {
            saveHandler.resumeSave(error);
        });
    },

    setCrewRelatedFieldsEnabled: function (entityForm, isEnabled) {
        // Disable fields maintained by Crew Leader
        var detailView = entityForm && entityForm.getDetailView(FS.Common.TabNames.BRB_BookingTab);

        function enableField(fieldName) {
            var field = detailView.getItemByName(fieldName);
            if (field) {
                field.isEnabled = !!isEnabled;
            }
        }

        if (detailView) {
            enableField(FS.Schema.BookableResourceBooking.properties.bookingStatus);
            enableField(FS.Schema.BookableResourceBooking.properties.startTime);
            enableField(FS.Schema.BookableResourceBooking.properties.endTime);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_estimatedArrivalTime);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_estimatedTravelDuration);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_actualTravelDuration);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_milesTraveled);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_latitude);
            enableField(FS.Schema.BookableResourceBooking.properties.msdyn_longitude);
        }
    },

    setBookingStatusFieldIsEnabled: function (entityForm) {
        var detailView = entityForm.getDetailView(FS.Common.TabNames.BRB_BookingTab);
        var bookingStatusItem = detailView && detailView.getItemByName(FS.Schema.BookableResourceBooking.properties.bookingStatus);
        if (detailView && bookingStatusItem) {
            // disable booking status field if it's already disabled or if status is Completed; enable it otherwise
            bookingStatusItem.isEnabled = bookingStatusItem.isEnabled !== false ? FS.BookableResourceBooking.currentFSStatus !== FS.Enums.msdyn_bookingtimestampmsdyn_SystemStatus.Completed : false;
        }
    },

    createBookingTimestamp: function (entity, saveHandler) {
        var workOrder = entity && entity.properties && entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_workOrder];

        if (workOrder && FS.BookableResourceBooking.lastTimestampStatus !== FS.BookableResourceBooking.currentFSStatus) {
            var bookingReference = new MobileCRM.Reference(entity.entityName, entity.id, entity.primaryName);
            var timestampProperties = {};
            timestampProperties[FS.Schema.BookingTimestamp.properties.msdyn_booking] = bookingReference;
            timestampProperties[FS.Schema.BookingTimestamp.properties.msdyn_systemStatus] = FS.BookableResourceBooking.currentFSStatus;
            timestampProperties[FS.Schema.BookingTimestamp.properties.msdyn_timestampTime] = new Date();
            timestampProperties[FS.Schema.BookingTimestamp.properties.msdyn_timestampSource] = FS.Enums.msdyn_bookingtimestampmsdyn_TimestampSource.Mobile;
            timestampProperties[FS.Schema.BookingTimestamp.properties.msdyn_generateJournals] = FS.BookableResourceBooking.currentFSStatus === FS.Enums.msdyn_bookingtimestampmsdyn_SystemStatus.Completed;

            var timestamp = MobileCRM.DynamicEntity.createNew(FS.Schema.BookingTimestamp.name, null, null, timestampProperties);

            timestamp.save(
                function (error) {
                    if (error) {
                        saveHandler.resumeSave(error);
                    }
                    else {
                        MobileCRM.UI.EntityForm.requestObject(
                            function (entityForm) {
                                if (entityForm && entityForm.entity && entityForm.entity.properties) {
                                    entityForm.entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_preventTimestampCreation] = true;
                                }
                                FS.BookableResourceBooking.setBookingStatusFieldIsEnabled(entityForm);
                                saveHandler.resumeSave();
                            },
                            saveHandler.resumeSave);
                    }
                }
            );
        }
        else {
            saveHandler.resumeSave();
        }
    },

    checkSyncErrorsAndHandleServerRecordUpdate: function (config) {
        /// <summary>Get settings for configuration and handle server record update.</summary>
        /// <param name='config' type='MobileCRM.Configuration'>Configuration object.</param>

        // return immediately if sync error exists
        if (config.settings.hasSyncErrors) {
            return;
        }

        // handle server record update
        MobileCRM.UI.EntityForm.requestObject(FS.BookableResourceBooking.handleServerRecordUpdate, FS.BookableResourceBooking.messageBox, null);
    },

    handleServerRecordUpdate: function (entityForm) {
        /// <summary>Handle the record when it has been updated in the server.</summary>
        /// <param name='entityForm' type='MobileCRM.UI'/>
        var entity = entityForm.entity;

        //In case the form was cleared and the data hasn't been loaded yet
        if(!entity) {
            return;
        }
        
        var fetchEntity = new MobileCRM.FetchXml.Entity(entity.entityName);

        // skip checking the record with the server when user creates a BRB record in the client 
        // before saving where createdon field is undefined
        if (!entity.properties[FS.Schema.BookableResourceBooking.properties.createdOn]) {
            return;
        }

        var primaryKeyName = FS.Schema.BookableResourceBooking.properties.bookableResourceBookingId;
        fetchEntity.addAttribute(primaryKeyName); // id of entity.
        fetchEntity.addAttribute(FS.Schema.BookableResourceBooking.properties.modifiedOn);

        // Set filter to fetch only specific record.
        fetchEntity.filter = new MobileCRM.FetchXml.Filter();
        fetchEntity.filter.where(primaryKeyName, "eq", entity.id);

        var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);

        var notifyUserIfBookingDeleted = FS.BookableResourceBooking.showErrorIfBookingDeletedOnServer.bind(this, entity);

        // do not throw error when there is no network connection, set error callback to null 
        fetch.executeOnline("Array", notifyUserIfBookingDeleted, null, null);
    },

    showErrorIfBookingDeletedOnServer: function (entity, result) {
        /// <summary>Based on different scenarios, the system will notify the user that the record has been removed.</summary>
        /// <param name='entity' type='MobileCRM.DynamicEntity'/>
        /// <param name='result' type='Array'>Array of results returned by fetch.executeOnline.</param>
        if (!(result && result.length > 0) && entity.properties[FS.Schema.BookableResourceBooking.properties.versionNumber])
        {
            // when result.length = 0, it can be the record is created and saved in the client or
            // the record has been removed in the server. When the record is newly created and saved in
            // the client, versionNumber is undefined and we should do nothing. Therefore, when versionNumber
            // has a value, that means the record has been removed in the server, throw an error msg to have
            // user sync the data.
            FS.BookableResourceBooking.messageBox(FS.BookableResourceBooking.localization.get("Alert.RecordHasBeenDeleted"), MobileCRM.UI.EntityForm.closeWithoutSaving);
        }

        return;
    },

    messageBox: function (message, callback) {
        /// <summary>Show message in the message box.</summary>
        /// <param name='message' type='String'>A message.</param>
        /// <param name='callback' type='function(Object)'>Callback that will be executed.</param>
        FS.Common.messageBox(message, [FS.BookableResourceBooking.localization.get("Cmd.Ok")], callback);
    },

    getDefaultBookingCommittedStatus: function () {
        /// <summary>Fetch the defaultBookingCommittedStatus from msdyn_bookingsetupmetadata and store it in a static variable</summary>
        var fetchBookingSetupMetadata = new MobileCRM.FetchXml.Entity(FS.Schema.BookingSetupMetadata.name);
        fetchBookingSetupMetadata.addAttribute(FS.Schema.BookingSetupMetadata.properties.msdyn_defaultBookingCommittedStatus);
        fetchBookingSetupMetadata.filter = new MobileCRM.FetchXml.Filter();
        fetchBookingSetupMetadata.filter.where(FS.Schema.BookingSetupMetadata.properties.msdyn_entityLogicalName, "eq", FS.Schema.BookableResourceBooking.properties.msdyn_workOrder);

        var fetch = new MobileCRM.FetchXml.Fetch(fetchBookingSetupMetadata);

        fetch.execute("Array", function (results) {
            if (results && results.length > 0) {
                FS.BookableResourceBooking.defaultBookingCommittedStatus = results[0][0]; //second 0 is the index of the msdyn_defaultBookingCommittedStatus attribute
            }
        }, MobileCRM.bridge.alert, null);
    },

    storeLocalization: function (localization) {
        FS.BookableResourceBooking.localization = localization;

        // get required settings for synchronize and execute server record update operation
        MobileCRM.Configuration.requestObject(FS.BookableResourceBooking.checkSyncErrorsAndHandleServerRecordUpdate, FS.BookableResourceBooking.messageBox);
    }
};