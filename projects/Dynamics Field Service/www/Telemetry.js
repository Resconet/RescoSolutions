var FS = FS || {};

FS.Telemetry = {
    projectVersion: "1.0.3514",

    onError: function (messageOrEvent, error) {
        /* Should only log telemetry when there is an error to log */
        if (error) {
            MobileCRM.Configuration.requestObject(function (config) {
                /* Should only log telemetry when the user has enabled telemetry logging */
                if (config && config.settings && config.settings.telemetryEnabled !== false) {
                    var telemetryInfo = {
                        userAgent: navigator.userAgent,
                        details: error.stack,
                        eventMessage: messageOrEvent,
                        projectVersion: "1.0.3514",
                    };
                    MobileCRM.Telemetry.sendEvent(telemetryInfo);
                }
            });
        }
    },

    wrapFunction: function (fn) {
        return function () {
            try {
                return fn.apply(this, arguments);
            }
            catch (err) {
                if (!err.sentToTelemetry) {
                    FS.Telemetry.onError(err.message, err);
                    err.sentToTelemetry = true;
                }
                throw err;
            }
        };
    },

    wrapFunctionsOfObjectInTryCatch: function (object) {
        try {
            if (object && !object._wrappedForTelemetry) {
                for (var member in object) {
                    if (typeof (object[member]) == "function") {
                        object[member] = FS.Telemetry.wrapFunction(object[member]);
                    }
                    else if (typeof (object[member]) == "object" && object[member] != FS.Telemetry) {
                        FS.Telemetry.wrapFunctionsOfObjectInTryCatch(object[member]);
                    }
                }
                object._wrappedForTelemetry = true; // to avoid wrapping an object several times
            }
        }
        catch (err) {
            if (!err.sentToTelemetry) {
                FS.Telemetry.onError(err.message, err);
                err.sentToTelemetry = true;
            }
            throw err;
        }
    }
};

// Wrap all FS object namespaces for Telemetry on iOS if it is an enabled feature
MobileCRM.Telemetry.isIosJSTelemetryEnabled(function () { FS.Telemetry.wrapFunctionsOfObjectInTryCatch(FS); });

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
    /*if error was already caught and sent to telemetry, dont resend it*/
    if (error && !error.sentToTelemetry) {
        FS.Telemetry.onError(messageOrEvent, error);
    }
};
