(function () {
    if (typeof MobileCRM !== 'undefined') {
        MobileCRM.Telemetry = {
            sendEvent: function (parameters, scope) {
                /// <summary>[v11.0-FieldService]Uses the telemetry parameters passed in to make a telemetry record and sends it to the telemetry endpoint</summary>
                /// <param name="parameters" type="String">The object containing the relevant JS telemetry parameters.</param>
                window.MobileCRM.bridge.command('sendEvent', JSON.stringify(parameters), function () { }, function () { }, scope);
            },
            isIosJSTelemetryEnabled: function (success, failure, scope) {
                if (window.MobileCRM && window.MobileCRM.bridge && window.MobileCRM.bridge.command) {
                    window.MobileCRM.bridge.command('isIosJSTelemetryEnabled', '', success, failure ? failure : function () { }, scope);
                }
            }
        };

        MobileCRM.Workflow = MobileCRM.Workflow || {};
        MobileCRM.Workflow.Action = MobileCRM.Workflow.Action || {};
        MobileCRM.Workflow.Action.execute = function (actionName, parameters, success, failed, scope) {
            /// <summary>[v11.0-FieldService]Asynchronously executes custom workfow action on the server.</summary>
            /// <param name="actionName" type="String">The unique name of the custom action to execute.</param>
            /// <param name="parameters" type="String">The object containing the parameters for the custom action.</param>
            /// <param name="success" type="function(MobileCRM.Reference)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the <see cref="MobileCRM.Reference">Reference</see> to updated/created entity.</param>
            /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
            /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
            window.MobileCRM.bridge.command('executeWorkflowAction', JSON.stringify({ actionName: actionName, actionParameters: JSON.stringify(parameters) }), success, failed, scope);
        };

        MobileCRM.RemoteAssist = {
            sendDeepLink: function (deepLink, success, failed, scope) {
                window.MobileCRM.bridge.command('runRemoteAssist', deepLink, success, failed, scope);
            }
        };

        /// <summary>Function checks the Internet connection.</summary>
        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the {"connected": bool} flag, which represents the state of the Internet connection.</param>
        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
        MobileCRM.isInternetConnected = function (success, failed, scope) {
            MobileCRM.bridge.command("isInternetConnected", null, success, failed, scope);
        };
    }
})();
