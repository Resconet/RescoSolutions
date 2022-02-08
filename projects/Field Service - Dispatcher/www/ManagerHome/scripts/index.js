const MobileCRM = window.MobileCRM;

let homeFormItems;

window.addEventListener("DOMContentLoaded", async () => {
	homeFormItems = await getHomeFormItems();
	createCardsClickListener();
	fillInspectorPopup();
});

const getHomeFormItems = () => {
	return new Promise((resolve, _reject) => {
		MobileCRM.UI.HomeForm.requestObject(homeForm => {
			if (!homeForm) {
				MobileCRM.bridge.alert("HomeForm not found");
				return;
			}

			const homeFormItems = homeForm.items.map(item => ({
				title: item.title,
				name: item.name,
			}));
			resolve(homeFormItems);
		}, MobileCRM.bridge.alert);
	});
};

const createCardsClickListener = () => {
	const containerEl = document.body;
	containerEl.addEventListener("click", onContainerClick);
};

const onContainerClick = event => {
	const { target } = event;
	if (!target.classList.contains("card")) return;

	const itemTitle = target.getAttribute("homeform-title");
	const homeFormItem = homeFormItems.find(item => item.title === itemTitle);

	if (!homeFormItem) {
		console.log("homeFormItem " + itemTitle + " not found in: ", homeFormItems);
		return;
	}

	MobileCRM.UI.HomeForm.openHomeItemAsync(homeFormItem.name, console.log, null);
};

const fillInspectorPopup = async () => {
	const { mail, organization, url } = await requestObject();
	const domain = window.location.hostname;
	new QRCode(document.querySelector(".inspector-popup__qr"), url);

	document.querySelector("#mail").innerHTML = mail;
	document.querySelector("#organization").innerHTML = `https://${domain}/${organization}`;
};

const toggleInspectorPopup = () => {
	const popupEl = document.querySelector(".inspector-popup__wrapper");
	if (popupEl.classList.contains("inspector-popup__wrapper--visible")) {
		popupEl.classList.remove("inspector-popup__wrapper--visible");
	} else {
		popupEl.classList.add("inspector-popup__wrapper--visible");
	}
};

const requestObject = async () => {
	return new Promise((resolve, reject) => {
		MobileCRM.Configuration.requestObject(
			config => {
				const { settings } = config;
				const { systemUserId, crmOrganization: organizationName } = settings;
				executeAsync(systemUserId, mail => {
					let output = `url=https://${window.location.hostname}/${organizationName}\nusermode=0\nusername=${mail}\nsavepassword=1`;

					resolve({
						mail,
						organization: organizationName,
						url: output,
					});
				});
			},
			err => {
				reject();
				console.error("An error occurred: " + err);
			},
			null,
		);
	});
};

const executeAsync = (systemUserId, resolve) => {
	var fetchEntity = new MobileCRM.FetchXml.Entity("systemuser");
	fetchEntity.addAttribute("internalemailaddress");

	var filter = new MobileCRM.FetchXml.Filter();
	filter.type = "and";

	var cond1 = new MobileCRM.FetchXml.Condition();
	cond1.attribute = "id";
	cond1.operator = "eq";
	cond1.value = systemUserId;

	filter.conditions.push(cond1);

	fetchEntity.filter = filter;

	var fetch = new MobileCRM.FetchXml.Fetch(fetchEntity);

	fetch
		.executeAsync(null)
		.then(result => {
			// "null" stands for default "DynamicEntities" result format
			if (result.length < 1) {
				MobileCRM.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");
			} else {
				for (var i in result) {
					var entity = result[i];
					resolve(entity[0]);
				}
			}
		})
		.catch(err => {
			MobileCRM.bridge.alert(err);
		});
};
