(this["webpackJsonpinspections-custom-home"]=this["webpackJsonpinspections-custom-home"]||[]).push([[0],{13:function(e,t,n){e.exports=n(29)},24:function(e,t,n){},25:function(e,t,n){},26:function(e,t,n){},28:function(e,t,n){},29:function(e,t,n){"use strict";n.r(t);var a=n(0),o=n.n(a),c=n(2),r=n.n(c),s=n(12),i=n(1),l=(n(24),function(e){var t=e.iconSrc,n=e.header,a=e.description,c=e.onClick,r=e.homeItem,s=e.href;return o.a.createElement("div",{className:"card",onClick:c?function(){return c(r)}:s?function(){window.open(s)}:function(){}},o.a.createElement("i",{className:"card__icon",style:{backgroundImage:"url('".concat(t,"')")}}),o.a.createElement("h1",{className:"card__header"},n),o.a.createElement("p",{className:"card__description"},a))}),p=(n(25),function(e){var t=e.header,n=e.description,a=e.children;return o.a.createElement("section",{className:"cards-container"},o.a.createElement("h1",{className:"cards-container__header"},t),n?o.a.createElement("p",{className:"cards-container__description"},n):null,o.a.createElement("div",{className:"cards-container__wrapper"},a))}),m=(n(26),n(10)),u=n.n(m),d=n(11),h=n.n(d),f=window.MobileCRM;var g=window.MobileCRM,b=function(e){var t=e.visible,n=e.closePopup,c=Object(a.useState)(null),r=Object(i.a)(c,2),s=r[0],l=r[1],p=Object(a.useState)(null),m=Object(i.a)(p,2),d=m[0],b=m[1],E=Object(a.useState)(null),_=Object(i.a)(E,2),v=_[0],w=_[1];Object(a.useEffect)((function(){s||g.Configuration.requestObject((function(e){var t=e.settings,n=t.crmOrganization;!function(e,t){var n=new f.FetchXml.Entity("systemuser");n.addAttribute("internalemailaddress");var a=new f.FetchXml.Filter;a.type="and";var o=new f.FetchXml.Condition;o.attribute="id",o.operator="eq",o.value=e,a.conditions.push(o),n.filter=a,new f.FetchXml.Fetch(n).executeAsync(null).then((function(e){if(e.length<1)f.bridge.alert("Not any order begins with 'Bike' and total amount grater than 1500 was found");else for(var n in e){var a=e[n];t(a[0])}})).catch((function(e){f.bridge.alert(e)}))}(t.systemUserId,(function(e){var t="url=https://inspections.resco.net/".concat(n,"\nusermode=0\nusername=").concat(e,"\nsavepassword=1"),a=u.a.toDataURL(t,4);l(a),w(e),b(n)}))}),(function(e){console.log("An error occurred: "+e)}),null),t?document.body.style.overflow="hidden":setTimeout((function(){document.body.style.overflow="initial"}),400)}),[t]);var y=h()("inspector-popup__wrapper",{"inspector-popup__wrapper--visible":t});return o.a.createElement("div",{className:y},o.a.createElement("section",{className:"inspector-popup"},o.a.createElement("div",{className:"inspector-popup__qr",style:{backgroundImage:"url(".concat(s,")")}}),o.a.createElement("section",{className:"inspector-popup__section"},o.a.createElement("h1",{className:"inspector-popup__header inspector-popup--green"},"Download the Resco Inspections mobile app"),o.a.createElement("ul",{className:"inspector-popup__list"},o.a.createElement("li",{className:"inspector-popup__list-item"},"1. Download the mobile app for"," ",o.a.createElement("a",{href:"https://itunes.apple.com/ua/app/resco-inspections/id1357591626?mt=8"},"iOS"),","," ",o.a.createElement("a",{href:"https://play.google.com/store/apps/details?id=net.resco.inspections"},"Android")," ","or"," ",o.a.createElement("a",{href:"https://www.microsoft.com/en-us/p/resco-inspections/9n4gsvt8bnfj"},"Windows")),o.a.createElement("li",{className:"inspector-popup__list-item"},"2. Run the app"),o.a.createElement("li",{className:"inspector-popup__list-item"},"3. On the \u2018Welcome to Resco Mobile CRM\u2019 screen select \u2018Internal User\u2019"),o.a.createElement("li",{className:"inspector-popup__list-item"},"4. Enter the URL"," ",o.a.createElement("span",{className:"inspector-popup--green"},"https://inspections.resco.net/",d||"organization"),", username"," ",o.a.createElement("span",{className:"inspector-popup--green"},v||""),", and password")),o.a.createElement("p",{className:"inspector-popup__paragraph"},"\u2026or simply hit the"," ",o.a.createElement("span",{className:"inspector-popup--green"},"\u2018Scan QR\u2019")," button and scan the QR code.")),o.a.createElement("i",{className:"inspector-popup__close",onClick:n})))},E=window.MobileCRM;var _=function(){var e=Object(a.useState)(!1),t=Object(i.a)(e,2),n=t[0],c=t[1],r=Object(a.useState)(null),s=Object(i.a)(r,2),m=s[0],u=s[1];Object(a.useEffect)((function(){m||E.UI.HomeForm.requestObject((function(e){e&&u(e.items.map((function(e){return{text:e.title,name:e.name}})))}),console.log)}),[]);var d=function(){c(!n)},h=function(e){if(m){var t=m.find((function(t){return t.text===e}));t?E.UI.HomeForm.openHomeItemAsync(t.name,console.log,null):console.log("homeFormItem not found in: ",m)}else console.log("homeFormItems not found")};return o.a.createElement(o.a.Fragment,null,o.a.createElement(p,{header:"ALL MODULES"},o.a.createElement(l,{onClick:h,homeItem:"Questionnaire Designer",iconSrc:"icons/templates_designer.png",header:"Questionnaire Designer",description:"Build your questionnaires from scratch."}),o.a.createElement(l,{onClick:h,homeItem:"Schedule Board",iconSrc:"icons/schedule_board.png",header:"Schedule Board",description:"Assign appointments to users, plan work for your field team, and see their progress."}),o.a.createElement(l,{onClick:d,iconSrc:"icons/inspector.png",header:"Inspector",description:"App for executing inspections and filling out questionnaires in the field."}),o.a.createElement(l,{onClick:h,homeItem:"Dashboard",iconSrc:"icons/automatic_dashboard.png",header:"Dashboard",description:"Evaluate and visualize the data sent back by the inspectors."}),o.a.createElement(l,{onClick:h,homeItem:"Result Viewer",iconSrc:"icons/result_viewer.png",header:"Result Viewer",description:"Evaluate and visualize the data sent back by the inspectors."}),o.a.createElement(l,{onClick:h,homeItem:"Submitted Reports",iconSrc:"icons/report_designer.png",header:"Submitted Reports",description:"Enables you to set up mobile reports that provide a clear-cut overview of your data."}),o.a.createElement(l,{onClick:h,homeItem:"App Configurator",iconSrc:"icons/woodford.png",header:"App Configurator",description:"Customize the mobile app to fit your requirements."}),o.a.createElement(l,{onClick:h,homeItem:"Manage Organization",iconSrc:"icons/admin_console.png",header:"Manage Organization",description:"Resco Cloud settings and customization."})),o.a.createElement(p,{header:"CONNECTORS",description:"Use connectors for Dynamics 365, Salesforce, or SAP, to take the full advantage of Inspections integrated with your own backend."},o.a.createElement(l,{href:"mailto:sales@resco.net?subject=Connector for Resco Inspections: Dynamics CRM",iconSrc:"icons/dynamics.png",header:"Dynamics 365/CRM",description:"Use Inspections directly in your Dynamics 365 environment "}),o.a.createElement(l,{href:"mailto:sales@resco.net?subject=Connector for Resco Inspections: Salesforce",iconSrc:"icons/salesforce.png",header:"Salesforce",description:"Connect and work with your Salesforce data instantly and securely."}),o.a.createElement(l,{href:"mailto:sales@resco.net?subject=Connector for Resco Inspections: SAP",iconSrc:"icons/sap.png",header:"SAP",description:"Connect to your ERP and work with your data."})),o.a.createElement(b,{visible:n,closePopup:d}))},v=(n(28),n(7)),w=n(3),y=Object(w.b)((function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[],t=arguments.length>1?arguments[1]:void 0,n=t.data,a=t.type;switch(a){case"LOAD_DATA":return Object(v.a)({},e,{data:n});default:return Object(v.a)({},e)}}));r.a.render(o.a.createElement(s.a,{store:y},o.a.createElement(o.a.StrictMode,null,o.a.createElement(_,null))),document.getElementById("root"))}},[[13,1,2]]]);
//# sourceMappingURL=main.97537cce.chunk.js.map