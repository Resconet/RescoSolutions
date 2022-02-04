const userSettingsEntityName = "resco_usersettings";
const userSettingsIdFieldName = "resco_usersettingsid";
const userSettingsOwnerFieldName = "ownerid";
const userSettingsKindFieldName = "resco_kind";
const userSettingsValueFieldName = "resco_value";
const userSettingsKind = "App.FSWelcomeScreen";

async function loadUserSetting() {
	var entity = new MobileCRM.FetchXml.Entity(userSettingsEntityName);
	entity.addAttributes();
	var filter = new MobileCRM.FetchXml.Filter();
	filter.where(userSettingsOwnerFieldName, "eq-userid");
	filter.where(userSettingsKindFieldName, "eq", userSettingsKind);
	entity.filter = filter;
	entity.orderBy("modifiedon", true);
	var fetch = new MobileCRM.FetchXml.Fetch(entity);
	try {
		var results = await fetch.executeAsync("JSON");
		if (results && results.length > 0) {
			return results[0];
		}
	} catch (error) {
		MobileCRM.bridge.alert("An error occurred: " + error);
	}

	return undefined;
}

async function showWelcomeScreen() {
	MobileCRM.UI.IFrameForm.showModal("Welcome", "file://WelcomeScreen/index.html");
}

async function saveUserSetting() {
	var userSetting = new MobileCRM.DynamicEntity(userSettingsEntityName);
	userSetting.properties[userSettingsKindFieldName] = userSettingsKind;
	userSetting.properties[userSettingsValueFieldName] = JSON.stringify({ wasShown: true });
	try {
		userSetting = await userSetting.saveAsync();
	} catch (error) {
		MobileCRM.bridge.alert("An error occurred: " + error);
	}
}

async function init() {
	MobileCRM.UI.IFrameForm.requestObject(
		function (iFrame) {
			iFrame.form.showTitle = false;
		},
		MobileCRM.bridge.alert,
		null,
	);

	if (MobileCRM.bridge.platform === "WebClient") {
		var userSetting = await loadUserSetting();
		if (userSetting) {
			var userSettingParsed = JSON.parse(userSetting[userSettingsValueFieldName]);
			if (userSettingParsed && userSettingParsed.wasShown) {
				return;
			}
		}
		showWelcomeScreen();
		saveUserSetting();
	}
}

init();

