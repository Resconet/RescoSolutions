/*! @resconet/image-resizer v1.0.1 (11/8/2021), (c) Resco spol. s r.o. */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["App"] = factory();
	else
		root["App"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/lib/resizer.ts":
/*!****************************!*\
  !*** ./src/lib/resizer.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "resizeImage": () => (/* binding */ resizeImage)
/* harmony export */ });
/* harmony import */ var data_urls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! data-urls */ "./node_modules/data-urls/lib/parser.js");
/* harmony import */ var data_urls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(data_urls__WEBPACK_IMPORTED_MODULE_0__);

const resizeImage = async (dataUrl, width, height, quality) => {
  const img = await createImageElement(dataUrl);
  const parsedUrl = data_urls__WEBPACK_IMPORTED_MODULE_0___default()(dataUrl);
  const mimeType = parsedUrl.mimeType.toString();

  if (img.width > width || img.height > height) {
    const canvas = document.createElement("canvas");
    const ratio = Math.min(width / img.width, height / img.height);
    const newWidth = img.width * ratio;
    const newHeight = img.height * ratio;
    canvas.width = newWidth;
    canvas.height = newHeight;
    canvas.getContext("2d").drawImage(img, 0, 0, newWidth, newHeight);
    return canvas.toDataURL(mimeType, quality);
  }

  return dataUrl;
};

const createImageElement = async dataUrl => {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => reject();

    image.src = dataUrl;
  });
};

/***/ }),

/***/ "./node_modules/@resconet/jsbridge/src/JSBridge.js":
/*!*********************************************************!*\
  !*** ./node_modules/@resconet/jsbridge/src/JSBridge.js ***!
  \*********************************************************/
/***/ (() => {

// v14.2
(function () {
	var _scriptVersion = 14.2
	// Private objects & functions
	var _inherit = (function () {
		function _() { }
		return function (child, parent) {
			_.prototype = parent.prototype;
			child.prototype = new _;
			child.prototype.constructor = child;
			child.superproto = parent.prototype;
			return child;
		};
	})();
	var _findInArray = function (arr, property, value) {
		if (arr) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i][property] == value)
					return arr[i];
			}
		}
		return null;
	};
	var _addProperty = function (obj, name, writable, value) {
		if (!obj._privVals)
			obj._privVals = {};
		if (!obj._typeInfo)
			obj._typeInfo = {};
		if (!obj.propertyChanged)
			obj.propertyChanged = new _Event(obj);

		if (value != undefined)
			obj._privVals[name] = value;
		var propDef = { get: function () { return obj._privVals[name]; }, enumerable: true };
		if (writable) {
			propDef.set = function (newVal) {
				if (obj._privVals[name] != newVal) {
					obj._privVals[name] = newVal;
					obj.propertyChanged.raise(name);
				}
				if (obj._typeInfo[name])
					delete obj._typeInfo[name];
			};
		}
		Object.defineProperty(obj, name, propDef);
	};
	var _bindHandler = function (handler, handlers, bind, scope) {
		if (bind || typeof bind == "undefined") {
			handlers.push({ handler: handler, scope: (scope ? scope : null) });
		}
		else {
			var index = 0;
			while (index < handlers.length) {
				if (handlers[index].handler === handler) {
					handlers.splice(index, 1);
				}
				else {
					index++;
				}
			}
		}
	};
	var _registerEventHandler = function (event, handler, handlers, bind, scope) {
		var register = handlers.length == 0;
		_bindHandler(handler, handlers, bind, scope);
		if (register)
			MobileCRM.bridge.command("registerEvents", event);
	};
	var _callHandlers = function (handlers) {
		var params = [];
		var i = 1;
		while (arguments[i])
			params.push(arguments[i++]);

		var result = false;
		for (var index in handlers) {
			var handlerDescriptor = handlers[index];
			if (handlerDescriptor && handlerDescriptor.handler) {
				var thisResult = handlerDescriptor.handler.apply(handlerDescriptor.scope, params);
				if (thisResult != false)
					result = result || thisResult;
			}
		}
		return result;
	}
	var _Event = function (sender) {
		var _handlers = [],
			_handlersToRemove = [],
			_bRaisingEvent = false;


		this.add = function (handler, target) {
			var bExists = false;

			for (var index in _handlers) {
				var h = _handlers[index];
				if (h && h.handler == handler && h.target == target) {
					bExists = true;
					break;
				}
			}
			if (!bExists) {
				_handlers.push({ handler: handler, target: target });
			}
		}

		this.remove = function (handler, target) {
			var index = 0;

			while (index < _handlers.length) {
				var h = _handlers[index];

				if ((!handler || h.handler == handler) && (!target || h.target == target)) {
					if (!_bRaisingEvent) {
						_handlers.splice(index, 1);
						index--;
					}
					else {
						_handlersToRemove.push(h);
					}
				}
				index++;
			}
		}

		this.clear = function () {
			if (!_bRaisingEvent) {
				_handlers = [];
			}
			else {
				_handlersToRemove = _handlers.slice(0);
			}
		}

		this.raise = function (eventArgs) {
			// Make sure every handler is called in raise(), if any handler is removed while in 'for' cycle, remove it after the loop finishes
			_bRaisingEvent = true;

			for (index in _handlers) {
				var h = _handlers[index];
				if (h && h.handler) {
					h.handler.call(h.target ? h.target : sender, eventArgs, sender);
					if (eventArgs && eventArgs.cancel) {
						break;
					}
				}
			}

			_bRaisingEvent = false;

			for (index in _handlersToRemove) {
				var hToRemove = _handlersToRemove[index];
				if (hToRemove)
					this.remove(hToRemove.handler, hToRemove.target);
			}
		}
	};

	if (typeof MobileCrmException === "undefined") {
		MobileCrmException = function (msg) {
			this.message = msg;
			this.name = "MobileCrmException";
		};
		MobileCrmException.prototype.toString = function () { return this.message; };
	}
	function _safeErrorMessage(err) {
		return "message" in err ? err.message : ("Message" in err ? err.Message : err.toString());
	}

	// MobileCRM object definition
	if (typeof MobileCRM === "undefined") {
		MobileCRM = {
			/// <summary>An entry point for Mobile CRM data model.</summary>
			/// <field name="bridge" type="MobileCRM.Bridge">Singleton instance of <see cref="MobileCRM.Bridge">MobileCRM.Bridge</see> providing the management of the Javascript/native code cross-calls.</field>
			bridge: null,

			Bridge: function (platform) {
				/// <summary>Provides the management of the Javascript/native code cross-calls. Its only instance <see cref="MobileCRMbridge">MobileCRM.bridge</see> is created immediately after the &quot;JSBridge.js&quot; script is loaded.</summary>
				/// <param name="platform" type="String">A platform name</param>
				/// <field name="platform" type="String">A string identifying the device platform (e.g. Android, iOS, Windows, WindowsRT, Windows10 or WindowsPhone).</field>
				/// <field name="version" type="Number">A number identifying the version of the JSBridge. This is the version of the script which might not match the version of the application part of the bridge implementation. Application version must be equal or higher than the script version.</field>
				this.commandQueue = [];
				this.processing = false;
				this.callbacks = {};
				this.callbackId = 0;
				this.version = _scriptVersion;
				this.platform = platform;
			},

			Configuration: function () {
				/// <summary>Provides an access to the application configuration.</summary>
				/// <remarks>This object cannot be created directly. To obtain/modify this object, use <see cref="MobileCRM.Configuration.requestObject">MobileCRM.Configuration.requestObject</see> function.</remarks>
				/// <field name="applicationEdition" type="String">Gets the application edition.</field>
				/// <field name="applicationPath" type="String">Gets the application folder.</field>
				/// <field name="applicationVersion" type="String">Gets the application version (major.minor.subversion.build).</field>
				/// <field name="customizationDirectory" type="String">Gets or sets the runtime customization config root.</field>
				/// <field name="externalConfiguration" type="String">Gets the external configuration directory (either customization or legacy configuration).</field>
				/// <field name="isBackgroundSync" type="Boolean">Gets or sets whether background synchronization is in progress.</field>
				/// <field name="isOnline" type="Boolean">Gets or sets whether the online mode is currently active.</field>
				/// <field name="legacyVersion" type="String">Gets or sets the legacy redirect folder.</field>
				/// <field name="licenseAlert" type="String">Gets the flag set during sync indicating that the user&apos;s license has expired.</field>
				/// <field name="settings" type="MobileCRM._Settings">Gets the application settings.</field>
				/// <field name="storageDirectory" type="String">Gets the root folder of the application storage.</field>
			},

			CultureInfo: function () {
				/// <summary>[v10.2] Provides information about current device culture. The information includes the names for the culture, the writing system, the calendar used, and formatting for dates.</summary>
				/// <field name="name" type="String">Gets the culture name in the format languageCode/region (e.g. &quot;en-US&quot;). languageCode is a lowercase two-letter code derived from ISO 639-1. regioncode is derived from ISO 3166 and usually consists of two uppercase letters.</field>
				/// <field name="displayName" type="String">Gets the full localized culture name.</field>
				/// <field name="nativeName" type="String">Gets the culture name, consisting of the language, the country/region, and the optional script, that the culture is set to display.</field>
				/// <field name="ISOName" type="String">Gets the ISO 639-1 two-letter code for the language of the current CultureInfo.</field>
				/// <field name="isRightToLeft" type="Boolean">Gets a value indicating whether the current CultureInfo object represents a writing system where text flows from right to left.</field>
				/// <field name="dateTimeFormat" type="MobileCRM.DateTimeFormat">Gets a DateTimeFormat that defines the culturally appropriate format of displaying dates and times.</field>
				/// <field name="numberFormat" type="MobileCRM.NumberFormat">Gets a NumberFormat that defines the culturally appropriate format of displaying numbers, currency, and percentage.</field>
			},

			DateTimeFormat: function () {
				/// <summary>[v10.2] Provides culture-specific information about the format of date and time values.</summary>
				/// <field name="abbreviatedDayNames" type="String[]">Gets a string array containing the culture-specific abbreviated names of the days of the week.</field>
				/// <field name="abbreviatedMonthGenitiveNames" type="String[]">Gets a string array of abbreviated month names associated with the current DateTimeFormat object.</field>
				/// <field name="abbreviatedMonthNames" type="String[]">Gets a string array that contains the culture-specific abbreviated names of the months.</field>
				/// <field name="aMDesignator" type="String">Gets the string designator for hours that are "ante meridiem" (before noon).</field>
				/// <field name="dayNames" type="String[]">Gets a string array that contains the culture-specific full names of the days of the week.</field>
				/// <field name="firstDayOfWeek" type="Number">Gets the first day of the week (0=Sunday, 1=Monday, ...)</field>
				/// <field name="fullDateTimePattern" type="String">Gets the custom format string for a long date and long time value.</field>
				/// <field name="longDatePattern" type="String">Gets the custom format string for a long date value.</field>
				/// <field name="longTimePattern" type="String">Gets the custom format string for a long time value.</field>
				/// <field name="monthDayPattern" type="String">Gets the custom format string for a month and day value.</field>
				/// <field name="monthGenitiveNames" type="String[]">Gets a string array of month names associated with the current DateTimeFormat object.</field>
				/// <field name="monthNames" type="String[]">Gets a string array containing the culture-specific full names of the months.</field>
				/// <field name="pMDesignator" type="String">Gets the string designator for hours that are "post meridiem" (after noon).</field>
				/// <field name="shortDatePattern" type="String">Gets the custom format string for a short date value.</field>
				/// <field name="shortestDayNames" type="String[]">Gets a string array of the shortest unique abbreviated day names associated with the current DateTimeFormat object.</field>
				/// <field name="shortTimePattern" type="String">Gets the custom format string for a short time value.</field>
				/// <field name="sortableDateTimePattern" type="String">Gets the custom format string for a sortable date and time value.</field>
				/// <field name="universalSortableDateTimePattern" type="String">Gets the custom format string for a universal, sortable date and time string.</field>
				/// <field name="yearMonthPattern" type="String">Gets the custom format string for a year and month value.</field>
			},

			NumberFormat: function () {
				/// <summary>[v10.2] Provides culture-specific information for formatting and parsing numeric values.</summary>
				/// <field name="currencyDecimalDigits" type="Number">Gets the number of decimal places to use in currency values.</field>
				/// <field name="currencyDecimalSeparator" type="String">Gets the string to use as the decimal separator in currency values.</field>
				/// <field name="currencyGroupSeparator" type="String">Gets the string that separates groups of digits to the left of the decimal in currency values.</field>
				/// <field name="currencyGroupSizes" type="Number[]">Gets the number of digits in each group to the left of the decimal in currency values.</field>
				/// <field name="currencyNegativePattern" type="Number">Gets the format pattern for negative currency values.</field>
				/// <field name="currencyPositivePattern" type="Number">Gets the format pattern for positive currency values.</field>
				/// <field name="currencySymbol" type="String">Gets the string to use as the currency symbol.</field>
				/// <field name="naNSymbol" type="String">Gets the string that represents the IEEE NaN (not a number) value.</field>
				/// <field name="negativeInfinitySymbol" type="String">Gets the string that represents negative infinity.</field>
				/// <field name="negativeSign" type="String">Gets the string that denotes that the associated number is negative.</field>
				/// <field name="numberDecimalDigits" type="Number">Gets the number of decimal places to use in numeric values.</field>
				/// <field name="numberDecimalSeparator" type="String">Gets the string to use as the decimal separator in numeric values.</field>
				/// <field name="numberGroupSeparator" type="String">Gets the string that separates groups of digits to the left of the decimal in numeric values.</field>
				/// <field name="numberGroupSizes" type="Number[]"> Gets the number of digits in each group to the left of the decimal in numeric values.</field>
				/// <field name="numberNegativePattern" type="Number">Gets the format pattern for negative numeric values.</field>
				/// <field name="percentDecimalDigits" type="Number">Gets the number of decimal places to use in percent values.</field>
				/// <field name="percentDecimalSeparator" type="String">Gets the string to use as the decimal separator in percent values.</field>
				/// <field name="percentGroupSeparator" type="String">Gets the string that separates groups of digits to the left of the decimal in percent values.</field>
				/// <field name="percentGroupSizes" type="Number[]">Gets the number of digits in each group to the left of the decimal in percent values.</field>
				/// <field name="percentNegativePattern" type="Number">Gets the format pattern for negative percent values.</field>
				/// <field name="percentPositivePattern" type="Number">Gets the format pattern for positive percent values.</field>
				/// <field name="percentSymbol" type="String">Gets the string to use as the percent symbol.</field>
				/// <field name="perMilleSymbol" type="String">Gets the string to use as the per mille symbol.</field>
				/// <field name="positiveInfinitySymbol" type="String">Gets the string that represents positive infinity.</field>
				/// <field name="positiveSign" type="String">Gets the string that denotes that the associated number is positive.</field>
			},

			Localization: {
				stringTable: {},
				initialized: false
			},

			Reference: function (entityName, id, primaryName) {
				/// <summary>Represents an entity reference which provides the minimum information about an entity.</summary>
				/// <param name="entityName" type="String">The logical name of the reference, e.g. "account".</param>
				/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
				/// <param name="primaryName" type="String">The human readable name of the reference, e.g "Alexandro".</param>
				/// <field name="entityName" type="String">The logical name of the reference, e.g. "account".</field>
				/// <field name="id" type="String">GUID of the existing entity or null for new one.</field>
				/// <field name="isNew" type="Boolean">Indicates whether the entity is newly created.</field>
				/// <field name="primaryName" type="String">The human readable name of the reference, e.g. "Alexandro".</field>
				this.entityName = entityName;
				this.id = id;
				this.isNew = (id ? false : true);
				this.primaryName = primaryName;
			},

			Relationship: function (sourceProperty, target, intersectEntity, intersectProperty) {
				/// <summary>Represents a relationship between two entities.</summary>
				/// <param name="sourceProperty" type="String">Gets the name of the source of the relationship.</param>
				/// <param name="target" type="MobileCRM.Reference">Gets the target of the relationship.</param>
				/// <param name="intersectEntity" type="String">Gets the intersect entity if any. Used when displaying entities that are associated through a Many to Many relationship.</param>
				/// <param name="intersectProperty" type="String">Gets the intersect entity property if any. Used when displaying entities that are associated through a Many to Many relationship.</param>
				/// <field name="sourceProperty" type="String">Gets the name of the source of the relationship.</field>
				/// <field name="target" type="MobileCRM.Reference">Gets the target of the relationship.</field>
				/// <field name="intersectEntity" type="String">Gets the intersect entity if any. Used when displaying entities that are associated through a Many to Many relationship.</field>
				/// <field name="intersectProperty" type="String">Gets the intersect entity property if any. Used when displaying entities that are associated through a Many to Many relationship.</field>
				this.sourceProperty = sourceProperty;
				this.target = target;
				this.intersectEntity = intersectEntity;
				this.intersectProperty = intersectProperty;
			},

			ManyToManyReference: {
			},

			DynamicEntity: function (entityName, id, primaryName, properties, isOnline) {
				/// <summary>Represents a CRM entity, with only a subset of properties loaded.</summary>
				/// <remarks><p>This class is derived from <see cref="MobileCRM.Reference">MobileCRM.Reference</see></p><p>There is a compatibility issue since the version 7.4 which gets the boolean and numeric properties as native Javascript objects (instead of strings). If you experienced problems with these types of fields, switch on the legacy serialization by setting the static property MobileCRM.DynamicEntity.legacyPropsSerialization to true.</p></remarks>
				/// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
				/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
				/// <param name="primaryName" type="String">The human readable name of the entity, e.g "Alexandro".</param>
				/// <param name="properties" type="Object">An object with entity properties, e.g. {firstname:"Alexandro", lastname:"Puccini"}.</param>
				/// <param name="isOnline" type="Boolean">Indicates whether the entity was created by online request or from local data.</param>
				/// <field name="entityName" type="String">The logical name of the entity, e.g. "account".</field>
				/// <field name="id" type="String">GUID of the existing entity or null for new one.</field>
				/// <field name="isNew" type="Boolean">Indicates whether the entity is newly created.</field>
				/// <field name="isOnline" type="Boolean">Indicates whether the entity was created by online request or from local data.</field>
				/// <field name="forceDirty" type="Boolean">Indicates whether to force save the provided properties even if not modified. Default behavior is to save only properties that were modified.</field>
				/// <field name="primaryName" type="String">The human readable name of the entity, e.g. "Alexandro".</field>
				/// <field name="properties" type="Object">An object with entity properties, e.g. {firstname:"Alexandro", lastname:"Puccini"}.</field>
				MobileCRM.DynamicEntity.superproto.constructor.apply(this, arguments);
				this.isOnline = isOnline;
				if (properties) {
					if (MobileCRM.DynamicEntity.legacyPropsSerialization) {
						// This is a workaround for failing scripts in v7.4 (string/bool issue)
						for (var i in properties) {
							if (typeof (properties[i]) == "boolean")
								properties[i] = properties[i].toString();
						}
					}
					this.properties = new MobileCRM.ObservableObject(properties);
				}
				else
					this.properties = {};
			},

			Metadata: {
				entities: null
			},

			MetaEntity: function (props) {
				/// <summary>Represents an entity metadata.</summary>
				/// <field name="isEnabled" type="Boolean">Indicates whether an entity is enabled. This field is used for limited runtime customization.</field>
				/// <field name="isExternal" type="Boolean">Indicates whether an entity stores data from external  sources Exchange/Google.</field>
				/// <field name="name" type="String">Gets the entity (logical) name.</field>
				/// <field name="objectTypeCode" type="Number">Gets the unique entity type code.</field>
				/// <field name="primaryFieldName" type="String">The name of the entity primary field (name) property.</field>
				/// <field name="primaryKeyName" type="String">The name of the entity primary key property.</field>
				/// <field name="relationshipName" type="String">Gets the name of the many-to-many relationship name. Defined only for intersect entities.</field>
				/// <field name="statusFieldName" type="String">Gets the status property name. In general it is called "statuscode" but there are exceptions.</field>
				/// <field name="uploadOnly" type="Boolean">Indicates whether this entity can be downloaded during synchronization.</field>
				/// <field name="attributes" type="Number">Gets additional entity attributes.</field>
				MobileCRM.MetaEntity.superproto.constructor.apply(this, arguments);
			},

			MetaProperty: function () {
				/// <summary>Represents a property (CRM field) metadata.</summary>
				/// <field name="name" type="String">Gets the field (logical) name.</field>
				/// <field name="required" type="Number">Gets the attribute requirement level (0=None, 1=SystemRequired, 2=Required, 3=Recommended, 4=ReadOnly).</field>
				/// <field name="type" type="Number">Gets the attribute CRM type (see <see cref="http://msdn.microsoft.com/en-us/library/microsoft.xrm.sdk.metadata.attributetypecode.aspx">MS Dynamics SDK</see>).</field>
				/// <field name="format" type="Number">Gets the attribute display format.</field>
				/// <field name="isVirtual" type="Boolean">Gets whether the property is virtual (has no underlying storage). State and PartyList properties are virtual.</field>
				/// <field name="isReference" type="Boolean">Gets whether the property is a reference (lookup) to another entity.</field>
				/// <field name="isNullable" type="Boolean">Gets whether the property may contain NULL.</field>
				/// <field name="defaultValue" type="">Gets the property default value.</field>
				/// <field name="targets" type="Array">Gets the names of target entities, if the property is a lookup, or customer.</field>
				/// <field name="minimum" type="Number">Gets the attribute minimum value.</field>
				/// <field name="maximum" type="Number">Gets the attribute minimum value.</field>
				/// <field name="precision" type="Number">Gets the numeric attribute&apos;s precision (decimal places).</field>
				/// <field name="permission" type="Number">Gets the attribute&apos;s permission set (0=None, 1=User, 2=BusinessUnit, 4=ParentChild, 8=Organization).</field>
				/// <field name="activityPartyType" type="Number">Gets the activity party type (from, to, attendee, etc.)</field>
				/// <field name="isMultiParty" type="Boolean">Gets whether the activity party property can have multiple values (multiple to, cc, resources.)</field>
				/// <field name="isSingularParty" type="Boolean">Gets whether the property represents a singular activity party property. These properties exists as both a Lookup property on the entity and an ActivytParty record.</field>
			},

			FetchXml: {
				Fetch: function (entity, count, page) {
					/// <summary>Represents a FetchXml query object.</summary>
					/// <param name="entity" type="MobileCRM.FetchXml.Entity">An entity object.</param>
					/// <param name="count" type="int">the maximum number of records to retrieve.</param>
					/// <param name="page" type="int">1-based index of the data page to retrieve.</param>
					/// <field name="aggregate" type="Boolean">Indicates whether the fetch is aggregated.</field>
					/// <field name="count" type="int">the maximum number of records to retrieve.</field>
					/// <field name="entity" type="MobileCRM.FetchXml.Entity">An entity object.</field>
					/// <field name="page" type="int">1-based index of the data page to retrieve.</field>
					this.entity = entity;
					this.count = count;
					this.page = page;
					this.aggregate = false;
				},
				Entity: function (name) {
					/// <summary>Represents a FetchXml query root entity.</summary>
					/// <param name="name" type="String">An entity logical name.</param>
					/// <field name="attributes" type="Array">An array of <see cref="MobileCRM.FetchXml.Attribute">MobileCRM.FetchXml.Attribute</see> objects.</field>
					/// <field name="filter" type="MobileCRM.FetchXml.Filter">A query filter.</field>
					/// <field name="linkentities" type="Array">An array of <see cref="MobileCRM.FetchXml.LinkEntity">MobileCRM.FetchXml.LinkEntity</see> objects.</field>
					/// <field name="name" type="String">An entity logical name.</field>
					/// <field name="order" type="Array">An array of <see cref="MobileCRM.FetchXml.Order">MobileCRM.FetchXml.Order</see> objects.</field>
					this.name = name;
					this.attributes = [];
					this.order = [];
					this.filter = null;
					this.linkentities = [];
				},
				LinkEntity: function (name) {
					/// <summary>Represents a FetchXml query linked entity.</summary>
					/// <remarks>This object is derived from <see cref="MobileCRM.FetchXml.Entity">MobileCRM.FetchXml.Entity</see></remarks>
					/// <field name="alias" type="String">A link alias.</field>
					/// <field name="from" type="String">The "from" field (if parent then target entity primary key).</field>
					/// <field name="linkType" type="String">The link (join) type ("inner" or "outer").</field>
					/// <param name="name" type="String">An entity name</param>
					/// <field name="to" type="String">The "to" field.</field>
					MobileCRM.FetchXml.LinkEntity.superproto.constructor.apply(this, arguments);

					this.from = null;
					this.to = null;
					this.linktype = null;
					this.alias = null;
				},
				Attribute: function (name) {
					/// <summary>Represents a FetchXml select statement (CRM field).</summary>
					/// <param name="name" type="String">A lower-case entity attribute name (CRM logical field name).</param>
					/// <field name="aggregate" type="String">An aggregation function.</field>
					/// <field name="alias" type="String">Defines an attribute alias.</field>
					/// <field name="dategrouping" type="String">A date group by modifier (year, quarter, month, week, day).</field>
					/// <field name="groupby" type="Boolean">Indicates whether to group by this attribute.</field>
					/// <field name="name" type="String">A lower-case entity attribute name (CRM logical field name).</field>
					this.name = name;
					this.aggregate = null;
					this.groupby = false;
					this.alias = null;
					this.dategrouping = null;
				},
				Order: function (attribute, descending) {
					/// <summary>Represents a FetchXml order statement.</summary>
					/// <param name="attribute" type="String">An attribute name (CRM logical field name).</param>
					/// <param name="descending" type="Boolean">true, for descending order; false, for ascending order</param>
					/// <field name="alias" type="String">Defines an order alias.</field>
					/// <field name="attribute" type="String">An attribute name (CRM logical field name).</field>
					/// <field name="descending" type="Boolean">true, for descending order; false, for ascending order.</field>
					this.attribute = attribute;
					this.alias = null;
					this.descending = descending ? true : false;
				},
				Filter: function () {

					/// <summary>Represents a FetchXml filter statement. A logical combination of <see cref="MobileCRM.FetchXml.Condition">Conditions</see> and child-filters.</summary>
					/// <field name="conditions" type="Array">An array of <see cref="MobileCRM.FetchXml.Condition">Condition</see> objects.</field>
					/// <field name="filters" type="Array">An array of <see cref="MobileCRM.FetchXml.Filter">Filter</see> objects representing child-filters.</field>
					/// <field name="type" type="String">Defines the filter operator ("or" / "and").</field>
					this.type = null;
					this.conditions = [];
					this.filters = [];
				},
				Condition: function () {
					/// <summary>Represents a FetchXml attribute condition statement.</summary>
					/// <field name="attribute" type="String">The attribute name (CRM logical field name).</field>
					/// <field name="operator" type="String">The condition operator. "eq", "ne", "in", "not-in", "between", "not-between", "lt", "le", "gt", "ge", "like", "not-like", "null", "not-null", "eq-userid", "eq-userteams", "today", "yesterday", "tomorrow", "this-year", "last-week", "last-x-hours", "next-x-years", "olderthan-x-months", ...</field>
					/// <field name="uiname" type="String">The lookup target entity display name.</field>
					/// <field name="uitype" type="String">The lookup target entity logical name.</field>
					/// <field name="value" type="">The value to compare to.</field>
					/// <field name="values" type="Array">The list of values to compare to.</field>
					this.attribute = null;
					this.operator = null;
					this.uitype = null;
					this.uiname = null;
					this.value = null;
					this.values = [];
				}
			},

			Platform: function (props) {
				/// <summary>Represents object for querying platform specific information and executing platform integrated actions.</summary>
				/// <remarks>This object cannot be created directly. To obtain/modify this object, use <see cref="MobileCRM.Platform.requestObject">MobileCRM.Platform.requestObject</see> function.</remarks>
				/// <field name="capabilities" type="Number">Gets the mask of capability flags supported by this device (MakePhoneCalls=1; HasMapView=2).</field>
				/// <field name="deviceIdentifier" type="String">Gets the unique identifier of this device.</field>
				/// <field name="screenWidth" type="Number">Gets the current screen width in pixels.</field>
				/// <field name="screenHeight" type="Number">Gets the current screen width in pixels.</field>
				/// <field name="screenDensity" type="Number">Gets the screen density (DPI).</field>
				/// <field name="isMultiPanel" type="Boolean">Gets whether the device has tablet or phone UI.</field>
				/// <field name="customImagePath" type="String">Gets or sets the custom image path that comes from customization.</field>
				MobileCRM.Platform.superproto.constructor.apply(this, arguments);
			},

			Application: function () {
				/// <summary>Encapsulates the application-related functionality.</summary>
			},
			AboutInfo: function () {
				/// <summary>[v8.2] Represents the branding information.</summary>
				/// <field name="manufacturer" type="String">Gets the manufacturer text.</field>
				/// <field name="productTitle" type="String">Gets the product title text.</field>
				/// <field name="productTitleAndVersion" type="String">[v9.0] Gets the string with product title and version.</field>
				/// <field name="productSubTitle" type="String">Gets the product subtitle text.</field>
				/// <field name="poweredBy" type="String">Gets the powered by text.</field>
				/// <field name="icon" type="String">Gets the icon name.</field>
				/// <field name="website" type="String">Gets the website url.</field>
				/// <field name="supportEmail" type="String">Gets the support email.</field>
				this.manufacturer = "";
				this.productTitle = "";
				this.productTitleAndVersion = "";
				this.productSubTitle = "";
				this.poweredBy = "";
				this.icon = "";
				this.website = "";
				this.supportEmail = "";
			},
			Integration: {
				///<summary>Encapsulate methods and properties what can be used for integration.</summary>
			},
			OAuthSettings: function () {
				/// <summary>[v12.4] Represents the settings what are used to authenticate using OAuth server account.</summary>
				/// <field name="authorityEndPoint" type="String">Gets or sets the OAuth token url.</field>
				/// <field name="authorizationUrl" type="String">Gets or sets the authorization url to get authorization code.</field>
				/// <field name="clientId" type="String">Gets or sets the authentication Client Id.</field>
				/// <field name="clientSecret" type="String">Gets or sets the Authentication Client Secret.</field>
				/// <field name="redirectUrl" type="String">Gets or sets the authorization redirect url for service.</field>
				/// <field name="resourceUrl" type="String">Gets or sets the App ID URI of the target web API (secured resource).</field>
				/// <field name="scopes" type="String">Gets or sets the scope to limit an application&apos;s access to a user&apos;s account.</field>

				this.authorityEndPoint = "";
				this.authorizationUrl = "";
				this.authorityEndPoint = "";
				this.resourceUrl = "";
				this.scopes = "";
				this.clientSecret = "";
				this.redirectUrl = "";
			},
			MobileReport: function () {
				/// <summary>Provides a functionality of mobile reporting.</summary>
			},
			Questionnaire: function () {
				/// <summary>Provides a functionality for questionnaires.</summary>
			},
			UI: {
				FormManager: {
				},
				EntityForm: function (props) {
					/// <summary>Represents the Javascript equivalent of native entity form object.</summary>
					/// <remarks>This object cannot be created directly. To obtain/modify this object, use <see cref="MobileCRM.UI.EntityForm.requestObject">MobileCRM.UI.EntityForm.requestObject</see> function.</remarks>
					/// <field name="associatedViews" type="Array">Gets the associated views as an array of <see cref="MobileCRM.UI._EntityList">MobileCRM.UI._EntityList</see> objects.</field>
					/// <field name="canEdit" type="Boolean">Gets whether the form can be edited.</field>
					/// <field name="canClose" type="Boolean">Determines if form can be closed, i.e. there are no unsaved data being edited.</field>
					/// <field name="context" type="Object">Gets the specific context object for onChange and onSave handlers. The onChange context contains single property &quot;changedItem&quot; with the name of the changed detail item and the onSave context contains property &quot;errorMessage&quot; which can be used to break the save process with certain error message.</field>
					/// <field name="controllers" type="Array">Gets the form controllers (map, web) as an array of <see cref="MobileCRM.UI._Controller">MobileCRM.UI._Controller</see> objects.</field>
					/// <field name="detailViews" type="Array">Gets the detailView controls  as an array of <see cref="MobileCRM.UI._DetailView">MobileCRM.UI._DetailView</see> objects.</field>
					/// <field name="entity" type="MobileCRM.DynamicEntity">Gets or sets the entity instance the form is showing.</field>
					/// <field name="form" type="MobileCRM.UI.Form">Gets the top level form.</field>
					/// <field name="iFrameOptions" type="Object">Carries the custom parameters that can be specified when opening the form using <see cref="MobileCRM.UI.FormManager">MobileCRM.UI.FormManager</see>.</field>
					/// <field name="isDirty" type="Boolean">Indicates whether the form  has unsaved data.</field>
					/// <field name="relationship" type="MobileCRM.Relationship">Defines relationship with parent entity.</field>
					/// <field name="visible" type="Boolean">Gets whether the underlying form is visible.</field>
					/// <field name="documentView" type="MobileCRM.UI._DocumentView">NoteForm only. Gets the view containing the note attachment.</field>
					MobileCRM.UI.EntityForm.superproto.constructor.apply(this, arguments);
				},

				QuestionnaireForm: function () {
					/// <summary>[v10.3] Represents the Javascript equivalent of native questionnaire form object.</summary>
					/// <field name="form" type="MobileCRM.UI.Form">Gets the form which hosts the questionnaire.</field>
					/// <field name="groups" type="MobileCRM.UI.QuestionnaireForm.Group[]">A list of <see cref="MobileCRM.UI.QuestionnaireForm.Group">QuestionnaireForm.Group</see> objects.</field>
					/// <field name="questions" type="MobileCRM.UI.QuestionnaireForm.Question[]">A list of <see cref="MobileCRM.UI.QuestionnaireForm.Question">QuestionnaireForm.Question</see> objects.</field>
					/// <field name="relationship" type="MobileCRM.Relationship">Gets the relation source and related entity. &quot;null&quot;, if there is no relationship.</field>
					MobileCRM.UI.QuestionnaireForm.superproto.constructor.apply(this, arguments);
				},

				EntityChart: function (props) {
					/// <summary>[13.0] Represents the Javascript equivalent of native entity chart object.</summary>
					MobileCRM.UI.EntityChart.superproto.constructor.apply(this, arguments);
				},

				EntityList: function (props) {
					/// <summary>[v9.2] Represents the Javascript equivalent of native entity list object.</summary>
					/// <field name="allowAddExisting" type="Boolean">Gets or sets whether adding an existing entity is allowed.</field>
					/// <field name="allowCreateNew" type="Boolean">Gets or sets whether create a new entity (or managing the N:N entities in the case of N:N list) is allowed.</field>
					/// <field name="allowedDocActions" type="Number">Gets or sets a mask of document actions (for Note and Sharepoint document lists).</field>
					/// <field name="allowSearch" type="Boolean">Gets or sets whether to show the search bar.</field>
					/// <field name="autoWideWidth" type="String">Gets the view auto width pixel size.</field>
					/// <field name="context" type="Object">[v10.0] Gets the specific context object for onChange, onSave and onCommand handlers.<p>The onSave context contains property &quot;entities&quot; with the list of all changed entities and property &quot;errorMessage&quot; which can be used to cancel the save process with certain error message.</p><p>The onChange handler context contains &quot;entities&quot; property with the list of currently changed entities (typically just one entity) and property &quot;propertyName&quot; with the field name that was changed.</p><p>Command handler context contains the &quot;cmdParam&quot; property and &quot;entities&quot; property with the list of currently selected entities.</p></field>
					/// <field name="currentView" type="String">[v10.0] Gets currently selected entity list view.
					/// <field name="entityName" type="String">Gets the name of the entities in this list.</field>
					/// <field name="flipMode" type="Number">Gets or sets the flip configuration (which views to show and which one is the initial).</field>
					/// <field name="hasMapViews" type="Boolean">Gets whether the list has a view that can be displayed on map.</field>
					/// <field name="hasCalendarViews" type="Boolean">Gets or sets whether there is a view with &quot;CalendarFields&quot;.</field>
					/// <field name="hasMoreButton" type="Boolean">Gets whether the list needs a more button.</field>
					/// <field name="internalName" type="String">Gets the internal list name. Used for localization and image lookup.</field>
					/// <field name="isDirty" type="Boolean">Gets or sets whether the list is dirty.</field>
					/// <field name="isLoaded" type="Boolean">Gets or sets whether the list is loaded.</field>
					/// <field name="isMultiSelect" type="Boolean">Gets whether multi selection is active.</field>
					/// <field name="listButtons" type="Array">Gets the read-only array of strings defining the list buttons.</field>
					/// <field name="listMode" type="Number">Gets the current list mode.</field>
					/// <field name="listView" type="MobileCRM.UI._ListView">Gets the controlled listView control.</field>
					/// <field name="lookupSource" type="MobileCRM.Relationship">Gets the lookup source. If the list is used for lookup this is the entity whose property is being &quot;looked-up&quot;.</field>
					/// <field name="options" type="Number">Gets the kinds of views available on the list.</field>
					/// <field name="relationship" type="MobileCRM.Relationship">Gets the relation source and related entity. &quot;null&quot;, if there is no relationship (if it is not an associated list).</field>
					/// <field name="selectedEntity" type="MobileCRM.DynamicEntity">Gets currently selected entity. &quot;null&quot;, if there&apos;s no selection.</field>
					/// <field name="uniqueName" type="Number">Gets or sets the unique name of the list. Used to save/load list specific settings.</field>
					MobileCRM.UI.EntityList.superproto.constructor.apply(this, arguments);
				},

				HomeForm: function (props) {
					/// <summary>[v8.0] Represents the Javascript equivalent of the home form object which contains the Home/UI replacement iFrame.</summary>
					/// <remarks><p>This class works only from Home/UI replacement iFrame.</p><p>This object cannot be created directly. To obtain/modify this object, use <see cref="MobileCRM.UI.HomeForm.requestObject">MobileCRM.UI.HomeForm.requestObject</see> function.</p></remarks>
					/// <field name="form" type="MobileCRM.UI.Form">Gets the top level form.</field>
					/// <field name="items" type="Array">Gets the list of the home items.</field>
					/// <field name="listView" type="MobileCRM.UI._ListController">Gets the list view with home items.</field>
					/// <field name="lastSyncResult" type="MobileCRM.Services.SynchronizationResult">[v8.1] An object with last sync results. Contains following boolean properties: newCustomizationReady, customizationDownloaded, dataErrorsEncountered, appWasLocked, syncAborted, adminFullSync, wasBackgroundSync</field>
					/// <field name="syncResultText" type="String">[v8.1] The last synchronization error text.</field>
					/// <field name="syncProgress" type="Object">[v8.1] An object with current sync progress. Contains following properties: labels, percent. It is undefined if no sync is running.</field>
					MobileCRM.UI.HomeForm.superproto.constructor.apply(this, arguments);
				},

				ReportForm: function () {
					/// <summary>[v8.1] Represents the Dynamics CRM report form object.</summary>
					/// <field name="allowedReportIds" type="Array">The list of report entity ids that has to be included in the report form selector.</field>
					/// <field name="allowedLanguages" type="Array">The list of LCID codes of the languages that has to be included into the report form selector. The number -1 stands for "Any language".</field>
					/// <field name="defaultReport" type="String">The primary name of the report entity that should be pre-selected on the report form.</field>
					this.allowedReportIds = [];
					this.allowedLanguages = [];
					this.defaultReport = null;
				},
				
				RoutePlan: function () {
					/// <summary>[v14.2] Represents the Javascript equivalent view of RoutePlan form object.</summary>
					/// <field name="myRoute" type="DynamicEntity[]">A list of route entities.</field>
					/// <field name="completedEntities" type="DynamicEntity[]"> A list of completed entities that are about to be removed from route plan.</field>
					/// <field name="routeEntityName" type="String">Logical name of the route visit entity.</field>
					/// <field name="routeDay" type="Date">Currently selected route day.</field>
					/// <field name="isDirty" type="Boolean">Controls whether the form is dirty and requires save, or whether it can be closed.</field>
					MobileCRM.UI.RoutePlan.superproto.constructor.apply(this, arguments);
				},
				
				IFrameForm: function () {
					/// <summary>[v9.0] Represents the iFrame form object.</summary>
					/// <field name="form" type="MobileCRM.UI.Form">Gets the form hosting the iFrame.</field>
					/// <field name="isDirty" type="Boolean">[v10.0] Controls whether the form is dirty and requires save, or whether it can be closed.</field>
					/// <field name="options" type="Object">Carries the custom parameters that can be specified when opening the form using <see cref="MobileCRM.UI.IFrameForm.show">MobileCRM.UI.IFrameForm.show</see> function.</field>
					/// <field name="preventCloseMessage" type="String">[v9.3] Prevents closing the form if non-empty string is set. No other home-item can be opened and synchronization is not allowed to be started. Provided message is shown when user tries to perform those actions.</field>
					/// <field name="saveBehavior" type="Number">[v10.0] Controls the behavior of the Save command on this form (0=Default, 1=SaveOnly, 2=SaveAndClose).</field>
					MobileCRM.UI.IFrameForm.superproto.constructor.apply(this, arguments);
				},

				Form: function (props) {
					/// <summary>[v8.0] Represents the Javascript equivalent of the form object.</summary>
					/// <field name="canMaximize" type="Boolean">Gets or sets whether form can be maximized to fullscreen (full application frame).</field>
					/// <field name="isMaximized" type="Boolean">Gets or sets whether form is currently maximized to fullscreen (full application frame).</field>
					/// <field name="caption" type="String">Gets or sets the form caption.</field>
					/// <field name="selectedViewIndex" type="Number">Gets or sets the selected view (tab) index.</field>
					/// <field name="showTitle" type="Boolean">[v8.1] Determines whether the form caption bar should be visible.</field>
					/// <field name="viewCount" type="Number">Gets the count of views in the form.</field>
					/// <field name="visible" type="Boolean">Gets whether the form is visible.</field>
					MobileCRM.UI.Form.superproto.constructor.apply(this, arguments);
				},

				ViewController: function () {
					/// <summary>Represents the Javascript equivalent of view controller (map/web content).</summary>
				},

				ProcessController: function () {
					/// <summary>[v8.2] Represents the Javascript equivalent of view process controller.</summary>
					/// <remarks>It is not intended to create an instance of this class. To obtain this object, use <see cref="MobileCRM.UI.EntityForm.requestObject">EntityForm.requestObject</see> function and locate the controller in form&apos;s "controllers" list.</remarks>
					/// <field name="currentStateInfo" type="Object">Gets the information about the current process flow state (active stage, visible stage and process).</field>
					MobileCRM.UI.ProcessController.superproto.constructor.apply(this, arguments);
				},

				ViewDefinition: function () {
					/// <summary>Represents the entity view definition.</summary>
					/// <field name="entityName" type="String">Gets the entity this view is for.</field>
					/// <field name="name" type="String">Gets the name of the view.</field>
					/// <field name="fetch" type="String">Gets the fetchXml query.</field>
					/// <field name="kind" type="Number">Gets the kind of the view (public, associated, etc.).</field>
					/// <field name="version" type="Number">Gets the version.</field>
					/// <field name="buttons" type="String">Gets the view buttons.</field>
					/// <field name="selector" type="String">Gets the view template selector workflow.</field>
					/// <field name="templates" type="Array">Gets the list templates.</summary>
					/// <field name="entityLabel" type="String">Gets the entity label.</summary>
				},

				MessageBox: function (title, defaultText) {
					/// <summary>This object allows the user to show a popup window and choose one of the actions.</summary>
					/// <param name="title" type="string">The message box title.</param>
					/// <param name="defaultText" type="string">The cancel button title text.</param>
					/// <field name="items" type="Array">An array of button names.</field>
					/// <field name="title" type="string">The message box title.</field>
					/// <field name="defaultText" type="string">The cancel button title text.</field>
					/// <field name="multiLine" type="Boolean">Indicates whether the message is multi line.</field>
					var nArgs = arguments.length;
					var arr = [];
					for (var i = 2; i < nArgs; i++)
						arr.push(arguments[i]);

					this.title = title || null;
					this.defaultText = defaultText || null;
					this.multiLine = false;
					this.items = arr;
				},

				LookupForm: function () {
					/// <summary>This object allows user to select an entity from a configurable list of entity types.</summary>
					/// <field name="entities" type="Array">An array of allowed entity kinds (schema names).</field>
					/// <field name="allowedViews" type="String">OBSOLETE: Allowed views, or null if all are allowed.</field>
					/// <field name="source" type="MobileCRM.Relationship">The entity whose property will be set to the chosen value.</field>
					/// <field name="prevSelection" type="MobileCRM.Reference">The entity whose property will be set to the chosen value.</field>
					/// <field name="allowNull" type="Boolean">Whether to allow selecting no entity.</field>
					/// <field name="preventClose" type="Boolean">Whether to prevent closing form without choosing a value.</field>
					var nEntities = arguments.length;
					var arr = [];
					for (var i = 0; i < nEntities; i++)
						arr.push(arguments[i]);

					this._views = [];
					this.allowedViews = "";
					this.entities = arr;
					this.source = null;
					this.prevSelection = null;
					this.allowNull = false;
					this.preventClose = false;
				},
				MultiLookupForm: function () {
					/// <summary>[v9.3] This object allows user to select a list of entities from a configurable list of entity types. Derived from LookupForm so you can use the addView() and addEntityFilter() methods.</summary>
					/// <field name="entities" type="Array">An array of allowed entity kinds (schema names).</field>
					/// <field name="source" type="MobileCRM.Relationship">The entity whose property will be set to the chosen value.</field>
					/// <field name="dataSource" type="MobileCRM.Reference[]">The list of entities that should be displayed as selected.</field>
					/// <field name="prevSelection" type="MobileCRM.Reference">The entity whose property will be set to the chosen value.</field>
					/// <field name="allowNull" type="Boolean">Whether to allow selecting no entity.</field>
					/// <field name="preventClose" type="Boolean">Whether to prevent closing form without choosing a value.</field>
					MobileCRM.UI.MultiLookupForm.superproto.constructor.apply(this, arguments);
					this.dataSource = [];
				},
				TourplanForm: function (props) {
					/// <summary>Represents the Javascript equivalent tourplan form object.</summary>
					/// <remarks>This object cannot be created directly. To obtain/modify this object, use <see cref="MobileCRM.UI.TourplanForm.requestObject">MobileCRM.UI.TourplanForm.requestObject</see> function.</remarks>
					/// <field name="isDirty" type="Boolean">Indicates whether the form has been modified.</field>
					/// <field name="isLoaded" type="Boolean">Gets or sets whether the form is loaded.</field>
					/// <field name="view" type="MobileCRM.UI._AppointmentView">Gets tourplan form view <see cref="MobileCRM.UI._AppointmentView">MobileCRM.UI.AppointmentView</see>.</field>
					MobileCRM.UI.TourplanForm.superproto.constructor.apply(this, arguments);
				},

				_DetailView: function (props) {
					/// <summary>Represents the Javascript equivalent of detail view with set of items responsible for fields editing.</summary>
					/// <field name="isDirty" type="Boolean">Indicates whether the value of an item has been modified.</field>
					/// <field name="isEnabled" type="Boolean">Gets or sets whether the all items are enabled or disabled.</field>
					/// <field name="isVisible" type="Boolean">Gets or sets whether the view is visible.</field>
					/// <field name="items" type="Array">An array of <see cref="MobileCRM.UI._DetailItem">MobileCRM.UI._DetailItem</see> objects</field>
					/// <field name="name" type="String">Gets the name of the view</field>
					MobileCRM.UI._DetailView.superproto.constructor.apply(this, arguments);
				},
				DetailViewItems: {
					Item: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="name" type="String">Gets or sets the item name.</field>
						/// <field name="label" type="String">Gets or sets the item label.</field>
						/// <field name="dataMember" type="String">Gets or sets the name of the property containing the item value in data source objects.</field>
						/// <field name="errorMessage" type="String">Gets or sets the item error message.</field>
						/// <field name="isEnabled" type="Boolean">Gets or sets whether the item is editable.</field>
						/// <field name="isVisible" type="Boolean">Gets or sets whether the item is visible.</field>
						/// <field name="value" type="Object">Gets or sets the bound item value.</field>
						/// <field name="isNullable" type="Boolean">Gets or sets whether the item value can be &quot;null&quot;.</field>
						/// <field name="validate" type="Boolean">Gets or sets whether the item needs validation.</field>
						/// <field name="style" type="String">The name of the Woodford item style.</field>
						this._type = null;
						this.name = name;
						this.label = label;
					},
					SeparatorItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> separator item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						MobileCRM.UI.DetailViewItems.SeparatorItem.superproto.constructor.apply(this, arguments);
						this._type = "Separator";
					},
					TextBoxItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> text item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="numberOfLines" type="Number">Gets or sets the number of lines to display. Default is one.</field>
						/// <field name="isPassword" type="Boolean">Gets or sets whether the text value should be masked. Used for password entry.</field>
						/// <field name="maxLength" type="Number">Gets to sets the maximum text length.</field>
						/// <field name="kind" type="Number">Gets or sets the value kind (Text=0, Email=1, Url=2, Phone=3, Barcode=4).</field>
						/// <field name="placeholderText" type="Number">Gets or sets the text that is displayed in the control until the value is changed by a user action or some other operation. Default is empty string.</field>
						MobileCRM.UI.DetailViewItems.TextBoxItem.superproto.constructor.apply(this, arguments);
						this._type = "TextBox";
					},
					NumericItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> numeric item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="minimum" type="Number">Gets or sets the minimum allowed value.</field>
						/// <field name="maximum" type="Number">Gets or sets the maximum allowed value.</field>
						/// <field name="increment" type="Number">Gets or sets the increment (if the upDownVisible is true).</field>
						/// <field name="upDownVisible" type="Boolean">Gets or sets whether the up/down control is visible.</field>
						/// <field name="decimalPlaces" type="Number">Gets or sets the number of decimal places.</field>
						/// <field name="displayFormat" type="String">Gets or sets the value format string.</field>
						MobileCRM.UI.DetailViewItems.NumericItem.superproto.constructor.apply(this, arguments);
						this._type = "Numeric";
						//this.minimum = 0;
						//this.maximum = 0;
						//this.increment = 1;
						//this.upDownVisible = false;
						//this.decimalPlaces = 2;
						//this.displayFormat = "";
					},
					CheckBoxItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> checkbox item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="textChecked" type="String">Gets or sets the text for checked state.</field>
						/// <field name="textUnchecked" type="String">Gets or sets the text for unchecked state.</field>
						MobileCRM.UI.DetailViewItems.CheckBoxItem.superproto.constructor.apply(this, arguments);
						this._type = "CheckBox";
						this.isNullable = false;
					},
					DateTimeItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> date/time item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="minimum" type="Date">Gets or sets the minimum allowed value.</field>
						/// <field name="maximum" type="Date">Gets or sets the maximum allowed value.</field>
						/// <field name="parts" type="Number"> Gets or sets whether to display and edit the date, time or both.</field>
						MobileCRM.UI.DetailViewItems.DateTimeItem.superproto.constructor.apply(this, arguments);
						this._type = "DateTime";
					},
					DurationItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> duration item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						MobileCRM.UI.DetailViewItems.DurationItem.superproto.constructor.apply(this, arguments);
						this._type = "Duration";
					},
					ComboBoxItem: function (name, label) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> combobox item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <field name="listDataSource" type="Object">Gets or sets the object with props and values to be displayed in the combo list (e.g. {&quot;label1&quot;:1, &quot;label2&quot;:2}).</field>
						/// <field name="listDataSourceValueType" type="String">Type of list data source element value. Default is string, allowed int, string.</param></param>
						MobileCRM.UI.DetailViewItems.ComboBoxItem.superproto.constructor.apply(this, arguments);
						this._type = "ComboBox";
					},
					LinkItem: function (name, label, listDropDownFormat) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> link item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <param name="listDropDownFormat" type="MobileCRM.UI.DetailViewItems.DropDownFormat">Defines item&apos;s drop down format.</param>
						/// <field name="isMultiLine" type="Boolean">Gets or sets whether the item is multiline. Default is false.</field>
						MobileCRM.UI.DetailViewItems.LinkItem.superproto.constructor.apply(this, arguments);
						this._type = "Link";
						if (listDropDownFormat)
							this.listDropDownFormat = listDropDownFormat;
					},
					ButtonItem: function (name, clickText) {
						/// <summary>[8.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> duration item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="clickText" type="String">Gets or sets the text content of click button.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						MobileCRM.UI.DetailViewItems.DurationItem.superproto.constructor.apply(this, arguments);
						this._type = "Button";
						this.name = name;
						this.isEnabled = true;
						this.style = "Button";
						this.clickText = clickText;
					},
					DropDownFormat: {
						StringList: 17,
						StringListInput: 18,
						MultiStringList: 19,
						MultiStringListInput: 20
					},
					GridItem: function (name, label, gridStyleDefintion) {
						/// <summary>[13.0] Represents the <see cref="MobileCRM.UI._DetailView"></see> grid item.</summary>
						/// <param name="name" type="String">Defines the item name.</param>
						/// <param name="label" type="String">Defines the item label.</param>
						/// <param name="gridStyleDefintion" type="MobileCRM.UI.DetailViewItems.GridStyleDefintion">Gets or sets the style definition for grid item.</param>
						this.items = [];
						MobileCRM.UI.DetailViewItems.GridItem.superproto.constructor.apply(this, arguments);
						if (gridStyleDefintion)
							this._setGrid(gridStyleDefintion.columns, gridStyleDefintion.rows);
						this._type = "Grid";
					},
					GridStyleDefintion: function (columns, rows) {
						/// <summary>[13.0] Represents the columns and rows style definition for grid item.</summary>
						/// <param name="columns" type="Array">MobileCRM.UI.DetailViewItems.DetailGridLength>">Defines the columns style.</param>
						/// <param name="rows" type="Array">MobileCRM.UI.DetailViewItems.DetailGridLength>">Defines the rows style.</param>
						this.columns = columns;
						this.rows = rows;
					},
					DetailGridLength: function (value, gridUnitType) {
						/// <summary>[13.0] Represents the grid length in grid unit type.</summary>
						/// <param name="value" type="String">Grid length value.</param>
						/// <param name="gridUnitType" type="MobileCRM.UI.DetailViewItems.DetailGridUnitType">Defines the grid <see cref="MobileCRM.UI.DetailViewItems.DetailGridUnitType"></see> unit type.</param>
						this._value = value;
						this._gridUnitType = gridUnitType;
					},
					DetailGridUnitType: {
						/// <summary>[13.0] Gets the grid unit type.</summary>
						/// <field name="auto" type="enum">Gets automatic unit type.</field>
						/// <field name="pixel" type="enum">Gets absolute pixel unit type.</field>
						/// <field name="star" type="enum">Gets relative unit type.</field>
						auto: 0,
						pixel: 1,
						star: 2
					}
				},

				MediaTab: function (index, name) {
					/// <summary>Represents the MediaTab controller.</summary>
					/// <remarks>An instance of this class can only be obtained by calling the <see cref="MobileCRM.UI.EntityForm.getMediaTab">MobileCRM.UI.EntityForm.getMediaTab</see> method.</remarks>
					/// <param name="index" type="Number">The index of an associated media tab.</param>
					/// <param name="name" type="String">The name of an associated media tab.</param>

					this.index = index;
					this.name = name;
				}
			},
			Services: {
				FileInfo: function (filePath, url, mimeType, nextInfo) {
					/// <summary>Carries the result of a DocumentService operation.</summary>
					/// <remarks>In case of canceled document service operation, all properties in this object will be set to &quot;null&quot;.</remarks>
					/// <field name="filePath" type="String">Gets the full path of the local file.</field>
					/// <field name="url" type="String">Gets the local URL of the file which can be used from within this HTML document.</field>
					/// <field name="mimeType" type="String">Gets the file MIME type.</field>
					/// <field name="nextInfo" type="MobileCRM.Services.FileInfo">Gets the next file info or &quot;null&quot;.</field>
					this.filePath = filePath;
					this.url = url;
					this.mimeType = mimeType;
					this.nextInfo = nextInfo || null;
				},
				ChatService: function () {
					/// <summary>[v9.3] Represents a service for sending instant messages to users or shared channels.</summary>
					/// <remarks>Instance of this object cannot be created directly. Use <see cref="MobileCRM.Services.ChatService.getService">MobileCRM.Services.ChatService.getService</see> to create new instance.</remarks>
					/// <field name="chatUser" type="MobileCRM.DynamicEntity">An instance of the resco_chatuser entity for current user (either system or external).</field>
					/// <field name="userEntity" type="String">The user entity name (either systemuser or external user entity name).</field>
					/// <field name="userId" type="String">Primary key (id) of the current user (either system or external).</field>
					MobileCRM.Services.ChatService.superproto.constructor.apply(this, arguments);
				},
				DocumentService: function () {
					/// <summary>[v8.1] Represents a service for acquiring the documents.</summary>
					/// <field name="maxImageSize" type="String">Gets or sets the maximum captured image size. If captured image size is greater, the image is resized to specified maximum size [640x480,1024x768,1600x1200,2048x1536,2592x1936 ].</field>
					/// <field name="maxUploadImageSize" type="String">Gets or sets the maximum uploaded image size. If uploaded image size is greater then image is resized to specified maximum size [640x480,1024x768,1600x1200,2048x1536,2592x1936 ].</field>
					/// <field name="recordQuality" type="String">Gets or sets the record quality for audio/video recordings [Low, Medium, High].</field>
					/// <field name="allowChooseVideo" type="Boolean">Indicates whether the video files should be included into the image picker when selecting the photos. The default is true.</field>
					/// <field name="allowMultipleFiles" type="Boolean">Indicates whether to allow multiple files for DocumentActions SelectPhoto and SelectFile.[Not implemented on iOS.]</field>
					/// <field name="allowCancelHandler" type="Boolean">Indicates whether to allow handling of cancel event. Callback will pass the null argument in this case.</field>
				},
				AudioRecorder: function () {
					/// <summary>[v10.0] Represents a service for recording an audio.</summary>
				},
				CompanyInformation: function (name, address) {
					/// <summary>Represents CompanyInformation object.</summary>
					/// <param name="address" type="String">Company address<param>
					/// <param name="name" type="String">Company name<param>
					/// <field name="address" type="String">Company address<field>
					/// <field name="name" type="String">Company name<field>
					this.name = name;
					this.address = address;
				},
				AddressBookService: function () {
					/// <summary>[v9.1] Represents a service for accessing the address book.</summary>
				},
				DynamicsReport: function (reportId, regarding) {
					/// <summary>[v10.0] Represents a service for downloading MS Dynamics reports.</summary>
					/// <param name="reportId" type="String">ID of the &quot;report&quot; entity record.<param>
					/// <param name="regarding" type="MobileCRM.Reference">Regarding entity reference.<param>
					/// <field name="reportId" type="String">ID of the &quot;report&quot; entity record.<field>
					/// <field name="regarding" type="MobileCRM.Reference">Regarding entity reference.<field>
					/// <field name="outputFolder" type="String">AppData-relative or absolute path to the output folder where the file should be stored. Leave undefined to put them into platform-specific temporary folder.<field>
					this.reportId = reportId;
					this.regarding = regarding;
					this.outputFolder = null;
				},
				HttpWebRequest: function () {
					/// <summary>[v11.0] Instance of http web request.</summary>
					/// <field name="userName" type="String">The authentication user name.</field>
					/// <field name="password" type="name="password" type="String">The authentication password.</field>
					/// <field name="method" type="String">The http method to use for the request (e.g. "POST", "GET", "PUT").</field>
					/// <field name="headers" type="Object">An object of additional header key/value pairs to send along with requests using the HttpWebRequest.</field>
					/// <field name="contentType" type="String">The htt request data content type.</field>
					/// <field name="allowRedirect" type="Boolean">The http allows servers to redirect a client request to a different location.</field>
					/// <field name="responseEncoding" type="String">The http web response encoding type. (default: UTF-8), e.g. Base64, ASCII, UTF-8, Binary in case of blob.</field>
					/// <field name="responseType" type="String">The HttpWebResponse content type.</field>

					this.userName = "";
					this.password = "";
					this.method = "";
					this.headers = {};
					this.contentType = null;
					this.allowRedirect = false;
					this._body = null;
					this._encoding = "UTF-8";
					this._credentials = {};
					this.responseType = null;
					this.responseEncoding = this._encoding;
				},
				SynchronizationResult: function (syncResult) {
					/// <summary>[v8.1] Represents the synchronization result.</summary>
					/// <field name="newCustomizationReady" type="Boolean">Indicates whether the new customization is ready.</field>
					/// <field name="customizationDownloaded" type="Boolean">Indicates whether the new customization was applied.</field>
					/// <field name="dataErrorsEncountered" type="Boolean">Indicates whether some data errors were encountered during sync (cannot upload, delete, change status, owner, etc.).</field>
					/// <field name="appWasLocked" type="Boolean">Application was locked.</field>
					/// <field name="syncAborted" type="Boolean">Sync was aborted.</field>
					/// <field name="adminFullSync" type="Boolean">Full sync was requested so background sync was aborted.</field>
					/// <field name="webError" type="Boolean">Indicates whether sync failed due to a communication error (HttpException, for example).</field>
					/// <field name="connectFailed" type="Boolean">Indicates whether sync could not start because of a connection failure.</field>
					/// <field name="wasBackgroundSync" type="Boolean">Indicates whether the last sync was background sync or foreground sync.</field>
					/// <field name="OAuthError" type="Boolean">Sync failed because the OAuth access token can&apos;t be acquired or refreshed.</field>
					/// <field name="syncDownloadRestartedOnBackground" type="Boolean">New customization was downloaded. Sync is still downloading data on background.</field>
					/// <field name="warning" type="Boolean">Sync result contains some warnings that are not critical.</field>
					if (typeof (syncResult) != "undefined") {
						this._rawValue = syncResult;
						var res = new Number(syncResult);
						this.newCustomizationReady = (res & 1) != 0;
						this.customizationDownloaded = (res & 2) != 0;
						this.dataErrorsEncountered = (res & 8) != 0;
						this.appWasLocked = (res & 16) != 0;
						this.syncAborted = (res & 32) != 0;
						this.adminFullSync = (res & 64) != 0;
						this.webError = (res & 128) != 0;
						this.connectFailed = (res & 256) != 0;
						this.OAuthError = (res & 512) != 0;
						this.syncDownloadRestartedOnBackground = (res & 1024) != 0;
						this.warning = (res & 2048) != 0;
						this.wasBackgroundSync = (res & 0x80000000) != 0;
					}
				},
				GeoAddress: function () {
					/// <summary>[v9.3] Represents a service for translating geo position into the civic address and back.</summary>
					/// <field name="streetNumber" type="String">Gets or sets the street number.</field>
					/// <field name="street" type="String">Gets or sets the street.</field>
					/// <field name="city" type="String">Gets or sets the city.</field>
					/// <field name="zip" type="String">Gets or sets the zip code.</field>
					/// <field name="stateOrProvince" type="String">Gets or sets the state or province.</field>
					/// <field name="country" type="String">Gets or sets the country.</field>
					/// <field name="isValid" type="String">Indicates whether the address is valid.</field>
				},
				AIVision: function () {
					/// <summary>[v12.3] Represents a service for AI image recognition.</summary>
					/// <field name="action" type="number">Sets action for AI vision service. Capture photo or Select picture.</field>
					/// <field name="settings" type="Array">Array sets of json formated prediction key and url.</field>
					this._isNew = true;
					this._entityName = "";
				},
				AIVisionSettings: function () {
					/// <summary>[v12.3] Represents the settings for AI image recognition service.</summary>
					/// <field name="modelName" type="String">Gets or sets the model name.</field>
					/// <field name="predictionKey" type="String">Gets or sets the model prediction key.</field>
					/// <field name="url" type="String">Gets or sets the url to train model.</field>
					/// <field name="serviceType" type="String">Gets or sets the service type. By default we use Azure.</field>
					this.modelName = "";
					this.predictionKey = "";
					this.url = "";
					this.serviceType = "Azure"; // [v12.3] supports only azure service, used as default.
				}
			}
	    };

		/************************/
		// Prototypes & Statics //
		/************************/
		MobileCRM.Bridge.prototype._callAsyncMethod = function (cmdId, result) {
			if (result instanceof Promise) {
				result.then(function (asyncRes) {
					MobileCRM.bridge.command(cmdId, typeof (asyncRes) == "string" ? asyncRes : JSON.stringify(asyncRes));
				}).catch(function (err) {
					MobileCRM.bridge.command(cmdId, "Err:" + err);
				});
				return cmdId;
			}
			else
				return typeof (result) == "string" ? result : JSON.stringify(result);
		}
		// MobileCRM.UI._MediaTab
		MobileCRM.UI.MediaTab.prototype._onCommand = function (commandIndex, errorCallback) {
			/// <summary>Executes the MediaTab command by index.</summary>
			/// <param name="commandIndex" type="Number">Specifies the command index.</param>
			///	<param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
			mediaTab.invokeMethodAsync("View.ExecuteAction", [commandIndex], function () { }, errorCallback);
			mediaTab.release();
		};
		MobileCRM.UI.MediaTab.prototype.setEditable = function (editable, errorCallback) {
			/// <summary>[v11.1] Marks the MediaTab as editable.</summary>
			/// <param name="editable" type="Boolean">Indicates whether to mark MediaTab as editable.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
			mediaTab.invokeMethodAsync("set_IsEditable", [editable], function () { }, errorCallback);
			mediaTab.release();
		};
		MobileCRM.UI.MediaTab.prototype.setCommandsMask = function (commandMask, errorCallback) {
			/// <summary>[v11.1] Sets the mask of allowed document actions.</summary>
			/// <param name="commandMask" type="Number">Specifies the mask of allowed commands.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
			mediaTab.invokeMethodAsync("set_CommandsMask", [commandMask], function () { }, errorCallback);
			mediaTab.release();
		};
		MobileCRM.AboutInfo.requestObject = function (callback, errorCallback, scope) {
			/// <summary>[v8.2] Asynchronously gets the AboutInfo object with branding information.</summary>
			/// <param name="callback" type="function(Object)">The callback function that is called asynchronously with the about info object.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.AboutForm", "LoadAboutInfo", [], function (res) {
				var aboutInfo = new MobileCRM.AboutInfo();
				for (var property in res) {
					if (aboutInfo.hasOwnProperty(property))
						aboutInfo[property] = res[property];
				}
				callback.call(scope, aboutInfo);
			}, errorCallback, scope);
		};
		MobileCRM.UI.MediaTab.prototype.capturePhoto = function (errorCallback) {
			/// <summary>Captures photo on this media tab.</summary>
			this._onCommand(2, errorCallback);
		};
		MobileCRM.UI.MediaTab.prototype.selectPhoto = function (errorCallback) {
			/// <summary>Executes the select photo command on this media tab.</summary>
			this._onCommand(4, errorCallback);
		};
	    MobileCRM.UI.MediaTab.prototype.selectFile = function (errorCallback) {
	        /// <summary>Executes the select file command on this media tab.</summary>
	        this._onCommand(8, errorCallback);
		};
	    MobileCRM.UI.MediaTab.prototype.recordAudio = function (errorCallback) {
	        /// <summary>Executes the record audio command on this media tab.</summary>
	        this._onCommand(16, errorCallback);
	    };
	    MobileCRM.UI.MediaTab.prototype.recordVideo = function (errorCallback) {
	        /// <summary>Executes the record video command on this media tab.</summary>
	        this._onCommand(32, errorCallback);
	    };
	    MobileCRM.UI.MediaTab.prototype.clear = function (errorCallback) {
	        /// <summary>Clears the content of this media tab.</summary>
	        this._onCommand(0x1000, errorCallback);
	    };
	    MobileCRM.UI.MediaTab.prototype.open = function (errorCallback) {
	        /// <summary>Opens the loaded document in a external application. Which application is platform specific.</summary>
	        this._onCommand(0x4000, errorCallback);
	    }
	    MobileCRM.UI.MediaTab.prototype.export = function (errorCallback) {
	        /// <summary>Saves to file to disk.</summary>
	        this._onCommand(0x8000000, errorCallback);
	    }
	    MobileCRM.UI.MediaTab.prototype.print = function (errorCallback) {
	        /// <summary>Prints the document.</summary>
	        this._onCommand(0x80000, errorCallback);
	    }
	    MobileCRM.UI.MediaTab.prototype.getDocumentInfo = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0.1] Asynchronously gets the media tab view object.</summary>
	        /// <param name="callback" type="function(Object)">The callback function that is called asynchronously with the document info object.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
	        mediaTab.invokeMethodAsync("get_View", [], callback, errorCallback, scope);
	        mediaTab.release();
	    };
	    MobileCRM.UI.MediaTab.prototype.getData = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0] Gets the media tab document in form of base64 string.</summary>
	        /// <param name="callback" type="function(String)">The callback function that is called asynchronously with the base64-encoded document data.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("getViewData", this.name, callback, errorCallback, scope);
	    };
	    MobileCRM.UI.MediaTab.getData = function (viewName, callback, errorCallback, scope) {
	        /// <summary>[v8.0] Gets the media tab document in form of base64 string.</summary>
	        /// <param name="viewName" type="String">The name of the media tab.</param>
	        /// <param name="callback" type="function(String)">The callback function that is called asynchronously with the base64-encoded document data.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("getViewData", viewName, callback, errorCallback, scope);
	    };
		MobileCRM.UI.MediaTab.getDataAsync = function (viewName) {
			/// <summary>[v8.0] Gets the media tab document in form of base64 string.</summary>
			/// <param name="viewName" type="String">The name of the media tab.</param>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with the base64-encoded document data.</returns>
			return MobileCRM.bridge.invokeCommandPromise("getViewData", viewName);
		};
		MobileCRM.UI.MediaTab.prototype.getDataAsync = function () {
			/// <summary>[v8.0] Gets the media tab document in form of base64 string.</summary>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with the base64-encoded document data.</returns>
			return MobileCRM.UI.MediaTab.getDataAsync(this.name);
		};
	    MobileCRM.UI.MediaTab.prototype.isEmpty = function (callback, errorCallback, scope) {
	        /// <summary>[v9.0.2] Asynchronously gets the boolean value indicating whether the media tab content is empty or not.</summary>
	        /// <param name="callback" type="function(Boolean)">The callback function that is called asynchronously with the boolean value indicating whether the content is empty or not.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
	        mediaTab.invokeMethodAsync("get_IsEmpty", [], callback, errorCallback, scope);
	        mediaTab.release();
	    };
	    MobileCRM.UI.MediaTab.prototype.getNoteSubject = function (callback, errorCallback, scope) {
	        /// <summary>[v10.1] Asynchronously gets the subject text of the note loaded on the media tab.</summary>
	        /// <param name="callback" type="function(String)">The callback function that is called asynchronously with the media tab note subject.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
	        mediaTab.invokeMethodAsync("get_NoteSubject", [], callback, errorCallback, scope);
	        mediaTab.release();
	    };
	    MobileCRM.UI.MediaTab.prototype.setNoteSubject = function (subject, errorCallback, scope) {
	        /// <summary>[v10.1] Asynchronously sets the name of the note to load (and save).</summary>
	        /// <param name="subject" type="String">The name of the note to load (and save).</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var mediaTab = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [this.index]);
	        mediaTab.invokeMethodAsync("set_NoteSubject", [subject], function () { }, errorCallback, scope);
	        mediaTab.release();
	    };

	    // MobileCRM.Bridge
	    MobileCRM.Bridge.prototype._createCmdObject = function (success, failed, scope) {
	        var self = MobileCRM.bridge;
	        var cmdId = 'Cmd' + self.callbackId++;
	        self.callbacks[cmdId] = { SuccessFn: success, FailedFn: failed, Scope: scope };
	        return cmdId;
	    };

	    MobileCRM.Bridge.prototype.requestObject = function (objectName, callback, errorCallback, scope) {
	        /// <summary>Requests the managed application object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with JSON representation of requested object. Requested object must be exposed by application. The list of exposed objects can be found in JSBridge Guide.</remarks>
	        /// <param name="objectName" type="String">The name of exposed managed object as it was registered on application side.</param>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously with JSON-serialized <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> <b>obj</b> as argument. Callback must return the object clone with changed properties (see <see cref="MobileCRM.ObservableObject.getChanged">getChanged</see> method). Returned object is passed back to application and its properties are applied back on requested object.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("requestObj", objectName, callback, errorCallback, scope);
	    }
	    MobileCRM.Bridge.prototype.initialize = function () {
	        /// <summary>Initializes the bridge to be used for synchronous invokes.</summary>
	    }
	    MobileCRM.Bridge.prototype.invokeMethodAsync = function (objectName, method, paramsList, callback, errorCallback, scope) {
	        /// <summary>Invokes a method on exposed managed object and returns the result asynchronously via callback.</summary>
	        /// <param name="objectName" type="String">The name of exposed managed object as it was registered on C# side (IJavascriptBridge.ExposeObject).</param>
	        /// <param name="method" type="String">The name of the method implemented by object class.</param>
	        /// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        return MobileCRM.bridge.command("invokeMethod", objectName + "." + method + JSON.stringify(paramsList), callback, errorCallback, scope);
	    }
	    MobileCRM.Bridge.prototype.invokeStaticMethodAsync = function (assembly, typeName, method, paramsList, callback, errorCallback, scope) {
	        /// <summary>Invokes a static method on specified type and returns the result asynchronously via callback.</summary>
	        /// <param name="assembly" type="String">The name of the assembly which defines the type.</param>
	        /// <param name="typeName" type="String">The full name of the C# type which implements the method.</param>
	        /// <param name="method" type="String">The name of static method to be invoked.</param>
	        /// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        return MobileCRM.bridge.command("invokeMethod", (assembly ? (assembly + ":") : "") + typeName + "." + method + JSON.stringify(paramsList),  callback, errorCallback, scope);
	    }
		MobileCRM.Bridge.prototype.invokeCommandPromise = function (command, args) {
			return new Promise(function (resolve, reject) {
				MobileCRM.bridge.command(command, args, resolve, function (err) { reject(new Error(err)); });
			});
		}
		MobileCRM.Bridge.prototype.invokeMethodPromise = function (objectName, method, paramsList) {
			/// <summary>Invokes a method on exposed managed object asynchronously as a Promise.</summary>
			/// <param name="objectName" type="String">The name of exposed managed object as it was registered on C# side (IJavascriptBridge.ExposeObject).</param>
			/// <param name="method" type="String">The name of the method implemented by object class.</param>
			/// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
			/// <returns type="Promise&lt;any&gt;">A Promise object which will be resolved with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value..</returns>
			return MobileCRM.bridge.invokeCommandPromise("invokeMethod", objectName + "." + method + JSON.stringify(paramsList));
		}
		MobileCRM.Bridge.prototype.invokeStaticMethodPromise = function (assembly, typeName, method, paramsList) {
			/// <summary>Invokes a static method on specified type asynchronously as a Promise.</summary>
			/// <param name="assembly" type="String">The name of the assembly which defines the type.</param>
			/// <param name="typeName" type="String">The full name of the C# type which implements the method.</param>
			/// <param name="method" type="String">The name of static method to be invoked.</param>
			/// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
			/// <returns type="Promise&lt;any&gt;">A Promise object which will be resolved with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value..</returns>
			return MobileCRM.bridge.invokeCommandPromise("invokeMethod", (assembly ? (assembly + ":") : "") + typeName + "." + method + JSON.stringify(paramsList));
		}

	    var _tmpObjId = 0;
	    MobileCRM.Bridge.prototype.exposeObjectAsync = function (method, paramsList) {
	        /// <summary>Exposes the managed object which is the result of the method call.</summary>
	        /// <param name="method" type="String">The name of the method implemented by object class.</param>
	        /// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
	        /// <returns type="MobileCRM.ExposedObject">The Javascript placeholder object for exposed managed object.</returns>
	        var objId = ++_tmpObjId;
	        MobileCRM.bridge.command("exposeMethodResult", objId + "#" + method + JSON.stringify(paramsList));
	        return new MobileCRM.ExposedObject(objId);
	    }

	    MobileCRM.Bridge.prototype.raiseGlobalEvent = function (eventName, args) {
	        /// <summary>[v9.0] Raises the global event which can have listeners bound by other iFrames.</summary>
	        /// <param name="eventName" type="String">Global event name.</param>
	        /// <param name="args" type="Object">Any object that has to be passed to all event listeners. This object is stringified JSON and passed to another iFrame listening on the global event.</param>
	        this.invokeStaticMethodAsync("MobileCrm.UI", "MobileCrm.UI.Controllers.WebController", "RaiseGlobalEvent", [eventName, JSON.stringify(args)]);
	    }

	    var _globalHandlers = { };

	    MobileCRM.Bridge.prototype.onGlobalEvent = function (eventName, handler, bind, scope) {
	        /// <summary>[v9.0] Binds or unbinds the handler for global event.</summary>
	        /// <remarks><p>This methods binds or unbinds a handler which is called when this or other iFrame raises the specified event by calling the <see cref="MobileCRM.Bridge.raiseGlobalEvent">MobileCRM.bridge.raiseGlobalEvent</see> method.</p><p>It can also bind a handler for pre-defined events EntityFormClosed, IFrameFormClosed, SyncStarted and SyncFinished.</p></remarks>
	        /// <param name="eventName" type="String">Global event name.</param>
	        /// <param name="handler" type="function(args)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = _globalHandlers[eventName];
	        if (handlers === undefined) {
	            _globalHandlers[eventName] = handlers = [];
	        }
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (bind) {
	            if (register)
	                MobileCRM.bridge.command("registerGlobalEvent", "+" + eventName);
	        }
	        else if (handlers.length == 0)
	            MobileCRM.bridge.command("registerGlobalEvent", "-" + eventName);
	    };

	    MobileCRM.Bridge.prototype._callGlobalHandlers = function (event, data) {
	        var handlers = _globalHandlers[event];
	        if (handlers && handlers.length > 0) {
	            return _callHandlers(handlers, data);
	        }
	        return null;
	    }

		MobileCRM.Bridge.prototype.runCallback = function (id, response) {
			/// <summary>Internal method which is called from Mobile CRM application to run a command callback.</summary>
			/// <param name="id" type="String">A command ID</param>
			/// <param name="response" type="String">A string containing the JSON response</param>
			try {
				var callback = MobileCRM.bridge.callbacks[id];
				if (callback) {
					var result = null;
					if (callback.SuccessFn) {
						result = callback.SuccessFn.call(callback.Scope, response);
						// Forget SuccessFn not to be called anymore
						delete callback.SuccessFn;
					}
					return JSON.stringify(result);
				}
				return "Err: callback not found";
			} catch (exception) {
				return 'Err:' + _safeErrorMessage(exception);
			}
		};
		MobileCRM.Bridge.prototype.setResponse = function (id, response, deleteCallback) {
			/// <summary>Internal method which is called from Mobile CRM application in case of successfully processed command.</summary>
			/// <param name="id" type="String">A command ID</param>
			/// <param name="response" type="String">A string containing the JSON response</param>
			try {
				var self = MobileCRM.bridge;
				var callback = self.callbacks[id];
				if (callback) {
					if (callback.SuccessFn) {
						callback.SuccessFn.call(callback.Scope, response);
					}
					if (deleteCallback != false)
						delete self.callbacks[id];
				}
			} catch (exception) {
				return _safeErrorMessage(exception);
			}
			return "OK";
		};
	    MobileCRM.Bridge.prototype.setError = function (id, error) {
	        /// <summary>Internal method which is called from Mobile CRM application in case of command processing failure.</summary>
	        /// <param name="id" type="String">A command ID</param>
	        /// <param name="response" type="String">A string containing the error message</param>
	        var self = MobileCRM.bridge;
	        var callback = self.callbacks[id];
	        if (callback) {
	            if (callback.FailedFn) {
	                callback.FailedFn.call(callback.Scope, error);
	            }
	            delete self.callbacks[id];
	        }
	    };
	    MobileCRM.Bridge.prototype.closeForm = function () {
	        /// <summary>Closes a form containing this HTML document.</summary>
	        MobileCRM.bridge.command("closeForm");
	    };
	    MobileCRM.Bridge.prototype.enableDebug = function (callback, errorCallback, scope) {
	        /// <summary>Enables platform-specific features for debugging the web page.</summary>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        /// <remarks><p>After calling this method, it is possible to attach the Google Chrome debugger into the web page opened in MobileCRM application running on Android (KitKat or newer).</p><p>This method also activates the Javascript warnings in Windows 7 app.</p><p>It has dummy implementation on iOS and Android debug build.</p></remarks>
	        MobileCRM.bridge.command("enableDebug", "", callback, errorCallback, scope);
	    };
	    MobileCRM.Bridge.prototype.enableZoom = function (enable) {
	        /// <summary>Enables platform-specific pinch zoom gesture.</summary>
	        /// <param name="enable" type="Boolean">Indicates whether to enable or disable zooming support.</param>
	        /// <remarks><p>After calling this method, it is possible to use the pinch gesture to control the content zoom. This functionality is implemented only on Android. Other platforms either do not support zoom or it is controlled by the HTML viewport meta tag.</p></remarks>
	        MobileCRM.bridge.command("enableZoom", enable);
	    };
	    MobileCRM.Bridge.prototype.getWindowSize = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0] Returns the size of the window in logical pixels without any scaling and viewport calculations..</summary>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously. Gets an object with the window &quot;width&quot; and &quot;height&quot;.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("getWindowSize", "", callback, errorCallback, scope);
	    };
	    var _alertQueue = [];
	    MobileCRM.Bridge.prototype.alert = function (text, callback, scope) {
	        /// <summary>Shows a message asynchronously and calls the callback after it is closed by user.</summary>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        _alertQueue.push(function () {
	            window.alert(text); // when called directly, alert hangs up on iOS9 (if called from callback invoked from native code)
	            if (callback)
	                callback.call(scope);
	        });
	        window.setTimeout(function(){
	        	var nextWorker = _alertQueue.splice(0, 1);
	        	nextWorker[0]();
	        });
	    };
	    MobileCRM.Bridge.prototype.log = function (text) {
	        /// <summary>[v8.0] Appends a message into the JSBridge log.</summary>
	        /// <param name="text" type="String">A text to be written into the log.</param>
	        MobileCRM.bridge.command("log", text);
	    };

	    // MobileCRM.ExposedObject
	    MobileCRM.ExposedObject = function (id) {
	        /// <summary>Represents the Javascript placeholder for exposed managed object.</summary>
	        /// <param name="id" type="Number">An id of the exposed managed object.</param>
	        /// <field name="id" type="Number">An id of the exposed managed object.</field>
	        this.id = id;
	    };
	    MobileCRM.ExposedObject.prototype.asInvokeArgument = function () {
	        /// <summary>[v9.1] Returns the exposed object reference which can be used as an argument in invokeMethod functions.</summary>
	        return "~ExpObj:#exposedObj#" + this.id;
	    };
	    MobileCRM.ExposedObject.prototype.invokeMethodAsync = function (method, paramsList, callback, errorCallback, scope) {
	        /// <summary>Invokes a method on exposed managed object and returns the result asynchronously via callback.</summary>
	        /// <param name="objectName" type="String">The name of exposed managed object as it was registered on C# side (IJavascriptBridge.ExposeObject).</param>
	        /// <param name="method" type="String">The name of the method implemented by object class.</param>
	        /// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
	        /// <param name="callback" type="function(obj)">The callback function that is called asynchronously with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("#exposedObj#" + this.id, method, paramsList, callback, errorCallback, scope);
	    };
		MobileCRM.ExposedObject.prototype.invokeMethodPromise = function (method, paramsList) {
			/// <summary>Invokes a method on exposed managed object and returns the result asynchronously via callback.</summary>
			/// <param name="objectName" type="String">The name of exposed managed object as it was registered on C# side (IJavascriptBridge.ExposeObject).</param>
			/// <param name="method" type="String">The name of the method implemented by object class.</param>
			/// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
			/// <returns type="Promise&lt;any&gt;">A Promise object which will be resolved with JSON-serialized return value. It is either generic type or <see cref="MobileCRM.ObservableObject">MobileCRM.ObservableObject</see> with JSON-serialized return value..</returns>
			return MobileCRM.bridge.invokeMethodPromise("#exposedObj#" + this.id, method, paramsList);
		};
	    MobileCRM.ExposedObject.prototype.exposeObjectAsync = function (method, paramsList) {
	        /// <summary>Exposes the managed object which is the result of the method called on this exposed object.</summary>
	        /// <param name="method" type="String">The name of the method implemented by object class.</param>
	        /// <param name="paramsList" type="Array">An array with parameters that should be passed to a method.</param>
	        /// <returns type="MobileCRM.ExposedObject">The Javascript placeholder object for exposed managed object.</returns>
	        return MobileCRM.bridge.exposeObjectAsync("#exposedObj#" + this.id + "." + method, paramsList);
	    };
	    MobileCRM.ExposedObject.prototype.release = function () {
	        /// <summary>Releases the exposed managed object.</summary>
	        MobileCRM.bridge.command("releaseExposedObject", this.id);
	    };

	    // MobileCRM.ObservableObject 
	    MobileCRM.ObservableObject = function (props) {
	        /// <summary>Represents a generic object which is monitoring the changes of its properties.</summary>
	        /// <param name="props" type="Object">Optional list of properties.</param>
	        var privChanged = {};
	        var typeInfo = {};

	        var propertyChanged = new _Event(this);
	        propertyChanged.add(function (args) {
	            privChanged[args] = true;
	        }, this);
	        Object.defineProperty(this, "propertyChanged", { value: propertyChanged, enumerable: false });
	        Object.defineProperty(this, "_privChanged", { value: privChanged, enumerable: false });
	        Object.defineProperty(this, "_typeInfo", { value: typeInfo, enumerable: false });
	        if (props) {
	            for (var i in props) {
	                this.addProp(i, true, props[i]);
	            }
	        }
	    };
	    MobileCRM.ObservableObject.prototype.addProp = function (name, writable, value) {
	        /// <summary>Creates a new observable property for this object</summary>
	        /// <param name="name" type="String">A name of the new property.</param>
	        /// <param name="writable" type="Boolean">Indicates whether the property should have setter.</param>
	        /// <param name="value" type="">An initial value.</param>
	        _addProperty(this, name, writable, value);
		};
		MobileCRM.ObservableObject.prototype.runCallback = function (callback, scope) {
			/// <summary>Invokes callback passing this instance of ObservableObject as argument.</summary>
	        /// <param name="callback" type="function">The callback function.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        /// <returns type="Object">An object clone containing all properties changed during the callback call.</returns>
			var obj = this;
			if (callback.call(scope, obj) != false) {
				var changed = obj.getChanged();
				return changed;
			}
			return '';
		}
	    MobileCRM.ObservableObject.prototype.getChanged = function () {
	        /// <summary>Creates a clone of this object containing all properties that were changed since object construction.</summary>
	        /// <remarks>This method enumerates object recursively and creates the object clone containing only the changed properties.</remarks>
	        /// <returns type="Object">An object clone containing all changed properties.</returns>
	        var parse = function (obj, changedProps) {
	            var result = undefined;
	            for (var i in obj) {
	                var val = obj[i];
	                var changedVal = undefined;
	                if (val instanceof MobileCRM.ObservableObject)
	                    changedVal = val.getChanged();
	                else if (changedProps[i] == true)
	                    changedVal = val;
	                else if (val && typeof val == "object" && !(val instanceof Date) && i[0] != '_')
	                    changedVal = parse(val, {});
	                if (changedVal !== undefined) {
	                    if (result == null) {
	                        if (obj.constructor == Array) {
	                            result = [];
	                            for (var j = 0; j < obj.length; j++)
	                                result[j] = null;
	                        }
	                        else
	                            result = {};
	                    }
	                    var propName = i;
	                    if (obj._typeInfo) {
	                        var typeInfo = obj._typeInfo[i];
	                        if (typeInfo)
	                            propName += "-" + typeInfo;
	                    }
	                    result[propName] = changedVal;
	                }
	            }
	            return result;
	        };
	        return parse(this, this._privChanged);
	    }
	    MobileCRM.ObservableObject.prototype.setTypedValue = function (propName, type, value) {
	        /// <summary>[v8.0] Sets the explicitly typed value for specified property.</summary>
	        /// <param name="propName" type="String">The name of the property which is being set.</param>
	        /// <param name="type" type="String">The fully qualified .Net type (e.g. &quot;System.String&quot; or &quot;MobileCrm.Data.IReference,MobileCrm.Data&quot;).</param>
	        /// <param name="value" type="">The value which has to be set.</param>
	        this[propName] = value;
	        this._typeInfo[propName] = type.replace(',', '-'); // Comma is not allowed by JsonReader, replace to '-'
	    };

	    //MobileCRM.Configuration
	    MobileCRM.Configuration.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the managed Configuration object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of Configuration object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(config)">The callback function that is called asynchronously with <see cref="MobileCRM.Configuration">MobileCRM.Configuration</see> object instance as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.requestObject("Configuration", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    };
	    // MobileCRM._Settings
	    MobileCRM._Settings = {
	        /// <summary>MobileCRM configuration settings class.</summary>
	        /// <field name="afterSaveReload" type="Number">Gets options for default after save behavior &quot;None = 0, New = 1,Always = 2&quot;</field>
	        /// <field name="authenticationType" type="Number">Gets possible CRM server authentication methods. &quot;AD = 0, PassPort = 1,SPLA = 2,PassportEMEA = 3,PassportAPAC = 4 &quot;</field>
	        /// <field name="businessUnitId" type="String">Gets or sets the current user's business unit id.</field>
	        /// <field name="canUsePassword" type="Boolean">Gets whether there is a valid password and whether it can be used.</field>
	        /// <field name="crm2011AuthId" type="String">Gets or sets the discovered CRM service authentication server identifier.</field>
	        /// <field name="crm2011AuthType" type="String">Gets or sets the discovered CRM service authentication server type.</field>
	        /// <field name="crm2011AuthUrl" type="String">Gets or sets the discovered CRM service authentication server url.</field>
	        /// <field name="crmOnlineDeviceToken" type="String">Gets or sets the token (cookie) issued by LiveId services identifying this device.</field>
	        /// <field name="crmOnlineDeviceTokenExpires" type="Date">Gets when CrmOnlineDeviceToken expires (UTC).</field>
	        /// <field name="crmWebServiceMinorVersion" type="Number">Gets or sets the discovered CRM service minor version (13 - for CRM 2011 Rollup 13 and up).</field>
	        /// <field name="crmWebServiceVersion" type="Number">Gets or sets the discovered CRM service version (4,5).</field>
	        /// <field name="currencyDecimalPrecision" type="Number">Gets or sets the organization Pricing Decimal Precision configuration option (0..4).</field>
	        /// <field name="currencyDisplayOption" type="Number">Gets or sets the currency field display option 0- Symbol ($), 1 - Code (USD).</field>
	        /// <field name="currencyFormatCode" type="Number">Gets or sets the currency field display option 0- $123, 1-123$, 2-$ 123, 3-123 $.</field>
	        /// <field name="customerId" type="MobileCRM.Reference">Gets or sets the customer when application is running in customer mode. <see cref="MobileCRM.Reference">MobileCRM.Reference</see> object instance as argument</field>
	        /// <field name="customerUserId" type="MobileCRM.Reference">Gets or sets the CustomerUserId when application is running in customer mode. <see cref="MobileCRM.Reference">MobileCRM.Reference</see> object instance as argument</field>
	        /// <field name="deviceFriendlyName" type="String">Gets or sets the device friendly name e.g. &quot;Steve's iPhone&quot;.</field>
	        /// <field name="deviceIdentifier" type="String">Gets or sets the hardware unique id.</field>
	        /// <field name="deviceInfo" type="String">Gets or sets the device system an hardware information e.g. &quot;Hewlett-Packard HP ProBook 6450b\tMicrosoft Windows NT 6.1.7600.0&quot;</field>
	        /// <field name="internalDeviceId" type="String">Gets the device id.</field>
	        /// <field name="disableSyncAnalyzer" type="Boolean">Gets or sets whether the synchronization should use the SyncAnalyzer step.</field>
	        /// <field name="discountCalculationMethod" type="Number">Gets or sets the option for calculating the discount 0 - apply after (Price*Quantity)-Discount , 1- apply before (Price-Discount)*Quantity.</field>
	        /// <field name="duplicateDetection" type="Number">Gets whether duplicate detection is enabled and whether to detect against the local database, online, or always online. &quot;Disabled = 0, Enabled = 1,AlwaysOnline = 2&quot;</field>
	        /// <field name="enableAdvancedFind" type="Boolean">Gets or sets whether to enabled advanced find functionality. Default true.</field>
	        /// <field name="enableListButtons" type="Boolean">Enables list buttons. Default is true.</field>
	        /// <field name="enableListSearchButtons" type="Boolean">Gets or sets whether to allow list search buttons.</field>
	        /// <field name="forceCustomizationDownload" type="Boolean">Gets or sets a value indicating whether the customization download is forced.</field>
	        /// <field name="forcedFullSyncDate" type="Date">Gets or sets the date when the device must be full synced. If the last sync was before this date, the next sync must be full.</field>
	        /// <field name="forgetPassword" type="Boolean">Gets or sets whether password can be used for next login.</field>
	        /// <field name="fullScreenForms" type="Boolean">Gets or sets whether to show forms maximized by default. Can be overridden per form in Woodford.</field>
	        /// <field name="googleEmail" type="String">Gets or sets the Google account email.</field>
	        /// <field name="gPSAccuracy" type="Number">Gets or sets the default accuracy (in meters) when resolving the current position.</field>
	        /// <field name="gPSMaxAge" type="Number">Gets or sets the default maximum age (in seconds) of the last result when resolving the current position.</field>
	        /// <field name="isOnlineCrm" type="Boolean">Gets whether the last login was for a CRM Online instance.</field>
	        /// <field name="maxAttachmentSize" type="Number">Gets or sets the maximum attachment size to sync (in bytes).</field>
	        /// <field name="onlineNoLock" type="Boolean">Gets or sets whether to use "no-lock" in fetchXml during online mode.</field>
	        /// <field name="organizationId" type="String">Gets or sets the current user's organization id (given by the server).</field>
	        /// <field name="saveBehavior" type="Number">Gets options for default after save behavior &quot;Default = 0, SaveOnly = 1,SaveAndClose = 2&quot;</field>
	        /// <field name="saveSignatureAsImage" type="Boolean">Gets or sets whether to store signature attachments as SVG (vector) or PNG (image).</field>
	        /// <field name="serverHostName" type="String">Gets the server host name.</field>
	        /// <field name="serverSettingsVersion" type="String">Gets the version of the settings file as send with the customization.</field>
	        /// <field name="serverVersion" type="Number">Gets or sets the server version, either 4 for CRM 4.0 or 5 for CRM 2011.</field>
	        /// <field name="showPersonalContacts" type="Boolean">Gets or sets whether to show contacts from the user's personal address book.</field>
	        /// <field name="showSystemCalendars" type="Boolean">Gets or sets whether to show private calendars in calendars.</field>
	        /// <field name="systemUserId" type="String">Gets or sets the current user id (given by the server).</field>
	        /// <field name="teams" type="Array<String>">Gets the array of ids of teams the current user is member of.</field>
	        /// <field name="useCrmEmail" type="Boolean">Gets or sets whether to create a CRM email entity or use the platform email service.</field>
	        /// <field name="useDatabaseBlobStore" type="Boolean">Gets or sets whether to store attachment blobs in database or in files. If you change this setting you must perform a full sync!</field>
	        /// <field name="useFlexiForms" type="Boolean">Gets or sets whether flexi forms (New UI).</field>
	        /// <field name="googleApiKey" type="String">Gets or sets the google API key.</field>
	    }

	    MobileCRM.CultureInfo.currentCulture = null;
	    MobileCRM.CultureInfo.initialize = function (callback, errorCallback, scope) {
	        /// <summary>[v10.2] Initializes the CultureInfo object.</summary>
	        /// <remarks><p>Method loads the current culture information asynchronously and calls either the <b>errorCallback</b> with error message or the <b>callback</b> with initialized CultureInfo object.</p><p>All other functions will return the default or empty string before the initialization finishes.</p></remarks>
	        /// <param name="callback" type="function(currentCulture)">The callback function that is called asynchronously with initialized CultureInfo object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is to be called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("getCultureInfo", '', function (res) {
	            MobileCRM.CultureInfo.currentCulture = res;
	            if (callback)
	                callback.call(scope, res);
	        }, errorCallback, scope);
	    }
		MobileCRM.CultureInfo.initializeAsync = function () {
			/// <summary>[v10.2] Initializes the CultureInfo object.</summary>
			/// <remarks><p>Method loads the current culture information asynchronously.</p><p>All other functions will return the default or empty string before the initialization promise is resolved.</p></remarks>
			/// <returns type="Promise&lt;MobileCRM.CultureInfo&gt;">A Promise object which will be resolved with the loaded CultureInfo object.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.CultureInfo.initialize(resolve, function (err) { reject(new Error(err)); });
			});
		}

		MobileCRM.CultureInfo.load = function (culture, callback, errorCallback, scope) {
			/// <summary>[v10.2] Asynchronously gets the CultureInfo object for specified language/country.</summary>
			/// <param name="culture" type="String">The name of culture that has to be loaded. The culture name is in the format language code-country where language code is a lowercase two-letter code derived from ISO 639-1. country is derived from ISO 3166 and usually consists of two uppercase letters</param>
			/// <param name="callback" type="function(cultureInfo)">The callback function that is called asynchronously with initialized CultureInfo object as argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is to be called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.command("getCultureInfo", culture || '', function (res) {
				if (callback)
					callback.call(scope, res);
			}, errorCallback, scope);
		};
		MobileCRM.CultureInfo.loadAsync = function (culture) {
			/// <summary>[v10.2] Asynchronously gets the CultureInfo object for specified language/country.</summary>
			/// <param name="culture" type="String">The name of culture that has to be loaded. The culture name is in the format language code-country where language code is a lowercase two-letter code derived from ISO 639-1. country is derived from ISO 3166 and usually consists of two uppercase letters</param>
			/// <returns type="Promise&lt;MobileCRM.CultureInfo&gt;">A Promise object which will be resolved with the loaded CultureInfo object.</returns>
			return MobileCRM.bridge.invokeCommandPromise("getCultureInfo", culture || '');
		};

	    MobileCRM.CultureInfo.shortDateString = function (date) {
	        /// <summary>[v10.2] Returns the short date string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.shortDatePattern)
	    };

	    MobileCRM.CultureInfo.longDateString = function (date) {
	        /// <summary>[v10.2] Returns the long date string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.longDatePattern)
	    };

	    MobileCRM.CultureInfo.shortTimeString = function (date) {
	        /// <summary>[v10.2] Returns the short time string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.shortTimePattern)
	    };

	    MobileCRM.CultureInfo.longTimeString = function (date) {
	        /// <summary>[v10.2] Returns the long time string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.longTimePattern)
	    };

	    MobileCRM.CultureInfo.fullDateTimeString = function (date) {
	        /// <summary>[v10.2] Returns the date and time string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.fullDateTimePattern)
	    };

	    MobileCRM.CultureInfo.monthDayString = function (date) {
	        /// <summary>[v10.2] Returns the month and day string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.monthDayPattern)
	    };

	    MobileCRM.CultureInfo.yearMonthString = function (date) {
	        /// <summary>[v10.2] Returns the year and month string that matches current device culture.</summary>
	        /// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
	        /// <param name="date" type="Date">A date being formatted.</param>
	        return MobileCRM.CultureInfo.formatDate(date, MobileCRM.CultureInfo.currentCulture.dateTimeFormat.yearMonthPattern)
	    };

		MobileCRM.CultureInfo.formatDate = function (date, format) {
			/// <summary>[v10.2] Returns the formatted date/time string that matches current device culture.</summary>
			/// <remarks>This method fails if <see cref="MobileCRM.CultureInfo.initialize">CultureInfo.initialize</see> method hasn't completed yet.</remarks>
			/// <param name="date" type="Date">A date being formatted.</param>
			/// <param name="format" type="String">Custom format string that meets the <see cref="https://docs.microsoft.com/en-us/dotnet/standard/base-types/custom-date-and-time-format-strings">MSDN Sepcification</see>.</param>
			var df = MobileCRM.CultureInfo.currentCulture.dateTimeFormat;
			var zeroPad = function (num, length, dontCut) {
				var st = "" + num;
				if (st.length > length)
					return dontCut ? st : st.substr(0, length);
				while (st.length < length)
					st = "0" + st;
				return st;
			};
			var trimDigits = function (num, length) {
				var st = "" + num;
				if (st.length > length)
					return st.substr(0, length);
				return st;
			};
			var hoursTo12h = function (h) {
				return h <= 12 ? h : (h % 12);
			};
			var i = 0;
			var fLen = format.length;
			var res = "";
			while (i < fLen) {
				var c = format.charAt(i);
				switch (c) {
					case 'd': // Day
						if (format.charAt(++i) === 'd') {
							if (format.charAt(++i) === 'd') {
	    						if (format.charAt(++i) === 'd') {
	    							res += df.dayNames[date.getDay()];
	    							i++;
	    						}
	    						else
	    							res += df.abbreviatedDayNames[date.getDay()];
	    					}
	    					else
	    						res += zeroPad(date.getDate(), 2, false);
	    				} else
	    					res += date.getDate();
	    				break;
	    			case 'f':
	    				if (format.charAt(++i) === 'f') {
	    					if (format.charAt(++i) === 'f') {
	    						if (format.charAt(++i) === 'f') {
	    							if (format.charAt(++i) === 'f') {
	    								if (format.charAt(++i) === 'f') {
	    									if (format.charAt(++i) === 'f') {
	    										res += date.getMilliseconds();
	    										i++;
	    									}
	    									else
	    										res += date.getMilliseconds();
	    								}
	    								else
	    									res += date.getMilliseconds();
	    							}
	    							else
	    								res += date.getMilliseconds();
	    						}
	    						else
	    							res += date.getMilliseconds();
	    					}
	    					else
	    						res += trimDigits(date.getMilliseconds(), 2);
	    				}
	    				else
	    					res += trimDigits(date.getMilliseconds(), 1);
	    				break;
	    			case 'F':
	    				if (format.charAt(++i) === 'F') {
	    					if (format.charAt(++i) === 'F') {
	    						if (format.charAt(++i) === 'F') {
	    							if (format.charAt(++i) === 'F') {
	    								if (format.charAt(++i) === 'F') {
	    									if (format.charAt(++i) === 'F') {
	    										res += zeroPad(date.getMilliseconds(), 7, false);
	    										i++;
	    									}
	    									else
	    										res += zeroPad(date.getMilliseconds(), 6, false);
	    								}
	    								else
	    									res += zeroPad(date.getMilliseconds(), 5, false);
	    							}
	    							else
	    								res += zeroPad(date.getMilliseconds(), 4, false);
	    						}
	    						else
	    							res += zeroPad(date.getMilliseconds(), 3, false);
	    					}
	    					else
	    						res += zeroPad(date.getMilliseconds(), 2, false);
	    				}
	    				else
	    					res += zeroPad(date.getMilliseconds(), 1, false);
	    				break;
	    			case 'g':
	    				if (format.charAt(++i) === 'g') {
	    					res += "A.D.";
	    					i++;
	    				}
	    				else
	    					res += "AD";
	    				break;
	    			case 'h':
	    				if (format.charAt(++i) === 'h') {
	    					res += zeroPad(hoursTo12h(date.getHours()), 2, false);
	    					i++;
	    				}
	    				else
	    					res += hoursTo12h(date.getHours());
	    				break;
	    			case 'H':
	    				if (format.charAt(++i) === 'H') {
	    					res += zeroPad(date.getHours(), 2, false);
	    					i++;
	    				}
	    				else
	    					res += date.getHours();
	    				break;
	    			case 'K':
	    				var o = -date.getTimezoneOffset();
	    				res += (o < 0 ? "-" : "") + zeroPad(Math.abs(o / 60), 2, false) + ":" + zeroPad(o % 60, 2, false);
	    				i++;
	    				break;
	    			case 'm':
	    				if (format.charAt(++i) === 'm') {
	    					res += zeroPad(date.getMinutes(), 2, false);
	    					i++;
	    				}
	    				else
	    					res += date.getMinutes();
	    				break;
	    			case 's':
	    				if (format.charAt(++i) === 's') {
	    					res += zeroPad(date.getSeconds(), 2, false);
	    					i++;
	    				}
	    				else
	    					res += date.getSeconds();
	    				break;
	    			case 'M':
	    				if (format.charAt(++i) === 'M') {
	    					if (format.charAt(++i) === 'M') {
	    						if (format.charAt(++i) === 'M') {
	    							res += df.monthGenitiveNames[date.getMonth()];
	    							i++;
	    						}
	    						else
	    							res += df.abbreviatedMonthGenitiveNames[date.getMonth()];
	    					}
	    					else
	    						res += zeroPad(date.getMonth() + 1, 2, false);
	    				} else
	    					res += date.getMonth() + 1;
	    				break;
	    			case 't':
	    				if (format.charAt(++i) === 't')
	    					i++;

	    				res += date.getHours() < 12 ? df.aMDesignator : df.pMDesignator;
	    				break;
	    			case 'y':
	    				if (format.charAt(++i) === 'y') {
	    					if (format.charAt(++i) === 'y') {
	    						if (format.charAt(++i) === 'y') {
	    							if (format.charAt(++i) === 'y') {
	    								res += zeroPad(date.getFullYear(), 5, true);
	    								i++;
	    							}
	    							else
	    								res += zeroPad(date.getFullYear(), 4, true);
	    						}
	    						else
	    							res += zeroPad(date.getFullYear(), 3, true);
	    					} else
	    						res += zeroPad(date.getFullYear() % 100, 2, false);
	    				}
	    				else
	    					res += date.getFullYear() % 100;
	    				break;
	    			case 'z':
	    				if (format.charAt(++i) === 'z') {
	    					var o = -date.getTimezoneOffset();
	    					if (format.charAt(++i) === 'z') {
	    						res += (o < 0 ? "-" : "") + zeroPad(Math.abs(o / 60), 2, false) + ":" + zeroPad(o % 60, 2, false);
	    						i++;
	    					}
	    					else
	    						res += (o < 0 ? "-" : "") + zeroPad(Math.abs(o / 60), 2, false);
	    				}
	    				else
	    					res += -date.getTimezoneOffset() / 60;
	    			case '/':
	    				res += (typeof (df.dateSeparator) == "string") ? df.dateSeparator : '/';
	    				i++;
	    				break;
	    			case ':':
	    				res += (typeof (df.timeSeparator) == "string") ? df.timeSeparator : ':';
	    				i++;
	    				break;
	    			default:
	    				res += c;
	    				i++;
	    				break;
				}
			}
			return res;
		};

	    //MobileCRM.Localization
	    MobileCRM.Localization.initialize = function (callback, errorCallback, scope) {
	        /// <summary>Initializes the Localization object.</summary>
	        /// <remarks><p>Method loads the string table asynchronously and calls either the <b>errorCallback</b> with error message or the <b>callback</b> with initialized Localization object.</p><p>All other functions will return the default or empty string before the initialization finishes.</p></remarks>
	        /// <param name="callback" type="function(config)">The callback function that is called asynchronously with initialized Localization object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is to be called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.Localization.initializeEx(null, callback, errorCallback, scope);
	    };
	    MobileCRM.Localization.initializeEx = function (regularExpression, callback, errorCallback, scope) {
	        /// <summary>[v10.0] Initializes the Localization object.</summary>
	        /// <remarks><p>Method loads the string table asynchronously and calls either the <b>errorCallback</b> with error message or the <b>callback</b> with initialized Localization object.</p><p>All other functions will return the default or empty string before the initialization finishes.</p></remarks>
	        /// <param name="regularExpression" type="string">The regular expression defining a subset of localization keys. Refer to <see cref="https://msdn.microsoft.com/en-us/library/az24scfc(v=vs.110).aspx">Regular Expression Language - Quick Reference</see>. Set to null to obtain whole localization.</param>
	        /// <param name="callback" type="function(config)">The callback function that is called asynchronously with initialized Localization object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is to be called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("localizationInit", regularExpression || '', function (res) {
	            MobileCRM.Localization.stringTable = res;
	            MobileCRM.Localization.initialized = true;
	            if (callback)
	                callback.call(scope, MobileCRM.Localization);
	        }, errorCallback, scope);
	    };
		MobileCRM.Localization.initializeAsync = function (regularExpression) {
			/// <summary>[v10.0] Initializes the Localization object.</summary>
			/// <remarks><p>Method loads the string table asynchronously and resolves pending promise with initialized Localization object.</p><p>All other functions will return the default or empty string before the initialization finishes.</p></remarks>
			/// <param name="regularExpression" type="string">Optional regular expression defining a subset of localization keys. Refer to <see cref="https://msdn.microsoft.com/en-us/library/az24scfc(v=vs.110).aspx">Regular Expression Language - Quick Reference</see>. Set to null to obtain whole localization.</param>
			/// <returns type="Promise&lt;MobileCRM.Localization&gt;">A Promise object which will be resolved with initialized Localization object as argument.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.Localization.initializeEx(regularExpression, resolve, function (err) { reject(new Error(err)); });
			});
		};
	    MobileCRM.Localization.getLoadedLangId = function (callback, errorCallback, scope) {
	        /// <summary>Asynchronously gets currently loaded localization language.</summary>
	        /// <remarks>The default language is &quot;en-US&quot;.</remarks>
	        /// <param name="callback" type="function(langId)">The callback function that is called asynchronously with currently loaded localization language as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is to be called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Localization", "get_LoadedLangId", [], callback, errorCallback, scope);
	    };
	    MobileCRM.Localization.getTextOrDefault = function (id, defaultString) {
	        /// <summary>Gets the display string for the passed id, or the passed default string if a string with the passed id doesn't exists.</summary>
	        /// <param name="id" type="String">Display string id.</param>
	        /// <param name="defaultString" type="String">Default display string.</param>
	        /// <returns type="String">Human readable string label.</returns>
	        return MobileCRM.Localization.stringTable[id] || defaultString;
	    };
	    MobileCRM.Localization.getComponentLabel = function (entityName, componentType, viewName) {
	        /// <summary>Gets the display string for the passed entity and component (view, form) id.</summary>
	        /// <param name="entityName" type="String">The entity logical name.</param>
	        /// <param name="componentType" type="String">The component type. (View, DetailView).</param>
	        /// <param name="viewName" type="String">The component id</param>
	        /// <returns type="String">The component label.</returns>
	        return MobileCRM.Localization.stringTable[entityName + "." + componentType + "." + viewName] || MobileCRM.Localization.stringTable[componentType + "." + viewName] || viewName;
	    }
	    MobileCRM.Localization.get = function (id) {
	        /// <summary>Gets the display string for the passed id.</summary>
	        /// <param name="id" type="String">Display string id.</param>
	        /// <returns type="String">Human readable string label.</returns>
	        return MobileCRM.Localization.getTextOrDefault(id, id);
	    }
	    MobileCRM.Localization.getPlural = function (id) {
	        /// <summary>Gets the plural version of the display string for the passed id.</summary>
	        /// <param name="id" type="String">Display string id.</param>
	        /// <returns type="String">Human readable plural string label.</returns>
	        return MobileCRM.Localization.get(id + "+s");
	    }
	    MobileCRM.Localization.makeId = function (section, id) {
	        /// <summary>Creates an absolute id from section and id.</summary>
	        /// <param name="section" type="String">The section id.</param>
	        /// <param name="id" type="String">Display string id.</param>
	        /// <returns type="String">Absolute id.</returns>
	        return section + "." + id;
	    }

	    //MobileCRM.Reference
	    MobileCRM.Reference.prototype.toString = function () {
	        /// <summary>Prints the reference primary name into string.</summary>
	        /// <returns type="String">A string with primary name of this entity reference.</returns>
	        return this.primaryName;
	    }
	    MobileCRM.Reference.loadById = function (entityName, id, success, failed, scope) {
	        /// <summary>Asynchronously loads the CRM reference.</summary>
	        /// <param name="entityName" type="String">An entity name</param>
	        /// <param name="id" type="String">The reference ID.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry an instance of <see cref="MobileCRM.Reference">MobileCRM.Reference</see> object.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('referenceload', JSON.stringify({ entity: entityName, id: id }), success, failed, scope);
	    };
		MobileCRM.Reference.loadAsync = function (entityName, id) {
			/// <summary>Asynchronously loads the CRM reference.</summary>
			/// <param name="entityName" type="String">An entity name</param>
			/// <param name="id" type="String">The reference ID.</param>
			/// <returns type="Promise&lt;MobileCRM.Reference&gt;">A Promise object which will be resolved with an instance of Reference object representing entity record reference.</returns>
			return MobileCRM.bridge.invokeCommandPromise('referenceload', JSON.stringify({ entity: entityName, id: id }));
		};

	    // MobileCRM.ManyToManyReference
	    MobileCRM.ManyToManyReference.addRecord = function (entityName, ref1, ref2, create, success, failed, scope) {
	        /// <summary>Adds or removes an N-N relationship record between the two passed entities.</summary>
	        /// <param name="entityName" type="String">The relationship entity name.</param>
	        /// <param name="ref1" type="MobileCRM.Reference">First entity instance.</param>
	        /// <param name="ref2" type="MobileCRM.Reference">Second entity instance.</param>
	        /// <param name="create" type="Boolean">Whether to create or delete the relationship record.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('addManyToManyReference', JSON.stringify({ entityName: entityName, ref1: ref1, ref2: ref2, create: create }), success, failed, scope);
	    };
	    MobileCRM.ManyToManyReference.create = function (entityName, ref1, ref2, success, failed, scope) {
	        /// <summary>Creates a new N-N relationship between the two passed entities.</summary>
	        /// <remarks>New relationship is created either in local database or using the online request. It depends on current application mode.</remarks>
	        /// <param name="entityName" type="String">The relationship entity name.</param>
	        /// <param name="ref1" type="MobileCRM.Reference">First entity instance.</param>
	        /// <param name="ref2" type="MobileCRM.Reference">Second entity instance.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.ManyToManyReference.addRecord(entityName, ref1, ref2, true, success, failed, scope);
	    };
	    MobileCRM.ManyToManyReference.remove = function (entityName, ref1, ref2, success, failed, scope) {
	        /// <summary>Removes an existing N-N relationship between the two passed entities.</summary>
	        /// <remarks>Relationship is removed either from local database or using the online request. It depends on current application mode.</remarks>
	        /// <param name="entityName" type="String">The relationship entity name.</param>
	        /// <param name="ref1" type="MobileCRM.Reference">First entity instance.</param>
	        /// <param name="ref2" type="MobileCRM.Reference">Second entity instance.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.ManyToManyReference.addRecord(entityName, ref1, ref2, false, success, failed, scope);
	    };

	    // MobileCRM.DynamicEntity
	    _inherit(MobileCRM.DynamicEntity, MobileCRM.Reference);

	    MobileCRM.DynamicEntity.legacyPropsSerialization = false; // serves to disable the legacy fields serialization (bool/string issue) 

	    MobileCRM.DynamicEntity.createNew = function (entityName, id, primaryName, properties) {
	        /// <summary>Creates the MobileCRM.DynamicEntity object representing new entity.</summary>
	        /// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="primaryName" type="String">The human readable name of the entity, e.g "Alexandro".</param>
	        /// <param name="properties" type="Object">An object with entity properties, e.g. {firstname:"Alexandro", lastname:"Puccini"}.</param>
	        var entity = new MobileCRM.DynamicEntity(entityName, id, primaryName, properties);
	        entity.isNew = true;
	        return entity;
	    }
	    MobileCRM.DynamicEntity.deleteById = function (entityName, id, success, failed, scope) {
	        /// <summary>Asynchronously deletes the CRM entity.</summary>
	        /// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="success" type="function()">A callback function for successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var request = { entity: entityName, id: id };
	        var cmdParams = JSON.stringify(request);
	        MobileCRM.bridge.command('entitydelete', cmdParams, success, failed, scope);
	    };
		MobileCRM.DynamicEntity.deleteAsync = function (entityName, id) {
			/// <summary>Asynchronously deletes the CRM entity.</summary>
			/// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
			/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
			/// <returns type="Promise&lt;void&gt;">A Promise object which will be resolved after the entity record is deleted.</returns>
			var request = { entity: entityName, id: id };
			var cmdParams = JSON.stringify(request);
			return MobileCRM.bridge.invokeCommandPromise('entitydelete', cmdParams);
		};
	    MobileCRM.DynamicEntity.loadById = function (entityName, id, success, failed, scope) {
	        /// <summary>Asynchronously loads the CRM entity properties.</summary>
	        /// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the MobileCRM.DynamicEntity object.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('entityload', JSON.stringify({ entity: entityName, id: id }), success, failed, scope);
	    };
		MobileCRM.DynamicEntity.loadAsync = function (entityName, id) {
			/// <summary>Asynchronously loads the CRM entity properties.</summary>
			/// <param name="entityName" type="String">The logical name of the entity, e.g. "account".</param>
			/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
			/// <returns type="Promise&lt;MobileCRM.DynamicEntity&gt;">A Promise object which will be resolved with an instance of DynamicEntity object representing entity record.</returns>
			return MobileCRM.bridge.invokeCommandPromise('entityload', JSON.stringify({ entity: entityName, id: id }));
		};

		MobileCRM.DynamicEntity.saveMultiple = function (updatedEntities, online, sucessCallback, failureCallback, scope) {
			/// <summary>Saves an entities instances to storage.Where the entity is stored is determined by how it was loaded: online / offline.</summary>
			/// <param name="updatedEntities" type="MobileCRM.DynamicEntity[]">Array of MobileCRM.DynamicEntity.</param>
			/// <param name="online" type="Boolean">Whether to load and save online or offline. Null for default mode defined by current configuration.</param>
			/// <param name="sucessCallbacak" type="function(result)">A callback function for successful asynchronous result.</param>
			/// <param name="failureCallback" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

			MobileCRM.DynamicEntity._executeMultiple(online, updatedEntities, null, sucessCallback, failureCallback, scope);
		};
		MobileCRM.DynamicEntity.deleteMultiple = function (deletedEntities, online, sucessCallback, failureCallback, scope) {
			/// <summary>Saves an entity instance to storage.Where the entity is stored is determined by how it was loaded: online / offline.</summary>
			/// <param name="deletedEntities" type="MobileCRM.DynamicEntity[]">Array of MobileCRM.DynamicEntity or MobileCRM.Reference what will be deleted.</param>
			/// <param name="sucessCallbacak" type="function(result)">A callback function for successful asynchronous result.</param>
			/// <param name="failureCallback" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="online" type="Boolean">Whether to load and save online or offline. Null for default mode defined by current configuration.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

			MobileCRM.DynamicEntity._executeMultiple(online, null, deletedEntities, sucessCallback, failureCallback, scope);
		};

		MobileCRM.DynamicEntity._executeMultiple = function (online, updateEntities, deleteEntities, sucessCallback, failureCallback, scope) {
			var data = {
				updateEntities: null,
				deleteEntities: null,
				online: online
			};

			if (updateEntities) {
				data.updateEntities = [];
				for (var ue in updateEntities) {
					data.updateEntities.push("" + JSON.stringify(updateEntities[ue]) + "");
				}
			}
			else if (deleteEntities) {
				data.deleteEntities = [];
				for (var de in deleteEntities) {
					var entity = deleteEntities[de];
					data.deleteEntities.push(JSON.stringify({ entity: entity.entityName, id: entity.id }));
				}
			}

			MobileCRM.bridge.command('executeMultiple', JSON.stringify(data), sucessCallback, failureCallback, scope);
		};

	    MobileCRM.DynamicEntity.saveDocumentBody = function (entityId, entityName, relationship, filePath, mimeType, success, failed, scope) {
	        /// <summary>[v10.0]Asynchronously saves the document body for specified entity.</summary>
	        /// <remarks>Function sends an asynchronous request to application, where the locally stored document body (e.g. the annotation.documentbody) is saved.</remarks>
	        /// <param name="entityId" type="String">GUID of the existing entity or &quot;null&quot; for new one.</param>
	        /// <param name="entityName" type="String">The logical name of the entity; optional, default is &quot;annotation&quot;.</param>
	        /// <param name="relationship" type="MobileCRM.Relationship">The relationship with parent object.</param>
	        /// <param name="filePath" type="String">Absolute or app data-relative path to the file holding the body.</param>
	        /// <param name="mimeType" type="String">MimeType of the content, optional.</param>
	        /// <param name="success" type="function(MobileCRM.Reference)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the <see cref="MobileCRM.Reference">Reference</see> to updated/created entity.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('documentBodysave', JSON.stringify({ entity: entityName, id: entityId, relationship: relationship, filePath: filePath, mimeType: mimeType }), success, failed, scope);
	    };
		MobileCRM.DynamicEntity.saveDocumentBodyAsync = function (entityId, entityName, relationship, filePath, mimeType) {
			/// <summary>[v10.0]Asynchronously saves the document body for specified entity.</summary>
			/// <remarks>Function sends an asynchronous request to application, where the locally stored document body (e.g. the annotation.documentbody) is saved.</remarks>
			/// <param name="entityId" type="String">GUID of the existing entity or &quot;null&quot; for new one.</param>
			/// <param name="entityName" type="String">The logical name of the entity; optional, default is &quot;annotation&quot;.</param>
			/// <param name="relationship" type="MobileCRM.Relationship">The relationship with parent object.</param>
			/// <param name="filePath" type="String">Absolute or app data-relative path to the file holding the body.</param>
			/// <param name="mimeType" type="String">MimeType of the content, optional.</param>
			/// <returns type="Promise&lt;MobileCRM.Reference&gt;">A Promise object which will be resolved with the <see cref="MobileCRM.Reference">Reference</see> object representing updated/created entity.</returns>
			return MobileCRM.bridge.invokeCommandPromise('documentBodysave', JSON.stringify({ entity: entityName, id: entityId, relationship: relationship, filePath: filePath, mimeType: mimeType }));
		};
	    MobileCRM.DynamicEntity.loadDocumentBody = function (entityName, id, success, failed, scope) {
	        /// <summary>Asynchronously loads the document body for specified entity.</summary>
	        /// <remarks>Function sends an asynchronous request to application, where the locally stored document body (e.g. the annotation.documentbody) is encoded to base64 and sent back to the Javascript callback. This function supports both online data and the data stored in local database/BLOB store.</remarks>
	        /// <param name="entityName" type="String">The logical name of the entity, in most cases "annotation".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the string with base64-encoded data.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('documentBodyload', JSON.stringify({ entity: entityName, id: id }), success, failed, scope);
	    };
		MobileCRM.DynamicEntity.loadDocumentBodyAsync = function (entityName, id) {
			/// <summary>Asynchronously loads the document body for specified entity.</summary>
			/// <remarks>Function sends an asynchronous request to application, where the locally stored document body (e.g. the annotation.documentbody) is encoded to base64 and pending Javascript promise is resolved. This function supports both online data and the data stored in local database/BLOB store.</remarks>
			/// <param name="entityName" type="String">The logical name of the entity, in most cases "annotation".</param>
			/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with base64-encoded data string.</returns>
			return MobileCRM.bridge.invokeCommandPromise('documentBodyload', JSON.stringify({ entity: entityName, id: id }));
		};
	    MobileCRM.DynamicEntity.unzipDocumentBody = function (entityName, id, targetDir, success, failed, scope) {
	        /// <summary>[v9.1] Asynchronously unpacks the document body (assumes it's a zip file) for specified entity.</summary>
	        /// <param name="entityName" type="String">The logical name of the entity, in most cases the "annotation".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="targetDir" type="String">The relative path of the target directory within the application storage.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the string with base64-encoded data.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command('documentBodyUnzip', targetDir + ';' + JSON.stringify({ entity: entityName, id: id }), success, failed, scope);
	    };
	    MobileCRM.DynamicEntity.downloadAttachment = function (entityName, id, success, failed, scope) {
	        /// <summary>[v9.1] Initiates the attachment download for specified entity.</summary>
	        /// <remarks>Function sends an asynchronous request to application, which downloads the document body (e.g. the annotation) from server and sends it back to the Javascript callback.</remarks>
	        /// <param name="entityName" type="String">The logical name of the entity, in most cases "annotation".</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the string with base64-encoded data.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

	        MobileCRM.bridge.command("downloadAttachment", JSON.stringify({ entity: entityName, id: id }), success, failed, scope);
		}
		MobileCRM.DynamicEntity.downloadAttachmentAsync = function (entityName, id) {
			/// <summary>[v9.1] Initiates the attachment download for specified entity.</summary>
			/// <remarks>Function sends an asynchronous request to application, which downloads the document body (e.g. the annotation) from server and resolves pending Javascript promise.</remarks>
			/// <param name="entityName" type="String">The logical name of the entity, in most cases "annotation".</param>
			/// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with base64-encoded data string.</returns>

			return MobileCRM.bridge.invokeCommandPromise("downloadAttachment", JSON.stringify({ entity: entityName, id: id }));
		}
	    MobileCRM.DynamicEntity.prototype.save = function (callback, forceMode) {
	        /// <summary>Performs the asynchronous CRM create/modify entity command.</summary>
	        /// <param name="callback" type="function(err)">A callback function for asynchronous result. The <b>err</b> argument will carry the error message or null in case of success. The callback is called in scope of DynamicEntity object which is being saved.</param>
	        /// <param name="forceMode" type="Boolean">[v10.0.2] Optional parameter which forces online/offline mode for saving. Set &quot;true&quot; to save entity online; &quot;false&quot; to save it offline. Any other value (including &quot;undefined&quot;) causes entity tobe saved in currently selected application offline/online mode.</param>
	        var props = this.properties;
	        if (props._privVals)
	            props = props._privVals;
	        var request = { entity: this.entityName, id: this.id, properties: props, isNew: this.isNew, isOnline: this.isOnline };
	        if (forceMode === true || forceMode === false)
				request.isOnlineForce = forceMode;
			if (this.forceDirty)
				request.forceDirty = this.forceDirty;
	        var cmdParams = JSON.stringify(request);
	        var self = this;
	        window.MobileCRM.bridge.command('entitysave', cmdParams,
						function (res) {
						    self.id = res.id;
						    self.isNew = false;
						    self.isOnline = res.isOnline;
						    self.primaryName = res.primaryName;
						    self.properties = res.properties;
						    callback.call(self, null);
						},
						function (err) {
						    callback.call(self, err);
						}, null);
	        return this;
	    };

		MobileCRM.DynamicEntity.prototype.saveAsync = function (forceMode) {
			/// <summary>Performs the asynchronous CRM create/modify entity command.</summary>
			/// <param name="forceMode" type="Boolean">Optional parameter which forces online/offline mode for saving. Set &quot;true&quot; to save entity online; &quot;false&quot; to save it offline. Any other value (including &quot;undefined&quot;) causes entity to be saved in currently selected application offline/online mode.</param>
			/// <returns type="Promise&lt;DynamicEntity&gt;">A Promise object which will be resolved with saved DynamicEntity object as result.</returns>
			var _this = this;
			return new Promise(function (resolve, reject) {
				_this.save(function (err) {
					if (err)
						reject(new Error(err));
					else
						resolve(this);
				}, forceMode);
			});
		};

	    // MobileCRM.Metadata
	    MobileCRM.Metadata.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the Metadata object containing the list of MetaEntities which are enabled for current mobile project.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of Metadata object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(metadata)">The callback function which is called asynchronously with serialized EntityForm object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("Metadata", function (obj) {
	            if (obj) {
	                MobileCRM.Metadata.entities = obj;
	            }
	            callback.call(scope, MobileCRM.Metadata);
	            return '';
	        }, errorCallback, scope);
	    }

	    MobileCRM.Metadata.getEntity = function (name) {
	        /// <summary>Gets the MetaEntity object describing the entity attributes.</summary>
	        /// <remarks>It&apos;s required to request the Metadata object prior to using this object. See <see cref="MobileCRM.Metadata.requestObject">MobileCRM.Metadata.requestObject</see>.</remarks>
	        /// <param name="name" type="String">A name of MetaEntity.</param>
	        /// <returns type="MobileCRM.MetaEntity">A <see cref="MobileCRM.MetaEntity">MobileCRM.MetaEntity</see> object or "undefined".</returns>
	        return MobileCRM.Metadata.entities[name];
	    };

	    MobileCRM.Metadata.getActivities = function () {
	        /// <summary>Gets the list of activities.</summary>
	        /// <remarks>It&amp;s required to request the Metadata object prior to using this object. See <see cref="MobileCRM.Metadata.requestObject">MobileCRM.Metadata.requestObject</see>.</remarks>
	        /// <returns type="Array">An array of entity names.</returns>
	        var arr = [];
	        var metaEntities = MobileCRM.Metadata.entities;
	        for (var entity in metaEntities) {
	            var meta = metaEntities[entity];
	            if (meta && meta.isEnabled && meta.canRead() && (meta.attributes & 0x10) != 0)
	                arr.push(meta.name);
	        }
	        return arr;
	    };

	    MobileCRM.Metadata._childParentMap = { invoicedetail: "invoice", quotedetail: "quote", salesorderdetail: "salesorder", opportunityproduct: "opportunity", uom: "uomschedule", productpricelevel: "pricelevel", discount: "discounttype", contractdetail: "contract", salesliteratureitem: "salesliterature", queueitem: "queue", activitymimeattachment: "email" };
	    MobileCRM.Metadata.getEntityParent = function (childEntityName) {
	        /// <summary>Gets the entity&#39;s parent entity name.</summary>
	        /// <param name="childEntityName" type="String">The entity name.</param>
	        /// <returns type="String">The parent entity name, or "undefined" if N/A.</returns>
	        return MobileCRM.Metadata._childParentMap[childEntityName];
	    };

	    MobileCRM.Metadata.entityHasChildren = function (entityName) {
	        /// <summary>Gets whether the passed entity has child entities.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <returns type="Boolean">True if the entity is a parent, false otherwise.</returns>
	        return "undefined" != typeof MobileCRM.Metadata._childParentMap[entityName];
	    };
	    MobileCRM.Metadata.getOptionSetValues = function (entityName, optionSetName, callback, errorCallback, scope) {
	        /// <summary>Asynchronously gets the list of values for given CRM OptionSet.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="optionSetName" type="String">The OptionSet name.</param>
	        /// <param name="callback" type="function(optionSetValues)">The callback function that is called asynchronously with option set values object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var fn = function () {
	            var result = {};
	            var stringTable = MobileCRM.Localization.stringTable;
	            var searchVal = entityName + '.' + optionSetName + '.';
	            var searchValLen = searchVal.length;
	            for (var i in stringTable) {
	                if (i && i.substr(0, searchValLen) == searchVal) {
	                    var val = parseInt(i.substr(searchValLen), 10);
	                    if (val > 0) {
	                        var st = stringTable[i];
	                        result[st] = val;
	                    }
	                }
	            }
	            callback.call(scope, result);
	        };
	        if (MobileCRM.Localization.initialized)
	            fn();
	        else
	            MobileCRM.Localization.initialize(fn, errorCallback, scope);
	    };
	    MobileCRM.Metadata.getStringListOptions = function (entityName, propertyName) {
	        /// <summary>Gets the list of options for the string list property.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="propertyName" type="String">The string list property name.</param>
	        var options = {};
	        var keyPrefix = entityName + "." + propertyName + ".";
	        for(var key in MobileCRM.Localization.stringTable)
	        {
	            var label = MobileCRM.Localization.stringTable[key];
	            if(key.substring(0, keyPrefix.length) === keyPrefix) {
	                options[key] = label;
	            }
	        }
	        return options;
	    }

	    // MobileCRM.MetaEntity
	    _inherit(MobileCRM.MetaEntity, MobileCRM.ObservableObject);

	    MobileCRM.MetaEntity.loadByName = function (name, callback, errorCallback, scope) {
	        /// <summary>Gets the MetaEntity by its name.</summary>
	        /// <remarks>If you only need to know the attributes of a single entity, use this method to prevent requesting all Metadata information.</remarks>
	        /// <param name="name" type="String">A logical name of requested entity.</param>
	        /// <param name="callback" type="function">The callback function that is called asynchronously with MetaEntity object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var obj = MobileCRM.bridge.exposeObjectAsync("MobileCrm.Data:MobileCrm.Data.Metadata.get_Entities", []);
	        obj.invokeMethodAsync("get_Item", [name], function (metaEntity) {
	            callback(metaEntity, scope);
	            obj.release();
	        }, errorCallback, scope);
	    }
	    MobileCRM.MetaEntity.prototype.getProperty = function (name) {
	        /// <summary>Gets the MetaProperty object describing the CRM attribute (field) properties.</summary>
	        /// <param name="name" type="String">A logical name of the CRM field.</param>
	        /// <returns type="MobileCRM.MetaProperty">An instance of the <see cref="MobileCRM.MetaProperty">MobileCRM.MetaProperty</see> object or "null".</returns>
	        return _findInArray(this.properties, "name", name);
	    };
	    MobileCRM.MetaEntity.prototype.canRead = function () {
	        /// <summary>Checks whether the current user has read permission on the entity type.</summary>
	        /// <returns type="Boolean">True if the permission is granted, false otherwise.</returns>
	        return this.getDepth(0) != 0;
	    }
	    MobileCRM.MetaEntity.prototype.canWrite = function () {
	        /// <summary>Checks whether the current user has write permission on the entity type.</summary>
	        /// <returns type="Boolean">True if the permission is granted, false otherwise.</returns>
	        return this.getDepth(1) != 0;
	    }
	    MobileCRM.MetaEntity.prototype.canCreate = function () {
	        /// <summary>Checks whether the current user has create permission on the entity type.</summary>
	        /// <returns type="Boolean">True if the permission is granted, false otherwise.</returns>
	        return this.getDepth(2) != 0;
	    }
	    MobileCRM.MetaEntity.prototype.canAppendTo = function (child) {
	        /// <summary>Checks whether the user has permission to append a child <b>To</b> a this parent entity.</summary>
	        /// <param name="child" type="String">The entity to append (f.e. opportunity).</param>
	        /// <returns type="Boolean">True if the user has append permissions, false otherwise.</returns>
	        return this.getDepth(5) != 0 && MobileCRM.Metadata.entities[child].getDepth(4) != 0;
	    }
	    MobileCRM.MetaEntity.prototype.canDelete = function () {
	        /// <summary>Checks whether the current user has create permission on the entity type.</summary>
	        /// <returns type="Boolean">True if the permission is granted, false otherwise.</returns>
	        return this.getDepth(3) != 0;
	    }
	    MobileCRM.MetaEntity.prototype.getDepth = function (permission) {
	        /// <summary>Gets the permission depth.</summary>
	        /// <param name="permission" type="Number">Permission to check.</param>
	        /// <returns type="Number">The permission depth (none, user, business unit, organization).</returns>
	        var p = this.permissionMask;
	        var m = permission * 4;
	        var d = (p >> m) & 0xF;

	        var disabled = (this.attributes & (0x40 << permission)) != 0;
	        if (disabled)
	            d = 0;

	        return d;
	    }

	    // MobileCRM.FetchXml.Fetch
	    MobileCRM.FetchXml.Fetch.executeFromXML = function (fetchXmlData, success, failed, scope) {
	        /// <summary>Performs the asynchronous CRM Fetch command.</summary>
	        /// <remarks></remarks>
	        /// <param name="fetchXmlData" type="String">CRM fetch in XML representation.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the objects array of type specified by <b>resultformat</b> XML attribute (Array, JSON, XML or DynamicEntities).</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        window.MobileCRM.bridge.command('fetchXML', fetchXmlData, success, failed, scope);
	    };
	    MobileCRM.FetchXml.Fetch.prototype.execute = function (output, success, failed, scope) {
	        /// <summary>Performs the asynchronous CRM Fetch request.</summary>
	        /// <param name="output" type="String">A string defining the output format: Array, JSON, XML or DynamicEntities.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the objects array of type specified by <b>output</b> argument.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var reqParams = JSON.stringifyNotNull({ entity: this.entity, resultformat: output, page: this.page, count: this.count, aggregate: this.aggregate });
	        MobileCRM.bridge.command('fetch', reqParams, success, failed, scope);
	    };
	    MobileCRM.FetchXml.Fetch.prototype.executeOnline = function (output, success, failed, scope) {
	        /// <summary>[v8.0] Performs the online CRM Fetch request regardless of the app online/offline mode.</summary>
	        /// <param name="output" type="String">A string defining the output format: Array, JSON, XML or DynamicEntities.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the objects array of type specified by <b>output</b> argument.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var format = "Online.";
	        if (output)
	            format += output;
	        this.execute(format, success, failed, scope);
	    };
	    MobileCRM.FetchXml.Fetch.prototype.executeOffline = function (output, success, failed, scope) {
	        /// <summary>[v8.0] Performs the offline CRM Fetch request regardless of the app online/offline mode.</summary>
	        /// <param name="output" type="String">A string defining the output format: Array, JSON, XML or DynamicEntities.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the objects array of type specified by <b>output</b> argument.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var format = "Offline.";
	        if (output)
	            format += output;
	        this.execute("Offline." + output, success, failed, scope);
	    };

		MobileCRM.FetchXml.Fetch.prototype.executeAsync = function (output, online) {
	        /// <summary>Performs the asynchronous CRM Fetch request.</summary>
	        /// <param name="output" type="String">A string defining the output format: Array, JSON, XML or DynamicEntities.</param>
	        /// <param name="online" type="Boolean">Optional parameter determining whether the fetch should be executed online or offline. If omitted, function respects current online/offline mode of the app.</param>
	        /// <returns type="Promise&lt;any[]&gt;">A Promise object which will be resolved with array of objects having type specified by <b>output</b> argument.</returns>
	    	var _this = this;
	    	return new Promise(function (resolve, reject) {
	    		var format = "";
	    		if (online === true || online === false)
	    			format = online ? "Online." : "Offline.";
	    		if (output)
	    			format += output;
				_this.execute(format, resolve, function (err) { reject(new Error(err)); });
	    	});
	    };

	    MobileCRM.FetchXml.Fetch.deserializeFromXml = function (xml, success, failed, scope) {
	        /// <summary>Deserializes the Fetch object from XML.</summary>
	        /// <param name="xml" type="String">A string defining the fetch XML request.</param>
	        /// <param name="success" type="function(result: MobileCRM.FetchXml.Fetch)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the Fetch object.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Data.FetchXml.Fetch", "Deserialize", [xml], success, failed, scope);
	    };
		MobileCRM.FetchXml.Fetch.deserializeFromXmlAsync = function (xml) {
			/// <summary>Deserializes the Fetch object from XML.</summary>
	        /// <param name="xml" type="String">A string defining the fetch XML request.</param>
			/// <returns type="Promise&lt;MobileCRM.FetchXml.Fetch&gt;">A Promise object which will be resolved with the Fetch object.</returns>
			return MobileCRM.bridge.invokeStaticMethodPromise("MobileCrm.Data", "MobileCrm.Data.FetchXml.Fetch", "Deserialize", [xml]);
		};

	    MobileCRM.FetchXml.Fetch.prototype.serializeToXml = function (success, failed, scope) {
	        /// <summary>[v10.0] Serializes the Fetch object to XML.</summary>
	        /// <param name="success" type="function(String)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the XML representation of the Fetch object.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var reqParams = JSON.stringifyNotNull({ entity: this.entity, page: this.page, count: this.count, aggregate: this.aggregate });
	        MobileCRM.bridge.command('fetchToXml', reqParams, success, failed, scope);
	    };
		MobileCRM.FetchXml.Fetch.prototype.serializeToXmlAsync = function () {
			/// <summary>[v10.0] Serializes the Fetch object to XML.</summary>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with the XML representation of this Fetch object.</returns>
			var reqParams = JSON.stringifyNotNull({ entity: this.entity, page: this.page, count: this.count, aggregate: this.aggregate });
			return MobileCRM.bridge.invokeCommandPromise('fetchToXml', reqParams);
		};

	    // MobileCRM.FetchXml.Entity
	    MobileCRM.FetchXml.Entity.prototype.addAttribute = function (name, alias, aggregate) {
	        /// <summary>Adds an entity attribute to the fetch query.</summary>
	        /// <param name="name" type="String">The attribute (CRM logical field name) to order by.</param>
	        /// <param name="alias" type="String">Optional parameter defining an attribute alias.</param>
	        /// <param name="aggregate" type="String">Optional parameter defining an aggregation function.</param>
	        /// <returns type="MobileCRM.FetchXml.Attribute">The newly created MobileCRM.FetchXml.Attribute object</returns>
	        var attr = new MobileCRM.FetchXml.Attribute(name);
	        if (alias)
	            attr.alias = alias;
	        if (aggregate)
	            attr.aggregate = aggregate;
	        this.attributes.push(attr);
	        return attr;
	    };
	    MobileCRM.FetchXml.Entity.prototype.addAttributes = function () {
	        /// <summary>Adds all entity attributes to the fetch query.</summary>
	        this.allattributes = true;
	    };
	    MobileCRM.FetchXml.Entity.prototype.addFilter = function () {
	        /// <summary>Adds a filter for this fetch entity.</summary>
	        /// <returns type="MobileCRM.FetchXml.Filter">Existing or newly created entity filter.</returns>
	        var filter = this.filter;
	        if (filter)
	            return filter;

	        filter = new MobileCRM.FetchXml.Filter();
	        this.filter = filter;
	        return filter;
	    };
	    MobileCRM.FetchXml.Entity.prototype.addLink = function (target, from, to, linktype) {
	        /// <summary>Adds an entity link (join) to the fetch query.</summary>
	        /// <param name="target" type="String">The target entity.</param>
	        /// <param name="from" type="String">The "from" field (if parent then target entity primary key).</param>
	        /// <param name="to" type="String">The "to" field.</param>
	        /// <param name="linkType" type="String">The link (join) type ("inner" or "outer").</param>
	        /// <returns type="MobileCRM.FetchXml.LinkEntity">The newly created MobileCRM.FetchXml.LinkEntity object.</returns>
	        var link = new MobileCRM.FetchXml.LinkEntity(target);
	        link.from = from;
	        link.to = to;
	        link.linktype = linktype;
	        this.linkentities.push(link);
	        return link;
	    };
	    MobileCRM.FetchXml.Entity.prototype.removeLink = function (link) {
	        /// <summary>Removes an entity link from the fetch query.</summary>
	        /// <param name="link" type="MobileCRM.FetchXml.LinkEntity">The MobileCRM.FetchXml.LinkEntity object to remove.</param>
	        /// <returns type="Array">The list of remaining <see cref="MobileCRM.FetchXml.LinkEntity">LinkEntity</see> objects or null if the link does not exists.</returns>
	        var index = this.linkentities.indexOf(link);
	        if (index !== -1) {
	            this.linkentities.splice(index, 1);
	            return this.linkentities;
	        }
	        return null;
	    };
	    MobileCRM.FetchXml.Entity.prototype.orderBy = function (attribute, descending) {
	        /// <summary>Adds an order by statement to the fetch query.</summary>
	        /// <param name="attribute" type="String">The attribute (CRM logical field name) to order by.</param>
	        /// <param name="descending" type="Boolean">false, for ascending order; true, for descending order.</param>
	        /// <returns type="MobileCRM.FetchXml.Order">The newly created MobileCRM.FetchXml.Order object.</returns>
	        var order = new MobileCRM.FetchXml.Order(attribute, descending);
	        this.order.push(order);
	        return order;
	    }

	    // MobileCRM.FetchXml.LinkEntity
	    _inherit(MobileCRM.FetchXml.LinkEntity, MobileCRM.FetchXml.Entity);

	    // MobileCRM.FetchXml.Filter
	    MobileCRM.FetchXml.Filter.prototype.where = function (attribute, op, value) {
	        /// <summary>Adds a attribute condition to the filter.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="op" type="String">The condition operator. "eq", "ne", "lt", "le", "gt", "ge", "like"</param>
	        /// <param name="value" type="Depends on attribute type">The values to compare to.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        var condition = new MobileCRM.FetchXml.Condition();
	        condition.attribute = attribute;
	        condition.operator = op;
	        condition.value = value;
	        this.conditions.push(condition);
	        return condition;
	    };
	    MobileCRM.FetchXml.Filter.prototype.isIn = function (attribute, values) {
	        /// <summary>Adds a attribute inclusion condition to the filter.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="values" type="Array">An array of values.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        var condition = new MobileCRM.FetchXml.Condition();
	        condition.attribute = attribute;
	        condition.operator = "in";
	        condition.values = values;
	        this.conditions.push(condition);
	        return condition;
	    };
	    MobileCRM.FetchXml.Filter.prototype.notIn = function (attribute, values) {
	        /// <summary>Adds a attribute inclusion condition to the filter.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="values" type="Array">An array of values.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        var condition = new MobileCRM.FetchXml.Condition();
	        condition.attribute = attribute;
	        condition.operator = "not-in";
	        condition.values = values;
	        this.conditions.push(condition);
	        return condition;
	    }
	    MobileCRM.FetchXml.Filter.prototype.between = function (attribute, low, high) {
	        /// <summary>Adds a condition that the passed attribute is between the passed bounds.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="low" type="Depends on attribute type">The lower bound.</param>
	        /// <param name="high" type="Depends on attribute type">The higher bound.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        var condition = new MobileCRM.FetchXml.Condition();
	        condition.attribute = attribute;
	        condition.operator = "between";
	        condition.values = [low, high];
	        this.conditions.push(condition);
	        return condition;
	    };
	    MobileCRM.FetchXml.Filter.prototype.startsWith = function (attribute, value) {
	        /// <summary>Adds a condition that the passed column value contains the passed string.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="value" type="String">The value to compare to.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        return this.where(attribute, "like", value + "%");
	    };
	    MobileCRM.FetchXml.Filter.prototype.contains = function (attribute, value) {
	        /// <summary>Adds a condition that the passed column starts with the passed string.</summary>
	        /// <param name="attribute" type="String">The attribute name (CRM logical field name).</param>
	        /// <param name="value" type="String">The value to compare to.</param>
	        /// <returns type="MobileCRM.FetchXml.Condition">The condition instance.</returns>
	        return this.where(attribute, "like", "%" + value + "%");
	    };

	    // MobileCRM.Platform
	    _inherit(MobileCRM.Platform, MobileCRM.ObservableObject);

	    function _executePlatformAction(action, data, success, failed, scope) {
	        var params = [action, data];
	        MobileCRM.bridge.invokeStaticMethodAsync("Resco.UI", "Resco.UI.Platform", "Instance.Execute", params, success, failed, scope);
	    };

	    MobileCRM.Platform.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the managed Platform object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of Platform object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(platform)">The callback function that is called asynchronously with serialized Platform object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("Platform", callback, errorCallback, scope);
	    };
	    MobileCRM.Platform.makeCall = function (telephone, errorCallback, scope) {
	        /// <summary>[v8.0] Opens the platform-specific call application with specified phone number.</summary>
	        /// <param name="telephone" type="String">Telephone number</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for errorCallback.</param>
	        var tel = { Address: telephone };
	        _executePlatformAction(0, tel, function () { }, errorCallback, scope);
	    }
	    MobileCRM.Platform.sendSMS = function (phoneNumber, text, errorCallback, scope) {
	        /// <summary>[v11.2.3] Opens the platform-specific sms application with specified phone number and pre-fill text.</summary>
	        /// <param name="phoneNumber" type="String">Phone number</param>
	        /// <param name="text" type="String">SMS text</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for errorCallback.</param>
	        var tel = { Address: phoneNumber, Body: text };
	        _executePlatformAction(2, tel, function () { }, errorCallback, scope);
	    }
	    MobileCRM.Platform.email = function (address, subject, body, errorCallback, scope) {
	        /// <summary>[v8.1] Opens the platform-specific e-mail message form with pre-filled data.</summary>
	        /// <param name="address" type="String">Recipient&#39;s email address.</param>
	        /// <param name="subject" type="String">An e-mail subject.</param>
	        /// <param name="body" type="String">A string with email body.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for errorCallback.</param>

	        var emailContent = { Address: address, Subject: subject, Body: body };
	        _executePlatformAction(1, emailContent, null, errorCallback, scope);
	    };
	    MobileCRM.Platform.openDocument = function (path, mimeType, args, errorCallback, scope) {
	        /// <summary>[v8.1] Opens specified document in associated program.</summary>
	        /// <remarks>Apple security policy doesn&amp;t allow this functionality on iOS.</remarks>
	        /// <param name="path" type="String">A path to the document file.</param>
	        /// <param name="mimeType" type="String">Document MIME type (required on Android).</param>
	        /// <param name="args" type="String">Optional arguments for Windows 7 command line.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for errorCallback.</param>

	        var c = { Address: path, Subject: args, MimeType: mimeType };
	        _executePlatformAction(5, c, null, errorCallback, scope);
	    };
	    MobileCRM.Platform.emailWithAttachments = function (address, subject, body, attachments, entity, relationship, errorCallback, scope) {
	        /// <summary>[v9.1] Sends a list of files (full paths or IReferences to blobs) as email attachments.</summary>
	        /// <remarks>This method either open the CRM Email form or the native mail client (depending on application settings).</remarks>
	        /// <param name="address" type="String">Recipient&quot;s email address.</param>
	        /// <param name="subject" type="String">An e-mail subject.</param>
	        /// <param name="body" type="String">A string with email body.</param>
	        /// <param name="attachments" type="Array">Array of files to send. Element must be a full path or a IReference to a note, etc.</param>
	        /// <param name="entity" type="MobileCRM.Reference">The related entity reference.</param>
	        /// <param name="relationship" type="MobileCRM.Relationship">The relationship to the created email entity. (optional).</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for errorCallback.</param>

	        var params = {
	            relationship: relationship,
	            body: body,
	            subject: subject,
	            address: address,
	            attachments: attachments,
	            entity: entity
	        }

	        MobileCRM.bridge.command("sendEmailWithAttachments", JSON.stringify(params), null, errorCallback, scope);
	    };
	    MobileCRM.Platform.openUrl = function (url) {
	        /// <summary>Open url in external browser.</summary>
	        /// <param name="url" type="String">web page url</param>
	        var param = { Address: url };
	        _executePlatformAction(3, param, null, null);
	    };
	    MobileCRM.Platform.getURL = function (success, failed, scope) {
	        /// <summary>Gets the full URL of currently loaded HTML document.</summary>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a string with URL.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("getURL", null, success, failed, scope);
	    };
	    MobileCRM.Platform.getDeviceInfo = function (success, failed, scope) {
	        /// <summary>Gets the device information.</summary>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a <see cref="MobileCRM._DeviceInfo">MobileCRM._DeviceInfo</see> object.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("getDeviceInfo", null, success, failed, scope);
		};
		MobileCRM.Platform.getNetworkInfo = function (success, failed, scope) {
			/// <summary>[v11.2] Gets network information.</summary>
			/// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry an object with properties <b>connected</b> and <b>fastConnection</b>.</param>
			/// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
			MobileCRM.bridge.command("getNetworkInfo", null, success, failed, scope);
		};
	    MobileCRM.Platform.navigateTo = function (latitude, longitude, failed, scope) {
	        /// <summary>Execute the navigateTo function based on the latitude and longitude.</summary>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var params = { Address: latitude + "," + longitude };
	        _executePlatformAction(4, params, null, null);
	    };
	    MobileCRM.Platform.scanBarCode = function (success, failed, scope) {
	        /// <summary>Activates the bar-code scanning.</summary>
	        /// <remarks>If the current platform does not support the bar-code scanning, the <b>failed</b> handler is called with error "Unsupported".</remarks>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry an array of strings with scanned codes.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("scanBarcode", null, success, failed, scope);
	    };
	    MobileCRM.Platform.scanBarCodeRequiredLength = function (requiredLength, success, failed, scope) {
	        /// <summary>Activates the bar-code scanning.</summary>
	        /// <remarks>If the current platform does not support the bar-code scanning, the <b>failed</b> handler is called with error "Unsupported".</remarks>
	        /// <param name="requiredLength" type="Number">Set required length of scanned barcode.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry an array of strings with scanned codes.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("scanBarcode", JSON.stringify({ "RequiredLength": requiredLength }), success, failed, scope);
	    };
	    MobileCRM.Platform.getLocation = function (success, failed, scope, age, precision, timeout) {
	        /// <summary>Gets current geo-location from platform-specific location service.</summary>
	        /// <remarks>If the current platform does not support the location service, the <b>failed</b> handler is called with error "Unsupported".</remarks>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry an object with properties <b>latitude</b>, <b>longitude</b> and <b>timestamp</b>	.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        /// <param name="age" type="Number">Max age in seconds to accept GPS.</param>
	        /// <param name="precision" type="Number">Desired accuracy in meters.</param>
	        /// <param name="timeout" type="Number">Timeout in milliseconds (since v10.1).</param>
	        var params = { maxAge: age, accuracy: precision };
	        if (timeout)
	            params.timeout = timeout;
	        MobileCRM.bridge.command("getLocation", JSON.stringify(params), success, failed, scope);
	    };
		MobileCRM.Platform.getLocationAsync = function (age, precision, timeout) {
			/// <summary>Gets current geo-location from platform-specific location service.</summary>
			/// <remarks>If the current platform does not support the location service, returned Promise is rejected with error "Unsupported".</remarks>
			/// <param name="age" type="Number">Max age in seconds to accept GPS.</param>
			/// <param name="precision" type="Number">Desired accuracy in meters.</param>
			/// <param name="timeout" type="Number">Timeout in milliseconds (since v10.1).</param>
			/// <returns type="Promise&lt;object&gt;">A Promise object which will be resolved with an object having <b>latitude</b> and <b>longitude</b> properties.</returns>
			var params = { maxAge: age, accuracy: precision };
			if (timeout)
				params.timeout = timeout;
			return MobileCRM.bridge.invokeCommandPromise("getLocation", JSON.stringify(params));
		};
	    MobileCRM.Platform.preventBackButton = function (handler, scope) {
	        /// <summary>Prevents application to close when HW back button is pressed and installs handler which is called instead.</summary>
	        /// <remarks><p>Pass &quot;null&quot; handler to allow the HW back button.</p><p>Works only under OS having HW back button (Android, Windows 10).</p></remarks>
	        /// <param name="handler" type="function()">Handler function which will be called each time when user presses the Android HW back button.</param>
	        MobileCRM.bridge.command("setBackButtonHandler", handler ? MobileCRM.bridge._createCmdObject(handler, null, scope) : null, handler, null, scope);
	    };

	    // MobileCRM.Application
	    MobileCRM.Application.synchronize = function (backgroundOnly, ifNotSyncedBefore) {
	        /// <summary>Starts background/foreground sync if not synchronized or the last sync was before desired limit.</summary>
	        /// <param name="backgroundOnly" type="Boolean">if true, only the background sync is allowed; otherwise it can also run the foreground sync.</param>
	        /// <param name="ifNotSyncedBefore" type="Date">Defines a time limit required for the last sync. Starts the sync only if wasn&quot;t done yet or if it was before this limit. If it is null or undefined, sync is done always.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.Synchronize", [backgroundOnly, ifNotSyncedBefore]);
	    }
	    MobileCRM.Application.synchronizeOnForeground = function (forceLogin) {
	        /// <summary>[v8.1] Starts the synchronization on foreground (closes all form if possible and showing the standard progress).</summary>
	        /// <remarks>Foreground sync must be done to download the new customization or to display the sync conflicts.</remarks>
	        /// <param name="forceLogin" type="Boolean">if true, the sync dialog with URL and credentials will be opened; otherwise it is opened only if the password is not saved.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.Synchronize", [forceLogin, false]);
	    }
	    MobileCRM.Application.showAppLogin = function () {
	        /// <summary>Causes that the password is forgotten and user is required to type it again to make the app running.</summary>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.SecurityManager", "OpenLoginForm", []);
	    }

	    MobileCRM.Application.getAppColor = function (colName, success, failed, scope) {
	        /// <summary>Gets the customized color by its name.</summary>
	        /// <param name="colName" type="String">Defines the color name. Must be one of these: TitleBackground, TitleForeground, ListBackground, ListForeground, ListSelBackground, ListSelForeground, ListSeparator, SearchBackground, SearchForeground, SearchSelForeground, FormBackground, FormItemBackground, FormItemForeground, FormItemLabelForeground, FormItemDisabled, FormItemLink, TabBackground, TabForeground, TabSelForeground.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a String object with color in CSS format (e.g. "#FF0000" for red color).</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("getAppColor", colName, success, failed, scope);
	    };

	    MobileCRM.Application.getAppImage = function (imageName, colorize, success, failed, scope) {
	        /// <summary>Gets the colorized application image. It is taken either from customization package or from application bundle.</summary>
	        /// <param name="imageName" type="String">Defines the image name (e.g. &quot;Buttons.Call.png&quot;).</param>
	        /// <param name="colorize" type="String">If the image supports colorization, this value defines the colorization color. It can be either integer with RGB value or the application color name as defined in <see cref="MobileCRM.Application.getAppColor">MobileCRM.Application.getAppColor</see>. Leave null if no colorization is desired.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a String object with &quot;data:&quot; URL containing base64-encoded colorized application image.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        var data = colorize ? (colorize + "#" + imageName) : imageName;
	        MobileCRM.bridge.command("getAppImage", data, success, failed, scope);
	    };

	    MobileCRM.Application.checkUserRoles = function (roles, success, failed, scope) {
	        /// <summary>Checks whether the current user is member of the passed roles. Role can be either the Guid (aeb33d0f-89b4-e111-9c9a-00155d0b710a) or the role Name.</summary>
	        /// <param name="roles" type="Array(String)">Defines the roles to check.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a number with the count of matching roles.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.command("checkUserRoles", JSON.stringify(roles), success, failed, scope);
		};

		MobileCRM.Application.setAppColors = function (colors, success, failed, scope) {
			/// <summary>[v11.2] Sets the application colors.</summary>
			/// <param name="colors" type="object">Properties of the object define the colors to set. The values must be int in the AARRGGBB format.</param>
			/// <param name="success" type="function(result)">A callback function for successful asynchronous result.</param>
			/// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
			MobileCRM.bridge.command("setAppColors", JSON.stringify(colors), success, failed, scope);
		};

	    MobileCRM.Application.fileExists = function (path, success, failed, scope) {
	        /// <summary>Checks whether the file with given path exists in application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file located in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a Boolean object determining whether the file exists or not.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.FileExists", [path], success, failed, scope);
	    };

	    MobileCRM.Application.directoryExists = function (path, success, failed, scope) {
	        /// <summary>Checks whether the directory with given path exists in the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the directory located in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a Boolean object determining whether the directory exists or not.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.DirectoryExists", [path], success, failed, scope);
	    };

	    MobileCRM.Application.createDirectory = function (path, success, failed, scope) {
	        /// <summary>Asynchronously creates the directory in the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the directory in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.CreateDirectory", [path], success, failed, scope);
	    };

	    MobileCRM.Application.deleteDirectory = function (path, success, failed, scope) {
	        /// <summary>Asynchronously deletes the empty directory from the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the directory in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.DeleteDirectory", [path], success, failed, scope);
	    };
	    MobileCRM.Application.getDirectories = function (path, success, failed, scope) {
	        /// <summary>Asynchronously gets the list of directories from the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the Directory in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which carry the array of directories names.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.GetDirectories", [path], success, failed, scope);
	    };

	    MobileCRM.Application.deleteFile = function (path, success, failed, scope) {
	        /// <summary>Asynchronously deletes the file from the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.DeleteFile", [path], success, failed, scope);
	    };

	    MobileCRM.Application.getFiles = function (path, success, failed, scope) {
	        /// <summary>Asynchronously gets the list of files from the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the Directory in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which carry the array of files names in the directory.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.GetFiles", [path], success, failed, scope);
	    };

	    MobileCRM.Application.moveFile = function (src, dst, success, failed, scope) {
	        /// <summary>Asynchronously moves the application local file to another location.</summary>
	        /// <param name="src" type="String">Defines the relative path of the source file in the application local data.</param>
	        /// <param name="dst" type="String">Defines the relative path of the destination file in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.MoveFile", [src, dst], success, failed, scope);
	    };

	    MobileCRM.Application.readFile = function (path, success, failed, scope) {
	        /// <summary>Reads the file from the application local data and asynchronously gets its content.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a String object with the file content.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        if (MobileCRM.bridge.platform === "WebClient") {
	            // MR: we have to branch the code here :/ (its always better not to branch the code like this) 
	            // otherwise it throws 3 object not exposed and method not found errors on web client 
	            // we want to show one nicer message instead.
	            // in future: lets not go mad with all those exposings of C# objects and lets use the single method invocations or javascriptcallbacks
	        	var params = { path: path };
	        	MobileCRM.bridge.command("readFromLocalStorage", JSON.stringify(params), success, failed, scope);
	        }
	        else {
	            var reader = MobileCRM.bridge.exposeObjectAsync("MobileCrm.Data:MobileCrm.Configuration.Instance.OpenStorageReader", [path]);
	            reader.invokeMethodAsync("ReadToEnd", [], success, failed, scope);
	            reader.invokeMethodAsync("Dispose", [], undefined, failed, scope);
	            reader.release();
	        }
	    };

	    MobileCRM.Application.writeFile = function (path, text, append, success, failed, scope) {
	        /// <summary>Asynchronously writes the text into the file from the application local data.</summary>
	        /// <remarks>File content is encoded using UTF-8 encoding.</remarks>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="text" type="String">Defines the file content to be written.</param>
	        /// <param name="append" type="Boolean">Determines whether to overwrite or append to an existing file..</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        if (MobileCRM.bridge.platform === "WebClient") {
	            // MR: see comment in readFile function
	        	var params = { path: path, text: text };
	        	MobileCRM.bridge.command("writeToLocalStorage", JSON.stringify(params), success, failed, scope);
	        }
	        else {
	            var reader = MobileCRM.bridge.exposeObjectAsync("MobileCrm.Data:MobileCrm.Configuration.Instance.OpenStorageWriter", [path, append]);	// MR: same comment as in function above
	            reader.invokeMethodAsync("Write", [text], success, failed, scope);
	            reader.invokeMethodAsync("Dispose", [], undefined, failed, scope);
	            reader.release();
	        }
	    };

	    MobileCRM.Application.writeFileWithEncoding = function (path, text, encoding, append, success, failed, scope) {
	        /// <summary>[v9.0.2] Asynchronously writes the text into the file from the application local data.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="text" type="String">Defines the file content to be written.</param>
	        /// <param name="encoding" type="String">Defines the text encoding for file content (default is UTF-8). Use &quot;ASCII&quot; for ANSI text or &quot;UTF-16&quot; for multi-byte Unicode.</param>
	        /// <param name="append" type="Boolean">Determines whether to overwrite or append to an existing file.</param>
	        /// <param name="success" type="function(result)">A callback function which is called in case of successful asynchronous result.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        if (MobileCRM.bridge.platform === "WebClient") {
	            // MR: see comment in readFile function
	            if (failed) {
	                failed.call(scope || this, "You cannot write to a file on the Web Client");
	            }
	        }
	        else {
	            var reader = MobileCRM.bridge.exposeObjectAsync("MobileCrm.Data:MobileCrm.Configuration.Instance.OpenStorageWriterEnc", [path, append, (encoding || null)]);	// MR: same comment as in function above
	            reader.invokeMethodAsync("Write", [text], success, failed, scope);
	            reader.invokeMethodAsync("Dispose", [], undefined, failed, scope);
	            reader.release();
	        }
	    };

	    MobileCRM.Application.readFileAsBase64 = function (path, success, failed, scope) {
	        /// <summary>Reads the file from the application local data and asynchronously gets its base64-encoded content.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a string with the base64-encoded file content.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.ReadStorageFileAsBase64", [path], success, failed, scope);
	    };

	    MobileCRM.Application.writeFileFromBase64 = function (path, base64, success, failed, scope) {
	        /// <summary>Asynchronously writes the base64-encoded data into the application local storage file.</summary>
	        /// <param name="path" type="String">Defines the relative path of the file in the application local data.</param>
	        /// <param name="base64" type="String">A string containing the base64-encoded file content.</param>
	        /// <param name="success" type="function()">A callback function which is called in case of success.</param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.Data", "MobileCrm.Configuration", "Instance.WriteStorageFileFromBase64", [path, base64], success, failed, scope);
	    };

	    MobileCRM.Application.getAccessToken = function (resourceUrl, successCallback, failureCallback, scope) {
	    	/// <param name="resourceUrl" type="String">The resource.</param>
	    	/// <param name="successCallback" type="function(textAccessToken)">A callback function what is called asynchronously with serialized <b>access token</b> as argument.</param>
	    	/// <param name="failureCallback" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	    	/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

	    	MobileCRM.bridge.command("GetAccessToken", JSON.stringify({ resource: resourceUrl }), successCallback, failureCallback, scope);
		};

		MobileCRM.Application.getLastSignificantTimeChange = function (success, failed, scope) {
			/// <summary>[v13.3.1] Gets the last detected time change.</summary>
	        /// <param name="success" type="function()">A callback function which is called in case of success. Callback will receive an object with &quot;lastChange&quot date and &quot;delta&quot; time in sceonds.</summary> </param>
	        /// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
	        /// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
			MobileCRM.bridge.command("getLastSignificantTimeChange", null, success, failed);
		};

		MobileCRM.Integration.getOAuthAccessToken = function (configurationName, oauthSettings, prompt, successCallback, failureCallback, scope) {
			/// <summary>[12.3]Asynchronously gets the token using passed OAuth settings and parameters. Configuration name is used to find already settings.</summary>
			/// <param name="configurationName" type="String">Define the name of oauth configuration, what is key for saved setting if any.</param>
			/// <param name="oauthSettings" type="MobileCRM.OAuthSettings">Defines the OAuth settings for authentication.</param>
			/// <param name="prompt" type="Boolean">Whether to force the user to enter credentials again.</param>
			/// <param name="success" type="function(result)">A callback function for successful asynchronous result. The <b>result</b> will carry a string with the access token.</param>
			/// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>

			if (!oauthSettings) {
				failureCallback("OAuthSettings are undefined");
				return;
			}

			oauthSettings.configName = configurationName;
			oauthSettings.prompt = prompt;
			MobileCRM.bridge.command("GetOAuthAccessToken", JSON.stringify(oauthSettings), successCallback, failureCallback, scope);
		};

	    // MobileCRM.UI.FormManager
	    MobileCRM.UI.FormManager.showEditDialog = function (entityName, id, relationship, options) {
	        /// <summary>Shows an entity edit dialog.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="id" type="String">GUID of the existing entity or null for new one.</param>
	        /// <param name="relationship" type="MobileCRM.RelationShip">The optional relationship with a parent entity.</param>
	        /// <param name="options" type="Object">A JSON object containing a form-specific properties like pre-defined field values, peer iFrame options or document options.</param>
	        var reference = new MobileCRM.Reference(entityName, id);
	        if (!id || id.length == 0)
	            delete reference.id;
	        if (typeof relationship != "undefined")
	            reference.relationShip = JSON.stringify(relationship);
	        if (typeof options != "undefined")
	            reference.options = JSON.stringify(options);
	        MobileCRM.bridge.command("formManagerAction", JSON.stringify(reference));
	    }
	    MobileCRM.UI.FormManager.showDetailDialog = function (entityName, id, relationship) {
	        /// <summary>Shows an entity detail dialog.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="id" type="String">GUID of the existing entity.</param>
	        /// <param name="relationship" type="MobileCRM.RelationShip">The optional relationship with a parent entity.</param>
	        var reference = new MobileCRM.Reference(entityName, id);
	        reference.detail = true;
	        if (typeof relationship != "undefined")
	            reference.relationShip = JSON.stringify(relationship);
	        MobileCRM.bridge.command("formManagerAction", JSON.stringify(reference));
	    }
	    MobileCRM.UI.FormManager.showNewDialog = function (entityName, relationship, options) {
	        /// <summary>Shows a new entity dialog.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="relationship" type="MobileCRM.RelationShip">The optional relationship with a parent entity.</param>
	        /// <param name="options" type="Object">A JSON object containing a form-specific properties like pre-defined field values, peer iFrame options or document options.</param>
	        MobileCRM.UI.FormManager.showEditDialog(entityName, null, relationship, options);
	    }

		_inherit(MobileCRM.UI.RoutePlan, MobileCRM.ObservableObject);       
		MobileCRM.UI.RoutePlan.requestObject = function (callback, errorCallback, scope) {
			/// <summary>Requests the managed RoutePlan object.</summary>
			/// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of RoutePlan object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
			/// <param name="callback" type="function(platform)">The callback function that is called asynchronously with serialized RoutePlan object as argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.requestObject("RoutePlan", function (obj) {
				return obj.runCallback(callback, scope);
			}, errorCallback, scope);
		};
		MobileCRM.UI.RoutePlan.onSave = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for route save validation.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;errorMessage&quot; that can be used to cancel save with an error.</p><p>Use <see cref="MobileCRM.UI.RoutePlan.suspendSave">suspendSave</see> method to suspend the save process if an asynchronous operation is required.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onSave", handler, MobileCRM.UI.RoutePlan._handlers.onSave, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onPostSave = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for further actions on saved route.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>Use <see cref="MobileCRM.UI.RoutePlan.suspendPostSave">suspendPostSave</see> method to suspend the post-save process if an asynchronous operation is required.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onPostSave", handler, MobileCRM.UI.RoutePlan._handlers.onPostSave, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onRouteReloaded = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler called after route is reloaded.</summary>
			/// <remarks>Bound handler is called with the RoutePlan object as an argument on start or when day or filter field is changed.</remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onRouteReloaded", handler, MobileCRM.UI.RoutePlan._handlers.onRouteReloaded, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onItemAdded = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for &quot;Item Added&quot; event.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;entity&quot; carrying DynamicEntity object of the new visit record.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onItemAdded", handler, MobileCRM.UI.RoutePlan._handlers.onItemAdded, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onItemRemoved = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for &quot;Item Removed&quot; event.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;entity&quot; carrying DynamicEntity object of unsaved visit record being removed from route plan.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onItemRemoved", handler, MobileCRM.UI.RoutePlan._handlers.onItemRemoved, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onItemCompleted = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for &quot;Item Completed&quot; event.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;entity&quot; carrying DynamicEntity object af completed visit record being removed from route plan.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onItemCompleted", handler, MobileCRM.UI.RoutePlan._handlers.onItemCompleted, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onItemSave = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for validating single visit entity save.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;errorMessage&quot; that can be used to cancel save with an error and property &quot;entityToSave&quot; carrying visit DynamicEntity record.</p><p>Use <see cref="MobileCRM.UI.RoutePlan.suspendSave">suspendSave</see> method to suspend the save process if an asynchronous operation is required.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onItemSave", handler, MobileCRM.UI.RoutePlan._handlers.onItemSave, bind, scope);
		};
		MobileCRM.UI.RoutePlan.onItemPostSave = function (handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for further actions on saved visit entity.</summary>
			/// <remarks><p>Bound handler is called with the RoutePlan object as an argument.</p><p>The RoutePlan context object contains property &quot;errorMessage&quot; that can be used to cancel save with an error.</p><p>Use <see cref="MobileCRM.UI.RoutePlan.suspendSave">suspendSave</see> method to suspend the save process if an asynchronous operation is required and property &quot;savedEntity&quot; carrying saved DynamicEntity object.</p></remarks>
			/// <param name="handler" type="function(RoutePlan)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			_registerEventHandler("onItemPostSave", handler, MobileCRM.UI.RoutePlan._handlers.onItemPostSave, bind, scope);
		};
		var _pendingRoutePlanSaveId = 0;
		MobileCRM.UI.RoutePlan.prototype.suspendSave = function () {
			/// <summary>Suspends current &quot;onSave&quot; process and allows performing asynchronous tasks to save the data.</summary>
			/// <returns type="Object">A request object with single method &quot;resumeSave&quot; which has to be called with the result (either error message string or &quot;null&quot; in case of success). To cancel the validation without any message, pass "#NoMessage#" text to this method.</returns>
			var cmdId = "RoutePlanPendingValidation" + (++_pendingRoutePlanSaveId);
			var self = this;
			self.context.pendingSaveCommand = cmdId;
			return {
				resumeSave: function (result) {
					if (self._inCallback) {
						// still in "onSave" callback - do not send a command (handler not installed yet)
						self.context.errorMessage = result;
						self.context.pendingSaveCommand = null;
					}
					else
						MobileCRM.bridge.command(cmdId, result);
				}
			};
		}
		var _pendingRPPostSaveId = 0;
		MobileCRM.UI.RoutePlan.prototype.suspendPostSave = function () {
			/// <summary>Suspends current &quot;onPostSave&quot; operations and allows performing another asynchronous tasks before the form is closed.</summary>
			/// <returns type="Object">A request object with single method &quot;resumePostSave&quot; which has to be called to resume the post-save operations.</returns>
			var cmdId = "RoutePlanPendingPostSave" + (++_pendingRPPostSaveId);
			var _this = this;
			_this.context.pendingPostSaveCommand = cmdId;
			return {
				resumePostSave: function () {
					if (_this._inCallback) {
						// still in "onPostSave" callback - do not send a command (handler not installed yet)
						_this.context.pendingPostSaveCommand = null;
					}
					else
						MobileCRM.bridge.command(cmdId);
				}
			};
		};
		MobileCRM.UI.RoutePlan._callHandlers = function (event, data, context) {
			var handlers = MobileCRM.UI.RoutePlan._handlers[event];
			if (handlers && handlers.length > 0) {
				data.context = context;
				data._inCallback = true;
				var result = '';
				if (_callHandlers(handlers, data) != false) {
					var changed = data.getChanged();
					result = JSON.stringify(changed);
				}
				data._inCallback = false;
				return result;
			}
		};
		MobileCRM.UI.RoutePlan._handlers = { onSave: [], onPostSave: [], onRouteReloaded: [], onItemAdded: [], onItemRemoved: [], onItemCompleted: [], onItemSave: [], onItemPostSave: [] };

		_inherit(MobileCRM.UI.TourplanForm, MobileCRM.ObservableObject);       
		MobileCRM.UI.TourplanForm.requestObject = function (callback, errorCallback, scope) {
			/// <summary>Requests the managed TourplanForm object.</summary>
			/// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of TourplanForm object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
			/// <param name="callback" type="function(platform)">The callback function that is called asynchronously with serialized TourplanForm object as argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.requestObject("Tourplan", callback, errorCallback, scope);
		};
		MobileCRM.UI.TourplanForm.setDate = function (date, callback, errorCallback) {
			/// <summary>Sets the current date in calendar view (Tourplan).</summary>
			/// <param> name="date" type="Date">A date to set.</param>
			/// <apram name="callback" type="Function">Optional callback called after successfull change.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			MobileCRM.bridge.command("setDate", JSON.stringify(date), callback, errorCallback);
		};
		MobileCRM.UI.TourplanForm.setMode = function (mode, callback, errorCallback) {
			/// <summary>Sets the calendar view (Tourplan) mode.</summary>
			/// <param> name="mode" type="MobileCRM.UI.TourplanViewMode">A mode to set.</param>
			/// <apram name="callback" type="Function">Optional callback called after successfull change.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			MobileCRM.bridge.command("setMode", JSON.stringify(mode), callback, errorCallback);
		};
		MobileCRM.UI.TourplanForm.onCreateNew = function (handler, bind, scope) {
			/// <summary>[v11.3] Binds or unbinds the handler for creating new appointment after long-pressing on calendar.</summary>
			/// <remarks>Bound handler is called with the TourplanForm object as an argument. The context object contains &quot;start&quot;, &quot;end&quot;, &quot;entityName&quot; properties and optionally &quot;subject&quot; property.</remarks>
			/// <param name="handler" type="function(tourplanForm)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			var handlers = MobileCRM.UI.TourplanForm._handlers.onCreateNew;
			var register = handlers.length == 0;
			_bindHandler(handler, handlers, bind, scope);
			if (register)
				MobileCRM.bridge.command("registerEvents", "onCreateNew");
		}
		MobileCRM.UI.TourplanForm._callHandlers = function (event, data, context) {
			var handlers = MobileCRM.UI.TourplanForm._handlers[event];
			if (handlers && handlers.length > 0) {
				data.context = context;
				data._inCallback = true;
				var result = '';
				if (_callHandlers(handlers, data) != false) {
					var changed = data.getChanged();
					result = JSON.stringify(changed);
				}
				data._inCallback = false;
				return result;
			}
		};
		MobileCRM.UI.TourplanForm._handlers = { onCreateNew: [] };

		MobileCRM.UI._AppointmentView = function () {
		    /// <summary>Represents the Javascript equivalent view of tourplan form object.</summary>
		    /// <field name="name" type="String">Gets the name of view.</field>
		    /// <field name="isVisible" type="Boolean">Gets or sets whether the view is visible.</field>
		    /// <field name="mode" type="MobileCRM.UI.TourplanViewMode">Gets a view mode <see cref="MobileCRM.UI.TourplanViewMode">MobileCRM.UI.TourplanViewMode</see>.</field>
		    /// <field name="currentDate" type="Date">Gets the current date of displayed view.</field>
		};

	    _inherit(MobileCRM.UI._DetailView, MobileCRM.ObservableObject);
	    MobileCRM.UI._DetailView.prototype.getItemByName = function (name) {
	        /// <summary>Returns the <see cref="MobileCRM.UI._DetailItem">MobileCRM.UI._DetailItem</see> with specified name or "null".</summary>
	        /// <param name="name" type="String">A name of requested detail item.</param>
	        /// <returns type="MobileCRM.UI._DetailItem">An instance of <see cref="MobileCRM.UI._DetailItem">MobileCRM.UI._DetailItem</see> with specified name or "null".</returns>
	        var items = this.items;
	        var nItems = items.length;
	        for (var i = 0; i < nItems; i++) {
	            var item = items[i];
	            if (item.name == name)
	                return item;
	        }
	        return undefined;
	    };
	    MobileCRM.UI._DetailView.prototype.getItemIndex = function (name) {
	        /// <summary>Returns index of <see cref="MobileCRM.UI._DetailItem">MobileCRM.UI._DetailItem</see> with specified name or -1.</summary>
	        /// <param name="name" type="String">A name of requested detail item.</param>
	        /// <returns type="Number">Index of <see cref="MobileCRM.UI._DetailItem">MobileCRM.UI._DetailItem</see> with specified name or -1.</returns>
	        var items = this.items;
	        var nItems = items.length;
	        for (var i = 0; i < nItems; i++) {
	            var item = items[i];
	            if (item.name == name)
	                return i;
	        }
	        return -1;
		};
		MobileCRM.UI._DetailView.prototype.addItemToGrid = function (gridName, item, column, row, colSpan, rowSpan) {
			/// <summary>[since 13.1] Add detail item to desired position in to grid.</summary>
			/// <param name="gridName" type="String"> name of grid item.</param>
			/// <param name="item" type="MobileCRM.UI.DetailViewItems.Item">Detail item <see cref="MobileCRM.UI.DetailViewItems.Item">MobileCRM.UI.DetailViewItems.Item</see>object.</param>
			/// <param name="column" type="Number">Optional Column x axis parameter, default is 0.</param>
			/// <param name="row" type="Number">Optional Row y axis parameter, default is 0.</param>
			/// <param name="colSpan" type="Number">Optional Column width x axis width , default is 1.</param>
			/// <param name="rowSpan" type="Number">Optional Row width y axis width, default is 1.</param>

			var grid = this.getItemByName(gridName);
			if (grid && grid.items) { // simple validation if item exists and is type of grid (only grid has items) | check for instance of is not working.
				var data = {};
				item.column = column || 0;
				item.row = row || 0;
				item.colSpan = colSpan || 1;
				item.rowSpan = rowSpan || 1;

				data.action = "addToGrid";
				data.viewName = this.name;
				data.index = this.getItemIndex(gridName);
				data.name = gridName;

				for (var prop in item) {
					data[prop] = item[prop];
				}

				MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
			}
		};
		MobileCRM.UI._DetailView.prototype.insertItem = function (item, index) {
			/// <summary>[v8.0] Inserts the <see cref="MobileCRM.UI.DetailViewItems.Item">MobileCRM.UI.DetailViewItems.Item</see> into this detailed view.</summary>
			/// <param name="item" type="MobileCRM.UI.DetailViewItems.Item">An item to be added.</param>
			/// <param name="index" type="Number">An index on which the item should be placed. Set to -1 to append the item at the end.</param>

			var data = {};
			data.GridItems = {};
			for (var prop in item) {
				if (prop === "items" && item._type === "Grid") {
					data.GridItems[item.name] = item.items;
					continue;
				}
				data[prop] = item[prop];
			}

			data.action = "insert";
			data.viewName = this.name;
			data.index = typeof (index) !== "undefined" ? index : -1;
			MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
		};
		MobileCRM.UI._DetailView.prototype.insertItems = function (items, index) {
			/// <summary>[v8.0] Inserts the <see cref="MobileCRM.UI.DetailViewItems.Item">MobileCRM.UI.DetailViewItems.Item</see> into this detailed view.</summary>
			/// <param name="items" type="Array(MobileCRM.UI.DetailViewItems.Item)">An array of items to be added.</param>
			/// <param name="index" type="Number">An index on which the items should be placed. Set to -1 to append the items at the end.</param>
			var data = {};
			data.items = [];
			data.GridItems = {};
			for (var item in items) {
				var tmpItem = {};
				for (var prop in items[item]) {
					if (prop === "items" && items[item]._type === "Grid") {
						data.GridItems[items[item].name] = items[item].items;
						continue;
					}
					tmpItem[prop] = items[item][prop];
				}
				data.items.push(tmpItem);
			}

			data.action = "insertMultiple";
			data.viewName = this.name;
			data.index = typeof (index) !== "undefined" ? index : -1;
			MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
		};
	    MobileCRM.UI._DetailView.prototype.removeItem = function (index) {
	        /// <summary>[v8.0] Removes the item from this detailed view.</summary>
	        /// <param name="index" type="Number">An index of the item which has to be removed.</param>
	        var data = {
	            action: "delete",
	            viewName: this.name,
	            index: index
	        };
	        MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
	    };
	    MobileCRM.UI._DetailView.prototype.removeItems = function (indexes) {
	        /// <summary>[v8.0] Removes all items from this detailed view.</summary>
	        /// <param name="indexes" type="Array">An array of item indexes that has to be removed.</param>
	        var data = {
	            action: "delete",
	            viewName: this.name,
	            index: indexes
	        };
	        MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
	    };
	    MobileCRM.UI._DetailView.prototype.startEditItem = function (index) {
	        /// <summary>[v9.2] Starts editing the detail item and sets the focus on it.</summary>
	        /// <param name="index" type="Number">Selected item index.</param>
	        if (index < 0) {
	            MobileCRM.bridge.log("DetailView.startEditItem: Index must not be negative.");
	            return;
	        }
	        var data = {
	            action: "startEditItem",
	            viewName: this.name,
	            index: index
	        };
	        MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
	    };
	    MobileCRM.UI._DetailView.prototype.updateComboItemDataSource = function (index, listDataSource, valueType, defaultValue) {
			/// <summary>[v9.1] Changes the data source for CombobBoxitem <see cref="MobileCRM.UI.DetailViewItems.Item">MobileCRM.UI.DetailViewItems.ComboBoxItem</see>.</summary>
			/// <param name="index" type="Number">Item index on the view.</param>
			/// <param name="listDataSource" type="Object">The data source object (e.g. {&quot;label1&quot;:1, &quot;label2&quot;:2}).</param>
			/// <param name="valueType" type="String">Type of list data source element value. Default is string, allowed int, string.</param>
			/// <param name="defaultValue" type="String">New data source default value. If not defined, the first item from listDataSource will be used.</param>
			var data = {
				action: "updateDataSource",
				viewName: this.name,
				index: index,
				listDataSource: listDataSource,
				value: defaultValue || listDataSource[Object.keys(listDataSource)[0]],
				listDataSourceValueType: valueType
			};
			// Code used in version < 11.2
			//this.items[index].value = defaultValue !== undefined ? defaultValue : listDataSource[Object.keys(listDataSource)[0]];
			MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
		};
	    MobileCRM.UI._DetailView.prototype.updateLinkItemViews = function (index, dialogSetup, inlinePickSetup, dialogOnly) {
	        /// <summary>[v10.1] Changes the <see cref="MobileCRM.UI.DetailViewItems.ComboBoxItem">ComboBoxItem</see> views and/or filters.</summary>
	        /// <param name="index" type="Number">Item index on the view.</param>
	        /// <param name="dialogSetup" type="MobileCRM.UI.DetailViewItems.LookupSetup">Lookup setup for modal lookup dialog.</param>
	        /// <param name="inlinePickSetup" type="MobileCRM.UI.DetailViewItems.LookupSetup">Optional setup for inline lookup picker. Leave empty to use the same setup as modal dialog.</param>
	        /// <param name="dialogOnly" type="Boolean">Indicates whether to allow the inline picker. Set &quot;true&quot; to disable the inline picker and always use the modal dialog. Set &quot;false&quot; to allow the inline picker.<param>
	        var xml = "<lookup>";
	        xml += dialogSetup._serialize();
	        if (!dialogOnly && inlinePickSetup)
	            xml += inlinePickSetup._serialize();
	        xml += "<dialog>" + (dialogOnly ? 1 : 0) + "</dialog>";
	        xml += "</lookup>";

	        var data = {
	            action: "updateLookupFilter",
	            viewName: this.name,
	            index: index,
	            views: xml
	        };

	        MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
	    };
	    MobileCRM.UI.DetailViewItems.LookupSetup = function () {
	        /// <summary>Represents a configuration for lookup and inline lookup.</summary>
	        /// <remarks>Defines the lookup records filter for <see cref="MobileCRM.UI._DetailView.updateLinkItemViews">updateLinkItemViews</see></remarks>
	        this._views = [];
	        this._filters = null;
	        this.dialogOnly = false;
	    };
	    MobileCRM.UI.DetailViewItems.LookupSetup.prototype.addView = function (entityName, viewName, isDefault) {
	        /// <summary>Appends an entity view to the list of allowed views.</summary>
	        /// <param name="entityName" type="string">Entity logical name.</param>
	        /// <param name="viewName" type="string">A name of the view.</param>
	        /// <param name="isDefault" type="Boolean">true, if the view should be set as default.</param>
	        this._views.push({
	            entity: entityName, view: viewName, isDefault: isDefault
	        });
	    };
	    MobileCRM.UI.DetailViewItems.LookupSetup.prototype.addFilter = function (entityName, filterXml) {
	        /// <summary>Defines a fetch XML filter for entity records.</summary>
	        /// <param name="entityName" type="string">Entity logical name.</param>
	        /// <param name="filterXml" type="string">A string defining the fetch XML which has to be applied as filter for entity records.</param>
	        if (!this._filters)
	            this._filters = {};
	        this._filters[entityName] = filterXml;
	    };
	    MobileCRM.UI.DetailViewItems.LookupSetup.prototype._serialize = function () {
	        var _escape = function (st) {
	            var xml_special_to_escaped_one_map = { '<': '&lt;', '>': '&gt;' };
	            return st.replace(/([<>])/g, function (str, item) {
	                return xml_special_to_escaped_one_map[item];
	            });
	        };

	        var firstOne = true;
	        var xml = "<extra><views>";
	        if (this._views.length > 0) {
	            for (var i in this._views) {
	                var view = this._views[i];
	                var entityName = view.entity;

	                if (firstOne)
	                    firstOne = false;
	                else
	                    xml += ":";

	                xml += _escape(entityName + (view.isDefault ? ".@" : ".") + view.view);
	            }
	        }
	        xml += "</views>";

	        if (this._filters) {
	            for (var entity in this._filters) {
	                var filter = this._filters[entity];
	                xml += "<filter entity='" + entity + "'>" + _escape(filter) + "</filter>";
	            }
	        }

	        xml += "</extra>";
	        return xml;
	    };

		MobileCRM.UI._DetailView.prototype.registerClickHandler = function (item, callback, scope) {
			/// <summary>[v8.0] Installs the handler which has to be called when user clicks on the link item.</summary>
			/// <param name="item" type="MobileCRM.UI.DetailViewItems.LinkItem">An item</param>
			/// <param name="callback" type="function(String, String)">A callback which is called when user clicks on the link item. It obtains the link item name and the detail view name as arguments.</param>
			/// <param name="scope" type="Object">A scope, in which the callback has to be called.</param>

			if (!MobileCRM.UI._DetailView._handlers) {
				MobileCRM.UI._DetailView._handlers = [];
			}
			var handlers = MobileCRM.UI._DetailView._handlers;
			var index = this.name + "." + item.name;

			handlers[index] = { handler: callback, scope: scope };

			var itemIndex = this.getItemIndex(item.name);
			if (itemIndex > -1) { // execute command to register click handler for existing item only.
				var data = {
					action: "registerLinkItemClickHandler",
					viewName: this.name,
					index: itemIndex
				};
				MobileCRM.bridge.command("detailViewAction", JSON.stringify(data));
			}
		};
	    MobileCRM.UI._DetailView._callHandler = function (viewName, itemName) {
	        var index = viewName + "." + itemName;
	        var handlerDescriptor = MobileCRM.UI._DetailView._handlers[index];
	        if (handlerDescriptor && handlerDescriptor.handler) {
	            if (handlerDescriptor.scope)
	                handlerDescriptor.handler.apply(handlerDescriptor.scope, itemName, viewName);
	            else
	                handlerDescriptor.handler(itemName, viewName);
	        }
	    };
	    _inherit(MobileCRM.UI.DetailViewItems.SeparatorItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.TextBoxItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.NumericItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.CheckBoxItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.DateTimeItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.DurationItem, MobileCRM.UI.DetailViewItems.Item);
	    _inherit(MobileCRM.UI.DetailViewItems.ComboBoxItem, MobileCRM.UI.DetailViewItems.Item);
		_inherit(MobileCRM.UI.DetailViewItems.LinkItem, MobileCRM.UI.DetailViewItems.Item);
		_inherit(MobileCRM.UI.DetailViewItems.ButtonItem, MobileCRM.UI.DetailViewItems.Item);
		_inherit(MobileCRM.UI.DetailViewItems.GridItem, MobileCRM.UI.DetailViewItems.Item);

		// MobileCRM.UI.DetailViewItems.GridItem
		MobileCRM.UI.DetailViewItems.GridItem.prototype.addItem = function (item, column, row, colSpan, rowSpan) {
			/// <summary>[since 13.1] Add detail item to desired position in to grid.</summary>
			/// <param name="item" type="MobileCRM.UI.DetailViewItems.Item">Detail item <see cref="MobileCRM.UI.DetailViewItems.Item">MobileCRM.UI.DetailViewItems.Item</see>object.</param>
			/// <param name="column" type="Number">Optional Column x axis parameter, default is 0.</param>
			/// <param name="row" type="Number">Optional Row y axis parameter, default is 0.</param>
			/// <param name="colSpan" type="Number">Optional Column width x axis width , default is 1.</param>
			/// <param name="rowSpan" type="Number">Optional Row width y axis width, default is 1.</param>

			item.column = column || 0;
			item.row = row || 0;
			item.colSpan = colSpan || 1;
			item.rowSpan = rowSpan || 1;
			this.items.push(item);
		};
		MobileCRM.UI.DetailViewItems.GridItem.prototype._setGrid = function (columns, rows) {
			this.columns = [];
			this.rows = [];
			for (var cl in columns) {
				var col = columns[cl];
				var objC = {};
				objC[col._value] = col._gridUnitType;
				this.columns.push(objC);
			}
			for (var rw in rows) {
				var row = rows[rw];
				var objR = {};
				objR[row._value] = row._gridUnitType;
				this.rows.push(objR);
			}
		};
	    // MobileCRM.UI.ViewController
	    MobileCRM.UI.ViewController.createCommand = function (primary, labels, callback, scope) {
	        /// <summary>Overrides the form's primary/secondary command button.</summary>
	        /// <param name="primary" type="Boolean">true, for primary button; false, for secondary button.</param>
	        /// <param name="labels" type="Array/String">An array of labels or single label.</param>
	        /// <param name="callback" type="Function">A callback which is called when command is launched.</param>
	        /// <param name="scope" type="Object">A scope, in which the callback has to be called.</param>
	        var cmdId = MobileCRM.bridge._createCmdObject(callback, null, scope);
	        if (typeof labels == "string")
	            labels = [labels];
	        MobileCRM.bridge.command("createCommand", JSON.stringify({ commandId: cmdId, primary: primary, labels: labels }));
	    };

	    // MobileCRM.UI.ProcessController
	    _inherit(MobileCRM.UI.ProcessController, MobileCRM.ObservableObject);

	    MobileCRM.UI.ProcessController.prototype.changeProcess = function (processRef, errorCallback, scope) {
	        /// <summary>[v8.2] Changes (or clears) the business process flow for the current entity.</summary>
	        /// <param name="processRef" type="MobileCRM.Reference">A reference to the workflow entity defining the process to use, or null to disable BusinessProcessFlow.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        var controller = MobileCRM.bridge.exposeObjectAsync("EntityForm.GetController", [this.view.name]);
	        controller.invokeMethodAsync("ChangeProcessTo", [processRef], function () { }, errorCallback, scope);
	        controller.release();
	    };
		
	    // MobileCRM.UI.ViewDefinition
	    MobileCRM.UI.ViewDefinition.loadEntityViews = function (entityName, callback, errorCallback, scope) {
	        /// <summary>Asynchronously loads all view definitions for given entity.</summary>
	        /// <param name="entityName" type="String">The entity name.</param>
	        /// <param name="callback" type="function(viewDefArray)">The callback function which is called asynchronously. Callback will obtain an array of ViewDefinition objects.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm.UI", "MobileCrm.UI.ViewParser", "LoadListViews", [entityName], callback, errorCallback, scope);
	    };

	    // MobileCRM.UI.MessageBox
	    MobileCRM.UI.MessageBox.prototype.show = function (success, failed, scope) {
	        /// <summary>Shows a popup window which allows the user to choose one of the actions.</summary>
	        /// <param name="success" type="function(obj)">The callback function that is called with chosen item string.</param>
	        /// <param name="failed" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("messageBox", JSON.stringify(this), success, failed, scope);
	    };
		MobileCRM.UI.MessageBox.prototype.showAsync = function () {
			/// <summary>Shows a popup window allowing user to choose one of actions.</summary>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with chosen item string.</returns>
			return MobileCRM.bridge.invokeCommandPromise("messageBox", JSON.stringify(this));
		};

	    MobileCRM.UI.MessageBox.sayText = function (text, success, failed, scope) {
	        /// <summary>Shows a simple popup window with a multi-line text.</summary>
	        /// <param name="text" type="String">A text to be shown.</param>
	        /// <param name="success" type="function">The callback function that is called after user closes the message box.</param>
	        /// <param name="failed" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var mb = new MobileCRM.UI.MessageBox(text);
	        mb.items = ["OK"];
	        mb.multiLine = true;
	        mb.show(success, failed, scope);
	    };
		MobileCRM.UI.MessageBox.sayTextAsync = function (text) {
			/// <summary>Shows a simple popup window with a multi-line text.</summary>
			/// <param name="text" type="String">A text to be shown.</param>
			/// <returns type="Promise&lt;void&gt;">A Promise object which will be resolved when user closes the message box.</returns>
			var mb = new MobileCRM.UI.MessageBox(text);
			mb.items = ["OK"];
			mb.multiLine = true;
			return mb.showAsync();
		};

	    // MobileCRM.UI.LookupForm
	    MobileCRM.UI.LookupForm.prototype.addView = function (entityName, viewName, isDefault) {
	        /// <summary>Appends an entity view to the list of allowed views.</summary>
	        /// <param name="entityName" type="string">Entity logical name.</param>
	        /// <param name="viewName" type="string">A name of the view.</param>
	        /// <param name="isDefault" type="Boolean">true, if the view should be set as default.</param>
	        this._views.push({
	            entity: entityName, view: viewName, isDefault: isDefault
	        });
	    };
	    MobileCRM.UI.LookupForm.prototype.addEntityFilter = function (entityName, filterXml) {
	        /// <summary>Defines a fetch XML filter for entity records.</summary>
	        /// <param name="entityName" type="string">Entity logical name.</param>
	        /// <param name="filterXml" type="string">A string defining the fetch XML which has to be applied as filter for entity records.</param>
	        if (!this._filters)
	            this._filters = {};
	        this._filters[entityName] = filterXml;
	    };
	    MobileCRM.UI.LookupForm.prototype.show = function (success, failed, scope) {
	        /// <summary>Shows a dialog which allows the user to select an entity from a configurable list of entity types.</summary>
	        /// <param name="success" type="function(obj)">The callback function that is called with chosen <see cref="MobileCRM.Reference">MobileCRM.Reference</see> object.</param>
	        /// <param name="failed" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("lookupForm", JSON.stringify(this._constructParams()), success, failed, scope);
	    };
		MobileCRM.UI.LookupForm.prototype.showAsync = function () {
			/// <summary>Shows a dialog which allows the user to select an entity from a configurable list of entity types.</summary>
			/// <returns type="Promise&lt;MobileCRM.Reference&gt;">A Promise object which will be resolved with a Reference object representing chosen entity record.</returns>
			return MobileCRM.bridge.invokeCommandPromise("lookupForm", JSON.stringify(this._constructParams()));
		};
	    MobileCRM.UI.LookupForm.prototype._constructParams = function () {
	        var _escape = function (st) {
	            var xml_special_to_escaped_one_map = { '<': '&lt;', '>': '&gt;' };				
	            return st.replace(/([<>])/g, function (str, item) {
	                return xml_special_to_escaped_one_map[item];
	            });
	        };

	        var obsoleteViews, obsoleteFilters;
	        if (this.allowedViews) {
	            // Decide whether the obsolete prop contains a filter or a view list
	            if (this.allowedViews[0] == "<")
	                obsoleteFilters = this.allowedViews;
	            else
	                obsoleteViews = this.allowedViews;
	        }

	        var firstOne = true;
	        var xml = "<extra><views>";
	        if (this._views.length > 0) {
	            for (var i in this._views) {
	                var view = this._views[i];
	                var entityName = view.entity;
	                if (this.entities.indexOf(entityName) < 0)
	                    this.entities.push(entityName);

	                if (firstOne)
	                    firstOne = false;
	                else
	                    xml += ":";

	                xml += _escape(entityName + (view.isDefault ? ".@" : ".") + view.view);
	            }
	        }
	        if (obsoleteViews) {
	            if (!firstOne)
	                xml += ":";
	            xml += _escape(this.allowedViews);
	        }
	        xml += "</views>";

	        if (this._filters) {
	            for (var entity in this._filters) {
	                var filter = this._filters[entity];
	                xml += "<filter entity='" + entity + "'>" + _escape(filter) + "</filter>";
	            }
	        }
	        else if (obsoleteFilters && this.entities.length > 0)
	            xml += "<filter entity='" + this.entities[0] + "'>" + _escape(obsoleteFilters) + "</filter>";

	        xml += "</extra>";
	        return { entities: this.entities, source: this.source, prevSelection: this.prevSelection, allowedViews: xml, allowNull: this.allowNull, preventClose: this.preventClose };
	    };

	    // MobileCRM.UI.MultiLookupForm
	    _inherit(MobileCRM.UI.MultiLookupForm, MobileCRM.UI.LookupForm);
	    MobileCRM.UI.MultiLookupForm.prototype.show = function (success, failed, scope) {
	        /// <summary>Shows a dialog which allows the user to select a list of entities from a configurable list of entity types.</summary>
	        /// <param name="success" type="function(obj)">The callback function that is called with chosen array of <see cref="MobileCRM.Reference">MobileCRM.Reference</see> objects.</param>
	        /// <param name="failed" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = this._constructParams();
	        params.dataSource = this.dataSource;
	        MobileCRM.bridge.command("multiLookupForm", JSON.stringify(params), success, failed, scope);
	    };
		MobileCRM.UI.MultiLookupForm.prototype.showAsync = function () {
			/// <summary>Shows a dialog which allows the user to select a list of entities from a configurable list of entity types.</summary>
			/// <returns type="Promise&lt;MobileCRM.Reference[]&gt;">A Promise object which will be resolved with an array of Reference objects representing chosen entity records.</returns>
			var params = this._constructParams();
			params.dataSource = this.dataSource;
			return MobileCRM.bridge.invokeCommandPromise("multiLookupForm", JSON.stringify(params));
		};

	    // MobileCRM.UI.Form
	    _inherit(MobileCRM.UI.Form, MobileCRM.ObservableObject);
	    MobileCRM.UI.Form.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0] Requests the currently opened Form object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of Form object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(form)">The callback function that is called asynchronously with serialized Form object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("Form", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    };

	    MobileCRM.UI.Form.showPleaseWait = function (caption) {
	        /// <summary>Shows a please wait message, disabling the form except for the close command.</summary>
	        /// <param name="caption" type="String">Wait message.</param>
	        /// <returns type="Object">An object representing the UI component with single method &quot;close&quot;.</returns>
	        var obj = MobileCRM.bridge.exposeObjectAsync("Form.ShowPleaseWait", [caption]);
	        return {
	            close: function () {
	                obj.invokeMethodAsync("Dispose", []);
	                obj.release();
	            }
	        };
		};

		MobileCRM.UI.Form.showToast = function (message, icon) {
			/// <summary>Shows a toast window over the app window which is dismissed after a few seconds.</summary>
			/// <param name="message" type="String">A toast content message.</param>
			/// <param name="icon" type="String">Valid app image name (e.g. Home.Now.png).</param>
			MobileCRM.bridge.invokeStaticMethodAsync("Resco.UI", "Resco.UI.FormFactory", "ShowToastInfo.Invoke", [message, icon]);
		};

	    // MobileCRM.UI.HomeForm
	    _inherit(MobileCRM.UI.HomeForm, MobileCRM.ObservableObject);
	    MobileCRM.UI.HomeForm.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0] Requests the managed HomeForm object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of HomeForm object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(homeForm)">The callback function that is called asynchronously with serialized HomeForm object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("HomeForm", function (obj) {
	            obj.lastSyncResult = new MobileCRM.Services.SynchronizationResult(obj.lastSyncResult);
	            delete obj._privChanged.lastSyncResult;
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    };

	    MobileCRM.UI.HomeForm.openHomeItemAsync = function (name, errorCallback, scope) {
	        /// <summary>[v8.0] Opens the specified HomeItem.</summary>
	        /// <param name="name" type="String">The name of the HomeItem to be opened. It can be either the entity logical name (e.g. &quot;contact&quot;) or one of following special forms names: &quot;@Dashboard&quot;, &quot;@Map&quot;, &quot;activity&quot;, &quot;@Tourplan&quot;,&quot;@CallImport&quot;,&quot;@Setup&quot;,&quot;@About&quot;.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.ShowHomeItemByName", [name], null, errorCallback, scope);
	    };
	    MobileCRM.UI.HomeForm.openHomeGroupItemAsync = function (items, errorCallback, scope) {
	        /// <summary>[v10.1.1] Opens the specified HomeItem in specific group.</summary>
	        /// <param name="items" type="Array">A list of group and subgroups representing the path to the home item.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var path = "";
	        for (var i in items)
	            path += "\\" + items[i];

	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.ShowHomeGroupItem", [path], null, errorCallback, scope);
	    };
	    MobileCRM.UI.HomeForm.updateHomeItemAsync = function (items, title, subTitle, badge, errorCallback, scope) {
	        /// <summary>[v10.2] Updates specified HomeItem in specific group.</summary>
	        /// <param name="items" type="Array">A list of group and subgroups representing the path to the home item.</param>
	        /// <param name="title" type="String">The title for the home item.</param>
	        /// <param name="subTitle" type="String">The title for the home item.</param>
	        /// <param name="badge" type="String">The title for the home item.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var path = "";
	        for (var i in items)
	            path += "\\" + items[i];

	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.UpdateHomeItem", [path, title, subTitle, badge], null, errorCallback, scope);
	    };
	    MobileCRM.UI.HomeForm.updateHomeItems = function (items) {
	        /// <summary>[v10.3] Updates specified home items.</summary>
	        /// <param name="items" type="Array">A list of home item that has to be changed. Each home item is an object with following properties: path, title, subTitle, badge, isVisible.</param>
	        MobileCRM.bridge.invokeStaticMethodAsync("MobileCrm", "MobileCrm.Controllers.HomeForm", "Instance.UpdateHomeItems", [JSON.stringify(items)]);
	    };
	    MobileCRM.UI.HomeForm.closeHomeItemAsync = function (name, errorCallback, scope) {
	        /// <summary>[v8.0] Close the specified HomeItem.</summary>
	        /// <param name="name" type="String">The name of the HomeItem to be opened. It can be either the entity logical name (e.g. &quot;contact&quot;), custom name as defined in Woodford or one of following special names: &quot;@Dashboard&quot;, &quot;@Map&quot;, &quot;@activity&quot;, &quot;@Tourplan&quot;,&quot;@CallImport&quot;,&quot;@Setup&quot;,&quot;@About&quot;.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.UI.HomeForm.requestObject(function (homeForm) {
	            for (var i in homeForm.items) {
	                var item = homeForm.items[i];
                    if (item.name == name || item.uniqueName === name) {
	                    var item = MobileCRM.bridge.exposeObjectAsync("HomeForm.Items.get_Item", [i]);
	                    item.invokeMethodAsync("CloseForm", [], null, errorCallback, scope);
	                    item.release();
	                    return;
	                }
	            }
	        }, errorCallback, scope);
	    };
	    MobileCRM.UI.HomeForm.closeForms = function (callback, errorCallback, scope) {
	        /// <summary>[v8.0] Close all opened forms.</summary>
	        /// <param name="callback" type="function()">The callback function that is called asynchronously after forms were closed successfully.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("HomeForm", "TryCloseForms", [false], function () {
	            callback.call(scope);
	        }, errorCallback, scope);
	    }
	    MobileCRM.UI.HomeForm.hideUIReplacement = function () {
	        /// <summary>[v8.0] Hides the UI replacement iframe and shows the classic home form.</summary>
	        MobileCRM.bridge.invokeMethodAsync("HomeForm", "HideUIReplacement", []);
	    };
	    MobileCRM.UI.HomeForm.restoreUIReplacement = function () {
	    	/// <summary>[v11.0] Restores previously hidden UI replacement iframe and hides the classic home form.</summary>
	    	MobileCRM.bridge.invokeMethodAsync("HomeForm", "RestoreUIReplacement", []);
	    };

	    MobileCRM.UI.HomeForm._syncFinishedCallbacks = [];

	    MobileCRM.UI.HomeForm.onSyncFinished = function (handler, scope) {
	        /// <summary>[v8.1] Binds the new handler to the synchronization finish event.</summary>
	        /// <param name="handler" type="function(homeForm)">A function which will be called when the synchronization finished event occurs with current instance of the MobileCRM.UI.HomeForm as parameter.</param>
	        /// <param name="scope" type="Object">A scope in which the handler should be called.</param>
	        _bindHandler(handler, MobileCRM.UI.HomeForm._syncFinishedCallbacks, true, scope);
	    };
	    MobileCRM.UI.HomeForm._raiseSyncFinished = function (homeForm) {
	        var handlers = MobileCRM.UI.HomeForm._syncFinishedCallbacks;
	        if (handlers && handlers.length > 0) {
	            var result = '';
	            homeForm.lastSyncResult = new MobileCRM.Services.SynchronizationResult(homeForm.lastSyncResult);
	            delete homeForm._privChanged.lastSyncResult;
	            if (_callHandlers(handlers, homeForm) != false) {
	                var changed = homeForm.getChanged();
	                result = JSON.stringify(changed);
	            }
	            return result;
	        }
	    }
		
	    // MobileCRM.UI.ReportForm
	    MobileCRM.UI.ReportForm.prototype.show = function (success, failed, scope) {
	        /// <summary>Shows the Dynamics CRM report form.</summary>
	        /// <param name="success" type="function(obj)">The callback function that is called if the report form was successfully opened.</param>
	        /// <param name="failed" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = { allowedReportIds: this.allowedReportIds, allowedLanguages: this.allowedLanguages, defaultReport: this.defaultReport };
	        MobileCRM.bridge.command("showReport", JSON.stringify(params), success, failed, scope);
	    };
	    MobileCRM.MobileReport.runReport = function (fetch, reportXML, reportFormat, isExportOnly, isOnline, outputFile, success, failed, scope) {
	        /// <summary>[v9.1] Executes the mobile reporting request which produces the mobile report document of given format.</summary>
	        /// <param name="fetch" type="String">The fetch XML defining the entity (entities) query used as report input.</param>
	        /// <param name="reportXML" type="String">The mobile report XML definition which can be loaded from the resco_report entity or constructed dynamically. Ignored if IsExportOnly parameter is true.</param>
	        /// <param name="reportFormat" type="String">Report format: Pdf (default), Html, Excel, Text.</param>
	        /// <param name="isExportOnly" type="Boolean">If true then ReportXml is optional. The default is false.</param>
	        /// <param name="isOnline" type="Boolean">Indicates whether the report should be run against the online data or local database. The default is current application mode.</param>
	        /// <param name="outputFile" type="String">The full path to the output file. If omitted a temp file is created. The output path is always passed to the success callback.</param>
	        /// <param name="success" type="function(obj)">A callback function that is called with the file path to successfully created report.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>

	        var params = { SourceFetch: fetch, ReportFormat: reportFormat || "Pdf", IsExportOnly: isExportOnly, IsOnline: isOnline };
	        if (reportXML)
	            params.ReportXml = reportXML;
	        if (outputFile)
	            params.OutputFile = outputFile;

	        MobileCRM.bridge.command("runMobileReportAsync", JSON.stringify(params), success, failed, scope);
	    };
		MobileCRM.MobileReport.runReportAsync = function (fetch, reportXML, reportFormat, isExportOnly, isOnline, outputFile) {
			/// <summary>[v9.1] Executes the mobile reporting request which produces the mobile report document of given format.</summary>
			/// <param name="fetch" type="String">The fetch XML defining the entity (entities) query used as report input.</param>
			/// <param name="reportXML" type="String">The mobile report XML definition which can be loaded from the resco_report entity or constructed dynamically. Ignored if IsExportOnly parameter is true.</param>
			/// <param name="reportFormat" type="String">Report format: Pdf (default), Html, Excel, Text.</param>
			/// <param name="isExportOnly" type="Boolean">If true then ReportXml is optional. The default is false.</param>
			/// <param name="isOnline" type="Boolean">Indicates whether the report should be run against the online data or local database. The default is current application mode.</param>
			/// <param name="outputFile" type="String">The full path to the output file. If omitted a temp file is created.</param>
			/// <returns type="Promise&lt;string&gt;">A Promise object which will be resolved with the file path to successfully created report.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.MobileReport.runReport(fetch, reportXML, reportFormat, isExportOnly, isOnline, outputFile, resolve, function (err) { reject(new Error(err)); });
			});
		};
	    MobileCRM.MobileReport.showForm = function (entity, source, fetchXml, failed, scope) {
	        /// <summary>[v10.1] Shows new MobileReport form.</summary>
	        /// <param name="entity" type="MobileCRM.Reference">Report Entity reference what the report is related to.</param>
	        /// <param name="source" type="MobileCRM.Reference[]">The list of entities that should be source of report.">Array of entity references .</param>
	        /// <param name="reportXML" type="String">The report source query.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>

	        if (typeof (entity) == "string")
	            entity = new MobileCRM.Reference(entity, null, null);

	        var params = { fetchXml: fetchXml, entityName: entity.entityName, entity: entity, source: source };
	        MobileCRM.bridge.command("showMobileReportForm", JSON.stringify(params), null, failed, scope);
	    };
	    // MobileCRM.UI.Questionnaire
	    MobileCRM.Questionnaire.showForm = function(id, failed, scope) {
	        /// <summary>[v10.2] Shows the questionnaire form.</summary>
	        /// <param name="id" type="String">Id (guid) of the questionnaire.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = { id: id };
	        MobileCRM.bridge.command("showQuestionnaire", JSON.stringify(params), null, failed, scope);
	    };
		function _padTo3digits(num) {
			var st = "" + num;
			while (st.length < 3)
				st = "0" + st;
			return st;
		}
		MobileCRM.Questionnaire.getQuestionName = function (name, repeatIndex) {
			/// <summary>Generates the real name of question from repeatable group.</summary>
			/// <param name="name" type="String">Base question name from questionnaire template.</param>
			/// <param name="repeatIndex" type="Number">Repeat index of the group containing the question.</param>
			return repeatIndex ? (name + "#" + _padTo3digits(repeatIndex)) : name;
		}
		MobileCRM.Questionnaire.getGroupName = function (name, repeatIndex) {
			/// <summary>Generates the real name of repeatable question group.</summary>
			/// <param name="name" type="String">Base question group name from questionnaire template.</param>
			/// <param name="repeatIndex" type="Number">Repeat index of the group.</param>
			return repeatIndex ? (name + "#" + _padTo3digits(repeatIndex)) : name;
		}

	    // MobileCRM.UI.IFrameForm
	    _inherit(MobileCRM.UI.IFrameForm, MobileCRM.ObservableObject);

	    MobileCRM.UI.IFrameForm.showModal = function (caption, url, options) {
	        /// <summary>Shows a new iFrame form in modal window.</summary>
	        /// <param name="caption" type="String">Defines the form caption.</param>
	        /// <param name="url" type="String">Defines the URL of the HTML document.</param>
	        /// <param name="options" type="Object">Generic object passed to the new iFrame.</param>
	        MobileCRM.bridge.command("showIFrame", JSON.stringify({
	            caption: caption, url: url, modal: true, options: options
	        }));
	    };

	    MobileCRM.UI.IFrameForm.show = function (caption, url, maximized, options) {
	        /// <summary>Shows a new iFrame form.</summary>
	        /// <param name="caption" type="String">Defines the form caption.</param>
	        /// <param name="url" type="String">Defines the URL of the HTML document.</param>
	        /// <param name="maximized" type="Boolean">Indicates whether the new form should be maximized.</param>
	        /// <param name="options" type="Object">Generic object passed to the new iFrame (see <see cref="MobileCRM.UI.IFrameForm.requestObject">MobileCRM.UI.IFrameForm.requestObject</see>).</param>
	        MobileCRM.bridge.command("showIFrame", JSON.stringify({
	            caption: caption, url: url, modal: false, maximized: maximized, options: options
	        }));
	    };

	    MobileCRM.UI.IFrameForm.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>[v9.0] Asynchronously requests the IFrameForm object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of IFrameForm object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(iFrameForm)">The callback function that is called asynchronously with serialized <see cref="MobileCRM.UI.IFrameForm">MobileCRM.UI.IFrameForm</see> object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("IFrameForm", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    };

	    MobileCRM.UI.IFrameForm.setDirty = function (dirty) {
	        /// <summary>[v10.0] Sets the dirty flag which prevents the form being closed. App asks to save the form before saving and if user chooses to save it, it calls the save routine defined in <see cref="MobileCRM.UI.IFrameForm.saveCommand">IFrameForm.saveCommand</see>.</summary>
	        MobileCRM.bridge.invokeMethodAsync("IFrameForm", "set_IsDirty", [dirty === false ? false : true]);
	    };

	    MobileCRM.UI.IFrameForm.preventClose = function (message) {
	        /// <summary>[v10.0] Sets the warning message that should be shown when user tries to close the form.</summary>
	        /// <remarks>Set to &quot;null&quot; to allow the form close.</remarks>
	        MobileCRM.bridge.invokeMethodAsync("IFrameForm", "set_PreventCloseMessage", [message]);
	    };

	    MobileCRM.UI.IFrameForm._handlers = { onSave: [] };
	    MobileCRM.UI.IFrameForm.onSave = function (handler, bind, scope) {
	        /// <summary>[v10.0] Binds or unbinds the handler for saving content of this iFrame.</summary>
	        /// <remarks><p>Bound handler is called with the IFrameForm object as an argument.</p><p>The IFrameForm context object contains property &quot;errorMessage&quot; that can be used to cancel save with an error.</p><p>Use <see cref="MobileCRM.UI.IFrameForm.suspendSave">suspendSave</see> method to suspend the save process if an asynchronous operation is required.</p></remarks>
	        /// <param name="handler" type="function(IFrameForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.IFrameForm._handlers.onSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("InstallSaveCommand");
	    };
	    var _pendingIFrameSaveId = 0;
	    MobileCRM.UI.IFrameForm.prototype.suspendSave = function () {
	        /// <summary>[v10.0] Suspends current &quot;onSave&quot; process and allows performing asynchronous tasks to save the data.</summary>
	        /// <returns type="Object">A request object with single method &quot;resumeSave&quot; which has to be called with the result (either error message string or &quot;null&quot; in case of success). To cancel the validation without any message, pass "#NoMessage#" text to this method.</returns>
	        var cmdId = "IFramePendingValidation" + (++_pendingIFrameSaveId);
	        var self = this;
	        self.context.pendingSaveCommand = cmdId;
	        return {
	            resumeSave: function (result) {
	                if (self._inCallback) {
	                    // still in "onSave" callback - do not send a command (handler not installed yet)
	                    self.context.errorMessage = result;
	                    self.context.pendingSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId, result);
	            }
	        };
	    }

	    MobileCRM.UI.IFrameForm._callHandlers = function (event, data, context) {
	        var handlers = MobileCRM.UI.IFrameForm._handlers[event];
	        if (handlers && handlers.length > 0) {
	            data.context = context;
	            data._inCallback = true;
	            var result = '';
	            if (_callHandlers(handlers, data) != false) {
	                var changed = data.getChanged();
	                result = JSON.stringify(changed);
	            }
	            data._inCallback = false;
	            return result;
	        }
		};

		// MobileCRM.UI.EntityChart
		_inherit(MobileCRM.UI.EntityChart, MobileCRM.ObservableObject);
		MobileCRM.UI.EntityChart.setDataSource = function (dataSource) {
			/// <summary>Sets the chart data source replacement.</summary>
			/// <remarks><p>Data source must be set during the document load stage and must not be delayed.</p><p>It is used only if the entity view iFrame is marked as data source provider in Woodford.</p></remarks>
			/// <param name="dataSource" type="MobileCRM.UI.ChartDataSource">A data source object implementing the EntityChart loading routine.</param>
			MobileCRM.UI.EntityChart._dataSource = dataSource;
		};
		MobileCRM.UI.EntityChart._initDataSource = function (fetch) {
			var dataSource = MobileCRM.UI.EntityChart._dataSource;
			if (dataSource) {
				dataSource.fetch = fetch;
				if (typeof dataSource.loadCustomFetch != "undefined") {
					dataSource.loadCustomFetch();
				}
				if (dataSource.loadOfflineData != undefined) {

					var oData = dataSource.loadOfflineData;
					dataSource.type = oData.type;
					dataSource.data = oData.data;
					dataSource.isOfflineChart = true;
				}
			}
			return JSON.stringify(dataSource);
		};

		// MobileCRM.UI.ChartDataSource
		MobileCRM.UI.ChartDataSource = function () {
			/// <summary>The data source loading routine implementation.</summary>
			/// <remarks><p>An instance of this object can be used to supply the data source for <see cref="MobileCRM.UI.EntityChart.setDataSource">MobileCRM.UI.EntityChart.setDataSource</see> function.</p></remarks>
			/// <field name="type" type="string">Chart type in string</field>
			/// <field name="data" type="object">Object of chart dataset</field>
			this.type = null;
			this.data = null;
			this.fetch = null;
			this.isOfflineChart = false;
			this.loadOfflineData = null;
		};

	    // MobileCRM.UI.EntityList
	    _inherit(MobileCRM.UI.EntityList, MobileCRM.ObservableObject);
	    MobileCRM.UI.EntityList._handlers = { onCanExecute: [], onCommand: [], onSave: [], onChange: [], onClick: [] };
	    MobileCRM.UI.EntityList._callHandlers = function (event, data, context) {
	        var handlers = MobileCRM.UI.EntityList._handlers[event];
	        if (handlers && handlers.length > 0) {
	            data.context = context;
	            data._inCallback = true;
	            var result = '';
	            if (_callHandlers(handlers, data) != false) {
	                var changed = data.getChanged();
	                result = JSON.stringify(changed);
	            }
	            data._inCallback = false;
	            return result;
	        }
	    };
	    MobileCRM.UI.EntityList.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the EntityList object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of EntityList object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(entityList)">The callback function that is called asynchronously with serialized EntityList object as argument See <see cref="MobileCRM.UI.EntityList">MobileCRM.UI.EntityList</see> for further details.</remarks>. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("EntityList", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityList.selectView = function (viewName) {
	        /// <summary>Selects specified EntityList view.</summary>
	        /// <remark>Selecting different entity view causes loading the iFrame related to that view (if the view has one). Currently loaded EntityList iFrame will be unloaded and it should not perform any further asynchronous actions.</remark>
	        /// <param name="viewName" type="String">The name of the entity view which has to be selected.</param>
	        var viewFilter = MobileCRM.bridge.exposeObjectAsync("EntityList.FilterGroup.get_Item", ["View"]);
	        viewFilter.invokeMethodAsync("SetSelection", [viewName, false]);
	        viewFilter.release();
	        MobileCRM.UI.EntityList.reload();
	    };
	    MobileCRM.UI.EntityList.requestEditedEntities = function (callback, errorCallback, scope) {
	        /// <summary>[v10.0] Asynchronously gets the list of entities that were changed on the list.</summary>
	        /// <param name="callback" type="function(DynamicEntity[])">Callback obtaining an array of <see cref="MobileCRM.DynamicEntity">dynamic entities</see> that were changed on the list.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("EditedEntities", function (entities) {
	            if (callback.call(scope, entities.items) != false) {
	                var changed = entities.getChanged();
	                return changed;
	            }
	            return '';
	        }, errorCallback);
	    };
	    MobileCRM.UI.EntityList.onCommand = function (command, handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for EntityList command.</summary>
	        /// <remarks>Bound handler is called with the EntityList object as an argument. The EntityList context object contains the &quot;cmdParam&quot; property and &quot;entities&quot; property with the list of currently selected entities.</remarks>
	        /// <param name="command" type="String">The name of the EntityList command.</param>
	        /// <param name="handler" type="function(entityList)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityList._handlers[command];
	        if (!handlers)
	            handlers = MobileCRM.UI.EntityList._handlers[command] = [];
	        _bindHandler(handler, handlers, bind, scope);
	        var action = ((bind == false && handlers.length == 0) ? "cmdDel" : "cmd");
	        MobileCRM.bridge.command("registerListEvents", action + ":" + command);
	    };
	    MobileCRM.UI.EntityList.runCommand = function (commandName, parameter, errorCallback, scope) {
	        /// <summary>Executes the list/button command attached to this entity list.</summary>
	        /// <param name="commandName" type="String">A name of the command. It can be either custom command or one of following predefined commands: </param>
	        /// <param name="parameter" type="Number">A command parameter (e.g. the status code value for ChangeStatus command).</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityList", "RunCommand", [commandName, parameter], null, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityList.reload = function () {
	        /// <summary>Initiates asynchronous entity list reload.</summary>
	        MobileCRM.bridge.invokeMethodAsync("EntityList", "Reload", []);
	    }
	    MobileCRM.UI.EntityList.setPrimaryCommand = function (labels, callback, scope) {
	        /// <summary>Overrides the entity list&apos;s primary command button.</summary>
	        /// <param name="labels" type="Array/String">An array of labels or single label (e.g. &quot;New&quot;).</param>
	        /// <param name="callback" type="Function">A callback which is called when command is launched.</param>
	        /// <param name="scope" type="Object">A scope, in which the callback has to be called.</param>
	        MobileCRM.UI.ViewController.createCommand(true, labels, callback, scope);
	    };
	    MobileCRM.UI.EntityList.setEntityProperty = function (rowIndex, propertyName, editValue, saveImmediately, errorCallback, scope) {
	        /// <summary>[v10.1] Sets the value of the entity property.</summary>
	        /// <param name="rowIndex" type="Number">The index of the entity in the list.</param>
	        /// <param name="propertyName" type="String">The name of the property.</param>
	        /// <param name="editValue" type="any">the new property value.</param>
	        /// <param name="saveImmediately" type="Boolean">Indicates whether to save entity immediately or whether to just make it dirty.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
			editValue = (typeof editValue) === "object" ? JSON.stringify(editValue) : editValue;

	        MobileCRM.bridge.invokeMethodAsync("EntityList", "FinishListEditByName", [rowIndex, propertyName, editValue, saveImmediately ? MobileCRM.UI.EntityListCellAction.DirectEdit : 0], null, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityList.startEditCell = function (rowIndex, cellIndex, saveImmediately, binding, errorCallback, scope) {
	        /// <summary>[v10.1] Starts the editing of a list cell.<summary>
	        /// <param name="rowIndex" type="Number">The index of the row to edit.</param>
	        /// <param name="cellIndex" type="Number">The index of the cell.</param>
	        /// <param name="saveImmediately" type="Boolean">Indicates whether to save entity immediately after change or whether to just make it dirty.</param>
	        /// <param name="binding" type="Number">Optional, if null the binding from the cell index will be used.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        var method = "StartListEdit";
	        var ps = [rowIndex, cellIndex, saveImmediately ? MobileCRM.UI.EntityListCellAction.DirectEdit : 0, binding];
	        if (isNaN(+cellIndex)) {
	            method = "StartListEditByName";
	            ps = ps.slice(0, 3);
	        }
	        MobileCRM.bridge.invokeMethodAsync("EntityList", method, ps, null, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityList.clickCell = function (rowIndex, cellIndex, errorCallback, scope) {
	        /// <summary>[v10.1] Simulates click on a clickable list cell.<summary>
	        /// <remarks>Opens an entity form for lookup content record. Performs appropriate action for cells bound to the phone/email/web formatted fields.</remarks>
	        /// <param name="rowIndex" type="Number">The index of the row to click on.</param>
	        /// <param name="cellIndex" type="Number">The index of the cell.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityList", "StartListEdit", [rowIndex, cellIndex, MobileCRM.UI.EntityListCellAction.Clickable, null], null, errorCallback, scope);
		};

	    MobileCRM.UI.EntityList.setDataSource = function (dataSource) {
	        /// <summary>Sets the entity list data source replacement.</summary>
	        /// <remarks><p>Data source must be set during the document load stage and must not be delayed.</p><p>It is used only if the entity view iFrame is marked as data source provider in Woodford.</p></remarks>
	        /// <param name="dataSource" type="MobileCRM.UI.ListDataSource">A data source object implementing the DynamicEntity list loading routine.</param>
	        MobileCRM.UI.EntityList._dataSource = dataSource;
	    };
		MobileCRM.UI.EntityList.setDataSourceFactory = function (dataSourceFactory) {
			/// <summary>[v11.0.2] Sets the entity list data source replacement factory.</summary>
			/// <remarks><p>Data source must be set during the document load stage and must not be delayed.</p><p>It is used only if the entity view iFrame is marked as data source provider in Woodford.</p></remarks>
			/// <param name="dataSourceFactory" type="Function">A function that returns an object implementing the <see cref="MobileCRM.UI.ListDataSource">DynamicEntity list loading routine</see>.</param>
			MobileCRM.UI.EntityList._dataSourceFactory = dataSourceFactory;
		};
	    MobileCRM.UI.EntityList._dataSourceMap = {};
	    MobileCRM.UI.EntityList._initDataSource = function (chunkReadyCmdId, fetch) {
	        var result = {};
	        var dataSource = MobileCRM.UI.EntityList._dataSource;

	        var factory = MobileCRM.UI.EntityList._dataSourceFactory;
	        if (!dataSource && factory)
	        	dataSource = factory();

	        if (dataSource) {
	            dataSource._chunkReadyCmdId = chunkReadyCmdId;
	            dataSource.fetch = fetch;
	            result = {
	                chunkSize: dataSource.chunkSize || 50
	            };
	            MobileCRM.UI.EntityList._dataSourceMap[chunkReadyCmdId] = dataSource;
	        }
	        return JSON.stringify(result);
	    };
	    MobileCRM.UI.EntityList._loadNextChunk = function (page, count, chunkReadyCmdId) {
	    	var ds;
	    	if (chunkReadyCmdId) {
	    		ds = MobileCRM.UI.EntityList._dataSourceMap[chunkReadyCmdId];
	    	}
	    	if (!ds)
	    		ds = MobileCRM.UI.EntityList._dataSource;

	        if (ds && typeof ds.loadNextChunk == "function") {
	            try {
	                var fetch = ds.fetch;
	                fetch.page = page;
	                fetch.count = count;
	                ds.loadNextChunk(page, count);
	                return "OK";
				} catch (e) {
					return _safeErrorMessage(e);
	            }
	        }
	        return "Invalid ListDataSource";
	    };

	    var _pendingListSaveId = 0;
	    MobileCRM.UI.EntityList.prototype.suspendSave = function () {
	        /// <summary>[v10.0] Suspends current &quot;onSave&quot; validation and allows performing another asynchronous tasks to determine the validation result</summary>
	        /// <returns type="Object">A request object with single method &quot;resumeSave&quot; which has to be called with the validation result (either error message string or &quot;null&quot; in case of success). To cancel the validation without any message, pass "#NoMessage#" text to this method.</returns>
	        var cmdId = "EntityListPendingValidation" + (++_pendingListSaveId);
	        var self = this;
	        self.context.pendingSaveCommand = cmdId;
	        return {
	            resumeSave: function (result) {
	                if (self._inCallback) {
	                    // still in "onSave" callback - do not send a command (handler not installed yet)
	                    self.context.errorMessage = result;
	                    self.context.pendingSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId, result);
	            }
	        };
	    };
	    MobileCRM.UI.EntityList.onSave = function (handler, bind, scope) {
	        /// <summary>[v10.0] Binds or unbinds the handler for onSave event on EntityList.</summary>
	        /// <remarks>Bound handler is called with the EntityList object as an argument. The EntityList context object contains &quot;entities&quot; property with the list of all changed entities and property &quot;errorMessage&quot; that can be used to cancel save with an error.</remarks>
	        /// <param name="handler" type="function(entityList)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityList._handlers.onSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onSave");
	    }
	    MobileCRM.UI.EntityList.onChange = function (handler, bind, scope) {
	        /// <summary>[v10.0] Binds or unbinds the handler for onChange event on EntityList.</summary>
	        /// <remarks>Bound handler is called with the EntityList object as an argument. The EntityList context object contains &quot;entities&quot; property with the list of currently changed entities (typically just one entity) and property &quot;propertyName&quot; with the field name that was changed.</remarks>
	        /// <param name="handler" type="function(entityList)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityList._handlers.onChange;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onChange");
	    }
	    MobileCRM.UI.EntityList.onClick = function (handler, bind, scope) {
	        /// <summary>[v10.1] Binds or unbinds the handler for onClick event on EntityList.</summary>
	        /// <remarks>Bound handler is called with the EntityList object as an argument. The EntityList context property contains <see cref="MobileCRM.UI.EntityListClickContext">EntityListClickContext</see> object.</remarks>
	        /// <param name="handler" type="function(entityList)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityList._handlers.onClick;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onClick");
	    }
	    MobileCRM.UI.EntityListClickContext = function () {
	        /// <summary>Represents a context for the <see cref="MobileCRM.UI.EntityList.onClick">MobileCRM.UI.EntityList.onClick</see> handler.</summary>
	        /// <field name="entities" type="Array">Single item array containing the <see cref="MobileCRM.DynamicEntity">DynamicEntity</see> object representing clicked entity.</field>
	        /// <field name="propertyName" type="String">The field name that was clicked within the list item.</field>
	        /// <field name="event" type="MobileCRM.UI.EntityListClickEvent">Event details.</field>
	    }
	    MobileCRM.UI.EntityListClickEvent = function () {
	        /// <summary>Represents an event object for <see cref="MobileCRM.UI.EntityListClickContext">MobileCRM.UI.EntityListClickContext</see>.</summary>
	        /// <field name="cell" type="Number">An index of the cell in row template.</field>
	        /// <field name="row" type="Number">The row index.</field>
	        /// <field name="binding" type="Number">A binding value.</field>
	        /// <field name="action" type="Number">Click action flags. Use constant from <see cref="MobileCRM.UI.EntityListCellAction">MobileCRM.UI.EntityListCellAction</see> enumeration.</field>
	    };
	    MobileCRM.UI.EntityListCellAction = function () {
	        /// <summary>Enumeration class holding constants for <see cref="MobileCRM.UI.EntityListClickEvent">MobileCRM.UI.EntityListClickEvent</see>.</summary>
	        /// <field name="Text" type="Number">Cell displaying data bound or constant text.</field>
	        /// <field name="Image" type="Number"> Cell displaying data bound or constant image.</field>
	        /// <field name="Button" type="Number"> Clickable button cell.</field>
	        /// <field name="InlineButton" type="Number"> The inline button. iOS only.</field>
	        /// <field name="Editable" type="Number"> The cell is editable. Or together with Text kind.</field>
	        /// <field name="Clickable" type="Number"> The cell is clickable. Or together with Text kind.</field>
	        /// <field name="DirectEdit" type="Number"> The cell is editable and will be saved right after change. Or together with Text kind.</field>
	        /// <field name="ActionMask" type="Number"> The cell is editable or clickable.</field>
	    };
	    MobileCRM.UI.EntityListCellAction.Text = 0;
	    MobileCRM.UI.EntityListCellAction.Image = 1;
	    MobileCRM.UI.EntityListCellAction.Button = 2;
	    MobileCRM.UI.EntityListCellAction.InlineButton = 3;
	    MobileCRM.UI.EntityListCellAction.Editable = 0x1000;
	    MobileCRM.UI.EntityListCellAction.Clickable = 0x2000;
	    MobileCRM.UI.EntityListCellAction.DirectEdit = 0x4000 | MobileCRM.UI.EntityListCellAction.Editable;
	    MobileCRM.UI.EntityListCellAction.ActionMask = 0xF000;

        MobileCRM.UI.TourplanViewMode = function () {
        /// <summary>Enumeration class holding constants for <see cref="MobileCRM.UI.TourplanForm">MobileCRM.UI.TourplanForm</see>.</summary>
        /// <field name="Agenda" type="Number">Agenda view.</field>
        /// <field name="Day" type="Number"> Day view.</field>
        /// <field name="Week" type="Number"> Week view.</field>
        /// <field name="Month" type="Number"> Month view.</field>
        }
        MobileCRM.UI.TourplanViewMode.Agenda = 0;
        MobileCRM.UI.TourplanViewMode.Day = 1;
        MobileCRM.UI.TourplanViewMode.Week = 2;
		MobileCRM.UI.TourplanViewMode.Month = 3;

	    // MobileCRM.UI.ListDataSource
	    MobileCRM.UI.ListDataSource = function () {
	        /// <summary>The data source loading routine implementation.</summary>
	        /// <remarks><p>An instance of this object can be used to supply the data source for <see cref="MobileCRM.UI.EntityList.setDataSource">MobileCRM.UI.EntityList.setDataSource</see> function.</p><p>The instance of this object is valid only if the method loadNextChunk is implemented. See example <see cref="MobileCRM.UI.EntityList.setDataSource">here</see>.</p></remarks>
	        /// <field name="chunkSize" type="Number">Controls the number of entities loaded in once.</field>
	        /// <field name="fetch" type="MobileCRM.FetchXml.Fetch">Gets the original fetch request for this list view.</field>
	        /// <field name="loadNextChunk" type="function(page, count)">Controls the number of entities loaded in once. It is called from native code to get chunk (array) of <see cref="MobileCRM.DynamicEntity">DynamicEntities</see>. The chunk is defined by 1-based page number and the desired count which corresponds to the value of chunkSize property.</field>
	        this.chunkSize = 50;
	        this.fetch = null;
	        this.loadNextChunk = null;
	        this._chunkReadyCmdId = null;
	    };
	    MobileCRM.UI.ListDataSource.prototype.chunkReady = function (entities) {
	        /// <summary>This method has to be called from within the &quot;loadNextChunk&quot; routine when it loads chunk (array) of <see cref="MobileCRM.DynamicEntity">DynamicEntities</see>.</summary>
	        /// <remarks>Data source enumeration ends when the chunkReady method is called with empty array (no more records are available).</remarks>
	        /// <param name="entities" type="Array[MobileCRM.DynamicEntity]">A chunk (array) of <see cref="MobileCRM.DynamicEntity">DynamicEntities</see> that has to be passed back to the native code to fill in to the list view.</param>
	        MobileCRM.bridge.command(this._chunkReadyCmdId, JSON.stringify(entities));
	    };

	    // MobileCRM.UI.QuestionnaireForm
	    _inherit(MobileCRM.UI.QuestionnaireForm, MobileCRM.ObservableObject);
	    MobileCRM.UI.QuestionnaireForm._handlers = { onChange: [], onSave: [], onPostSave: [], onRepeatGroup: [], onDeleteGroup: [] };

	    MobileCRM.UI.QuestionnaireForm.prototype.cancelValidation = function (errorMsg) {
	        /// <summary>Stops the onSave validation and optionally causes an error message to be displayed.</summary>
	        /// <param name="errorMsg" type="String">An error message to be displayed or &quot;null&quot; to cancel the validation without message.</param>
	        this.context.errorMessage = errorMsg || "";
	    };
	    var _pendingSaveId = 0;
	    MobileCRM.UI.QuestionnaireForm.prototype.suspendSave = function () {
	        /// <summary>Suspends current &quot;onSave&quot; validation and allows performing another asynchronous tasks to determine the validation result</summary>
	        /// <returns type="Object">A request object with single method &quot;resumeSave&quot; which has to be called with the validation result (either error message string or &quot;null&quot; in case of success). To cancel the validation without any message, pass "#NoMessage#" text to this method.</returns>
	        var cmdId = "QuestionnaireFormPendingValidation" + (++_pendingSaveId);
	        var _this = this;
	        _this.context.pendingSaveCommand = cmdId;
	        return {
	            resumeSave: function (result) {
	                if (_this._inCallback) {
	                    // still in "onSave" callback - do not send a command (handler not installed yet)
	                    _this.context.errorMessage = result;
	                    _this.context.pendingSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId, result);
	            }
	        };
	    };
	    MobileCRM.UI.QuestionnaireForm.onSave = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onSave event on QuestionnaireForm.</summary>
	        /// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers.onSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onSave");
	    }
	    MobileCRM.UI.QuestionnaireForm.onChange = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onChange event on QuestionnaireForm.</summary>
	        /// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers.onChange;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onChange");
	    }
		MobileCRM.UI.QuestionnaireForm.onAnswerChanged = function (questionName, handler, bind, scope) {
			/// <summary>[v11.2] Binds or unbinds the handler for specific question change event on QuestionnaireForm.</summary>
			/// <param name="questionName" type="String">The name of desired question.</param>
			/// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			var handlerName = "onChange:" + questionName;
			var handlers = MobileCRM.UI.QuestionnaireForm._handlers[handlerName];
			if (!handlers)
				MobileCRM.UI.QuestionnaireForm._handlers[handlerName] = handlers = [];
			var register = handlers.length == 0;
			_bindHandler(handler, handlers, bind, scope);
			if (register)
				MobileCRM.bridge.command("registerEvents", handlerName);
		}
	    MobileCRM.UI.QuestionnaireForm.onRepeatGroup = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onRepeatGroup event on QuestionnaireForm.</summary>
	        /// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers.onRepeatGroup;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onRepeatGroup");
	    }
	    MobileCRM.UI.QuestionnaireForm.onDeleteGroup = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onDeleteGroup event on QuestionnaireForm.</summary>
	        /// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers.onDeleteGroup;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onDeleteGroup");
	    }
	    MobileCRM.UI.QuestionnaireForm.onPostSave = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onPostSave event on QuestionnaireForm.</summary>
	        /// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers.onPostSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onPostSave");
	    }
	    var _pendingQFPostSaveId = 0;
	    MobileCRM.UI.QuestionnaireForm.prototype.suspendPostSave = function () {
	        /// <summary>Suspends current &quot;onPostSave&quot; operations and allows performing another asynchronous tasks before the form is closed.</summary>
	        /// <returns type="Object">A request object with single method &quot;resumePostSave&quot; which has to be called to resume the post-save operations.</returns>
	        var cmdId = "QuestionnaireFormPendingPostSave" + (++_pendingQFPostSaveId);
	        var _this = this;
	        _this.context.pendingPostSaveCommand = cmdId;
	        return {
	            resumePostSave: function () {
	                if (_this._inCallback) {
	                    // still in "onPostSave" callback - do not send a command (handler not installed yet)
	                    _this.context.pendingPostSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId);
	            }
	        };
	    };
	    MobileCRM.UI.QuestionnaireForm.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the managed QuestionnaireForm object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of QuestionnaireForm object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(questionnaireForm)">The callback function that is called asynchronously with serialized QuestionnaireForm object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("QuestionnaireForm", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    }
	    MobileCRM.UI.QuestionnaireForm._callHandlers = function (event, data, context) {
	        var handlers = MobileCRM.UI.QuestionnaireForm._handlers[event];
	        if (handlers && handlers.length > 0) {
	            data.context = context;
	            data._inCallback = true;
	            var result = '';
	            if (_callHandlers(handlers, data) != false) {
	                var changed = data.getChanged();
	                result = JSON.stringify(changed);
	            }
	            data._inCallback = false;
	            return result;
	        }
	    };

	    MobileCRM.UI.QuestionnaireForm.prototype.findGroupById = function (groupId) {
	        /// <summary>Returns the question group with given id.</summary>
	        /// <param name="name" type="String">An id of the question group.</param>
	        /// <returns type="MobileCRM.UI.QuestionnaireForm.Group"></returns>
	        return _findInArray(this.groups, "id", groupId);
	    };
	    MobileCRM.UI.QuestionnaireForm.prototype.findGroupByName = function (groupName) {
	        /// <summary>Returns the question group with given name.</summary>
	        /// <param name="name" type="String">A name of the question group.</param>
	        /// <returns type="MobileCRM.UI.QuestionnaireForm.Group"></returns>
	        return _findInArray(this.groups, "name", groupName);
	    };
	    MobileCRM.UI.QuestionnaireForm.prototype.findQuestionById = function (id) {
	        /// <summary>Returns the question item with given id.</summary>
	        /// <param name="id" type="String">An id of the question item.</param>
	        /// <returns type="MobileCRM.UI.QuestionnaireForm.Question"></returns>
	        return _findInArray(this.questions, "id", id);
	    };
	    MobileCRM.UI.QuestionnaireForm.prototype.findQuestionByName = function (name) {
	        /// <summary>Returns the question item with given name.</summary>
	        /// <param name="name" type="String">A name of the question item.</param>
	        /// <returns type="MobileCRM.UI.QuestionnaireForm.Question"></returns>
	        return _findInArray(this.questions, "name", name);
	    };

	    MobileCRM.UI.QuestionnaireForm.trySetAnswer = function (questionName, answer, errorCallback, scope) {
	        /// <summary>Asynchronously sets the answer value for given question.</summary>
	        /// <param name="questionName" type="String">A name of the question.</param>
	        /// <param name="answer" type="any">A value that has to be set as answer. It must correspond to the type of question.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var val = typeof (answer) == "object" ? JSON.stringify(answer) : answer;
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "TrySetAnswer", [questionName, val], null, errorCallback, scope);
		};
		MobileCRM.UI.QuestionnaireForm.trySetImageAnswer = function (imageQuestionName, base64Data, mimeType, errorCallback, scope) {
			/// <summary>Asynchronously sets the answer value for given image question.</summary>
			/// <param name="imageQuestionName" type="String">A name of the image question.</param>
			/// <param name="base64Data" type="string">A value that us used to create image answer. If null or empty image will be deleted.</param>
			/// <param name="mimeType" type="string">The valid mime type of corresponding base64Data.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "TrySetImageAnswer", [imageQuestionName, base64Data, mimeType], null, errorCallback, scope);
		};
	    MobileCRM.UI.QuestionnaireForm.focusQuestion = function (questionName, errorCallback, scope) {
	        /// <summary>Asynchronously sets the focus on given question.</summary>
	        /// <param name="questionName" type="String">A name of the question.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "FocusQuestion", [questionName], null, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.overridePicklistOptions = function (questionName, allowNull, options, errorCallback, scope) {
	        /// <summary>Overrides the list of options for given picklist question.</summary>
	        /// <param name="questionName" type="String">A name of the picklist question.</param>
	        /// <param name="allowNull" type="Boolean">Indicates whether the empty answer is allowed.</param>
	        /// <param name="options" type="Object">An object with label-to-value mappings, e.g. {&quot;Option 1&quot;:1,&quot;Option 2&quot;:2}.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var optionsSt = "";
	        if (typeof options == "string")
	            optionsSt = options;
	        else {
	            for (var key in options) {
	                if (optionsSt)
	                    optionsSt += ";";
	                optionsSt += options[key] + ";" + key;
	            }
	        }
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "OverridePicklistOptions", [questionName, allowNull ? true : false, optionsSt], null, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.changeLookupQuestionSetup = function (questionName, dialogSetup, inlinePickSetup, dialogOnly, errorCallback, scope) {
	        /// <summary>Sets the views and filters for specified lookup question.</summary>
	        /// <param name="questionName" type="String">A name of the question.</param>
	        /// <param name="dialogSetup" type="MobileCRM.UI.DetailViewItems.LookupSetup">Lookup setup for modal lookup dialog.</param>
	        /// <param name="inlinePickSetup" type="MobileCRM.UI.DetailViewItems.LookupSetup">Optional setup for inline lookup picker. Leave empty to use the same setup as modal dialog.</param>
	        /// <param name="dialogOnly" type="Boolean">Indicates whether to allow the inline picker. Set &quot;true&quot; to disable the inline picker and always use the modal dialog. Set &quot;false&quot; to allow the inline picker.<param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var xml = "<lookup>";
	        xml += dialogSetup._serialize();
	        if (!dialogOnly && inlinePickSetup)
	            xml += inlinePickSetup._serialize();
	        xml += "<dialog>" + (dialogOnly ? 1 : 0) + "</dialog>";
	        xml += "</lookup>";
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "ChangeLookupViews", [questionName, xml], null, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.repeatGroup = function (groupId, copyValues, errorCallback, scope) {
	        ///<summary>Duplicates repeatable group with all its questions. The name of the group will contain the lowest available repeatIndex and suffix in form #00X.</summary>
	        /// <param name="id" type="String">Id of the source group.</param>
	        /// <param name="copyValues" type="Boolean">Optional paramater determining whether the group values should be copied to the new instance of this group.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "RepeatGroup", [groupId, copyValues], null, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.deleteGroup = function (groupId, errorCallback, scope) {
	        ///<summary>Deletes an instance of repeatable group with all its questions and adjusts the repeatIndex for all instances of the same template group with higher index.</summary>
	        /// <param name="id" type="String">Id of the source group.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "DeleteGroup", [groupId], null, errorCallback, scope);
	    };

		MobileCRM.UI.QuestionnaireForm.Group = function () {
			/// <field name="id" type="String">Gets the id of this question group.</field>
			/// <field name="name" type="String">Gets the name of the question group.</field>
			/// <field name="index" type="Number">Gets the index of the question group.</field>
			/// <field name="label" type="String">Gets the question group label.</field>
			/// <field name="description" type="String">Get the question group description.</field>
			/// <field name="templateGroup" type="String">Gets the id of parent group from questionnaire template.</field>
			/// <field name="repeatIndex" type="Number">Index of this instance of repeatable group. Zero for non-repeatable groups.</field>
			/// <field name="repeatEnabled" type="Boolean">Indicates whether the group is repeatable.</field>
			/// <field name="isVisible" type="Boolean">Gets or sets whether the group is visible.</field>
			/// <field name="isEnabled" type="Boolean">Gets or sets whether the group is enabled.</field>
			/// <field name="isExpanded" type="Boolean">Gets or sets whether the group is expanded (true) or collapsed (false).</field>
			MobileCRM.UI.QuestionnaireForm.Group.superproto.constructor.apply(this, arguments);
		};
	    _inherit(MobileCRM.UI.QuestionnaireForm.Group, MobileCRM.ObservableObject);
	    MobileCRM.UI.QuestionnaireForm.Group.prototype.repeatGroup = function (copyValues, errorCallback, scope) {
	        ///<summary>Duplicates repeatable group with all its questions. The name of the group will contain the lowest available repeatIndex and suffix in form #00X.</summary>
	        /// <param name="copyValues" type="Boolean">Optional parameter determining whether the group values should be copied to the new instance of this group.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.UI.QuestionnaireForm.repeatGroup(this.id, copyValues, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.Group.prototype.deleteGroup = function (errorCallback, scope) {
	        ///<summary>Deletes this instance of repeatable group with all its questions and adjusts the repeatIndex for all instances of the same template group with higher index.</summary>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.UI.QuestionnaireForm.deleteGroup(this.id, errorCallback, scope);
	    };

	    MobileCRM.UI.QuestionnaireForm.Question = function () {
	        /// <field name="id" type="String">Gets the id of this question record.</field>
	        /// <field name="name" type="String">Gets the name of the question item.</field>
	        /// <field name="label" type="String">Gets or sets the question item label.</field>
	        /// <field name="index" type="Number">Gets the index of the question item.</field>
	        /// <field name="groupId" type="String">Gets the id of parent question group (may be empty).</field>
	        /// <field name="description" type="String">Get or sets the question item description.</field>
	        /// <field name="type" type="Number">Gets the value type of the question item.</field>
	        /// <field name="value" type="Any">Gets current answer value. To change it, use trySetAnswer method.</field>
	        /// <field name="style" type="String">Gets or sets the question item style name.</field>
	        /// <field name="isVisible" type="Boolean">Indicates whether the item is visible.</field>
	        /// <field name="isEnabled" type="Boolean">Indicates whether the item is enabled.</field>
	        /// <field name="focus" type="Boolean">Set to true to focus the question item.</field>
	        /// <field name="validate" type="Boolean">Indicates whether the item should be validated.</field>
	        /// <field name="errorMessage" type="String">Holds the error message text related to current value of the question item.</field>
	        MobileCRM.UI.QuestionnaireForm.Question.superproto.constructor.apply(this, arguments);
	    };
	    _inherit(MobileCRM.UI.QuestionnaireForm.Question, MobileCRM.ObservableObject);
	    MobileCRM.UI.QuestionnaireForm.Question.prototype.trySetAnswer = function (answer, errorCallback, scope) {
	        /// <summary>Asynchronously sets the answer value for this question.</summary>
	        /// <param name="answer" type="any">A value that has to be set as answer. It must correspond to the type of question (String/Number/Reference/Guid).</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.UI.QuestionnaireForm.trySetAnswer(this.name, answer, errorCallback, scope);
	    };
	    MobileCRM.UI.QuestionnaireForm.Question.prototype.focus = function (errorCallback, scope) {
	        /// <summary>Asynchronously sets the focus on this question.</summary>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.UI.QuestionnaireForm.focusQuestion(this.name, errorCallback, scope);
	    };
		MobileCRM.UI.QuestionnaireForm.getQuestionnaireEntity = function (callback, errorCallback, scope) {
			/// <summary>Requests the Questionnaire entity.</summary>
			/// <param name="callback" type="function(entity)">The callback function that is called asynchronously with a DynamicEntity object representing currently opened questionnaire. Callback should return true to apply changed properties.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			MobileCRM.bridge.invokeMethodAsync("QuestionnaireForm", "get_Questionnaire", [], callback, errorCallback, scope);
		};
		MobileCRM.UI.QuestionnaireForm.onCommand = function (command, handler, bind, scope) {
			/// <summary>Binds or unbinds the handler for QuestionnaireForm command.</summary>
			/// <param name="command" type="String">The name of the QuestionnaireForm command.</param>
			/// <param name="handler" type="function(questionnaireForm)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			var handlers = MobileCRM.UI.QuestionnaireForm._handlers[command];
			if (!handlers)
				handlers = MobileCRM.UI.QuestionnaireForm._handlers[command] = [];
			_bindHandler(handler, handlers, bind, scope);
			var action = ((bind == false && handlers.length == 0) ? "cmdDel" : "cmd");
			MobileCRM.bridge.command("registerEvents", action + ":" + command);
		}

	    // MobileCRM.UI.EntityForm
	    _inherit(MobileCRM.UI.EntityForm, MobileCRM.ObservableObject);
	    MobileCRM.UI.EntityForm._handlers = { onChange: [], onSave: [], onPostSave: [], onDetailCollectionChange: [], onSelectedViewChanged: [] };

	    MobileCRM.UI.EntityForm.prototype.getDetailView = function (name) {
	        /// <summary>Returns the DetailView by its name.</summary>
	        /// <param name="name" type="String">A name of DetailView.</param>
	        /// <returns type="MobileCRM.UI._DetailView">A <see cref="MobileCRM.UI._DetailView">MobileCRM.UI._DetailView</see> object with requested name.</returns>
	        var detailViews = this.detailViews;
	        if (detailViews) {
	            var nItems = detailViews.length;
	            for (var i = 0; i < nItems; i++) {
	                var item = detailViews[i];
	                if (item.name == name)
	                    return item;
	            }
	        }
	        return undefined;
	    };

	    MobileCRM.UI.EntityForm.prototype.getController = function (name) {
	        /// <summary>Returns the tab controller by its view name.</summary>
	        /// <param name="name" type="String">A name of controller&apos;s view.</param>
	        /// <returns type="MobileCRM.UI._Controller">A <see cref="MobileCRM.UI._Controller">MobileCRM.UI._Controller</see> object with requested view name.</returns>
	        var controllers = this.controllers;
	        if (controllers) {
	            var nItems = controllers.length;
	            for (var i = 0; i < nItems; i++) {
	                var item = controllers[i];
	                if (item.view && item.view.name == name)
	                    return item;
	            }
	        }
	        return undefined;
		};

		MobileCRM.UI.EntityForm.prototype.getEntityList = function (name) {
			/// <summary>Returns the entity list by its view name.</summary>
			/// <param name="name" type="String">A name of entity list view.</param>
			/// <returns type="MobileCRM.UI._EntityList">A <see cref="MobileCRM.UI._EntityList">MobileCRM.UI._EntityList</see> object with requested view name.</returns>
			var list = undefined;
			var controller = this.getController(name);
			if (controller)
				list = controller.list;
			else {
				for (var i = 0; i < this.associatedViews.length; i++) {
					var v = this.associatedViews[i];
					if (v.listView.name == name) {
						list = v;
						break;
					}
				}
			}
			return list;
		};

	    MobileCRM.UI.EntityForm.prototype.updateAddressFields = function (latitude, longitude) {
	        /// <summary>Sets the address fields according to the current geo-location from platform-specific location service.</summary>
	        /// <param name="latitude" type="Number">The latitude from geo-location from platform-specific location service </param>
	        /// <param name="longitude" type="Number">longitude from geo-location from platform-specific location service</param>
	        var detailViewController = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [0]);

	        detailViewController.invokeMethodAsync("UpdateAddress", [latitude, longitude]);
	        detailViewController.release();
	    };

	    MobileCRM.UI.EntityForm.prototype.cancelValidation = function (errorMsg) {
	        /// <summary>Stops the onSave validation and optionally causes an error message to be displayed.</summary>
	        /// <param name="errorMsg" type="String">An error message to be displayed or &quot;null&quot; to cancel the validation without message.</param>
	        this.context.errorMessage = errorMsg || "";
	    };

	    MobileCRM.UI.EntityForm.prototype.selectTab = function (tabName, errorCallback, scope) {
	        /// <summary>[v8.0] Selects the form tab by its name.</summary>
	        /// <param name="tabName" type="String">The name of the tab.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        MobileCRM.UI.EntityForm.selectTabEx(tabName, function () { }, errorCallback, scope);
	    };

	    MobileCRM.UI.EntityForm.selectTabEx = function (tabName, callback, errorCallback, scope) {
	        /// <summary>[v8.0] Selects the form tab by its name.</summary>
	        /// <param name="tabName" type="String">The name of the tab.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "FindView", [tabName], function (index) {
	            if (index < 0) {
	                if (errorCallback)
	                    errorCallback.call(scope, tabName + " view not found");
	            }
	            else
	                MobileCRM.bridge.invokeMethodAsync("EntityForm", "Form.set_SelectedViewIndex", [index], callback, errorCallback, scope);
	        }, errorCallback, scope);
		};
	    MobileCRM.UI.EntityForm.prototype.selectView = function (tabName, viewName) {
	        /// <summary>Selects the associated entity list view by its name.</summary>
	        /// <param name="tabName" type="String">The name of the associated entity list tab.</param>
	        /// <param name="viewName" type="String">The view name.</param>
	        /// <returns type="Boolean">true, if the view selection was initiated; false, if tab was not found.</returns>
	        var controllers = this.controllers;
	        for (var i = 0; i < controllers.length; i++) {
	            var controller = controllers[i];
	            var view = controller.view;
	            if (view && view.name == tabName) {
	                var list = MobileCRM.bridge.exposeObjectAsync("EntityForm.Controllers.get_Item", [i]);
	                // Expose the filter item for key 'View'
	                var viewFilter = list.exposeObjectAsync("List.FilterGroup.get_Item", ["View"]); 
	                // Select desired view in filter item
	                viewFilter.invokeMethodAsync("SetSelection", [viewName, false]);
	                // release exposed filter item
	                viewFilter.release();
	                // reload the ListView - in our case the list is contained in the FlipController, thus we need to access it via 'List' property
	                list.invokeMethodAsync("List.Reload", []);
	                // release exposed controller
	                list.release();
	                return true;
	            }
	        }
	        var assocViews = this.associatedViews;
	        for (var i = 0; i < assocViews.length; i++) {
	            var assocView = assocViews[i];
	            var view = assocView.listView;
	            if (view && view.name == tabName) {
	                var list = MobileCRM.bridge.exposeObjectAsync("EntityForm.AssociatedViews.get_Item", [i]);
	                // Expose the filter item for key 'View'
	                var viewFilter = list.exposeObjectAsync("FilterGroup.get_Item", ["View"]);
	                // Select desired view in filter item
	                viewFilter.invokeMethodAsync("SetSelection", [viewName, false]);
	                // release exposed filter item
	                viewFilter.release();
	                // reload the ListView - in our case the list is contained in the FlipController, thus we need to access it via 'List' property
	                list.invokeMethodAsync("Reload", []);
	                // release exposed controller
	                list.release();
	                return true;
	            }
	        }
	        return false;
	    };

	    MobileCRM.UI.EntityForm.prototype.setTabVisibility = function (tabName, visible) {
	        /// <summary>Sets the visibility of the form tab defined by its name.</summary>
	        /// <param name="tabName" type="String">The name of the tab</param>
	        /// <param name="visible" type="Boolean">Defines desired visibility state.</param>
	        /// <returns type="Boolean">true, if the visibility change was initiated; false, if tab was not found.</returns>
	        var controllers = this.controllers;
	        for (var i = 0; i < controllers.length; i++) {
	            var controller = controllers[i];
	            var view = controller.view;
	            if (view && view.name == tabName) {
	                view.isVisible = visible;
	                if (controller.hasOwnProperty("isLoaded") && controller.isLoaded === false)
	                    controller.isLoaded = true;
	                return true;
	            }
	        }
	        var assocViews = this.associatedViews;
	        for (var i = 0; i < assocViews.length; i++) {
	            var assocView = assocViews[i];
	            var view = assocView.listView;
	            if (view && view.name == tabName) {
	                view.isVisible = visible;
	                return true;
	            }
	        }
	        var detailViews = this.detailViews;
	        for (var i = 0; i < detailViews.length; i++) {
	            var detailView = detailViews[i];
	            if (detailView.name == tabName) {
	                detailView.isVisible = visible;
	                return true;
	            }
	        }
	        return false;
	    };

	    MobileCRM.UI.EntityForm.prototype.getMediaTab = function (name) {
	        /// <summary>Gets the MediaTab object representing the media tab with given name.</summary>
	        /// <returns type="MobileCRM.UI.MediaTab">A MobileCRM.UI.MediaTab object representing the media tab, or &quot;null&quot;, if the tab was not found.</returns>
	        var controllers = this.controllers;
	        for (var i = 0; i < controllers.length; i++) {
	            var controller = controllers[i];
	            var view = controller.view;
	            if (view && view.name == name) {
	                if (controller.hasOwnProperty("isLoaded") && controller.isLoaded === false)
	                    controller.isLoaded = true;
	                return new MobileCRM.UI.MediaTab(i, name);
	            }
	        }
	        return null;
	    };
	    

	    var _pendingSaveId = 0;
	    MobileCRM.UI.EntityForm.prototype.suspendSave = function () {
	        /// <summary>Suspends current &quot;onSave&quot; validation and allows performing another asynchronous tasks to determine the validation result</summary>
	        /// <returns type="Object">A request object with single method &quot;resumeSave&quot; which has to be called with the validation result (either error message string or &quot;null&quot; in case of success). To cancel the validation without any message, pass "#NoMessage#" text to this method.</returns>
	        var cmdId = "EntityFormPendingValidation" + (++_pendingSaveId);
	        var entityForm = this;
	        entityForm.context.pendingSaveCommand = cmdId;
	        return {
	            resumeSave: function (result) {
	                if (entityForm._inCallback) {
	                    // still in "onSave" callback - do not send a command (handler not installed yet)
	                    entityForm.context.errorMessage = result;
	                    entityForm.context.pendingSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId, result);
	            }
	        };
	    };
	    MobileCRM.UI.EntityForm.onSave = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onSave event on EntityForm.</summary>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers.onSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onSave");
	    }
	    MobileCRM.UI.EntityForm.onChange = function (handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for onChange event on EntityForm.</summary>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers.onChange;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onChange");
	    }
		MobileCRM.UI.EntityForm.onItemChange = function (itemName, handler, bind, scope) {
			/// <summary>[v11.2] Binds or unbinds the handler for specific item change event on EntityForm.</summary>
			/// <param name="itemName" type="String">The name of desired detail item (mostly logical name of the field).</param>
			/// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
			/// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
			/// <param name="scope" type="Object">The scope for handler calls.</param>
			var handlerName = "onChange:" + itemName;
			var handlers = MobileCRM.UI.EntityForm._handlers[handlerName];
			if (!handlers)
				MobileCRM.UI.EntityForm._handlers[handlerName] = handlers = [];
			var register = handlers.length == 0;
			_bindHandler(handler, handlers, bind, scope);
			if (register)
				MobileCRM.bridge.command("registerEvents", handlerName);
		}
	    MobileCRM.UI.EntityForm.onPostSave = function (handler, bind, scope) {
	        /// <summary>[v8.2] Binds or unbinds the handler for onPostSave event on EntityForm.</summary>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers.onPostSave;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onPostSave");
	    }
	    var _pendingPostSaveId = 0;
	    MobileCRM.UI.EntityForm.prototype.suspendPostSave = function () {
	        /// <summary>[v8.2] Suspends current &quot;onPostSave&quot; operations and allows performing another asynchronous tasks before the form is closed.</summary>
	        /// <returns type="Object">A request object with single method &quot;resumePostSave&quot; which has to be called to resume the post-save operations.</returns>
	        var cmdId = "EntityFormPendingPostSave" + (++_pendingPostSaveId);
	        var entityForm = this;
	        entityForm.context.pendingPostSaveCommand = cmdId;
	        return {
	            resumePostSave: function () {
	                if (entityForm._inCallback) {
	                    // still in "onPostSave" callback - do not send a command (handler not installed yet)
	                    entityForm.context.pendingPostSaveCommand = null;
	                }
	                else
	                    MobileCRM.bridge.command(cmdId);
	            }
	        };
	    };
	    MobileCRM.UI.EntityForm.onSelectedViewChanged = function (handler, bind, scope) {
	        /// <summary>[v9.3] Binds or unbinds the handler for onSelectedViewChanged event on EntityForm.</summary>
	        /// <remarks>Bound handler is called with the EntityForm object as an argument. The EntityForm context object contains &quot;selectedView&quot; property with the name of currently selected view.</remarks>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers.onSelectedViewChanged;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onSelectedViewChanged");
	    }
	    MobileCRM.UI.EntityForm.loadTab = function (tabName, load, errorCallback, scope) {
	        /// <summary>[v10.1] (Re)loads the tab of the passed name.</summary>
	        /// <param name="tabName" type="String">The name of the tab.</param>
	        /// <param name="load" type="Boolean">Whether to (re)load or unload a view.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callback.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "LoadView", [tabName, load], function (index) {}, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityForm.requestObject = function (callback, errorCallback, scope) {
	        /// <summary>Requests the managed EntityForm object.</summary>
	        /// <remarks>Method initiates an asynchronous request which either ends with calling the <b>errorCallback</b> or with calling the <b>callback</b> with Javascript version of EntityForm object. See <see cref="MobileCRM.Bridge.requestObject">MobileCRM.Bridge.requestObject</see> for further details.</remarks>
	        /// <param name="callback" type="function(entityForm)">The callback function that is called asynchronously with serialized EntityForm object as argument. Callback should return true to apply changed properties.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.requestObject("EntityForm", function (obj) {
				return obj.runCallback(callback, scope);
	        }, errorCallback, scope);
	    }
	    MobileCRM.UI.EntityForm._callHandlers = function (event, data, context) {
	        var handlers = MobileCRM.UI.EntityForm._handlers[event];
	        if (handlers && handlers.length > 0) {
	            data.context = context;
	            data._inCallback = true;
	            var result = '';
	            if (_callHandlers(handlers, data) != false) {
					var changed = data.getChanged() || {};
					changed.context = context;
					result = JSON.stringify(changed);
	            }
	            data._inCallback = false;
	            return result;
	        }
	    }
	    MobileCRM.UI.EntityForm._callCmdHandlers = function (event, data, context) {
	        var handlers = MobileCRM.UI.EntityForm._handlers[event];
	        if (handlers && handlers.length > 0) {
	            data.context = context;
	            var res = _callHandlers(handlers, data);
	            return typeof (res) == "string" ? res : JSON.stringify(res);
	        }
	        return null;
	    }
	    MobileCRM.UI.EntityForm.executeCommandByName = function (command, callback, errorCallback, scope) {
	        /// <summary>[v8.1] Execute the command with the passed name. The command must exist and must be enabled.</summary>
	        /// <param name="command" type="String">The name of the EntityForm command.</param>
	        /// <param name="callback" type="function(entityForm)">The callback function that is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "ExecuteCommandByName", [command], callback, errorCallback, scope);
	    }
	    MobileCRM.UI.EntityForm.onCommand = function (command, handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler for EntityForm command.</summary>
	        /// <param name="command" type="String">The name of the EntityForm command.</param>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers[command];
	        if (!handlers)
	            handlers = MobileCRM.UI.EntityForm._handlers[command] = [];
	        _bindHandler(handler, handlers, bind, scope);
	        var action = ((bind == false && handlers.length == 0) ? "cmdDel" : "cmd");
	        MobileCRM.bridge.command("registerEvents", action + ":" + command);
	    }
	    MobileCRM.UI.EntityForm.onCanExecuteCommand = function (command, handler, bind, scope) {
	        /// <summary>Binds or unbinds the handler called when the EntityForm needs to find out whether the command can be executed (is enabled).</summary>
	        /// <param name="command" type="String">The name of the EntityForm command. Optionally can contain the param value separated by slash (e.g. ChangeStatus/5).</param>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound. Handler&#39;s return value indicates whether the command is enabled (true/false).</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlerName = "CanExecute_" + command;
	        var handlers = MobileCRM.UI.EntityForm._handlers[handlerName];
	        if (!handlers)
	            handlers = MobileCRM.UI.EntityForm._handlers[handlerName] = [];
	        _bindHandler(handler, handlers, bind, scope);
	        var action = ((bind == false && handlers.length == 0) ? "cmdEnabledDel" : "cmdEnabled");
	        MobileCRM.bridge.command("registerEvents", action + ":" + command);
	    }
	    MobileCRM.UI.EntityForm.enableCommand = function (command, enable, iParam) {
	        /// <summary>Enables or disables the form command.</summary>
	        /// <param name="command" type="String">The name of the command.</param>
	        /// <param name="enable" type="Boolean">Determines whether to enable or disable the command.</param>
	        /// <param name="iParam" type="Number">[v9.1] Optional parameter defining the additional command parameter (like status code value for &quot;ChangeStatus&quot; command).</param>
	        if (typeof iParam != "undefined")
	            command += "/" + iParam;
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "EnableCommandByName", [command, enable]);
	    };
	    MobileCRM.UI.EntityForm.refreshForm = function () {
	        /// <summary>Reloads the form&apos;s edit state.</summary>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "ReloadForm", []);
	    };
	    MobileCRM.UI.EntityForm.saveAndClose = function () {
	        /// <summary>Saves edited entity and closes the form.</summary>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "SaveAndClose", [true]);
	    };
	    MobileCRM.UI.EntityForm.save = function () {
	        /// <summary>[v9.0]Saves the form entity and its children and refreshes the form.</summary>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "InternalSave", [false]);
	    };
	    MobileCRM.UI.EntityForm.closeWithoutSaving = function () {
	        /// <summary>Closes the form ignoring all changes that have been made on it.</summary>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "SaveAndClose", [false]);
	    };
	    MobileCRM.UI.EntityForm.prototype.reactivateEntity = function (statuscode) {
	        /// <summary>Reactivates inactive entity and reloads the form.</summary>
	        /// <param name="statuscode" type="Number">Activation status code.</param>
	        this.entity.properties.statuscode = statuscode;
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "OnEntityStateChanged", []);
	        MobileCRM.UI.EntityForm.save();
	    }
	    MobileCRM.UI.EntityForm.showPleaseWait = function (caption) {
	        /// <summary>Shows a please wait message, disabling the form except for the close command.</summary>
	        /// <param name="caption" type="String">Wait message.</param>
	        /// <returns type="Object">An object representing the UI component with single method &quot;close&quot;.</returns>
	        var obj = MobileCRM.bridge.exposeObjectAsync("EntityForm.Form.ShowPleaseWait", [caption]);
	        return {
	            close: function () {
	                obj.invokeMethodAsync("Dispose", []);
	                obj.release();
	            }
	        };
	    };
	    MobileCRM.UI.EntityForm.maximizeView = function(viewName, maximize) {
	        /// <summary>[v8.1] Makes the passed view maximized/restored.</summary>
	        /// <param name="viewName" type="String">The name of the view which has to be maximized/restored.</param>
	        /// <param name="maximize" type="Boolean">true, to maximize the view; false, to restore it.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "MaximizeView", [viewName, maximize]);
	    };
	    MobileCRM.UI.EntityForm.isViewMaximized = function(viewName, callback, errorCallback, scope) {
	        /// <summary>[v8.1] Inspects whether the passed view is maximized or restored.</summary>
	        /// <param name="viewName" type="String">The name of the view which has to be maximized/restored.</param>
	        /// <param name="callback" type="function(Boolean)">Asynchronous callback which is called with Boolean result: true, if the view is maximized; false, if it is restored.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "IsViewMaximized", [viewName], callback, errorCallback, scope);
	    };
	    MobileCRM.UI.EntityForm.openSalesEntityDetail = function (detail, errorCallback) {
	        /// <summary>[v8.2] Shows an entity edit dialog.</summary>
	        /// <param name="detail" type="MobileCRM.DynamicEntity">detail entity.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called asynchronously in case of error.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "ShowEntityDetailDialog", [detail.id], null, errorCallback, null);
	    }
	    // MobileCRM.UI.EntityForm.DetailCollection
	    MobileCRM.UI.EntityForm.DetailCollection = function () {
	        /// <summary>Provides functions accessing the collection of the sales entity details (e.g. Order details)</summary>
	    };

	    MobileCRM.UI.EntityForm.DetailCollection._updateDetail = function (updateCallback) {
	        var props = this.properties;
	        if (props._privVals)
	            props = props._privVals;
	        var request = { entity: this.entityName, id: this.id, properties: props, isNew: this.isNew, isOnline: this.isOnline };
	        var cmdParams = JSON.stringify(request);
	        var self = this;
	        MobileCRM.bridge.command('updateSalesDetailProduct', cmdParams,
				function (res) {
				    self.id = res.id;
				    self.isNew = false;
				    self.isOnline = res.isOnline;
				    self.primaryName = res.primaryName;
				    self.properties = res.properties;
				    if (typeof updateCallback == "function")
				        updateCallback.call(self, null);
				},
				function (err) {
				    if (typeof updateCallback == "function")
				        updateCallback.call(self, err);
				}, null);
	        return this;
	    };

	    MobileCRM.UI.EntityForm.DetailCollection.getAll = function (callback, errorCallback, scope) {
	        /// <summary>Asynchronously returns the collection of the sales entity details (e.g. Order details)</summary>
	        /// <param name="callback" type="function(Array)">The callback function that is called asynchronously with an array of <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> objects as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "Entity.get_DetailCollection", [], function (orderDetails) {
	            var nDetails = orderDetails.length;
	            for (var i = 0; i < nDetails; i++) {
	                var detail = orderDetails[i];
	                detail.update = MobileCRM.UI.EntityForm.DetailCollection._updateDetail;
	            }
	            callback.call(scope, orderDetails);
	        }, errorCallback, scope);
	    };
		MobileCRM.UI.EntityForm.DetailCollection.getAllAsync = function () {
	        /// <summary>Asynchronously returns the collection of the sales entity details (e.g. Order details)</summary>
			/// <returns type="Promise&lt;MobileCRM.DynamicEntity[]&gt;">A Promise object which will be resolved with an array of DynamicEntity objects representing the sales entity detail records.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.UI.EntityForm.DetailCollection.getAll(resolve, function (err) { reject(new Error(err)); });
			});
		}
	    MobileCRM.UI.EntityForm.DetailCollection.get = function (index, callback, errorCallback, scope) {
	        /// <summary>Asynchronously returns requested sales entity detail (e.g. Order detail)</summary>
	        /// <param name="index" type="Number">An index of requested item.</param>
	        /// <param name="callback" type="function(MobileCRM.DynamicEntity)">The callback function that is called asynchronously with the <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object as argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "Entity.DetailCollection.get_Item", [index], function (entity) {
	            entity.update = MobileCRM.UI.EntityForm.DetailCollection._updateDetail;
	            if (typeof callback == "function")
	                callback.call(scope, entity);
	        }, errorCallback, scope);
	    };
		MobileCRM.UI.EntityForm.DetailCollection.getAsync = function (index) {
	        /// <summary>Asynchronously returns requested sales entity detail (e.g. Order detail)</summary>
	        /// <param name="index" type="Number">An index of requested item.</param>
			/// <returns type="Promise&lt;MobileCRM.DynamicEntity&gt;">A Promise object which will be resolved with the DynamicEntity object representing the sales entity detail record.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.UI.EntityForm.DetailCollection.get(index, resolve, function (err) { reject(new Error(err)); });
			});
		}
	    MobileCRM.UI.EntityForm.DetailCollection.deleteByIndex = function (index, callback, errorCallback, scope) {
	        /// <summary>Deletes the sales entity detail (e.g. Order detail) by index.</summary>
	        /// <param name="index" type="Number">An index of the item to be deleted.</param>
	        /// <param name="callback" type="Function">The callback function which is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "Entity.DetailCollection.RemoveItem", [index], callback, errorCallback, scope);
	    };

	    MobileCRM.UI.EntityForm.DetailCollection.deleteById = function (orderDetailId, callback, errorCallback, scope) {
	        /// <summary>Deletes the sales entity detail (e.g. Order detail) by id.</summary>
	        /// <param name="id" type="String">An id of the item to be deleted.</param>
	        /// <param name="callback" type="Function">The callback function which is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("EntityForm", "Entity.get_DetailCollection", [], function (res) {
	            var nDetails = res.length;
	            for (var i = 0; i < nDetails; i++) {
	                if (res[i].id == orderDetailId) {
	                    MobileCRM.UI.EntityForm.DetailCollection.deleteByIndex(i, callback, errorCallback, scope);
	                }
	            }
	        }, errorCallback, scope);
	    };

	    MobileCRM.UI.EntityForm.DetailCollection.add = function (product, callback, errorCallback, scope) {
	        /// <summary>Appends the product into sales order collection.</summary>
	        /// <remarks>Resulting <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object implements method &quot;update&quot; which can be used to update the entity properties in the sales detail collection.</remarks>
	        /// <param name="product" type="MobileCRM.Reference">A reference of the product to be appended.</param>
	        /// <param name="callback" type="function(MobileCRM.DynamicEntity)">The callback function which is called asynchronously with <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("addSalesDetailProduct", JSON.stringify(product), function (detailEntity) {
	            detailEntity.update = MobileCRM.UI.EntityForm.DetailCollection._updateDetail;
	            if (typeof callback == "function")
	                callback.call(scope, detailEntity);
	        }, errorCallback, scope);
		};

	    MobileCRM.UI.EntityForm.DetailCollection.addProductWithQuantity = function (product, quantity, callback, errorCallback, scope) {
	        /// <summary>[v10.0] Appends the product into sales order collection.</summary>
	        /// <remarks>Resulting <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object implements method &quot;update&quot; which can be used to update the entity properties in the sales detail collection.</remarks>
	        /// <param name="product" type="MobileCRM.Reference">A reference of the product to be appended.</param>
	        /// <param name="quantity" type="Number">Product quantity.</param>
	        /// <param name="callback" type="function(MobileCRM.DynamicEntity)">The callback function which is called asynchronously with <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("addSalesDetailProduct", "#" + quantity + ":" + JSON.stringify(product), function (detailEntity) {
	            detailEntity.update = MobileCRM.UI.EntityForm.DetailCollection._updateDetail;
	            if (typeof callback == "function")
	                callback.call(scope, detailEntity);
	        }, errorCallback, scope);
	    };
		MobileCRM.UI.EntityForm.DetailCollection.addAsync = function (product, quantity) {
	        /// <summary>[v10.0] Appends the product into sales order collection.</summary>
	        /// <remarks>Resulting <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> object implements method &quot;update&quot; which can be used to update the entity properties in the sales detail collection.</remarks>
	        /// <param name="product" type="MobileCRM.Reference">A reference of the product to be appended.</param>
	        /// <param name="quantity" type="Number">Product quantity.</param>
			/// <returns type="Promise&lt;MobileCRM.DynamicEntity&gt;">A Promise object which will be resolved with the DynamicEntity object representing new sales entity detail record.</returns>
			return new Promise(function (resolve, reject) {
				MobileCRM.UI.EntityForm.DetailCollection.addProductWithQuantity(product, quantity, resolve, function (err) { reject(new Error(err)); });
			});
		};

	    MobileCRM.UI.EntityForm.DetailCollection.onChange = function (handler, bind, scope) {
	        /// <summary>[v8.2] Binds or unbinds the handler which is called when the list of sales details changes.</summary>
	        /// <param name="handler" type="function(entityForm)">The handler function that has to be bound or unbound.</param>
	        /// <param name="bind" type="Boolean">Determines whether to bind or unbind the handler.</param>
	        /// <param name="scope" type="Object">The scope for handler calls.</param>
	        var handlers = MobileCRM.UI.EntityForm._handlers.onDetailCollectionChange;
	        var register = handlers.length == 0;
	        _bindHandler(handler, handlers, bind, scope);
	        if (register)
	            MobileCRM.bridge.command("registerEvents", "onDetailCollectionChange");
	    };

	    // Services
	    MobileCRM.Services.DocumentService.prototype._executeAction = function (action, callback, errorCallback, scope) {
	        var params = {
	            action: action,
				maxImageSize: this.maxImageSize,
				maxUploadImageSize: this.maxUploadImageSize,
	            recordQuality: this.recordQuality,
	            allowChooseVideo: this.allowChooseVideo,
				allowMultipleFiles: this.allowMultipleFiles,
				allowCancelHandler: this.allowCancelHandler
	        };
	        MobileCRM.bridge.command("documentService", JSON.stringify(params), callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.capturePhoto = function (callback, errorCallback, scope) {
	        /// <summary>Asks the user to capture a photo and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(2, callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.selectPhoto = function (callback, errorCallback, scope) {
	        /// <summary>Asks the user to choose a media (image, video, depending on the value of allowChooseVideo property) and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(4, callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.selectFile = function (callback, errorCallback, scope) {
	        /// <summary>Asks the user to choose a file and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(8, callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.recordAudio = function (callback, errorCallback, scope) {
	        /// <summary>Asks the user to record an audio note and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(0x10, callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.recordVideo = function (callback, errorCallback, scope) {
	        /// <summary>Asks the user to record an video and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(0x20, callback, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.pasteFile = function (callback, errorCallback, scope) {
	        /// <summary>Takes the file from clipboard and calls the async callback with file info.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        this._executeAction(0x40000, callback, errorCallback, scope);
        };
		MobileCRM.Services.DocumentService.prototype.selectMultiplePhotos = function (callback, errorCallback, scope) {
	        /// <summary>[v11.2.3] Asks the user to choose multiple photos and calls the async callback with linked list of file infos (see <see cref="MobileCRM.Services.FileInfo">FileInfo.nextInfo</see>).</summary>
			/// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this._executeAction(0x1000000, callback, errorCallback, scope);
		};
		MobileCRM.Services.DocumentService.prototype.selectMultipleFiles = function (callback, errorCallback, scope) {
			/// <summary>[v14.2.0] Asks the user to choose multiple files and calls the async callback with linked list of file infos (see <see cref="MobileCRM.Services.FileInfo">FileInfo.nextInfo</see>).</summary>
			/// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this.allowMultipleFiles = true;
			this._executeAction(0x10000000, callback, errorCallback, scope);
		};
		MobileCRM.Services.DocumentService.prototype.loadFrom = function (callback, errorCallback, scope) {
			/// <summary>[13.3.4]Asks the user to choose a file and calls the async callback with file info.</summary>
			/// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this._executeAction(0x0080, callback, errorCallback, scope);
		};
		MobileCRM.Services.DocumentService.prototype.loadFromMultiple = function (callback, errorCallback, scope) {
			/// <summary>[13.3.4]Asks the user to choose a multiple files and calls the async callback with file info.</summary>
			/// <param name="callback" type="function(MobileCRM.Services.FileInfo)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.FileInfo">MobileCRM.Services.FileInfo</see> object as an argument.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this._executeAction(0x2000000, callback, errorCallback, scope);
		};
	    MobileCRM.Services.DocumentService.prototype.print = function (filePath, landscape, errorCallback, scope) {
	        /// <summary>[v9.1] Prints the document defined by file path.</summary>
	        /// <param name="filePath" type="String">A file path.</param>
	        /// <param name="landscape" type="Boolean">True, to print the document in landscape. False, to print it in portrait</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The error callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = {
	            filePath: filePath || "",
	            landscape: landscape,
	            print:true
	        }
	        MobileCRM.bridge.command("documentService", JSON.stringify(params), null, errorCallback, scope);
	    };
	    MobileCRM.Services.DocumentService.prototype.resizeImage = function (filePath, maxWidth, maxHeight, callback, scope) {
	        /// <summary>[v11.1] Resize image defined by file path.</summary>
	        /// <param name="filePath" type="String">A file path.</param>
	        /// <param name="maxWidth" type="Number">Max width.</param>
	        /// <param name="maxHeight" type="Number">Max height.</param>
	        /// <param name="callback" type="function(result)">A callback function for asynchronous result. In case of success <b>result</b> argument will be <b>true</b> otherwise <b>false.</b></param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = {
	            filePath: filePath || "",
	            maxWidth: maxWidth,
	            maxHeight: maxHeight,
	            resizeImage:true
	        }
	        MobileCRM.bridge.command("documentService", JSON.stringify(params), callback, null, scope);
		};
		MobileCRM.Services.DocumentService.prototype.saveFileDialog = function (fileName, fileData, callback, scope) {
			/// <summary>[v11.2] Ask to user to choose a location and saves the passed data as a file at that location.</summary>
			/// <param name="fileName" type="String">A file name.</param>
			/// <param name="fileData" type="String">Base64 encoded file data.</param>
			/// <param name="callback" type="function(result)">A callback function for asynchronous result. In case of success <b>result</b> argument will be <b>true</b> otherwise <b>false.</b></param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			var params = {
				fileName: fileName || "",
				fileData: fileData,
				saveFileDialog: true
			}
			MobileCRM.bridge.command("documentService", JSON.stringify(params), callback, null, scope);
		};
	    _inherit(MobileCRM.Services.ChatService, MobileCRM.ObservableObject);
	    MobileCRM.Services.ChatService.getService = function (callback, errorCallback, scope) {
	        /// <summary>Asynchronously creates the new instance of the ChatService.</summary>
	        /// <param name="callback" type="function(MobileCRM.Services.ChatService)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.ChatService">MobileCRM.Services.ChatService</see> instance as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("chatService", JSON.stringify({ method: "create" }), callback, errorCallback, scope);
	    };
	    MobileCRM.Services.ChatService.prototype.postMessage = function (regardingEntity, text, callback, errorCallback, scope) {
	        /// <summary>Submits a new post into the channel defines by related entity reference.</summary>
	        /// <remarks>Use reference to resco_chattopic entity to specify a shared channel or reference to a peer user to specify the private channel.</remarks>
	        /// <param name="regardingEntity" type="MobileCRM.Reference">A reference to an entity that the post should relate to.</param>
	        /// <param name="text" type="String">The post content.</param>
	        /// <param name="callback" type="function(MobileCRM.DynamicEntity)">The callback function which is called asynchronously with <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> representing newly created resco_chatpost record.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("chatService", JSON.stringify({ method: "postMessage", entityName: regardingEntity.entityName, entityId: regardingEntity.id, primaryName: regardingEntity.primaryName, text: text }), callback, errorCallback, scope);
	    };
	    MobileCRM.Services.ChatService.prototype.attachNoteToPost = function (postId, filePath, mimeType, subject, callback, errorCallback, scope) {
	        /// <summary>Creates a note (annotation) entity with the file attachment related to specified post.</summary>
	        /// <remarks>The file path can be either a relative path to application data or a full path to a file being attached.</remarks>
	        /// <param name="postId" type="String">An id of the resco_chatpost entity which should have the note attached.</param>
	        /// <param name="filePath" type="String">A path to a file that has to be attached.</param>
	        /// <param name="mimeType" type="String">A MIME type of the file.</param>
	        /// <param name="subject" type="String">A text which will be used as note&apos;s subject.</param>
	        /// <param name="callback" type="function(MobileCRM.DynamicEntity)">The callback function which is called asynchronously with <see cref="MobileCRM.DynamicEntity">MobileCRM.DynamicEntity</see> representing newly created annotation record.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("chatService", JSON.stringify({ method: "attachNoteToPost", postId: postId, filePath: filePath, mimeType: mimeType, subject: subject }), callback, errorCallback, scope);
	    };
	    MobileCRM.Services.ChatService.prototype.subscribeToEntityChannel = function (regardingEntity, subscribe, callback, errorCallback, scope) {
	        /// <summary>Subscribes current user to a channel specified by related entity.</summary>
	        /// <remarks>Use reference to resco_chattopic entity to specify a shared channel.</remarks>
	        /// <param name="regardingEntity" type="MobileCRM.Reference">Reference to an entity that has to be subscribed/unsubscribed.</param>
	        /// <param name="subscribe" type="Boolean">Determines whether to subscribe or unsubscribe entity channel.</param>
	        /// <param name="callback" type="Function">The callback function which is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("chatService", JSON.stringify({ method: "subscribe", entityName: regardingEntity.entityName, entityId: regardingEntity.id, primaryName: regardingEntity.primaryName, subscribe: subscribe }), callback, errorCallback, scope);
		};
		MobileCRM.Services.CompanyInformation.getCompanyInfoFromVat = function (vat, callback, errorCallback, scope) {
			/// <summary>Return callback with CompanyInformation object with properties name and address</summary>
			/// <param name="vat" type="string">VAT number of company. e.g. "SK2020232390"</param>
			/// <param name="callback" type="function(CompanyInformation)">The callback function which is called asynchronously in case of success.</param>
			/// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			if (!(typeof vat === "string")) {
				if (errorCallback)
					errorCallback('VAT is required and must be type of string.');
                return;
            }
			var content = "<SOAP-ENV:Envelope xmlns:ns1='urn:ec.europa.eu:taxud:vies:services:checkVat:types' xmlns:SOAP-ENV='http://schemas.xmlsoap.org/soap/envelope/'>" +
				"<SOAP-ENV:Body><ns1:checkVat><ns1:countryCode>" +
				vat.substring(0, 2) +
				"</ns1:countryCode><ns1:vatNumber>" +
				vat.substring(2) +
				"</ns1:vatNumber></ns1:checkVat></SOAP-ENV:Body></SOAP-ENV:Envelope>";
			var endpoint = "http://ec.europa.eu/taxation_customs/vies/services/checkVatService";
			var request = new MobileCRM.Services.HttpWebRequest();
			request.setBody(content);
			request.method = "POST";

			request.send(endpoint, function (response) {
				var textResponse = response.responseText;
				var codeResponse = response.responseCode;
				if (codeResponse == 200) {

					var parser = new DOMParser();
					var xmlDoc = parser.parseFromString(textResponse, "text/xml");

					try {
						var valid = xmlDoc.getElementsByTagName("valid")[0].childNodes[0].nodeValue;

						if (valid == "true") {
							var name = xmlDoc.getElementsByTagName("name")[0].childNodes[0].nodeValue;
							var address = xmlDoc.getElementsByTagName("address")[0].childNodes[0].nodeValue;
							var companyInfo = new MobileCRM.Services.CompanyInformation(name, address);
							if (typeof callback === 'function')
                                callback.call(scope, companyInfo);
						} else {
                            if (typeof errorCallback === 'function')
                                errorCallback("Invalid VAT number.");
						}
					}
                    catch (e) {
                        if (typeof errorCallback === 'function')
                            errorCallback("Not valid format of response.");
                    }
                } else {
                    if (typeof errorCallback === 'function')
                        errorCallback("Connection error.");
                }
			});
		};
	    MobileCRM.Services.AudioRecorder.startRecording = function (callback, errorCallback, scope) {
	        /// <summary>[v10.0] Starts recording audio from microphone</summary>
	        /// <param name="callback" type="function">The callback function which is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("audioRecorder", "startRecording", callback, errorCallback, scope);
	        return new MobileCRM.Services.AudioRecorder();
	    };

	    MobileCRM.Services.AudioRecorder.prototype.stopRecording = function (callback, errorCallback, scope) {
	        /// <summary>[v10.0] Stops recording audio from microphone</summary>
	        /// <param name="callback" type="function">The callback function which is called asynchronously in case of success.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("audioRecorder", "stopRecording", callback, errorCallback, scope);
	    };

	    MobileCRM.Services.AudioRecorder.prototype.getRecordBase64 = function (callback, errorCallback, scope) {
	        /// <summary>[v10.0] Returns recorded audio from microphone as base64 string</summary>
	        /// <param name="callback" type="function(String)">The callback function that is called asynchronously with the base64-encoded recording data.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("audioRecorder", "getRecordBase64", callback, errorCallback, scope);
	    };

	    MobileCRM.Services.AudioRecorder.prototype.getRecordFilePath = function (callback, errorCallback, scope) {
	        /// <summary>[v10.0] Returns absolute path to the file containing the record</summary>
	        /// <param name="callback" type="function(String)">The callback function that is called asynchronously with the file path.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("audioRecorder", "getRecordFilePath", callback, errorCallback, scope);
	    };

	    MobileCRM.Services.AddressBookService.getService = function (errorCallback, scope) {
	        /// <summary>[v9.1] Gets an instance of AddressBookService object.</summary>
	        /// <returns type="MobileCRM.Services.AddressBookService">An instance of AddressBookService object.</returns>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("getAddressService", [], null, errorCallback, scope);
	        return new MobileCRM.Services.AddressBookService();
	    };

	    MobileCRM.Services.AddressBookService.prototype.getContact = function (id, callback, errorCallback, scope) {
	        /// <summary>[v9.1] Gets an address book contact by its ID.</summary>
	        /// <param name="id" type="String">Requested contact id.</param>
	        /// <param name="callback" type="function(MobileCRM.Services.AddressBookService.AddressBookRecord)">The callback function which is called asynchronously with <see cref="MobileCRM.Services.AddressBookService.AddressBookRecord">MobileCRM.Services.AddressBookService.AddressBookRecord</see> object as an argument.</param>
	        /// <param name="errorCallback" type="function(errorMsg)">The errorCallback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.invokeMethodAsync("AddressBookService", "GetContact", [id], function (res) {
	            callback.call(scope, res);
	        }, errorCallback, scope);

	    };

	    MobileCRM.Services.AddressBookService.AddressBookRecord = function () {
	        /// <field name="recordId" type="String">Record id.</field>
	        /// <field name="firstName" type="String">Record first name.</field>
	        /// <field name="lastName" type="String">Record last name.</field>
	        /// <field name="middleName" type="String">Record middle name.</field>
	        /// <field name="nickName" type="String">Record nick name.</field>
	        /// <field name="jobTitle" type="String">Job title.</field>
	        /// <field name="organization" type="String">Organization name.</field>
	        /// <field name="prefix" type="String">Name prefix (Title) name.</field>
	        /// <field name="suffix" type="String">Name suffix (Title) name.</field>
	        /// <field name="geo" type="Array">Address GPS coordinates.</field>
	        /// <field name="url" type="String">Web page URL of record.</field>
	    };

	    MobileCRM.Services.GeoAddress.fromLocation = function (latitude, longitude, success, failed, scope) {
	        /// <summary>Translates the geo position represented by latitude and longitude values into the GeoAddress object.</summary>
	        /// <param name="latitude" type="Number">Latitude value of the GPS position.</param>
	        /// <param name="longitude" type="Number">Longitude value of the GPS position.</param>
	        /// <param name="success" type="function(address)">A callback function that is called with the GeoAddress object as argument.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("locationToAddress", latitude + ";" + longitude, success, failed, scope);
	    };
	    MobileCRM.Services.GeoAddress.prototype.toLocation = function (success, failed, scope) {
	        /// <summary>Translates the civic address represented by GeoAddress object into GPS position.</summary>
	        /// <param name="success" type="function(location)">A callback function that is called with the location object having latitude and longitude properties.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        MobileCRM.bridge.command("addressToLocation", JSON.stringifyNotNull(this), success, failed, scope);
		};

		//// --- AIVISION ---
		MobileCRM.Services.AIVision.create = function (settings) {
			/// <summary>[v12.3]Create AIVsion instance using <see cref="MobileCRM.Services.AIVisionSettings">MobileCRM.Services.AIVisionSettings</see> object.</summary>
			/// <param name="settings" type="MobileCRM.Services.AIVisionSettings">AIVision settings.</param>

			var aivison = new MobileCRM.Services.AIVision();
			aivison._settings = [];
			aivison._settings.push("{ \"name\":\"" + settings.modelName + "\", \"predictionKey\":\"" + settings.predictionKey + "\", \"url\":\"" + settings.url + "\", \"serviceType\":\"" + settings.serviceType + "\"}");
			return aivison;
		};

		MobileCRM.Services.AIVision.createFromEntity = function (entityName) {
			/// <summary>[v12.3]Create AIVsion instance using entity name. The name is used to get settings from Woodford AI Image Recognition configuration.</summary>
			/// <param name="entityName" type="String">The entity name of Woodford AI Image Recognition configuration.</param>
			var aivison = new MobileCRM.Services.AIVision();
			aivison._entityName = entityName;
			return aivison;
		};

		MobileCRM.Services.AIVision.prototype.recognizeCapturedPhoto = function (sucessCallback, failureCallback, scope) {
			/// <summary>[v12.3] Recognize captured photo using AIVison service.</summary>
			/// <param name="sucessCallback" type="function">A callback function that is called with the object having array of tags and its probability and file path properties. {tags:[{tag:"", probability:""}], filePath:""} </param>
			/// <param name="failureCallback" type="function(errorMsg)">A callback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this._executeAction(2, sucessCallback, failureCallback);
		};
		MobileCRM.Services.AIVision.prototype.recognizeSelectedPicture = function (sucessCallback, failureCallback, scope) {
			/// <summary>[v12.3] Select photo and recognize it with AIVison service.</summary>
			/// <param name="sucessCallback" type="function">A callback function that is called with the object having array of tags and its probability and file path properties. {tags:[{tag:"", probability:""}], filePath:""} </param>
			/// <param name="failureCallback" type="function(errorMsg)">A callback which is called in case of error.</param>
			/// <param name="scope" type="Object">The scope for callbacks.</param>
			this._executeAction(4, sucessCallback, failureCallback);
		};

		MobileCRM.Services.AIVision.prototype._executeAction = function (action, sucessCallback, failureCallback, scope) {
			if (!this._entityName && !this._settings) {
				failureCallback("Please define entity or settings to construct AIVision service.");
				return;
			}
			var data = {
				entityName: this._entityName,
				settings: this._settings,
				action: action,
				isNew: this._isNew
			};

			this._isNew = false;

			MobileCRM.bridge.command("startAIImageRecognition", JSON.stringify(data), function (classifiedResults) {
				sucessCallback.call(scope, classifiedResults);
			}, failureCallback, scope);
		};

	    MobileCRM.Services.DynamicsReport.prototype.download = function (fileName, format, success, failed, scope) {
	        /// <summary>Downloads the MS Dynamics report into a file.</summary>
	        /// <param name="fileName" type="String">A file name for resulting file. Leave &quot;null&quot; to let app to safely generate the file name and extension.</param>
	        /// <param name="format" type="String">One of following formats (must be supported in Dynamics): XML, CSV, PDF, MHTML, EXCELOPENXML, WORDOPENXML, IMAGE.</param>
	        /// <param name="success" type="function(location)">A callback function that is called with the full path to downloaded file.</param>
	        /// <param name="failed" type="function(errorMsg)">A callback which is called in case of error.</param>
	        /// <param name="scope" type="Object">The scope for callbacks.</param>
	        var params = JSON.stringify({
	            format: format || "PDF",
	            outputFileName: fileName,
	            outputFolder: this.outputFolder,
	            outputFilePath: this.outputFilePath, // for internal use only
	            reportId: this.reportId,
	            regardingEntity: this.regarding ? this.regarding.entityName: null,
	            regardingId: this.regarding ? this.regarding.id: null
	        });
	        MobileCRM.bridge.command("downloadReport", params, success, failed, scope);
	    };
		MobileCRM.Services.HttpWebRequest.prototype.send = function (url, callback, scope) {
		    /// <summary>[v11.0] Allow to send http web request against an HTTP server.</summary>
		    /// <param name="url" type="String">The Url of server where HTTP request will be sent.</param>
		    /// <param name="callback" type="function(response)">A callback function that is called with the web response having &quot;responseCode&quot; and &quot;responseText&quot; properties.</param>
		    /// <param name="scope" type="Object">The scope for callbacks.</param>

		    var data = {
		        url: url, method: this.method,
		        headers: JSON.stringify(this.headers),
		        credentials: this._credentials, body: this._body,
		        encoding: this._encoding, contentType: this.contentType,
		        allowRedirect: this.allowRedirect,
                responseEncoding: this.responseEncoding
		    };

		    if (this._encoding === "Binary") {
		        if (this._body && this._body.constructor == Blob) {
		            var reader = new FileReader();
		            reader.addEventListener("loadend", function (res) {
		                data.body = this.result.split(',')[1];
		                data.encoding = "Base64";
						MobileCRM.bridge.command("sendHttpRequest", JSON.stringify(data), callback, null, scope);
		            });
		            reader.readAsDataURL(this._body);
		        }
		    }
		    else
				MobileCRM.bridge.command("sendHttpRequest", JSON.stringify(data), callback, null, scope);
		};
		MobileCRM.Services.HttpWebRequest.prototype.sendAsync = function (url) {
			/// <summary>[v13.3] Allow to send http web request against an HTTP server.</summary>
			/// <param name="url" type="String">The Url of server where HTTP request will be sent.</param>
			/// <returns type="Promise&lt;IWebResponse&gt;">A Promise object which is asynchronously resolved with the web response object, or rejected with the web response object, where responseText contains error message.</returns>

			var _this = this;
			return new Promise(function (resolve, reject) {
				_this.send(url, function (response) {
					if (response["isFailure"])
						reject(response);
					else
						resolve(response);
				});
			});
		};
		MobileCRM.Services.HttpWebRequest.prototype.setBody = function (body, encoding) {
		    /// <summary>[v11.0] Set content body of http web request.</summary>
		    /// <param name="body" type="String">The body content.</param>
		    /// <param name="encoding" type="String">The encoding (e.g. UTF-8, ASCII, Base64, Binary)</param>

		    this._body = body;
		    if (encoding)
		        this._encoding = encoding;
		}
		MobileCRM.Services.HttpWebRequest.prototype.setResponseEncoding = function (encoding) {
			/// <summary>[v11.0] Set encoding for content type of http web response.</summary>
			/// <param name="encoding" type="String">The encoding (e.g. UTF-8, ASCII, Base64)</param>

			if (encoding || encoding !== "Base64")
				this.responseEncoding = encoding;
		};
		MobileCRM.Services.HttpWebRequest.prototype.setCredentials = function (userName, password) {
		    /// <summary>[v10.4] Set Network credentials information.</summary>
		    /// <param name="userName" type="String">The authentication user name.</param>
		    /// <param name="password" type="String">The authentication password.</param>
		    this.userName = userName;
		    this.password = password;

		    this._credentials = JSON.stringify({ "userName": this.userName, "password": this.password });
		}
		MobileCRM.Services.Workflow = {};
		MobileCRM.Services.Workflow.Action = function () {
			/// <summary>[v11.2] Represents custom workfow action.</summary>
		};
		MobileCRM.Services.Workflow.Action.execute = function (actionName, parameters, success, failed, scope) {
			/// <summary>[v11.2] Asynchronously executes custom workfow action on the server.</summary>
			/// <param name="actionName" type="String">The unique name of the custom action to execute.</param>
			/// <param name="parameters" type="Object">The object containing the parameters for the custom action.</param>
			/// <param name="success" type="function(string)">A callback function for successful asynchronous result. The <b>result</b> argument will carry the serialized response from the server.</param>
			/// <param name="failed" type="function(error)">A callback function for command failure. The <b>error</b> argument will carry the error message.</param>
			/// <param name="scope" type="">A scope for calling the callbacks; set &quot;null&quot; to call the callbacks in global scope.</param>
			window.MobileCRM.bridge.command('executeWorkflowAction', JSON.stringify({ actionName: actionName, actionParameters: JSON.stringify(parameters) }), success, failed, scope);
		};

		/**************************************/
		// Platform dependent implementation   /
		// MobileCRM.bridge singleton creation /
		/**************************************/
		if (typeof(window) != "undefined") {
			if (document.location.search.indexOf("wc_mcrm_bid|") >= 0) {	// when running on webclient, that client appends 'wc_mcrm_bid|' is part of the 'data' attribute
				var webClientBridgeId = getWCBridgeInstanceId();
	
				MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
					if (!webClientBridgeId) {
						webClientBridgeId = getWCBridgeInstanceId();
					}
					var cmdId = this._createCmdObject(success, failed, scope);
					var cmdText = webClientBridgeId + ';' + cmdId + ';' + command + ';' + params;
					parent.window.postMessage(cmdText, "*");
				};
				MobileCRM.bridge = new MobileCRM.Bridge('WebClient');
	
				window.addEventListener("message", receiveMessageFromWebClient, false);
	
				function receiveMessageFromWebClient(event) {
					var data = (typeof event.data === 'string' ? event.data : null);
					//alert("JSB: " + data);
					try {
						// process invokescript method
						if (data && data.indexOf("eval") === 0) {
							var index = data.indexOf(":");
							if (index >= 0) {
								var evalCode = data.substr(index + 1);
								var evalId = data.substr(0, index).split('|')[1];
								var result = eval(evalCode);
								if (evalId) {
									if (!webClientBridgeId) {
										webClientBridgeId = getWCBridgeInstanceId();
									}
									parent.window.postMessage(webClientBridgeId + ";" + evalId + ";asyncResponse;" + result, "*");
								}
							}
						}
					}
					catch (ex) {
						MobileCRM.bridge.alert("JSBridge on Webclient exception: " + ex);
						console.log(ex);
					}
				}
	
				function getWCBridgeInstanceId() {
					var args = document.location.search;
					var index = args.indexOf("wc_mcrm_bid|");
					var id = null;
					if (index > 0) {
						id = args.substr(index + 12);
					}
					if (id === null) {
						throw "JSBridge not registered."
					}
					return id;
				}
			}
			else if (typeof CrmBridge !== "undefined") {
				if (typeof CrmBridge.processCommand !== "undefined") {
					MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
						var cmdId = this._createCmdObject(success, failed, scope);
						CrmBridge.processCommand(cmdId, command, params);
					};
					MobileCRM.bridge = new MobileCRM.Bridge('Windows'); // Chromium Enbedded Framework on Win7 Desktop
				}
				else {
					// Android
					MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
						var cmdId = this._createCmdObject(success, failed, scope);
						CrmBridge.println(cmdId + ';' + command + ':' + params);
					};
					MobileCRM.bridge = new MobileCRM.Bridge('Android');
				}
				if (typeof CrmBridge.invoke !== "undefined") {
					MobileCRM.Bridge.prototype.invoke = function (command, params) {
						var result = CrmBridge.invoke(command, params);
						if (result.length >= 4 && result.substr(0, 4) == 'ERR:')
							throw new MobileCrmException(result.substr(4));
						else
							return eval('(' + result + ')');
					};
				}
			}
			else {
				if ("external" in window && external) {
					var win10 = "win10version" in window;
					if ("notify" in external || win10) {
						// WindowsPhone || WindowsRT || Windows10
						MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
							var cmdId = this._createCmdObject(success, failed, scope);
							window.external.notify(cmdId + ';' + command + ':' + params);
						};
						MobileCRM.Bridge.prototype.invoke = function (command, params) {
							var result = undefined;
							var error = null;
							var cmdId = this._createCmdObject(function (res) { result = res; }, function (err) { error = err; }, this);
							window.external.notify(cmdId + ';' + command + ':' + params);
							if (error)
								throw new MobileCrmException(error);
							else
								return result;
						};
						if (!("alert" in window)) {
							window.alert = function (text) {
								MobileCRM.bridge.invoke("alert", text);
							};
						}
						MobileCRM.Bridge.prototype.alert = function (text, callback, scope) {
							/// <summary>Shows a message asynchronously and calls the callback after it is closed by user.</summary>
							/// <param name="callback" type="function(obj)">The callback function that is called asynchronously.</param>
							/// <param name="scope" type="Object">The scope for callbacks.</param>
							MobileCRM.bridge.command("alert", text, callback, callback, scope);
						};
						var platformName = win10 ? window.win10version : (navigator.userAgent.indexOf("Windows Phone") > 0 ? "WindowsPhone" : "WindowsRT");
						MobileCRM.bridge = new MobileCRM.Bridge(platformName);
					}
					else if ("ProcessCommand" in external) {
						// Windows Desktop
						MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
							var cmdId = this._createCmdObject(success, failed, scope);
							external.ProcessCommand(cmdId, command, params);
						};
						if ("InvokeCommand" in external) {
							MobileCRM.Bridge.prototype.invoke = function (command, params) {
								var result = window.external.InvokeCommand(command, params);
								if (result.length >= 4 && result.substr(0, 4) == 'ERR:')
									throw new MobileCrmException(result.substr(4));
								else
									return eval('(' + result + ')');
							};
						}
						MobileCRM.bridge = new MobileCRM.Bridge('Windows');
					}
				}
				else if ("webkit" in window && "messageHandlers" in webkit && "JSBridge" in webkit.messageHandlers) {
					MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
						var cmdId = this._createCmdObject(success, failed, scope);
						var cmdText = cmdId + ';' + command + ':' + params;
						webkit.messageHandlers.JSBridge.postMessage(cmdText);
					};
					MobileCRM.bridge = new MobileCRM.Bridge('iOS');
				}
				else if (navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad|applewebkit)/)) {
					MobileCRM.Bridge.prototype.command = function (command, params, success, failed, scope) {
						var self = MobileCRM.bridge;
						var cmdId = self._createCmdObject(success, failed, scope);
						var cmdText = cmdId + ';' + command + ':' + params; //{ Command: command, Id: callbackObj };
						self.commandQueue.push(cmdText);
						if (!self.processing) {
							self.processing = true;
							document.location.href = 'crm:wake';
	//						var iframe = document.createElement("IFRAME");
	//						iframe.setAttribute("src", "crm:wake");
	//						document.documentElement.appendChild(iframe);
	//						iframe.parentNode.removeChild(iframe);
						}
					};
					MobileCRM.Bridge.prototype.peekCommand = function () {
						var cmdText = MobileCRM.bridge.commandQueue.shift();
						if (cmdText != null) {
							return cmdText;
						}
						return "";
					};
	 				MobileCRM.Bridge.prototype.invoke = function (command, params) {
						var self = MobileCRM.bridge;
						var result = undefined;
						var error = null;
						var cmdId = self._createCmdObject(function (res) { result = res; }, function (err) { error = err; }, self);
						var cmdText = cmdId + ';' + command + ':' + params;
						self.commandQueue.push(cmdText);
	
	                    var iframe = document.getElementById("MobileCRM_JSBridge_iFrame");
	                    if (iframe === null) {
	                        iframe = document.createElement("iframe");
	                        iframe.id = "MobileCRM_JSBridge_iFrame";
	                        iframe.style = "visibility:hidden;display:none";
	                        iframe.src = "crm:wake";
	                        iframe.height = 0; iframe.width = 0; iframe.hspace = "0"; iframe.vspace = "0";
	                        iframe.marginheight = "0"; iframe.marginwidth = "0"; iframe.frameBorder = "0";
	                        iframe.scrolling = "No";
	                        document.documentElement.appendChild(iframe);
	                    } else {
	                        iframe.src = iframe.src;
	                        document.documentElement.removeChild(iframe);
	                        document.documentElement.appendChild(iframe);
	                    }                    
	                    if(error)
	                        throw new MobileCrmException(error);
						return result;
					};
					MobileCRM.Bridge.prototype.dequeueCommand = function (id) {
						var queue = MobileCRM.bridge.commandQueue;
						for (var i in queue) {
							var cmdText = queue[i];
							if (cmdText) {
								var idEnd = cmdText.indexOf(';');
								if (idEnd > 0 && cmdText.substr(0, idEnd) == id) {
									queue.splice(i, 1);
									return cmdText;
								}
							}
						}
						return "";
					};
					MobileCRM.bridge = new MobileCRM.Bridge('iOS');
	
					MobileCRM.Bridge.prototype.initialize = function () {
						/// <summary>OBSOLETE: Initializes the bridge to be used for synchronous invokes.</summary>
					};
	
				}
	
				//if (MobileCRM.bridge == null)
				//    throw new Error("MobileCRM bridge does not support this platform.");
			}
		}
	}

	///////////////////////////////////////////
	// Resolve the missing JSON implementation
	if (typeof JSON === "undefined")
		JSON = {};

	if (typeof JSON.parse !== 'function')
		JSON.parse = function (text, reviver) {
			var j;
			function walk(holder, key) {
				var k, v, value = holder[key];
				if (value && typeof value === 'object') {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			text = String(text);
			var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
			cx.lastIndex = 0;
			if (cx.test(text)) {
				text = text.replace(cx, function (a) {
					return '\\u' +
						('0000' + a.charCodeAt(0).toString(16)).slice(-4);
				});
			}
			if (/^[\],:{}\s]*$/
					.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
						.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
						.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
				j = eval('(' + text + ')');
				return typeof reviver === 'function' ?
					walk({ '': j }, '') : j;
			}
			throw new SyntaxError('JSON.parse');
		};

	if (typeof JSON.stringify !== 'function')
		JSON.stringify = function (obj) {
			var t = typeof obj;
			if (t != "object" || obj === null) {
				if (t == "string") obj = obj.toJSON();
				return String(obj);
			}
			else if (obj instanceof Date) return '"' + obj.toJSON() + '"';
			else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n]; t = typeof v;
					if (t != 'function') {
						if (t == "string") v = v.toJSON();
						if (t == "undefined") v = null;
						else if (t == "object" && v !== null) v = JSON.stringify(v);
						json.push((arr ? "" : '"' + n + '":') + String(v));
					}
				}
				return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		};

	// A custom JSON.stringify version which omits the properties with undefined values
	if (typeof JSON.stringifyNotNull !== 'function')
		JSON.stringifyNotNull = function (obj) {
			var t = typeof obj;
			if (t != "object" || obj === null) {
				if (t == "string") obj = obj.toJSON();
				return String(obj);
			}
			else if (obj instanceof Date) return '"' + obj.toJSON() + '"';
			else {
				var n, v, json = [], arr = (obj && obj.constructor == Array);
				for (n in obj) {
					v = obj[n];
					if (v != null) {
						t = typeof v;
						if (t != 'function' && t != 'undefined') {
							if (t == "string") v = v.toJSON();
							else if (t == "object" && v !== null) {
								if ((v = JSON.stringifyNotNull(v)) == 'null')
									continue;
							}
							json.push((arr ? "" : '"' + n + '":') + String(v));
						}
					}
				}
				return (json.length == 0) ? "null" : (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
			}
		};

	if (typeof Date.prototype.toJSON !== 'function') {
		Date.prototype.toJSON = function (key) {
			function f(n) {
				return n < 10 ? '0' + n : n;
			}
			if (isFinite(this.valueOf())) {
				var timeOff = -this.getTimezoneOffset() / 60;
				return this.getFullYear() + '-' +
					f(this.getMonth() + 1) + '-' +
					f(this.getDate()) + 'T' +
					f(this.getHours()) + ':' +
					f(this.getMinutes()) + ':' +
					f(this.getSeconds()) +
					(timeOff == 0 ? 'Z' : ((timeOff > 0 ? '+' : '') + f(timeOff) + ':00'));
			}
			else
				return null;
		};

		Number.prototype.toJSON =
		Boolean.prototype.toJSON = function (key) {
			return this.valueOf();
		};
	}

	String.prototype.toJSON = function () {
		return '"' + this.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + '"';
	};
})();


/***/ }),

/***/ "./node_modules/abab/index.js":
/*!************************************!*\
  !*** ./node_modules/abab/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const atob = __webpack_require__(/*! ./lib/atob */ "./node_modules/abab/lib/atob.js");
const btoa = __webpack_require__(/*! ./lib/btoa */ "./node_modules/abab/lib/btoa.js");

module.exports = {
  atob,
  btoa
};


/***/ }),

/***/ "./node_modules/abab/lib/atob.js":
/*!***************************************!*\
  !*** ./node_modules/abab/lib/atob.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
function atob(data) {
  // Web IDL requires DOMStrings to just be converted using ECMAScript
  // ToString, which in our case amounts to using a template literal.
  data = `${data}`;
  // "Remove all ASCII whitespace from data."
  data = data.replace(/[ \t\n\f\r]/g, "");
  // "If data's length divides by 4 leaving no remainder, then: if data ends
  // with one or two U+003D (=) code points, then remove them from data."
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  // "If data's length divides by 4 leaving a remainder of 1, then return
  // failure."
  //
  // "If data contains a code point that is not one of
  //
  // U+002B (+)
  // U+002F (/)
  // ASCII alphanumeric
  //
  // then return failure."
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null;
  }
  // "Let output be an empty byte sequence."
  let output = "";
  // "Let buffer be an empty buffer that can have bits appended to it."
  //
  // We append bits via left-shift and or.  accumulatedBits is used to track
  // when we've gotten to 24 bits.
  let buffer = 0;
  let accumulatedBits = 0;
  // "Let position be a position variable for data, initially pointing at the
  // start of data."
  //
  // "While position does not point past the end of data:"
  for (let i = 0; i < data.length; i++) {
    // "Find the code point pointed to by position in the second column of
    // Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in
    // the first cell of the same row.
    //
    // "Append to buffer the six bits corresponding to n, most significant bit
    // first."
    //
    // atobLookup() implements the table from RFC 4648.
    buffer <<= 6;
    buffer |= atobLookup(data[i]);
    accumulatedBits += 6;
    // "If buffer has accumulated 24 bits, interpret them as three 8-bit
    // big-endian numbers. Append three bytes with values equal to those
    // numbers to output, in the same order, and then empty buffer."
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      buffer = accumulatedBits = 0;
    }
    // "Advance position by 1."
  }
  // "If buffer is not empty, it contains either 12 or 18 bits. If it contains
  // 12 bits, then discard the last four and interpret the remaining eight as
  // an 8-bit big-endian number. If it contains 18 bits, then discard the last
  // two and interpret the remaining 16 as two 8-bit big-endian numbers. Append
  // the one or two bytes with values equal to those one or two numbers to
  // output, in the same order."
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  // "Return output."
  return output;
}
/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */

const keystr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function atobLookup(chr) {
  const index = keystr.indexOf(chr);
  // Throw exception if character is not in the lookup string; should not be hit in tests
  return index < 0 ? undefined : index;
}

module.exports = atob;


/***/ }),

/***/ "./node_modules/abab/lib/btoa.js":
/*!***************************************!*\
  !*** ./node_modules/abab/lib/btoa.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";


/**
 * btoa() as defined by the HTML and Infra specs, which mostly just references
 * RFC 4648.
 */
function btoa(s) {
  let i;
  // String conversion as required by Web IDL.
  s = `${s}`;
  // "The btoa() method must throw an "InvalidCharacterError" DOMException if
  // data contains any character whose code point is greater than U+00FF."
  for (i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 255) {
      return null;
    }
  }
  let out = "";
  for (i = 0; i < s.length; i += 3) {
    const groupsOfSix = [undefined, undefined, undefined, undefined];
    groupsOfSix[0] = s.charCodeAt(i) >> 2;
    groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4;
    if (s.length > i + 1) {
      groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2;
    }
    if (s.length > i + 2) {
      groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += btoaLookup(groupsOfSix[j]);
      }
    }
  }
  return out;
}

/**
 * Lookup table for btoa(), which converts a six-bit number into the
 * corresponding ASCII character.
 */
const keystr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function btoaLookup(index) {
  if (index >= 0 && index < 64) {
    return keystr[index];
  }

  // Throw INVALID_CHARACTER_ERR exception here -- won't be hit in the tests.
  return undefined;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/data-urls/lib/parser.js":
/*!**********************************************!*\
  !*** ./node_modules/data-urls/lib/parser.js ***!
  \**********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const MIMEType = __webpack_require__(/*! whatwg-mimetype */ "./node_modules/whatwg-mimetype/lib/mime-type.js");
const { parseURL, serializeURL, percentDecodeString } = __webpack_require__(/*! whatwg-url */ "./node_modules/whatwg-url/index.js");
const { stripLeadingAndTrailingASCIIWhitespace, isomorphicDecode, forgivingBase64Decode } = __webpack_require__(/*! ./utils.js */ "./node_modules/data-urls/lib/utils.js");

module.exports = stringInput => {
  const urlRecord = parseURL(stringInput);

  if (urlRecord === null) {
    return null;
  }

  return module.exports.fromURLRecord(urlRecord);
};

module.exports.fromURLRecord = urlRecord => {
  if (urlRecord.scheme !== "data") {
    return null;
  }

  const input = serializeURL(urlRecord, true).substring("data:".length);

  let position = 0;

  let mimeType = "";
  while (position < input.length && input[position] !== ",") {
    mimeType += input[position];
    ++position;
  }
  mimeType = stripLeadingAndTrailingASCIIWhitespace(mimeType);

  if (position === input.length) {
    return null;
  }

  ++position;

  const encodedBody = input.substring(position);

  let body = percentDecodeString(encodedBody);

  // Can't use /i regexp flag because it isn't restricted to ASCII.
  const mimeTypeBase64MatchResult = /(.*); *[Bb][Aa][Ss][Ee]64$/u.exec(mimeType);
  if (mimeTypeBase64MatchResult) {
    const stringBody = isomorphicDecode(body);
    body = forgivingBase64Decode(stringBody);

    if (body === null) {
      return null;
    }
    mimeType = mimeTypeBase64MatchResult[1];
  }

  if (mimeType.startsWith(";")) {
    mimeType = `text/plain${mimeType}`;
  }

  let mimeTypeRecord;
  try {
    mimeTypeRecord = new MIMEType(mimeType);
  } catch (e) {
    mimeTypeRecord = new MIMEType("text/plain;charset=US-ASCII");
  }

  return {
    mimeType: mimeTypeRecord,
    body
  };
};


/***/ }),

/***/ "./node_modules/data-urls/lib/utils.js":
/*!*********************************************!*\
  !*** ./node_modules/data-urls/lib/utils.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

const { atob } = __webpack_require__(/*! abab */ "./node_modules/abab/index.js");

exports.stripLeadingAndTrailingASCIIWhitespace = string => {
  return string.replace(/^[ \t\n\f\r]+/u, "").replace(/[ \t\n\f\r]+$/u, "");
};

exports.isomorphicDecode = input => {
  return Array.from(input, byte => String.fromCodePoint(byte)).join("");
};

exports.forgivingBase64Decode = data => {
  const asString = atob(data);
  if (asString === null) {
    return null;
  }
  return Uint8Array.from(asString, c => c.codePointAt(0));
};


/***/ }),

/***/ "./node_modules/punycode/punycode.es6.js":
/*!***********************************************!*\
  !*** ./node_modules/punycode/punycode.es6.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ucs2decode": () => (/* binding */ ucs2decode),
/* harmony export */   "ucs2encode": () => (/* binding */ ucs2encode),
/* harmony export */   "decode": () => (/* binding */ decode),
/* harmony export */   "encode": () => (/* binding */ encode),
/* harmony export */   "toASCII": () => (/* binding */ toASCII),
/* harmony export */   "toUnicode": () => (/* binding */ toUnicode),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });


/** Highest positive signed 32-bit float value */
const maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1

/** Bootstring parameters */
const base = 36;
const tMin = 1;
const tMax = 26;
const skew = 38;
const damp = 700;
const initialBias = 72;
const initialN = 128; // 0x80
const delimiter = '-'; // '\x2D'

/** Regular expressions */
const regexPunycode = /^xn--/;
const regexNonASCII = /[^\0-\x7E]/; // non-ASCII chars
const regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g; // RFC 3490 separators

/** Error messages */
const errors = {
	'overflow': 'Overflow: input needs wider integers to process',
	'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
	'invalid-input': 'Invalid input'
};

/** Convenience shortcuts */
const baseMinusTMin = base - tMin;
const floor = Math.floor;
const stringFromCharCode = String.fromCharCode;

/*--------------------------------------------------------------------------*/

/**
 * A generic error utility function.
 * @private
 * @param {String} type The error type.
 * @returns {Error} Throws a `RangeError` with the applicable error message.
 */
function error(type) {
	throw new RangeError(errors[type]);
}

/**
 * A generic `Array#map` utility function.
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} callback The function that gets called for every array
 * item.
 * @returns {Array} A new array of values returned by the callback function.
 */
function map(array, fn) {
	const result = [];
	let length = array.length;
	while (length--) {
		result[length] = fn(array[length]);
	}
	return result;
}

/**
 * A simple `Array#map`-like wrapper to work with domain name strings or email
 * addresses.
 * @private
 * @param {String} domain The domain name or email address.
 * @param {Function} callback The function that gets called for every
 * character.
 * @returns {Array} A new string of characters returned by the callback
 * function.
 */
function mapDomain(string, fn) {
	const parts = string.split('@');
	let result = '';
	if (parts.length > 1) {
		// In email addresses, only the domain name should be punycoded. Leave
		// the local part (i.e. everything up to `@`) intact.
		result = parts[0] + '@';
		string = parts[1];
	}
	// Avoid `split(regex)` for IE8 compatibility. See #17.
	string = string.replace(regexSeparators, '\x2E');
	const labels = string.split('.');
	const encoded = map(labels, fn).join('.');
	return result + encoded;
}

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 * @see `punycode.ucs2.encode`
 * @see <https://mathiasbynens.be/notes/javascript-encoding>
 * @memberOf punycode.ucs2
 * @name decode
 * @param {String} string The Unicode input string (UCS-2).
 * @returns {Array} The new array of code points.
 */
function ucs2decode(string) {
	const output = [];
	let counter = 0;
	const length = string.length;
	while (counter < length) {
		const value = string.charCodeAt(counter++);
		if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
			// It's a high surrogate, and there is a next character.
			const extra = string.charCodeAt(counter++);
			if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
				output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
			} else {
				// It's an unmatched surrogate; only append this code unit, in case the
				// next code unit is the high surrogate of a surrogate pair.
				output.push(value);
				counter--;
			}
		} else {
			output.push(value);
		}
	}
	return output;
}

/**
 * Creates a string based on an array of numeric code points.
 * @see `punycode.ucs2.decode`
 * @memberOf punycode.ucs2
 * @name encode
 * @param {Array} codePoints The array of numeric code points.
 * @returns {String} The new Unicode string (UCS-2).
 */
const ucs2encode = array => String.fromCodePoint(...array);

/**
 * Converts a basic code point into a digit/integer.
 * @see `digitToBasic()`
 * @private
 * @param {Number} codePoint The basic numeric code point value.
 * @returns {Number} The numeric value of a basic code point (for use in
 * representing integers) in the range `0` to `base - 1`, or `base` if
 * the code point does not represent a value.
 */
const basicToDigit = function(codePoint) {
	if (codePoint - 0x30 < 0x0A) {
		return codePoint - 0x16;
	}
	if (codePoint - 0x41 < 0x1A) {
		return codePoint - 0x41;
	}
	if (codePoint - 0x61 < 0x1A) {
		return codePoint - 0x61;
	}
	return base;
};

/**
 * Converts a digit/integer into a basic code point.
 * @see `basicToDigit()`
 * @private
 * @param {Number} digit The numeric value of a basic code point.
 * @returns {Number} The basic code point whose value (when used for
 * representing integers) is `digit`, which needs to be in the range
 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
 * used; else, the lowercase form is used. The behavior is undefined
 * if `flag` is non-zero and `digit` has no uppercase form.
 */
const digitToBasic = function(digit, flag) {
	//  0..25 map to ASCII a..z or A..Z
	// 26..35 map to ASCII 0..9
	return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 * @private
 */
const adapt = function(delta, numPoints, firstTime) {
	let k = 0;
	delta = firstTime ? floor(delta / damp) : delta >> 1;
	delta += floor(delta / numPoints);
	for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
		delta = floor(delta / baseMinusTMin);
	}
	return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
 * symbols.
 * @memberOf punycode
 * @param {String} input The Punycode string of ASCII-only symbols.
 * @returns {String} The resulting string of Unicode symbols.
 */
const decode = function(input) {
	// Don't use UCS-2.
	const output = [];
	const inputLength = input.length;
	let i = 0;
	let n = initialN;
	let bias = initialBias;

	// Handle the basic code points: let `basic` be the number of input code
	// points before the last delimiter, or `0` if there is none, then copy
	// the first basic code points to the output.

	let basic = input.lastIndexOf(delimiter);
	if (basic < 0) {
		basic = 0;
	}

	for (let j = 0; j < basic; ++j) {
		// if it's not a basic code point
		if (input.charCodeAt(j) >= 0x80) {
			error('not-basic');
		}
		output.push(input.charCodeAt(j));
	}

	// Main decoding loop: start just after the last delimiter if any basic code
	// points were copied; start at the beginning otherwise.

	for (let index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

		// `index` is the index of the next character to be consumed.
		// Decode a generalized variable-length integer into `delta`,
		// which gets added to `i`. The overflow checking is easier
		// if we increase `i` as we go, then subtract off its starting
		// value at the end to obtain `delta`.
		let oldi = i;
		for (let w = 1, k = base; /* no condition */; k += base) {

			if (index >= inputLength) {
				error('invalid-input');
			}

			const digit = basicToDigit(input.charCodeAt(index++));

			if (digit >= base || digit > floor((maxInt - i) / w)) {
				error('overflow');
			}

			i += digit * w;
			const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

			if (digit < t) {
				break;
			}

			const baseMinusT = base - t;
			if (w > floor(maxInt / baseMinusT)) {
				error('overflow');
			}

			w *= baseMinusT;

		}

		const out = output.length + 1;
		bias = adapt(i - oldi, out, oldi == 0);

		// `i` was supposed to wrap around from `out` to `0`,
		// incrementing `n` each time, so we'll fix that now:
		if (floor(i / out) > maxInt - n) {
			error('overflow');
		}

		n += floor(i / out);
		i %= out;

		// Insert `n` at position `i` of the output.
		output.splice(i++, 0, n);

	}

	return String.fromCodePoint(...output);
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 * @memberOf punycode
 * @param {String} input The string of Unicode symbols.
 * @returns {String} The resulting Punycode string of ASCII-only symbols.
 */
const encode = function(input) {
	const output = [];

	// Convert the input in UCS-2 to an array of Unicode code points.
	input = ucs2decode(input);

	// Cache the length.
	let inputLength = input.length;

	// Initialize the state.
	let n = initialN;
	let delta = 0;
	let bias = initialBias;

	// Handle the basic code points.
	for (const currentValue of input) {
		if (currentValue < 0x80) {
			output.push(stringFromCharCode(currentValue));
		}
	}

	let basicLength = output.length;
	let handledCPCount = basicLength;

	// `handledCPCount` is the number of code points that have been handled;
	// `basicLength` is the number of basic code points.

	// Finish the basic string with a delimiter unless it's empty.
	if (basicLength) {
		output.push(delimiter);
	}

	// Main encoding loop:
	while (handledCPCount < inputLength) {

		// All non-basic code points < n have been handled already. Find the next
		// larger one:
		let m = maxInt;
		for (const currentValue of input) {
			if (currentValue >= n && currentValue < m) {
				m = currentValue;
			}
		}

		// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
		// but guard against overflow.
		const handledCPCountPlusOne = handledCPCount + 1;
		if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
			error('overflow');
		}

		delta += (m - n) * handledCPCountPlusOne;
		n = m;

		for (const currentValue of input) {
			if (currentValue < n && ++delta > maxInt) {
				error('overflow');
			}
			if (currentValue == n) {
				// Represent delta as a generalized variable-length integer.
				let q = delta;
				for (let k = base; /* no condition */; k += base) {
					const t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
					if (q < t) {
						break;
					}
					const qMinusT = q - t;
					const baseMinusT = base - t;
					output.push(
						stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
					);
					q = floor(qMinusT / baseMinusT);
				}

				output.push(stringFromCharCode(digitToBasic(q, 0)));
				bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
				delta = 0;
				++handledCPCount;
			}
		}

		++delta;
		++n;

	}
	return output.join('');
};

/**
 * Converts a Punycode string representing a domain name or an email address
 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
 * it doesn't matter if you call it on a string that has already been
 * converted to Unicode.
 * @memberOf punycode
 * @param {String} input The Punycoded domain name or email address to
 * convert to Unicode.
 * @returns {String} The Unicode representation of the given Punycode
 * string.
 */
const toUnicode = function(input) {
	return mapDomain(input, function(string) {
		return regexPunycode.test(string)
			? decode(string.slice(4).toLowerCase())
			: string;
	});
};

/**
 * Converts a Unicode string representing a domain name or an email address to
 * Punycode. Only the non-ASCII parts of the domain name will be converted,
 * i.e. it doesn't matter if you call it with a domain that's already in
 * ASCII.
 * @memberOf punycode
 * @param {String} input The domain name or email address to convert, as a
 * Unicode string.
 * @returns {String} The Punycode representation of the given domain name or
 * email address.
 */
const toASCII = function(input) {
	return mapDomain(input, function(string) {
		return regexNonASCII.test(string)
			? 'xn--' + encode(string)
			: string;
	});
};

/*--------------------------------------------------------------------------*/

/** Define the public API */
const punycode = {
	/**
	 * A string representing the current Punycode.js version number.
	 * @memberOf punycode
	 * @type String
	 */
	'version': '2.1.0',
	/**
	 * An object of methods to convert from JavaScript's internal character
	 * representation (UCS-2) to Unicode code points, and back.
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode
	 * @type Object
	 */
	'ucs2': {
		'decode': ucs2decode,
		'encode': ucs2encode
	},
	'decode': decode,
	'encode': encode,
	'toASCII': toASCII,
	'toUnicode': toUnicode
};


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (punycode);


/***/ }),

/***/ "./node_modules/tr46/index.js":
/*!************************************!*\
  !*** ./node_modules/tr46/index.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const punycode = __webpack_require__(/*! punycode */ "./node_modules/punycode/punycode.es6.js");
const regexes = __webpack_require__(/*! ./lib/regexes.js */ "./node_modules/tr46/lib/regexes.js");
const mappingTable = __webpack_require__(/*! ./lib/mappingTable.json */ "./node_modules/tr46/lib/mappingTable.json");
const { STATUS_MAPPING } = __webpack_require__(/*! ./lib/statusMapping.js */ "./node_modules/tr46/lib/statusMapping.js");

function containsNonASCII(str) {
  return /[^\x00-\x7F]/u.test(str);
}

function findStatus(val, { useSTD3ASCIIRules }) {
  let start = 0;
  let end = mappingTable.length - 1;

  while (start <= end) {
    const mid = Math.floor((start + end) / 2);

    const target = mappingTable[mid];
    const min = Array.isArray(target[0]) ? target[0][0] : target[0];
    const max = Array.isArray(target[0]) ? target[0][1] : target[0];

    if (min <= val && max >= val) {
      if (useSTD3ASCIIRules &&
          (target[1] === STATUS_MAPPING.disallowed_STD3_valid || target[1] === STATUS_MAPPING.disallowed_STD3_mapped)) {
        return [STATUS_MAPPING.disallowed, ...target.slice(2)];
      } else if (target[1] === STATUS_MAPPING.disallowed_STD3_valid) {
        return [STATUS_MAPPING.valid, ...target.slice(2)];
      } else if (target[1] === STATUS_MAPPING.disallowed_STD3_mapped) {
        return [STATUS_MAPPING.mapped, ...target.slice(2)];
      }

      return target.slice(1);
    } else if (min > val) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }

  return null;
}

function mapChars(domainName, { useSTD3ASCIIRules, processingOption }) {
  let hasError = false;
  let processed = "";

  for (const ch of domainName) {
    const [status, mapping] = findStatus(ch.codePointAt(0), { useSTD3ASCIIRules });

    switch (status) {
      case STATUS_MAPPING.disallowed:
        hasError = true;
        processed += ch;
        break;
      case STATUS_MAPPING.ignored:
        break;
      case STATUS_MAPPING.mapped:
        processed += mapping;
        break;
      case STATUS_MAPPING.deviation:
        if (processingOption === "transitional") {
          processed += mapping;
        } else {
          processed += ch;
        }
        break;
      case STATUS_MAPPING.valid:
        processed += ch;
        break;
    }
  }

  return {
    string: processed,
    error: hasError
  };
}

function validateLabel(label, { checkHyphens, checkBidi, checkJoiners, processingOption, useSTD3ASCIIRules }) {
  if (label.normalize("NFC") !== label) {
    return false;
  }

  const codePoints = Array.from(label);

  if (checkHyphens) {
    if ((codePoints[2] === "-" && codePoints[3] === "-") ||
        (label.startsWith("-") || label.endsWith("-"))) {
      return false;
    }
  }

  if (label.includes(".") ||
      (codePoints.length > 0 && regexes.combiningMarks.test(codePoints[0]))) {
    return false;
  }

  for (const ch of codePoints) {
    const [status] = findStatus(ch.codePointAt(0), { useSTD3ASCIIRules });
    if ((processingOption === "transitional" && status !== STATUS_MAPPING.valid) ||
        (processingOption === "nontransitional" &&
         status !== STATUS_MAPPING.valid && status !== STATUS_MAPPING.deviation)) {
      return false;
    }
  }

  // https://tools.ietf.org/html/rfc5892#appendix-A
  if (checkJoiners) {
    let last = 0;
    for (const [i, ch] of codePoints.entries()) {
      if (ch === "\u200C" || ch === "\u200D") {
        if (i > 0) {
          if (regexes.combiningClassVirama.test(codePoints[i - 1])) {
            continue;
          }
          if (ch === "\u200C") {
            // TODO: make this more efficient
            const next = codePoints.indexOf("\u200C", i + 1);
            const test = next < 0 ? codePoints.slice(last) : codePoints.slice(last, next);
            if (regexes.validZWNJ.test(test.join(""))) {
              last = i + 1;
              continue;
            }
          }
        }
        return false;
      }
    }
  }

  // https://tools.ietf.org/html/rfc5893#section-2
  if (checkBidi) {
    let rtl;

    // 1
    if (regexes.bidiS1LTR.test(codePoints[0])) {
      rtl = false;
    } else if (regexes.bidiS1RTL.test(codePoints[0])) {
      rtl = true;
    } else {
      return false;
    }

    if (rtl) {
      // 2-4
      if (!regexes.bidiS2.test(label) ||
          !regexes.bidiS3.test(label) ||
          (regexes.bidiS4EN.test(label) && regexes.bidiS4AN.test(label))) {
        return false;
      }
    } else if (!regexes.bidiS5.test(label) ||
               !regexes.bidiS6.test(label)) { // 5-6
      return false;
    }
  }

  return true;
}

function isBidiDomain(labels) {
  const domain = labels.map(label => {
    if (label.startsWith("xn--")) {
      try {
        return punycode.decode(label.substring(4));
      } catch (err) {
        return "";
      }
    }
    return label;
  }).join(".");
  return regexes.bidiDomain.test(domain);
}

function processing(domainName, options) {
  const { processingOption } = options;

  // 1. Map.
  let { string, error } = mapChars(domainName, options);

  // 2. Normalize.
  string = string.normalize("NFC");

  // 3. Break.
  const labels = string.split(".");
  const isBidi = isBidiDomain(labels);

  // 4. Convert/Validate.
  for (const [i, origLabel] of labels.entries()) {
    let label = origLabel;
    let curProcessing = processingOption;
    if (label.startsWith("xn--")) {
      try {
        label = punycode.decode(label.substring(4));
        labels[i] = label;
      } catch (err) {
        error = true;
        continue;
      }
      curProcessing = "nontransitional";
    }

    // No need to validate if we already know there is an error.
    if (error) {
      continue;
    }
    const validation = validateLabel(label, {
      ...options,
      processingOption: curProcessing,
      checkBidi: options.checkBidi && isBidi
    });
    if (!validation) {
      error = true;
    }
  }

  return {
    string: labels.join("."),
    error
  };
}

function toASCII(domainName, {
  checkHyphens = false,
  checkBidi = false,
  checkJoiners = false,
  useSTD3ASCIIRules = false,
  processingOption = "nontransitional",
  verifyDNSLength = false
} = {}) {
  if (processingOption !== "transitional" && processingOption !== "nontransitional") {
    throw new RangeError("processingOption must be either transitional or nontransitional");
  }

  const result = processing(domainName, {
    processingOption,
    checkHyphens,
    checkBidi,
    checkJoiners,
    useSTD3ASCIIRules
  });
  let labels = result.string.split(".");
  labels = labels.map(l => {
    if (containsNonASCII(l)) {
      try {
        return `xn--${punycode.encode(l)}`;
      } catch (e) {
        result.error = true;
      }
    }
    return l;
  });

  if (verifyDNSLength) {
    const total = labels.join(".").length;
    if (total > 253 || total === 0) {
      result.error = true;
    }

    for (let i = 0; i < labels.length; ++i) {
      if (labels[i].length > 63 || labels[i].length === 0) {
        result.error = true;
        break;
      }
    }
  }

  if (result.error) {
    return null;
  }
  return labels.join(".");
}

function toUnicode(domainName, {
  checkHyphens = false,
  checkBidi = false,
  checkJoiners = false,
  useSTD3ASCIIRules = false,
  processingOption = "nontransitional"
} = {}) {
  const result = processing(domainName, {
    processingOption,
    checkHyphens,
    checkBidi,
    checkJoiners,
    useSTD3ASCIIRules
  });

  return {
    domain: result.string,
    error: result.error
  };
}

module.exports = {
  toASCII,
  toUnicode
};


/***/ }),

/***/ "./node_modules/tr46/lib/regexes.js":
/*!******************************************!*\
  !*** ./node_modules/tr46/lib/regexes.js ***!
  \******************************************/
/***/ ((module) => {

"use strict";


const combiningMarks = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C04\u0C3C\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1715\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u192B\u1930-\u193B\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11000}-\u{11002}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11082}\u{110B0}-\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{11134}\u{11145}\u{11146}\u{11173}\u{11180}-\u{11182}\u{111B3}-\u{111C0}\u{111C9}-\u{111CC}\u{111CE}\u{111CF}\u{1122C}-\u{11237}\u{1123E}\u{112DF}-\u{112EA}\u{11300}-\u{11303}\u{1133B}\u{1133C}\u{1133E}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11357}\u{11362}\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11435}-\u{11446}\u{1145E}\u{114B0}-\u{114C3}\u{115AF}-\u{115B5}\u{115B8}-\u{115C0}\u{115DC}\u{115DD}\u{11630}-\u{11640}\u{116AB}-\u{116B7}\u{1171D}-\u{1172B}\u{1182C}-\u{1183A}\u{11930}-\u{11935}\u{11937}\u{11938}\u{1193B}-\u{1193E}\u{11940}\u{11942}\u{11943}\u{119D1}-\u{119D7}\u{119DA}-\u{119E0}\u{119E4}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A39}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A5B}\u{11A8A}-\u{11A99}\u{11C2F}-\u{11C36}\u{11C38}-\u{11C3F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D8A}-\u{11D8E}\u{11D90}\u{11D91}\u{11D93}-\u{11D97}\u{11EF3}-\u{11EF6}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F51}-\u{16F87}\u{16F8F}-\u{16F92}\u{16FE4}\u{16FF0}\u{16FF1}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D165}-\u{1D169}\u{1D16D}-\u{1D172}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]/u;
const combiningClassVirama = /[\u094D\u09CD\u0A4D\u0ACD\u0B4D\u0BCD\u0C4D\u0CCD\u0D3B\u0D3C\u0D4D\u0DCA\u0E3A\u0EBA\u0F84\u1039\u103A\u1714\u1734\u17D2\u1A60\u1B44\u1BAA\u1BAB\u1BF2\u1BF3\u2D7F\uA806\uA8C4\uA953\uA9C0\uAAF6\uABED\u{10A3F}\u{11046}\u{1107F}\u{110B9}\u{11133}\u{11134}\u{111C0}\u{11235}\u{112EA}\u{1134D}\u{11442}\u{114C2}\u{115BF}\u{1163F}\u{116B6}\u{1172B}\u{11839}\u{119E0}\u{11A34}\u{11A47}\u{11A99}\u{11C3F}\u{11D44}\u{11D45}\u{11D97}]/u;
const validZWNJ = /[\u0620\u0626\u0628\u062A-\u062E\u0633-\u063F\u0641-\u0647\u0649\u064A\u066E\u066F\u0678-\u0687\u069A-\u06BF\u06C1\u06C2\u06CC\u06CE\u06D0\u06D1\u06FA-\u06FC\u06FF\u0712-\u0714\u071A-\u071D\u071F-\u0727\u0729\u072B\u072D\u072E\u074E-\u0758\u075C-\u076A\u076D-\u0770\u0772\u0775-\u0777\u077A-\u077F\u07CA-\u07EA\u0841-\u0845\u0848\u084A-\u0853\u0855\u0860\u0862-\u0865\u0868\u08A0-\u08A9\u08AF\u08B0\u08B3\u08B4\u08B6-\u08B8\u08BA-\u08BD\u1807\u1820-\u1878\u1887-\u18A8\u18AA\uA840-\uA872\u{10AC0}-\u{10AC4}\u{10ACD}\u{10AD3}-\u{10ADC}\u{10ADE}-\u{10AE0}\u{10AEB}-\u{10AEE}\u{10B80}\u{10B82}\u{10B86}-\u{10B88}\u{10B8A}\u{10B8B}\u{10B8D}\u{10B90}\u{10BAD}\u{10BAE}\u{10D00}-\u{10D21}\u{10D23}\u{10F30}-\u{10F32}\u{10F34}-\u{10F44}\u{10F51}-\u{10F53}\u{1E900}-\u{1E943}][\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10F46}-\u{10F50}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{13430}-\u{13438}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2EC}-\u{1E2EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94B}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*\u200C[\xAD\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u061C\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u070F\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u200B\u200E\u200F\u202A-\u202E\u2060-\u2064\u206A-\u206F\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFEFF\uFFF9-\uFFFB\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10F46}-\u{10F50}\u{11001}\u{11038}-\u{11046}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C3F}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{13430}-\u{13438}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2EC}-\u{1E2EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94B}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*[\u0620\u0622-\u063F\u0641-\u064A\u066E\u066F\u0671-\u0673\u0675-\u06D3\u06D5\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u077F\u07CA-\u07EA\u0840-\u0855\u0860\u0862-\u0865\u0867-\u086A\u08A0-\u08AC\u08AE-\u08B4\u08B6-\u08BD\u1807\u1820-\u1878\u1887-\u18A8\u18AA\uA840-\uA871\u{10AC0}-\u{10AC5}\u{10AC7}\u{10AC9}\u{10ACA}\u{10ACE}-\u{10AD6}\u{10AD8}-\u{10AE1}\u{10AE4}\u{10AEB}-\u{10AEF}\u{10B80}-\u{10B91}\u{10BA9}-\u{10BAE}\u{10D01}-\u{10D23}\u{10F30}-\u{10F44}\u{10F51}-\u{10F54}\u{1E900}-\u{1E943}]/u;
const bidiDomain = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u08A0-\u08C9\u08E2\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
const bidiS1LTR = /[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u0589\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A76\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C77\u0C7F\u0C80\u0C82-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u1711\u1715\u171F-\u1731\u1734-\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4C\u1B50-\u1B6A\u1B74-\u1B7E\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u249C-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31BF\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FE\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB69\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11071}\u{11072}\u{11075}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11147}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C8}\u{111CD}\u{111CE}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{1145B}\u{1145D}\u{1145F}-\u{11461}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116B8}\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{11720}\u{11721}\u{11726}\u{11730}-\u{11746}\u{11800}-\u{1182E}\u{11838}\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193D}\u{1193F}-\u{11942}\u{11944}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D3}\u{119DC}-\u{119DF}\u{119E1}-\u{119E4}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A89}\u{11A97}\u{11A9A}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D93}\u{11D94}\u{11D96}\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF2}\u{11EF5}-\u{11EF8}\u{11FB0}\u{11FC0}-\u{11FD4}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{1342E}\u{13430}-\u{13438}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F50}-\u{16F87}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B150}-\u{1B152}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D2E0}-\u{1D2F3}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D800}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1DF00}-\u{1DF1E}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E2F0}-\u{1E2F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B738}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]/u;
const bidiS1RTL = /[\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0608\u060B\u060D\u061B-\u064A\u066D-\u066F\u0671-\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u08A0-\u08C9\u200F\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}]/u;
const bidiS2 = /^[\0-\x08\x0E-\x1B!-@\[-`\{-\x84\x86-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02B9\u02BA\u02C2-\u02CF\u02D2-\u02DF\u02E5-\u02ED\u02EF-\u036F\u0374\u0375\u037E\u0384\u0385\u0387\u03F6\u0483-\u0489\u058A\u058D-\u058F\u0591-\u05C7\u05D0-\u05EA\u05EF-\u05F4\u0600-\u070D\u070F-\u074A\u074D-\u07B1\u07C0-\u07FA\u07FD-\u082D\u0830-\u083E\u0840-\u085B\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u0898-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09F2\u09F3\u09FB\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AF1\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0BF3-\u0BFA\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C78-\u0C7E\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E3F\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39-\u0F3D\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1390-\u1399\u1400\u169B\u169C\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DB\u17DD\u17F0-\u17F9\u1800-\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1940\u1944\u1945\u19DE-\u19FF\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u200B-\u200D\u200F-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2070\u2074-\u207E\u2080-\u208E\u20A0-\u20C0\u20D0-\u20F0\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u2150-\u215F\u2189-\u218B\u2190-\u2335\u237B-\u2394\u2396-\u2426\u2440-\u244A\u2460-\u249B\u24EA-\u26AB\u26AD-\u27FF\u2900-\u2B73\u2B76-\u2B95\u2B97-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF9-\u2CFF\u2D7F\u2DE0-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u3004\u3008-\u3020\u302A-\u302D\u3030\u3036\u3037\u303D-\u303F\u3099-\u309C\u30A0\u30FB\u31C0-\u31E3\u321D\u321E\u3250-\u325F\u327C-\u327E\u32B1-\u32BF\u32CC-\u32CF\u3377-\u337A\u33DE\u33DF\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA60D-\uA60F\uA66F-\uA67F\uA69E\uA69F\uA6F0\uA6F1\uA700-\uA721\uA788\uA802\uA806\uA80B\uA825\uA826\uA828-\uA82C\uA838\uA839\uA874-\uA877\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uAB6A\uAB6B\uABE5\uABE8\uABED\uFB1D-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD8F\uFD92-\uFDC7\uFDCF\uFDF0-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFE70-\uFE74\uFE76-\uFEFC\uFEFF\uFF01-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10101}\u{10140}-\u{1018C}\u{10190}-\u{1019C}\u{101A0}\u{101FD}\u{102E0}-\u{102FB}\u{10376}-\u{1037A}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{1091F}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A38}-\u{10A3A}\u{10A3F}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE6}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B39}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D27}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAB}-\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F59}\u{10F70}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{11001}\u{11038}-\u{11046}\u{11052}-\u{11065}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{11660}-\u{1166C}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{11FD5}-\u{11FF1}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE2}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1BCA0}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D173}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D1E9}\u{1D1EA}\u{1D200}-\u{1D245}\u{1D300}-\u{1D356}\u{1D6DB}\u{1D715}\u{1D74F}\u{1D789}\u{1D7C3}\u{1D7CE}-\u{1D7FF}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E2FF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8D6}\u{1E900}-\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F10F}\u{1F12F}\u{1F16A}-\u{1F16F}\u{1F1AD}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D7}\u{1F6DD}-\u{1F6EC}\u{1F6F0}-\u{1F6FC}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D8}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F8B0}\u{1F8B1}\u{1F900}-\u{1FA53}\u{1FA60}-\u{1FA6D}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7C}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAAC}\u{1FAB0}-\u{1FABA}\u{1FAC0}-\u{1FAC5}\u{1FAD0}-\u{1FAD9}\u{1FAE0}-\u{1FAE7}\u{1FAF0}-\u{1FAF6}\u{1FB00}-\u{1FB92}\u{1FB94}-\u{1FBCA}\u{1FBF0}-\u{1FBF9}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}]*$/u;
const bidiS3 = /[0-9\xB2\xB3\xB9\u05BE\u05C0\u05C3\u05C6\u05D0-\u05EA\u05EF-\u05F4\u0600-\u0605\u0608\u060B\u060D\u061B-\u064A\u0660-\u0669\u066B-\u066F\u0671-\u06D5\u06DD\u06E5\u06E6\u06EE-\u070D\u070F\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u07FE-\u0815\u081A\u0824\u0828\u0830-\u083E\u0840-\u0858\u085E\u0860-\u086A\u0870-\u088E\u0890\u0891\u08A0-\u08C9\u08E2\u200F\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBC2\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFC\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\u{102E1}-\u{102FB}\u{10800}-\u{10805}\u{10808}\u{1080A}-\u{10835}\u{10837}\u{10838}\u{1083C}\u{1083F}-\u{10855}\u{10857}-\u{1089E}\u{108A7}-\u{108AF}\u{108E0}-\u{108F2}\u{108F4}\u{108F5}\u{108FB}-\u{1091B}\u{10920}-\u{10939}\u{1093F}\u{10980}-\u{109B7}\u{109BC}-\u{109CF}\u{109D2}-\u{10A00}\u{10A10}-\u{10A13}\u{10A15}-\u{10A17}\u{10A19}-\u{10A35}\u{10A40}-\u{10A48}\u{10A50}-\u{10A58}\u{10A60}-\u{10A9F}\u{10AC0}-\u{10AE4}\u{10AEB}-\u{10AF6}\u{10B00}-\u{10B35}\u{10B40}-\u{10B55}\u{10B58}-\u{10B72}\u{10B78}-\u{10B91}\u{10B99}-\u{10B9C}\u{10BA9}-\u{10BAF}\u{10C00}-\u{10C48}\u{10C80}-\u{10CB2}\u{10CC0}-\u{10CF2}\u{10CFA}-\u{10D23}\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}\u{10E80}-\u{10EA9}\u{10EAD}\u{10EB0}\u{10EB1}\u{10F00}-\u{10F27}\u{10F30}-\u{10F45}\u{10F51}-\u{10F59}\u{10F70}-\u{10F81}\u{10F86}-\u{10F89}\u{10FB0}-\u{10FCB}\u{10FE0}-\u{10FF6}\u{1D7CE}-\u{1D7FF}\u{1E800}-\u{1E8C4}\u{1E8C7}-\u{1E8CF}\u{1E900}-\u{1E943}\u{1E94B}\u{1E950}-\u{1E959}\u{1E95E}\u{1E95F}\u{1EC71}-\u{1ECB4}\u{1ED01}-\u{1ED3D}\u{1EE00}-\u{1EE03}\u{1EE05}-\u{1EE1F}\u{1EE21}\u{1EE22}\u{1EE24}\u{1EE27}\u{1EE29}-\u{1EE32}\u{1EE34}-\u{1EE37}\u{1EE39}\u{1EE3B}\u{1EE42}\u{1EE47}\u{1EE49}\u{1EE4B}\u{1EE4D}-\u{1EE4F}\u{1EE51}\u{1EE52}\u{1EE54}\u{1EE57}\u{1EE59}\u{1EE5B}\u{1EE5D}\u{1EE5F}\u{1EE61}\u{1EE62}\u{1EE64}\u{1EE67}-\u{1EE6A}\u{1EE6C}-\u{1EE72}\u{1EE74}-\u{1EE77}\u{1EE79}-\u{1EE7C}\u{1EE7E}\u{1EE80}-\u{1EE89}\u{1EE8B}-\u{1EE9B}\u{1EEA1}-\u{1EEA3}\u{1EEA5}-\u{1EEA9}\u{1EEAB}-\u{1EEBB}\u{1F100}-\u{1F10A}\u{1FBF0}-\u{1FBF9}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;
const bidiS4EN = /[0-9\xB2\xB3\xB9\u06F0-\u06F9\u2070\u2074-\u2079\u2080-\u2089\u2488-\u249B\uFF10-\uFF19\u{102E1}-\u{102FB}\u{1D7CE}-\u{1D7FF}\u{1F100}-\u{1F10A}\u{1FBF0}-\u{1FBF9}]/u;
const bidiS4AN = /[\u0600-\u0605\u0660-\u0669\u066B\u066C\u06DD\u0890\u0891\u08E2\u{10D30}-\u{10D39}\u{10E60}-\u{10E7E}]/u;
const bidiS5 = /^[\0-\x08\x0E-\x1B!-\x84\x86-\u0377\u037A-\u037F\u0384-\u038A\u038C\u038E-\u03A1\u03A3-\u052F\u0531-\u0556\u0559-\u058A\u058D-\u058F\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0606\u0607\u0609\u060A\u060C\u060E-\u061A\u064B-\u065F\u066A\u0670\u06D6-\u06DC\u06DE-\u06E4\u06E7-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07F6-\u07F9\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A76\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AF1\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B77\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BFA\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3C-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C5D\u0C60-\u0C63\u0C66-\u0C6F\u0C77-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4F\u0D54-\u0D63\u0D66-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E3A\u0E3F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F47\u0F49-\u0F6C\u0F71-\u0F97\u0F99-\u0FBC\u0FBE-\u0FCC\u0FCE-\u0FDA\u1000-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u137C\u1380-\u1399\u13A0-\u13F5\u13F8-\u13FD\u1400-\u167F\u1681-\u169C\u16A0-\u16F8\u1700-\u1715\u171F-\u1736\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17DD\u17E0-\u17E9\u17F0-\u17F9\u1800-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1940\u1944-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u19DE-\u1A1B\u1A1E-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1AB0-\u1ACE\u1B00-\u1B4C\u1B50-\u1B7E\u1B80-\u1BF3\u1BFC-\u1C37\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD0-\u1CFA\u1D00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FC4\u1FC6-\u1FD3\u1FD6-\u1FDB\u1FDD-\u1FEF\u1FF2-\u1FF4\u1FF6-\u1FFE\u200B-\u200E\u2010-\u2027\u202F-\u205E\u2060-\u2064\u206A-\u2071\u2074-\u208E\u2090-\u209C\u20A0-\u20C0\u20D0-\u20F0\u2100-\u218B\u2190-\u2426\u2440-\u244A\u2460-\u2B73\u2B76-\u2B95\u2B97-\u2CF3\u2CF9-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2E5D\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFB\u3001-\u303F\u3041-\u3096\u3099-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31E3\u31F0-\u321E\u3220-\uA48C\uA490-\uA4C6\uA4D0-\uA62B\uA640-\uA6F7\uA700-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA82C\uA830-\uA839\uA840-\uA877\uA880-\uA8C5\uA8CE-\uA8D9\uA8E0-\uA953\uA95F-\uA97C\uA980-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA5C-\uAAC2\uAADB-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB6B\uAB70-\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1E\uFB29\uFD3E-\uFD4F\uFDCF\uFDFD-\uFE19\uFE20-\uFE52\uFE54-\uFE66\uFE68-\uFE6B\uFEFF\uFF01-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFF9-\uFFFD\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}-\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1018E}\u{10190}-\u{1019C}\u{101A0}\u{101D0}-\u{101FD}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E0}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{1037A}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{1091F}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10B39}-\u{10B3F}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11000}-\u{1104D}\u{11052}-\u{11075}\u{1107F}-\u{110C2}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11100}-\u{11134}\u{11136}-\u{11147}\u{11150}-\u{11176}\u{11180}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1123E}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112EA}\u{112F0}-\u{112F9}\u{11300}-\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133B}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11400}-\u{1145B}\u{1145D}-\u{11461}\u{11480}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B5}\u{115B8}-\u{115DD}\u{11600}-\u{11644}\u{11650}-\u{11659}\u{11660}-\u{1166C}\u{11680}-\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{1171D}-\u{1172B}\u{11730}-\u{11746}\u{11800}-\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193B}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D7}\u{119DA}-\u{119E4}\u{11A00}-\u{11A47}\u{11A50}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C36}\u{11C38}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11C92}-\u{11CA7}\u{11CA9}-\u{11CB6}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D47}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D90}\u{11D91}\u{11D93}-\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF8}\u{11FB0}\u{11FC0}-\u{11FF1}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{1342E}\u{13430}-\u{13438}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF0}-\u{16AF5}\u{16B00}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F4F}-\u{16F87}\u{16F8F}-\u{16F9F}\u{16FE0}-\u{16FE4}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B150}-\u{1B152}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}-\u{1BCA3}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D1EA}\u{1D200}-\u{1D245}\u{1D2E0}-\u{1D2F3}\u{1D300}-\u{1D356}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D7CB}\u{1D7CE}-\u{1DA8B}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1DF00}-\u{1DF1E}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E100}-\u{1E12C}\u{1E130}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AE}\u{1E2C0}-\u{1E2F9}\u{1E2FF}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{1EEF0}\u{1EEF1}\u{1F000}-\u{1F02B}\u{1F030}-\u{1F093}\u{1F0A0}-\u{1F0AE}\u{1F0B1}-\u{1F0BF}\u{1F0C1}-\u{1F0CF}\u{1F0D1}-\u{1F0F5}\u{1F100}-\u{1F1AD}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1F260}-\u{1F265}\u{1F300}-\u{1F6D7}\u{1F6DD}-\u{1F6EC}\u{1F6F0}-\u{1F6FC}\u{1F700}-\u{1F773}\u{1F780}-\u{1F7D8}\u{1F7E0}-\u{1F7EB}\u{1F7F0}\u{1F800}-\u{1F80B}\u{1F810}-\u{1F847}\u{1F850}-\u{1F859}\u{1F860}-\u{1F887}\u{1F890}-\u{1F8AD}\u{1F8B0}\u{1F8B1}\u{1F900}-\u{1FA53}\u{1FA60}-\u{1FA6D}\u{1FA70}-\u{1FA74}\u{1FA78}-\u{1FA7C}\u{1FA80}-\u{1FA86}\u{1FA90}-\u{1FAAC}\u{1FAB0}-\u{1FABA}\u{1FAC0}-\u{1FAC5}\u{1FAD0}-\u{1FAD9}\u{1FAE0}-\u{1FAE7}\u{1FAF0}-\u{1FAF6}\u{1FB00}-\u{1FB92}\u{1FB94}-\u{1FBCA}\u{1FBF0}-\u{1FBF9}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B738}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{E0001}\u{E0020}-\u{E007F}\u{E0100}-\u{E01EF}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}]*$/u;
const bidiS6 = /[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02B8\u02BB-\u02C1\u02D0\u02D1\u02E0-\u02E4\u02EE\u0370-\u0373\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0482\u048A-\u052F\u0531-\u0556\u0559-\u0589\u06F0-\u06F9\u0903-\u0939\u093B\u093D-\u0940\u0949-\u094C\u094E-\u0950\u0958-\u0961\u0964-\u0980\u0982\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD-\u09C0\u09C7\u09C8\u09CB\u09CC\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09FA\u09FC\u09FD\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3E-\u0A40\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A76\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD-\u0AC0\u0AC9\u0ACB\u0ACC\u0AD0\u0AE0\u0AE1\u0AE6-\u0AF0\u0AF9\u0B02\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B3E\u0B40\u0B47\u0B48\u0B4B\u0B4C\u0B57\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE\u0BBF\u0BC1\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCC\u0BD0\u0BD7\u0BE6-\u0BF2\u0C01-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C41-\u0C44\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C77\u0C7F\u0C80\u0C82-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD-\u0CC4\u0CC6-\u0CC8\u0CCA\u0CCB\u0CD5\u0CD6\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D02-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D40\u0D46-\u0D48\u0D4A-\u0D4C\u0D4E\u0D4F\u0D54-\u0D61\u0D66-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCF-\u0DD1\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2-\u0DF4\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E4F-\u0E5B\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00-\u0F17\u0F1A-\u0F34\u0F36\u0F38\u0F3E-\u0F47\u0F49-\u0F6C\u0F7F\u0F85\u0F88-\u0F8C\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE-\u0FDA\u1000-\u102C\u1031\u1038\u103B\u103C\u103F-\u1057\u105A-\u105D\u1061-\u1070\u1075-\u1081\u1083\u1084\u1087-\u108C\u108E-\u109C\u109E-\u10C5\u10C7\u10CD\u10D0-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1360-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u167F\u1681-\u169A\u16A0-\u16F8\u1700-\u1711\u1715\u171F-\u1731\u1734-\u1736\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17B6\u17BE-\u17C5\u17C7\u17C8\u17D4-\u17DA\u17DC\u17E0-\u17E9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1923-\u1926\u1929-\u192B\u1930\u1931\u1933-\u1938\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A19\u1A1A\u1A1E-\u1A55\u1A57\u1A61\u1A63\u1A64\u1A6D-\u1A72\u1A80-\u1A89\u1A90-\u1A99\u1AA0-\u1AAD\u1B04-\u1B33\u1B35\u1B3B\u1B3D-\u1B41\u1B43-\u1B4C\u1B50-\u1B6A\u1B74-\u1B7E\u1B82-\u1BA1\u1BA6\u1BA7\u1BAA\u1BAE-\u1BE5\u1BE7\u1BEA-\u1BEC\u1BEE\u1BF2\u1BF3\u1BFC-\u1C2B\u1C34\u1C35\u1C3B-\u1C49\u1C4D-\u1C88\u1C90-\u1CBA\u1CBD-\u1CC7\u1CD3\u1CE1\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5-\u1CF7\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200E\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u214F\u2160-\u2188\u2336-\u237A\u2395\u2488-\u24E9\u26AC\u2800-\u28FF\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D70\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u302E\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3190-\u31BF\u31F0-\u321C\u3220-\u324F\u3260-\u327B\u327F-\u32B0\u32C0-\u32CB\u32D0-\u3376\u337B-\u33DD\u33E0-\u33FE\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA60C\uA610-\uA62B\uA640-\uA66E\uA680-\uA69D\uA6A0-\uA6EF\uA6F2-\uA6F7\uA722-\uA787\uA789-\uA7CA\uA7D0\uA7D1\uA7D3\uA7D5-\uA7D9\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA824\uA827\uA830-\uA837\uA840-\uA873\uA880-\uA8C3\uA8CE-\uA8D9\uA8F2-\uA8FE\uA900-\uA925\uA92E-\uA946\uA952\uA953\uA95F-\uA97C\uA983-\uA9B2\uA9B4\uA9B5\uA9BA\uA9BB\uA9BE-\uA9CD\uA9CF-\uA9D9\uA9DE-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA2F\uAA30\uAA33\uAA34\uAA40-\uAA42\uAA44-\uAA4B\uAA4D\uAA50-\uAA59\uAA5C-\uAA7B\uAA7D-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAAEB\uAAEE-\uAAF5\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB69\uAB70-\uABE4\uABE6\uABE7\uABE9-\uABEC\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uD800-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u{10000}-\u{1000B}\u{1000D}-\u{10026}\u{10028}-\u{1003A}\u{1003C}\u{1003D}\u{1003F}-\u{1004D}\u{10050}-\u{1005D}\u{10080}-\u{100FA}\u{10100}\u{10102}\u{10107}-\u{10133}\u{10137}-\u{1013F}\u{1018D}\u{1018E}\u{101D0}-\u{101FC}\u{10280}-\u{1029C}\u{102A0}-\u{102D0}\u{102E1}-\u{102FB}\u{10300}-\u{10323}\u{1032D}-\u{1034A}\u{10350}-\u{10375}\u{10380}-\u{1039D}\u{1039F}-\u{103C3}\u{103C8}-\u{103D5}\u{10400}-\u{1049D}\u{104A0}-\u{104A9}\u{104B0}-\u{104D3}\u{104D8}-\u{104FB}\u{10500}-\u{10527}\u{10530}-\u{10563}\u{1056F}-\u{1057A}\u{1057C}-\u{1058A}\u{1058C}-\u{10592}\u{10594}\u{10595}\u{10597}-\u{105A1}\u{105A3}-\u{105B1}\u{105B3}-\u{105B9}\u{105BB}\u{105BC}\u{10600}-\u{10736}\u{10740}-\u{10755}\u{10760}-\u{10767}\u{10780}-\u{10785}\u{10787}-\u{107B0}\u{107B2}-\u{107BA}\u{11000}\u{11002}-\u{11037}\u{11047}-\u{1104D}\u{11066}-\u{1106F}\u{11071}\u{11072}\u{11075}\u{11082}-\u{110B2}\u{110B7}\u{110B8}\u{110BB}-\u{110C1}\u{110CD}\u{110D0}-\u{110E8}\u{110F0}-\u{110F9}\u{11103}-\u{11126}\u{1112C}\u{11136}-\u{11147}\u{11150}-\u{11172}\u{11174}-\u{11176}\u{11182}-\u{111B5}\u{111BF}-\u{111C8}\u{111CD}\u{111CE}\u{111D0}-\u{111DF}\u{111E1}-\u{111F4}\u{11200}-\u{11211}\u{11213}-\u{1122E}\u{11232}\u{11233}\u{11235}\u{11238}-\u{1123D}\u{11280}-\u{11286}\u{11288}\u{1128A}-\u{1128D}\u{1128F}-\u{1129D}\u{1129F}-\u{112A9}\u{112B0}-\u{112DE}\u{112E0}-\u{112E2}\u{112F0}-\u{112F9}\u{11302}\u{11303}\u{11305}-\u{1130C}\u{1130F}\u{11310}\u{11313}-\u{11328}\u{1132A}-\u{11330}\u{11332}\u{11333}\u{11335}-\u{11339}\u{1133D}-\u{1133F}\u{11341}-\u{11344}\u{11347}\u{11348}\u{1134B}-\u{1134D}\u{11350}\u{11357}\u{1135D}-\u{11363}\u{11400}-\u{11437}\u{11440}\u{11441}\u{11445}\u{11447}-\u{1145B}\u{1145D}\u{1145F}-\u{11461}\u{11480}-\u{114B2}\u{114B9}\u{114BB}-\u{114BE}\u{114C1}\u{114C4}-\u{114C7}\u{114D0}-\u{114D9}\u{11580}-\u{115B1}\u{115B8}-\u{115BB}\u{115BE}\u{115C1}-\u{115DB}\u{11600}-\u{11632}\u{1163B}\u{1163C}\u{1163E}\u{11641}-\u{11644}\u{11650}-\u{11659}\u{11680}-\u{116AA}\u{116AC}\u{116AE}\u{116AF}\u{116B6}\u{116B8}\u{116B9}\u{116C0}-\u{116C9}\u{11700}-\u{1171A}\u{11720}\u{11721}\u{11726}\u{11730}-\u{11746}\u{11800}-\u{1182E}\u{11838}\u{1183B}\u{118A0}-\u{118F2}\u{118FF}-\u{11906}\u{11909}\u{1190C}-\u{11913}\u{11915}\u{11916}\u{11918}-\u{11935}\u{11937}\u{11938}\u{1193D}\u{1193F}-\u{11942}\u{11944}-\u{11946}\u{11950}-\u{11959}\u{119A0}-\u{119A7}\u{119AA}-\u{119D3}\u{119DC}-\u{119DF}\u{119E1}-\u{119E4}\u{11A00}\u{11A07}\u{11A08}\u{11A0B}-\u{11A32}\u{11A39}\u{11A3A}\u{11A3F}-\u{11A46}\u{11A50}\u{11A57}\u{11A58}\u{11A5C}-\u{11A89}\u{11A97}\u{11A9A}-\u{11AA2}\u{11AB0}-\u{11AF8}\u{11C00}-\u{11C08}\u{11C0A}-\u{11C2F}\u{11C3E}-\u{11C45}\u{11C50}-\u{11C6C}\u{11C70}-\u{11C8F}\u{11CA9}\u{11CB1}\u{11CB4}\u{11D00}-\u{11D06}\u{11D08}\u{11D09}\u{11D0B}-\u{11D30}\u{11D46}\u{11D50}-\u{11D59}\u{11D60}-\u{11D65}\u{11D67}\u{11D68}\u{11D6A}-\u{11D8E}\u{11D93}\u{11D94}\u{11D96}\u{11D98}\u{11DA0}-\u{11DA9}\u{11EE0}-\u{11EF2}\u{11EF5}-\u{11EF8}\u{11FB0}\u{11FC0}-\u{11FD4}\u{11FFF}-\u{12399}\u{12400}-\u{1246E}\u{12470}-\u{12474}\u{12480}-\u{12543}\u{12F90}-\u{12FF2}\u{13000}-\u{1342E}\u{13430}-\u{13438}\u{14400}-\u{14646}\u{16800}-\u{16A38}\u{16A40}-\u{16A5E}\u{16A60}-\u{16A69}\u{16A6E}-\u{16ABE}\u{16AC0}-\u{16AC9}\u{16AD0}-\u{16AED}\u{16AF5}\u{16B00}-\u{16B2F}\u{16B37}-\u{16B45}\u{16B50}-\u{16B59}\u{16B5B}-\u{16B61}\u{16B63}-\u{16B77}\u{16B7D}-\u{16B8F}\u{16E40}-\u{16E9A}\u{16F00}-\u{16F4A}\u{16F50}-\u{16F87}\u{16F93}-\u{16F9F}\u{16FE0}\u{16FE1}\u{16FE3}\u{16FF0}\u{16FF1}\u{17000}-\u{187F7}\u{18800}-\u{18CD5}\u{18D00}-\u{18D08}\u{1AFF0}-\u{1AFF3}\u{1AFF5}-\u{1AFFB}\u{1AFFD}\u{1AFFE}\u{1B000}-\u{1B122}\u{1B150}-\u{1B152}\u{1B164}-\u{1B167}\u{1B170}-\u{1B2FB}\u{1BC00}-\u{1BC6A}\u{1BC70}-\u{1BC7C}\u{1BC80}-\u{1BC88}\u{1BC90}-\u{1BC99}\u{1BC9C}\u{1BC9F}\u{1CF50}-\u{1CFC3}\u{1D000}-\u{1D0F5}\u{1D100}-\u{1D126}\u{1D129}-\u{1D166}\u{1D16A}-\u{1D172}\u{1D183}\u{1D184}\u{1D18C}-\u{1D1A9}\u{1D1AE}-\u{1D1E8}\u{1D2E0}-\u{1D2F3}\u{1D360}-\u{1D378}\u{1D400}-\u{1D454}\u{1D456}-\u{1D49C}\u{1D49E}\u{1D49F}\u{1D4A2}\u{1D4A5}\u{1D4A6}\u{1D4A9}-\u{1D4AC}\u{1D4AE}-\u{1D4B9}\u{1D4BB}\u{1D4BD}-\u{1D4C3}\u{1D4C5}-\u{1D505}\u{1D507}-\u{1D50A}\u{1D50D}-\u{1D514}\u{1D516}-\u{1D51C}\u{1D51E}-\u{1D539}\u{1D53B}-\u{1D53E}\u{1D540}-\u{1D544}\u{1D546}\u{1D54A}-\u{1D550}\u{1D552}-\u{1D6A5}\u{1D6A8}-\u{1D6DA}\u{1D6DC}-\u{1D714}\u{1D716}-\u{1D74E}\u{1D750}-\u{1D788}\u{1D78A}-\u{1D7C2}\u{1D7C4}-\u{1D7CB}\u{1D7CE}-\u{1D9FF}\u{1DA37}-\u{1DA3A}\u{1DA6D}-\u{1DA74}\u{1DA76}-\u{1DA83}\u{1DA85}-\u{1DA8B}\u{1DF00}-\u{1DF1E}\u{1E100}-\u{1E12C}\u{1E137}-\u{1E13D}\u{1E140}-\u{1E149}\u{1E14E}\u{1E14F}\u{1E290}-\u{1E2AD}\u{1E2C0}-\u{1E2EB}\u{1E2F0}-\u{1E2F9}\u{1E7E0}-\u{1E7E6}\u{1E7E8}-\u{1E7EB}\u{1E7ED}\u{1E7EE}\u{1E7F0}-\u{1E7FE}\u{1F100}-\u{1F10A}\u{1F110}-\u{1F12E}\u{1F130}-\u{1F169}\u{1F170}-\u{1F1AC}\u{1F1E6}-\u{1F202}\u{1F210}-\u{1F23B}\u{1F240}-\u{1F248}\u{1F250}\u{1F251}\u{1FBF0}-\u{1FBF9}\u{20000}-\u{2A6DF}\u{2A700}-\u{2B738}\u{2B740}-\u{2B81D}\u{2B820}-\u{2CEA1}\u{2CEB0}-\u{2EBE0}\u{2F800}-\u{2FA1D}\u{30000}-\u{3134A}\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}][\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u0898-\u089F\u08CA-\u08E1\u08E3-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u09FE\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0AFA-\u0AFF\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B55\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C00\u0C04\u0C3C\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81\u0CBC\u0CCC\u0CCD\u0CE2\u0CE3\u0D00\u0D01\u0D3B\u0D3C\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0D81\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732\u1733\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u180F\u1885\u1886\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A1B\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1AB0-\u1ACE\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB-\u1BAD\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1CF8\u1CF9\u1DC0-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA82C\uA8C4\uA8C5\uA8E0-\uA8F1\uA8FF\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uA9BD\uA9E5\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAA7C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\u{101FD}\u{102E0}\u{10376}-\u{1037A}\u{10A01}-\u{10A03}\u{10A05}\u{10A06}\u{10A0C}-\u{10A0F}\u{10A38}-\u{10A3A}\u{10A3F}\u{10AE5}\u{10AE6}\u{10D24}-\u{10D27}\u{10EAB}\u{10EAC}\u{10F46}-\u{10F50}\u{10F82}-\u{10F85}\u{11001}\u{11038}-\u{11046}\u{11070}\u{11073}\u{11074}\u{1107F}-\u{11081}\u{110B3}-\u{110B6}\u{110B9}\u{110BA}\u{110C2}\u{11100}-\u{11102}\u{11127}-\u{1112B}\u{1112D}-\u{11134}\u{11173}\u{11180}\u{11181}\u{111B6}-\u{111BE}\u{111C9}-\u{111CC}\u{111CF}\u{1122F}-\u{11231}\u{11234}\u{11236}\u{11237}\u{1123E}\u{112DF}\u{112E3}-\u{112EA}\u{11300}\u{11301}\u{1133B}\u{1133C}\u{11340}\u{11366}-\u{1136C}\u{11370}-\u{11374}\u{11438}-\u{1143F}\u{11442}-\u{11444}\u{11446}\u{1145E}\u{114B3}-\u{114B8}\u{114BA}\u{114BF}\u{114C0}\u{114C2}\u{114C3}\u{115B2}-\u{115B5}\u{115BC}\u{115BD}\u{115BF}\u{115C0}\u{115DC}\u{115DD}\u{11633}-\u{1163A}\u{1163D}\u{1163F}\u{11640}\u{116AB}\u{116AD}\u{116B0}-\u{116B5}\u{116B7}\u{1171D}-\u{1171F}\u{11722}-\u{11725}\u{11727}-\u{1172B}\u{1182F}-\u{11837}\u{11839}\u{1183A}\u{1193B}\u{1193C}\u{1193E}\u{11943}\u{119D4}-\u{119D7}\u{119DA}\u{119DB}\u{119E0}\u{11A01}-\u{11A06}\u{11A09}\u{11A0A}\u{11A33}-\u{11A38}\u{11A3B}-\u{11A3E}\u{11A47}\u{11A51}-\u{11A56}\u{11A59}-\u{11A5B}\u{11A8A}-\u{11A96}\u{11A98}\u{11A99}\u{11C30}-\u{11C36}\u{11C38}-\u{11C3D}\u{11C92}-\u{11CA7}\u{11CAA}-\u{11CB0}\u{11CB2}\u{11CB3}\u{11CB5}\u{11CB6}\u{11D31}-\u{11D36}\u{11D3A}\u{11D3C}\u{11D3D}\u{11D3F}-\u{11D45}\u{11D47}\u{11D90}\u{11D91}\u{11D95}\u{11D97}\u{11EF3}\u{11EF4}\u{16AF0}-\u{16AF4}\u{16B30}-\u{16B36}\u{16F4F}\u{16F8F}-\u{16F92}\u{16FE4}\u{1BC9D}\u{1BC9E}\u{1CF00}-\u{1CF2D}\u{1CF30}-\u{1CF46}\u{1D167}-\u{1D169}\u{1D17B}-\u{1D182}\u{1D185}-\u{1D18B}\u{1D1AA}-\u{1D1AD}\u{1D242}-\u{1D244}\u{1DA00}-\u{1DA36}\u{1DA3B}-\u{1DA6C}\u{1DA75}\u{1DA84}\u{1DA9B}-\u{1DA9F}\u{1DAA1}-\u{1DAAF}\u{1E000}-\u{1E006}\u{1E008}-\u{1E018}\u{1E01B}-\u{1E021}\u{1E023}\u{1E024}\u{1E026}-\u{1E02A}\u{1E130}-\u{1E136}\u{1E2AE}\u{1E2EC}-\u{1E2EF}\u{1E8D0}-\u{1E8D6}\u{1E944}-\u{1E94A}\u{E0100}-\u{E01EF}]*$/u;

module.exports = {
  combiningMarks,
  combiningClassVirama,
  validZWNJ,
  bidiDomain,
  bidiS1LTR,
  bidiS1RTL,
  bidiS2,
  bidiS3,
  bidiS4EN,
  bidiS4AN,
  bidiS5,
  bidiS6
};


/***/ }),

/***/ "./node_modules/tr46/lib/statusMapping.js":
/*!************************************************!*\
  !*** ./node_modules/tr46/lib/statusMapping.js ***!
  \************************************************/
/***/ ((module) => {

"use strict";


module.exports.STATUS_MAPPING = {
  mapped: 1,
  valid: 2,
  disallowed: 3,
  disallowed_STD3_valid: 4,
  disallowed_STD3_mapped: 5,
  deviation: 6,
  ignored: 7
};


/***/ }),

/***/ "./node_modules/webidl-conversions/lib/index.js":
/*!******************************************************!*\
  !*** ./node_modules/webidl-conversions/lib/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function makeException(ErrorType, message, options) {
  if (options.globals) {
    ErrorType = options.globals[ErrorType.name];
  }
  return new ErrorType(`${options.context ? options.context : "Value"} ${message}.`);
}

function toNumber(value, options) {
  if (typeof value === "bigint") {
    throw makeException(TypeError, "is a BigInt which cannot be converted to a number", options);
  }
  if (!options.globals) {
    return Number(value);
  }
  return options.globals.Number(value);
}

// Round x to the nearest integer, choosing the even integer if it lies halfway between two.
function evenRound(x) {
  // There are four cases for numbers with fractional part being .5:
  //
  // case |     x     | floor(x) | round(x) | expected | x <> 0 | x % 1 | x & 1 |   example
  //   1  |  2n + 0.5 |  2n      |  2n + 1  |  2n      |   >    |  0.5  |   0   |  0.5 ->  0
  //   2  |  2n + 1.5 |  2n + 1  |  2n + 2  |  2n + 2  |   >    |  0.5  |   1   |  1.5 ->  2
  //   3  | -2n - 0.5 | -2n - 1  | -2n      | -2n      |   <    | -0.5  |   0   | -0.5 ->  0
  //   4  | -2n - 1.5 | -2n - 2  | -2n - 1  | -2n - 2  |   <    | -0.5  |   1   | -1.5 -> -2
  // (where n is a non-negative integer)
  //
  // Branch here for cases 1 and 4
  if ((x > 0 && (x % 1) === +0.5 && (x & 1) === 0) ||
        (x < 0 && (x % 1) === -0.5 && (x & 1) === 1)) {
    return censorNegativeZero(Math.floor(x));
  }

  return censorNegativeZero(Math.round(x));
}

function integerPart(n) {
  return censorNegativeZero(Math.trunc(n));
}

function sign(x) {
  return x < 0 ? -1 : 1;
}

function modulo(x, y) {
  // https://tc39.github.io/ecma262/#eqn-modulo
  // Note that http://stackoverflow.com/a/4467559/3191 does NOT work for large modulos
  const signMightNotMatch = x % y;
  if (sign(y) !== sign(signMightNotMatch)) {
    return signMightNotMatch + y;
  }
  return signMightNotMatch;
}

function censorNegativeZero(x) {
  return x === 0 ? 0 : x;
}

function createIntegerConversion(bitLength, { unsigned }) {
  let lowerBound, upperBound;
  if (unsigned) {
    lowerBound = 0;
    upperBound = 2 ** bitLength - 1;
  } else {
    lowerBound = -(2 ** (bitLength - 1));
    upperBound = 2 ** (bitLength - 1) - 1;
  }

  const twoToTheBitLength = 2 ** bitLength;
  const twoToOneLessThanTheBitLength = 2 ** (bitLength - 1);

  return (value, options = {}) => {
    let x = toNumber(value, options);
    x = censorNegativeZero(x);

    if (options.enforceRange) {
      if (!Number.isFinite(x)) {
        throw makeException(TypeError, "is not a finite number", options);
      }

      x = integerPart(x);

      if (x < lowerBound || x > upperBound) {
        throw makeException(
          TypeError,
          `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
          options
        );
      }

      return x;
    }

    if (!Number.isNaN(x) && options.clamp) {
      x = Math.min(Math.max(x, lowerBound), upperBound);
      x = evenRound(x);
      return x;
    }

    if (!Number.isFinite(x) || x === 0) {
      return 0;
    }
    x = integerPart(x);

    // Math.pow(2, 64) is not accurately representable in JavaScript, so try to avoid these per-spec operations if
    // possible. Hopefully it's an optimization for the non-64-bitLength cases too.
    if (x >= lowerBound && x <= upperBound) {
      return x;
    }

    // These will not work great for bitLength of 64, but oh well. See the README for more details.
    x = modulo(x, twoToTheBitLength);
    if (!unsigned && x >= twoToOneLessThanTheBitLength) {
      return x - twoToTheBitLength;
    }
    return x;
  };
}

function createLongLongConversion(bitLength, { unsigned }) {
  const upperBound = Number.MAX_SAFE_INTEGER;
  const lowerBound = unsigned ? 0 : Number.MIN_SAFE_INTEGER;
  const asBigIntN = unsigned ? BigInt.asUintN : BigInt.asIntN;

  return (value, options = {}) => {
    let x = toNumber(value, options);
    x = censorNegativeZero(x);

    if (options.enforceRange) {
      if (!Number.isFinite(x)) {
        throw makeException(TypeError, "is not a finite number", options);
      }

      x = integerPart(x);

      if (x < lowerBound || x > upperBound) {
        throw makeException(
          TypeError,
          `is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`,
          options
        );
      }

      return x;
    }

    if (!Number.isNaN(x) && options.clamp) {
      x = Math.min(Math.max(x, lowerBound), upperBound);
      x = evenRound(x);
      return x;
    }

    if (!Number.isFinite(x) || x === 0) {
      return 0;
    }

    let xBigInt = BigInt(integerPart(x));
    xBigInt = asBigIntN(bitLength, xBigInt);
    return Number(xBigInt);
  };
}

exports.any = value => {
  return value;
};

exports.undefined = () => {
  return undefined;
};

exports.boolean = value => {
  return Boolean(value);
};

exports.byte = createIntegerConversion(8, { unsigned: false });
exports.octet = createIntegerConversion(8, { unsigned: true });

exports.short = createIntegerConversion(16, { unsigned: false });
exports["unsigned short"] = createIntegerConversion(16, { unsigned: true });

exports.long = createIntegerConversion(32, { unsigned: false });
exports["unsigned long"] = createIntegerConversion(32, { unsigned: true });

exports["long long"] = createLongLongConversion(64, { unsigned: false });
exports["unsigned long long"] = createLongLongConversion(64, { unsigned: true });

exports.double = (value, options = {}) => {
  const x = toNumber(value, options);

  if (!Number.isFinite(x)) {
    throw makeException(TypeError, "is not a finite floating-point value", options);
  }

  return x;
};

exports["unrestricted double"] = (value, options = {}) => {
  const x = toNumber(value, options);

  return x;
};

exports.float = (value, options = {}) => {
  const x = toNumber(value, options);

  if (!Number.isFinite(x)) {
    throw makeException(TypeError, "is not a finite floating-point value", options);
  }

  if (Object.is(x, -0)) {
    return x;
  }

  const y = Math.fround(x);

  if (!Number.isFinite(y)) {
    throw makeException(TypeError, "is outside the range of a single-precision floating-point value", options);
  }

  return y;
};

exports["unrestricted float"] = (value, options = {}) => {
  const x = toNumber(value, options);

  if (isNaN(x)) {
    return x;
  }

  if (Object.is(x, -0)) {
    return x;
  }

  return Math.fround(x);
};

exports.DOMString = (value, options = {}) => {
  if (options.treatNullAsEmptyString && value === null) {
    return "";
  }

  if (typeof value === "symbol") {
    throw makeException(TypeError, "is a symbol, which cannot be converted to a string", options);
  }

  const StringCtor = options.globals ? options.globals.String : String;
  return StringCtor(value);
};

exports.ByteString = (value, options = {}) => {
  const x = exports.DOMString(value, options);
  let c;
  for (let i = 0; (c = x.codePointAt(i)) !== undefined; ++i) {
    if (c > 255) {
      throw makeException(TypeError, "is not a valid ByteString", options);
    }
  }

  return x;
};

exports.USVString = (value, options = {}) => {
  const S = exports.DOMString(value, options);
  const n = S.length;
  const U = [];
  for (let i = 0; i < n; ++i) {
    const c = S.charCodeAt(i);
    if (c < 0xD800 || c > 0xDFFF) {
      U.push(String.fromCodePoint(c));
    } else if (0xDC00 <= c && c <= 0xDFFF) {
      U.push(String.fromCodePoint(0xFFFD));
    } else if (i === n - 1) {
      U.push(String.fromCodePoint(0xFFFD));
    } else {
      const d = S.charCodeAt(i + 1);
      if (0xDC00 <= d && d <= 0xDFFF) {
        const a = c & 0x3FF;
        const b = d & 0x3FF;
        U.push(String.fromCodePoint((2 << 15) + ((2 << 9) * a) + b));
        ++i;
      } else {
        U.push(String.fromCodePoint(0xFFFD));
      }
    }
  }

  return U.join("");
};

exports.object = (value, options = {}) => {
  if (value === null || (typeof value !== "object" && typeof value !== "function")) {
    throw makeException(TypeError, "is not an object", options);
  }

  return value;
};

const abByteLengthGetter =
    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
const sabByteLengthGetter =
    typeof SharedArrayBuffer === "function" ?
      Object.getOwnPropertyDescriptor(SharedArrayBuffer.prototype, "byteLength").get :
      null;

function isNonSharedArrayBuffer(value) {
  try {
    // This will throw on SharedArrayBuffers, but not detached ArrayBuffers.
    // (The spec says it should throw, but the spec conflicts with implementations: https://github.com/tc39/ecma262/issues/678)
    abByteLengthGetter.call(value);

    return true;
  } catch {
    return false;
  }
}

function isSharedArrayBuffer(value) {
  try {
    sabByteLengthGetter.call(value);
    return true;
  } catch {
    return false;
  }
}

function isArrayBufferDetached(value) {
  try {
    // eslint-disable-next-line no-new
    new Uint8Array(value);
    return false;
  } catch {
    return true;
  }
}

exports.ArrayBuffer = (value, options = {}) => {
  if (!isNonSharedArrayBuffer(value)) {
    if (options.allowShared && !isSharedArrayBuffer(value)) {
      throw makeException(TypeError, "is not an ArrayBuffer or SharedArrayBuffer", options);
    }
    throw makeException(TypeError, "is not an ArrayBuffer", options);
  }
  if (isArrayBufferDetached(value)) {
    throw makeException(TypeError, "is a detached ArrayBuffer", options);
  }

  return value;
};

const dvByteLengthGetter =
    Object.getOwnPropertyDescriptor(DataView.prototype, "byteLength").get;
exports.DataView = (value, options = {}) => {
  try {
    dvByteLengthGetter.call(value);
  } catch (e) {
    throw makeException(TypeError, "is not a DataView", options);
  }

  if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
    throw makeException(TypeError, "is backed by a SharedArrayBuffer, which is not allowed", options);
  }
  if (isArrayBufferDetached(value.buffer)) {
    throw makeException(TypeError, "is backed by a detached ArrayBuffer", options);
  }

  return value;
};

// Returns the unforgeable `TypedArray` constructor name or `undefined`,
// if the `this` value isn't a valid `TypedArray` object.
//
// https://tc39.es/ecma262/#sec-get-%typedarray%.prototype-@@tostringtag
const typedArrayNameGetter = Object.getOwnPropertyDescriptor(
  Object.getPrototypeOf(Uint8Array).prototype,
  Symbol.toStringTag
).get;
[
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Float32Array,
  Float64Array
].forEach(func => {
  const { name } = func;
  const article = /^[AEIOU]/u.test(name) ? "an" : "a";
  exports[name] = (value, options = {}) => {
    if (!ArrayBuffer.isView(value) || typedArrayNameGetter.call(value) !== name) {
      throw makeException(TypeError, `is not ${article} ${name} object`, options);
    }
    if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
      throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
    }
    if (isArrayBufferDetached(value.buffer)) {
      throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
    }

    return value;
  };
});

// Common definitions

exports.ArrayBufferView = (value, options = {}) => {
  if (!ArrayBuffer.isView(value)) {
    throw makeException(TypeError, "is not a view on an ArrayBuffer or SharedArrayBuffer", options);
  }

  if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
    throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
  }

  if (isArrayBufferDetached(value.buffer)) {
    throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
  }
  return value;
};

exports.BufferSource = (value, options = {}) => {
  if (ArrayBuffer.isView(value)) {
    if (!options.allowShared && isSharedArrayBuffer(value.buffer)) {
      throw makeException(TypeError, "is a view on a SharedArrayBuffer, which is not allowed", options);
    }

    if (isArrayBufferDetached(value.buffer)) {
      throw makeException(TypeError, "is a view on a detached ArrayBuffer", options);
    }
    return value;
  }

  if (!options.allowShared && !isNonSharedArrayBuffer(value)) {
    throw makeException(TypeError, "is not an ArrayBuffer or a view on one", options);
  }
  if (options.allowShared && !isSharedArrayBuffer(value) && !isNonSharedArrayBuffer(value)) {
    throw makeException(TypeError, "is not an ArrayBuffer, SharedArrayBuffer, or a view on one", options);
  }
  if (isArrayBufferDetached(value)) {
    throw makeException(TypeError, "is a detached ArrayBuffer", options);
  }

  return value;
};

exports.DOMTimeStamp = exports["unsigned long long"];


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/mime-type-parameters.js":
/*!******************************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/mime-type-parameters.js ***!
  \******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const {
  asciiLowercase,
  solelyContainsHTTPTokenCodePoints,
  soleyContainsHTTPQuotedStringTokenCodePoints
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = class MIMETypeParameters {
  constructor(map) {
    this._map = map;
  }

  get size() {
    return this._map.size;
  }

  get(name) {
    name = asciiLowercase(String(name));
    return this._map.get(name);
  }

  has(name) {
    name = asciiLowercase(String(name));
    return this._map.has(name);
  }

  set(name, value) {
    name = asciiLowercase(String(name));
    value = String(value);

    if (!solelyContainsHTTPTokenCodePoints(name)) {
      throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
    }
    if (!soleyContainsHTTPQuotedStringTokenCodePoints(value)) {
      throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are ` +
                      `valid.`);
    }

    return this._map.set(name, value);
  }

  clear() {
    this._map.clear();
  }

  delete(name) {
    name = asciiLowercase(String(name));
    return this._map.delete(name);
  }

  forEach(callbackFn, thisArg) {
    this._map.forEach(callbackFn, thisArg);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  }

  entries() {
    return this._map.entries();
  }

  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/mime-type.js":
/*!*******************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/mime-type.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const MIMETypeParameters = __webpack_require__(/*! ./mime-type-parameters.js */ "./node_modules/whatwg-mimetype/lib/mime-type-parameters.js");
const parse = __webpack_require__(/*! ./parser.js */ "./node_modules/whatwg-mimetype/lib/parser.js");
const serialize = __webpack_require__(/*! ./serializer.js */ "./node_modules/whatwg-mimetype/lib/serializer.js");
const {
  asciiLowercase,
  solelyContainsHTTPTokenCodePoints
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = class MIMEType {
  constructor(string) {
    string = String(string);
    const result = parse(string);
    if (result === null) {
      throw new Error(`Could not parse MIME type string "${string}"`);
    }

    this._type = result.type;
    this._subtype = result.subtype;
    this._parameters = new MIMETypeParameters(result.parameters);
  }

  static parse(string) {
    try {
      return new this(string);
    } catch (e) {
      return null;
    }
  }

  get essence() {
    return `${this.type}/${this.subtype}`;
  }

  get type() {
    return this._type;
  }

  set type(value) {
    value = asciiLowercase(String(value));

    if (value.length === 0) {
      throw new Error("Invalid type: must be a non-empty string");
    }
    if (!solelyContainsHTTPTokenCodePoints(value)) {
      throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
    }

    this._type = value;
  }

  get subtype() {
    return this._subtype;
  }

  set subtype(value) {
    value = asciiLowercase(String(value));

    if (value.length === 0) {
      throw new Error("Invalid subtype: must be a non-empty string");
    }
    if (!solelyContainsHTTPTokenCodePoints(value)) {
      throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
    }

    this._subtype = value;
  }

  get parameters() {
    return this._parameters;
  }

  toString() {
    // The serialize function works on both "MIME type records" (i.e. the results of parse) and on this class, since
    // this class's interface is identical.
    return serialize(this);
  }

  isJavaScript({ prohibitParameters = false } = {}) {
    switch (this._type) {
      case "text": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "javascript1.0":
          case "javascript1.1":
          case "javascript1.2":
          case "javascript1.3":
          case "javascript1.4":
          case "javascript1.5":
          case "jscript":
          case "livescript":
          case "x-ecmascript":
          case "x-javascript": {
            return !prohibitParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      case "application": {
        switch (this._subtype) {
          case "ecmascript":
          case "javascript":
          case "x-ecmascript":
          case "x-javascript": {
            return !prohibitParameters || this._parameters.size === 0;
          }
          default: {
            return false;
          }
        }
      }
      default: {
        return false;
      }
    }
  }
  isXML() {
    return (this._subtype === "xml" && (this._type === "text" || this._type === "application")) ||
           this._subtype.endsWith("+xml");
  }
  isHTML() {
    return this._subtype === "html" && this._type === "text";
  }
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/parser.js":
/*!****************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/parser.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const {
  removeLeadingAndTrailingHTTPWhitespace,
  removeTrailingHTTPWhitespace,
  isHTTPWhitespaceChar,
  solelyContainsHTTPTokenCodePoints,
  soleyContainsHTTPQuotedStringTokenCodePoints,
  asciiLowercase,
  collectAnHTTPQuotedString
} = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = input => {
  input = removeLeadingAndTrailingHTTPWhitespace(input);

  let position = 0;
  let type = "";
  while (position < input.length && input[position] !== "/") {
    type += input[position];
    ++position;
  }

  if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
    return null;
  }

  if (position >= input.length) {
    return null;
  }

  // Skips past "/"
  ++position;

  let subtype = "";
  while (position < input.length && input[position] !== ";") {
    subtype += input[position];
    ++position;
  }

  subtype = removeTrailingHTTPWhitespace(subtype);

  if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
    return null;
  }

  const mimeType = {
    type: asciiLowercase(type),
    subtype: asciiLowercase(subtype),
    parameters: new Map()
  };

  while (position < input.length) {
    // Skip past ";"
    ++position;

    while (isHTTPWhitespaceChar(input[position])) {
      ++position;
    }

    let parameterName = "";
    while (position < input.length && input[position] !== ";" && input[position] !== "=") {
      parameterName += input[position];
      ++position;
    }
    parameterName = asciiLowercase(parameterName);

    if (position < input.length) {
      if (input[position] === ";") {
        continue;
      }

      // Skip past "="
      ++position;
    }

    let parameterValue = null;
    if (input[position] === "\"") {
      [parameterValue, position] = collectAnHTTPQuotedString(input, position);

      while (position < input.length && input[position] !== ";") {
        ++position;
      }
    } else {
      parameterValue = "";
      while (position < input.length && input[position] !== ";") {
        parameterValue += input[position];
        ++position;
      }

      parameterValue = removeTrailingHTTPWhitespace(parameterValue);

      if (parameterValue === "") {
        continue;
      }
    }

    if (parameterName.length > 0 &&
        solelyContainsHTTPTokenCodePoints(parameterName) &&
        soleyContainsHTTPQuotedStringTokenCodePoints(parameterValue) &&
        !mimeType.parameters.has(parameterName)) {
      mimeType.parameters.set(parameterName, parameterValue);
    }
  }

  return mimeType;
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/serializer.js":
/*!********************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/serializer.js ***!
  \********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { solelyContainsHTTPTokenCodePoints } = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-mimetype/lib/utils.js");

module.exports = mimeType => {
  let serialization = `${mimeType.type}/${mimeType.subtype}`;

  if (mimeType.parameters.size === 0) {
    return serialization;
  }

  for (let [name, value] of mimeType.parameters) {
    serialization += ";";
    serialization += name;
    serialization += "=";

    if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
      value = value.replace(/(["\\])/ug, "\\$1");
      value = `"${value}"`;
    }

    serialization += value;
  }

  return serialization;
};


/***/ }),

/***/ "./node_modules/whatwg-mimetype/lib/utils.js":
/*!***************************************************!*\
  !*** ./node_modules/whatwg-mimetype/lib/utils.js ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.removeLeadingAndTrailingHTTPWhitespace = string => {
  return string.replace(/^[ \t\n\r]+/u, "").replace(/[ \t\n\r]+$/u, "");
};

exports.removeTrailingHTTPWhitespace = string => {
  return string.replace(/[ \t\n\r]+$/u, "");
};

exports.isHTTPWhitespaceChar = char => {
  return char === " " || char === "\t" || char === "\n" || char === "\r";
};

exports.solelyContainsHTTPTokenCodePoints = string => {
  return /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u.test(string);
};

exports.soleyContainsHTTPQuotedStringTokenCodePoints = string => {
  return /^[\t\u0020-\u007E\u0080-\u00FF]*$/u.test(string);
};

exports.asciiLowercase = string => {
  return string.replace(/[A-Z]/ug, l => l.toLowerCase());
};

// This variant only implements it with the extract-value flag set.
exports.collectAnHTTPQuotedString = (input, position) => {
  let value = "";

  position++;

  while (true) {
    while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
      value += input[position];
      ++position;
    }

    if (position >= input.length) {
      break;
    }

    const quoteOrBackslash = input[position];
    ++position;

    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }

      value += input[position];
      ++position;
    } else {
      break;
    }
  }

  return [value, position];
};


/***/ }),

/***/ "./node_modules/whatwg-url/index.js":
/*!******************************************!*\
  !*** ./node_modules/whatwg-url/index.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const { URL, URLSearchParams } = __webpack_require__(/*! ./webidl2js-wrapper */ "./node_modules/whatwg-url/webidl2js-wrapper.js");
const urlStateMachine = __webpack_require__(/*! ./lib/url-state-machine */ "./node_modules/whatwg-url/lib/url-state-machine.js");
const percentEncoding = __webpack_require__(/*! ./lib/percent-encoding */ "./node_modules/whatwg-url/lib/percent-encoding.js");

const sharedGlobalObject = { Array, Object, Promise, String, TypeError };
URL.install(sharedGlobalObject, ["Window"]);
URLSearchParams.install(sharedGlobalObject, ["Window"]);

exports.URL = sharedGlobalObject.URL;
exports.URLSearchParams = sharedGlobalObject.URLSearchParams;

exports.parseURL = urlStateMachine.parseURL;
exports.basicURLParse = urlStateMachine.basicURLParse;
exports.serializeURL = urlStateMachine.serializeURL;
exports.serializeHost = urlStateMachine.serializeHost;
exports.serializeInteger = urlStateMachine.serializeInteger;
exports.serializeURLOrigin = urlStateMachine.serializeURLOrigin;
exports.setTheUsername = urlStateMachine.setTheUsername;
exports.setThePassword = urlStateMachine.setThePassword;
exports.cannotHaveAUsernamePasswordPort = urlStateMachine.cannotHaveAUsernamePasswordPort;

exports.percentDecodeString = percentEncoding.percentDecodeString;
exports.percentDecodeBytes = percentEncoding.percentDecodeBytes;


/***/ }),

/***/ "./node_modules/whatwg-url/lib/Function.js":
/*!*************************************************!*\
  !*** ./node_modules/whatwg-url/lib/Function.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const conversions = __webpack_require__(/*! webidl-conversions */ "./node_modules/webidl-conversions/lib/index.js");
const utils = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-url/lib/utils.js");

exports.convert = (globalObject, value, { context = "The provided value" } = {}) => {
  if (typeof value !== "function") {
    throw new globalObject.TypeError(context + " is not a function");
  }

  function invokeTheCallbackFunction(...args) {
    const thisArg = utils.tryWrapperForImpl(this);
    let callResult;

    for (let i = 0; i < args.length; i++) {
      args[i] = utils.tryWrapperForImpl(args[i]);
    }

    callResult = Reflect.apply(value, thisArg, args);

    callResult = conversions["any"](callResult, { context: context, globals: globalObject });

    return callResult;
  }

  invokeTheCallbackFunction.construct = (...args) => {
    for (let i = 0; i < args.length; i++) {
      args[i] = utils.tryWrapperForImpl(args[i]);
    }

    let callResult = Reflect.construct(value, args);

    callResult = conversions["any"](callResult, { context: context, globals: globalObject });

    return callResult;
  };

  invokeTheCallbackFunction[utils.wrapperSymbol] = value;
  invokeTheCallbackFunction.objectReference = value;

  return invokeTheCallbackFunction;
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/URL-impl.js":
/*!*************************************************!*\
  !*** ./node_modules/whatwg-url/lib/URL-impl.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

const usm = __webpack_require__(/*! ./url-state-machine */ "./node_modules/whatwg-url/lib/url-state-machine.js");
const urlencoded = __webpack_require__(/*! ./urlencoded */ "./node_modules/whatwg-url/lib/urlencoded.js");
const URLSearchParams = __webpack_require__(/*! ./URLSearchParams */ "./node_modules/whatwg-url/lib/URLSearchParams.js");

exports.implementation = class URLImpl {
  constructor(globalObject, constructorArgs) {
    const url = constructorArgs[0];
    const base = constructorArgs[1];

    let parsedBase = null;
    if (base !== undefined) {
      parsedBase = usm.basicURLParse(base);
      if (parsedBase === null) {
        throw new TypeError(`Invalid base URL: ${base}`);
      }
    }

    const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
    if (parsedURL === null) {
      throw new TypeError(`Invalid URL: ${url}`);
    }

    const query = parsedURL.query !== null ? parsedURL.query : "";

    this._url = parsedURL;

    // We cannot invoke the "new URLSearchParams object" algorithm without going through the constructor, which strips
    // question mark by default. Therefore the doNotStripQMark hack is used.
    this._query = URLSearchParams.createImpl(globalObject, [query], { doNotStripQMark: true });
    this._query._url = this;
  }

  get href() {
    return usm.serializeURL(this._url);
  }

  set href(v) {
    const parsedURL = usm.basicURLParse(v);
    if (parsedURL === null) {
      throw new TypeError(`Invalid URL: ${v}`);
    }

    this._url = parsedURL;

    this._query._list.splice(0);
    const { query } = parsedURL;
    if (query !== null) {
      this._query._list = urlencoded.parseUrlencodedString(query);
    }
  }

  get origin() {
    return usm.serializeURLOrigin(this._url);
  }

  get protocol() {
    return `${this._url.scheme}:`;
  }

  set protocol(v) {
    usm.basicURLParse(`${v}:`, { url: this._url, stateOverride: "scheme start" });
  }

  get username() {
    return this._url.username;
  }

  set username(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    usm.setTheUsername(this._url, v);
  }

  get password() {
    return this._url.password;
  }

  set password(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    usm.setThePassword(this._url, v);
  }

  get host() {
    const url = this._url;

    if (url.host === null) {
      return "";
    }

    if (url.port === null) {
      return usm.serializeHost(url.host);
    }

    return `${usm.serializeHost(url.host)}:${usm.serializeInteger(url.port)}`;
  }

  set host(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
  }

  get hostname() {
    if (this._url.host === null) {
      return "";
    }

    return usm.serializeHost(this._url.host);
  }

  set hostname(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
  }

  get port() {
    if (this._url.port === null) {
      return "";
    }

    return usm.serializeInteger(this._url.port);
  }

  set port(v) {
    if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
      return;
    }

    if (v === "") {
      this._url.port = null;
    } else {
      usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
    }
  }

  get pathname() {
    if (this._url.cannotBeABaseURL) {
      return this._url.path[0];
    }

    if (this._url.path.length === 0) {
      return "";
    }

    return `/${this._url.path.join("/")}`;
  }

  set pathname(v) {
    if (this._url.cannotBeABaseURL) {
      return;
    }

    this._url.path = [];
    usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
  }

  get search() {
    if (this._url.query === null || this._url.query === "") {
      return "";
    }

    return `?${this._url.query}`;
  }

  set search(v) {
    const url = this._url;

    if (v === "") {
      url.query = null;
      this._query._list = [];
      return;
    }

    const input = v[0] === "?" ? v.substring(1) : v;
    url.query = "";
    usm.basicURLParse(input, { url, stateOverride: "query" });
    this._query._list = urlencoded.parseUrlencodedString(input);
  }

  get searchParams() {
    return this._query;
  }

  get hash() {
    if (this._url.fragment === null || this._url.fragment === "") {
      return "";
    }

    return `#${this._url.fragment}`;
  }

  set hash(v) {
    if (v === "") {
      this._url.fragment = null;
      return;
    }

    const input = v[0] === "#" ? v.substring(1) : v;
    this._url.fragment = "";
    usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
  }

  toJSON() {
    return this.href;
  }
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/URL.js":
/*!********************************************!*\
  !*** ./node_modules/whatwg-url/lib/URL.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const conversions = __webpack_require__(/*! webidl-conversions */ "./node_modules/webidl-conversions/lib/index.js");
const utils = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-url/lib/utils.js");

const implSymbol = utils.implSymbol;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "URL";

exports.is = value => {
  return utils.isObject(value) && utils.hasOwn(value, implSymbol) && value[implSymbol] instanceof Impl.implementation;
};
exports.isImpl = value => {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = (globalObject, value, { context = "The provided value" } = {}) => {
  if (exports.is(value)) {
    return utils.implForWrapper(value);
  }
  throw new globalObject.TypeError(`${context} is not of type 'URL'.`);
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["URL"].prototype;
  }

  return Object.create(proto);
}

exports.create = (globalObject, constructorArgs, privateData) => {
  const wrapper = makeWrapper(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};

exports.createImpl = (globalObject, constructorArgs, privateData) => {
  const wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};

exports._internalSetup = (wrapper, globalObject) => {};

exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
  privateData.wrapper = wrapper;

  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });

  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper;
};

exports["new"] = (globalObject, newTarget) => {
  const wrapper = makeWrapper(globalObject, newTarget);

  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: Object.create(Impl.implementation.prototype),
    configurable: true
  });

  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper[implSymbol];
};

const exposed = new Set(["Window", "Worker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class URL {
    constructor(url) {
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to construct 'URL': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to construct 'URL': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        if (curArg !== undefined) {
          curArg = conversions["USVString"](curArg, {
            context: "Failed to construct 'URL': parameter 2",
            globals: globalObject
          });
        }
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    toJSON() {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'toJSON' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol].toJSON();
    }

    get href() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get href' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["href"];
    }

    set href(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set href' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'href' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["href"] = V;
    }

    toString() {
      const esValue = this;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'toString' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["href"];
    }

    get origin() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get origin' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["origin"];
    }

    get protocol() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get protocol' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["protocol"];
    }

    set protocol(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set protocol' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'protocol' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["protocol"] = V;
    }

    get username() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get username' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["username"];
    }

    set username(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set username' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'username' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["username"] = V;
    }

    get password() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get password' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["password"];
    }

    set password(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set password' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'password' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["password"] = V;
    }

    get host() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get host' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["host"];
    }

    set host(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set host' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'host' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["host"] = V;
    }

    get hostname() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get hostname' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["hostname"];
    }

    set hostname(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set hostname' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'hostname' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["hostname"] = V;
    }

    get port() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get port' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["port"];
    }

    set port(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set port' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'port' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["port"] = V;
    }

    get pathname() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get pathname' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["pathname"];
    }

    set pathname(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set pathname' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'pathname' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["pathname"] = V;
    }

    get search() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get search' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["search"];
    }

    set search(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set search' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'search' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["search"] = V;
    }

    get searchParams() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get searchParams' called on an object that is not a valid instance of URL.");
      }

      return utils.getSameObject(this, "searchParams", () => {
        return utils.tryWrapperForImpl(esValue[implSymbol]["searchParams"]);
      });
    }

    get hash() {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get hash' called on an object that is not a valid instance of URL.");
      }

      return esValue[implSymbol]["hash"];
    }

    set hash(V) {
      const esValue = this !== null && this !== undefined ? this : globalObject;

      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set hash' called on an object that is not a valid instance of URL.");
      }

      V = conversions["USVString"](V, {
        context: "Failed to set the 'hash' property on 'URL': The provided value",
        globals: globalObject
      });

      esValue[implSymbol]["hash"] = V;
    }
  }
  Object.defineProperties(URL.prototype, {
    toJSON: { enumerable: true },
    href: { enumerable: true },
    toString: { enumerable: true },
    origin: { enumerable: true },
    protocol: { enumerable: true },
    username: { enumerable: true },
    password: { enumerable: true },
    host: { enumerable: true },
    hostname: { enumerable: true },
    port: { enumerable: true },
    pathname: { enumerable: true },
    search: { enumerable: true },
    searchParams: { enumerable: true },
    hash: { enumerable: true },
    [Symbol.toStringTag]: { value: "URL", configurable: true }
  });
  ctorRegistry[interfaceName] = URL;

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: URL
  });

  if (globalNames.includes("Window")) {
    Object.defineProperty(globalObject, "webkitURL", {
      configurable: true,
      writable: true,
      value: URL
    });
  }
};

const Impl = __webpack_require__(/*! ./URL-impl.js */ "./node_modules/whatwg-url/lib/URL-impl.js");


/***/ }),

/***/ "./node_modules/whatwg-url/lib/URLSearchParams-impl.js":
/*!*************************************************************!*\
  !*** ./node_modules/whatwg-url/lib/URLSearchParams-impl.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

const urlencoded = __webpack_require__(/*! ./urlencoded */ "./node_modules/whatwg-url/lib/urlencoded.js");

exports.implementation = class URLSearchParamsImpl {
  constructor(globalObject, constructorArgs, { doNotStripQMark = false }) {
    let init = constructorArgs[0];
    this._list = [];
    this._url = null;

    if (!doNotStripQMark && typeof init === "string" && init[0] === "?") {
      init = init.slice(1);
    }

    if (Array.isArray(init)) {
      for (const pair of init) {
        if (pair.length !== 2) {
          throw new TypeError("Failed to construct 'URLSearchParams': parameter 1 sequence's element does not " +
                              "contain exactly two elements.");
        }
        this._list.push([pair[0], pair[1]]);
      }
    } else if (typeof init === "object" && Object.getPrototypeOf(init) === null) {
      for (const name of Object.keys(init)) {
        const value = init[name];
        this._list.push([name, value]);
      }
    } else {
      this._list = urlencoded.parseUrlencodedString(init);
    }
  }

  _updateSteps() {
    if (this._url !== null) {
      let query = urlencoded.serializeUrlencoded(this._list);
      if (query === "") {
        query = null;
      }
      this._url._url.query = query;
    }
  }

  append(name, value) {
    this._list.push([name, value]);
    this._updateSteps();
  }

  delete(name) {
    let i = 0;
    while (i < this._list.length) {
      if (this._list[i][0] === name) {
        this._list.splice(i, 1);
      } else {
        i++;
      }
    }
    this._updateSteps();
  }

  get(name) {
    for (const tuple of this._list) {
      if (tuple[0] === name) {
        return tuple[1];
      }
    }
    return null;
  }

  getAll(name) {
    const output = [];
    for (const tuple of this._list) {
      if (tuple[0] === name) {
        output.push(tuple[1]);
      }
    }
    return output;
  }

  has(name) {
    for (const tuple of this._list) {
      if (tuple[0] === name) {
        return true;
      }
    }
    return false;
  }

  set(name, value) {
    let found = false;
    let i = 0;
    while (i < this._list.length) {
      if (this._list[i][0] === name) {
        if (found) {
          this._list.splice(i, 1);
        } else {
          found = true;
          this._list[i][1] = value;
          i++;
        }
      } else {
        i++;
      }
    }
    if (!found) {
      this._list.push([name, value]);
    }
    this._updateSteps();
  }

  sort() {
    this._list.sort((a, b) => {
      if (a[0] < b[0]) {
        return -1;
      }
      if (a[0] > b[0]) {
        return 1;
      }
      return 0;
    });

    this._updateSteps();
  }

  [Symbol.iterator]() {
    return this._list[Symbol.iterator]();
  }

  toString() {
    return urlencoded.serializeUrlencoded(this._list);
  }
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/URLSearchParams.js":
/*!********************************************************!*\
  !*** ./node_modules/whatwg-url/lib/URLSearchParams.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const conversions = __webpack_require__(/*! webidl-conversions */ "./node_modules/webidl-conversions/lib/index.js");
const utils = __webpack_require__(/*! ./utils.js */ "./node_modules/whatwg-url/lib/utils.js");

const Function = __webpack_require__(/*! ./Function.js */ "./node_modules/whatwg-url/lib/Function.js");
const newObjectInRealm = utils.newObjectInRealm;
const implSymbol = utils.implSymbol;
const ctorRegistrySymbol = utils.ctorRegistrySymbol;

const interfaceName = "URLSearchParams";

exports.is = value => {
  return utils.isObject(value) && utils.hasOwn(value, implSymbol) && value[implSymbol] instanceof Impl.implementation;
};
exports.isImpl = value => {
  return utils.isObject(value) && value instanceof Impl.implementation;
};
exports.convert = (globalObject, value, { context = "The provided value" } = {}) => {
  if (exports.is(value)) {
    return utils.implForWrapper(value);
  }
  throw new globalObject.TypeError(`${context} is not of type 'URLSearchParams'.`);
};

exports.createDefaultIterator = (globalObject, target, kind) => {
  const ctorRegistry = globalObject[ctorRegistrySymbol];
  const iteratorPrototype = ctorRegistry["URLSearchParams Iterator"];
  const iterator = Object.create(iteratorPrototype);
  Object.defineProperty(iterator, utils.iterInternalSymbol, {
    value: { target, kind, index: 0 },
    configurable: true
  });
  return iterator;
};

function makeWrapper(globalObject, newTarget) {
  let proto;
  if (newTarget !== undefined) {
    proto = newTarget.prototype;
  }

  if (!utils.isObject(proto)) {
    proto = globalObject[ctorRegistrySymbol]["URLSearchParams"].prototype;
  }

  return Object.create(proto);
}

exports.create = (globalObject, constructorArgs, privateData) => {
  const wrapper = makeWrapper(globalObject);
  return exports.setup(wrapper, globalObject, constructorArgs, privateData);
};

exports.createImpl = (globalObject, constructorArgs, privateData) => {
  const wrapper = exports.create(globalObject, constructorArgs, privateData);
  return utils.implForWrapper(wrapper);
};

exports._internalSetup = (wrapper, globalObject) => {};

exports.setup = (wrapper, globalObject, constructorArgs = [], privateData = {}) => {
  privateData.wrapper = wrapper;

  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: new Impl.implementation(globalObject, constructorArgs, privateData),
    configurable: true
  });

  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper;
};

exports["new"] = (globalObject, newTarget) => {
  const wrapper = makeWrapper(globalObject, newTarget);

  exports._internalSetup(wrapper, globalObject);
  Object.defineProperty(wrapper, implSymbol, {
    value: Object.create(Impl.implementation.prototype),
    configurable: true
  });

  wrapper[implSymbol][utils.wrapperSymbol] = wrapper;
  if (Impl.init) {
    Impl.init(wrapper[implSymbol]);
  }
  return wrapper[implSymbol];
};

const exposed = new Set(["Window", "Worker"]);

exports.install = (globalObject, globalNames) => {
  if (!globalNames.some(globalName => exposed.has(globalName))) {
    return;
  }

  const ctorRegistry = utils.initCtorRegistry(globalObject);
  class URLSearchParams {
    constructor() {
      const args = [];
      {
        let curArg = arguments[0];
        if (curArg !== undefined) {
          if (utils.isObject(curArg)) {
            if (curArg[Symbol.iterator] !== undefined) {
              if (!utils.isObject(curArg)) {
                throw new globalObject.TypeError(
                  "Failed to construct 'URLSearchParams': parameter 1" + " sequence" + " is not an iterable object."
                );
              } else {
                const V = [];
                const tmp = curArg;
                for (let nextItem of tmp) {
                  if (!utils.isObject(nextItem)) {
                    throw new globalObject.TypeError(
                      "Failed to construct 'URLSearchParams': parameter 1" +
                        " sequence" +
                        "'s element" +
                        " is not an iterable object."
                    );
                  } else {
                    const V = [];
                    const tmp = nextItem;
                    for (let nextItem of tmp) {
                      nextItem = conversions["USVString"](nextItem, {
                        context:
                          "Failed to construct 'URLSearchParams': parameter 1" +
                          " sequence" +
                          "'s element" +
                          "'s element",
                        globals: globalObject
                      });

                      V.push(nextItem);
                    }
                    nextItem = V;
                  }

                  V.push(nextItem);
                }
                curArg = V;
              }
            } else {
              if (!utils.isObject(curArg)) {
                throw new globalObject.TypeError(
                  "Failed to construct 'URLSearchParams': parameter 1" + " record" + " is not an object."
                );
              } else {
                const result = Object.create(null);
                for (const key of Reflect.ownKeys(curArg)) {
                  const desc = Object.getOwnPropertyDescriptor(curArg, key);
                  if (desc && desc.enumerable) {
                    let typedKey = key;

                    typedKey = conversions["USVString"](typedKey, {
                      context: "Failed to construct 'URLSearchParams': parameter 1" + " record" + "'s key",
                      globals: globalObject
                    });

                    let typedValue = curArg[key];

                    typedValue = conversions["USVString"](typedValue, {
                      context: "Failed to construct 'URLSearchParams': parameter 1" + " record" + "'s value",
                      globals: globalObject
                    });

                    result[typedKey] = typedValue;
                  }
                }
                curArg = result;
              }
            }
          } else {
            curArg = conversions["USVString"](curArg, {
              context: "Failed to construct 'URLSearchParams': parameter 1",
              globals: globalObject
            });
          }
        } else {
          curArg = "";
        }
        args.push(curArg);
      }
      return exports.setup(Object.create(new.target.prototype), globalObject, args);
    }

    append(name, value) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError(
          "'append' called on an object that is not a valid instance of URLSearchParams."
        );
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'append' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'append' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'append' on 'URLSearchParams': parameter 2",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(esValue[implSymbol].append(...args));
    }

    delete(name) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError(
          "'delete' called on an object that is not a valid instance of URLSearchParams."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'delete' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'delete' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(esValue[implSymbol].delete(...args));
    }

    get(name) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'get' called on an object that is not a valid instance of URLSearchParams.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'get' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'get' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return esValue[implSymbol].get(...args);
    }

    getAll(name) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError(
          "'getAll' called on an object that is not a valid instance of URLSearchParams."
        );
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'getAll' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'getAll' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(esValue[implSymbol].getAll(...args));
    }

    has(name) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'has' called on an object that is not a valid instance of URLSearchParams.");
      }

      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          `Failed to execute 'has' on 'URLSearchParams': 1 argument required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'has' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      return esValue[implSymbol].has(...args);
    }

    set(name, value) {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'set' called on an object that is not a valid instance of URLSearchParams.");
      }

      if (arguments.length < 2) {
        throw new globalObject.TypeError(
          `Failed to execute 'set' on 'URLSearchParams': 2 arguments required, but only ${arguments.length} present.`
        );
      }
      const args = [];
      {
        let curArg = arguments[0];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'set' on 'URLSearchParams': parameter 1",
          globals: globalObject
        });
        args.push(curArg);
      }
      {
        let curArg = arguments[1];
        curArg = conversions["USVString"](curArg, {
          context: "Failed to execute 'set' on 'URLSearchParams': parameter 2",
          globals: globalObject
        });
        args.push(curArg);
      }
      return utils.tryWrapperForImpl(esValue[implSymbol].set(...args));
    }

    sort() {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError("'sort' called on an object that is not a valid instance of URLSearchParams.");
      }

      return utils.tryWrapperForImpl(esValue[implSymbol].sort());
    }

    toString() {
      const esValue = this !== null && this !== undefined ? this : globalObject;
      if (!exports.is(esValue)) {
        throw new globalObject.TypeError(
          "'toString' called on an object that is not a valid instance of URLSearchParams."
        );
      }

      return esValue[implSymbol].toString();
    }

    keys() {
      if (!exports.is(this)) {
        throw new globalObject.TypeError("'keys' called on an object that is not a valid instance of URLSearchParams.");
      }
      return exports.createDefaultIterator(globalObject, this, "key");
    }

    values() {
      if (!exports.is(this)) {
        throw new globalObject.TypeError(
          "'values' called on an object that is not a valid instance of URLSearchParams."
        );
      }
      return exports.createDefaultIterator(globalObject, this, "value");
    }

    entries() {
      if (!exports.is(this)) {
        throw new globalObject.TypeError(
          "'entries' called on an object that is not a valid instance of URLSearchParams."
        );
      }
      return exports.createDefaultIterator(globalObject, this, "key+value");
    }

    forEach(callback) {
      if (!exports.is(this)) {
        throw new globalObject.TypeError(
          "'forEach' called on an object that is not a valid instance of URLSearchParams."
        );
      }
      if (arguments.length < 1) {
        throw new globalObject.TypeError(
          "Failed to execute 'forEach' on 'iterable': 1 argument required, but only 0 present."
        );
      }
      callback = Function.convert(globalObject, callback, {
        context: "Failed to execute 'forEach' on 'iterable': The callback provided as parameter 1"
      });
      const thisArg = arguments[1];
      let pairs = Array.from(this[implSymbol]);
      let i = 0;
      while (i < pairs.length) {
        const [key, value] = pairs[i].map(utils.tryWrapperForImpl);
        callback.call(thisArg, value, key, this);
        pairs = Array.from(this[implSymbol]);
        i++;
      }
    }
  }
  Object.defineProperties(URLSearchParams.prototype, {
    append: { enumerable: true },
    delete: { enumerable: true },
    get: { enumerable: true },
    getAll: { enumerable: true },
    has: { enumerable: true },
    set: { enumerable: true },
    sort: { enumerable: true },
    toString: { enumerable: true },
    keys: { enumerable: true },
    values: { enumerable: true },
    entries: { enumerable: true },
    forEach: { enumerable: true },
    [Symbol.toStringTag]: { value: "URLSearchParams", configurable: true },
    [Symbol.iterator]: { value: URLSearchParams.prototype.entries, configurable: true, writable: true }
  });
  ctorRegistry[interfaceName] = URLSearchParams;

  ctorRegistry["URLSearchParams Iterator"] = Object.create(ctorRegistry["%IteratorPrototype%"], {
    [Symbol.toStringTag]: {
      configurable: true,
      value: "URLSearchParams Iterator"
    }
  });
  utils.define(ctorRegistry["URLSearchParams Iterator"], {
    next() {
      const internal = this && this[utils.iterInternalSymbol];
      if (!internal) {
        throw new globalObject.TypeError("next() called on a value that is not a URLSearchParams iterator object");
      }

      const { target, kind, index } = internal;
      const values = Array.from(target[implSymbol]);
      const len = values.length;
      if (index >= len) {
        return newObjectInRealm(globalObject, { value: undefined, done: true });
      }

      const pair = values[index];
      internal.index = index + 1;
      return newObjectInRealm(globalObject, utils.iteratorResult(pair.map(utils.tryWrapperForImpl), kind));
    }
  });

  Object.defineProperty(globalObject, interfaceName, {
    configurable: true,
    writable: true,
    value: URLSearchParams
  });
};

const Impl = __webpack_require__(/*! ./URLSearchParams-impl.js */ "./node_modules/whatwg-url/lib/URLSearchParams-impl.js");


/***/ }),

/***/ "./node_modules/whatwg-url/lib/encoding.js":
/*!*************************************************!*\
  !*** ./node_modules/whatwg-url/lib/encoding.js ***!
  \*************************************************/
/***/ ((module) => {

"use strict";

const utf8Encoder = new TextEncoder();
const utf8Decoder = new TextDecoder("utf-8", { ignoreBOM: true });

function utf8Encode(string) {
  return utf8Encoder.encode(string);
}

function utf8DecodeWithoutBOM(bytes) {
  return utf8Decoder.decode(bytes);
}

module.exports = {
  utf8Encode,
  utf8DecodeWithoutBOM
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/infra.js":
/*!**********************************************!*\
  !*** ./node_modules/whatwg-url/lib/infra.js ***!
  \**********************************************/
/***/ ((module) => {

"use strict";


// Note that we take code points as JS numbers, not JS strings.

function isASCIIDigit(c) {
  return c >= 0x30 && c <= 0x39;
}

function isASCIIAlpha(c) {
  return (c >= 0x41 && c <= 0x5A) || (c >= 0x61 && c <= 0x7A);
}

function isASCIIAlphanumeric(c) {
  return isASCIIAlpha(c) || isASCIIDigit(c);
}

function isASCIIHex(c) {
  return isASCIIDigit(c) || (c >= 0x41 && c <= 0x46) || (c >= 0x61 && c <= 0x66);
}

module.exports = {
  isASCIIDigit,
  isASCIIAlpha,
  isASCIIAlphanumeric,
  isASCIIHex
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/percent-encoding.js":
/*!*********************************************************!*\
  !*** ./node_modules/whatwg-url/lib/percent-encoding.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { isASCIIHex } = __webpack_require__(/*! ./infra */ "./node_modules/whatwg-url/lib/infra.js");
const { utf8Encode } = __webpack_require__(/*! ./encoding */ "./node_modules/whatwg-url/lib/encoding.js");

function p(char) {
  return char.codePointAt(0);
}

// https://url.spec.whatwg.org/#percent-encode
function percentEncode(c) {
  let hex = c.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = `0${hex}`;
  }

  return `%${hex}`;
}

// https://url.spec.whatwg.org/#percent-decode
function percentDecodeBytes(input) {
  const output = new Uint8Array(input.byteLength);
  let outputIndex = 0;
  for (let i = 0; i < input.byteLength; ++i) {
    const byte = input[i];
    if (byte !== 0x25) {
      output[outputIndex++] = byte;
    } else if (byte === 0x25 && (!isASCIIHex(input[i + 1]) || !isASCIIHex(input[i + 2]))) {
      output[outputIndex++] = byte;
    } else {
      const bytePoint = parseInt(String.fromCodePoint(input[i + 1], input[i + 2]), 16);
      output[outputIndex++] = bytePoint;
      i += 2;
    }
  }

  return output.slice(0, outputIndex);
}

// https://url.spec.whatwg.org/#string-percent-decode
function percentDecodeString(input) {
  const bytes = utf8Encode(input);
  return percentDecodeBytes(bytes);
}

// https://url.spec.whatwg.org/#c0-control-percent-encode-set
function isC0ControlPercentEncode(c) {
  return c <= 0x1F || c > 0x7E;
}

// https://url.spec.whatwg.org/#fragment-percent-encode-set
const extraFragmentPercentEncodeSet = new Set([p(" "), p("\""), p("<"), p(">"), p("`")]);
function isFragmentPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraFragmentPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#query-percent-encode-set
const extraQueryPercentEncodeSet = new Set([p(" "), p("\""), p("#"), p("<"), p(">")]);
function isQueryPercentEncode(c) {
  return isC0ControlPercentEncode(c) || extraQueryPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#special-query-percent-encode-set
function isSpecialQueryPercentEncode(c) {
  return isQueryPercentEncode(c) || c === p("'");
}

// https://url.spec.whatwg.org/#path-percent-encode-set
const extraPathPercentEncodeSet = new Set([p("?"), p("`"), p("{"), p("}")]);
function isPathPercentEncode(c) {
  return isQueryPercentEncode(c) || extraPathPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#userinfo-percent-encode-set
const extraUserinfoPercentEncodeSet =
  new Set([p("/"), p(":"), p(";"), p("="), p("@"), p("["), p("\\"), p("]"), p("^"), p("|")]);
function isUserinfoPercentEncode(c) {
  return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#component-percent-encode-set
const extraComponentPercentEncodeSet = new Set([p("$"), p("%"), p("&"), p("+"), p(",")]);
function isComponentPercentEncode(c) {
  return isUserinfoPercentEncode(c) || extraComponentPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#application-x-www-form-urlencoded-percent-encode-set
const extraURLEncodedPercentEncodeSet = new Set([p("!"), p("'"), p("("), p(")"), p("~")]);
function isURLEncodedPercentEncode(c) {
  return isComponentPercentEncode(c) || extraURLEncodedPercentEncodeSet.has(c);
}

// https://url.spec.whatwg.org/#code-point-percent-encode-after-encoding
// https://url.spec.whatwg.org/#utf-8-percent-encode
// Assuming encoding is always utf-8 allows us to trim one of the logic branches. TODO: support encoding.
// The "-Internal" variant here has code points as JS strings. The external version used by other files has code points
// as JS numbers, like the rest of the codebase.
function utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate) {
  const bytes = utf8Encode(codePoint);
  let output = "";
  for (const byte of bytes) {
    // Our percentEncodePredicate operates on bytes, not code points, so this is slightly different from the spec.
    if (!percentEncodePredicate(byte)) {
      output += String.fromCharCode(byte);
    } else {
      output += percentEncode(byte);
    }
  }

  return output;
}

function utf8PercentEncodeCodePoint(codePoint, percentEncodePredicate) {
  return utf8PercentEncodeCodePointInternal(String.fromCodePoint(codePoint), percentEncodePredicate);
}

// https://url.spec.whatwg.org/#string-percent-encode-after-encoding
// https://url.spec.whatwg.org/#string-utf-8-percent-encode
function utf8PercentEncodeString(input, percentEncodePredicate, spaceAsPlus = false) {
  let output = "";
  for (const codePoint of input) {
    if (spaceAsPlus && codePoint === " ") {
      output += "+";
    } else {
      output += utf8PercentEncodeCodePointInternal(codePoint, percentEncodePredicate);
    }
  }
  return output;
}

module.exports = {
  isC0ControlPercentEncode,
  isFragmentPercentEncode,
  isQueryPercentEncode,
  isSpecialQueryPercentEncode,
  isPathPercentEncode,
  isUserinfoPercentEncode,
  isURLEncodedPercentEncode,
  percentDecodeString,
  percentDecodeBytes,
  utf8PercentEncodeString,
  utf8PercentEncodeCodePoint
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/url-state-machine.js":
/*!**********************************************************!*\
  !*** ./node_modules/whatwg-url/lib/url-state-machine.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const tr46 = __webpack_require__(/*! tr46 */ "./node_modules/tr46/index.js");

const infra = __webpack_require__(/*! ./infra */ "./node_modules/whatwg-url/lib/infra.js");
const { utf8DecodeWithoutBOM } = __webpack_require__(/*! ./encoding */ "./node_modules/whatwg-url/lib/encoding.js");
const { percentDecodeString, utf8PercentEncodeCodePoint, utf8PercentEncodeString, isC0ControlPercentEncode,
  isFragmentPercentEncode, isQueryPercentEncode, isSpecialQueryPercentEncode, isPathPercentEncode,
  isUserinfoPercentEncode } = __webpack_require__(/*! ./percent-encoding */ "./node_modules/whatwg-url/lib/percent-encoding.js");

function p(char) {
  return char.codePointAt(0);
}

const specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

const failure = Symbol("failure");

function countSymbols(str) {
  return [...str].length;
}

function at(input, idx) {
  const c = input[idx];
  return isNaN(c) ? undefined : String.fromCodePoint(c);
}

function isSingleDot(buffer) {
  return buffer === "." || buffer.toLowerCase() === "%2e";
}

function isDoubleDot(buffer) {
  buffer = buffer.toLowerCase();
  return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
}

function isWindowsDriveLetterCodePoints(cp1, cp2) {
  return infra.isASCIIAlpha(cp1) && (cp2 === p(":") || cp2 === p("|"));
}

function isWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
}

function isNormalizedWindowsDriveLetterString(string) {
  return string.length === 2 && infra.isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
}

function containsForbiddenHostCodePoint(string) {
  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1;
}

function containsForbiddenHostCodePointExcludingPercent(string) {
  return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|<|>|\?|@|\[|\\|\]|\^|\|/u) !== -1;
}

function isSpecialScheme(scheme) {
  return specialSchemes[scheme] !== undefined;
}

function isSpecial(url) {
  return isSpecialScheme(url.scheme);
}

function isNotSpecial(url) {
  return !isSpecialScheme(url.scheme);
}

function defaultPort(scheme) {
  return specialSchemes[scheme];
}

function parseIPv4Number(input) {
  if (input === "") {
    return failure;
  }

  let R = 10;

  if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
    input = input.substring(2);
    R = 16;
  } else if (input.length >= 2 && input.charAt(0) === "0") {
    input = input.substring(1);
    R = 8;
  }

  if (input === "") {
    return 0;
  }

  let regex = /[^0-7]/u;
  if (R === 10) {
    regex = /[^0-9]/u;
  }
  if (R === 16) {
    regex = /[^0-9A-Fa-f]/u;
  }

  if (regex.test(input)) {
    return failure;
  }

  return parseInt(input, R);
}

function parseIPv4(input) {
  const parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    if (parts.length > 1) {
      parts.pop();
    }
  }

  if (parts.length > 4) {
    return failure;
  }

  const numbers = [];
  for (const part of parts) {
    const n = parseIPv4Number(part);
    if (n === failure) {
      return failure;
    }

    numbers.push(n);
  }

  for (let i = 0; i < numbers.length - 1; ++i) {
    if (numbers[i] > 255) {
      return failure;
    }
  }
  if (numbers[numbers.length - 1] >= 256 ** (5 - numbers.length)) {
    return failure;
  }

  let ipv4 = numbers.pop();
  let counter = 0;

  for (const n of numbers) {
    ipv4 += n * 256 ** (3 - counter);
    ++counter;
  }

  return ipv4;
}

function serializeIPv4(address) {
  let output = "";
  let n = address;

  for (let i = 1; i <= 4; ++i) {
    output = String(n % 256) + output;
    if (i !== 4) {
      output = `.${output}`;
    }
    n = Math.floor(n / 256);
  }

  return output;
}

function parseIPv6(input) {
  const address = [0, 0, 0, 0, 0, 0, 0, 0];
  let pieceIndex = 0;
  let compress = null;
  let pointer = 0;

  input = Array.from(input, c => c.codePointAt(0));

  if (input[pointer] === p(":")) {
    if (input[pointer + 1] !== p(":")) {
      return failure;
    }

    pointer += 2;
    ++pieceIndex;
    compress = pieceIndex;
  }

  while (pointer < input.length) {
    if (pieceIndex === 8) {
      return failure;
    }

    if (input[pointer] === p(":")) {
      if (compress !== null) {
        return failure;
      }
      ++pointer;
      ++pieceIndex;
      compress = pieceIndex;
      continue;
    }

    let value = 0;
    let length = 0;

    while (length < 4 && infra.isASCIIHex(input[pointer])) {
      value = value * 0x10 + parseInt(at(input, pointer), 16);
      ++pointer;
      ++length;
    }

    if (input[pointer] === p(".")) {
      if (length === 0) {
        return failure;
      }

      pointer -= length;

      if (pieceIndex > 6) {
        return failure;
      }

      let numbersSeen = 0;

      while (input[pointer] !== undefined) {
        let ipv4Piece = null;

        if (numbersSeen > 0) {
          if (input[pointer] === p(".") && numbersSeen < 4) {
            ++pointer;
          } else {
            return failure;
          }
        }

        if (!infra.isASCIIDigit(input[pointer])) {
          return failure;
        }

        while (infra.isASCIIDigit(input[pointer])) {
          const number = parseInt(at(input, pointer));
          if (ipv4Piece === null) {
            ipv4Piece = number;
          } else if (ipv4Piece === 0) {
            return failure;
          } else {
            ipv4Piece = ipv4Piece * 10 + number;
          }
          if (ipv4Piece > 255) {
            return failure;
          }
          ++pointer;
        }

        address[pieceIndex] = address[pieceIndex] * 0x100 + ipv4Piece;

        ++numbersSeen;

        if (numbersSeen === 2 || numbersSeen === 4) {
          ++pieceIndex;
        }
      }

      if (numbersSeen !== 4) {
        return failure;
      }

      break;
    } else if (input[pointer] === p(":")) {
      ++pointer;
      if (input[pointer] === undefined) {
        return failure;
      }
    } else if (input[pointer] !== undefined) {
      return failure;
    }

    address[pieceIndex] = value;
    ++pieceIndex;
  }

  if (compress !== null) {
    let swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex !== 0 && swaps > 0) {
      const temp = address[compress + swaps - 1];
      address[compress + swaps - 1] = address[pieceIndex];
      address[pieceIndex] = temp;
      --pieceIndex;
      --swaps;
    }
  } else if (compress === null && pieceIndex !== 8) {
    return failure;
  }

  return address;
}

function serializeIPv6(address) {
  let output = "";
  const compress = findLongestZeroSequence(address);
  let ignore0 = false;

  for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
    if (ignore0 && address[pieceIndex] === 0) {
      continue;
    } else if (ignore0) {
      ignore0 = false;
    }

    if (compress === pieceIndex) {
      const separator = pieceIndex === 0 ? "::" : ":";
      output += separator;
      ignore0 = true;
      continue;
    }

    output += address[pieceIndex].toString(16);

    if (pieceIndex !== 7) {
      output += ":";
    }
  }

  return output;
}

function parseHost(input, isNotSpecialArg = false) {
  if (input[0] === "[") {
    if (input[input.length - 1] !== "]") {
      return failure;
    }

    return parseIPv6(input.substring(1, input.length - 1));
  }

  if (isNotSpecialArg) {
    return parseOpaqueHost(input);
  }

  const domain = utf8DecodeWithoutBOM(percentDecodeString(input));
  const asciiDomain = domainToASCII(domain);
  if (asciiDomain === failure) {
    return failure;
  }

  if (containsForbiddenHostCodePoint(asciiDomain)) {
    return failure;
  }

  if (endsInANumber(asciiDomain)) {
    return parseIPv4(asciiDomain);
  }

  return asciiDomain;
}

function endsInANumber(input) {
  const parts = input.split(".");
  if (parts[parts.length - 1] === "") {
    if (parts.length === 1) {
      return false;
    }
    parts.pop();
  }

  const last = parts[parts.length - 1];
  if (parseIPv4Number(last) !== failure) {
    return true;
  }

  if (/^[0-9]+$/u.test(last)) {
    return true;
  }

  return false;
}

function parseOpaqueHost(input) {
  if (containsForbiddenHostCodePointExcludingPercent(input)) {
    return failure;
  }

  return utf8PercentEncodeString(input, isC0ControlPercentEncode);
}

function findLongestZeroSequence(arr) {
  let maxIdx = null;
  let maxLen = 1; // only find elements > 1
  let currStart = null;
  let currLen = 0;

  for (let i = 0; i < arr.length; ++i) {
    if (arr[i] !== 0) {
      if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
      }

      currStart = null;
      currLen = 0;
    } else {
      if (currStart === null) {
        currStart = i;
      }
      ++currLen;
    }
  }

  // if trailing zeros
  if (currLen > maxLen) {
    return currStart;
  }

  return maxIdx;
}

function serializeHost(host) {
  if (typeof host === "number") {
    return serializeIPv4(host);
  }

  // IPv6 serializer
  if (host instanceof Array) {
    return `[${serializeIPv6(host)}]`;
  }

  return host;
}

function domainToASCII(domain, beStrict = false) {
  const result = tr46.toASCII(domain, {
    checkBidi: true,
    checkHyphens: false,
    checkJoiners: true,
    useSTD3ASCIIRules: beStrict,
    verifyDNSLength: beStrict
  });
  if (result === null || result === "") {
    return failure;
  }
  return result;
}

function trimControlChars(url) {
  return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/ug, "");
}

function trimTabAndNewline(url) {
  return url.replace(/\u0009|\u000A|\u000D/ug, "");
}

function shortenPath(url) {
  const { path } = url;
  if (path.length === 0) {
    return;
  }
  if (url.scheme === "file" && path.length === 1 && isNormalizedWindowsDriveLetter(path[0])) {
    return;
  }

  path.pop();
}

function includesCredentials(url) {
  return url.username !== "" || url.password !== "";
}

function cannotHaveAUsernamePasswordPort(url) {
  return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
}

function isNormalizedWindowsDriveLetter(string) {
  return /^[A-Za-z]:$/u.test(string);
}

function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
  this.pointer = 0;
  this.input = input;
  this.base = base || null;
  this.encodingOverride = encodingOverride || "utf-8";
  this.stateOverride = stateOverride;
  this.url = url;
  this.failure = false;
  this.parseError = false;

  if (!this.url) {
    this.url = {
      scheme: "",
      username: "",
      password: "",
      host: null,
      port: null,
      path: [],
      query: null,
      fragment: null,

      cannotBeABaseURL: false
    };

    const res = trimControlChars(this.input);
    if (res !== this.input) {
      this.parseError = true;
    }
    this.input = res;
  }

  const res = trimTabAndNewline(this.input);
  if (res !== this.input) {
    this.parseError = true;
  }
  this.input = res;

  this.state = stateOverride || "scheme start";

  this.buffer = "";
  this.atFlag = false;
  this.arrFlag = false;
  this.passwordTokenSeenFlag = false;

  this.input = Array.from(this.input, c => c.codePointAt(0));

  for (; this.pointer <= this.input.length; ++this.pointer) {
    const c = this.input[this.pointer];
    const cStr = isNaN(c) ? undefined : String.fromCodePoint(c);

    // exec state machine
    const ret = this[`parse ${this.state}`](c, cStr);
    if (!ret) {
      break; // terminate algorithm
    } else if (ret === failure) {
      this.failure = true;
      break;
    }
  }
}

URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
  if (infra.isASCIIAlpha(c)) {
    this.buffer += cStr.toLowerCase();
    this.state = "scheme";
  } else if (!this.stateOverride) {
    this.state = "no scheme";
    --this.pointer;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
  if (infra.isASCIIAlphanumeric(c) || c === p("+") || c === p("-") || c === p(".")) {
    this.buffer += cStr.toLowerCase();
  } else if (c === p(":")) {
    if (this.stateOverride) {
      if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
        return false;
      }

      if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
        return false;
      }

      if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
        return false;
      }

      if (this.url.scheme === "file" && this.url.host === "") {
        return false;
      }
    }
    this.url.scheme = this.buffer;
    if (this.stateOverride) {
      if (this.url.port === defaultPort(this.url.scheme)) {
        this.url.port = null;
      }
      return false;
    }
    this.buffer = "";
    if (this.url.scheme === "file") {
      if (this.input[this.pointer + 1] !== p("/") || this.input[this.pointer + 2] !== p("/")) {
        this.parseError = true;
      }
      this.state = "file";
    } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
      this.state = "special relative or authority";
    } else if (isSpecial(this.url)) {
      this.state = "special authority slashes";
    } else if (this.input[this.pointer + 1] === p("/")) {
      this.state = "path or authority";
      ++this.pointer;
    } else {
      this.url.cannotBeABaseURL = true;
      this.url.path.push("");
      this.state = "cannot-be-a-base-URL path";
    }
  } else if (!this.stateOverride) {
    this.buffer = "";
    this.state = "no scheme";
    this.pointer = -1;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
  if (this.base === null || (this.base.cannotBeABaseURL && c !== p("#"))) {
    return failure;
  } else if (this.base.cannotBeABaseURL && c === p("#")) {
    this.url.scheme = this.base.scheme;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    this.url.fragment = "";
    this.url.cannotBeABaseURL = true;
    this.state = "fragment";
  } else if (this.base.scheme === "file") {
    this.state = "file";
    --this.pointer;
  } else {
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
  if (c === p("/") && this.input[this.pointer + 1] === p("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.parseError = true;
    this.state = "relative";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
  if (c === p("/")) {
    this.state = "authority";
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
  this.url.scheme = this.base.scheme;
  if (c === p("/")) {
    this.state = "relative slash";
  } else if (isSpecial(this.url) && c === p("\\")) {
    this.parseError = true;
    this.state = "relative slash";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      this.url.path.pop();
      this.state = "path";
      --this.pointer;
    }
  }

  return true;
};

URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
  if (isSpecial(this.url) && (c === p("/") || c === p("\\"))) {
    if (c === p("\\")) {
      this.parseError = true;
    }
    this.state = "special authority ignore slashes";
  } else if (c === p("/")) {
    this.state = "authority";
  } else {
    this.url.username = this.base.username;
    this.url.password = this.base.password;
    this.url.host = this.base.host;
    this.url.port = this.base.port;
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
  if (c === p("/") && this.input[this.pointer + 1] === p("/")) {
    this.state = "special authority ignore slashes";
    ++this.pointer;
  } else {
    this.parseError = true;
    this.state = "special authority ignore slashes";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
  if (c !== p("/") && c !== p("\\")) {
    this.state = "authority";
    --this.pointer;
  } else {
    this.parseError = true;
  }

  return true;
};

URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
  if (c === p("@")) {
    this.parseError = true;
    if (this.atFlag) {
      this.buffer = `%40${this.buffer}`;
    }
    this.atFlag = true;

    // careful, this is based on buffer and has its own pointer (this.pointer != pointer) and inner chars
    const len = countSymbols(this.buffer);
    for (let pointer = 0; pointer < len; ++pointer) {
      const codePoint = this.buffer.codePointAt(pointer);

      if (codePoint === p(":") && !this.passwordTokenSeenFlag) {
        this.passwordTokenSeenFlag = true;
        continue;
      }
      const encodedCodePoints = utf8PercentEncodeCodePoint(codePoint, isUserinfoPercentEncode);
      if (this.passwordTokenSeenFlag) {
        this.url.password += encodedCodePoints;
      } else {
        this.url.username += encodedCodePoints;
      }
    }
    this.buffer = "";
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\"))) {
    if (this.atFlag && this.buffer === "") {
      this.parseError = true;
      return failure;
    }
    this.pointer -= countSymbols(this.buffer) + 1;
    this.buffer = "";
    this.state = "host";
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse hostname"] =
URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
  if (this.stateOverride && this.url.scheme === "file") {
    --this.pointer;
    this.state = "file host";
  } else if (c === p(":") && !this.arrFlag) {
    if (this.buffer === "") {
      this.parseError = true;
      return failure;
    }

    if (this.stateOverride === "hostname") {
      return false;
    }

    const host = parseHost(this.buffer, isNotSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "port";
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\"))) {
    --this.pointer;
    if (isSpecial(this.url) && this.buffer === "") {
      this.parseError = true;
      return failure;
    } else if (this.stateOverride && this.buffer === "" &&
               (includesCredentials(this.url) || this.url.port !== null)) {
      this.parseError = true;
      return false;
    }

    const host = parseHost(this.buffer, isNotSpecial(this.url));
    if (host === failure) {
      return failure;
    }

    this.url.host = host;
    this.buffer = "";
    this.state = "path start";
    if (this.stateOverride) {
      return false;
    }
  } else {
    if (c === p("[")) {
      this.arrFlag = true;
    } else if (c === p("]")) {
      this.arrFlag = false;
    }
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
  if (infra.isASCIIDigit(c)) {
    this.buffer += cStr;
  } else if (isNaN(c) || c === p("/") || c === p("?") || c === p("#") ||
             (isSpecial(this.url) && c === p("\\")) ||
             this.stateOverride) {
    if (this.buffer !== "") {
      const port = parseInt(this.buffer);
      if (port > 2 ** 16 - 1) {
        this.parseError = true;
        return failure;
      }
      this.url.port = port === defaultPort(this.url.scheme) ? null : port;
      this.buffer = "";
    }
    if (this.stateOverride) {
      return false;
    }
    this.state = "path start";
    --this.pointer;
  } else {
    this.parseError = true;
    return failure;
  }

  return true;
};

const fileOtherwiseCodePoints = new Set([p("/"), p("\\"), p("?"), p("#")]);

function startsWithWindowsDriveLetter(input, pointer) {
  const length = input.length - pointer;
  return length >= 2 &&
    isWindowsDriveLetterCodePoints(input[pointer], input[pointer + 1]) &&
    (length === 2 || fileOtherwiseCodePoints.has(input[pointer + 2]));
}

URLStateMachine.prototype["parse file"] = function parseFile(c) {
  this.url.scheme = "file";
  this.url.host = "";

  if (c === p("/") || c === p("\\")) {
    if (c === p("\\")) {
      this.parseError = true;
    }
    this.state = "file slash";
  } else if (this.base !== null && this.base.scheme === "file") {
    this.url.host = this.base.host;
    this.url.path = this.base.path.slice();
    this.url.query = this.base.query;
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    } else if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    } else if (!isNaN(c)) {
      this.url.query = null;
      if (!startsWithWindowsDriveLetter(this.input, this.pointer)) {
        shortenPath(this.url);
      } else {
        this.parseError = true;
        this.url.path = [];
      }

      this.state = "path";
      --this.pointer;
    }
  } else {
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
  if (c === p("/") || c === p("\\")) {
    if (c === p("\\")) {
      this.parseError = true;
    }
    this.state = "file host";
  } else {
    if (this.base !== null && this.base.scheme === "file") {
      if (!startsWithWindowsDriveLetter(this.input, this.pointer) &&
          isNormalizedWindowsDriveLetterString(this.base.path[0])) {
        this.url.path.push(this.base.path[0]);
      }
      this.url.host = this.base.host;
    }
    this.state = "path";
    --this.pointer;
  }

  return true;
};

URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
  if (isNaN(c) || c === p("/") || c === p("\\") || c === p("?") || c === p("#")) {
    --this.pointer;
    if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
      this.parseError = true;
      this.state = "path";
    } else if (this.buffer === "") {
      this.url.host = "";
      if (this.stateOverride) {
        return false;
      }
      this.state = "path start";
    } else {
      let host = parseHost(this.buffer, isNotSpecial(this.url));
      if (host === failure) {
        return failure;
      }
      if (host === "localhost") {
        host = "";
      }
      this.url.host = host;

      if (this.stateOverride) {
        return false;
      }

      this.buffer = "";
      this.state = "path start";
    }
  } else {
    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
  if (isSpecial(this.url)) {
    if (c === p("\\")) {
      this.parseError = true;
    }
    this.state = "path";

    if (c !== p("/") && c !== p("\\")) {
      --this.pointer;
    }
  } else if (!this.stateOverride && c === p("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (!this.stateOverride && c === p("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else if (c !== undefined) {
    this.state = "path";
    if (c !== p("/")) {
      --this.pointer;
    }
  } else if (this.stateOverride && this.url.host === null) {
    this.url.path.push("");
  }

  return true;
};

URLStateMachine.prototype["parse path"] = function parsePath(c) {
  if (isNaN(c) || c === p("/") || (isSpecial(this.url) && c === p("\\")) ||
      (!this.stateOverride && (c === p("?") || c === p("#")))) {
    if (isSpecial(this.url) && c === p("\\")) {
      this.parseError = true;
    }

    if (isDoubleDot(this.buffer)) {
      shortenPath(this.url);
      if (c !== p("/") && !(isSpecial(this.url) && c === p("\\"))) {
        this.url.path.push("");
      }
    } else if (isSingleDot(this.buffer) && c !== p("/") &&
               !(isSpecial(this.url) && c === p("\\"))) {
      this.url.path.push("");
    } else if (!isSingleDot(this.buffer)) {
      if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
        this.buffer = `${this.buffer[0]}:`;
      }
      this.url.path.push(this.buffer);
    }
    this.buffer = "";
    if (c === p("?")) {
      this.url.query = "";
      this.state = "query";
    }
    if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else {
    // TODO: If c is not a URL code point and not "%", parse error.

    if (c === p("%") &&
      (!infra.isASCIIHex(this.input[this.pointer + 1]) ||
        !infra.isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.buffer += utf8PercentEncodeCodePoint(c, isPathPercentEncode);
  }

  return true;
};

URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
  if (c === p("?")) {
    this.url.query = "";
    this.state = "query";
  } else if (c === p("#")) {
    this.url.fragment = "";
    this.state = "fragment";
  } else {
    // TODO: Add: not a URL code point
    if (!isNaN(c) && c !== p("%")) {
      this.parseError = true;
    }

    if (c === p("%") &&
        (!infra.isASCIIHex(this.input[this.pointer + 1]) ||
         !infra.isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    if (!isNaN(c)) {
      this.url.path[0] += utf8PercentEncodeCodePoint(c, isC0ControlPercentEncode);
    }
  }

  return true;
};

URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
  if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
    this.encodingOverride = "utf-8";
  }

  if ((!this.stateOverride && c === p("#")) || isNaN(c)) {
    const queryPercentEncodePredicate = isSpecial(this.url) ? isSpecialQueryPercentEncode : isQueryPercentEncode;
    this.url.query += utf8PercentEncodeString(this.buffer, queryPercentEncodePredicate);

    this.buffer = "";

    if (c === p("#")) {
      this.url.fragment = "";
      this.state = "fragment";
    }
  } else if (!isNaN(c)) {
    // TODO: If c is not a URL code point and not "%", parse error.

    if (c === p("%") &&
      (!infra.isASCIIHex(this.input[this.pointer + 1]) ||
        !infra.isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.buffer += cStr;
  }

  return true;
};

URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
  if (!isNaN(c)) {
    // TODO: If c is not a URL code point and not "%", parse error.
    if (c === p("%") &&
      (!infra.isASCIIHex(this.input[this.pointer + 1]) ||
        !infra.isASCIIHex(this.input[this.pointer + 2]))) {
      this.parseError = true;
    }

    this.url.fragment += utf8PercentEncodeCodePoint(c, isFragmentPercentEncode);
  }

  return true;
};

function serializeURL(url, excludeFragment) {
  let output = `${url.scheme}:`;
  if (url.host !== null) {
    output += "//";

    if (url.username !== "" || url.password !== "") {
      output += url.username;
      if (url.password !== "") {
        output += `:${url.password}`;
      }
      output += "@";
    }

    output += serializeHost(url.host);

    if (url.port !== null) {
      output += `:${url.port}`;
    }
  }

  if (url.cannotBeABaseURL) {
    output += url.path[0];
  } else {
    if (url.host === null && url.path.length > 1 && url.path[0] === "") {
      output += "/.";
    }
    for (const segment of url.path) {
      output += `/${segment}`;
    }
  }

  if (url.query !== null) {
    output += `?${url.query}`;
  }

  if (!excludeFragment && url.fragment !== null) {
    output += `#${url.fragment}`;
  }

  return output;
}

function serializeOrigin(tuple) {
  let result = `${tuple.scheme}://`;
  result += serializeHost(tuple.host);

  if (tuple.port !== null) {
    result += `:${tuple.port}`;
  }

  return result;
}

module.exports.serializeURL = serializeURL;

module.exports.serializeURLOrigin = function (url) {
  // https://url.spec.whatwg.org/#concept-url-origin
  switch (url.scheme) {
    case "blob":
      try {
        return module.exports.serializeURLOrigin(module.exports.parseURL(url.path[0]));
      } catch (e) {
        // serializing an opaque origin returns "null"
        return "null";
      }
    case "ftp":
    case "http":
    case "https":
    case "ws":
    case "wss":
      return serializeOrigin({
        scheme: url.scheme,
        host: url.host,
        port: url.port
      });
    case "file":
      // The spec says:
      // > Unfortunate as it is, this is left as an exercise to the reader. When in doubt, return a new opaque origin.
      // Browsers tested so far:
      // - Chrome says "file://", but treats file: URLs as cross-origin for most (all?) purposes; see e.g.
      //   https://bugs.chromium.org/p/chromium/issues/detail?id=37586
      // - Firefox says "null", but treats file: URLs as same-origin sometimes based on directory stuff; see
      //   https://developer.mozilla.org/en-US/docs/Archive/Misc_top_level/Same-origin_policy_for_file:_URIs
      return "null";
    default:
      // serializing an opaque origin returns "null"
      return "null";
  }
};

module.exports.basicURLParse = function (input, options) {
  if (options === undefined) {
    options = {};
  }

  const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
  if (usm.failure) {
    return null;
  }

  return usm.url;
};

module.exports.setTheUsername = function (url, username) {
  url.username = utf8PercentEncodeString(username, isUserinfoPercentEncode);
};

module.exports.setThePassword = function (url, password) {
  url.password = utf8PercentEncodeString(password, isUserinfoPercentEncode);
};

module.exports.serializeHost = serializeHost;

module.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;

module.exports.serializeInteger = function (integer) {
  return String(integer);
};

module.exports.parseURL = function (input, options) {
  if (options === undefined) {
    options = {};
  }

  // We don't handle blobs, so this just delegates:
  return module.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/urlencoded.js":
/*!***************************************************!*\
  !*** ./node_modules/whatwg-url/lib/urlencoded.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { utf8Encode, utf8DecodeWithoutBOM } = __webpack_require__(/*! ./encoding */ "./node_modules/whatwg-url/lib/encoding.js");
const { percentDecodeBytes, utf8PercentEncodeString, isURLEncodedPercentEncode } = __webpack_require__(/*! ./percent-encoding */ "./node_modules/whatwg-url/lib/percent-encoding.js");

function p(char) {
  return char.codePointAt(0);
}

// https://url.spec.whatwg.org/#concept-urlencoded-parser
function parseUrlencoded(input) {
  const sequences = strictlySplitByteSequence(input, p("&"));
  const output = [];
  for (const bytes of sequences) {
    if (bytes.length === 0) {
      continue;
    }

    let name, value;
    const indexOfEqual = bytes.indexOf(p("="));

    if (indexOfEqual >= 0) {
      name = bytes.slice(0, indexOfEqual);
      value = bytes.slice(indexOfEqual + 1);
    } else {
      name = bytes;
      value = new Uint8Array(0);
    }

    name = replaceByteInByteSequence(name, 0x2B, 0x20);
    value = replaceByteInByteSequence(value, 0x2B, 0x20);

    const nameString = utf8DecodeWithoutBOM(percentDecodeBytes(name));
    const valueString = utf8DecodeWithoutBOM(percentDecodeBytes(value));

    output.push([nameString, valueString]);
  }
  return output;
}

// https://url.spec.whatwg.org/#concept-urlencoded-string-parser
function parseUrlencodedString(input) {
  return parseUrlencoded(utf8Encode(input));
}

// https://url.spec.whatwg.org/#concept-urlencoded-serializer
function serializeUrlencoded(tuples, encodingOverride = undefined) {
  let encoding = "utf-8";
  if (encodingOverride !== undefined) {
    // TODO "get the output encoding", i.e. handle encoding labels vs. names.
    encoding = encodingOverride;
  }

  let output = "";
  for (const [i, tuple] of tuples.entries()) {
    // TODO: handle encoding override

    const name = utf8PercentEncodeString(tuple[0], isURLEncodedPercentEncode, true);

    let value = tuple[1];
    if (tuple.length > 2 && tuple[2] !== undefined) {
      if (tuple[2] === "hidden" && name === "_charset_") {
        value = encoding;
      } else if (tuple[2] === "file") {
        // value is a File object
        value = value.name;
      }
    }

    value = utf8PercentEncodeString(value, isURLEncodedPercentEncode, true);

    if (i !== 0) {
      output += "&";
    }
    output += `${name}=${value}`;
  }
  return output;
}

function strictlySplitByteSequence(buf, cp) {
  const list = [];
  let last = 0;
  let i = buf.indexOf(cp);
  while (i >= 0) {
    list.push(buf.slice(last, i));
    last = i + 1;
    i = buf.indexOf(cp, last);
  }
  if (last !== buf.length) {
    list.push(buf.slice(last));
  }
  return list;
}

function replaceByteInByteSequence(buf, from, to) {
  let i = buf.indexOf(from);
  while (i >= 0) {
    buf[i] = to;
    i = buf.indexOf(from, i + 1);
  }
  return buf;
}

module.exports = {
  parseUrlencodedString,
  serializeUrlencoded
};


/***/ }),

/***/ "./node_modules/whatwg-url/lib/utils.js":
/*!**********************************************!*\
  !*** ./node_modules/whatwg-url/lib/utils.js ***!
  \**********************************************/
/***/ ((module, exports) => {

"use strict";


// Returns "Type(value) is Object" in ES terminology.
function isObject(value) {
  return (typeof value === "object" && value !== null) || typeof value === "function";
}

const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);

// Like `Object.assign`, but using `[[GetOwnProperty]]` and `[[DefineOwnProperty]]`
// instead of `[[Get]]` and `[[Set]]` and only allowing objects
function define(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = Reflect.getOwnPropertyDescriptor(source, key);
    if (descriptor && !Reflect.defineProperty(target, key, descriptor)) {
      throw new TypeError(`Cannot redefine property: ${String(key)}`);
    }
  }
}

function newObjectInRealm(globalObject, object) {
  const ctorRegistry = initCtorRegistry(globalObject);
  return Object.defineProperties(
    Object.create(ctorRegistry["%Object.prototype%"]),
    Object.getOwnPropertyDescriptors(object)
  );
}

const wrapperSymbol = Symbol("wrapper");
const implSymbol = Symbol("impl");
const sameObjectCaches = Symbol("SameObject caches");
const ctorRegistrySymbol = Symbol.for("[webidl2js] constructor registry");

const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {}).prototype);

function initCtorRegistry(globalObject) {
  if (hasOwn(globalObject, ctorRegistrySymbol)) {
    return globalObject[ctorRegistrySymbol];
  }

  const ctorRegistry = Object.create(null);

  // In addition to registering all the WebIDL2JS-generated types in the constructor registry,
  // we also register a few intrinsics that we make use of in generated code, since they are not
  // easy to grab from the globalObject variable.
  ctorRegistry["%Object.prototype%"] = globalObject.Object.prototype;
  ctorRegistry["%IteratorPrototype%"] = Object.getPrototypeOf(
    Object.getPrototypeOf(new globalObject.Array()[Symbol.iterator]())
  );

  try {
    ctorRegistry["%AsyncIteratorPrototype%"] = Object.getPrototypeOf(
      Object.getPrototypeOf(
        globalObject.eval("(async function* () {})").prototype
      )
    );
  } catch {
    ctorRegistry["%AsyncIteratorPrototype%"] = AsyncIteratorPrototype;
  }

  globalObject[ctorRegistrySymbol] = ctorRegistry;
  return ctorRegistry;
}

function getSameObject(wrapper, prop, creator) {
  if (!wrapper[sameObjectCaches]) {
    wrapper[sameObjectCaches] = Object.create(null);
  }

  if (prop in wrapper[sameObjectCaches]) {
    return wrapper[sameObjectCaches][prop];
  }

  wrapper[sameObjectCaches][prop] = creator();
  return wrapper[sameObjectCaches][prop];
}

function wrapperForImpl(impl) {
  return impl ? impl[wrapperSymbol] : null;
}

function implForWrapper(wrapper) {
  return wrapper ? wrapper[implSymbol] : null;
}

function tryWrapperForImpl(impl) {
  const wrapper = wrapperForImpl(impl);
  return wrapper ? wrapper : impl;
}

function tryImplForWrapper(wrapper) {
  const impl = implForWrapper(wrapper);
  return impl ? impl : wrapper;
}

const iterInternalSymbol = Symbol("internal");

function isArrayIndexPropName(P) {
  if (typeof P !== "string") {
    return false;
  }
  const i = P >>> 0;
  if (i === 2 ** 32 - 1) {
    return false;
  }
  const s = `${i}`;
  if (P !== s) {
    return false;
  }
  return true;
}

const byteLengthGetter =
    Object.getOwnPropertyDescriptor(ArrayBuffer.prototype, "byteLength").get;
function isArrayBuffer(value) {
  try {
    byteLengthGetter.call(value);
    return true;
  } catch (e) {
    return false;
  }
}

function iteratorResult([key, value], kind) {
  let result;
  switch (kind) {
    case "key":
      result = key;
      break;
    case "value":
      result = value;
      break;
    case "key+value":
      result = [key, value];
      break;
  }
  return { value: result, done: false };
}

const supportsPropertyIndex = Symbol("supports property index");
const supportedPropertyIndices = Symbol("supported property indices");
const supportsPropertyName = Symbol("supports property name");
const supportedPropertyNames = Symbol("supported property names");
const indexedGet = Symbol("indexed property get");
const indexedSetNew = Symbol("indexed property set new");
const indexedSetExisting = Symbol("indexed property set existing");
const namedGet = Symbol("named property get");
const namedSetNew = Symbol("named property set new");
const namedSetExisting = Symbol("named property set existing");
const namedDelete = Symbol("named property delete");

const asyncIteratorNext = Symbol("async iterator get the next iteration result");
const asyncIteratorReturn = Symbol("async iterator return steps");
const asyncIteratorInit = Symbol("async iterator initialization steps");
const asyncIteratorEOI = Symbol("async iterator end of iteration");

module.exports = exports = {
  isObject,
  hasOwn,
  define,
  newObjectInRealm,
  wrapperSymbol,
  implSymbol,
  getSameObject,
  ctorRegistrySymbol,
  initCtorRegistry,
  wrapperForImpl,
  implForWrapper,
  tryWrapperForImpl,
  tryImplForWrapper,
  iterInternalSymbol,
  isArrayBuffer,
  isArrayIndexPropName,
  supportsPropertyIndex,
  supportedPropertyIndices,
  supportsPropertyName,
  supportedPropertyNames,
  indexedGet,
  indexedSetNew,
  indexedSetExisting,
  namedGet,
  namedSetNew,
  namedSetExisting,
  namedDelete,
  asyncIteratorNext,
  asyncIteratorReturn,
  asyncIteratorInit,
  asyncIteratorEOI,
  iteratorResult
};


/***/ }),

/***/ "./node_modules/whatwg-url/webidl2js-wrapper.js":
/*!******************************************************!*\
  !*** ./node_modules/whatwg-url/webidl2js-wrapper.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


const URL = __webpack_require__(/*! ./lib/URL */ "./node_modules/whatwg-url/lib/URL.js");
const URLSearchParams = __webpack_require__(/*! ./lib/URLSearchParams */ "./node_modules/whatwg-url/lib/URLSearchParams.js");

exports.URL = URL;
exports.URLSearchParams = URLSearchParams;


/***/ }),

/***/ "./node_modules/tr46/lib/mappingTable.json":
/*!*************************************************!*\
  !*** ./node_modules/tr46/lib/mappingTable.json ***!
  \*************************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('[[[0,44],4],[[45,46],2],[47,4],[[48,57],2],[[58,64],4],[65,1,"a"],[66,1,"b"],[67,1,"c"],[68,1,"d"],[69,1,"e"],[70,1,"f"],[71,1,"g"],[72,1,"h"],[73,1,"i"],[74,1,"j"],[75,1,"k"],[76,1,"l"],[77,1,"m"],[78,1,"n"],[79,1,"o"],[80,1,"p"],[81,1,"q"],[82,1,"r"],[83,1,"s"],[84,1,"t"],[85,1,"u"],[86,1,"v"],[87,1,"w"],[88,1,"x"],[89,1,"y"],[90,1,"z"],[[91,96],4],[[97,122],2],[[123,127],4],[[128,159],3],[160,5," "],[[161,167],2],[168,5," ̈"],[169,2],[170,1,"a"],[[171,172],2],[173,7],[174,2],[175,5," ̄"],[[176,177],2],[178,1,"2"],[179,1,"3"],[180,5," ́"],[181,1,"μ"],[182,2],[183,2],[184,5," ̧"],[185,1,"1"],[186,1,"o"],[187,2],[188,1,"1⁄4"],[189,1,"1⁄2"],[190,1,"3⁄4"],[191,2],[192,1,"à"],[193,1,"á"],[194,1,"â"],[195,1,"ã"],[196,1,"ä"],[197,1,"å"],[198,1,"æ"],[199,1,"ç"],[200,1,"è"],[201,1,"é"],[202,1,"ê"],[203,1,"ë"],[204,1,"ì"],[205,1,"í"],[206,1,"î"],[207,1,"ï"],[208,1,"ð"],[209,1,"ñ"],[210,1,"ò"],[211,1,"ó"],[212,1,"ô"],[213,1,"õ"],[214,1,"ö"],[215,2],[216,1,"ø"],[217,1,"ù"],[218,1,"ú"],[219,1,"û"],[220,1,"ü"],[221,1,"ý"],[222,1,"þ"],[223,6,"ss"],[[224,246],2],[247,2],[[248,255],2],[256,1,"ā"],[257,2],[258,1,"ă"],[259,2],[260,1,"ą"],[261,2],[262,1,"ć"],[263,2],[264,1,"ĉ"],[265,2],[266,1,"ċ"],[267,2],[268,1,"č"],[269,2],[270,1,"ď"],[271,2],[272,1,"đ"],[273,2],[274,1,"ē"],[275,2],[276,1,"ĕ"],[277,2],[278,1,"ė"],[279,2],[280,1,"ę"],[281,2],[282,1,"ě"],[283,2],[284,1,"ĝ"],[285,2],[286,1,"ğ"],[287,2],[288,1,"ġ"],[289,2],[290,1,"ģ"],[291,2],[292,1,"ĥ"],[293,2],[294,1,"ħ"],[295,2],[296,1,"ĩ"],[297,2],[298,1,"ī"],[299,2],[300,1,"ĭ"],[301,2],[302,1,"į"],[303,2],[304,1,"i̇"],[305,2],[[306,307],1,"ij"],[308,1,"ĵ"],[309,2],[310,1,"ķ"],[[311,312],2],[313,1,"ĺ"],[314,2],[315,1,"ļ"],[316,2],[317,1,"ľ"],[318,2],[[319,320],1,"l·"],[321,1,"ł"],[322,2],[323,1,"ń"],[324,2],[325,1,"ņ"],[326,2],[327,1,"ň"],[328,2],[329,1,"ʼn"],[330,1,"ŋ"],[331,2],[332,1,"ō"],[333,2],[334,1,"ŏ"],[335,2],[336,1,"ő"],[337,2],[338,1,"œ"],[339,2],[340,1,"ŕ"],[341,2],[342,1,"ŗ"],[343,2],[344,1,"ř"],[345,2],[346,1,"ś"],[347,2],[348,1,"ŝ"],[349,2],[350,1,"ş"],[351,2],[352,1,"š"],[353,2],[354,1,"ţ"],[355,2],[356,1,"ť"],[357,2],[358,1,"ŧ"],[359,2],[360,1,"ũ"],[361,2],[362,1,"ū"],[363,2],[364,1,"ŭ"],[365,2],[366,1,"ů"],[367,2],[368,1,"ű"],[369,2],[370,1,"ų"],[371,2],[372,1,"ŵ"],[373,2],[374,1,"ŷ"],[375,2],[376,1,"ÿ"],[377,1,"ź"],[378,2],[379,1,"ż"],[380,2],[381,1,"ž"],[382,2],[383,1,"s"],[384,2],[385,1,"ɓ"],[386,1,"ƃ"],[387,2],[388,1,"ƅ"],[389,2],[390,1,"ɔ"],[391,1,"ƈ"],[392,2],[393,1,"ɖ"],[394,1,"ɗ"],[395,1,"ƌ"],[[396,397],2],[398,1,"ǝ"],[399,1,"ə"],[400,1,"ɛ"],[401,1,"ƒ"],[402,2],[403,1,"ɠ"],[404,1,"ɣ"],[405,2],[406,1,"ɩ"],[407,1,"ɨ"],[408,1,"ƙ"],[[409,411],2],[412,1,"ɯ"],[413,1,"ɲ"],[414,2],[415,1,"ɵ"],[416,1,"ơ"],[417,2],[418,1,"ƣ"],[419,2],[420,1,"ƥ"],[421,2],[422,1,"ʀ"],[423,1,"ƨ"],[424,2],[425,1,"ʃ"],[[426,427],2],[428,1,"ƭ"],[429,2],[430,1,"ʈ"],[431,1,"ư"],[432,2],[433,1,"ʊ"],[434,1,"ʋ"],[435,1,"ƴ"],[436,2],[437,1,"ƶ"],[438,2],[439,1,"ʒ"],[440,1,"ƹ"],[[441,443],2],[444,1,"ƽ"],[[445,451],2],[[452,454],1,"dž"],[[455,457],1,"lj"],[[458,460],1,"nj"],[461,1,"ǎ"],[462,2],[463,1,"ǐ"],[464,2],[465,1,"ǒ"],[466,2],[467,1,"ǔ"],[468,2],[469,1,"ǖ"],[470,2],[471,1,"ǘ"],[472,2],[473,1,"ǚ"],[474,2],[475,1,"ǜ"],[[476,477],2],[478,1,"ǟ"],[479,2],[480,1,"ǡ"],[481,2],[482,1,"ǣ"],[483,2],[484,1,"ǥ"],[485,2],[486,1,"ǧ"],[487,2],[488,1,"ǩ"],[489,2],[490,1,"ǫ"],[491,2],[492,1,"ǭ"],[493,2],[494,1,"ǯ"],[[495,496],2],[[497,499],1,"dz"],[500,1,"ǵ"],[501,2],[502,1,"ƕ"],[503,1,"ƿ"],[504,1,"ǹ"],[505,2],[506,1,"ǻ"],[507,2],[508,1,"ǽ"],[509,2],[510,1,"ǿ"],[511,2],[512,1,"ȁ"],[513,2],[514,1,"ȃ"],[515,2],[516,1,"ȅ"],[517,2],[518,1,"ȇ"],[519,2],[520,1,"ȉ"],[521,2],[522,1,"ȋ"],[523,2],[524,1,"ȍ"],[525,2],[526,1,"ȏ"],[527,2],[528,1,"ȑ"],[529,2],[530,1,"ȓ"],[531,2],[532,1,"ȕ"],[533,2],[534,1,"ȗ"],[535,2],[536,1,"ș"],[537,2],[538,1,"ț"],[539,2],[540,1,"ȝ"],[541,2],[542,1,"ȟ"],[543,2],[544,1,"ƞ"],[545,2],[546,1,"ȣ"],[547,2],[548,1,"ȥ"],[549,2],[550,1,"ȧ"],[551,2],[552,1,"ȩ"],[553,2],[554,1,"ȫ"],[555,2],[556,1,"ȭ"],[557,2],[558,1,"ȯ"],[559,2],[560,1,"ȱ"],[561,2],[562,1,"ȳ"],[563,2],[[564,566],2],[[567,569],2],[570,1,"ⱥ"],[571,1,"ȼ"],[572,2],[573,1,"ƚ"],[574,1,"ⱦ"],[[575,576],2],[577,1,"ɂ"],[578,2],[579,1,"ƀ"],[580,1,"ʉ"],[581,1,"ʌ"],[582,1,"ɇ"],[583,2],[584,1,"ɉ"],[585,2],[586,1,"ɋ"],[587,2],[588,1,"ɍ"],[589,2],[590,1,"ɏ"],[591,2],[[592,680],2],[[681,685],2],[[686,687],2],[688,1,"h"],[689,1,"ɦ"],[690,1,"j"],[691,1,"r"],[692,1,"ɹ"],[693,1,"ɻ"],[694,1,"ʁ"],[695,1,"w"],[696,1,"y"],[[697,705],2],[[706,709],2],[[710,721],2],[[722,727],2],[728,5," ̆"],[729,5," ̇"],[730,5," ̊"],[731,5," ̨"],[732,5," ̃"],[733,5," ̋"],[734,2],[735,2],[736,1,"ɣ"],[737,1,"l"],[738,1,"s"],[739,1,"x"],[740,1,"ʕ"],[[741,745],2],[[746,747],2],[748,2],[749,2],[750,2],[[751,767],2],[[768,831],2],[832,1,"̀"],[833,1,"́"],[834,2],[835,1,"̓"],[836,1,"̈́"],[837,1,"ι"],[[838,846],2],[847,7],[[848,855],2],[[856,860],2],[[861,863],2],[[864,865],2],[866,2],[[867,879],2],[880,1,"ͱ"],[881,2],[882,1,"ͳ"],[883,2],[884,1,"ʹ"],[885,2],[886,1,"ͷ"],[887,2],[[888,889],3],[890,5," ι"],[[891,893],2],[894,5,";"],[895,1,"ϳ"],[[896,899],3],[900,5," ́"],[901,5," ̈́"],[902,1,"ά"],[903,1,"·"],[904,1,"έ"],[905,1,"ή"],[906,1,"ί"],[907,3],[908,1,"ό"],[909,3],[910,1,"ύ"],[911,1,"ώ"],[912,2],[913,1,"α"],[914,1,"β"],[915,1,"γ"],[916,1,"δ"],[917,1,"ε"],[918,1,"ζ"],[919,1,"η"],[920,1,"θ"],[921,1,"ι"],[922,1,"κ"],[923,1,"λ"],[924,1,"μ"],[925,1,"ν"],[926,1,"ξ"],[927,1,"ο"],[928,1,"π"],[929,1,"ρ"],[930,3],[931,1,"σ"],[932,1,"τ"],[933,1,"υ"],[934,1,"φ"],[935,1,"χ"],[936,1,"ψ"],[937,1,"ω"],[938,1,"ϊ"],[939,1,"ϋ"],[[940,961],2],[962,6,"σ"],[[963,974],2],[975,1,"ϗ"],[976,1,"β"],[977,1,"θ"],[978,1,"υ"],[979,1,"ύ"],[980,1,"ϋ"],[981,1,"φ"],[982,1,"π"],[983,2],[984,1,"ϙ"],[985,2],[986,1,"ϛ"],[987,2],[988,1,"ϝ"],[989,2],[990,1,"ϟ"],[991,2],[992,1,"ϡ"],[993,2],[994,1,"ϣ"],[995,2],[996,1,"ϥ"],[997,2],[998,1,"ϧ"],[999,2],[1000,1,"ϩ"],[1001,2],[1002,1,"ϫ"],[1003,2],[1004,1,"ϭ"],[1005,2],[1006,1,"ϯ"],[1007,2],[1008,1,"κ"],[1009,1,"ρ"],[1010,1,"σ"],[1011,2],[1012,1,"θ"],[1013,1,"ε"],[1014,2],[1015,1,"ϸ"],[1016,2],[1017,1,"σ"],[1018,1,"ϻ"],[1019,2],[1020,2],[1021,1,"ͻ"],[1022,1,"ͼ"],[1023,1,"ͽ"],[1024,1,"ѐ"],[1025,1,"ё"],[1026,1,"ђ"],[1027,1,"ѓ"],[1028,1,"є"],[1029,1,"ѕ"],[1030,1,"і"],[1031,1,"ї"],[1032,1,"ј"],[1033,1,"љ"],[1034,1,"њ"],[1035,1,"ћ"],[1036,1,"ќ"],[1037,1,"ѝ"],[1038,1,"ў"],[1039,1,"џ"],[1040,1,"а"],[1041,1,"б"],[1042,1,"в"],[1043,1,"г"],[1044,1,"д"],[1045,1,"е"],[1046,1,"ж"],[1047,1,"з"],[1048,1,"и"],[1049,1,"й"],[1050,1,"к"],[1051,1,"л"],[1052,1,"м"],[1053,1,"н"],[1054,1,"о"],[1055,1,"п"],[1056,1,"р"],[1057,1,"с"],[1058,1,"т"],[1059,1,"у"],[1060,1,"ф"],[1061,1,"х"],[1062,1,"ц"],[1063,1,"ч"],[1064,1,"ш"],[1065,1,"щ"],[1066,1,"ъ"],[1067,1,"ы"],[1068,1,"ь"],[1069,1,"э"],[1070,1,"ю"],[1071,1,"я"],[[1072,1103],2],[1104,2],[[1105,1116],2],[1117,2],[[1118,1119],2],[1120,1,"ѡ"],[1121,2],[1122,1,"ѣ"],[1123,2],[1124,1,"ѥ"],[1125,2],[1126,1,"ѧ"],[1127,2],[1128,1,"ѩ"],[1129,2],[1130,1,"ѫ"],[1131,2],[1132,1,"ѭ"],[1133,2],[1134,1,"ѯ"],[1135,2],[1136,1,"ѱ"],[1137,2],[1138,1,"ѳ"],[1139,2],[1140,1,"ѵ"],[1141,2],[1142,1,"ѷ"],[1143,2],[1144,1,"ѹ"],[1145,2],[1146,1,"ѻ"],[1147,2],[1148,1,"ѽ"],[1149,2],[1150,1,"ѿ"],[1151,2],[1152,1,"ҁ"],[1153,2],[1154,2],[[1155,1158],2],[1159,2],[[1160,1161],2],[1162,1,"ҋ"],[1163,2],[1164,1,"ҍ"],[1165,2],[1166,1,"ҏ"],[1167,2],[1168,1,"ґ"],[1169,2],[1170,1,"ғ"],[1171,2],[1172,1,"ҕ"],[1173,2],[1174,1,"җ"],[1175,2],[1176,1,"ҙ"],[1177,2],[1178,1,"қ"],[1179,2],[1180,1,"ҝ"],[1181,2],[1182,1,"ҟ"],[1183,2],[1184,1,"ҡ"],[1185,2],[1186,1,"ң"],[1187,2],[1188,1,"ҥ"],[1189,2],[1190,1,"ҧ"],[1191,2],[1192,1,"ҩ"],[1193,2],[1194,1,"ҫ"],[1195,2],[1196,1,"ҭ"],[1197,2],[1198,1,"ү"],[1199,2],[1200,1,"ұ"],[1201,2],[1202,1,"ҳ"],[1203,2],[1204,1,"ҵ"],[1205,2],[1206,1,"ҷ"],[1207,2],[1208,1,"ҹ"],[1209,2],[1210,1,"һ"],[1211,2],[1212,1,"ҽ"],[1213,2],[1214,1,"ҿ"],[1215,2],[1216,3],[1217,1,"ӂ"],[1218,2],[1219,1,"ӄ"],[1220,2],[1221,1,"ӆ"],[1222,2],[1223,1,"ӈ"],[1224,2],[1225,1,"ӊ"],[1226,2],[1227,1,"ӌ"],[1228,2],[1229,1,"ӎ"],[1230,2],[1231,2],[1232,1,"ӑ"],[1233,2],[1234,1,"ӓ"],[1235,2],[1236,1,"ӕ"],[1237,2],[1238,1,"ӗ"],[1239,2],[1240,1,"ә"],[1241,2],[1242,1,"ӛ"],[1243,2],[1244,1,"ӝ"],[1245,2],[1246,1,"ӟ"],[1247,2],[1248,1,"ӡ"],[1249,2],[1250,1,"ӣ"],[1251,2],[1252,1,"ӥ"],[1253,2],[1254,1,"ӧ"],[1255,2],[1256,1,"ө"],[1257,2],[1258,1,"ӫ"],[1259,2],[1260,1,"ӭ"],[1261,2],[1262,1,"ӯ"],[1263,2],[1264,1,"ӱ"],[1265,2],[1266,1,"ӳ"],[1267,2],[1268,1,"ӵ"],[1269,2],[1270,1,"ӷ"],[1271,2],[1272,1,"ӹ"],[1273,2],[1274,1,"ӻ"],[1275,2],[1276,1,"ӽ"],[1277,2],[1278,1,"ӿ"],[1279,2],[1280,1,"ԁ"],[1281,2],[1282,1,"ԃ"],[1283,2],[1284,1,"ԅ"],[1285,2],[1286,1,"ԇ"],[1287,2],[1288,1,"ԉ"],[1289,2],[1290,1,"ԋ"],[1291,2],[1292,1,"ԍ"],[1293,2],[1294,1,"ԏ"],[1295,2],[1296,1,"ԑ"],[1297,2],[1298,1,"ԓ"],[1299,2],[1300,1,"ԕ"],[1301,2],[1302,1,"ԗ"],[1303,2],[1304,1,"ԙ"],[1305,2],[1306,1,"ԛ"],[1307,2],[1308,1,"ԝ"],[1309,2],[1310,1,"ԟ"],[1311,2],[1312,1,"ԡ"],[1313,2],[1314,1,"ԣ"],[1315,2],[1316,1,"ԥ"],[1317,2],[1318,1,"ԧ"],[1319,2],[1320,1,"ԩ"],[1321,2],[1322,1,"ԫ"],[1323,2],[1324,1,"ԭ"],[1325,2],[1326,1,"ԯ"],[1327,2],[1328,3],[1329,1,"ա"],[1330,1,"բ"],[1331,1,"գ"],[1332,1,"դ"],[1333,1,"ե"],[1334,1,"զ"],[1335,1,"է"],[1336,1,"ը"],[1337,1,"թ"],[1338,1,"ժ"],[1339,1,"ի"],[1340,1,"լ"],[1341,1,"խ"],[1342,1,"ծ"],[1343,1,"կ"],[1344,1,"հ"],[1345,1,"ձ"],[1346,1,"ղ"],[1347,1,"ճ"],[1348,1,"մ"],[1349,1,"յ"],[1350,1,"ն"],[1351,1,"շ"],[1352,1,"ո"],[1353,1,"չ"],[1354,1,"պ"],[1355,1,"ջ"],[1356,1,"ռ"],[1357,1,"ս"],[1358,1,"վ"],[1359,1,"տ"],[1360,1,"ր"],[1361,1,"ց"],[1362,1,"ւ"],[1363,1,"փ"],[1364,1,"ք"],[1365,1,"օ"],[1366,1,"ֆ"],[[1367,1368],3],[1369,2],[[1370,1375],2],[1376,2],[[1377,1414],2],[1415,1,"եւ"],[1416,2],[1417,2],[1418,2],[[1419,1420],3],[[1421,1422],2],[1423,2],[1424,3],[[1425,1441],2],[1442,2],[[1443,1455],2],[[1456,1465],2],[1466,2],[[1467,1469],2],[1470,2],[1471,2],[1472,2],[[1473,1474],2],[1475,2],[1476,2],[1477,2],[1478,2],[1479,2],[[1480,1487],3],[[1488,1514],2],[[1515,1518],3],[1519,2],[[1520,1524],2],[[1525,1535],3],[[1536,1539],3],[1540,3],[1541,3],[[1542,1546],2],[1547,2],[1548,2],[[1549,1551],2],[[1552,1557],2],[[1558,1562],2],[1563,2],[1564,3],[1565,2],[1566,2],[1567,2],[1568,2],[[1569,1594],2],[[1595,1599],2],[1600,2],[[1601,1618],2],[[1619,1621],2],[[1622,1624],2],[[1625,1630],2],[1631,2],[[1632,1641],2],[[1642,1645],2],[[1646,1647],2],[[1648,1652],2],[1653,1,"اٴ"],[1654,1,"وٴ"],[1655,1,"ۇٴ"],[1656,1,"يٴ"],[[1657,1719],2],[[1720,1721],2],[[1722,1726],2],[1727,2],[[1728,1742],2],[1743,2],[[1744,1747],2],[1748,2],[[1749,1756],2],[1757,3],[1758,2],[[1759,1768],2],[1769,2],[[1770,1773],2],[[1774,1775],2],[[1776,1785],2],[[1786,1790],2],[1791,2],[[1792,1805],2],[1806,3],[1807,3],[[1808,1836],2],[[1837,1839],2],[[1840,1866],2],[[1867,1868],3],[[1869,1871],2],[[1872,1901],2],[[1902,1919],2],[[1920,1968],2],[1969,2],[[1970,1983],3],[[1984,2037],2],[[2038,2042],2],[[2043,2044],3],[2045,2],[[2046,2047],2],[[2048,2093],2],[[2094,2095],3],[[2096,2110],2],[2111,3],[[2112,2139],2],[[2140,2141],3],[2142,2],[2143,3],[[2144,2154],2],[[2155,2159],3],[[2160,2183],2],[2184,2],[[2185,2190],2],[2191,3],[[2192,2193],3],[[2194,2199],3],[[2200,2207],2],[2208,2],[2209,2],[[2210,2220],2],[[2221,2226],2],[[2227,2228],2],[2229,2],[[2230,2237],2],[[2238,2247],2],[[2248,2258],2],[2259,2],[[2260,2273],2],[2274,3],[2275,2],[[2276,2302],2],[2303,2],[2304,2],[[2305,2307],2],[2308,2],[[2309,2361],2],[[2362,2363],2],[[2364,2381],2],[2382,2],[2383,2],[[2384,2388],2],[2389,2],[[2390,2391],2],[2392,1,"क़"],[2393,1,"ख़"],[2394,1,"ग़"],[2395,1,"ज़"],[2396,1,"ड़"],[2397,1,"ढ़"],[2398,1,"फ़"],[2399,1,"य़"],[[2400,2403],2],[[2404,2405],2],[[2406,2415],2],[2416,2],[[2417,2418],2],[[2419,2423],2],[2424,2],[[2425,2426],2],[[2427,2428],2],[2429,2],[[2430,2431],2],[2432,2],[[2433,2435],2],[2436,3],[[2437,2444],2],[[2445,2446],3],[[2447,2448],2],[[2449,2450],3],[[2451,2472],2],[2473,3],[[2474,2480],2],[2481,3],[2482,2],[[2483,2485],3],[[2486,2489],2],[[2490,2491],3],[2492,2],[2493,2],[[2494,2500],2],[[2501,2502],3],[[2503,2504],2],[[2505,2506],3],[[2507,2509],2],[2510,2],[[2511,2518],3],[2519,2],[[2520,2523],3],[2524,1,"ড়"],[2525,1,"ঢ়"],[2526,3],[2527,1,"য়"],[[2528,2531],2],[[2532,2533],3],[[2534,2545],2],[[2546,2554],2],[2555,2],[2556,2],[2557,2],[2558,2],[[2559,2560],3],[2561,2],[2562,2],[2563,2],[2564,3],[[2565,2570],2],[[2571,2574],3],[[2575,2576],2],[[2577,2578],3],[[2579,2600],2],[2601,3],[[2602,2608],2],[2609,3],[2610,2],[2611,1,"ਲ਼"],[2612,3],[2613,2],[2614,1,"ਸ਼"],[2615,3],[[2616,2617],2],[[2618,2619],3],[2620,2],[2621,3],[[2622,2626],2],[[2627,2630],3],[[2631,2632],2],[[2633,2634],3],[[2635,2637],2],[[2638,2640],3],[2641,2],[[2642,2648],3],[2649,1,"ਖ਼"],[2650,1,"ਗ਼"],[2651,1,"ਜ਼"],[2652,2],[2653,3],[2654,1,"ਫ਼"],[[2655,2661],3],[[2662,2676],2],[2677,2],[2678,2],[[2679,2688],3],[[2689,2691],2],[2692,3],[[2693,2699],2],[2700,2],[2701,2],[2702,3],[[2703,2705],2],[2706,3],[[2707,2728],2],[2729,3],[[2730,2736],2],[2737,3],[[2738,2739],2],[2740,3],[[2741,2745],2],[[2746,2747],3],[[2748,2757],2],[2758,3],[[2759,2761],2],[2762,3],[[2763,2765],2],[[2766,2767],3],[2768,2],[[2769,2783],3],[2784,2],[[2785,2787],2],[[2788,2789],3],[[2790,2799],2],[2800,2],[2801,2],[[2802,2808],3],[2809,2],[[2810,2815],2],[2816,3],[[2817,2819],2],[2820,3],[[2821,2828],2],[[2829,2830],3],[[2831,2832],2],[[2833,2834],3],[[2835,2856],2],[2857,3],[[2858,2864],2],[2865,3],[[2866,2867],2],[2868,3],[2869,2],[[2870,2873],2],[[2874,2875],3],[[2876,2883],2],[2884,2],[[2885,2886],3],[[2887,2888],2],[[2889,2890],3],[[2891,2893],2],[[2894,2900],3],[2901,2],[[2902,2903],2],[[2904,2907],3],[2908,1,"ଡ଼"],[2909,1,"ଢ଼"],[2910,3],[[2911,2913],2],[[2914,2915],2],[[2916,2917],3],[[2918,2927],2],[2928,2],[2929,2],[[2930,2935],2],[[2936,2945],3],[[2946,2947],2],[2948,3],[[2949,2954],2],[[2955,2957],3],[[2958,2960],2],[2961,3],[[2962,2965],2],[[2966,2968],3],[[2969,2970],2],[2971,3],[2972,2],[2973,3],[[2974,2975],2],[[2976,2978],3],[[2979,2980],2],[[2981,2983],3],[[2984,2986],2],[[2987,2989],3],[[2990,2997],2],[2998,2],[[2999,3001],2],[[3002,3005],3],[[3006,3010],2],[[3011,3013],3],[[3014,3016],2],[3017,3],[[3018,3021],2],[[3022,3023],3],[3024,2],[[3025,3030],3],[3031,2],[[3032,3045],3],[3046,2],[[3047,3055],2],[[3056,3058],2],[[3059,3066],2],[[3067,3071],3],[3072,2],[[3073,3075],2],[3076,2],[[3077,3084],2],[3085,3],[[3086,3088],2],[3089,3],[[3090,3112],2],[3113,3],[[3114,3123],2],[3124,2],[[3125,3129],2],[[3130,3131],3],[3132,2],[3133,2],[[3134,3140],2],[3141,3],[[3142,3144],2],[3145,3],[[3146,3149],2],[[3150,3156],3],[[3157,3158],2],[3159,3],[[3160,3161],2],[3162,2],[[3163,3164],3],[3165,2],[[3166,3167],3],[[3168,3169],2],[[3170,3171],2],[[3172,3173],3],[[3174,3183],2],[[3184,3190],3],[3191,2],[[3192,3199],2],[3200,2],[3201,2],[[3202,3203],2],[3204,2],[[3205,3212],2],[3213,3],[[3214,3216],2],[3217,3],[[3218,3240],2],[3241,3],[[3242,3251],2],[3252,3],[[3253,3257],2],[[3258,3259],3],[[3260,3261],2],[[3262,3268],2],[3269,3],[[3270,3272],2],[3273,3],[[3274,3277],2],[[3278,3284],3],[[3285,3286],2],[[3287,3292],3],[3293,2],[3294,2],[3295,3],[[3296,3297],2],[[3298,3299],2],[[3300,3301],3],[[3302,3311],2],[3312,3],[[3313,3314],2],[[3315,3327],3],[3328,2],[3329,2],[[3330,3331],2],[3332,2],[[3333,3340],2],[3341,3],[[3342,3344],2],[3345,3],[[3346,3368],2],[3369,2],[[3370,3385],2],[3386,2],[[3387,3388],2],[3389,2],[[3390,3395],2],[3396,2],[3397,3],[[3398,3400],2],[3401,3],[[3402,3405],2],[3406,2],[3407,2],[[3408,3411],3],[[3412,3414],2],[3415,2],[[3416,3422],2],[3423,2],[[3424,3425],2],[[3426,3427],2],[[3428,3429],3],[[3430,3439],2],[[3440,3445],2],[[3446,3448],2],[3449,2],[[3450,3455],2],[3456,3],[3457,2],[[3458,3459],2],[3460,3],[[3461,3478],2],[[3479,3481],3],[[3482,3505],2],[3506,3],[[3507,3515],2],[3516,3],[3517,2],[[3518,3519],3],[[3520,3526],2],[[3527,3529],3],[3530,2],[[3531,3534],3],[[3535,3540],2],[3541,3],[3542,2],[3543,3],[[3544,3551],2],[[3552,3557],3],[[3558,3567],2],[[3568,3569],3],[[3570,3571],2],[3572,2],[[3573,3584],3],[[3585,3634],2],[3635,1,"ํา"],[[3636,3642],2],[[3643,3646],3],[3647,2],[[3648,3662],2],[3663,2],[[3664,3673],2],[[3674,3675],2],[[3676,3712],3],[[3713,3714],2],[3715,3],[3716,2],[3717,3],[3718,2],[[3719,3720],2],[3721,2],[3722,2],[3723,3],[3724,2],[3725,2],[[3726,3731],2],[[3732,3735],2],[3736,2],[[3737,3743],2],[3744,2],[[3745,3747],2],[3748,3],[3749,2],[3750,3],[3751,2],[[3752,3753],2],[[3754,3755],2],[3756,2],[[3757,3762],2],[3763,1,"ໍາ"],[[3764,3769],2],[3770,2],[[3771,3773],2],[[3774,3775],3],[[3776,3780],2],[3781,3],[3782,2],[3783,3],[[3784,3789],2],[[3790,3791],3],[[3792,3801],2],[[3802,3803],3],[3804,1,"ຫນ"],[3805,1,"ຫມ"],[[3806,3807],2],[[3808,3839],3],[3840,2],[[3841,3850],2],[3851,2],[3852,1,"་"],[[3853,3863],2],[[3864,3865],2],[[3866,3871],2],[[3872,3881],2],[[3882,3892],2],[3893,2],[3894,2],[3895,2],[3896,2],[3897,2],[[3898,3901],2],[[3902,3906],2],[3907,1,"གྷ"],[[3908,3911],2],[3912,3],[[3913,3916],2],[3917,1,"ཌྷ"],[[3918,3921],2],[3922,1,"དྷ"],[[3923,3926],2],[3927,1,"བྷ"],[[3928,3931],2],[3932,1,"ཛྷ"],[[3933,3944],2],[3945,1,"ཀྵ"],[3946,2],[[3947,3948],2],[[3949,3952],3],[[3953,3954],2],[3955,1,"ཱི"],[3956,2],[3957,1,"ཱུ"],[3958,1,"ྲྀ"],[3959,1,"ྲཱྀ"],[3960,1,"ླྀ"],[3961,1,"ླཱྀ"],[[3962,3968],2],[3969,1,"ཱྀ"],[[3970,3972],2],[3973,2],[[3974,3979],2],[[3980,3983],2],[[3984,3986],2],[3987,1,"ྒྷ"],[[3988,3989],2],[3990,2],[3991,2],[3992,3],[[3993,3996],2],[3997,1,"ྜྷ"],[[3998,4001],2],[4002,1,"ྡྷ"],[[4003,4006],2],[4007,1,"ྦྷ"],[[4008,4011],2],[4012,1,"ྫྷ"],[4013,2],[[4014,4016],2],[[4017,4023],2],[4024,2],[4025,1,"ྐྵ"],[[4026,4028],2],[4029,3],[[4030,4037],2],[4038,2],[[4039,4044],2],[4045,3],[4046,2],[4047,2],[[4048,4049],2],[[4050,4052],2],[[4053,4056],2],[[4057,4058],2],[[4059,4095],3],[[4096,4129],2],[4130,2],[[4131,4135],2],[4136,2],[[4137,4138],2],[4139,2],[[4140,4146],2],[[4147,4149],2],[[4150,4153],2],[[4154,4159],2],[[4160,4169],2],[[4170,4175],2],[[4176,4185],2],[[4186,4249],2],[[4250,4253],2],[[4254,4255],2],[[4256,4293],3],[4294,3],[4295,1,"ⴧ"],[[4296,4300],3],[4301,1,"ⴭ"],[[4302,4303],3],[[4304,4342],2],[[4343,4344],2],[[4345,4346],2],[4347,2],[4348,1,"ნ"],[[4349,4351],2],[[4352,4441],2],[[4442,4446],2],[[4447,4448],3],[[4449,4514],2],[[4515,4519],2],[[4520,4601],2],[[4602,4607],2],[[4608,4614],2],[4615,2],[[4616,4678],2],[4679,2],[4680,2],[4681,3],[[4682,4685],2],[[4686,4687],3],[[4688,4694],2],[4695,3],[4696,2],[4697,3],[[4698,4701],2],[[4702,4703],3],[[4704,4742],2],[4743,2],[4744,2],[4745,3],[[4746,4749],2],[[4750,4751],3],[[4752,4782],2],[4783,2],[4784,2],[4785,3],[[4786,4789],2],[[4790,4791],3],[[4792,4798],2],[4799,3],[4800,2],[4801,3],[[4802,4805],2],[[4806,4807],3],[[4808,4814],2],[4815,2],[[4816,4822],2],[4823,3],[[4824,4846],2],[4847,2],[[4848,4878],2],[4879,2],[4880,2],[4881,3],[[4882,4885],2],[[4886,4887],3],[[4888,4894],2],[4895,2],[[4896,4934],2],[4935,2],[[4936,4954],2],[[4955,4956],3],[[4957,4958],2],[4959,2],[4960,2],[[4961,4988],2],[[4989,4991],3],[[4992,5007],2],[[5008,5017],2],[[5018,5023],3],[[5024,5108],2],[5109,2],[[5110,5111],3],[5112,1,"Ᏸ"],[5113,1,"Ᏹ"],[5114,1,"Ᏺ"],[5115,1,"Ᏻ"],[5116,1,"Ᏼ"],[5117,1,"Ᏽ"],[[5118,5119],3],[5120,2],[[5121,5740],2],[[5741,5742],2],[[5743,5750],2],[[5751,5759],2],[5760,3],[[5761,5786],2],[[5787,5788],2],[[5789,5791],3],[[5792,5866],2],[[5867,5872],2],[[5873,5880],2],[[5881,5887],3],[[5888,5900],2],[5901,2],[[5902,5908],2],[5909,2],[[5910,5918],3],[5919,2],[[5920,5940],2],[[5941,5942],2],[[5943,5951],3],[[5952,5971],2],[[5972,5983],3],[[5984,5996],2],[5997,3],[[5998,6000],2],[6001,3],[[6002,6003],2],[[6004,6015],3],[[6016,6067],2],[[6068,6069],3],[[6070,6099],2],[[6100,6102],2],[6103,2],[[6104,6107],2],[6108,2],[6109,2],[[6110,6111],3],[[6112,6121],2],[[6122,6127],3],[[6128,6137],2],[[6138,6143],3],[[6144,6149],2],[6150,3],[[6151,6154],2],[[6155,6157],7],[6158,3],[6159,7],[[6160,6169],2],[[6170,6175],3],[[6176,6263],2],[6264,2],[[6265,6271],3],[[6272,6313],2],[6314,2],[[6315,6319],3],[[6320,6389],2],[[6390,6399],3],[[6400,6428],2],[[6429,6430],2],[6431,3],[[6432,6443],2],[[6444,6447],3],[[6448,6459],2],[[6460,6463],3],[6464,2],[[6465,6467],3],[[6468,6469],2],[[6470,6509],2],[[6510,6511],3],[[6512,6516],2],[[6517,6527],3],[[6528,6569],2],[[6570,6571],2],[[6572,6575],3],[[6576,6601],2],[[6602,6607],3],[[6608,6617],2],[6618,2],[[6619,6621],3],[[6622,6623],2],[[6624,6655],2],[[6656,6683],2],[[6684,6685],3],[[6686,6687],2],[[6688,6750],2],[6751,3],[[6752,6780],2],[[6781,6782],3],[[6783,6793],2],[[6794,6799],3],[[6800,6809],2],[[6810,6815],3],[[6816,6822],2],[6823,2],[[6824,6829],2],[[6830,6831],3],[[6832,6845],2],[6846,2],[[6847,6848],2],[[6849,6862],2],[[6863,6911],3],[[6912,6987],2],[6988,2],[[6989,6991],3],[[6992,7001],2],[[7002,7018],2],[[7019,7027],2],[[7028,7036],2],[[7037,7038],2],[7039,3],[[7040,7082],2],[[7083,7085],2],[[7086,7097],2],[[7098,7103],2],[[7104,7155],2],[[7156,7163],3],[[7164,7167],2],[[7168,7223],2],[[7224,7226],3],[[7227,7231],2],[[7232,7241],2],[[7242,7244],3],[[7245,7293],2],[[7294,7295],2],[7296,1,"в"],[7297,1,"д"],[7298,1,"о"],[7299,1,"с"],[[7300,7301],1,"т"],[7302,1,"ъ"],[7303,1,"ѣ"],[7304,1,"ꙋ"],[[7305,7311],3],[7312,1,"ა"],[7313,1,"ბ"],[7314,1,"გ"],[7315,1,"დ"],[7316,1,"ე"],[7317,1,"ვ"],[7318,1,"ზ"],[7319,1,"თ"],[7320,1,"ი"],[7321,1,"კ"],[7322,1,"ლ"],[7323,1,"მ"],[7324,1,"ნ"],[7325,1,"ო"],[7326,1,"პ"],[7327,1,"ჟ"],[7328,1,"რ"],[7329,1,"ს"],[7330,1,"ტ"],[7331,1,"უ"],[7332,1,"ფ"],[7333,1,"ქ"],[7334,1,"ღ"],[7335,1,"ყ"],[7336,1,"შ"],[7337,1,"ჩ"],[7338,1,"ც"],[7339,1,"ძ"],[7340,1,"წ"],[7341,1,"ჭ"],[7342,1,"ხ"],[7343,1,"ჯ"],[7344,1,"ჰ"],[7345,1,"ჱ"],[7346,1,"ჲ"],[7347,1,"ჳ"],[7348,1,"ჴ"],[7349,1,"ჵ"],[7350,1,"ჶ"],[7351,1,"ჷ"],[7352,1,"ჸ"],[7353,1,"ჹ"],[7354,1,"ჺ"],[[7355,7356],3],[7357,1,"ჽ"],[7358,1,"ჾ"],[7359,1,"ჿ"],[[7360,7367],2],[[7368,7375],3],[[7376,7378],2],[7379,2],[[7380,7410],2],[[7411,7414],2],[7415,2],[[7416,7417],2],[7418,2],[[7419,7423],3],[[7424,7467],2],[7468,1,"a"],[7469,1,"æ"],[7470,1,"b"],[7471,2],[7472,1,"d"],[7473,1,"e"],[7474,1,"ǝ"],[7475,1,"g"],[7476,1,"h"],[7477,1,"i"],[7478,1,"j"],[7479,1,"k"],[7480,1,"l"],[7481,1,"m"],[7482,1,"n"],[7483,2],[7484,1,"o"],[7485,1,"ȣ"],[7486,1,"p"],[7487,1,"r"],[7488,1,"t"],[7489,1,"u"],[7490,1,"w"],[7491,1,"a"],[7492,1,"ɐ"],[7493,1,"ɑ"],[7494,1,"ᴂ"],[7495,1,"b"],[7496,1,"d"],[7497,1,"e"],[7498,1,"ə"],[7499,1,"ɛ"],[7500,1,"ɜ"],[7501,1,"g"],[7502,2],[7503,1,"k"],[7504,1,"m"],[7505,1,"ŋ"],[7506,1,"o"],[7507,1,"ɔ"],[7508,1,"ᴖ"],[7509,1,"ᴗ"],[7510,1,"p"],[7511,1,"t"],[7512,1,"u"],[7513,1,"ᴝ"],[7514,1,"ɯ"],[7515,1,"v"],[7516,1,"ᴥ"],[7517,1,"β"],[7518,1,"γ"],[7519,1,"δ"],[7520,1,"φ"],[7521,1,"χ"],[7522,1,"i"],[7523,1,"r"],[7524,1,"u"],[7525,1,"v"],[7526,1,"β"],[7527,1,"γ"],[7528,1,"ρ"],[7529,1,"φ"],[7530,1,"χ"],[7531,2],[[7532,7543],2],[7544,1,"н"],[[7545,7578],2],[7579,1,"ɒ"],[7580,1,"c"],[7581,1,"ɕ"],[7582,1,"ð"],[7583,1,"ɜ"],[7584,1,"f"],[7585,1,"ɟ"],[7586,1,"ɡ"],[7587,1,"ɥ"],[7588,1,"ɨ"],[7589,1,"ɩ"],[7590,1,"ɪ"],[7591,1,"ᵻ"],[7592,1,"ʝ"],[7593,1,"ɭ"],[7594,1,"ᶅ"],[7595,1,"ʟ"],[7596,1,"ɱ"],[7597,1,"ɰ"],[7598,1,"ɲ"],[7599,1,"ɳ"],[7600,1,"ɴ"],[7601,1,"ɵ"],[7602,1,"ɸ"],[7603,1,"ʂ"],[7604,1,"ʃ"],[7605,1,"ƫ"],[7606,1,"ʉ"],[7607,1,"ʊ"],[7608,1,"ᴜ"],[7609,1,"ʋ"],[7610,1,"ʌ"],[7611,1,"z"],[7612,1,"ʐ"],[7613,1,"ʑ"],[7614,1,"ʒ"],[7615,1,"θ"],[[7616,7619],2],[[7620,7626],2],[[7627,7654],2],[[7655,7669],2],[[7670,7673],2],[7674,2],[7675,2],[7676,2],[7677,2],[[7678,7679],2],[7680,1,"ḁ"],[7681,2],[7682,1,"ḃ"],[7683,2],[7684,1,"ḅ"],[7685,2],[7686,1,"ḇ"],[7687,2],[7688,1,"ḉ"],[7689,2],[7690,1,"ḋ"],[7691,2],[7692,1,"ḍ"],[7693,2],[7694,1,"ḏ"],[7695,2],[7696,1,"ḑ"],[7697,2],[7698,1,"ḓ"],[7699,2],[7700,1,"ḕ"],[7701,2],[7702,1,"ḗ"],[7703,2],[7704,1,"ḙ"],[7705,2],[7706,1,"ḛ"],[7707,2],[7708,1,"ḝ"],[7709,2],[7710,1,"ḟ"],[7711,2],[7712,1,"ḡ"],[7713,2],[7714,1,"ḣ"],[7715,2],[7716,1,"ḥ"],[7717,2],[7718,1,"ḧ"],[7719,2],[7720,1,"ḩ"],[7721,2],[7722,1,"ḫ"],[7723,2],[7724,1,"ḭ"],[7725,2],[7726,1,"ḯ"],[7727,2],[7728,1,"ḱ"],[7729,2],[7730,1,"ḳ"],[7731,2],[7732,1,"ḵ"],[7733,2],[7734,1,"ḷ"],[7735,2],[7736,1,"ḹ"],[7737,2],[7738,1,"ḻ"],[7739,2],[7740,1,"ḽ"],[7741,2],[7742,1,"ḿ"],[7743,2],[7744,1,"ṁ"],[7745,2],[7746,1,"ṃ"],[7747,2],[7748,1,"ṅ"],[7749,2],[7750,1,"ṇ"],[7751,2],[7752,1,"ṉ"],[7753,2],[7754,1,"ṋ"],[7755,2],[7756,1,"ṍ"],[7757,2],[7758,1,"ṏ"],[7759,2],[7760,1,"ṑ"],[7761,2],[7762,1,"ṓ"],[7763,2],[7764,1,"ṕ"],[7765,2],[7766,1,"ṗ"],[7767,2],[7768,1,"ṙ"],[7769,2],[7770,1,"ṛ"],[7771,2],[7772,1,"ṝ"],[7773,2],[7774,1,"ṟ"],[7775,2],[7776,1,"ṡ"],[7777,2],[7778,1,"ṣ"],[7779,2],[7780,1,"ṥ"],[7781,2],[7782,1,"ṧ"],[7783,2],[7784,1,"ṩ"],[7785,2],[7786,1,"ṫ"],[7787,2],[7788,1,"ṭ"],[7789,2],[7790,1,"ṯ"],[7791,2],[7792,1,"ṱ"],[7793,2],[7794,1,"ṳ"],[7795,2],[7796,1,"ṵ"],[7797,2],[7798,1,"ṷ"],[7799,2],[7800,1,"ṹ"],[7801,2],[7802,1,"ṻ"],[7803,2],[7804,1,"ṽ"],[7805,2],[7806,1,"ṿ"],[7807,2],[7808,1,"ẁ"],[7809,2],[7810,1,"ẃ"],[7811,2],[7812,1,"ẅ"],[7813,2],[7814,1,"ẇ"],[7815,2],[7816,1,"ẉ"],[7817,2],[7818,1,"ẋ"],[7819,2],[7820,1,"ẍ"],[7821,2],[7822,1,"ẏ"],[7823,2],[7824,1,"ẑ"],[7825,2],[7826,1,"ẓ"],[7827,2],[7828,1,"ẕ"],[[7829,7833],2],[7834,1,"aʾ"],[7835,1,"ṡ"],[[7836,7837],2],[7838,1,"ss"],[7839,2],[7840,1,"ạ"],[7841,2],[7842,1,"ả"],[7843,2],[7844,1,"ấ"],[7845,2],[7846,1,"ầ"],[7847,2],[7848,1,"ẩ"],[7849,2],[7850,1,"ẫ"],[7851,2],[7852,1,"ậ"],[7853,2],[7854,1,"ắ"],[7855,2],[7856,1,"ằ"],[7857,2],[7858,1,"ẳ"],[7859,2],[7860,1,"ẵ"],[7861,2],[7862,1,"ặ"],[7863,2],[7864,1,"ẹ"],[7865,2],[7866,1,"ẻ"],[7867,2],[7868,1,"ẽ"],[7869,2],[7870,1,"ế"],[7871,2],[7872,1,"ề"],[7873,2],[7874,1,"ể"],[7875,2],[7876,1,"ễ"],[7877,2],[7878,1,"ệ"],[7879,2],[7880,1,"ỉ"],[7881,2],[7882,1,"ị"],[7883,2],[7884,1,"ọ"],[7885,2],[7886,1,"ỏ"],[7887,2],[7888,1,"ố"],[7889,2],[7890,1,"ồ"],[7891,2],[7892,1,"ổ"],[7893,2],[7894,1,"ỗ"],[7895,2],[7896,1,"ộ"],[7897,2],[7898,1,"ớ"],[7899,2],[7900,1,"ờ"],[7901,2],[7902,1,"ở"],[7903,2],[7904,1,"ỡ"],[7905,2],[7906,1,"ợ"],[7907,2],[7908,1,"ụ"],[7909,2],[7910,1,"ủ"],[7911,2],[7912,1,"ứ"],[7913,2],[7914,1,"ừ"],[7915,2],[7916,1,"ử"],[7917,2],[7918,1,"ữ"],[7919,2],[7920,1,"ự"],[7921,2],[7922,1,"ỳ"],[7923,2],[7924,1,"ỵ"],[7925,2],[7926,1,"ỷ"],[7927,2],[7928,1,"ỹ"],[7929,2],[7930,1,"ỻ"],[7931,2],[7932,1,"ỽ"],[7933,2],[7934,1,"ỿ"],[7935,2],[[7936,7943],2],[7944,1,"ἀ"],[7945,1,"ἁ"],[7946,1,"ἂ"],[7947,1,"ἃ"],[7948,1,"ἄ"],[7949,1,"ἅ"],[7950,1,"ἆ"],[7951,1,"ἇ"],[[7952,7957],2],[[7958,7959],3],[7960,1,"ἐ"],[7961,1,"ἑ"],[7962,1,"ἒ"],[7963,1,"ἓ"],[7964,1,"ἔ"],[7965,1,"ἕ"],[[7966,7967],3],[[7968,7975],2],[7976,1,"ἠ"],[7977,1,"ἡ"],[7978,1,"ἢ"],[7979,1,"ἣ"],[7980,1,"ἤ"],[7981,1,"ἥ"],[7982,1,"ἦ"],[7983,1,"ἧ"],[[7984,7991],2],[7992,1,"ἰ"],[7993,1,"ἱ"],[7994,1,"ἲ"],[7995,1,"ἳ"],[7996,1,"ἴ"],[7997,1,"ἵ"],[7998,1,"ἶ"],[7999,1,"ἷ"],[[8000,8005],2],[[8006,8007],3],[8008,1,"ὀ"],[8009,1,"ὁ"],[8010,1,"ὂ"],[8011,1,"ὃ"],[8012,1,"ὄ"],[8013,1,"ὅ"],[[8014,8015],3],[[8016,8023],2],[8024,3],[8025,1,"ὑ"],[8026,3],[8027,1,"ὓ"],[8028,3],[8029,1,"ὕ"],[8030,3],[8031,1,"ὗ"],[[8032,8039],2],[8040,1,"ὠ"],[8041,1,"ὡ"],[8042,1,"ὢ"],[8043,1,"ὣ"],[8044,1,"ὤ"],[8045,1,"ὥ"],[8046,1,"ὦ"],[8047,1,"ὧ"],[8048,2],[8049,1,"ά"],[8050,2],[8051,1,"έ"],[8052,2],[8053,1,"ή"],[8054,2],[8055,1,"ί"],[8056,2],[8057,1,"ό"],[8058,2],[8059,1,"ύ"],[8060,2],[8061,1,"ώ"],[[8062,8063],3],[8064,1,"ἀι"],[8065,1,"ἁι"],[8066,1,"ἂι"],[8067,1,"ἃι"],[8068,1,"ἄι"],[8069,1,"ἅι"],[8070,1,"ἆι"],[8071,1,"ἇι"],[8072,1,"ἀι"],[8073,1,"ἁι"],[8074,1,"ἂι"],[8075,1,"ἃι"],[8076,1,"ἄι"],[8077,1,"ἅι"],[8078,1,"ἆι"],[8079,1,"ἇι"],[8080,1,"ἠι"],[8081,1,"ἡι"],[8082,1,"ἢι"],[8083,1,"ἣι"],[8084,1,"ἤι"],[8085,1,"ἥι"],[8086,1,"ἦι"],[8087,1,"ἧι"],[8088,1,"ἠι"],[8089,1,"ἡι"],[8090,1,"ἢι"],[8091,1,"ἣι"],[8092,1,"ἤι"],[8093,1,"ἥι"],[8094,1,"ἦι"],[8095,1,"ἧι"],[8096,1,"ὠι"],[8097,1,"ὡι"],[8098,1,"ὢι"],[8099,1,"ὣι"],[8100,1,"ὤι"],[8101,1,"ὥι"],[8102,1,"ὦι"],[8103,1,"ὧι"],[8104,1,"ὠι"],[8105,1,"ὡι"],[8106,1,"ὢι"],[8107,1,"ὣι"],[8108,1,"ὤι"],[8109,1,"ὥι"],[8110,1,"ὦι"],[8111,1,"ὧι"],[[8112,8113],2],[8114,1,"ὰι"],[8115,1,"αι"],[8116,1,"άι"],[8117,3],[8118,2],[8119,1,"ᾶι"],[8120,1,"ᾰ"],[8121,1,"ᾱ"],[8122,1,"ὰ"],[8123,1,"ά"],[8124,1,"αι"],[8125,5," ̓"],[8126,1,"ι"],[8127,5," ̓"],[8128,5," ͂"],[8129,5," ̈͂"],[8130,1,"ὴι"],[8131,1,"ηι"],[8132,1,"ήι"],[8133,3],[8134,2],[8135,1,"ῆι"],[8136,1,"ὲ"],[8137,1,"έ"],[8138,1,"ὴ"],[8139,1,"ή"],[8140,1,"ηι"],[8141,5," ̓̀"],[8142,5," ̓́"],[8143,5," ̓͂"],[[8144,8146],2],[8147,1,"ΐ"],[[8148,8149],3],[[8150,8151],2],[8152,1,"ῐ"],[8153,1,"ῑ"],[8154,1,"ὶ"],[8155,1,"ί"],[8156,3],[8157,5," ̔̀"],[8158,5," ̔́"],[8159,5," ̔͂"],[[8160,8162],2],[8163,1,"ΰ"],[[8164,8167],2],[8168,1,"ῠ"],[8169,1,"ῡ"],[8170,1,"ὺ"],[8171,1,"ύ"],[8172,1,"ῥ"],[8173,5," ̈̀"],[8174,5," ̈́"],[8175,5,"`"],[[8176,8177],3],[8178,1,"ὼι"],[8179,1,"ωι"],[8180,1,"ώι"],[8181,3],[8182,2],[8183,1,"ῶι"],[8184,1,"ὸ"],[8185,1,"ό"],[8186,1,"ὼ"],[8187,1,"ώ"],[8188,1,"ωι"],[8189,5," ́"],[8190,5," ̔"],[8191,3],[[8192,8202],5," "],[8203,7],[[8204,8205],6,""],[[8206,8207],3],[8208,2],[8209,1,"‐"],[[8210,8214],2],[8215,5," ̳"],[[8216,8227],2],[[8228,8230],3],[8231,2],[[8232,8238],3],[8239,5," "],[[8240,8242],2],[8243,1,"′′"],[8244,1,"′′′"],[8245,2],[8246,1,"‵‵"],[8247,1,"‵‵‵"],[[8248,8251],2],[8252,5,"!!"],[8253,2],[8254,5," ̅"],[[8255,8262],2],[8263,5,"??"],[8264,5,"?!"],[8265,5,"!?"],[[8266,8269],2],[[8270,8274],2],[[8275,8276],2],[[8277,8278],2],[8279,1,"′′′′"],[[8280,8286],2],[8287,5," "],[8288,7],[[8289,8291],3],[8292,7],[8293,3],[[8294,8297],3],[[8298,8303],3],[8304,1,"0"],[8305,1,"i"],[[8306,8307],3],[8308,1,"4"],[8309,1,"5"],[8310,1,"6"],[8311,1,"7"],[8312,1,"8"],[8313,1,"9"],[8314,5,"+"],[8315,1,"−"],[8316,5,"="],[8317,5,"("],[8318,5,")"],[8319,1,"n"],[8320,1,"0"],[8321,1,"1"],[8322,1,"2"],[8323,1,"3"],[8324,1,"4"],[8325,1,"5"],[8326,1,"6"],[8327,1,"7"],[8328,1,"8"],[8329,1,"9"],[8330,5,"+"],[8331,1,"−"],[8332,5,"="],[8333,5,"("],[8334,5,")"],[8335,3],[8336,1,"a"],[8337,1,"e"],[8338,1,"o"],[8339,1,"x"],[8340,1,"ə"],[8341,1,"h"],[8342,1,"k"],[8343,1,"l"],[8344,1,"m"],[8345,1,"n"],[8346,1,"p"],[8347,1,"s"],[8348,1,"t"],[[8349,8351],3],[[8352,8359],2],[8360,1,"rs"],[[8361,8362],2],[8363,2],[8364,2],[[8365,8367],2],[[8368,8369],2],[[8370,8373],2],[[8374,8376],2],[8377,2],[8378,2],[[8379,8381],2],[8382,2],[8383,2],[8384,2],[[8385,8399],3],[[8400,8417],2],[[8418,8419],2],[[8420,8426],2],[8427,2],[[8428,8431],2],[8432,2],[[8433,8447],3],[8448,5,"a/c"],[8449,5,"a/s"],[8450,1,"c"],[8451,1,"°c"],[8452,2],[8453,5,"c/o"],[8454,5,"c/u"],[8455,1,"ɛ"],[8456,2],[8457,1,"°f"],[8458,1,"g"],[[8459,8462],1,"h"],[8463,1,"ħ"],[[8464,8465],1,"i"],[[8466,8467],1,"l"],[8468,2],[8469,1,"n"],[8470,1,"no"],[[8471,8472],2],[8473,1,"p"],[8474,1,"q"],[[8475,8477],1,"r"],[[8478,8479],2],[8480,1,"sm"],[8481,1,"tel"],[8482,1,"tm"],[8483,2],[8484,1,"z"],[8485,2],[8486,1,"ω"],[8487,2],[8488,1,"z"],[8489,2],[8490,1,"k"],[8491,1,"å"],[8492,1,"b"],[8493,1,"c"],[8494,2],[[8495,8496],1,"e"],[8497,1,"f"],[8498,3],[8499,1,"m"],[8500,1,"o"],[8501,1,"א"],[8502,1,"ב"],[8503,1,"ג"],[8504,1,"ד"],[8505,1,"i"],[8506,2],[8507,1,"fax"],[8508,1,"π"],[[8509,8510],1,"γ"],[8511,1,"π"],[8512,1,"∑"],[[8513,8516],2],[[8517,8518],1,"d"],[8519,1,"e"],[8520,1,"i"],[8521,1,"j"],[[8522,8523],2],[8524,2],[8525,2],[8526,2],[8527,2],[8528,1,"1⁄7"],[8529,1,"1⁄9"],[8530,1,"1⁄10"],[8531,1,"1⁄3"],[8532,1,"2⁄3"],[8533,1,"1⁄5"],[8534,1,"2⁄5"],[8535,1,"3⁄5"],[8536,1,"4⁄5"],[8537,1,"1⁄6"],[8538,1,"5⁄6"],[8539,1,"1⁄8"],[8540,1,"3⁄8"],[8541,1,"5⁄8"],[8542,1,"7⁄8"],[8543,1,"1⁄"],[8544,1,"i"],[8545,1,"ii"],[8546,1,"iii"],[8547,1,"iv"],[8548,1,"v"],[8549,1,"vi"],[8550,1,"vii"],[8551,1,"viii"],[8552,1,"ix"],[8553,1,"x"],[8554,1,"xi"],[8555,1,"xii"],[8556,1,"l"],[8557,1,"c"],[8558,1,"d"],[8559,1,"m"],[8560,1,"i"],[8561,1,"ii"],[8562,1,"iii"],[8563,1,"iv"],[8564,1,"v"],[8565,1,"vi"],[8566,1,"vii"],[8567,1,"viii"],[8568,1,"ix"],[8569,1,"x"],[8570,1,"xi"],[8571,1,"xii"],[8572,1,"l"],[8573,1,"c"],[8574,1,"d"],[8575,1,"m"],[[8576,8578],2],[8579,3],[8580,2],[[8581,8584],2],[8585,1,"0⁄3"],[[8586,8587],2],[[8588,8591],3],[[8592,8682],2],[[8683,8691],2],[[8692,8703],2],[[8704,8747],2],[8748,1,"∫∫"],[8749,1,"∫∫∫"],[8750,2],[8751,1,"∮∮"],[8752,1,"∮∮∮"],[[8753,8799],2],[8800,4],[[8801,8813],2],[[8814,8815],4],[[8816,8945],2],[[8946,8959],2],[8960,2],[8961,2],[[8962,9000],2],[9001,1,"〈"],[9002,1,"〉"],[[9003,9082],2],[9083,2],[9084,2],[[9085,9114],2],[[9115,9166],2],[[9167,9168],2],[[9169,9179],2],[[9180,9191],2],[9192,2],[[9193,9203],2],[[9204,9210],2],[[9211,9214],2],[9215,2],[[9216,9252],2],[[9253,9254],2],[[9255,9279],3],[[9280,9290],2],[[9291,9311],3],[9312,1,"1"],[9313,1,"2"],[9314,1,"3"],[9315,1,"4"],[9316,1,"5"],[9317,1,"6"],[9318,1,"7"],[9319,1,"8"],[9320,1,"9"],[9321,1,"10"],[9322,1,"11"],[9323,1,"12"],[9324,1,"13"],[9325,1,"14"],[9326,1,"15"],[9327,1,"16"],[9328,1,"17"],[9329,1,"18"],[9330,1,"19"],[9331,1,"20"],[9332,5,"(1)"],[9333,5,"(2)"],[9334,5,"(3)"],[9335,5,"(4)"],[9336,5,"(5)"],[9337,5,"(6)"],[9338,5,"(7)"],[9339,5,"(8)"],[9340,5,"(9)"],[9341,5,"(10)"],[9342,5,"(11)"],[9343,5,"(12)"],[9344,5,"(13)"],[9345,5,"(14)"],[9346,5,"(15)"],[9347,5,"(16)"],[9348,5,"(17)"],[9349,5,"(18)"],[9350,5,"(19)"],[9351,5,"(20)"],[[9352,9371],3],[9372,5,"(a)"],[9373,5,"(b)"],[9374,5,"(c)"],[9375,5,"(d)"],[9376,5,"(e)"],[9377,5,"(f)"],[9378,5,"(g)"],[9379,5,"(h)"],[9380,5,"(i)"],[9381,5,"(j)"],[9382,5,"(k)"],[9383,5,"(l)"],[9384,5,"(m)"],[9385,5,"(n)"],[9386,5,"(o)"],[9387,5,"(p)"],[9388,5,"(q)"],[9389,5,"(r)"],[9390,5,"(s)"],[9391,5,"(t)"],[9392,5,"(u)"],[9393,5,"(v)"],[9394,5,"(w)"],[9395,5,"(x)"],[9396,5,"(y)"],[9397,5,"(z)"],[9398,1,"a"],[9399,1,"b"],[9400,1,"c"],[9401,1,"d"],[9402,1,"e"],[9403,1,"f"],[9404,1,"g"],[9405,1,"h"],[9406,1,"i"],[9407,1,"j"],[9408,1,"k"],[9409,1,"l"],[9410,1,"m"],[9411,1,"n"],[9412,1,"o"],[9413,1,"p"],[9414,1,"q"],[9415,1,"r"],[9416,1,"s"],[9417,1,"t"],[9418,1,"u"],[9419,1,"v"],[9420,1,"w"],[9421,1,"x"],[9422,1,"y"],[9423,1,"z"],[9424,1,"a"],[9425,1,"b"],[9426,1,"c"],[9427,1,"d"],[9428,1,"e"],[9429,1,"f"],[9430,1,"g"],[9431,1,"h"],[9432,1,"i"],[9433,1,"j"],[9434,1,"k"],[9435,1,"l"],[9436,1,"m"],[9437,1,"n"],[9438,1,"o"],[9439,1,"p"],[9440,1,"q"],[9441,1,"r"],[9442,1,"s"],[9443,1,"t"],[9444,1,"u"],[9445,1,"v"],[9446,1,"w"],[9447,1,"x"],[9448,1,"y"],[9449,1,"z"],[9450,1,"0"],[[9451,9470],2],[9471,2],[[9472,9621],2],[[9622,9631],2],[[9632,9711],2],[[9712,9719],2],[[9720,9727],2],[[9728,9747],2],[[9748,9749],2],[[9750,9751],2],[9752,2],[9753,2],[[9754,9839],2],[[9840,9841],2],[[9842,9853],2],[[9854,9855],2],[[9856,9865],2],[[9866,9873],2],[[9874,9884],2],[9885,2],[[9886,9887],2],[[9888,9889],2],[[9890,9905],2],[9906,2],[[9907,9916],2],[[9917,9919],2],[[9920,9923],2],[[9924,9933],2],[9934,2],[[9935,9953],2],[9954,2],[9955,2],[[9956,9959],2],[[9960,9983],2],[9984,2],[[9985,9988],2],[9989,2],[[9990,9993],2],[[9994,9995],2],[[9996,10023],2],[10024,2],[[10025,10059],2],[10060,2],[10061,2],[10062,2],[[10063,10066],2],[[10067,10069],2],[10070,2],[10071,2],[[10072,10078],2],[[10079,10080],2],[[10081,10087],2],[[10088,10101],2],[[10102,10132],2],[[10133,10135],2],[[10136,10159],2],[10160,2],[[10161,10174],2],[10175,2],[[10176,10182],2],[[10183,10186],2],[10187,2],[10188,2],[10189,2],[[10190,10191],2],[[10192,10219],2],[[10220,10223],2],[[10224,10239],2],[[10240,10495],2],[[10496,10763],2],[10764,1,"∫∫∫∫"],[[10765,10867],2],[10868,5,"::="],[10869,5,"=="],[10870,5,"==="],[[10871,10971],2],[10972,1,"⫝̸"],[[10973,11007],2],[[11008,11021],2],[[11022,11027],2],[[11028,11034],2],[[11035,11039],2],[[11040,11043],2],[[11044,11084],2],[[11085,11087],2],[[11088,11092],2],[[11093,11097],2],[[11098,11123],2],[[11124,11125],3],[[11126,11157],2],[11158,3],[11159,2],[[11160,11193],2],[[11194,11196],2],[[11197,11208],2],[11209,2],[[11210,11217],2],[11218,2],[[11219,11243],2],[[11244,11247],2],[[11248,11262],2],[11263,2],[11264,1,"ⰰ"],[11265,1,"ⰱ"],[11266,1,"ⰲ"],[11267,1,"ⰳ"],[11268,1,"ⰴ"],[11269,1,"ⰵ"],[11270,1,"ⰶ"],[11271,1,"ⰷ"],[11272,1,"ⰸ"],[11273,1,"ⰹ"],[11274,1,"ⰺ"],[11275,1,"ⰻ"],[11276,1,"ⰼ"],[11277,1,"ⰽ"],[11278,1,"ⰾ"],[11279,1,"ⰿ"],[11280,1,"ⱀ"],[11281,1,"ⱁ"],[11282,1,"ⱂ"],[11283,1,"ⱃ"],[11284,1,"ⱄ"],[11285,1,"ⱅ"],[11286,1,"ⱆ"],[11287,1,"ⱇ"],[11288,1,"ⱈ"],[11289,1,"ⱉ"],[11290,1,"ⱊ"],[11291,1,"ⱋ"],[11292,1,"ⱌ"],[11293,1,"ⱍ"],[11294,1,"ⱎ"],[11295,1,"ⱏ"],[11296,1,"ⱐ"],[11297,1,"ⱑ"],[11298,1,"ⱒ"],[11299,1,"ⱓ"],[11300,1,"ⱔ"],[11301,1,"ⱕ"],[11302,1,"ⱖ"],[11303,1,"ⱗ"],[11304,1,"ⱘ"],[11305,1,"ⱙ"],[11306,1,"ⱚ"],[11307,1,"ⱛ"],[11308,1,"ⱜ"],[11309,1,"ⱝ"],[11310,1,"ⱞ"],[11311,1,"ⱟ"],[[11312,11358],2],[11359,2],[11360,1,"ⱡ"],[11361,2],[11362,1,"ɫ"],[11363,1,"ᵽ"],[11364,1,"ɽ"],[[11365,11366],2],[11367,1,"ⱨ"],[11368,2],[11369,1,"ⱪ"],[11370,2],[11371,1,"ⱬ"],[11372,2],[11373,1,"ɑ"],[11374,1,"ɱ"],[11375,1,"ɐ"],[11376,1,"ɒ"],[11377,2],[11378,1,"ⱳ"],[11379,2],[11380,2],[11381,1,"ⱶ"],[[11382,11383],2],[[11384,11387],2],[11388,1,"j"],[11389,1,"v"],[11390,1,"ȿ"],[11391,1,"ɀ"],[11392,1,"ⲁ"],[11393,2],[11394,1,"ⲃ"],[11395,2],[11396,1,"ⲅ"],[11397,2],[11398,1,"ⲇ"],[11399,2],[11400,1,"ⲉ"],[11401,2],[11402,1,"ⲋ"],[11403,2],[11404,1,"ⲍ"],[11405,2],[11406,1,"ⲏ"],[11407,2],[11408,1,"ⲑ"],[11409,2],[11410,1,"ⲓ"],[11411,2],[11412,1,"ⲕ"],[11413,2],[11414,1,"ⲗ"],[11415,2],[11416,1,"ⲙ"],[11417,2],[11418,1,"ⲛ"],[11419,2],[11420,1,"ⲝ"],[11421,2],[11422,1,"ⲟ"],[11423,2],[11424,1,"ⲡ"],[11425,2],[11426,1,"ⲣ"],[11427,2],[11428,1,"ⲥ"],[11429,2],[11430,1,"ⲧ"],[11431,2],[11432,1,"ⲩ"],[11433,2],[11434,1,"ⲫ"],[11435,2],[11436,1,"ⲭ"],[11437,2],[11438,1,"ⲯ"],[11439,2],[11440,1,"ⲱ"],[11441,2],[11442,1,"ⲳ"],[11443,2],[11444,1,"ⲵ"],[11445,2],[11446,1,"ⲷ"],[11447,2],[11448,1,"ⲹ"],[11449,2],[11450,1,"ⲻ"],[11451,2],[11452,1,"ⲽ"],[11453,2],[11454,1,"ⲿ"],[11455,2],[11456,1,"ⳁ"],[11457,2],[11458,1,"ⳃ"],[11459,2],[11460,1,"ⳅ"],[11461,2],[11462,1,"ⳇ"],[11463,2],[11464,1,"ⳉ"],[11465,2],[11466,1,"ⳋ"],[11467,2],[11468,1,"ⳍ"],[11469,2],[11470,1,"ⳏ"],[11471,2],[11472,1,"ⳑ"],[11473,2],[11474,1,"ⳓ"],[11475,2],[11476,1,"ⳕ"],[11477,2],[11478,1,"ⳗ"],[11479,2],[11480,1,"ⳙ"],[11481,2],[11482,1,"ⳛ"],[11483,2],[11484,1,"ⳝ"],[11485,2],[11486,1,"ⳟ"],[11487,2],[11488,1,"ⳡ"],[11489,2],[11490,1,"ⳣ"],[[11491,11492],2],[[11493,11498],2],[11499,1,"ⳬ"],[11500,2],[11501,1,"ⳮ"],[[11502,11505],2],[11506,1,"ⳳ"],[11507,2],[[11508,11512],3],[[11513,11519],2],[[11520,11557],2],[11558,3],[11559,2],[[11560,11564],3],[11565,2],[[11566,11567],3],[[11568,11621],2],[[11622,11623],2],[[11624,11630],3],[11631,1,"ⵡ"],[11632,2],[[11633,11646],3],[11647,2],[[11648,11670],2],[[11671,11679],3],[[11680,11686],2],[11687,3],[[11688,11694],2],[11695,3],[[11696,11702],2],[11703,3],[[11704,11710],2],[11711,3],[[11712,11718],2],[11719,3],[[11720,11726],2],[11727,3],[[11728,11734],2],[11735,3],[[11736,11742],2],[11743,3],[[11744,11775],2],[[11776,11799],2],[[11800,11803],2],[[11804,11805],2],[[11806,11822],2],[11823,2],[11824,2],[11825,2],[[11826,11835],2],[[11836,11842],2],[[11843,11844],2],[[11845,11849],2],[[11850,11854],2],[11855,2],[[11856,11858],2],[[11859,11869],2],[[11870,11903],3],[[11904,11929],2],[11930,3],[[11931,11934],2],[11935,1,"母"],[[11936,12018],2],[12019,1,"龟"],[[12020,12031],3],[12032,1,"一"],[12033,1,"丨"],[12034,1,"丶"],[12035,1,"丿"],[12036,1,"乙"],[12037,1,"亅"],[12038,1,"二"],[12039,1,"亠"],[12040,1,"人"],[12041,1,"儿"],[12042,1,"入"],[12043,1,"八"],[12044,1,"冂"],[12045,1,"冖"],[12046,1,"冫"],[12047,1,"几"],[12048,1,"凵"],[12049,1,"刀"],[12050,1,"力"],[12051,1,"勹"],[12052,1,"匕"],[12053,1,"匚"],[12054,1,"匸"],[12055,1,"十"],[12056,1,"卜"],[12057,1,"卩"],[12058,1,"厂"],[12059,1,"厶"],[12060,1,"又"],[12061,1,"口"],[12062,1,"囗"],[12063,1,"土"],[12064,1,"士"],[12065,1,"夂"],[12066,1,"夊"],[12067,1,"夕"],[12068,1,"大"],[12069,1,"女"],[12070,1,"子"],[12071,1,"宀"],[12072,1,"寸"],[12073,1,"小"],[12074,1,"尢"],[12075,1,"尸"],[12076,1,"屮"],[12077,1,"山"],[12078,1,"巛"],[12079,1,"工"],[12080,1,"己"],[12081,1,"巾"],[12082,1,"干"],[12083,1,"幺"],[12084,1,"广"],[12085,1,"廴"],[12086,1,"廾"],[12087,1,"弋"],[12088,1,"弓"],[12089,1,"彐"],[12090,1,"彡"],[12091,1,"彳"],[12092,1,"心"],[12093,1,"戈"],[12094,1,"戶"],[12095,1,"手"],[12096,1,"支"],[12097,1,"攴"],[12098,1,"文"],[12099,1,"斗"],[12100,1,"斤"],[12101,1,"方"],[12102,1,"无"],[12103,1,"日"],[12104,1,"曰"],[12105,1,"月"],[12106,1,"木"],[12107,1,"欠"],[12108,1,"止"],[12109,1,"歹"],[12110,1,"殳"],[12111,1,"毋"],[12112,1,"比"],[12113,1,"毛"],[12114,1,"氏"],[12115,1,"气"],[12116,1,"水"],[12117,1,"火"],[12118,1,"爪"],[12119,1,"父"],[12120,1,"爻"],[12121,1,"爿"],[12122,1,"片"],[12123,1,"牙"],[12124,1,"牛"],[12125,1,"犬"],[12126,1,"玄"],[12127,1,"玉"],[12128,1,"瓜"],[12129,1,"瓦"],[12130,1,"甘"],[12131,1,"生"],[12132,1,"用"],[12133,1,"田"],[12134,1,"疋"],[12135,1,"疒"],[12136,1,"癶"],[12137,1,"白"],[12138,1,"皮"],[12139,1,"皿"],[12140,1,"目"],[12141,1,"矛"],[12142,1,"矢"],[12143,1,"石"],[12144,1,"示"],[12145,1,"禸"],[12146,1,"禾"],[12147,1,"穴"],[12148,1,"立"],[12149,1,"竹"],[12150,1,"米"],[12151,1,"糸"],[12152,1,"缶"],[12153,1,"网"],[12154,1,"羊"],[12155,1,"羽"],[12156,1,"老"],[12157,1,"而"],[12158,1,"耒"],[12159,1,"耳"],[12160,1,"聿"],[12161,1,"肉"],[12162,1,"臣"],[12163,1,"自"],[12164,1,"至"],[12165,1,"臼"],[12166,1,"舌"],[12167,1,"舛"],[12168,1,"舟"],[12169,1,"艮"],[12170,1,"色"],[12171,1,"艸"],[12172,1,"虍"],[12173,1,"虫"],[12174,1,"血"],[12175,1,"行"],[12176,1,"衣"],[12177,1,"襾"],[12178,1,"見"],[12179,1,"角"],[12180,1,"言"],[12181,1,"谷"],[12182,1,"豆"],[12183,1,"豕"],[12184,1,"豸"],[12185,1,"貝"],[12186,1,"赤"],[12187,1,"走"],[12188,1,"足"],[12189,1,"身"],[12190,1,"車"],[12191,1,"辛"],[12192,1,"辰"],[12193,1,"辵"],[12194,1,"邑"],[12195,1,"酉"],[12196,1,"釆"],[12197,1,"里"],[12198,1,"金"],[12199,1,"長"],[12200,1,"門"],[12201,1,"阜"],[12202,1,"隶"],[12203,1,"隹"],[12204,1,"雨"],[12205,1,"靑"],[12206,1,"非"],[12207,1,"面"],[12208,1,"革"],[12209,1,"韋"],[12210,1,"韭"],[12211,1,"音"],[12212,1,"頁"],[12213,1,"風"],[12214,1,"飛"],[12215,1,"食"],[12216,1,"首"],[12217,1,"香"],[12218,1,"馬"],[12219,1,"骨"],[12220,1,"高"],[12221,1,"髟"],[12222,1,"鬥"],[12223,1,"鬯"],[12224,1,"鬲"],[12225,1,"鬼"],[12226,1,"魚"],[12227,1,"鳥"],[12228,1,"鹵"],[12229,1,"鹿"],[12230,1,"麥"],[12231,1,"麻"],[12232,1,"黃"],[12233,1,"黍"],[12234,1,"黑"],[12235,1,"黹"],[12236,1,"黽"],[12237,1,"鼎"],[12238,1,"鼓"],[12239,1,"鼠"],[12240,1,"鼻"],[12241,1,"齊"],[12242,1,"齒"],[12243,1,"龍"],[12244,1,"龜"],[12245,1,"龠"],[[12246,12271],3],[[12272,12283],3],[[12284,12287],3],[12288,5," "],[12289,2],[12290,1,"."],[[12291,12292],2],[[12293,12295],2],[[12296,12329],2],[[12330,12333],2],[[12334,12341],2],[12342,1,"〒"],[12343,2],[12344,1,"十"],[12345,1,"卄"],[12346,1,"卅"],[12347,2],[12348,2],[12349,2],[12350,2],[12351,2],[12352,3],[[12353,12436],2],[[12437,12438],2],[[12439,12440],3],[[12441,12442],2],[12443,5," ゙"],[12444,5," ゚"],[[12445,12446],2],[12447,1,"より"],[12448,2],[[12449,12542],2],[12543,1,"コト"],[[12544,12548],3],[[12549,12588],2],[12589,2],[12590,2],[12591,2],[12592,3],[12593,1,"ᄀ"],[12594,1,"ᄁ"],[12595,1,"ᆪ"],[12596,1,"ᄂ"],[12597,1,"ᆬ"],[12598,1,"ᆭ"],[12599,1,"ᄃ"],[12600,1,"ᄄ"],[12601,1,"ᄅ"],[12602,1,"ᆰ"],[12603,1,"ᆱ"],[12604,1,"ᆲ"],[12605,1,"ᆳ"],[12606,1,"ᆴ"],[12607,1,"ᆵ"],[12608,1,"ᄚ"],[12609,1,"ᄆ"],[12610,1,"ᄇ"],[12611,1,"ᄈ"],[12612,1,"ᄡ"],[12613,1,"ᄉ"],[12614,1,"ᄊ"],[12615,1,"ᄋ"],[12616,1,"ᄌ"],[12617,1,"ᄍ"],[12618,1,"ᄎ"],[12619,1,"ᄏ"],[12620,1,"ᄐ"],[12621,1,"ᄑ"],[12622,1,"ᄒ"],[12623,1,"ᅡ"],[12624,1,"ᅢ"],[12625,1,"ᅣ"],[12626,1,"ᅤ"],[12627,1,"ᅥ"],[12628,1,"ᅦ"],[12629,1,"ᅧ"],[12630,1,"ᅨ"],[12631,1,"ᅩ"],[12632,1,"ᅪ"],[12633,1,"ᅫ"],[12634,1,"ᅬ"],[12635,1,"ᅭ"],[12636,1,"ᅮ"],[12637,1,"ᅯ"],[12638,1,"ᅰ"],[12639,1,"ᅱ"],[12640,1,"ᅲ"],[12641,1,"ᅳ"],[12642,1,"ᅴ"],[12643,1,"ᅵ"],[12644,3],[12645,1,"ᄔ"],[12646,1,"ᄕ"],[12647,1,"ᇇ"],[12648,1,"ᇈ"],[12649,1,"ᇌ"],[12650,1,"ᇎ"],[12651,1,"ᇓ"],[12652,1,"ᇗ"],[12653,1,"ᇙ"],[12654,1,"ᄜ"],[12655,1,"ᇝ"],[12656,1,"ᇟ"],[12657,1,"ᄝ"],[12658,1,"ᄞ"],[12659,1,"ᄠ"],[12660,1,"ᄢ"],[12661,1,"ᄣ"],[12662,1,"ᄧ"],[12663,1,"ᄩ"],[12664,1,"ᄫ"],[12665,1,"ᄬ"],[12666,1,"ᄭ"],[12667,1,"ᄮ"],[12668,1,"ᄯ"],[12669,1,"ᄲ"],[12670,1,"ᄶ"],[12671,1,"ᅀ"],[12672,1,"ᅇ"],[12673,1,"ᅌ"],[12674,1,"ᇱ"],[12675,1,"ᇲ"],[12676,1,"ᅗ"],[12677,1,"ᅘ"],[12678,1,"ᅙ"],[12679,1,"ᆄ"],[12680,1,"ᆅ"],[12681,1,"ᆈ"],[12682,1,"ᆑ"],[12683,1,"ᆒ"],[12684,1,"ᆔ"],[12685,1,"ᆞ"],[12686,1,"ᆡ"],[12687,3],[[12688,12689],2],[12690,1,"一"],[12691,1,"二"],[12692,1,"三"],[12693,1,"四"],[12694,1,"上"],[12695,1,"中"],[12696,1,"下"],[12697,1,"甲"],[12698,1,"乙"],[12699,1,"丙"],[12700,1,"丁"],[12701,1,"天"],[12702,1,"地"],[12703,1,"人"],[[12704,12727],2],[[12728,12730],2],[[12731,12735],2],[[12736,12751],2],[[12752,12771],2],[[12772,12783],3],[[12784,12799],2],[12800,5,"(ᄀ)"],[12801,5,"(ᄂ)"],[12802,5,"(ᄃ)"],[12803,5,"(ᄅ)"],[12804,5,"(ᄆ)"],[12805,5,"(ᄇ)"],[12806,5,"(ᄉ)"],[12807,5,"(ᄋ)"],[12808,5,"(ᄌ)"],[12809,5,"(ᄎ)"],[12810,5,"(ᄏ)"],[12811,5,"(ᄐ)"],[12812,5,"(ᄑ)"],[12813,5,"(ᄒ)"],[12814,5,"(가)"],[12815,5,"(나)"],[12816,5,"(다)"],[12817,5,"(라)"],[12818,5,"(마)"],[12819,5,"(바)"],[12820,5,"(사)"],[12821,5,"(아)"],[12822,5,"(자)"],[12823,5,"(차)"],[12824,5,"(카)"],[12825,5,"(타)"],[12826,5,"(파)"],[12827,5,"(하)"],[12828,5,"(주)"],[12829,5,"(오전)"],[12830,5,"(오후)"],[12831,3],[12832,5,"(一)"],[12833,5,"(二)"],[12834,5,"(三)"],[12835,5,"(四)"],[12836,5,"(五)"],[12837,5,"(六)"],[12838,5,"(七)"],[12839,5,"(八)"],[12840,5,"(九)"],[12841,5,"(十)"],[12842,5,"(月)"],[12843,5,"(火)"],[12844,5,"(水)"],[12845,5,"(木)"],[12846,5,"(金)"],[12847,5,"(土)"],[12848,5,"(日)"],[12849,5,"(株)"],[12850,5,"(有)"],[12851,5,"(社)"],[12852,5,"(名)"],[12853,5,"(特)"],[12854,5,"(財)"],[12855,5,"(祝)"],[12856,5,"(労)"],[12857,5,"(代)"],[12858,5,"(呼)"],[12859,5,"(学)"],[12860,5,"(監)"],[12861,5,"(企)"],[12862,5,"(資)"],[12863,5,"(協)"],[12864,5,"(祭)"],[12865,5,"(休)"],[12866,5,"(自)"],[12867,5,"(至)"],[12868,1,"問"],[12869,1,"幼"],[12870,1,"文"],[12871,1,"箏"],[[12872,12879],2],[12880,1,"pte"],[12881,1,"21"],[12882,1,"22"],[12883,1,"23"],[12884,1,"24"],[12885,1,"25"],[12886,1,"26"],[12887,1,"27"],[12888,1,"28"],[12889,1,"29"],[12890,1,"30"],[12891,1,"31"],[12892,1,"32"],[12893,1,"33"],[12894,1,"34"],[12895,1,"35"],[12896,1,"ᄀ"],[12897,1,"ᄂ"],[12898,1,"ᄃ"],[12899,1,"ᄅ"],[12900,1,"ᄆ"],[12901,1,"ᄇ"],[12902,1,"ᄉ"],[12903,1,"ᄋ"],[12904,1,"ᄌ"],[12905,1,"ᄎ"],[12906,1,"ᄏ"],[12907,1,"ᄐ"],[12908,1,"ᄑ"],[12909,1,"ᄒ"],[12910,1,"가"],[12911,1,"나"],[12912,1,"다"],[12913,1,"라"],[12914,1,"마"],[12915,1,"바"],[12916,1,"사"],[12917,1,"아"],[12918,1,"자"],[12919,1,"차"],[12920,1,"카"],[12921,1,"타"],[12922,1,"파"],[12923,1,"하"],[12924,1,"참고"],[12925,1,"주의"],[12926,1,"우"],[12927,2],[12928,1,"一"],[12929,1,"二"],[12930,1,"三"],[12931,1,"四"],[12932,1,"五"],[12933,1,"六"],[12934,1,"七"],[12935,1,"八"],[12936,1,"九"],[12937,1,"十"],[12938,1,"月"],[12939,1,"火"],[12940,1,"水"],[12941,1,"木"],[12942,1,"金"],[12943,1,"土"],[12944,1,"日"],[12945,1,"株"],[12946,1,"有"],[12947,1,"社"],[12948,1,"名"],[12949,1,"特"],[12950,1,"財"],[12951,1,"祝"],[12952,1,"労"],[12953,1,"秘"],[12954,1,"男"],[12955,1,"女"],[12956,1,"適"],[12957,1,"優"],[12958,1,"印"],[12959,1,"注"],[12960,1,"項"],[12961,1,"休"],[12962,1,"写"],[12963,1,"正"],[12964,1,"上"],[12965,1,"中"],[12966,1,"下"],[12967,1,"左"],[12968,1,"右"],[12969,1,"医"],[12970,1,"宗"],[12971,1,"学"],[12972,1,"監"],[12973,1,"企"],[12974,1,"資"],[12975,1,"協"],[12976,1,"夜"],[12977,1,"36"],[12978,1,"37"],[12979,1,"38"],[12980,1,"39"],[12981,1,"40"],[12982,1,"41"],[12983,1,"42"],[12984,1,"43"],[12985,1,"44"],[12986,1,"45"],[12987,1,"46"],[12988,1,"47"],[12989,1,"48"],[12990,1,"49"],[12991,1,"50"],[12992,1,"1月"],[12993,1,"2月"],[12994,1,"3月"],[12995,1,"4月"],[12996,1,"5月"],[12997,1,"6月"],[12998,1,"7月"],[12999,1,"8月"],[13000,1,"9月"],[13001,1,"10月"],[13002,1,"11月"],[13003,1,"12月"],[13004,1,"hg"],[13005,1,"erg"],[13006,1,"ev"],[13007,1,"ltd"],[13008,1,"ア"],[13009,1,"イ"],[13010,1,"ウ"],[13011,1,"エ"],[13012,1,"オ"],[13013,1,"カ"],[13014,1,"キ"],[13015,1,"ク"],[13016,1,"ケ"],[13017,1,"コ"],[13018,1,"サ"],[13019,1,"シ"],[13020,1,"ス"],[13021,1,"セ"],[13022,1,"ソ"],[13023,1,"タ"],[13024,1,"チ"],[13025,1,"ツ"],[13026,1,"テ"],[13027,1,"ト"],[13028,1,"ナ"],[13029,1,"ニ"],[13030,1,"ヌ"],[13031,1,"ネ"],[13032,1,"ノ"],[13033,1,"ハ"],[13034,1,"ヒ"],[13035,1,"フ"],[13036,1,"ヘ"],[13037,1,"ホ"],[13038,1,"マ"],[13039,1,"ミ"],[13040,1,"ム"],[13041,1,"メ"],[13042,1,"モ"],[13043,1,"ヤ"],[13044,1,"ユ"],[13045,1,"ヨ"],[13046,1,"ラ"],[13047,1,"リ"],[13048,1,"ル"],[13049,1,"レ"],[13050,1,"ロ"],[13051,1,"ワ"],[13052,1,"ヰ"],[13053,1,"ヱ"],[13054,1,"ヲ"],[13055,1,"令和"],[13056,1,"アパート"],[13057,1,"アルファ"],[13058,1,"アンペア"],[13059,1,"アール"],[13060,1,"イニング"],[13061,1,"インチ"],[13062,1,"ウォン"],[13063,1,"エスクード"],[13064,1,"エーカー"],[13065,1,"オンス"],[13066,1,"オーム"],[13067,1,"カイリ"],[13068,1,"カラット"],[13069,1,"カロリー"],[13070,1,"ガロン"],[13071,1,"ガンマ"],[13072,1,"ギガ"],[13073,1,"ギニー"],[13074,1,"キュリー"],[13075,1,"ギルダー"],[13076,1,"キロ"],[13077,1,"キログラム"],[13078,1,"キロメートル"],[13079,1,"キロワット"],[13080,1,"グラム"],[13081,1,"グラムトン"],[13082,1,"クルゼイロ"],[13083,1,"クローネ"],[13084,1,"ケース"],[13085,1,"コルナ"],[13086,1,"コーポ"],[13087,1,"サイクル"],[13088,1,"サンチーム"],[13089,1,"シリング"],[13090,1,"センチ"],[13091,1,"セント"],[13092,1,"ダース"],[13093,1,"デシ"],[13094,1,"ドル"],[13095,1,"トン"],[13096,1,"ナノ"],[13097,1,"ノット"],[13098,1,"ハイツ"],[13099,1,"パーセント"],[13100,1,"パーツ"],[13101,1,"バーレル"],[13102,1,"ピアストル"],[13103,1,"ピクル"],[13104,1,"ピコ"],[13105,1,"ビル"],[13106,1,"ファラッド"],[13107,1,"フィート"],[13108,1,"ブッシェル"],[13109,1,"フラン"],[13110,1,"ヘクタール"],[13111,1,"ペソ"],[13112,1,"ペニヒ"],[13113,1,"ヘルツ"],[13114,1,"ペンス"],[13115,1,"ページ"],[13116,1,"ベータ"],[13117,1,"ポイント"],[13118,1,"ボルト"],[13119,1,"ホン"],[13120,1,"ポンド"],[13121,1,"ホール"],[13122,1,"ホーン"],[13123,1,"マイクロ"],[13124,1,"マイル"],[13125,1,"マッハ"],[13126,1,"マルク"],[13127,1,"マンション"],[13128,1,"ミクロン"],[13129,1,"ミリ"],[13130,1,"ミリバール"],[13131,1,"メガ"],[13132,1,"メガトン"],[13133,1,"メートル"],[13134,1,"ヤード"],[13135,1,"ヤール"],[13136,1,"ユアン"],[13137,1,"リットル"],[13138,1,"リラ"],[13139,1,"ルピー"],[13140,1,"ルーブル"],[13141,1,"レム"],[13142,1,"レントゲン"],[13143,1,"ワット"],[13144,1,"0点"],[13145,1,"1点"],[13146,1,"2点"],[13147,1,"3点"],[13148,1,"4点"],[13149,1,"5点"],[13150,1,"6点"],[13151,1,"7点"],[13152,1,"8点"],[13153,1,"9点"],[13154,1,"10点"],[13155,1,"11点"],[13156,1,"12点"],[13157,1,"13点"],[13158,1,"14点"],[13159,1,"15点"],[13160,1,"16点"],[13161,1,"17点"],[13162,1,"18点"],[13163,1,"19点"],[13164,1,"20点"],[13165,1,"21点"],[13166,1,"22点"],[13167,1,"23点"],[13168,1,"24点"],[13169,1,"hpa"],[13170,1,"da"],[13171,1,"au"],[13172,1,"bar"],[13173,1,"ov"],[13174,1,"pc"],[13175,1,"dm"],[13176,1,"dm2"],[13177,1,"dm3"],[13178,1,"iu"],[13179,1,"平成"],[13180,1,"昭和"],[13181,1,"大正"],[13182,1,"明治"],[13183,1,"株式会社"],[13184,1,"pa"],[13185,1,"na"],[13186,1,"μa"],[13187,1,"ma"],[13188,1,"ka"],[13189,1,"kb"],[13190,1,"mb"],[13191,1,"gb"],[13192,1,"cal"],[13193,1,"kcal"],[13194,1,"pf"],[13195,1,"nf"],[13196,1,"μf"],[13197,1,"μg"],[13198,1,"mg"],[13199,1,"kg"],[13200,1,"hz"],[13201,1,"khz"],[13202,1,"mhz"],[13203,1,"ghz"],[13204,1,"thz"],[13205,1,"μl"],[13206,1,"ml"],[13207,1,"dl"],[13208,1,"kl"],[13209,1,"fm"],[13210,1,"nm"],[13211,1,"μm"],[13212,1,"mm"],[13213,1,"cm"],[13214,1,"km"],[13215,1,"mm2"],[13216,1,"cm2"],[13217,1,"m2"],[13218,1,"km2"],[13219,1,"mm3"],[13220,1,"cm3"],[13221,1,"m3"],[13222,1,"km3"],[13223,1,"m∕s"],[13224,1,"m∕s2"],[13225,1,"pa"],[13226,1,"kpa"],[13227,1,"mpa"],[13228,1,"gpa"],[13229,1,"rad"],[13230,1,"rad∕s"],[13231,1,"rad∕s2"],[13232,1,"ps"],[13233,1,"ns"],[13234,1,"μs"],[13235,1,"ms"],[13236,1,"pv"],[13237,1,"nv"],[13238,1,"μv"],[13239,1,"mv"],[13240,1,"kv"],[13241,1,"mv"],[13242,1,"pw"],[13243,1,"nw"],[13244,1,"μw"],[13245,1,"mw"],[13246,1,"kw"],[13247,1,"mw"],[13248,1,"kω"],[13249,1,"mω"],[13250,3],[13251,1,"bq"],[13252,1,"cc"],[13253,1,"cd"],[13254,1,"c∕kg"],[13255,3],[13256,1,"db"],[13257,1,"gy"],[13258,1,"ha"],[13259,1,"hp"],[13260,1,"in"],[13261,1,"kk"],[13262,1,"km"],[13263,1,"kt"],[13264,1,"lm"],[13265,1,"ln"],[13266,1,"log"],[13267,1,"lx"],[13268,1,"mb"],[13269,1,"mil"],[13270,1,"mol"],[13271,1,"ph"],[13272,3],[13273,1,"ppm"],[13274,1,"pr"],[13275,1,"sr"],[13276,1,"sv"],[13277,1,"wb"],[13278,1,"v∕m"],[13279,1,"a∕m"],[13280,1,"1日"],[13281,1,"2日"],[13282,1,"3日"],[13283,1,"4日"],[13284,1,"5日"],[13285,1,"6日"],[13286,1,"7日"],[13287,1,"8日"],[13288,1,"9日"],[13289,1,"10日"],[13290,1,"11日"],[13291,1,"12日"],[13292,1,"13日"],[13293,1,"14日"],[13294,1,"15日"],[13295,1,"16日"],[13296,1,"17日"],[13297,1,"18日"],[13298,1,"19日"],[13299,1,"20日"],[13300,1,"21日"],[13301,1,"22日"],[13302,1,"23日"],[13303,1,"24日"],[13304,1,"25日"],[13305,1,"26日"],[13306,1,"27日"],[13307,1,"28日"],[13308,1,"29日"],[13309,1,"30日"],[13310,1,"31日"],[13311,1,"gal"],[[13312,19893],2],[[19894,19903],2],[[19904,19967],2],[[19968,40869],2],[[40870,40891],2],[[40892,40899],2],[[40900,40907],2],[40908,2],[[40909,40917],2],[[40918,40938],2],[[40939,40943],2],[[40944,40956],2],[[40957,40959],2],[[40960,42124],2],[[42125,42127],3],[[42128,42145],2],[[42146,42147],2],[[42148,42163],2],[42164,2],[[42165,42176],2],[42177,2],[[42178,42180],2],[42181,2],[42182,2],[[42183,42191],3],[[42192,42237],2],[[42238,42239],2],[[42240,42508],2],[[42509,42511],2],[[42512,42539],2],[[42540,42559],3],[42560,1,"ꙁ"],[42561,2],[42562,1,"ꙃ"],[42563,2],[42564,1,"ꙅ"],[42565,2],[42566,1,"ꙇ"],[42567,2],[42568,1,"ꙉ"],[42569,2],[42570,1,"ꙋ"],[42571,2],[42572,1,"ꙍ"],[42573,2],[42574,1,"ꙏ"],[42575,2],[42576,1,"ꙑ"],[42577,2],[42578,1,"ꙓ"],[42579,2],[42580,1,"ꙕ"],[42581,2],[42582,1,"ꙗ"],[42583,2],[42584,1,"ꙙ"],[42585,2],[42586,1,"ꙛ"],[42587,2],[42588,1,"ꙝ"],[42589,2],[42590,1,"ꙟ"],[42591,2],[42592,1,"ꙡ"],[42593,2],[42594,1,"ꙣ"],[42595,2],[42596,1,"ꙥ"],[42597,2],[42598,1,"ꙧ"],[42599,2],[42600,1,"ꙩ"],[42601,2],[42602,1,"ꙫ"],[42603,2],[42604,1,"ꙭ"],[[42605,42607],2],[[42608,42611],2],[[42612,42619],2],[[42620,42621],2],[42622,2],[42623,2],[42624,1,"ꚁ"],[42625,2],[42626,1,"ꚃ"],[42627,2],[42628,1,"ꚅ"],[42629,2],[42630,1,"ꚇ"],[42631,2],[42632,1,"ꚉ"],[42633,2],[42634,1,"ꚋ"],[42635,2],[42636,1,"ꚍ"],[42637,2],[42638,1,"ꚏ"],[42639,2],[42640,1,"ꚑ"],[42641,2],[42642,1,"ꚓ"],[42643,2],[42644,1,"ꚕ"],[42645,2],[42646,1,"ꚗ"],[42647,2],[42648,1,"ꚙ"],[42649,2],[42650,1,"ꚛ"],[42651,2],[42652,1,"ъ"],[42653,1,"ь"],[42654,2],[42655,2],[[42656,42725],2],[[42726,42735],2],[[42736,42737],2],[[42738,42743],2],[[42744,42751],3],[[42752,42774],2],[[42775,42778],2],[[42779,42783],2],[[42784,42785],2],[42786,1,"ꜣ"],[42787,2],[42788,1,"ꜥ"],[42789,2],[42790,1,"ꜧ"],[42791,2],[42792,1,"ꜩ"],[42793,2],[42794,1,"ꜫ"],[42795,2],[42796,1,"ꜭ"],[42797,2],[42798,1,"ꜯ"],[[42799,42801],2],[42802,1,"ꜳ"],[42803,2],[42804,1,"ꜵ"],[42805,2],[42806,1,"ꜷ"],[42807,2],[42808,1,"ꜹ"],[42809,2],[42810,1,"ꜻ"],[42811,2],[42812,1,"ꜽ"],[42813,2],[42814,1,"ꜿ"],[42815,2],[42816,1,"ꝁ"],[42817,2],[42818,1,"ꝃ"],[42819,2],[42820,1,"ꝅ"],[42821,2],[42822,1,"ꝇ"],[42823,2],[42824,1,"ꝉ"],[42825,2],[42826,1,"ꝋ"],[42827,2],[42828,1,"ꝍ"],[42829,2],[42830,1,"ꝏ"],[42831,2],[42832,1,"ꝑ"],[42833,2],[42834,1,"ꝓ"],[42835,2],[42836,1,"ꝕ"],[42837,2],[42838,1,"ꝗ"],[42839,2],[42840,1,"ꝙ"],[42841,2],[42842,1,"ꝛ"],[42843,2],[42844,1,"ꝝ"],[42845,2],[42846,1,"ꝟ"],[42847,2],[42848,1,"ꝡ"],[42849,2],[42850,1,"ꝣ"],[42851,2],[42852,1,"ꝥ"],[42853,2],[42854,1,"ꝧ"],[42855,2],[42856,1,"ꝩ"],[42857,2],[42858,1,"ꝫ"],[42859,2],[42860,1,"ꝭ"],[42861,2],[42862,1,"ꝯ"],[42863,2],[42864,1,"ꝯ"],[[42865,42872],2],[42873,1,"ꝺ"],[42874,2],[42875,1,"ꝼ"],[42876,2],[42877,1,"ᵹ"],[42878,1,"ꝿ"],[42879,2],[42880,1,"ꞁ"],[42881,2],[42882,1,"ꞃ"],[42883,2],[42884,1,"ꞅ"],[42885,2],[42886,1,"ꞇ"],[[42887,42888],2],[[42889,42890],2],[42891,1,"ꞌ"],[42892,2],[42893,1,"ɥ"],[42894,2],[42895,2],[42896,1,"ꞑ"],[42897,2],[42898,1,"ꞓ"],[42899,2],[[42900,42901],2],[42902,1,"ꞗ"],[42903,2],[42904,1,"ꞙ"],[42905,2],[42906,1,"ꞛ"],[42907,2],[42908,1,"ꞝ"],[42909,2],[42910,1,"ꞟ"],[42911,2],[42912,1,"ꞡ"],[42913,2],[42914,1,"ꞣ"],[42915,2],[42916,1,"ꞥ"],[42917,2],[42918,1,"ꞧ"],[42919,2],[42920,1,"ꞩ"],[42921,2],[42922,1,"ɦ"],[42923,1,"ɜ"],[42924,1,"ɡ"],[42925,1,"ɬ"],[42926,1,"ɪ"],[42927,2],[42928,1,"ʞ"],[42929,1,"ʇ"],[42930,1,"ʝ"],[42931,1,"ꭓ"],[42932,1,"ꞵ"],[42933,2],[42934,1,"ꞷ"],[42935,2],[42936,1,"ꞹ"],[42937,2],[42938,1,"ꞻ"],[42939,2],[42940,1,"ꞽ"],[42941,2],[42942,1,"ꞿ"],[42943,2],[42944,1,"ꟁ"],[42945,2],[42946,1,"ꟃ"],[42947,2],[42948,1,"ꞔ"],[42949,1,"ʂ"],[42950,1,"ᶎ"],[42951,1,"ꟈ"],[42952,2],[42953,1,"ꟊ"],[42954,2],[[42955,42959],3],[42960,1,"ꟑ"],[42961,2],[42962,3],[42963,2],[42964,3],[42965,2],[42966,1,"ꟗ"],[42967,2],[42968,1,"ꟙ"],[42969,2],[[42970,42993],3],[42994,1,"c"],[42995,1,"f"],[42996,1,"q"],[42997,1,"ꟶ"],[42998,2],[42999,2],[43000,1,"ħ"],[43001,1,"œ"],[43002,2],[[43003,43007],2],[[43008,43047],2],[[43048,43051],2],[43052,2],[[43053,43055],3],[[43056,43065],2],[[43066,43071],3],[[43072,43123],2],[[43124,43127],2],[[43128,43135],3],[[43136,43204],2],[43205,2],[[43206,43213],3],[[43214,43215],2],[[43216,43225],2],[[43226,43231],3],[[43232,43255],2],[[43256,43258],2],[43259,2],[43260,2],[43261,2],[[43262,43263],2],[[43264,43309],2],[[43310,43311],2],[[43312,43347],2],[[43348,43358],3],[43359,2],[[43360,43388],2],[[43389,43391],3],[[43392,43456],2],[[43457,43469],2],[43470,3],[[43471,43481],2],[[43482,43485],3],[[43486,43487],2],[[43488,43518],2],[43519,3],[[43520,43574],2],[[43575,43583],3],[[43584,43597],2],[[43598,43599],3],[[43600,43609],2],[[43610,43611],3],[[43612,43615],2],[[43616,43638],2],[[43639,43641],2],[[43642,43643],2],[[43644,43647],2],[[43648,43714],2],[[43715,43738],3],[[43739,43741],2],[[43742,43743],2],[[43744,43759],2],[[43760,43761],2],[[43762,43766],2],[[43767,43776],3],[[43777,43782],2],[[43783,43784],3],[[43785,43790],2],[[43791,43792],3],[[43793,43798],2],[[43799,43807],3],[[43808,43814],2],[43815,3],[[43816,43822],2],[43823,3],[[43824,43866],2],[43867,2],[43868,1,"ꜧ"],[43869,1,"ꬷ"],[43870,1,"ɫ"],[43871,1,"ꭒ"],[[43872,43875],2],[[43876,43877],2],[[43878,43879],2],[43880,2],[43881,1,"ʍ"],[[43882,43883],2],[[43884,43887],3],[43888,1,"Ꭰ"],[43889,1,"Ꭱ"],[43890,1,"Ꭲ"],[43891,1,"Ꭳ"],[43892,1,"Ꭴ"],[43893,1,"Ꭵ"],[43894,1,"Ꭶ"],[43895,1,"Ꭷ"],[43896,1,"Ꭸ"],[43897,1,"Ꭹ"],[43898,1,"Ꭺ"],[43899,1,"Ꭻ"],[43900,1,"Ꭼ"],[43901,1,"Ꭽ"],[43902,1,"Ꭾ"],[43903,1,"Ꭿ"],[43904,1,"Ꮀ"],[43905,1,"Ꮁ"],[43906,1,"Ꮂ"],[43907,1,"Ꮃ"],[43908,1,"Ꮄ"],[43909,1,"Ꮅ"],[43910,1,"Ꮆ"],[43911,1,"Ꮇ"],[43912,1,"Ꮈ"],[43913,1,"Ꮉ"],[43914,1,"Ꮊ"],[43915,1,"Ꮋ"],[43916,1,"Ꮌ"],[43917,1,"Ꮍ"],[43918,1,"Ꮎ"],[43919,1,"Ꮏ"],[43920,1,"Ꮐ"],[43921,1,"Ꮑ"],[43922,1,"Ꮒ"],[43923,1,"Ꮓ"],[43924,1,"Ꮔ"],[43925,1,"Ꮕ"],[43926,1,"Ꮖ"],[43927,1,"Ꮗ"],[43928,1,"Ꮘ"],[43929,1,"Ꮙ"],[43930,1,"Ꮚ"],[43931,1,"Ꮛ"],[43932,1,"Ꮜ"],[43933,1,"Ꮝ"],[43934,1,"Ꮞ"],[43935,1,"Ꮟ"],[43936,1,"Ꮠ"],[43937,1,"Ꮡ"],[43938,1,"Ꮢ"],[43939,1,"Ꮣ"],[43940,1,"Ꮤ"],[43941,1,"Ꮥ"],[43942,1,"Ꮦ"],[43943,1,"Ꮧ"],[43944,1,"Ꮨ"],[43945,1,"Ꮩ"],[43946,1,"Ꮪ"],[43947,1,"Ꮫ"],[43948,1,"Ꮬ"],[43949,1,"Ꮭ"],[43950,1,"Ꮮ"],[43951,1,"Ꮯ"],[43952,1,"Ꮰ"],[43953,1,"Ꮱ"],[43954,1,"Ꮲ"],[43955,1,"Ꮳ"],[43956,1,"Ꮴ"],[43957,1,"Ꮵ"],[43958,1,"Ꮶ"],[43959,1,"Ꮷ"],[43960,1,"Ꮸ"],[43961,1,"Ꮹ"],[43962,1,"Ꮺ"],[43963,1,"Ꮻ"],[43964,1,"Ꮼ"],[43965,1,"Ꮽ"],[43966,1,"Ꮾ"],[43967,1,"Ꮿ"],[[43968,44010],2],[44011,2],[[44012,44013],2],[[44014,44015],3],[[44016,44025],2],[[44026,44031],3],[[44032,55203],2],[[55204,55215],3],[[55216,55238],2],[[55239,55242],3],[[55243,55291],2],[[55292,55295],3],[[55296,57343],3],[[57344,63743],3],[63744,1,"豈"],[63745,1,"更"],[63746,1,"車"],[63747,1,"賈"],[63748,1,"滑"],[63749,1,"串"],[63750,1,"句"],[[63751,63752],1,"龜"],[63753,1,"契"],[63754,1,"金"],[63755,1,"喇"],[63756,1,"奈"],[63757,1,"懶"],[63758,1,"癩"],[63759,1,"羅"],[63760,1,"蘿"],[63761,1,"螺"],[63762,1,"裸"],[63763,1,"邏"],[63764,1,"樂"],[63765,1,"洛"],[63766,1,"烙"],[63767,1,"珞"],[63768,1,"落"],[63769,1,"酪"],[63770,1,"駱"],[63771,1,"亂"],[63772,1,"卵"],[63773,1,"欄"],[63774,1,"爛"],[63775,1,"蘭"],[63776,1,"鸞"],[63777,1,"嵐"],[63778,1,"濫"],[63779,1,"藍"],[63780,1,"襤"],[63781,1,"拉"],[63782,1,"臘"],[63783,1,"蠟"],[63784,1,"廊"],[63785,1,"朗"],[63786,1,"浪"],[63787,1,"狼"],[63788,1,"郎"],[63789,1,"來"],[63790,1,"冷"],[63791,1,"勞"],[63792,1,"擄"],[63793,1,"櫓"],[63794,1,"爐"],[63795,1,"盧"],[63796,1,"老"],[63797,1,"蘆"],[63798,1,"虜"],[63799,1,"路"],[63800,1,"露"],[63801,1,"魯"],[63802,1,"鷺"],[63803,1,"碌"],[63804,1,"祿"],[63805,1,"綠"],[63806,1,"菉"],[63807,1,"錄"],[63808,1,"鹿"],[63809,1,"論"],[63810,1,"壟"],[63811,1,"弄"],[63812,1,"籠"],[63813,1,"聾"],[63814,1,"牢"],[63815,1,"磊"],[63816,1,"賂"],[63817,1,"雷"],[63818,1,"壘"],[63819,1,"屢"],[63820,1,"樓"],[63821,1,"淚"],[63822,1,"漏"],[63823,1,"累"],[63824,1,"縷"],[63825,1,"陋"],[63826,1,"勒"],[63827,1,"肋"],[63828,1,"凜"],[63829,1,"凌"],[63830,1,"稜"],[63831,1,"綾"],[63832,1,"菱"],[63833,1,"陵"],[63834,1,"讀"],[63835,1,"拏"],[63836,1,"樂"],[63837,1,"諾"],[63838,1,"丹"],[63839,1,"寧"],[63840,1,"怒"],[63841,1,"率"],[63842,1,"異"],[63843,1,"北"],[63844,1,"磻"],[63845,1,"便"],[63846,1,"復"],[63847,1,"不"],[63848,1,"泌"],[63849,1,"數"],[63850,1,"索"],[63851,1,"參"],[63852,1,"塞"],[63853,1,"省"],[63854,1,"葉"],[63855,1,"說"],[63856,1,"殺"],[63857,1,"辰"],[63858,1,"沈"],[63859,1,"拾"],[63860,1,"若"],[63861,1,"掠"],[63862,1,"略"],[63863,1,"亮"],[63864,1,"兩"],[63865,1,"凉"],[63866,1,"梁"],[63867,1,"糧"],[63868,1,"良"],[63869,1,"諒"],[63870,1,"量"],[63871,1,"勵"],[63872,1,"呂"],[63873,1,"女"],[63874,1,"廬"],[63875,1,"旅"],[63876,1,"濾"],[63877,1,"礪"],[63878,1,"閭"],[63879,1,"驪"],[63880,1,"麗"],[63881,1,"黎"],[63882,1,"力"],[63883,1,"曆"],[63884,1,"歷"],[63885,1,"轢"],[63886,1,"年"],[63887,1,"憐"],[63888,1,"戀"],[63889,1,"撚"],[63890,1,"漣"],[63891,1,"煉"],[63892,1,"璉"],[63893,1,"秊"],[63894,1,"練"],[63895,1,"聯"],[63896,1,"輦"],[63897,1,"蓮"],[63898,1,"連"],[63899,1,"鍊"],[63900,1,"列"],[63901,1,"劣"],[63902,1,"咽"],[63903,1,"烈"],[63904,1,"裂"],[63905,1,"說"],[63906,1,"廉"],[63907,1,"念"],[63908,1,"捻"],[63909,1,"殮"],[63910,1,"簾"],[63911,1,"獵"],[63912,1,"令"],[63913,1,"囹"],[63914,1,"寧"],[63915,1,"嶺"],[63916,1,"怜"],[63917,1,"玲"],[63918,1,"瑩"],[63919,1,"羚"],[63920,1,"聆"],[63921,1,"鈴"],[63922,1,"零"],[63923,1,"靈"],[63924,1,"領"],[63925,1,"例"],[63926,1,"禮"],[63927,1,"醴"],[63928,1,"隸"],[63929,1,"惡"],[63930,1,"了"],[63931,1,"僚"],[63932,1,"寮"],[63933,1,"尿"],[63934,1,"料"],[63935,1,"樂"],[63936,1,"燎"],[63937,1,"療"],[63938,1,"蓼"],[63939,1,"遼"],[63940,1,"龍"],[63941,1,"暈"],[63942,1,"阮"],[63943,1,"劉"],[63944,1,"杻"],[63945,1,"柳"],[63946,1,"流"],[63947,1,"溜"],[63948,1,"琉"],[63949,1,"留"],[63950,1,"硫"],[63951,1,"紐"],[63952,1,"類"],[63953,1,"六"],[63954,1,"戮"],[63955,1,"陸"],[63956,1,"倫"],[63957,1,"崙"],[63958,1,"淪"],[63959,1,"輪"],[63960,1,"律"],[63961,1,"慄"],[63962,1,"栗"],[63963,1,"率"],[63964,1,"隆"],[63965,1,"利"],[63966,1,"吏"],[63967,1,"履"],[63968,1,"易"],[63969,1,"李"],[63970,1,"梨"],[63971,1,"泥"],[63972,1,"理"],[63973,1,"痢"],[63974,1,"罹"],[63975,1,"裏"],[63976,1,"裡"],[63977,1,"里"],[63978,1,"離"],[63979,1,"匿"],[63980,1,"溺"],[63981,1,"吝"],[63982,1,"燐"],[63983,1,"璘"],[63984,1,"藺"],[63985,1,"隣"],[63986,1,"鱗"],[63987,1,"麟"],[63988,1,"林"],[63989,1,"淋"],[63990,1,"臨"],[63991,1,"立"],[63992,1,"笠"],[63993,1,"粒"],[63994,1,"狀"],[63995,1,"炙"],[63996,1,"識"],[63997,1,"什"],[63998,1,"茶"],[63999,1,"刺"],[64000,1,"切"],[64001,1,"度"],[64002,1,"拓"],[64003,1,"糖"],[64004,1,"宅"],[64005,1,"洞"],[64006,1,"暴"],[64007,1,"輻"],[64008,1,"行"],[64009,1,"降"],[64010,1,"見"],[64011,1,"廓"],[64012,1,"兀"],[64013,1,"嗀"],[[64014,64015],2],[64016,1,"塚"],[64017,2],[64018,1,"晴"],[[64019,64020],2],[64021,1,"凞"],[64022,1,"猪"],[64023,1,"益"],[64024,1,"礼"],[64025,1,"神"],[64026,1,"祥"],[64027,1,"福"],[64028,1,"靖"],[64029,1,"精"],[64030,1,"羽"],[64031,2],[64032,1,"蘒"],[64033,2],[64034,1,"諸"],[[64035,64036],2],[64037,1,"逸"],[64038,1,"都"],[[64039,64041],2],[64042,1,"飯"],[64043,1,"飼"],[64044,1,"館"],[64045,1,"鶴"],[64046,1,"郞"],[64047,1,"隷"],[64048,1,"侮"],[64049,1,"僧"],[64050,1,"免"],[64051,1,"勉"],[64052,1,"勤"],[64053,1,"卑"],[64054,1,"喝"],[64055,1,"嘆"],[64056,1,"器"],[64057,1,"塀"],[64058,1,"墨"],[64059,1,"層"],[64060,1,"屮"],[64061,1,"悔"],[64062,1,"慨"],[64063,1,"憎"],[64064,1,"懲"],[64065,1,"敏"],[64066,1,"既"],[64067,1,"暑"],[64068,1,"梅"],[64069,1,"海"],[64070,1,"渚"],[64071,1,"漢"],[64072,1,"煮"],[64073,1,"爫"],[64074,1,"琢"],[64075,1,"碑"],[64076,1,"社"],[64077,1,"祉"],[64078,1,"祈"],[64079,1,"祐"],[64080,1,"祖"],[64081,1,"祝"],[64082,1,"禍"],[64083,1,"禎"],[64084,1,"穀"],[64085,1,"突"],[64086,1,"節"],[64087,1,"練"],[64088,1,"縉"],[64089,1,"繁"],[64090,1,"署"],[64091,1,"者"],[64092,1,"臭"],[[64093,64094],1,"艹"],[64095,1,"著"],[64096,1,"褐"],[64097,1,"視"],[64098,1,"謁"],[64099,1,"謹"],[64100,1,"賓"],[64101,1,"贈"],[64102,1,"辶"],[64103,1,"逸"],[64104,1,"難"],[64105,1,"響"],[64106,1,"頻"],[64107,1,"恵"],[64108,1,"𤋮"],[64109,1,"舘"],[[64110,64111],3],[64112,1,"並"],[64113,1,"况"],[64114,1,"全"],[64115,1,"侀"],[64116,1,"充"],[64117,1,"冀"],[64118,1,"勇"],[64119,1,"勺"],[64120,1,"喝"],[64121,1,"啕"],[64122,1,"喙"],[64123,1,"嗢"],[64124,1,"塚"],[64125,1,"墳"],[64126,1,"奄"],[64127,1,"奔"],[64128,1,"婢"],[64129,1,"嬨"],[64130,1,"廒"],[64131,1,"廙"],[64132,1,"彩"],[64133,1,"徭"],[64134,1,"惘"],[64135,1,"慎"],[64136,1,"愈"],[64137,1,"憎"],[64138,1,"慠"],[64139,1,"懲"],[64140,1,"戴"],[64141,1,"揄"],[64142,1,"搜"],[64143,1,"摒"],[64144,1,"敖"],[64145,1,"晴"],[64146,1,"朗"],[64147,1,"望"],[64148,1,"杖"],[64149,1,"歹"],[64150,1,"殺"],[64151,1,"流"],[64152,1,"滛"],[64153,1,"滋"],[64154,1,"漢"],[64155,1,"瀞"],[64156,1,"煮"],[64157,1,"瞧"],[64158,1,"爵"],[64159,1,"犯"],[64160,1,"猪"],[64161,1,"瑱"],[64162,1,"甆"],[64163,1,"画"],[64164,1,"瘝"],[64165,1,"瘟"],[64166,1,"益"],[64167,1,"盛"],[64168,1,"直"],[64169,1,"睊"],[64170,1,"着"],[64171,1,"磌"],[64172,1,"窱"],[64173,1,"節"],[64174,1,"类"],[64175,1,"絛"],[64176,1,"練"],[64177,1,"缾"],[64178,1,"者"],[64179,1,"荒"],[64180,1,"華"],[64181,1,"蝹"],[64182,1,"襁"],[64183,1,"覆"],[64184,1,"視"],[64185,1,"調"],[64186,1,"諸"],[64187,1,"請"],[64188,1,"謁"],[64189,1,"諾"],[64190,1,"諭"],[64191,1,"謹"],[64192,1,"變"],[64193,1,"贈"],[64194,1,"輸"],[64195,1,"遲"],[64196,1,"醙"],[64197,1,"鉶"],[64198,1,"陼"],[64199,1,"難"],[64200,1,"靖"],[64201,1,"韛"],[64202,1,"響"],[64203,1,"頋"],[64204,1,"頻"],[64205,1,"鬒"],[64206,1,"龜"],[64207,1,"𢡊"],[64208,1,"𢡄"],[64209,1,"𣏕"],[64210,1,"㮝"],[64211,1,"䀘"],[64212,1,"䀹"],[64213,1,"𥉉"],[64214,1,"𥳐"],[64215,1,"𧻓"],[64216,1,"齃"],[64217,1,"龎"],[[64218,64255],3],[64256,1,"ff"],[64257,1,"fi"],[64258,1,"fl"],[64259,1,"ffi"],[64260,1,"ffl"],[[64261,64262],1,"st"],[[64263,64274],3],[64275,1,"մն"],[64276,1,"մե"],[64277,1,"մի"],[64278,1,"վն"],[64279,1,"մխ"],[[64280,64284],3],[64285,1,"יִ"],[64286,2],[64287,1,"ײַ"],[64288,1,"ע"],[64289,1,"א"],[64290,1,"ד"],[64291,1,"ה"],[64292,1,"כ"],[64293,1,"ל"],[64294,1,"ם"],[64295,1,"ר"],[64296,1,"ת"],[64297,5,"+"],[64298,1,"שׁ"],[64299,1,"שׂ"],[64300,1,"שּׁ"],[64301,1,"שּׂ"],[64302,1,"אַ"],[64303,1,"אָ"],[64304,1,"אּ"],[64305,1,"בּ"],[64306,1,"גּ"],[64307,1,"דּ"],[64308,1,"הּ"],[64309,1,"וּ"],[64310,1,"זּ"],[64311,3],[64312,1,"טּ"],[64313,1,"יּ"],[64314,1,"ךּ"],[64315,1,"כּ"],[64316,1,"לּ"],[64317,3],[64318,1,"מּ"],[64319,3],[64320,1,"נּ"],[64321,1,"סּ"],[64322,3],[64323,1,"ףּ"],[64324,1,"פּ"],[64325,3],[64326,1,"צּ"],[64327,1,"קּ"],[64328,1,"רּ"],[64329,1,"שּ"],[64330,1,"תּ"],[64331,1,"וֹ"],[64332,1,"בֿ"],[64333,1,"כֿ"],[64334,1,"פֿ"],[64335,1,"אל"],[[64336,64337],1,"ٱ"],[[64338,64341],1,"ٻ"],[[64342,64345],1,"پ"],[[64346,64349],1,"ڀ"],[[64350,64353],1,"ٺ"],[[64354,64357],1,"ٿ"],[[64358,64361],1,"ٹ"],[[64362,64365],1,"ڤ"],[[64366,64369],1,"ڦ"],[[64370,64373],1,"ڄ"],[[64374,64377],1,"ڃ"],[[64378,64381],1,"چ"],[[64382,64385],1,"ڇ"],[[64386,64387],1,"ڍ"],[[64388,64389],1,"ڌ"],[[64390,64391],1,"ڎ"],[[64392,64393],1,"ڈ"],[[64394,64395],1,"ژ"],[[64396,64397],1,"ڑ"],[[64398,64401],1,"ک"],[[64402,64405],1,"گ"],[[64406,64409],1,"ڳ"],[[64410,64413],1,"ڱ"],[[64414,64415],1,"ں"],[[64416,64419],1,"ڻ"],[[64420,64421],1,"ۀ"],[[64422,64425],1,"ہ"],[[64426,64429],1,"ھ"],[[64430,64431],1,"ے"],[[64432,64433],1,"ۓ"],[[64434,64449],2],[64450,2],[[64451,64466],3],[[64467,64470],1,"ڭ"],[[64471,64472],1,"ۇ"],[[64473,64474],1,"ۆ"],[[64475,64476],1,"ۈ"],[64477,1,"ۇٴ"],[[64478,64479],1,"ۋ"],[[64480,64481],1,"ۅ"],[[64482,64483],1,"ۉ"],[[64484,64487],1,"ې"],[[64488,64489],1,"ى"],[[64490,64491],1,"ئا"],[[64492,64493],1,"ئە"],[[64494,64495],1,"ئو"],[[64496,64497],1,"ئۇ"],[[64498,64499],1,"ئۆ"],[[64500,64501],1,"ئۈ"],[[64502,64504],1,"ئې"],[[64505,64507],1,"ئى"],[[64508,64511],1,"ی"],[64512,1,"ئج"],[64513,1,"ئح"],[64514,1,"ئم"],[64515,1,"ئى"],[64516,1,"ئي"],[64517,1,"بج"],[64518,1,"بح"],[64519,1,"بخ"],[64520,1,"بم"],[64521,1,"بى"],[64522,1,"بي"],[64523,1,"تج"],[64524,1,"تح"],[64525,1,"تخ"],[64526,1,"تم"],[64527,1,"تى"],[64528,1,"تي"],[64529,1,"ثج"],[64530,1,"ثم"],[64531,1,"ثى"],[64532,1,"ثي"],[64533,1,"جح"],[64534,1,"جم"],[64535,1,"حج"],[64536,1,"حم"],[64537,1,"خج"],[64538,1,"خح"],[64539,1,"خم"],[64540,1,"سج"],[64541,1,"سح"],[64542,1,"سخ"],[64543,1,"سم"],[64544,1,"صح"],[64545,1,"صم"],[64546,1,"ضج"],[64547,1,"ضح"],[64548,1,"ضخ"],[64549,1,"ضم"],[64550,1,"طح"],[64551,1,"طم"],[64552,1,"ظم"],[64553,1,"عج"],[64554,1,"عم"],[64555,1,"غج"],[64556,1,"غم"],[64557,1,"فج"],[64558,1,"فح"],[64559,1,"فخ"],[64560,1,"فم"],[64561,1,"فى"],[64562,1,"في"],[64563,1,"قح"],[64564,1,"قم"],[64565,1,"قى"],[64566,1,"قي"],[64567,1,"كا"],[64568,1,"كج"],[64569,1,"كح"],[64570,1,"كخ"],[64571,1,"كل"],[64572,1,"كم"],[64573,1,"كى"],[64574,1,"كي"],[64575,1,"لج"],[64576,1,"لح"],[64577,1,"لخ"],[64578,1,"لم"],[64579,1,"لى"],[64580,1,"لي"],[64581,1,"مج"],[64582,1,"مح"],[64583,1,"مخ"],[64584,1,"مم"],[64585,1,"مى"],[64586,1,"مي"],[64587,1,"نج"],[64588,1,"نح"],[64589,1,"نخ"],[64590,1,"نم"],[64591,1,"نى"],[64592,1,"ني"],[64593,1,"هج"],[64594,1,"هم"],[64595,1,"هى"],[64596,1,"هي"],[64597,1,"يج"],[64598,1,"يح"],[64599,1,"يخ"],[64600,1,"يم"],[64601,1,"يى"],[64602,1,"يي"],[64603,1,"ذٰ"],[64604,1,"رٰ"],[64605,1,"ىٰ"],[64606,5," ٌّ"],[64607,5," ٍّ"],[64608,5," َّ"],[64609,5," ُّ"],[64610,5," ِّ"],[64611,5," ّٰ"],[64612,1,"ئر"],[64613,1,"ئز"],[64614,1,"ئم"],[64615,1,"ئن"],[64616,1,"ئى"],[64617,1,"ئي"],[64618,1,"بر"],[64619,1,"بز"],[64620,1,"بم"],[64621,1,"بن"],[64622,1,"بى"],[64623,1,"بي"],[64624,1,"تر"],[64625,1,"تز"],[64626,1,"تم"],[64627,1,"تن"],[64628,1,"تى"],[64629,1,"تي"],[64630,1,"ثر"],[64631,1,"ثز"],[64632,1,"ثم"],[64633,1,"ثن"],[64634,1,"ثى"],[64635,1,"ثي"],[64636,1,"فى"],[64637,1,"في"],[64638,1,"قى"],[64639,1,"قي"],[64640,1,"كا"],[64641,1,"كل"],[64642,1,"كم"],[64643,1,"كى"],[64644,1,"كي"],[64645,1,"لم"],[64646,1,"لى"],[64647,1,"لي"],[64648,1,"ما"],[64649,1,"مم"],[64650,1,"نر"],[64651,1,"نز"],[64652,1,"نم"],[64653,1,"نن"],[64654,1,"نى"],[64655,1,"ني"],[64656,1,"ىٰ"],[64657,1,"ير"],[64658,1,"يز"],[64659,1,"يم"],[64660,1,"ين"],[64661,1,"يى"],[64662,1,"يي"],[64663,1,"ئج"],[64664,1,"ئح"],[64665,1,"ئخ"],[64666,1,"ئم"],[64667,1,"ئه"],[64668,1,"بج"],[64669,1,"بح"],[64670,1,"بخ"],[64671,1,"بم"],[64672,1,"به"],[64673,1,"تج"],[64674,1,"تح"],[64675,1,"تخ"],[64676,1,"تم"],[64677,1,"ته"],[64678,1,"ثم"],[64679,1,"جح"],[64680,1,"جم"],[64681,1,"حج"],[64682,1,"حم"],[64683,1,"خج"],[64684,1,"خم"],[64685,1,"سج"],[64686,1,"سح"],[64687,1,"سخ"],[64688,1,"سم"],[64689,1,"صح"],[64690,1,"صخ"],[64691,1,"صم"],[64692,1,"ضج"],[64693,1,"ضح"],[64694,1,"ضخ"],[64695,1,"ضم"],[64696,1,"طح"],[64697,1,"ظم"],[64698,1,"عج"],[64699,1,"عم"],[64700,1,"غج"],[64701,1,"غم"],[64702,1,"فج"],[64703,1,"فح"],[64704,1,"فخ"],[64705,1,"فم"],[64706,1,"قح"],[64707,1,"قم"],[64708,1,"كج"],[64709,1,"كح"],[64710,1,"كخ"],[64711,1,"كل"],[64712,1,"كم"],[64713,1,"لج"],[64714,1,"لح"],[64715,1,"لخ"],[64716,1,"لم"],[64717,1,"له"],[64718,1,"مج"],[64719,1,"مح"],[64720,1,"مخ"],[64721,1,"مم"],[64722,1,"نج"],[64723,1,"نح"],[64724,1,"نخ"],[64725,1,"نم"],[64726,1,"نه"],[64727,1,"هج"],[64728,1,"هم"],[64729,1,"هٰ"],[64730,1,"يج"],[64731,1,"يح"],[64732,1,"يخ"],[64733,1,"يم"],[64734,1,"يه"],[64735,1,"ئم"],[64736,1,"ئه"],[64737,1,"بم"],[64738,1,"به"],[64739,1,"تم"],[64740,1,"ته"],[64741,1,"ثم"],[64742,1,"ثه"],[64743,1,"سم"],[64744,1,"سه"],[64745,1,"شم"],[64746,1,"شه"],[64747,1,"كل"],[64748,1,"كم"],[64749,1,"لم"],[64750,1,"نم"],[64751,1,"نه"],[64752,1,"يم"],[64753,1,"يه"],[64754,1,"ـَّ"],[64755,1,"ـُّ"],[64756,1,"ـِّ"],[64757,1,"طى"],[64758,1,"طي"],[64759,1,"عى"],[64760,1,"عي"],[64761,1,"غى"],[64762,1,"غي"],[64763,1,"سى"],[64764,1,"سي"],[64765,1,"شى"],[64766,1,"شي"],[64767,1,"حى"],[64768,1,"حي"],[64769,1,"جى"],[64770,1,"جي"],[64771,1,"خى"],[64772,1,"خي"],[64773,1,"صى"],[64774,1,"صي"],[64775,1,"ضى"],[64776,1,"ضي"],[64777,1,"شج"],[64778,1,"شح"],[64779,1,"شخ"],[64780,1,"شم"],[64781,1,"شر"],[64782,1,"سر"],[64783,1,"صر"],[64784,1,"ضر"],[64785,1,"طى"],[64786,1,"طي"],[64787,1,"عى"],[64788,1,"عي"],[64789,1,"غى"],[64790,1,"غي"],[64791,1,"سى"],[64792,1,"سي"],[64793,1,"شى"],[64794,1,"شي"],[64795,1,"حى"],[64796,1,"حي"],[64797,1,"جى"],[64798,1,"جي"],[64799,1,"خى"],[64800,1,"خي"],[64801,1,"صى"],[64802,1,"صي"],[64803,1,"ضى"],[64804,1,"ضي"],[64805,1,"شج"],[64806,1,"شح"],[64807,1,"شخ"],[64808,1,"شم"],[64809,1,"شر"],[64810,1,"سر"],[64811,1,"صر"],[64812,1,"ضر"],[64813,1,"شج"],[64814,1,"شح"],[64815,1,"شخ"],[64816,1,"شم"],[64817,1,"سه"],[64818,1,"شه"],[64819,1,"طم"],[64820,1,"سج"],[64821,1,"سح"],[64822,1,"سخ"],[64823,1,"شج"],[64824,1,"شح"],[64825,1,"شخ"],[64826,1,"طم"],[64827,1,"ظم"],[[64828,64829],1,"اً"],[[64830,64831],2],[[64832,64847],2],[64848,1,"تجم"],[[64849,64850],1,"تحج"],[64851,1,"تحم"],[64852,1,"تخم"],[64853,1,"تمج"],[64854,1,"تمح"],[64855,1,"تمخ"],[[64856,64857],1,"جمح"],[64858,1,"حمي"],[64859,1,"حمى"],[64860,1,"سحج"],[64861,1,"سجح"],[64862,1,"سجى"],[[64863,64864],1,"سمح"],[64865,1,"سمج"],[[64866,64867],1,"سمم"],[[64868,64869],1,"صحح"],[64870,1,"صمم"],[[64871,64872],1,"شحم"],[64873,1,"شجي"],[[64874,64875],1,"شمخ"],[[64876,64877],1,"شمم"],[64878,1,"ضحى"],[[64879,64880],1,"ضخم"],[[64881,64882],1,"طمح"],[64883,1,"طمم"],[64884,1,"طمي"],[64885,1,"عجم"],[[64886,64887],1,"عمم"],[64888,1,"عمى"],[64889,1,"غمم"],[64890,1,"غمي"],[64891,1,"غمى"],[[64892,64893],1,"فخم"],[64894,1,"قمح"],[64895,1,"قمم"],[64896,1,"لحم"],[64897,1,"لحي"],[64898,1,"لحى"],[[64899,64900],1,"لجج"],[[64901,64902],1,"لخم"],[[64903,64904],1,"لمح"],[64905,1,"محج"],[64906,1,"محم"],[64907,1,"محي"],[64908,1,"مجح"],[64909,1,"مجم"],[64910,1,"مخج"],[64911,1,"مخم"],[[64912,64913],3],[64914,1,"مجخ"],[64915,1,"همج"],[64916,1,"همم"],[64917,1,"نحم"],[64918,1,"نحى"],[[64919,64920],1,"نجم"],[64921,1,"نجى"],[64922,1,"نمي"],[64923,1,"نمى"],[[64924,64925],1,"يمم"],[64926,1,"بخي"],[64927,1,"تجي"],[64928,1,"تجى"],[64929,1,"تخي"],[64930,1,"تخى"],[64931,1,"تمي"],[64932,1,"تمى"],[64933,1,"جمي"],[64934,1,"جحى"],[64935,1,"جمى"],[64936,1,"سخى"],[64937,1,"صحي"],[64938,1,"شحي"],[64939,1,"ضحي"],[64940,1,"لجي"],[64941,1,"لمي"],[64942,1,"يحي"],[64943,1,"يجي"],[64944,1,"يمي"],[64945,1,"ممي"],[64946,1,"قمي"],[64947,1,"نحي"],[64948,1,"قمح"],[64949,1,"لحم"],[64950,1,"عمي"],[64951,1,"كمي"],[64952,1,"نجح"],[64953,1,"مخي"],[64954,1,"لجم"],[64955,1,"كمم"],[64956,1,"لجم"],[64957,1,"نجح"],[64958,1,"جحي"],[64959,1,"حجي"],[64960,1,"مجي"],[64961,1,"فمي"],[64962,1,"بحي"],[64963,1,"كمم"],[64964,1,"عجم"],[64965,1,"صمم"],[64966,1,"سخي"],[64967,1,"نجي"],[[64968,64974],3],[64975,2],[[64976,65007],3],[65008,1,"صلے"],[65009,1,"قلے"],[65010,1,"الله"],[65011,1,"اكبر"],[65012,1,"محمد"],[65013,1,"صلعم"],[65014,1,"رسول"],[65015,1,"عليه"],[65016,1,"وسلم"],[65017,1,"صلى"],[65018,5,"صلى الله عليه وسلم"],[65019,5,"جل جلاله"],[65020,1,"ریال"],[65021,2],[[65022,65023],2],[[65024,65039],7],[65040,5,","],[65041,1,"、"],[65042,3],[65043,5,":"],[65044,5,";"],[65045,5,"!"],[65046,5,"?"],[65047,1,"〖"],[65048,1,"〗"],[65049,3],[[65050,65055],3],[[65056,65059],2],[[65060,65062],2],[[65063,65069],2],[[65070,65071],2],[65072,3],[65073,1,"—"],[65074,1,"–"],[[65075,65076],5,"_"],[65077,5,"("],[65078,5,")"],[65079,5,"{"],[65080,5,"}"],[65081,1,"〔"],[65082,1,"〕"],[65083,1,"【"],[65084,1,"】"],[65085,1,"《"],[65086,1,"》"],[65087,1,"〈"],[65088,1,"〉"],[65089,1,"「"],[65090,1,"」"],[65091,1,"『"],[65092,1,"』"],[[65093,65094],2],[65095,5,"["],[65096,5,"]"],[[65097,65100],5," ̅"],[[65101,65103],5,"_"],[65104,5,","],[65105,1,"、"],[65106,3],[65107,3],[65108,5,";"],[65109,5,":"],[65110,5,"?"],[65111,5,"!"],[65112,1,"—"],[65113,5,"("],[65114,5,")"],[65115,5,"{"],[65116,5,"}"],[65117,1,"〔"],[65118,1,"〕"],[65119,5,"#"],[65120,5,"&"],[65121,5,"*"],[65122,5,"+"],[65123,1,"-"],[65124,5,"<"],[65125,5,">"],[65126,5,"="],[65127,3],[65128,5,"\\\\"],[65129,5,"$"],[65130,5,"%"],[65131,5,"@"],[[65132,65135],3],[65136,5," ً"],[65137,1,"ـً"],[65138,5," ٌ"],[65139,2],[65140,5," ٍ"],[65141,3],[65142,5," َ"],[65143,1,"ـَ"],[65144,5," ُ"],[65145,1,"ـُ"],[65146,5," ِ"],[65147,1,"ـِ"],[65148,5," ّ"],[65149,1,"ـّ"],[65150,5," ْ"],[65151,1,"ـْ"],[65152,1,"ء"],[[65153,65154],1,"آ"],[[65155,65156],1,"أ"],[[65157,65158],1,"ؤ"],[[65159,65160],1,"إ"],[[65161,65164],1,"ئ"],[[65165,65166],1,"ا"],[[65167,65170],1,"ب"],[[65171,65172],1,"ة"],[[65173,65176],1,"ت"],[[65177,65180],1,"ث"],[[65181,65184],1,"ج"],[[65185,65188],1,"ح"],[[65189,65192],1,"خ"],[[65193,65194],1,"د"],[[65195,65196],1,"ذ"],[[65197,65198],1,"ر"],[[65199,65200],1,"ز"],[[65201,65204],1,"س"],[[65205,65208],1,"ش"],[[65209,65212],1,"ص"],[[65213,65216],1,"ض"],[[65217,65220],1,"ط"],[[65221,65224],1,"ظ"],[[65225,65228],1,"ع"],[[65229,65232],1,"غ"],[[65233,65236],1,"ف"],[[65237,65240],1,"ق"],[[65241,65244],1,"ك"],[[65245,65248],1,"ل"],[[65249,65252],1,"م"],[[65253,65256],1,"ن"],[[65257,65260],1,"ه"],[[65261,65262],1,"و"],[[65263,65264],1,"ى"],[[65265,65268],1,"ي"],[[65269,65270],1,"لآ"],[[65271,65272],1,"لأ"],[[65273,65274],1,"لإ"],[[65275,65276],1,"لا"],[[65277,65278],3],[65279,7],[65280,3],[65281,5,"!"],[65282,5,"\\""],[65283,5,"#"],[65284,5,"$"],[65285,5,"%"],[65286,5,"&"],[65287,5,"\'"],[65288,5,"("],[65289,5,")"],[65290,5,"*"],[65291,5,"+"],[65292,5,","],[65293,1,"-"],[65294,1,"."],[65295,5,"/"],[65296,1,"0"],[65297,1,"1"],[65298,1,"2"],[65299,1,"3"],[65300,1,"4"],[65301,1,"5"],[65302,1,"6"],[65303,1,"7"],[65304,1,"8"],[65305,1,"9"],[65306,5,":"],[65307,5,";"],[65308,5,"<"],[65309,5,"="],[65310,5,">"],[65311,5,"?"],[65312,5,"@"],[65313,1,"a"],[65314,1,"b"],[65315,1,"c"],[65316,1,"d"],[65317,1,"e"],[65318,1,"f"],[65319,1,"g"],[65320,1,"h"],[65321,1,"i"],[65322,1,"j"],[65323,1,"k"],[65324,1,"l"],[65325,1,"m"],[65326,1,"n"],[65327,1,"o"],[65328,1,"p"],[65329,1,"q"],[65330,1,"r"],[65331,1,"s"],[65332,1,"t"],[65333,1,"u"],[65334,1,"v"],[65335,1,"w"],[65336,1,"x"],[65337,1,"y"],[65338,1,"z"],[65339,5,"["],[65340,5,"\\\\"],[65341,5,"]"],[65342,5,"^"],[65343,5,"_"],[65344,5,"`"],[65345,1,"a"],[65346,1,"b"],[65347,1,"c"],[65348,1,"d"],[65349,1,"e"],[65350,1,"f"],[65351,1,"g"],[65352,1,"h"],[65353,1,"i"],[65354,1,"j"],[65355,1,"k"],[65356,1,"l"],[65357,1,"m"],[65358,1,"n"],[65359,1,"o"],[65360,1,"p"],[65361,1,"q"],[65362,1,"r"],[65363,1,"s"],[65364,1,"t"],[65365,1,"u"],[65366,1,"v"],[65367,1,"w"],[65368,1,"x"],[65369,1,"y"],[65370,1,"z"],[65371,5,"{"],[65372,5,"|"],[65373,5,"}"],[65374,5,"~"],[65375,1,"⦅"],[65376,1,"⦆"],[65377,1,"."],[65378,1,"「"],[65379,1,"」"],[65380,1,"、"],[65381,1,"・"],[65382,1,"ヲ"],[65383,1,"ァ"],[65384,1,"ィ"],[65385,1,"ゥ"],[65386,1,"ェ"],[65387,1,"ォ"],[65388,1,"ャ"],[65389,1,"ュ"],[65390,1,"ョ"],[65391,1,"ッ"],[65392,1,"ー"],[65393,1,"ア"],[65394,1,"イ"],[65395,1,"ウ"],[65396,1,"エ"],[65397,1,"オ"],[65398,1,"カ"],[65399,1,"キ"],[65400,1,"ク"],[65401,1,"ケ"],[65402,1,"コ"],[65403,1,"サ"],[65404,1,"シ"],[65405,1,"ス"],[65406,1,"セ"],[65407,1,"ソ"],[65408,1,"タ"],[65409,1,"チ"],[65410,1,"ツ"],[65411,1,"テ"],[65412,1,"ト"],[65413,1,"ナ"],[65414,1,"ニ"],[65415,1,"ヌ"],[65416,1,"ネ"],[65417,1,"ノ"],[65418,1,"ハ"],[65419,1,"ヒ"],[65420,1,"フ"],[65421,1,"ヘ"],[65422,1,"ホ"],[65423,1,"マ"],[65424,1,"ミ"],[65425,1,"ム"],[65426,1,"メ"],[65427,1,"モ"],[65428,1,"ヤ"],[65429,1,"ユ"],[65430,1,"ヨ"],[65431,1,"ラ"],[65432,1,"リ"],[65433,1,"ル"],[65434,1,"レ"],[65435,1,"ロ"],[65436,1,"ワ"],[65437,1,"ン"],[65438,1,"゙"],[65439,1,"゚"],[65440,3],[65441,1,"ᄀ"],[65442,1,"ᄁ"],[65443,1,"ᆪ"],[65444,1,"ᄂ"],[65445,1,"ᆬ"],[65446,1,"ᆭ"],[65447,1,"ᄃ"],[65448,1,"ᄄ"],[65449,1,"ᄅ"],[65450,1,"ᆰ"],[65451,1,"ᆱ"],[65452,1,"ᆲ"],[65453,1,"ᆳ"],[65454,1,"ᆴ"],[65455,1,"ᆵ"],[65456,1,"ᄚ"],[65457,1,"ᄆ"],[65458,1,"ᄇ"],[65459,1,"ᄈ"],[65460,1,"ᄡ"],[65461,1,"ᄉ"],[65462,1,"ᄊ"],[65463,1,"ᄋ"],[65464,1,"ᄌ"],[65465,1,"ᄍ"],[65466,1,"ᄎ"],[65467,1,"ᄏ"],[65468,1,"ᄐ"],[65469,1,"ᄑ"],[65470,1,"ᄒ"],[[65471,65473],3],[65474,1,"ᅡ"],[65475,1,"ᅢ"],[65476,1,"ᅣ"],[65477,1,"ᅤ"],[65478,1,"ᅥ"],[65479,1,"ᅦ"],[[65480,65481],3],[65482,1,"ᅧ"],[65483,1,"ᅨ"],[65484,1,"ᅩ"],[65485,1,"ᅪ"],[65486,1,"ᅫ"],[65487,1,"ᅬ"],[[65488,65489],3],[65490,1,"ᅭ"],[65491,1,"ᅮ"],[65492,1,"ᅯ"],[65493,1,"ᅰ"],[65494,1,"ᅱ"],[65495,1,"ᅲ"],[[65496,65497],3],[65498,1,"ᅳ"],[65499,1,"ᅴ"],[65500,1,"ᅵ"],[[65501,65503],3],[65504,1,"¢"],[65505,1,"£"],[65506,1,"¬"],[65507,5," ̄"],[65508,1,"¦"],[65509,1,"¥"],[65510,1,"₩"],[65511,3],[65512,1,"│"],[65513,1,"←"],[65514,1,"↑"],[65515,1,"→"],[65516,1,"↓"],[65517,1,"■"],[65518,1,"○"],[[65519,65528],3],[[65529,65531],3],[65532,3],[65533,3],[[65534,65535],3],[[65536,65547],2],[65548,3],[[65549,65574],2],[65575,3],[[65576,65594],2],[65595,3],[[65596,65597],2],[65598,3],[[65599,65613],2],[[65614,65615],3],[[65616,65629],2],[[65630,65663],3],[[65664,65786],2],[[65787,65791],3],[[65792,65794],2],[[65795,65798],3],[[65799,65843],2],[[65844,65846],3],[[65847,65855],2],[[65856,65930],2],[[65931,65932],2],[[65933,65934],2],[65935,3],[[65936,65947],2],[65948,2],[[65949,65951],3],[65952,2],[[65953,65999],3],[[66000,66044],2],[66045,2],[[66046,66175],3],[[66176,66204],2],[[66205,66207],3],[[66208,66256],2],[[66257,66271],3],[66272,2],[[66273,66299],2],[[66300,66303],3],[[66304,66334],2],[66335,2],[[66336,66339],2],[[66340,66348],3],[[66349,66351],2],[[66352,66368],2],[66369,2],[[66370,66377],2],[66378,2],[[66379,66383],3],[[66384,66426],2],[[66427,66431],3],[[66432,66461],2],[66462,3],[66463,2],[[66464,66499],2],[[66500,66503],3],[[66504,66511],2],[[66512,66517],2],[[66518,66559],3],[66560,1,"𐐨"],[66561,1,"𐐩"],[66562,1,"𐐪"],[66563,1,"𐐫"],[66564,1,"𐐬"],[66565,1,"𐐭"],[66566,1,"𐐮"],[66567,1,"𐐯"],[66568,1,"𐐰"],[66569,1,"𐐱"],[66570,1,"𐐲"],[66571,1,"𐐳"],[66572,1,"𐐴"],[66573,1,"𐐵"],[66574,1,"𐐶"],[66575,1,"𐐷"],[66576,1,"𐐸"],[66577,1,"𐐹"],[66578,1,"𐐺"],[66579,1,"𐐻"],[66580,1,"𐐼"],[66581,1,"𐐽"],[66582,1,"𐐾"],[66583,1,"𐐿"],[66584,1,"𐑀"],[66585,1,"𐑁"],[66586,1,"𐑂"],[66587,1,"𐑃"],[66588,1,"𐑄"],[66589,1,"𐑅"],[66590,1,"𐑆"],[66591,1,"𐑇"],[66592,1,"𐑈"],[66593,1,"𐑉"],[66594,1,"𐑊"],[66595,1,"𐑋"],[66596,1,"𐑌"],[66597,1,"𐑍"],[66598,1,"𐑎"],[66599,1,"𐑏"],[[66600,66637],2],[[66638,66717],2],[[66718,66719],3],[[66720,66729],2],[[66730,66735],3],[66736,1,"𐓘"],[66737,1,"𐓙"],[66738,1,"𐓚"],[66739,1,"𐓛"],[66740,1,"𐓜"],[66741,1,"𐓝"],[66742,1,"𐓞"],[66743,1,"𐓟"],[66744,1,"𐓠"],[66745,1,"𐓡"],[66746,1,"𐓢"],[66747,1,"𐓣"],[66748,1,"𐓤"],[66749,1,"𐓥"],[66750,1,"𐓦"],[66751,1,"𐓧"],[66752,1,"𐓨"],[66753,1,"𐓩"],[66754,1,"𐓪"],[66755,1,"𐓫"],[66756,1,"𐓬"],[66757,1,"𐓭"],[66758,1,"𐓮"],[66759,1,"𐓯"],[66760,1,"𐓰"],[66761,1,"𐓱"],[66762,1,"𐓲"],[66763,1,"𐓳"],[66764,1,"𐓴"],[66765,1,"𐓵"],[66766,1,"𐓶"],[66767,1,"𐓷"],[66768,1,"𐓸"],[66769,1,"𐓹"],[66770,1,"𐓺"],[66771,1,"𐓻"],[[66772,66775],3],[[66776,66811],2],[[66812,66815],3],[[66816,66855],2],[[66856,66863],3],[[66864,66915],2],[[66916,66926],3],[66927,2],[66928,1,"𐖗"],[66929,1,"𐖘"],[66930,1,"𐖙"],[66931,1,"𐖚"],[66932,1,"𐖛"],[66933,1,"𐖜"],[66934,1,"𐖝"],[66935,1,"𐖞"],[66936,1,"𐖟"],[66937,1,"𐖠"],[66938,1,"𐖡"],[66939,3],[66940,1,"𐖣"],[66941,1,"𐖤"],[66942,1,"𐖥"],[66943,1,"𐖦"],[66944,1,"𐖧"],[66945,1,"𐖨"],[66946,1,"𐖩"],[66947,1,"𐖪"],[66948,1,"𐖫"],[66949,1,"𐖬"],[66950,1,"𐖭"],[66951,1,"𐖮"],[66952,1,"𐖯"],[66953,1,"𐖰"],[66954,1,"𐖱"],[66955,3],[66956,1,"𐖳"],[66957,1,"𐖴"],[66958,1,"𐖵"],[66959,1,"𐖶"],[66960,1,"𐖷"],[66961,1,"𐖸"],[66962,1,"𐖹"],[66963,3],[66964,1,"𐖻"],[66965,1,"𐖼"],[66966,3],[[66967,66977],2],[66978,3],[[66979,66993],2],[66994,3],[[66995,67001],2],[67002,3],[[67003,67004],2],[[67005,67071],3],[[67072,67382],2],[[67383,67391],3],[[67392,67413],2],[[67414,67423],3],[[67424,67431],2],[[67432,67455],3],[67456,2],[67457,1,"ː"],[67458,1,"ˑ"],[67459,1,"æ"],[67460,1,"ʙ"],[67461,1,"ɓ"],[67462,3],[67463,1,"ʣ"],[67464,1,"ꭦ"],[67465,1,"ʥ"],[67466,1,"ʤ"],[67467,1,"ɖ"],[67468,1,"ɗ"],[67469,1,"ᶑ"],[67470,1,"ɘ"],[67471,1,"ɞ"],[67472,1,"ʩ"],[67473,1,"ɤ"],[67474,1,"ɢ"],[67475,1,"ɠ"],[67476,1,"ʛ"],[67477,1,"ħ"],[67478,1,"ʜ"],[67479,1,"ɧ"],[67480,1,"ʄ"],[67481,1,"ʪ"],[67482,1,"ʫ"],[67483,1,"ɬ"],[67484,1,"𝼄"],[67485,1,"ꞎ"],[67486,1,"ɮ"],[67487,1,"𝼅"],[67488,1,"ʎ"],[67489,1,"𝼆"],[67490,1,"ø"],[67491,1,"ɶ"],[67492,1,"ɷ"],[67493,1,"q"],[67494,1,"ɺ"],[67495,1,"𝼈"],[67496,1,"ɽ"],[67497,1,"ɾ"],[67498,1,"ʀ"],[67499,1,"ʨ"],[67500,1,"ʦ"],[67501,1,"ꭧ"],[67502,1,"ʧ"],[67503,1,"ʈ"],[67504,1,"ⱱ"],[67505,3],[67506,1,"ʏ"],[67507,1,"ʡ"],[67508,1,"ʢ"],[67509,1,"ʘ"],[67510,1,"ǀ"],[67511,1,"ǁ"],[67512,1,"ǂ"],[67513,1,"𝼊"],[67514,1,"𝼞"],[[67515,67583],3],[[67584,67589],2],[[67590,67591],3],[67592,2],[67593,3],[[67594,67637],2],[67638,3],[[67639,67640],2],[[67641,67643],3],[67644,2],[[67645,67646],3],[67647,2],[[67648,67669],2],[67670,3],[[67671,67679],2],[[67680,67702],2],[[67703,67711],2],[[67712,67742],2],[[67743,67750],3],[[67751,67759],2],[[67760,67807],3],[[67808,67826],2],[67827,3],[[67828,67829],2],[[67830,67834],3],[[67835,67839],2],[[67840,67861],2],[[67862,67865],2],[[67866,67867],2],[[67868,67870],3],[67871,2],[[67872,67897],2],[[67898,67902],3],[67903,2],[[67904,67967],3],[[67968,68023],2],[[68024,68027],3],[[68028,68029],2],[[68030,68031],2],[[68032,68047],2],[[68048,68049],3],[[68050,68095],2],[[68096,68099],2],[68100,3],[[68101,68102],2],[[68103,68107],3],[[68108,68115],2],[68116,3],[[68117,68119],2],[68120,3],[[68121,68147],2],[[68148,68149],2],[[68150,68151],3],[[68152,68154],2],[[68155,68158],3],[68159,2],[[68160,68167],2],[68168,2],[[68169,68175],3],[[68176,68184],2],[[68185,68191],3],[[68192,68220],2],[[68221,68223],2],[[68224,68252],2],[[68253,68255],2],[[68256,68287],3],[[68288,68295],2],[68296,2],[[68297,68326],2],[[68327,68330],3],[[68331,68342],2],[[68343,68351],3],[[68352,68405],2],[[68406,68408],3],[[68409,68415],2],[[68416,68437],2],[[68438,68439],3],[[68440,68447],2],[[68448,68466],2],[[68467,68471],3],[[68472,68479],2],[[68480,68497],2],[[68498,68504],3],[[68505,68508],2],[[68509,68520],3],[[68521,68527],2],[[68528,68607],3],[[68608,68680],2],[[68681,68735],3],[68736,1,"𐳀"],[68737,1,"𐳁"],[68738,1,"𐳂"],[68739,1,"𐳃"],[68740,1,"𐳄"],[68741,1,"𐳅"],[68742,1,"𐳆"],[68743,1,"𐳇"],[68744,1,"𐳈"],[68745,1,"𐳉"],[68746,1,"𐳊"],[68747,1,"𐳋"],[68748,1,"𐳌"],[68749,1,"𐳍"],[68750,1,"𐳎"],[68751,1,"𐳏"],[68752,1,"𐳐"],[68753,1,"𐳑"],[68754,1,"𐳒"],[68755,1,"𐳓"],[68756,1,"𐳔"],[68757,1,"𐳕"],[68758,1,"𐳖"],[68759,1,"𐳗"],[68760,1,"𐳘"],[68761,1,"𐳙"],[68762,1,"𐳚"],[68763,1,"𐳛"],[68764,1,"𐳜"],[68765,1,"𐳝"],[68766,1,"𐳞"],[68767,1,"𐳟"],[68768,1,"𐳠"],[68769,1,"𐳡"],[68770,1,"𐳢"],[68771,1,"𐳣"],[68772,1,"𐳤"],[68773,1,"𐳥"],[68774,1,"𐳦"],[68775,1,"𐳧"],[68776,1,"𐳨"],[68777,1,"𐳩"],[68778,1,"𐳪"],[68779,1,"𐳫"],[68780,1,"𐳬"],[68781,1,"𐳭"],[68782,1,"𐳮"],[68783,1,"𐳯"],[68784,1,"𐳰"],[68785,1,"𐳱"],[68786,1,"𐳲"],[[68787,68799],3],[[68800,68850],2],[[68851,68857],3],[[68858,68863],2],[[68864,68903],2],[[68904,68911],3],[[68912,68921],2],[[68922,69215],3],[[69216,69246],2],[69247,3],[[69248,69289],2],[69290,3],[[69291,69292],2],[69293,2],[[69294,69295],3],[[69296,69297],2],[[69298,69375],3],[[69376,69404],2],[[69405,69414],2],[69415,2],[[69416,69423],3],[[69424,69456],2],[[69457,69465],2],[[69466,69487],3],[[69488,69509],2],[[69510,69513],2],[[69514,69551],3],[[69552,69572],2],[[69573,69579],2],[[69580,69599],3],[[69600,69622],2],[[69623,69631],3],[[69632,69702],2],[[69703,69709],2],[[69710,69713],3],[[69714,69733],2],[[69734,69743],2],[[69744,69749],2],[[69750,69758],3],[69759,2],[[69760,69818],2],[[69819,69820],2],[69821,3],[[69822,69825],2],[69826,2],[[69827,69836],3],[69837,3],[[69838,69839],3],[[69840,69864],2],[[69865,69871],3],[[69872,69881],2],[[69882,69887],3],[[69888,69940],2],[69941,3],[[69942,69951],2],[[69952,69955],2],[[69956,69958],2],[69959,2],[[69960,69967],3],[[69968,70003],2],[[70004,70005],2],[70006,2],[[70007,70015],3],[[70016,70084],2],[[70085,70088],2],[[70089,70092],2],[70093,2],[[70094,70095],2],[[70096,70105],2],[70106,2],[70107,2],[70108,2],[[70109,70111],2],[70112,3],[[70113,70132],2],[[70133,70143],3],[[70144,70161],2],[70162,3],[[70163,70199],2],[[70200,70205],2],[70206,2],[[70207,70271],3],[[70272,70278],2],[70279,3],[70280,2],[70281,3],[[70282,70285],2],[70286,3],[[70287,70301],2],[70302,3],[[70303,70312],2],[70313,2],[[70314,70319],3],[[70320,70378],2],[[70379,70383],3],[[70384,70393],2],[[70394,70399],3],[70400,2],[[70401,70403],2],[70404,3],[[70405,70412],2],[[70413,70414],3],[[70415,70416],2],[[70417,70418],3],[[70419,70440],2],[70441,3],[[70442,70448],2],[70449,3],[[70450,70451],2],[70452,3],[[70453,70457],2],[70458,3],[70459,2],[[70460,70468],2],[[70469,70470],3],[[70471,70472],2],[[70473,70474],3],[[70475,70477],2],[[70478,70479],3],[70480,2],[[70481,70486],3],[70487,2],[[70488,70492],3],[[70493,70499],2],[[70500,70501],3],[[70502,70508],2],[[70509,70511],3],[[70512,70516],2],[[70517,70655],3],[[70656,70730],2],[[70731,70735],2],[[70736,70745],2],[70746,2],[70747,2],[70748,3],[70749,2],[70750,2],[70751,2],[[70752,70753],2],[[70754,70783],3],[[70784,70853],2],[70854,2],[70855,2],[[70856,70863],3],[[70864,70873],2],[[70874,71039],3],[[71040,71093],2],[[71094,71095],3],[[71096,71104],2],[[71105,71113],2],[[71114,71127],2],[[71128,71133],2],[[71134,71167],3],[[71168,71232],2],[[71233,71235],2],[71236,2],[[71237,71247],3],[[71248,71257],2],[[71258,71263],3],[[71264,71276],2],[[71277,71295],3],[[71296,71351],2],[71352,2],[71353,2],[[71354,71359],3],[[71360,71369],2],[[71370,71423],3],[[71424,71449],2],[71450,2],[[71451,71452],3],[[71453,71467],2],[[71468,71471],3],[[71472,71481],2],[[71482,71487],2],[[71488,71494],2],[[71495,71679],3],[[71680,71738],2],[71739,2],[[71740,71839],3],[71840,1,"𑣀"],[71841,1,"𑣁"],[71842,1,"𑣂"],[71843,1,"𑣃"],[71844,1,"𑣄"],[71845,1,"𑣅"],[71846,1,"𑣆"],[71847,1,"𑣇"],[71848,1,"𑣈"],[71849,1,"𑣉"],[71850,1,"𑣊"],[71851,1,"𑣋"],[71852,1,"𑣌"],[71853,1,"𑣍"],[71854,1,"𑣎"],[71855,1,"𑣏"],[71856,1,"𑣐"],[71857,1,"𑣑"],[71858,1,"𑣒"],[71859,1,"𑣓"],[71860,1,"𑣔"],[71861,1,"𑣕"],[71862,1,"𑣖"],[71863,1,"𑣗"],[71864,1,"𑣘"],[71865,1,"𑣙"],[71866,1,"𑣚"],[71867,1,"𑣛"],[71868,1,"𑣜"],[71869,1,"𑣝"],[71870,1,"𑣞"],[71871,1,"𑣟"],[[71872,71913],2],[[71914,71922],2],[[71923,71934],3],[71935,2],[[71936,71942],2],[[71943,71944],3],[71945,2],[[71946,71947],3],[[71948,71955],2],[71956,3],[[71957,71958],2],[71959,3],[[71960,71989],2],[71990,3],[[71991,71992],2],[[71993,71994],3],[[71995,72003],2],[[72004,72006],2],[[72007,72015],3],[[72016,72025],2],[[72026,72095],3],[[72096,72103],2],[[72104,72105],3],[[72106,72151],2],[[72152,72153],3],[[72154,72161],2],[72162,2],[[72163,72164],2],[[72165,72191],3],[[72192,72254],2],[[72255,72262],2],[72263,2],[[72264,72271],3],[[72272,72323],2],[[72324,72325],2],[[72326,72345],2],[[72346,72348],2],[72349,2],[[72350,72354],2],[[72355,72367],3],[[72368,72383],2],[[72384,72440],2],[[72441,72703],3],[[72704,72712],2],[72713,3],[[72714,72758],2],[72759,3],[[72760,72768],2],[[72769,72773],2],[[72774,72783],3],[[72784,72793],2],[[72794,72812],2],[[72813,72815],3],[[72816,72817],2],[[72818,72847],2],[[72848,72849],3],[[72850,72871],2],[72872,3],[[72873,72886],2],[[72887,72959],3],[[72960,72966],2],[72967,3],[[72968,72969],2],[72970,3],[[72971,73014],2],[[73015,73017],3],[73018,2],[73019,3],[[73020,73021],2],[73022,3],[[73023,73031],2],[[73032,73039],3],[[73040,73049],2],[[73050,73055],3],[[73056,73061],2],[73062,3],[[73063,73064],2],[73065,3],[[73066,73102],2],[73103,3],[[73104,73105],2],[73106,3],[[73107,73112],2],[[73113,73119],3],[[73120,73129],2],[[73130,73439],3],[[73440,73462],2],[[73463,73464],2],[[73465,73647],3],[73648,2],[[73649,73663],3],[[73664,73713],2],[[73714,73726],3],[73727,2],[[73728,74606],2],[[74607,74648],2],[74649,2],[[74650,74751],3],[[74752,74850],2],[[74851,74862],2],[74863,3],[[74864,74867],2],[74868,2],[[74869,74879],3],[[74880,75075],2],[[75076,77711],3],[[77712,77808],2],[[77809,77810],2],[[77811,77823],3],[[77824,78894],2],[78895,3],[[78896,78904],3],[[78905,82943],3],[[82944,83526],2],[[83527,92159],3],[[92160,92728],2],[[92729,92735],3],[[92736,92766],2],[92767,3],[[92768,92777],2],[[92778,92781],3],[[92782,92783],2],[[92784,92862],2],[92863,3],[[92864,92873],2],[[92874,92879],3],[[92880,92909],2],[[92910,92911],3],[[92912,92916],2],[92917,2],[[92918,92927],3],[[92928,92982],2],[[92983,92991],2],[[92992,92995],2],[[92996,92997],2],[[92998,93007],3],[[93008,93017],2],[93018,3],[[93019,93025],2],[93026,3],[[93027,93047],2],[[93048,93052],3],[[93053,93071],2],[[93072,93759],3],[93760,1,"𖹠"],[93761,1,"𖹡"],[93762,1,"𖹢"],[93763,1,"𖹣"],[93764,1,"𖹤"],[93765,1,"𖹥"],[93766,1,"𖹦"],[93767,1,"𖹧"],[93768,1,"𖹨"],[93769,1,"𖹩"],[93770,1,"𖹪"],[93771,1,"𖹫"],[93772,1,"𖹬"],[93773,1,"𖹭"],[93774,1,"𖹮"],[93775,1,"𖹯"],[93776,1,"𖹰"],[93777,1,"𖹱"],[93778,1,"𖹲"],[93779,1,"𖹳"],[93780,1,"𖹴"],[93781,1,"𖹵"],[93782,1,"𖹶"],[93783,1,"𖹷"],[93784,1,"𖹸"],[93785,1,"𖹹"],[93786,1,"𖹺"],[93787,1,"𖹻"],[93788,1,"𖹼"],[93789,1,"𖹽"],[93790,1,"𖹾"],[93791,1,"𖹿"],[[93792,93823],2],[[93824,93850],2],[[93851,93951],3],[[93952,94020],2],[[94021,94026],2],[[94027,94030],3],[94031,2],[[94032,94078],2],[[94079,94087],2],[[94088,94094],3],[[94095,94111],2],[[94112,94175],3],[94176,2],[94177,2],[94178,2],[94179,2],[94180,2],[[94181,94191],3],[[94192,94193],2],[[94194,94207],3],[[94208,100332],2],[[100333,100337],2],[[100338,100343],2],[[100344,100351],3],[[100352,101106],2],[[101107,101589],2],[[101590,101631],3],[[101632,101640],2],[[101641,110575],3],[[110576,110579],2],[110580,3],[[110581,110587],2],[110588,3],[[110589,110590],2],[110591,3],[[110592,110593],2],[[110594,110878],2],[[110879,110882],2],[[110883,110927],3],[[110928,110930],2],[[110931,110947],3],[[110948,110951],2],[[110952,110959],3],[[110960,111355],2],[[111356,113663],3],[[113664,113770],2],[[113771,113775],3],[[113776,113788],2],[[113789,113791],3],[[113792,113800],2],[[113801,113807],3],[[113808,113817],2],[[113818,113819],3],[113820,2],[[113821,113822],2],[113823,2],[[113824,113827],7],[[113828,118527],3],[[118528,118573],2],[[118574,118575],3],[[118576,118598],2],[[118599,118607],3],[[118608,118723],2],[[118724,118783],3],[[118784,119029],2],[[119030,119039],3],[[119040,119078],2],[[119079,119080],3],[119081,2],[[119082,119133],2],[119134,1,"𝅗𝅥"],[119135,1,"𝅘𝅥"],[119136,1,"𝅘𝅥𝅮"],[119137,1,"𝅘𝅥𝅯"],[119138,1,"𝅘𝅥𝅰"],[119139,1,"𝅘𝅥𝅱"],[119140,1,"𝅘𝅥𝅲"],[[119141,119154],2],[[119155,119162],3],[[119163,119226],2],[119227,1,"𝆹𝅥"],[119228,1,"𝆺𝅥"],[119229,1,"𝆹𝅥𝅮"],[119230,1,"𝆺𝅥𝅮"],[119231,1,"𝆹𝅥𝅯"],[119232,1,"𝆺𝅥𝅯"],[[119233,119261],2],[[119262,119272],2],[[119273,119274],2],[[119275,119295],3],[[119296,119365],2],[[119366,119519],3],[[119520,119539],2],[[119540,119551],3],[[119552,119638],2],[[119639,119647],3],[[119648,119665],2],[[119666,119672],2],[[119673,119807],3],[119808,1,"a"],[119809,1,"b"],[119810,1,"c"],[119811,1,"d"],[119812,1,"e"],[119813,1,"f"],[119814,1,"g"],[119815,1,"h"],[119816,1,"i"],[119817,1,"j"],[119818,1,"k"],[119819,1,"l"],[119820,1,"m"],[119821,1,"n"],[119822,1,"o"],[119823,1,"p"],[119824,1,"q"],[119825,1,"r"],[119826,1,"s"],[119827,1,"t"],[119828,1,"u"],[119829,1,"v"],[119830,1,"w"],[119831,1,"x"],[119832,1,"y"],[119833,1,"z"],[119834,1,"a"],[119835,1,"b"],[119836,1,"c"],[119837,1,"d"],[119838,1,"e"],[119839,1,"f"],[119840,1,"g"],[119841,1,"h"],[119842,1,"i"],[119843,1,"j"],[119844,1,"k"],[119845,1,"l"],[119846,1,"m"],[119847,1,"n"],[119848,1,"o"],[119849,1,"p"],[119850,1,"q"],[119851,1,"r"],[119852,1,"s"],[119853,1,"t"],[119854,1,"u"],[119855,1,"v"],[119856,1,"w"],[119857,1,"x"],[119858,1,"y"],[119859,1,"z"],[119860,1,"a"],[119861,1,"b"],[119862,1,"c"],[119863,1,"d"],[119864,1,"e"],[119865,1,"f"],[119866,1,"g"],[119867,1,"h"],[119868,1,"i"],[119869,1,"j"],[119870,1,"k"],[119871,1,"l"],[119872,1,"m"],[119873,1,"n"],[119874,1,"o"],[119875,1,"p"],[119876,1,"q"],[119877,1,"r"],[119878,1,"s"],[119879,1,"t"],[119880,1,"u"],[119881,1,"v"],[119882,1,"w"],[119883,1,"x"],[119884,1,"y"],[119885,1,"z"],[119886,1,"a"],[119887,1,"b"],[119888,1,"c"],[119889,1,"d"],[119890,1,"e"],[119891,1,"f"],[119892,1,"g"],[119893,3],[119894,1,"i"],[119895,1,"j"],[119896,1,"k"],[119897,1,"l"],[119898,1,"m"],[119899,1,"n"],[119900,1,"o"],[119901,1,"p"],[119902,1,"q"],[119903,1,"r"],[119904,1,"s"],[119905,1,"t"],[119906,1,"u"],[119907,1,"v"],[119908,1,"w"],[119909,1,"x"],[119910,1,"y"],[119911,1,"z"],[119912,1,"a"],[119913,1,"b"],[119914,1,"c"],[119915,1,"d"],[119916,1,"e"],[119917,1,"f"],[119918,1,"g"],[119919,1,"h"],[119920,1,"i"],[119921,1,"j"],[119922,1,"k"],[119923,1,"l"],[119924,1,"m"],[119925,1,"n"],[119926,1,"o"],[119927,1,"p"],[119928,1,"q"],[119929,1,"r"],[119930,1,"s"],[119931,1,"t"],[119932,1,"u"],[119933,1,"v"],[119934,1,"w"],[119935,1,"x"],[119936,1,"y"],[119937,1,"z"],[119938,1,"a"],[119939,1,"b"],[119940,1,"c"],[119941,1,"d"],[119942,1,"e"],[119943,1,"f"],[119944,1,"g"],[119945,1,"h"],[119946,1,"i"],[119947,1,"j"],[119948,1,"k"],[119949,1,"l"],[119950,1,"m"],[119951,1,"n"],[119952,1,"o"],[119953,1,"p"],[119954,1,"q"],[119955,1,"r"],[119956,1,"s"],[119957,1,"t"],[119958,1,"u"],[119959,1,"v"],[119960,1,"w"],[119961,1,"x"],[119962,1,"y"],[119963,1,"z"],[119964,1,"a"],[119965,3],[119966,1,"c"],[119967,1,"d"],[[119968,119969],3],[119970,1,"g"],[[119971,119972],3],[119973,1,"j"],[119974,1,"k"],[[119975,119976],3],[119977,1,"n"],[119978,1,"o"],[119979,1,"p"],[119980,1,"q"],[119981,3],[119982,1,"s"],[119983,1,"t"],[119984,1,"u"],[119985,1,"v"],[119986,1,"w"],[119987,1,"x"],[119988,1,"y"],[119989,1,"z"],[119990,1,"a"],[119991,1,"b"],[119992,1,"c"],[119993,1,"d"],[119994,3],[119995,1,"f"],[119996,3],[119997,1,"h"],[119998,1,"i"],[119999,1,"j"],[120000,1,"k"],[120001,1,"l"],[120002,1,"m"],[120003,1,"n"],[120004,3],[120005,1,"p"],[120006,1,"q"],[120007,1,"r"],[120008,1,"s"],[120009,1,"t"],[120010,1,"u"],[120011,1,"v"],[120012,1,"w"],[120013,1,"x"],[120014,1,"y"],[120015,1,"z"],[120016,1,"a"],[120017,1,"b"],[120018,1,"c"],[120019,1,"d"],[120020,1,"e"],[120021,1,"f"],[120022,1,"g"],[120023,1,"h"],[120024,1,"i"],[120025,1,"j"],[120026,1,"k"],[120027,1,"l"],[120028,1,"m"],[120029,1,"n"],[120030,1,"o"],[120031,1,"p"],[120032,1,"q"],[120033,1,"r"],[120034,1,"s"],[120035,1,"t"],[120036,1,"u"],[120037,1,"v"],[120038,1,"w"],[120039,1,"x"],[120040,1,"y"],[120041,1,"z"],[120042,1,"a"],[120043,1,"b"],[120044,1,"c"],[120045,1,"d"],[120046,1,"e"],[120047,1,"f"],[120048,1,"g"],[120049,1,"h"],[120050,1,"i"],[120051,1,"j"],[120052,1,"k"],[120053,1,"l"],[120054,1,"m"],[120055,1,"n"],[120056,1,"o"],[120057,1,"p"],[120058,1,"q"],[120059,1,"r"],[120060,1,"s"],[120061,1,"t"],[120062,1,"u"],[120063,1,"v"],[120064,1,"w"],[120065,1,"x"],[120066,1,"y"],[120067,1,"z"],[120068,1,"a"],[120069,1,"b"],[120070,3],[120071,1,"d"],[120072,1,"e"],[120073,1,"f"],[120074,1,"g"],[[120075,120076],3],[120077,1,"j"],[120078,1,"k"],[120079,1,"l"],[120080,1,"m"],[120081,1,"n"],[120082,1,"o"],[120083,1,"p"],[120084,1,"q"],[120085,3],[120086,1,"s"],[120087,1,"t"],[120088,1,"u"],[120089,1,"v"],[120090,1,"w"],[120091,1,"x"],[120092,1,"y"],[120093,3],[120094,1,"a"],[120095,1,"b"],[120096,1,"c"],[120097,1,"d"],[120098,1,"e"],[120099,1,"f"],[120100,1,"g"],[120101,1,"h"],[120102,1,"i"],[120103,1,"j"],[120104,1,"k"],[120105,1,"l"],[120106,1,"m"],[120107,1,"n"],[120108,1,"o"],[120109,1,"p"],[120110,1,"q"],[120111,1,"r"],[120112,1,"s"],[120113,1,"t"],[120114,1,"u"],[120115,1,"v"],[120116,1,"w"],[120117,1,"x"],[120118,1,"y"],[120119,1,"z"],[120120,1,"a"],[120121,1,"b"],[120122,3],[120123,1,"d"],[120124,1,"e"],[120125,1,"f"],[120126,1,"g"],[120127,3],[120128,1,"i"],[120129,1,"j"],[120130,1,"k"],[120131,1,"l"],[120132,1,"m"],[120133,3],[120134,1,"o"],[[120135,120137],3],[120138,1,"s"],[120139,1,"t"],[120140,1,"u"],[120141,1,"v"],[120142,1,"w"],[120143,1,"x"],[120144,1,"y"],[120145,3],[120146,1,"a"],[120147,1,"b"],[120148,1,"c"],[120149,1,"d"],[120150,1,"e"],[120151,1,"f"],[120152,1,"g"],[120153,1,"h"],[120154,1,"i"],[120155,1,"j"],[120156,1,"k"],[120157,1,"l"],[120158,1,"m"],[120159,1,"n"],[120160,1,"o"],[120161,1,"p"],[120162,1,"q"],[120163,1,"r"],[120164,1,"s"],[120165,1,"t"],[120166,1,"u"],[120167,1,"v"],[120168,1,"w"],[120169,1,"x"],[120170,1,"y"],[120171,1,"z"],[120172,1,"a"],[120173,1,"b"],[120174,1,"c"],[120175,1,"d"],[120176,1,"e"],[120177,1,"f"],[120178,1,"g"],[120179,1,"h"],[120180,1,"i"],[120181,1,"j"],[120182,1,"k"],[120183,1,"l"],[120184,1,"m"],[120185,1,"n"],[120186,1,"o"],[120187,1,"p"],[120188,1,"q"],[120189,1,"r"],[120190,1,"s"],[120191,1,"t"],[120192,1,"u"],[120193,1,"v"],[120194,1,"w"],[120195,1,"x"],[120196,1,"y"],[120197,1,"z"],[120198,1,"a"],[120199,1,"b"],[120200,1,"c"],[120201,1,"d"],[120202,1,"e"],[120203,1,"f"],[120204,1,"g"],[120205,1,"h"],[120206,1,"i"],[120207,1,"j"],[120208,1,"k"],[120209,1,"l"],[120210,1,"m"],[120211,1,"n"],[120212,1,"o"],[120213,1,"p"],[120214,1,"q"],[120215,1,"r"],[120216,1,"s"],[120217,1,"t"],[120218,1,"u"],[120219,1,"v"],[120220,1,"w"],[120221,1,"x"],[120222,1,"y"],[120223,1,"z"],[120224,1,"a"],[120225,1,"b"],[120226,1,"c"],[120227,1,"d"],[120228,1,"e"],[120229,1,"f"],[120230,1,"g"],[120231,1,"h"],[120232,1,"i"],[120233,1,"j"],[120234,1,"k"],[120235,1,"l"],[120236,1,"m"],[120237,1,"n"],[120238,1,"o"],[120239,1,"p"],[120240,1,"q"],[120241,1,"r"],[120242,1,"s"],[120243,1,"t"],[120244,1,"u"],[120245,1,"v"],[120246,1,"w"],[120247,1,"x"],[120248,1,"y"],[120249,1,"z"],[120250,1,"a"],[120251,1,"b"],[120252,1,"c"],[120253,1,"d"],[120254,1,"e"],[120255,1,"f"],[120256,1,"g"],[120257,1,"h"],[120258,1,"i"],[120259,1,"j"],[120260,1,"k"],[120261,1,"l"],[120262,1,"m"],[120263,1,"n"],[120264,1,"o"],[120265,1,"p"],[120266,1,"q"],[120267,1,"r"],[120268,1,"s"],[120269,1,"t"],[120270,1,"u"],[120271,1,"v"],[120272,1,"w"],[120273,1,"x"],[120274,1,"y"],[120275,1,"z"],[120276,1,"a"],[120277,1,"b"],[120278,1,"c"],[120279,1,"d"],[120280,1,"e"],[120281,1,"f"],[120282,1,"g"],[120283,1,"h"],[120284,1,"i"],[120285,1,"j"],[120286,1,"k"],[120287,1,"l"],[120288,1,"m"],[120289,1,"n"],[120290,1,"o"],[120291,1,"p"],[120292,1,"q"],[120293,1,"r"],[120294,1,"s"],[120295,1,"t"],[120296,1,"u"],[120297,1,"v"],[120298,1,"w"],[120299,1,"x"],[120300,1,"y"],[120301,1,"z"],[120302,1,"a"],[120303,1,"b"],[120304,1,"c"],[120305,1,"d"],[120306,1,"e"],[120307,1,"f"],[120308,1,"g"],[120309,1,"h"],[120310,1,"i"],[120311,1,"j"],[120312,1,"k"],[120313,1,"l"],[120314,1,"m"],[120315,1,"n"],[120316,1,"o"],[120317,1,"p"],[120318,1,"q"],[120319,1,"r"],[120320,1,"s"],[120321,1,"t"],[120322,1,"u"],[120323,1,"v"],[120324,1,"w"],[120325,1,"x"],[120326,1,"y"],[120327,1,"z"],[120328,1,"a"],[120329,1,"b"],[120330,1,"c"],[120331,1,"d"],[120332,1,"e"],[120333,1,"f"],[120334,1,"g"],[120335,1,"h"],[120336,1,"i"],[120337,1,"j"],[120338,1,"k"],[120339,1,"l"],[120340,1,"m"],[120341,1,"n"],[120342,1,"o"],[120343,1,"p"],[120344,1,"q"],[120345,1,"r"],[120346,1,"s"],[120347,1,"t"],[120348,1,"u"],[120349,1,"v"],[120350,1,"w"],[120351,1,"x"],[120352,1,"y"],[120353,1,"z"],[120354,1,"a"],[120355,1,"b"],[120356,1,"c"],[120357,1,"d"],[120358,1,"e"],[120359,1,"f"],[120360,1,"g"],[120361,1,"h"],[120362,1,"i"],[120363,1,"j"],[120364,1,"k"],[120365,1,"l"],[120366,1,"m"],[120367,1,"n"],[120368,1,"o"],[120369,1,"p"],[120370,1,"q"],[120371,1,"r"],[120372,1,"s"],[120373,1,"t"],[120374,1,"u"],[120375,1,"v"],[120376,1,"w"],[120377,1,"x"],[120378,1,"y"],[120379,1,"z"],[120380,1,"a"],[120381,1,"b"],[120382,1,"c"],[120383,1,"d"],[120384,1,"e"],[120385,1,"f"],[120386,1,"g"],[120387,1,"h"],[120388,1,"i"],[120389,1,"j"],[120390,1,"k"],[120391,1,"l"],[120392,1,"m"],[120393,1,"n"],[120394,1,"o"],[120395,1,"p"],[120396,1,"q"],[120397,1,"r"],[120398,1,"s"],[120399,1,"t"],[120400,1,"u"],[120401,1,"v"],[120402,1,"w"],[120403,1,"x"],[120404,1,"y"],[120405,1,"z"],[120406,1,"a"],[120407,1,"b"],[120408,1,"c"],[120409,1,"d"],[120410,1,"e"],[120411,1,"f"],[120412,1,"g"],[120413,1,"h"],[120414,1,"i"],[120415,1,"j"],[120416,1,"k"],[120417,1,"l"],[120418,1,"m"],[120419,1,"n"],[120420,1,"o"],[120421,1,"p"],[120422,1,"q"],[120423,1,"r"],[120424,1,"s"],[120425,1,"t"],[120426,1,"u"],[120427,1,"v"],[120428,1,"w"],[120429,1,"x"],[120430,1,"y"],[120431,1,"z"],[120432,1,"a"],[120433,1,"b"],[120434,1,"c"],[120435,1,"d"],[120436,1,"e"],[120437,1,"f"],[120438,1,"g"],[120439,1,"h"],[120440,1,"i"],[120441,1,"j"],[120442,1,"k"],[120443,1,"l"],[120444,1,"m"],[120445,1,"n"],[120446,1,"o"],[120447,1,"p"],[120448,1,"q"],[120449,1,"r"],[120450,1,"s"],[120451,1,"t"],[120452,1,"u"],[120453,1,"v"],[120454,1,"w"],[120455,1,"x"],[120456,1,"y"],[120457,1,"z"],[120458,1,"a"],[120459,1,"b"],[120460,1,"c"],[120461,1,"d"],[120462,1,"e"],[120463,1,"f"],[120464,1,"g"],[120465,1,"h"],[120466,1,"i"],[120467,1,"j"],[120468,1,"k"],[120469,1,"l"],[120470,1,"m"],[120471,1,"n"],[120472,1,"o"],[120473,1,"p"],[120474,1,"q"],[120475,1,"r"],[120476,1,"s"],[120477,1,"t"],[120478,1,"u"],[120479,1,"v"],[120480,1,"w"],[120481,1,"x"],[120482,1,"y"],[120483,1,"z"],[120484,1,"ı"],[120485,1,"ȷ"],[[120486,120487],3],[120488,1,"α"],[120489,1,"β"],[120490,1,"γ"],[120491,1,"δ"],[120492,1,"ε"],[120493,1,"ζ"],[120494,1,"η"],[120495,1,"θ"],[120496,1,"ι"],[120497,1,"κ"],[120498,1,"λ"],[120499,1,"μ"],[120500,1,"ν"],[120501,1,"ξ"],[120502,1,"ο"],[120503,1,"π"],[120504,1,"ρ"],[120505,1,"θ"],[120506,1,"σ"],[120507,1,"τ"],[120508,1,"υ"],[120509,1,"φ"],[120510,1,"χ"],[120511,1,"ψ"],[120512,1,"ω"],[120513,1,"∇"],[120514,1,"α"],[120515,1,"β"],[120516,1,"γ"],[120517,1,"δ"],[120518,1,"ε"],[120519,1,"ζ"],[120520,1,"η"],[120521,1,"θ"],[120522,1,"ι"],[120523,1,"κ"],[120524,1,"λ"],[120525,1,"μ"],[120526,1,"ν"],[120527,1,"ξ"],[120528,1,"ο"],[120529,1,"π"],[120530,1,"ρ"],[[120531,120532],1,"σ"],[120533,1,"τ"],[120534,1,"υ"],[120535,1,"φ"],[120536,1,"χ"],[120537,1,"ψ"],[120538,1,"ω"],[120539,1,"∂"],[120540,1,"ε"],[120541,1,"θ"],[120542,1,"κ"],[120543,1,"φ"],[120544,1,"ρ"],[120545,1,"π"],[120546,1,"α"],[120547,1,"β"],[120548,1,"γ"],[120549,1,"δ"],[120550,1,"ε"],[120551,1,"ζ"],[120552,1,"η"],[120553,1,"θ"],[120554,1,"ι"],[120555,1,"κ"],[120556,1,"λ"],[120557,1,"μ"],[120558,1,"ν"],[120559,1,"ξ"],[120560,1,"ο"],[120561,1,"π"],[120562,1,"ρ"],[120563,1,"θ"],[120564,1,"σ"],[120565,1,"τ"],[120566,1,"υ"],[120567,1,"φ"],[120568,1,"χ"],[120569,1,"ψ"],[120570,1,"ω"],[120571,1,"∇"],[120572,1,"α"],[120573,1,"β"],[120574,1,"γ"],[120575,1,"δ"],[120576,1,"ε"],[120577,1,"ζ"],[120578,1,"η"],[120579,1,"θ"],[120580,1,"ι"],[120581,1,"κ"],[120582,1,"λ"],[120583,1,"μ"],[120584,1,"ν"],[120585,1,"ξ"],[120586,1,"ο"],[120587,1,"π"],[120588,1,"ρ"],[[120589,120590],1,"σ"],[120591,1,"τ"],[120592,1,"υ"],[120593,1,"φ"],[120594,1,"χ"],[120595,1,"ψ"],[120596,1,"ω"],[120597,1,"∂"],[120598,1,"ε"],[120599,1,"θ"],[120600,1,"κ"],[120601,1,"φ"],[120602,1,"ρ"],[120603,1,"π"],[120604,1,"α"],[120605,1,"β"],[120606,1,"γ"],[120607,1,"δ"],[120608,1,"ε"],[120609,1,"ζ"],[120610,1,"η"],[120611,1,"θ"],[120612,1,"ι"],[120613,1,"κ"],[120614,1,"λ"],[120615,1,"μ"],[120616,1,"ν"],[120617,1,"ξ"],[120618,1,"ο"],[120619,1,"π"],[120620,1,"ρ"],[120621,1,"θ"],[120622,1,"σ"],[120623,1,"τ"],[120624,1,"υ"],[120625,1,"φ"],[120626,1,"χ"],[120627,1,"ψ"],[120628,1,"ω"],[120629,1,"∇"],[120630,1,"α"],[120631,1,"β"],[120632,1,"γ"],[120633,1,"δ"],[120634,1,"ε"],[120635,1,"ζ"],[120636,1,"η"],[120637,1,"θ"],[120638,1,"ι"],[120639,1,"κ"],[120640,1,"λ"],[120641,1,"μ"],[120642,1,"ν"],[120643,1,"ξ"],[120644,1,"ο"],[120645,1,"π"],[120646,1,"ρ"],[[120647,120648],1,"σ"],[120649,1,"τ"],[120650,1,"υ"],[120651,1,"φ"],[120652,1,"χ"],[120653,1,"ψ"],[120654,1,"ω"],[120655,1,"∂"],[120656,1,"ε"],[120657,1,"θ"],[120658,1,"κ"],[120659,1,"φ"],[120660,1,"ρ"],[120661,1,"π"],[120662,1,"α"],[120663,1,"β"],[120664,1,"γ"],[120665,1,"δ"],[120666,1,"ε"],[120667,1,"ζ"],[120668,1,"η"],[120669,1,"θ"],[120670,1,"ι"],[120671,1,"κ"],[120672,1,"λ"],[120673,1,"μ"],[120674,1,"ν"],[120675,1,"ξ"],[120676,1,"ο"],[120677,1,"π"],[120678,1,"ρ"],[120679,1,"θ"],[120680,1,"σ"],[120681,1,"τ"],[120682,1,"υ"],[120683,1,"φ"],[120684,1,"χ"],[120685,1,"ψ"],[120686,1,"ω"],[120687,1,"∇"],[120688,1,"α"],[120689,1,"β"],[120690,1,"γ"],[120691,1,"δ"],[120692,1,"ε"],[120693,1,"ζ"],[120694,1,"η"],[120695,1,"θ"],[120696,1,"ι"],[120697,1,"κ"],[120698,1,"λ"],[120699,1,"μ"],[120700,1,"ν"],[120701,1,"ξ"],[120702,1,"ο"],[120703,1,"π"],[120704,1,"ρ"],[[120705,120706],1,"σ"],[120707,1,"τ"],[120708,1,"υ"],[120709,1,"φ"],[120710,1,"χ"],[120711,1,"ψ"],[120712,1,"ω"],[120713,1,"∂"],[120714,1,"ε"],[120715,1,"θ"],[120716,1,"κ"],[120717,1,"φ"],[120718,1,"ρ"],[120719,1,"π"],[120720,1,"α"],[120721,1,"β"],[120722,1,"γ"],[120723,1,"δ"],[120724,1,"ε"],[120725,1,"ζ"],[120726,1,"η"],[120727,1,"θ"],[120728,1,"ι"],[120729,1,"κ"],[120730,1,"λ"],[120731,1,"μ"],[120732,1,"ν"],[120733,1,"ξ"],[120734,1,"ο"],[120735,1,"π"],[120736,1,"ρ"],[120737,1,"θ"],[120738,1,"σ"],[120739,1,"τ"],[120740,1,"υ"],[120741,1,"φ"],[120742,1,"χ"],[120743,1,"ψ"],[120744,1,"ω"],[120745,1,"∇"],[120746,1,"α"],[120747,1,"β"],[120748,1,"γ"],[120749,1,"δ"],[120750,1,"ε"],[120751,1,"ζ"],[120752,1,"η"],[120753,1,"θ"],[120754,1,"ι"],[120755,1,"κ"],[120756,1,"λ"],[120757,1,"μ"],[120758,1,"ν"],[120759,1,"ξ"],[120760,1,"ο"],[120761,1,"π"],[120762,1,"ρ"],[[120763,120764],1,"σ"],[120765,1,"τ"],[120766,1,"υ"],[120767,1,"φ"],[120768,1,"χ"],[120769,1,"ψ"],[120770,1,"ω"],[120771,1,"∂"],[120772,1,"ε"],[120773,1,"θ"],[120774,1,"κ"],[120775,1,"φ"],[120776,1,"ρ"],[120777,1,"π"],[[120778,120779],1,"ϝ"],[[120780,120781],3],[120782,1,"0"],[120783,1,"1"],[120784,1,"2"],[120785,1,"3"],[120786,1,"4"],[120787,1,"5"],[120788,1,"6"],[120789,1,"7"],[120790,1,"8"],[120791,1,"9"],[120792,1,"0"],[120793,1,"1"],[120794,1,"2"],[120795,1,"3"],[120796,1,"4"],[120797,1,"5"],[120798,1,"6"],[120799,1,"7"],[120800,1,"8"],[120801,1,"9"],[120802,1,"0"],[120803,1,"1"],[120804,1,"2"],[120805,1,"3"],[120806,1,"4"],[120807,1,"5"],[120808,1,"6"],[120809,1,"7"],[120810,1,"8"],[120811,1,"9"],[120812,1,"0"],[120813,1,"1"],[120814,1,"2"],[120815,1,"3"],[120816,1,"4"],[120817,1,"5"],[120818,1,"6"],[120819,1,"7"],[120820,1,"8"],[120821,1,"9"],[120822,1,"0"],[120823,1,"1"],[120824,1,"2"],[120825,1,"3"],[120826,1,"4"],[120827,1,"5"],[120828,1,"6"],[120829,1,"7"],[120830,1,"8"],[120831,1,"9"],[[120832,121343],2],[[121344,121398],2],[[121399,121402],2],[[121403,121452],2],[[121453,121460],2],[121461,2],[[121462,121475],2],[121476,2],[[121477,121483],2],[[121484,121498],3],[[121499,121503],2],[121504,3],[[121505,121519],2],[[121520,122623],3],[[122624,122654],2],[[122655,122879],3],[[122880,122886],2],[122887,3],[[122888,122904],2],[[122905,122906],3],[[122907,122913],2],[122914,3],[[122915,122916],2],[122917,3],[[122918,122922],2],[[122923,123135],3],[[123136,123180],2],[[123181,123183],3],[[123184,123197],2],[[123198,123199],3],[[123200,123209],2],[[123210,123213],3],[123214,2],[123215,2],[[123216,123535],3],[[123536,123566],2],[[123567,123583],3],[[123584,123641],2],[[123642,123646],3],[123647,2],[[123648,124895],3],[[124896,124902],2],[124903,3],[[124904,124907],2],[124908,3],[[124909,124910],2],[124911,3],[[124912,124926],2],[124927,3],[[124928,125124],2],[[125125,125126],3],[[125127,125135],2],[[125136,125142],2],[[125143,125183],3],[125184,1,"𞤢"],[125185,1,"𞤣"],[125186,1,"𞤤"],[125187,1,"𞤥"],[125188,1,"𞤦"],[125189,1,"𞤧"],[125190,1,"𞤨"],[125191,1,"𞤩"],[125192,1,"𞤪"],[125193,1,"𞤫"],[125194,1,"𞤬"],[125195,1,"𞤭"],[125196,1,"𞤮"],[125197,1,"𞤯"],[125198,1,"𞤰"],[125199,1,"𞤱"],[125200,1,"𞤲"],[125201,1,"𞤳"],[125202,1,"𞤴"],[125203,1,"𞤵"],[125204,1,"𞤶"],[125205,1,"𞤷"],[125206,1,"𞤸"],[125207,1,"𞤹"],[125208,1,"𞤺"],[125209,1,"𞤻"],[125210,1,"𞤼"],[125211,1,"𞤽"],[125212,1,"𞤾"],[125213,1,"𞤿"],[125214,1,"𞥀"],[125215,1,"𞥁"],[125216,1,"𞥂"],[125217,1,"𞥃"],[[125218,125258],2],[125259,2],[[125260,125263],3],[[125264,125273],2],[[125274,125277],3],[[125278,125279],2],[[125280,126064],3],[[126065,126132],2],[[126133,126208],3],[[126209,126269],2],[[126270,126463],3],[126464,1,"ا"],[126465,1,"ب"],[126466,1,"ج"],[126467,1,"د"],[126468,3],[126469,1,"و"],[126470,1,"ز"],[126471,1,"ح"],[126472,1,"ط"],[126473,1,"ي"],[126474,1,"ك"],[126475,1,"ل"],[126476,1,"م"],[126477,1,"ن"],[126478,1,"س"],[126479,1,"ع"],[126480,1,"ف"],[126481,1,"ص"],[126482,1,"ق"],[126483,1,"ر"],[126484,1,"ش"],[126485,1,"ت"],[126486,1,"ث"],[126487,1,"خ"],[126488,1,"ذ"],[126489,1,"ض"],[126490,1,"ظ"],[126491,1,"غ"],[126492,1,"ٮ"],[126493,1,"ں"],[126494,1,"ڡ"],[126495,1,"ٯ"],[126496,3],[126497,1,"ب"],[126498,1,"ج"],[126499,3],[126500,1,"ه"],[[126501,126502],3],[126503,1,"ح"],[126504,3],[126505,1,"ي"],[126506,1,"ك"],[126507,1,"ل"],[126508,1,"م"],[126509,1,"ن"],[126510,1,"س"],[126511,1,"ع"],[126512,1,"ف"],[126513,1,"ص"],[126514,1,"ق"],[126515,3],[126516,1,"ش"],[126517,1,"ت"],[126518,1,"ث"],[126519,1,"خ"],[126520,3],[126521,1,"ض"],[126522,3],[126523,1,"غ"],[[126524,126529],3],[126530,1,"ج"],[[126531,126534],3],[126535,1,"ح"],[126536,3],[126537,1,"ي"],[126538,3],[126539,1,"ل"],[126540,3],[126541,1,"ن"],[126542,1,"س"],[126543,1,"ع"],[126544,3],[126545,1,"ص"],[126546,1,"ق"],[126547,3],[126548,1,"ش"],[[126549,126550],3],[126551,1,"خ"],[126552,3],[126553,1,"ض"],[126554,3],[126555,1,"غ"],[126556,3],[126557,1,"ں"],[126558,3],[126559,1,"ٯ"],[126560,3],[126561,1,"ب"],[126562,1,"ج"],[126563,3],[126564,1,"ه"],[[126565,126566],3],[126567,1,"ح"],[126568,1,"ط"],[126569,1,"ي"],[126570,1,"ك"],[126571,3],[126572,1,"م"],[126573,1,"ن"],[126574,1,"س"],[126575,1,"ع"],[126576,1,"ف"],[126577,1,"ص"],[126578,1,"ق"],[126579,3],[126580,1,"ش"],[126581,1,"ت"],[126582,1,"ث"],[126583,1,"خ"],[126584,3],[126585,1,"ض"],[126586,1,"ظ"],[126587,1,"غ"],[126588,1,"ٮ"],[126589,3],[126590,1,"ڡ"],[126591,3],[126592,1,"ا"],[126593,1,"ب"],[126594,1,"ج"],[126595,1,"د"],[126596,1,"ه"],[126597,1,"و"],[126598,1,"ز"],[126599,1,"ح"],[126600,1,"ط"],[126601,1,"ي"],[126602,3],[126603,1,"ل"],[126604,1,"م"],[126605,1,"ن"],[126606,1,"س"],[126607,1,"ع"],[126608,1,"ف"],[126609,1,"ص"],[126610,1,"ق"],[126611,1,"ر"],[126612,1,"ش"],[126613,1,"ت"],[126614,1,"ث"],[126615,1,"خ"],[126616,1,"ذ"],[126617,1,"ض"],[126618,1,"ظ"],[126619,1,"غ"],[[126620,126624],3],[126625,1,"ب"],[126626,1,"ج"],[126627,1,"د"],[126628,3],[126629,1,"و"],[126630,1,"ز"],[126631,1,"ح"],[126632,1,"ط"],[126633,1,"ي"],[126634,3],[126635,1,"ل"],[126636,1,"م"],[126637,1,"ن"],[126638,1,"س"],[126639,1,"ع"],[126640,1,"ف"],[126641,1,"ص"],[126642,1,"ق"],[126643,1,"ر"],[126644,1,"ش"],[126645,1,"ت"],[126646,1,"ث"],[126647,1,"خ"],[126648,1,"ذ"],[126649,1,"ض"],[126650,1,"ظ"],[126651,1,"غ"],[[126652,126703],3],[[126704,126705],2],[[126706,126975],3],[[126976,127019],2],[[127020,127023],3],[[127024,127123],2],[[127124,127135],3],[[127136,127150],2],[[127151,127152],3],[[127153,127166],2],[127167,2],[127168,3],[[127169,127183],2],[127184,3],[[127185,127199],2],[[127200,127221],2],[[127222,127231],3],[127232,3],[127233,5,"0,"],[127234,5,"1,"],[127235,5,"2,"],[127236,5,"3,"],[127237,5,"4,"],[127238,5,"5,"],[127239,5,"6,"],[127240,5,"7,"],[127241,5,"8,"],[127242,5,"9,"],[[127243,127244],2],[[127245,127247],2],[127248,5,"(a)"],[127249,5,"(b)"],[127250,5,"(c)"],[127251,5,"(d)"],[127252,5,"(e)"],[127253,5,"(f)"],[127254,5,"(g)"],[127255,5,"(h)"],[127256,5,"(i)"],[127257,5,"(j)"],[127258,5,"(k)"],[127259,5,"(l)"],[127260,5,"(m)"],[127261,5,"(n)"],[127262,5,"(o)"],[127263,5,"(p)"],[127264,5,"(q)"],[127265,5,"(r)"],[127266,5,"(s)"],[127267,5,"(t)"],[127268,5,"(u)"],[127269,5,"(v)"],[127270,5,"(w)"],[127271,5,"(x)"],[127272,5,"(y)"],[127273,5,"(z)"],[127274,1,"〔s〕"],[127275,1,"c"],[127276,1,"r"],[127277,1,"cd"],[127278,1,"wz"],[127279,2],[127280,1,"a"],[127281,1,"b"],[127282,1,"c"],[127283,1,"d"],[127284,1,"e"],[127285,1,"f"],[127286,1,"g"],[127287,1,"h"],[127288,1,"i"],[127289,1,"j"],[127290,1,"k"],[127291,1,"l"],[127292,1,"m"],[127293,1,"n"],[127294,1,"o"],[127295,1,"p"],[127296,1,"q"],[127297,1,"r"],[127298,1,"s"],[127299,1,"t"],[127300,1,"u"],[127301,1,"v"],[127302,1,"w"],[127303,1,"x"],[127304,1,"y"],[127305,1,"z"],[127306,1,"hv"],[127307,1,"mv"],[127308,1,"sd"],[127309,1,"ss"],[127310,1,"ppv"],[127311,1,"wc"],[[127312,127318],2],[127319,2],[[127320,127326],2],[127327,2],[[127328,127337],2],[127338,1,"mc"],[127339,1,"md"],[127340,1,"mr"],[[127341,127343],2],[[127344,127352],2],[127353,2],[127354,2],[[127355,127356],2],[[127357,127358],2],[127359,2],[[127360,127369],2],[[127370,127373],2],[[127374,127375],2],[127376,1,"dj"],[[127377,127386],2],[[127387,127404],2],[127405,2],[[127406,127461],3],[[127462,127487],2],[127488,1,"ほか"],[127489,1,"ココ"],[127490,1,"サ"],[[127491,127503],3],[127504,1,"手"],[127505,1,"字"],[127506,1,"双"],[127507,1,"デ"],[127508,1,"二"],[127509,1,"多"],[127510,1,"解"],[127511,1,"天"],[127512,1,"交"],[127513,1,"映"],[127514,1,"無"],[127515,1,"料"],[127516,1,"前"],[127517,1,"後"],[127518,1,"再"],[127519,1,"新"],[127520,1,"初"],[127521,1,"終"],[127522,1,"生"],[127523,1,"販"],[127524,1,"声"],[127525,1,"吹"],[127526,1,"演"],[127527,1,"投"],[127528,1,"捕"],[127529,1,"一"],[127530,1,"三"],[127531,1,"遊"],[127532,1,"左"],[127533,1,"中"],[127534,1,"右"],[127535,1,"指"],[127536,1,"走"],[127537,1,"打"],[127538,1,"禁"],[127539,1,"空"],[127540,1,"合"],[127541,1,"満"],[127542,1,"有"],[127543,1,"月"],[127544,1,"申"],[127545,1,"割"],[127546,1,"営"],[127547,1,"配"],[[127548,127551],3],[127552,1,"〔本〕"],[127553,1,"〔三〕"],[127554,1,"〔二〕"],[127555,1,"〔安〕"],[127556,1,"〔点〕"],[127557,1,"〔打〕"],[127558,1,"〔盗〕"],[127559,1,"〔勝〕"],[127560,1,"〔敗〕"],[[127561,127567],3],[127568,1,"得"],[127569,1,"可"],[[127570,127583],3],[[127584,127589],2],[[127590,127743],3],[[127744,127776],2],[[127777,127788],2],[[127789,127791],2],[[127792,127797],2],[127798,2],[[127799,127868],2],[127869,2],[[127870,127871],2],[[127872,127891],2],[[127892,127903],2],[[127904,127940],2],[127941,2],[[127942,127946],2],[[127947,127950],2],[[127951,127955],2],[[127956,127967],2],[[127968,127984],2],[[127985,127991],2],[[127992,127999],2],[[128000,128062],2],[128063,2],[128064,2],[128065,2],[[128066,128247],2],[128248,2],[[128249,128252],2],[[128253,128254],2],[128255,2],[[128256,128317],2],[[128318,128319],2],[[128320,128323],2],[[128324,128330],2],[[128331,128335],2],[[128336,128359],2],[[128360,128377],2],[128378,2],[[128379,128419],2],[128420,2],[[128421,128506],2],[[128507,128511],2],[128512,2],[[128513,128528],2],[128529,2],[[128530,128532],2],[128533,2],[128534,2],[128535,2],[128536,2],[128537,2],[128538,2],[128539,2],[[128540,128542],2],[128543,2],[[128544,128549],2],[[128550,128551],2],[[128552,128555],2],[128556,2],[128557,2],[[128558,128559],2],[[128560,128563],2],[128564,2],[[128565,128576],2],[[128577,128578],2],[[128579,128580],2],[[128581,128591],2],[[128592,128639],2],[[128640,128709],2],[[128710,128719],2],[128720,2],[[128721,128722],2],[[128723,128724],2],[128725,2],[[128726,128727],2],[[128728,128732],3],[[128733,128735],2],[[128736,128748],2],[[128749,128751],3],[[128752,128755],2],[[128756,128758],2],[[128759,128760],2],[128761,2],[128762,2],[[128763,128764],2],[[128765,128767],3],[[128768,128883],2],[[128884,128895],3],[[128896,128980],2],[[128981,128984],2],[[128985,128991],3],[[128992,129003],2],[[129004,129007],3],[129008,2],[[129009,129023],3],[[129024,129035],2],[[129036,129039],3],[[129040,129095],2],[[129096,129103],3],[[129104,129113],2],[[129114,129119],3],[[129120,129159],2],[[129160,129167],3],[[129168,129197],2],[[129198,129199],3],[[129200,129201],2],[[129202,129279],3],[[129280,129291],2],[129292,2],[[129293,129295],2],[[129296,129304],2],[[129305,129310],2],[129311,2],[[129312,129319],2],[[129320,129327],2],[129328,2],[[129329,129330],2],[[129331,129342],2],[129343,2],[[129344,129355],2],[129356,2],[[129357,129359],2],[[129360,129374],2],[[129375,129387],2],[[129388,129392],2],[129393,2],[129394,2],[[129395,129398],2],[[129399,129400],2],[129401,2],[129402,2],[129403,2],[[129404,129407],2],[[129408,129412],2],[[129413,129425],2],[[129426,129431],2],[[129432,129442],2],[[129443,129444],2],[[129445,129450],2],[[129451,129453],2],[[129454,129455],2],[[129456,129465],2],[[129466,129471],2],[129472,2],[[129473,129474],2],[[129475,129482],2],[129483,2],[129484,2],[[129485,129487],2],[[129488,129510],2],[[129511,129535],2],[[129536,129619],2],[[129620,129631],3],[[129632,129645],2],[[129646,129647],3],[[129648,129651],2],[129652,2],[[129653,129655],3],[[129656,129658],2],[[129659,129660],2],[[129661,129663],3],[[129664,129666],2],[[129667,129670],2],[[129671,129679],3],[[129680,129685],2],[[129686,129704],2],[[129705,129708],2],[[129709,129711],3],[[129712,129718],2],[[129719,129722],2],[[129723,129727],3],[[129728,129730],2],[[129731,129733],2],[[129734,129743],3],[[129744,129750],2],[[129751,129753],2],[[129754,129759],3],[[129760,129767],2],[[129768,129775],3],[[129776,129782],2],[[129783,129791],3],[[129792,129938],2],[129939,3],[[129940,129994],2],[[129995,130031],3],[130032,1,"0"],[130033,1,"1"],[130034,1,"2"],[130035,1,"3"],[130036,1,"4"],[130037,1,"5"],[130038,1,"6"],[130039,1,"7"],[130040,1,"8"],[130041,1,"9"],[[130042,131069],3],[[131070,131071],3],[[131072,173782],2],[[173783,173789],2],[[173790,173791],2],[[173792,173823],3],[[173824,177972],2],[[177973,177976],2],[[177977,177983],3],[[177984,178205],2],[[178206,178207],3],[[178208,183969],2],[[183970,183983],3],[[183984,191456],2],[[191457,194559],3],[194560,1,"丽"],[194561,1,"丸"],[194562,1,"乁"],[194563,1,"𠄢"],[194564,1,"你"],[194565,1,"侮"],[194566,1,"侻"],[194567,1,"倂"],[194568,1,"偺"],[194569,1,"備"],[194570,1,"僧"],[194571,1,"像"],[194572,1,"㒞"],[194573,1,"𠘺"],[194574,1,"免"],[194575,1,"兔"],[194576,1,"兤"],[194577,1,"具"],[194578,1,"𠔜"],[194579,1,"㒹"],[194580,1,"內"],[194581,1,"再"],[194582,1,"𠕋"],[194583,1,"冗"],[194584,1,"冤"],[194585,1,"仌"],[194586,1,"冬"],[194587,1,"况"],[194588,1,"𩇟"],[194589,1,"凵"],[194590,1,"刃"],[194591,1,"㓟"],[194592,1,"刻"],[194593,1,"剆"],[194594,1,"割"],[194595,1,"剷"],[194596,1,"㔕"],[194597,1,"勇"],[194598,1,"勉"],[194599,1,"勤"],[194600,1,"勺"],[194601,1,"包"],[194602,1,"匆"],[194603,1,"北"],[194604,1,"卉"],[194605,1,"卑"],[194606,1,"博"],[194607,1,"即"],[194608,1,"卽"],[[194609,194611],1,"卿"],[194612,1,"𠨬"],[194613,1,"灰"],[194614,1,"及"],[194615,1,"叟"],[194616,1,"𠭣"],[194617,1,"叫"],[194618,1,"叱"],[194619,1,"吆"],[194620,1,"咞"],[194621,1,"吸"],[194622,1,"呈"],[194623,1,"周"],[194624,1,"咢"],[194625,1,"哶"],[194626,1,"唐"],[194627,1,"啓"],[194628,1,"啣"],[[194629,194630],1,"善"],[194631,1,"喙"],[194632,1,"喫"],[194633,1,"喳"],[194634,1,"嗂"],[194635,1,"圖"],[194636,1,"嘆"],[194637,1,"圗"],[194638,1,"噑"],[194639,1,"噴"],[194640,1,"切"],[194641,1,"壮"],[194642,1,"城"],[194643,1,"埴"],[194644,1,"堍"],[194645,1,"型"],[194646,1,"堲"],[194647,1,"報"],[194648,1,"墬"],[194649,1,"𡓤"],[194650,1,"売"],[194651,1,"壷"],[194652,1,"夆"],[194653,1,"多"],[194654,1,"夢"],[194655,1,"奢"],[194656,1,"𡚨"],[194657,1,"𡛪"],[194658,1,"姬"],[194659,1,"娛"],[194660,1,"娧"],[194661,1,"姘"],[194662,1,"婦"],[194663,1,"㛮"],[194664,3],[194665,1,"嬈"],[[194666,194667],1,"嬾"],[194668,1,"𡧈"],[194669,1,"寃"],[194670,1,"寘"],[194671,1,"寧"],[194672,1,"寳"],[194673,1,"𡬘"],[194674,1,"寿"],[194675,1,"将"],[194676,3],[194677,1,"尢"],[194678,1,"㞁"],[194679,1,"屠"],[194680,1,"屮"],[194681,1,"峀"],[194682,1,"岍"],[194683,1,"𡷤"],[194684,1,"嵃"],[194685,1,"𡷦"],[194686,1,"嵮"],[194687,1,"嵫"],[194688,1,"嵼"],[194689,1,"巡"],[194690,1,"巢"],[194691,1,"㠯"],[194692,1,"巽"],[194693,1,"帨"],[194694,1,"帽"],[194695,1,"幩"],[194696,1,"㡢"],[194697,1,"𢆃"],[194698,1,"㡼"],[194699,1,"庰"],[194700,1,"庳"],[194701,1,"庶"],[194702,1,"廊"],[194703,1,"𪎒"],[194704,1,"廾"],[[194705,194706],1,"𢌱"],[194707,1,"舁"],[[194708,194709],1,"弢"],[194710,1,"㣇"],[194711,1,"𣊸"],[194712,1,"𦇚"],[194713,1,"形"],[194714,1,"彫"],[194715,1,"㣣"],[194716,1,"徚"],[194717,1,"忍"],[194718,1,"志"],[194719,1,"忹"],[194720,1,"悁"],[194721,1,"㤺"],[194722,1,"㤜"],[194723,1,"悔"],[194724,1,"𢛔"],[194725,1,"惇"],[194726,1,"慈"],[194727,1,"慌"],[194728,1,"慎"],[194729,1,"慌"],[194730,1,"慺"],[194731,1,"憎"],[194732,1,"憲"],[194733,1,"憤"],[194734,1,"憯"],[194735,1,"懞"],[194736,1,"懲"],[194737,1,"懶"],[194738,1,"成"],[194739,1,"戛"],[194740,1,"扝"],[194741,1,"抱"],[194742,1,"拔"],[194743,1,"捐"],[194744,1,"𢬌"],[194745,1,"挽"],[194746,1,"拼"],[194747,1,"捨"],[194748,1,"掃"],[194749,1,"揤"],[194750,1,"𢯱"],[194751,1,"搢"],[194752,1,"揅"],[194753,1,"掩"],[194754,1,"㨮"],[194755,1,"摩"],[194756,1,"摾"],[194757,1,"撝"],[194758,1,"摷"],[194759,1,"㩬"],[194760,1,"敏"],[194761,1,"敬"],[194762,1,"𣀊"],[194763,1,"旣"],[194764,1,"書"],[194765,1,"晉"],[194766,1,"㬙"],[194767,1,"暑"],[194768,1,"㬈"],[194769,1,"㫤"],[194770,1,"冒"],[194771,1,"冕"],[194772,1,"最"],[194773,1,"暜"],[194774,1,"肭"],[194775,1,"䏙"],[194776,1,"朗"],[194777,1,"望"],[194778,1,"朡"],[194779,1,"杞"],[194780,1,"杓"],[194781,1,"𣏃"],[194782,1,"㭉"],[194783,1,"柺"],[194784,1,"枅"],[194785,1,"桒"],[194786,1,"梅"],[194787,1,"𣑭"],[194788,1,"梎"],[194789,1,"栟"],[194790,1,"椔"],[194791,1,"㮝"],[194792,1,"楂"],[194793,1,"榣"],[194794,1,"槪"],[194795,1,"檨"],[194796,1,"𣚣"],[194797,1,"櫛"],[194798,1,"㰘"],[194799,1,"次"],[194800,1,"𣢧"],[194801,1,"歔"],[194802,1,"㱎"],[194803,1,"歲"],[194804,1,"殟"],[194805,1,"殺"],[194806,1,"殻"],[194807,1,"𣪍"],[194808,1,"𡴋"],[194809,1,"𣫺"],[194810,1,"汎"],[194811,1,"𣲼"],[194812,1,"沿"],[194813,1,"泍"],[194814,1,"汧"],[194815,1,"洖"],[194816,1,"派"],[194817,1,"海"],[194818,1,"流"],[194819,1,"浩"],[194820,1,"浸"],[194821,1,"涅"],[194822,1,"𣴞"],[194823,1,"洴"],[194824,1,"港"],[194825,1,"湮"],[194826,1,"㴳"],[194827,1,"滋"],[194828,1,"滇"],[194829,1,"𣻑"],[194830,1,"淹"],[194831,1,"潮"],[194832,1,"𣽞"],[194833,1,"𣾎"],[194834,1,"濆"],[194835,1,"瀹"],[194836,1,"瀞"],[194837,1,"瀛"],[194838,1,"㶖"],[194839,1,"灊"],[194840,1,"災"],[194841,1,"灷"],[194842,1,"炭"],[194843,1,"𠔥"],[194844,1,"煅"],[194845,1,"𤉣"],[194846,1,"熜"],[194847,3],[194848,1,"爨"],[194849,1,"爵"],[194850,1,"牐"],[194851,1,"𤘈"],[194852,1,"犀"],[194853,1,"犕"],[194854,1,"𤜵"],[194855,1,"𤠔"],[194856,1,"獺"],[194857,1,"王"],[194858,1,"㺬"],[194859,1,"玥"],[[194860,194861],1,"㺸"],[194862,1,"瑇"],[194863,1,"瑜"],[194864,1,"瑱"],[194865,1,"璅"],[194866,1,"瓊"],[194867,1,"㼛"],[194868,1,"甤"],[194869,1,"𤰶"],[194870,1,"甾"],[194871,1,"𤲒"],[194872,1,"異"],[194873,1,"𢆟"],[194874,1,"瘐"],[194875,1,"𤾡"],[194876,1,"𤾸"],[194877,1,"𥁄"],[194878,1,"㿼"],[194879,1,"䀈"],[194880,1,"直"],[194881,1,"𥃳"],[194882,1,"𥃲"],[194883,1,"𥄙"],[194884,1,"𥄳"],[194885,1,"眞"],[[194886,194887],1,"真"],[194888,1,"睊"],[194889,1,"䀹"],[194890,1,"瞋"],[194891,1,"䁆"],[194892,1,"䂖"],[194893,1,"𥐝"],[194894,1,"硎"],[194895,1,"碌"],[194896,1,"磌"],[194897,1,"䃣"],[194898,1,"𥘦"],[194899,1,"祖"],[194900,1,"𥚚"],[194901,1,"𥛅"],[194902,1,"福"],[194903,1,"秫"],[194904,1,"䄯"],[194905,1,"穀"],[194906,1,"穊"],[194907,1,"穏"],[194908,1,"𥥼"],[[194909,194910],1,"𥪧"],[194911,3],[194912,1,"䈂"],[194913,1,"𥮫"],[194914,1,"篆"],[194915,1,"築"],[194916,1,"䈧"],[194917,1,"𥲀"],[194918,1,"糒"],[194919,1,"䊠"],[194920,1,"糨"],[194921,1,"糣"],[194922,1,"紀"],[194923,1,"𥾆"],[194924,1,"絣"],[194925,1,"䌁"],[194926,1,"緇"],[194927,1,"縂"],[194928,1,"繅"],[194929,1,"䌴"],[194930,1,"𦈨"],[194931,1,"𦉇"],[194932,1,"䍙"],[194933,1,"𦋙"],[194934,1,"罺"],[194935,1,"𦌾"],[194936,1,"羕"],[194937,1,"翺"],[194938,1,"者"],[194939,1,"𦓚"],[194940,1,"𦔣"],[194941,1,"聠"],[194942,1,"𦖨"],[194943,1,"聰"],[194944,1,"𣍟"],[194945,1,"䏕"],[194946,1,"育"],[194947,1,"脃"],[194948,1,"䐋"],[194949,1,"脾"],[194950,1,"媵"],[194951,1,"𦞧"],[194952,1,"𦞵"],[194953,1,"𣎓"],[194954,1,"𣎜"],[194955,1,"舁"],[194956,1,"舄"],[194957,1,"辞"],[194958,1,"䑫"],[194959,1,"芑"],[194960,1,"芋"],[194961,1,"芝"],[194962,1,"劳"],[194963,1,"花"],[194964,1,"芳"],[194965,1,"芽"],[194966,1,"苦"],[194967,1,"𦬼"],[194968,1,"若"],[194969,1,"茝"],[194970,1,"荣"],[194971,1,"莭"],[194972,1,"茣"],[194973,1,"莽"],[194974,1,"菧"],[194975,1,"著"],[194976,1,"荓"],[194977,1,"菊"],[194978,1,"菌"],[194979,1,"菜"],[194980,1,"𦰶"],[194981,1,"𦵫"],[194982,1,"𦳕"],[194983,1,"䔫"],[194984,1,"蓱"],[194985,1,"蓳"],[194986,1,"蔖"],[194987,1,"𧏊"],[194988,1,"蕤"],[194989,1,"𦼬"],[194990,1,"䕝"],[194991,1,"䕡"],[194992,1,"𦾱"],[194993,1,"𧃒"],[194994,1,"䕫"],[194995,1,"虐"],[194996,1,"虜"],[194997,1,"虧"],[194998,1,"虩"],[194999,1,"蚩"],[195000,1,"蚈"],[195001,1,"蜎"],[195002,1,"蛢"],[195003,1,"蝹"],[195004,1,"蜨"],[195005,1,"蝫"],[195006,1,"螆"],[195007,3],[195008,1,"蟡"],[195009,1,"蠁"],[195010,1,"䗹"],[195011,1,"衠"],[195012,1,"衣"],[195013,1,"𧙧"],[195014,1,"裗"],[195015,1,"裞"],[195016,1,"䘵"],[195017,1,"裺"],[195018,1,"㒻"],[195019,1,"𧢮"],[195020,1,"𧥦"],[195021,1,"䚾"],[195022,1,"䛇"],[195023,1,"誠"],[195024,1,"諭"],[195025,1,"變"],[195026,1,"豕"],[195027,1,"𧲨"],[195028,1,"貫"],[195029,1,"賁"],[195030,1,"贛"],[195031,1,"起"],[195032,1,"𧼯"],[195033,1,"𠠄"],[195034,1,"跋"],[195035,1,"趼"],[195036,1,"跰"],[195037,1,"𠣞"],[195038,1,"軔"],[195039,1,"輸"],[195040,1,"𨗒"],[195041,1,"𨗭"],[195042,1,"邔"],[195043,1,"郱"],[195044,1,"鄑"],[195045,1,"𨜮"],[195046,1,"鄛"],[195047,1,"鈸"],[195048,1,"鋗"],[195049,1,"鋘"],[195050,1,"鉼"],[195051,1,"鏹"],[195052,1,"鐕"],[195053,1,"𨯺"],[195054,1,"開"],[195055,1,"䦕"],[195056,1,"閷"],[195057,1,"𨵷"],[195058,1,"䧦"],[195059,1,"雃"],[195060,1,"嶲"],[195061,1,"霣"],[195062,1,"𩅅"],[195063,1,"𩈚"],[195064,1,"䩮"],[195065,1,"䩶"],[195066,1,"韠"],[195067,1,"𩐊"],[195068,1,"䪲"],[195069,1,"𩒖"],[[195070,195071],1,"頋"],[195072,1,"頩"],[195073,1,"𩖶"],[195074,1,"飢"],[195075,1,"䬳"],[195076,1,"餩"],[195077,1,"馧"],[195078,1,"駂"],[195079,1,"駾"],[195080,1,"䯎"],[195081,1,"𩬰"],[195082,1,"鬒"],[195083,1,"鱀"],[195084,1,"鳽"],[195085,1,"䳎"],[195086,1,"䳭"],[195087,1,"鵧"],[195088,1,"𪃎"],[195089,1,"䳸"],[195090,1,"𪄅"],[195091,1,"𪈎"],[195092,1,"𪊑"],[195093,1,"麻"],[195094,1,"䵖"],[195095,1,"黹"],[195096,1,"黾"],[195097,1,"鼅"],[195098,1,"鼏"],[195099,1,"鼖"],[195100,1,"鼻"],[195101,1,"𪘀"],[[195102,196605],3],[[196606,196607],3],[[196608,201546],2],[[201547,262141],3],[[262142,262143],3],[[262144,327677],3],[[327678,327679],3],[[327680,393213],3],[[393214,393215],3],[[393216,458749],3],[[458750,458751],3],[[458752,524285],3],[[524286,524287],3],[[524288,589821],3],[[589822,589823],3],[[589824,655357],3],[[655358,655359],3],[[655360,720893],3],[[720894,720895],3],[[720896,786429],3],[[786430,786431],3],[[786432,851965],3],[[851966,851967],3],[[851968,917501],3],[[917502,917503],3],[917504,3],[917505,3],[[917506,917535],3],[[917536,917631],3],[[917632,917759],3],[[917760,917999],7],[[918000,983037],3],[[983038,983039],3],[[983040,1048573],3],[[1048574,1048575],3],[[1048576,1114109],3],[[1114110,1114111],3]]');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************!*\
  !*** ./src/app/index.ts ***!
  \**************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _resconet_jsbridge__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @resconet/jsbridge */ "./node_modules/@resconet/jsbridge/src/JSBridge.js");
/* harmony import */ var _resconet_jsbridge__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_resconet_jsbridge__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lib */ "./src/lib/resizer.ts");
/* eslint-disable tree-shaking/no-side-effects-in-initialization */



const getDetailItem = (entityForm, detailViewName, detailItemName) => {
  const detailView = entityForm.getDetailView(detailViewName);
  return detailView.getItemByName(detailItemName);
};

const setImageValueToDetailView = (resizedImage, detailViewName, detailItemName) => {
  MobileCRM.UI.EntityForm.requestObject(entityForm => {
    getDetailItem(entityForm, detailViewName, detailItemName).value = resizedImage;
  }, e => {
    MobileCRM.bridge.alert(e);
  });
};

const resizeImageItem = (entityForm, detailViewName, detailItemImageName, width, height, quality) => {
  const urlImageData = getDetailItem(entityForm, detailViewName, detailItemImageName).value;
  (0,_lib__WEBPACK_IMPORTED_MODULE_1__.resizeImage)(urlImageData, height, width, quality).then(base64Image => {
    setImageValueToDetailView(base64Image, detailViewName, detailItemImageName);
  }).catch(() => {
    console.log("Image cannot be resized.");
  });
};

const onChangeHandler = entityForm => {
  var _entityForm$context;

  const urlSearchParams = new URLSearchParams(window.location.search);
  const detailViewName = urlSearchParams.get("detailView") || "General";
  const detailItemName = urlSearchParams.get("detailItemName") || "%image1";
  const height = parseInt(urlSearchParams.get("height") || "1080");
  const width = parseInt(urlSearchParams.get("width") || "1920");
  const quality = parseFloat(urlSearchParams.get("quality") || "0.5");

  if (((_entityForm$context = entityForm.context) === null || _entityForm$context === void 0 ? void 0 : _entityForm$context.changedItem) === detailItemName) {
    resizeImageItem(entityForm, detailViewName, detailItemName, width, height, quality);
  }
};

MobileCRM.UI.EntityForm.onChange(onChangeHandler, true);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=app.js.map