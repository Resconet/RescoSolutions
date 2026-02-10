var FS = FS || {};

FS.TravelingCalculations = {
    actualArrivalTimeNew: null,
    actualArrivalTimeOld: null,
    startTimeNew: null,
    startTimeOld: null,
    endTimeNew: null,
    endTimeOld: null,
    durationNew: null,
    durationOld: null,
    actualTravelDurationNew: null,
    actualTravelDurationOld: null,
    estimatedTravelDurationNew: null,
    estimatedTravelDurationOld: null,
    estimatedArrivalTimeNew: null,
    estimatedArrivalTimeOld: null,
    statusOld: null,
    statusNew: null,

    durationWasCalculated: null,

    isAATChanged: null,
    isATDChanged: null,
    isSTChanged: null,
    isETChanged: null,
    isStatusChanged: null,

    isAATChangedFromNull: null,
    isAATChangedFromNullToEarlierST: null,
    isAATChangedFromNullToLaterET: null,
    isATDNotChangedAndIsNull: null,
    isAATIsChangedAndIsInSTAndET: null,
    isAATIsChangedFromNullAndIsInSTAndET: null,
    isAATIsChangedFromNullAndIsNotInSTAndET: null,
    isAATIsChangedToNull: null,
    isSTChangedEarlierOrEqToAAT: null,
    isSTChangedGreatToAAT: null,
    isSTChangedLaterOrEqualToET: null,
    isETChangedLaterAAT: null,
    isETChangedEarlierOrEqToAAT: null,
    isATDChangedFromNull: null,
    isSTAndATDLtOrEqET: null,
    isATDChangedFromOldToNew: null,
    isAATIsChangedFromValueAndIsNotInSTAndET: null,
    isAATChangedFromValue: null,
    isATDNotChangedAndIsValue: null,
    isStatusChangedToComplete: null,
    isStatusChangedToCompleteAndETNotChanged: null,
    isStatusChangedFromInactiveToActive: null,
    isAATIsChangedFromValueAndIsInSTAndET: null,

    startTimeResult: null,
    endTimeResult: null,
    actualArrivalTimeResult: null,
    actualTravelDurationResult: null,
    durationResult: null,

    validationMessage: null,
    currentTime: null,

    populateOldValues: function (entity) {
        FS.TravelingCalculations.actualArrivalTimeOld = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime];
        FS.TravelingCalculations.startTimeOld = entity.properties[FS.Schema.BookableResourceBooking.properties.startTime];
        FS.TravelingCalculations.endTimeOld = entity.properties[FS.Schema.BookableResourceBooking.properties.endTime];
        FS.TravelingCalculations.durationOld = entity.properties[FS.Schema.BookableResourceBooking.properties.duration];
        FS.TravelingCalculations.actualTravelDurationOld = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualTravelDuration];
        FS.TravelingCalculations.estimatedTravelDurationOld = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_estimatedTravelDuration];
        FS.TravelingCalculations.estimatedArrivalTimeOld = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_estimatedArrivalTime];
    },

    populateNewValues: function (entity) {
        FS.TravelingCalculations.actualArrivalTimeNew = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime];
        FS.TravelingCalculations.startTimeNew = entity.properties[FS.Schema.BookableResourceBooking.properties.startTime];
        FS.TravelingCalculations.endTimeNew = entity.properties[FS.Schema.BookableResourceBooking.properties.endTime];
        FS.TravelingCalculations.durationNew = entity.properties[FS.Schema.BookableResourceBooking.properties.duration];
        FS.TravelingCalculations.actualTravelDurationNew = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualTravelDuration];
        FS.TravelingCalculations.estimatedTravelDurationNew = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_estimatedTravelDuration];
        FS.TravelingCalculations.estimatedArrivalTimeNew = entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_estimatedArrivalTime];

        FS.TravelingCalculations.isAATChanged = FS.TravelingCalculations.isDateChanged(FS.TravelingCalculations.actualArrivalTimeOld, FS.TravelingCalculations.actualArrivalTimeNew);
        FS.TravelingCalculations.isATDChanged = FS.TravelingCalculations.actualTravelDurationNew != FS.TravelingCalculations.actualTravelDurationOld;
        FS.TravelingCalculations.isSTChanged = FS.TravelingCalculations.isDateChanged(FS.TravelingCalculations.startTimeOld, FS.TravelingCalculations.startTimeNew);
        FS.TravelingCalculations.isETChanged = FS.TravelingCalculations.isDateChanged(FS.TravelingCalculations.endTimeOld, FS.TravelingCalculations.endTimeNew);
    },

    populateStatus: function (status, isOld) {
        if (isOld) {
            FS.TravelingCalculations.statusOld = status;
        }
        else {
            FS.TravelingCalculations.statusNew = status;
            FS.TravelingCalculations.isStatusChanged = status != FS.TravelingCalculations.statusOld;
        }
    },

    isDateChanged: function (oldDate, newDate) {
        return (oldDate != undefined && newDate != undefined && oldDate.getTime() != newDate.getTime())
        || ((oldDate == undefined || newDate == undefined) && oldDate != newDate);
    },

    addMinutes: function (date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
    },

    getMinuteDuration: function (startDate, endDate) {
        return (endDate.getTime() - startDate.getTime()) / 60000;
    },

    initializeConditions: function () {
        FS.TravelingCalculations.isAATChangedFromValue = FS.TravelingCalculations.isAATChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.actualArrivalTimeOld != null;
        FS.TravelingCalculations.isAATChangedFromNull = FS.TravelingCalculations.isAATChanged && FS.TravelingCalculations.actualArrivalTimeOld == null && FS.TravelingCalculations.actualArrivalTimeNew != null;
        FS.TravelingCalculations.isAATIsChangedToNull = FS.TravelingCalculations.isAATChanged && FS.TravelingCalculations.actualArrivalTimeNew == null;
        FS.TravelingCalculations.isAATChangedFromNullToEarlierST = FS.TravelingCalculations.isAATChangedFromNull && FS.TravelingCalculations.startTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isAATChangedFromNullToLaterET = FS.TravelingCalculations.isAATChangedFromNull && FS.TravelingCalculations.endTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isATDNotChangedAndIsNull = !FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationNew == null;
        FS.TravelingCalculations.isAATIsChangedAndIsInSTAndET = FS.TravelingCalculations.isAATChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.startTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime() && FS.TravelingCalculations.endTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isAATIsChangedFromNullAndIsInSTAndET = FS.TravelingCalculations.isAATChangedFromNull && FS.TravelingCalculations.startTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime() && FS.TravelingCalculations.endTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isAATIsChangedFromNullAndIsNotInSTAndET = FS.TravelingCalculations.isAATChangedFromNull && (FS.TravelingCalculations.startTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime() || FS.TravelingCalculations.endTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime());
        FS.TravelingCalculations.isAATIsChangedFromValueAndIsNotInSTAndET = FS.TravelingCalculations.isAATChangedFromValue && (FS.TravelingCalculations.startTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime() || FS.TravelingCalculations.endTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime());
        FS.TravelingCalculations.isAATIsChangedFromValueAndIsInSTAndET = FS.TravelingCalculations.isAATChangedFromValue && FS.TravelingCalculations.startTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime() && FS.TravelingCalculations.endTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isSTChangedEarlierOrEqToAAT = FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.startTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isSTChangedGreatToAAT = FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.startTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isSTChangedLaterOrEqualToET = FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.startTimeNew.getTime() >= FS.TravelingCalculations.endTimeNew.getTime();
        FS.TravelingCalculations.isETChangedEarlierOrEqualToST = FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.startTimeNew.getTime() >= FS.TravelingCalculations.endTimeNew.getTime();
        FS.TravelingCalculations.isETChangedLaterAAT = FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.endTimeNew.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isETChangedEarlierOrEqToAAT = FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.actualArrivalTimeNew != null && FS.TravelingCalculations.endTimeNew.getTime() <= FS.TravelingCalculations.actualArrivalTimeNew.getTime();
        FS.TravelingCalculations.isSTAndATDLtOrEqET = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeNew, FS.TravelingCalculations.actualTravelDurationNew || 0) >= FS.TravelingCalculations.endTimeNew;
        FS.TravelingCalculations.isATDChangedFromNull = FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationOld == null && FS.TravelingCalculations.actualTravelDurationNew != null;
        FS.TravelingCalculations.isATDChangedFromOldToNew = FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationOld != null && FS.TravelingCalculations.actualTravelDurationNew != null;
        FS.TravelingCalculations.isATDNotChangedAndIsValue = !FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationNew != null && FS.TravelingCalculations.actualTravelDurationOld != null;
        FS.TravelingCalculations.isStatusChangedToComplete = FS.TravelingCalculations.isStatusChanged && (FS.TravelingCalculations.statusNew === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Completed);
        FS.TravelingCalculations.isStatusChangedToCompleteAndETNotChanged = FS.TravelingCalculations.isStatusChangedToComplete && !FS.TravelingCalculations.isETChanged;
        FS.TravelingCalculations.isStatusChangedFromInactiveToActive = FS.TravelingCalculations.isStatusChanged && ((FS.TravelingCalculations.statusOld == FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Completed || FS.TravelingCalculations.statusOld === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Canceled)) && ((FS.TravelingCalculations.statusNew != FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Completed && FS.TravelingCalculations.statusNew != FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Canceled));
    },

    calculateValues: function () {
        FS.TravelingCalculations.initializeConditions();

        FS.TravelingCalculations.logicStatuses();

        if (FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
            FS.TravelingCalculations.logicAAT(false);
        }
        else if (FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(false);
            FS.TravelingCalculations.logicATD(false);
        }
        else if (FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
            FS.TravelingCalculations.logicAAT(true);
        }
        else if (FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && !FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicAAT(false);
        }
        else if (!FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
        }
        else if (FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.isSTChanged && !FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(false);
            FS.TravelingCalculations.logicATD(false);
        }
        else if (FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(false);
            FS.TravelingCalculations.logicATD(true);
        }
        else if (!FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
            FS.TravelingCalculations.logicAAT(false);
        }
        else if (!FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.isSTChanged && !FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
        }
        else if (!FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicStartEndTimes(true);
        }
        else if (!FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && !FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicAAT(false);
        }
        else if (FS.TravelingCalculations.isATDChanged && !FS.TravelingCalculations.isSTChanged && !FS.TravelingCalculations.isETChanged && !FS.TravelingCalculations.isAATChanged) {
            FS.TravelingCalculations.logicATD(false);
        }
        FS.TravelingCalculations.logicValidation();

        if (FS.TravelingCalculations.statusNew === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress
            && FS.TravelingCalculations.endTimeNew && FS.TravelingCalculations.isETChanged
            && FS.TravelingCalculations.actualArrivalTimeOld == null) {
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.endTimeNew;
        }

        if (FS.TravelingCalculations.actualTravelDurationResult && FS.TravelingCalculations.actualTravelDurationResult < 0) {
            FS.TravelingCalculations.actualTravelDurationResult = 0;
        }
    },

    logicStatuses: function () {
        if (FS.TravelingCalculations.isStatusChanged) {
            if (FS.TravelingCalculations.statusNew === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress && FS.TravelingCalculations.actualArrivalTimeNew && FS.TravelingCalculations.actualArrivalTimeOld == null) {
                if (FS.TravelingCalculations.startTimeOld) {
                    var estDuration = FS.TravelingCalculations.estimatedTravelDurationOld || 0;
                    var estArrivalTime = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeOld, estDuration);
                    var workTime = FS.TravelingCalculations.getMinuteDuration(estArrivalTime, FS.TravelingCalculations.endTimeOld);
                    FS.TravelingCalculations.endTimeNew = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeNew || new Date(), workTime);
                    FS.TravelingCalculations.isETChanged = true;
                    FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeOld, FS.TravelingCalculations.endTimeNew);

                    if (FS.TravelingCalculations.startTimeOld.getTime() > FS.TravelingCalculations.actualArrivalTimeNew.getTime()) {
                        FS.TravelingCalculations.durationResult = workTime;
                        FS.TravelingCalculations.startTimeNew = FS.TravelingCalculations.actualArrivalTimeNew;
                        FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.startTimeNew;
                    }

                    FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.endTimeNew;

                    FS.TravelingCalculations.durationNew = FS.TravelingCalculations.durationResult;
                    FS.TravelingCalculations.durationWasCalculated = true;
                }

                FS.TravelingCalculations.initializeConditions();
            }

            if (FS.TravelingCalculations.statusNew === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.Traveling && !FS.TravelingCalculations.isAATChanged && FS.TravelingCalculations.actualArrivalTimeNew == null && FS.TravelingCalculations.actualArrivalTimeOld == null) {
                var startTime = FS.TravelingCalculations.startTimeNew;
                FS.TravelingCalculations.startTimeNew = FS.TravelingCalculations.getCurrentTime();

                if (FS.TravelingCalculations.durationOld) {
                    FS.TravelingCalculations.endTimeNew = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeNew, FS.TravelingCalculations.durationOld);
                    FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.endTimeNew;
                }

                FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.startTimeNew;
                FS.TravelingCalculations.isSTChanged = true;
                FS.TravelingCalculations.initializeConditions();
            }
        }

        if (FS.TravelingCalculations.isStatusChangedFromInactiveToActive && !FS.TravelingCalculations.isETChanged && FS.TravelingCalculations.endTimeNew < new Date()) {
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(new Date(), 1);
            FS.TravelingCalculations.endTimeNew = FS.TravelingCalculations.endTimeResult;
            FS.TravelingCalculations.isETChanged = true;
            FS.TravelingCalculations.initializeConditions();
        }
    },

    applyValues: function (entity) {
        entity.properties[FS.Schema.BookableResourceBooking.properties.startTime] = FS.TravelingCalculations.startTimeResult || entity.properties[FS.Schema.BookableResourceBooking.properties.startTime];
        entity.properties[FS.Schema.BookableResourceBooking.properties.endTime] = FS.TravelingCalculations.endTimeResult || entity.properties[FS.Schema.BookableResourceBooking.properties.endTime];
        entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime] = FS.TravelingCalculations.actualArrivalTimeResult || entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualArrivalTime];
        entity.properties[FS.Schema.BookableResourceBooking.properties.duration] = Math.round(FS.TravelingCalculations.durationResult) || entity.properties[FS.Schema.BookableResourceBooking.properties.duration];
        entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualTravelDuration] = FS.TravelingCalculations.actualTravelDurationResult != null ? Math.round(FS.TravelingCalculations.actualTravelDurationResult) : entity.properties[FS.Schema.BookableResourceBooking.properties.msdyn_actualTravelDuration];
    },

    logicStartEndTimes: function (updateATD) {
        FS.TravelingCalculations.logicValidation();
        if (FS.TravelingCalculations.isSTChanged || FS.TravelingCalculations.isETChanged) {
            if (FS.TravelingCalculations.isSTChangedEarlierOrEqToAAT && updateATD) {
                FS.TravelingCalculations.actualTravelDurationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeNew, FS.TravelingCalculations.actualArrivalTimeNew);
                FS.TravelingCalculations.actualTravelDurationOld = FS.TravelingCalculations.actualTravelDurationNew;
                FS.TravelingCalculations.actualTravelDurationNew = FS.TravelingCalculations.actualTravelDurationResult;
                FS.TravelingCalculations.isATDChanged = true;
            }
            if (FS.TravelingCalculations.durationWasCalculated != true && FS.TravelingCalculations.startTimeResult && FS.TravelingCalculations.endTimeResult) {
                FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.endTimeResult);
                FS.TravelingCalculations.durationOld = FS.TravelingCalculations.durationNew;
                FS.TravelingCalculations.durationNew = FS.TravelingCalculations.durationResult;
            }
        }
    },

    logicAAT: function (withEndTime) {
        FS.TravelingCalculations.initializeConditions();

        if (FS.TravelingCalculations.isAATChangedFromNullToEarlierST && (FS.TravelingCalculations.isATDNotChangedAndIsNull || FS.TravelingCalculations.actualTravelDurationOld == 0)) {
            FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.actualArrivalTimeNew;
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.durationNew);
            FS.TravelingCalculations.actualTravelDurationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.actualArrivalTimeNew);
        }

        if (FS.TravelingCalculations.isAATChangedFromNullToLaterET) {
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeNew, 1);
            FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.endTimeResult, -1 * FS.TravelingCalculations.durationNew);
            FS.TravelingCalculations.actualTravelDurationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.actualArrivalTimeNew);
        }

        if ((FS.TravelingCalculations.isAATIsChangedFromNullAndIsInSTAndET || FS.TravelingCalculations.isAATIsChangedFromValueAndIsInSTAndET) && !FS.TravelingCalculations.isATDChanged) {
            FS.TravelingCalculations.actualTravelDurationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeNew, FS.TravelingCalculations.actualArrivalTimeNew);
        }

        if ((FS.TravelingCalculations.isAATIsChangedFromValueAndIsNotInSTAndET) || ((FS.TravelingCalculations.isAATIsChangedFromNullAndIsInSTAndET || FS.TravelingCalculations.isAATIsChangedFromValueAndIsInSTAndET) && FS.TravelingCalculations.isATDChanged)) {
            var atd = FS.TravelingCalculations.actualTravelDurationNew || 0;
            FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeNew, -1 * atd);

            if (!withEndTime) {
                FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.durationNew);
            }
            else {
                var endTime = FS.TravelingCalculations.endTimeResult || FS.TravelingCalculations.endTimeNew;
                FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, endTime);
            }
            if (FS.TravelingCalculations.endTimeResult && FS.TravelingCalculations.endTimeResult < FS.TravelingCalculations.actualArrivalTimeNew) {
                FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeNew, 1);
                FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.endTimeResult);
            }
        }

        if (FS.TravelingCalculations.isAATIsChangedToNull) {
            FS.TravelingCalculations.actualTravelDurationResult = 0;
        }
    },

    logicATD: function (withEndTime) {
        FS.TravelingCalculations.initializeConditions();

        var currentTime = new Date();

        if ((FS.TravelingCalculations.isATDChangedFromNull || (FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationOld == 0)) && FS.TravelingCalculations.actualTravelDurationNew != 0 && FS.TravelingCalculations.actualArrivalTimeNew == null && FS.TravelingCalculations.isSTAndATDLtOrEqET) {
            FS.TravelingCalculations.actualArrivalTimeResult = currentTime;
            var atd = FS.TravelingCalculations.actualTravelDurationNew || 0;
            FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeResult, -1 * atd);
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeResult, atd + 1);
            FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.endTimeResult);
        }

        if ((FS.TravelingCalculations.isATDChangedFromNull || (FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationOld == 0)) && FS.TravelingCalculations.actualTravelDurationNew != 0 && !FS.TravelingCalculations.isSTAndATDLtOrEqET && FS.TravelingCalculations.actualArrivalTimeNew == null) {
            FS.TravelingCalculations.actualArrivalTimeResult = currentTime;
            var atd = FS.TravelingCalculations.actualTravelDurationNew || 0;
            FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeResult, -1 * atd);
            var dur = FS.TravelingCalculations.durationNew || 0;
            FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeResult, dur);
        }

        if (FS.TravelingCalculations.isATDChangedFromOldToNew && FS.TravelingCalculations.isSTAndATDLtOrEqET && FS.TravelingCalculations.actualArrivalTimeNew && !FS.TravelingCalculations.isAATChanged) {
            var atd = FS.TravelingCalculations.actualTravelDurationNew || 0;
            if (!withEndTime) {
                FS.TravelingCalculations.endTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeNew, atd + 1);
                FS.TravelingCalculations.actualArrivalTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeNew, atd);
                FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeNew, FS.TravelingCalculations.endTimeResult);
            }
            else {
                FS.TravelingCalculations.actualArrivalTimeResult = FS.TravelingCalculations.actualArrivalTimeNew ? FS.TravelingCalculations.actualArrivalTimeNew : FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.endTimeNew, -1);
                FS.TravelingCalculations.startTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.actualArrivalTimeResult, -1 * FS.TravelingCalculations.actualTravelDurationNew);
                FS.TravelingCalculations.durationResult = FS.TravelingCalculations.getMinuteDuration(FS.TravelingCalculations.startTimeResult, FS.TravelingCalculations.endTimeNew);
            }
        }

        if ((FS.TravelingCalculations.isATDChangedFromOldToNew || FS.TravelingCalculations.isATDChanged && FS.TravelingCalculations.actualTravelDurationOld) && FS.TravelingCalculations.actualArrivalTimeNew && !FS.TravelingCalculations.isSTAndATDLtOrEqET && !FS.TravelingCalculations.isAATChanged) {
            var atd = FS.TravelingCalculations.actualTravelDurationNew || 0;
            FS.TravelingCalculations.actualArrivalTimeResult = FS.TravelingCalculations.addMinutes(FS.TravelingCalculations.startTimeNew, atd);
        }
    },

    logicValidation: function () {
        FS.TravelingCalculations.initializeConditions();

        if (FS.TravelingCalculations.isSTChangedGreatToAAT && !FS.TravelingCalculations.isSTChangedLaterOrEqualToET) {
            FS.TravelingCalculations.validationMessage = FS.BookableResourceBooking.localization.get("Alert.StartTimeLaterThanActualArrivalTime");
        }

        if (FS.TravelingCalculations.isETChangedEarlierOrEqToAAT) {
            FS.TravelingCalculations.validationMessage = FS.BookableResourceBooking.localization.get("Alert.EndTimeEarlierThanActualArrivalTime");
        }

        if (FS.TravelingCalculations.isSTChangedLaterOrEqualToET || FS.TravelingCalculations.isETChangedEarlierOrEqualToST) {
            FS.TravelingCalculations.validationMessage = FS.BookableResourceBooking.localization.get("Alert.StartTimeLaterThanEndTime");
        }

        if (((FS.TravelingCalculations.isStatusChanged && FS.TravelingCalculations.statusNew === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress) || (!FS.TravelingCalculations.isStatusChanged && FS.TravelingCalculations.statusOld === FS.Enums.BookingStatusmsdyn_FieldServiceStatus.InProgress)) && FS.TravelingCalculations.actualArrivalTimeResult == null && FS.TravelingCalculations.actualArrivalTimeNew == null) {
            FS.TravelingCalculations.validationMessage = FS.BookableResourceBooking.localization.get("Alert.ActualArrivalTimeMustBeSet");
        }
    },

    runTravelingCalculations: function (entity) {
        FS.TravelingCalculations.calculateValues();

        if (FS.TravelingCalculations.validationMessage) {
            var validationMessage = FS.TravelingCalculations.validationMessage;
            FS.TravelingCalculations.validationMessage = null;

            return validationMessage;
        }

        FS.TravelingCalculations.applyValues(entity);
    },

    getCurrentTime: function () {
        if (!FS.TravelingCalculations.currentTime) {
            FS.TravelingCalculations.currentTime = new Date();

            //Server rounds durations to minutes
            //Therefore, to avoid bugs due to 0m duration (i.e. 59 seconds are rounded to 0 minutes)
            //we have to truncate seconds, so that time difference is always at least 60 seconds
            FS.TravelingCalculations.currentTime.setSeconds(0, 0);
        }

        return FS.TravelingCalculations.currentTime;
    }
};