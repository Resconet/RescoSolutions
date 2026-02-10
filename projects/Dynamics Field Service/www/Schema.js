var FS = FS || {};
FS.Schema = FS.Schema || {};

FS.Schema.Account = {
    name: "account",
    properties: {
        accountId: "accountid",
        address1_City: "address1_city",
        address1_Country: "address1_country",
        address1_Latitude: "address1_latitude",
        address1_Line1: "address1_line1",
        address1_Line2: "address1_line2",
        address1_Line3: "address1_line3",
        address1_Longitude: "address1_longitude",
        address1_Name: "address1_name",
        address1_PostalCode: "address1_postalcode",
        address1_StateOrProvince: "address1_stateorprovince",
        address2_AddressTypeCode: "address2_addresstypecode",
        address2_Latitude: "address2_latitude",
        address2_Longitude: "address2_longitude",
        createdOn: "createdon",
        defaultPriceLevelId: "defaultpricelevelid",
        emailAddress1: "emailaddress1",
        fax: "fax",
        modifiedOn: "modifiedon",
        msdyn_billingAccount: "msdyn_billingaccount",
        msdyn_salesTaxCode: "msdyn_salestaxcode",
        msdyn_serviceTerritory: "msdyn_serviceterritory",
        msdyn_taxExempt: "msdyn_taxexempt",
        msdyn_workOrderInstructions: "msdyn_workorderinstructions",
        name: "name",
        ownerId: "ownerid",
        preferredEquipmentId: "preferredequipmentid",
        statusCode: "statuscode",
        telephone1: "telephone1",
        transactionCurrencyId: "transactioncurrencyid",
        webSiteURL: "websiteurl"
    }
};

FS.Schema.Annotation = {
    name: "annotation",
    properties: {
        annotationId: "annotationid",
        createdOn: "createdon",
        documentBody: "documentbody",
        fileName: "filename",
        fileSize: "filesize",
        isDocument: "isdocument",
        mimeType: "mimetype",
        modifiedOn: "modifiedon",
        noteText: "notetext",
        objectId: "objectid",
        objectTypeCode: "objecttypecode",
        ownerId: "ownerid",
        subject: "subject"
    }
};

FS.Schema.BookableResource = {
    name: "bookableresource",
    properties: {
        bookableResourceId: "bookableresourceid",
        createdOn: "createdon",
        modifiedOn: "modifiedon",
        msdyn_bookingsToDrip: "msdyn_bookingstodrip",
        msdyn_enableDripScheduling: "msdyn_enabledripscheduling",
        msdyn_timeOffApprovalRequired: "msdyn_timeoffapprovalrequired",
        msdyn_warehouse: "msdyn_warehouse",
        name: "name",
        ownerId: "ownerid",
        userId: "userid"
    }
};

FS.Schema.BookableResourceBooking = {
    name: "bookableresourcebooking",
    properties: {
        bookableResourceBookingId: "bookableresourcebookingid",
        bookingStatus: "bookingstatus",
        createdOn: "createdon",
        duration: "duration",
        endTime: "endtime",
        importSequenceNumber: "importsequencenumber",
        modifiedOn: "modifiedon",
        msdyn_actualArrivalTime: "msdyn_actualarrivaltime",
        msdyn_actualTravelDuration: "msdyn_actualtravelduration",
        msdyn_bookingMethod: "msdyn_bookingmethod",
        msdyn_cascadeCrewChanges: "msdyn_cascadecrewchanges",
        msdyn_crewmembertype: "msdyn_crewmembertype",
        msdyn_estimatedArrivalTime: "msdyn_estimatedarrivaltime",
        msdyn_estimatedTravelDuration: "msdyn_estimatedtravelduration",
        msdyn_latitude: "msdyn_latitude",
        msdyn_longitude: "msdyn_longitude",
        msdyn_milesTraveled: "msdyn_milestraveled",
        msdyn_preventTimestampCreation: "msdyn_preventtimestampcreation",
        msdyn_resourceGroup: "msdyn_resourcegroup",
        msdyn_totalBillableDuration: "msdyn_totalbillableduration",
        msdyn_totalBreakDuration: "msdyn_totalbreakduration",
        msdyn_totalCost: "msdyn_totalcost",
        msdyn_totalcost_Base: "msdyn_totalcost_base",
        msdyn_workOrder: "msdyn_workorder",
        name: "name",
        ownerId: "ownerid",
        resource: "resource",
        startTime: "starttime",
        statusCode: "statuscode",
        transactionCurrencyId: "transactioncurrencyid",
        versionNumber: "versionnumber"
    }
};

FS.Schema.BookingSetupMetadata = {
    name: "msdyn_bookingsetupmetadata",
    properties: {
        createdOn: "createdon",
        modifiedOn: "modifiedon",
        msdyn_bookingSetupMetadataId: "msdyn_bookingsetupmetadataid",
        msdyn_defaultBookingCanceledStatus: "msdyn_defaultbookingcanceledstatus",
        msdyn_defaultBookingCommittedStatus: "msdyn_defaultbookingcommittedstatus",
        msdyn_entityLogicalName: "msdyn_entitylogicalname",
        ownerId: "ownerid"
    }
};

FS.Schema.BookingStatus = {
    name: "bookingstatus",
    properties: {
        bookingStatusId: "bookingstatusid",
        createdOn: "createdon",
        description: "description",
        modifiedOn: "modifiedon",
        msdyn_fieldServiceStatus: "msdyn_fieldservicestatus",
        name: "name",
        ownerId: "ownerid",
        status: "status",
        statusCode: "statuscode"
    }
};

FS.Schema.BookingTimestamp = {
    name: "msdyn_bookingtimestamp",
    properties: {
        msdyn_booking: "msdyn_booking",
        msdyn_bookingTimestampId: "msdyn_bookingtimestampid",
        msdyn_generateJournals: "msdyn_generatejournals",
        msdyn_systemStatus: "msdyn_systemstatus",
        msdyn_timestampSource: "msdyn_timestampsource",
        msdyn_timestampTime: "msdyn_timestamptime"
    }
};

FS.Schema.BotConnection = {
    name: "msdyn_botconnection",
    properties: {
        name: "msdyn_name"
    }
};

FS.Schema.Connection = {
    name: "connection",
    properties: {
        name: "msdyn_name",
        record1id: "record1id",
        record2id: "record2id",
        record2roleid: "record2roleid"
    }
};

FS.Schema.ConnectionRole = {
    name: "connectionrole",
    properties: {
        connectionroleid: "connectionroleid"
    }
};

FS.Schema.CustomerAsset = {
    name: "msdyn_customerasset",
    properties: {
        msdyn_customerAssetId: "msdyn_customerassetid",
        msdyn_deviceid: "msdyn_deviceid",
        msdyn_name: "msdyn_name"
    }
};

FS.Schema.Guide = {
    name: "msmrw_guide",
    properties: {
        msmrw_name: "msmrw_name"
    }
};

FS.Schema.IncidentType = {
    name: "msdyn_incidenttype",
    properties: {
        msdyn_defaultWorkOrderType: "msdyn_defaultworkordertype",
        msdyn_description: "msdyn_description",
        msdyn_estimatedDuration: "msdyn_estimatedduration",
        msdyn_name: "msdyn_name"
    }
};

FS.Schema.IoTAlert = {
    name: "msdyn_iotalert",
    properties: {
        msdyn_alertdata: "msdyn_alertdata",
        msdyn_device: "msdyn_device",
        msdyn_deviceId: "msdyn_deviceid",
        msdyn_iotalertId: "msdyn_iotalertid"
    }
};

FS.Schema.IoTDevice = {
    name: "msdyn_iotdevice",
    properties: {
        createdon: "createdon",
        msdyn_category: "msdyn_category",
        msdyn_deviceId: "msdyn_deviceid",
        msdyn_devicereportedproperties: "msdyn_devicereportedproperties",
        msdyn_devicesettings: "msdyn_devicesettings",
        msdyn_iotDeviceId: "msdyn_iotdeviceid",
        msdyn_name: "msdyn_name",
        msdyn_registrationStatus: "msdyn_registrationstatus",
        msdyn_tags: "msdyn_tags"
    }
};

FS.Schema.IoTDeviceCategoryCommands = {
    name: "msdyn_iotdevicecategorycommands",
    properties: {
        msdyn_iotdevicecategoryid: "msdyn_iotdevicecategoryid",
        msdyn_iotdevicecommanddefinitionid: "msdyn_iotdevicecommanddefinitionid",
    }
};

FS.Schema.IoTDeviceCommand = {
    name: "msdyn_iotdevicecommand",
    properties: {
        msdyn_command: "msdyn_command",
        msdyn_customerasset: "msdyn_customerasset",
        msdyn_device: "msdyn_device",
        msdyn_deviceId: "msdyn_deviceid",
        msdyn_message: "msdyn_message",
        msdyn_name: "msdyn_name",
        msdyn_parentAlert: "msdyn_parentalert",
        msdyn_sendtoallconnecteddevices: "msdyn_sendtoallconnecteddevices"
    }
};

FS.Schema.IoTDeviceCommandDefinition = {
    name: "msdyn_iotdevicecommanddefinition",
    properties: {
        createdon: "createdon",
        msdyn_iotdevicecommanddefinitionid: "msdyn_iotdevicecommanddefinitionid",
        msdyn_name: "msdyn_name"
    }
};

FS.Schema.Product = {
    name: "product",
    properties: {
        currentCost: "currentcost",
        defaultUoMId: "defaultuomid",
        description: "description",
        msdyn_fieldServiceProductType: "msdyn_fieldserviceproducttype",
        msdyn_taxable: "msdyn_taxable",
        name: "name",
        productId: "productid",
        standardCost: "standardcost"
    }
};

FS.Schema.ProductPriceLevel = {
    name: "productpricelevel",
    properties: {
        amount: "amount",
        createdOn: "createdon",
        discountTypeId: "discounttypeid",
        modifiedOn: "modifiedon",
        percentage: "percentage",
        priceLevelId: "pricelevelid",
        pricingMethodCode: "pricingmethodcode",
        productId: "productid",
        productPriceLevelId: "productpricelevelid",
        quantitySellingCode: "quantitysellingcode",
        roundingOptionAmount: "roundingoptionamount",
        roundingOptionCode: "roundingoptioncode",
        roundingPolicyCode: "roundingpolicycode",
        transactionCurrencyId: "transactioncurrencyid",
        uoMId: "uomid"
    }
};

FS.Schema.ServiceEndpoint = {
    name: "serviceendpoint",
    properties: {
        path: "path"
    }
};

FS.Schema.ServiceTaskType = {
    name: "msdyn_servicetasktype",
    properties: {
        createdOn: "createdon",
        modifiedOn: "modifiedon",
        msdyn_description: "msdyn_description",
        msdyn_estimatedDuration: "msdyn_estimatedduration",
        msdyn_name: "msdyn_name",
        msdyn_serviceTaskTypeId: "msdyn_servicetasktypeid"
    }
};

FS.Schema.ThreeDimensionalModel = {
    name: "msdyn_3dmodel",
    properties: {
        msdyn_fileType: "msdyn_filetype",
        msdyn_fileURL: "msdyn_fileurl",
        msdyn_name: "msdyn_name",
        msdyn_storageType: "msdyn_storagetype"
    }
};

FS.Schema.TimeOffRequest = {
    name: "msdyn_timeoffrequest",
    properties: {
        createdOn: "createdon",
        modifiedOn: "modifiedon",
        msdyn_approvedBy: "msdyn_approvedby",
        msdyn_duration: "msdyn_duration",
        msdyn_endTime: "msdyn_endtime",
        msdyn_name: "msdyn_name",
        msdyn_resource: "msdyn_resource",
        msdyn_startTime: "msdyn_starttime",
        msdyn_timeOffRequestId: "msdyn_timeoffrequestid",
        msdyn_warehouse: "msdyn_warehouse",
        ownerId: "ownerid"
    }
};

FS.Schema.User = {
    name: "systemuser",
    properties: {
        azureActiveDirectoryObjectId: "azureactivedirectoryobjectid",
        fullName: "fullname",
        mainPhone: "address1_telephone1",
        mobilePhone: "mobilephone",
        primaryEmail: "internalemailaddress"
    }
};

FS.Schema.WorkOrder = {
    name: "msdyn_workorder",
    properties: {
        createdBy: "createdby",
        createdOn: "createdon",
        exchangeRate: "exchangerate",
        modifiedOn: "modifiedon",
        msdyn_address1: "msdyn_address1",
        msdyn_address2: "msdyn_address2",
        msdyn_address3: "msdyn_address3",
        msdyn_addressName: "msdyn_addressname",
        msdyn_billingAccount: "msdyn_billingaccount",
        msdyn_bookingSummary: "msdyn_bookingsummary",
        msdyn_city: "msdyn_city",
        msdyn_country: "msdyn_country",
        msdyn_closedBy: "msdyn_closedby",
        msdyn_customerAsset: "msdyn_customerasset",
        msdyn_estimateSubtotalAmount: "msdyn_estimatesubtotalamount",
        msdyn_instructions: "msdyn_instructions",
        msdyn_iotalert: "msdyn_iotalert",
        msdyn_isMobile: "msdyn_ismobile",
        msdyn_latitude: "msdyn_latitude",
        msdyn_longitude: "msdyn_longitude",
        msdyn_name: "msdyn_name",
        msdyn_parentWorkOrder: "msdyn_parentworkorder",
        msdyn_postalCode: "msdyn_postalcode",
        msdyn_priceList: "msdyn_pricelist",
        msdyn_primaryIncidentDescription: "msdyn_primaryincidentdescription",
        msdyn_primaryIncidentEstimatedDuration: "msdyn_primaryincidentestimatedduration",
        msdyn_primaryIncidentType: "msdyn_primaryincidenttype",
        msdyn_priority: "msdyn_priority",
        msdyn_reportedByContact: "msdyn_reportedbycontact",
        msdyn_serviceAccount: "msdyn_serviceaccount",
        msdyn_serviceRequest: "msdyn_servicerequest",
        msdyn_serviceTerritory: "msdyn_serviceterritory",
        msdyn_stateOrProvince: "msdyn_stateorprovince",
        msdyn_subStatus: "msdyn_substatus",
        msdyn_subtotalAmount: "msdyn_subtotalamount",
        msdyn_supportContact: "msdyn_supportcontact",
        msdyn_systemStatus: "msdyn_systemstatus",
        msdyn_taxable: "msdyn_taxable",
        msdyn_taxCode: "msdyn_taxcode",
        msdyn_timeClosed: "msdyn_timeclosed",
        msdyn_timeFromPromised: "msdyn_timefrompromised",
        msdyn_timeToPromised: "msdyn_timetopromised",
        msdyn_totalAmount: "msdyn_totalamount",
        msdyn_totalAmount_Base: "msdyn_totalamount_base",
        msdyn_totalSalesTax: "msdyn_totalsalestax",
        msdyn_totalSalesTax_Base: "msdyn_totalsalestax_base",
        msdyn_workOrderSummary: "msdyn_workordersummary",
        msdyn_workOrderType: "msdyn_workordertype",
        owner: "ownerid",
        transactionCurrencyId: "transactioncurrencyid",
        woNumber: "msdyn_workorderid"
    }
};

FS.Schema.WorkOrderIncident = {
    name: "msdyn_workorderincident",
    properties: {
        createdOn: "createdon",
        modifiedOn: "modifiedon",
        msdyn_customerAsset: "msdyn_customerasset",
        msdyn_description: "msdyn_description",
        msdyn_estimatedDuration: "msdyn_estimatedduration",
        msdyn_incidentType: "msdyn_incidenttype",
        msdyn_isMobile: "msdyn_ismobile",
        msdyn_isPrimary: "msdyn_isprimary",
        msdyn_name: "msdyn_name",
        msdyn_workOrder: "msdyn_workorder",
        msdyn_workOrderIncidentId: "msdyn_workorderincidentid",
        ownerId: "ownerid",
        owningUser: "owninguser",
        statusCode: "statuscode"
    }
};

FS.Schema.WorkOrderProduct = {
    name: "msdyn_workorderproduct",
    properties: {
        exchangeRate: "exchangerate",
        msdyn_additionalCost: "msdyn_additionalcost",
        msdyn_allocated: "msdyn_allocated",
        msdyn_booking: "msdyn_booking",
        msdyn_commissionCosts: "msdyn_commissioncosts",
        msdyn_customerAsset: "msdyn_customerasset",
        msdyn_description: "msdyn_description",
        msdyn_discountAmount: "msdyn_discountamount",
        msdyn_discountPercent: "msdyn_discountpercent",
        msdyn_estimateDiscountAmount: "msdyn_estimatediscountamount",
        msdyn_estimateDiscountPercent: "msdyn_estimatediscountpercent",
        msdyn_estimateQuantity: "msdyn_estimatequantity",
        msdyn_estimateSubtotal: "msdyn_estimatesubtotal",
        msdyn_estimateTotalAmount: "msdyn_estimatetotalamount",
        msdyn_estimateTotalCost: "msdyn_estimatetotalcost",
        msdyn_estimateUnitAmount: "msdyn_estimateunitamount",
        msdyn_estimateUnitCost: "msdyn_estimateunitcost",
        msdyn_internalDescription: "msdyn_internaldescription",
        msdyn_lineStatus: "msdyn_linestatus",
        msdyn_name: "msdyn_name",
        msdyn_priceList: "msdyn_pricelist",
        msdyn_product: "msdyn_product",
        msdyn_purchaseOrderReceiptProduct: "msdyn_purchaseorderreceiptproduct",
        msdyn_qtyToBill: "msdyn_qtytobill",
        msdyn_quantity: "msdyn_quantity",
        msdyn_subtotal: "msdyn_subtotal",
        msdyn_taxable: "msdyn_taxable",
        msdyn_totalAmount: "msdyn_totalamount",
        msdyn_totalCost: "msdyn_totalcost",
        msdyn_unit: "msdyn_unit",
        msdyn_unitAmount: "msdyn_unitamount",
        msdyn_unitCost: "msdyn_unitcost",
        msdyn_warehouse: "msdyn_warehouse",
        msdyn_workOrder: "msdyn_workorder",
        msdyn_workOrderIncident: "msdyn_workorderincident",
        msdyn_workOrderProductId: "msdyn_workorderproductid",
        ownerId: "ownerid",
        statusCode: "statuscode",
        transactionCurrencyId: "transactioncurrencyid"
    }
};

FS.Schema.WorkOrderService = {
    name: "msdyn_workorderservice",
    properties: {
        exchangeRate: "exchangerate",
        msdyn_additionalCost: "msdyn_additionalcost",
        msdyn_booking: "msdyn_booking",
        msdyn_calculatedUnitAmount: "msdyn_calculatedunitamount",
        msdyn_commissionCosts: "msdyn_commissioncosts",
        msdyn_customerAsset: "msdyn_customerasset",
        msdyn_description: "msdyn_description",
        msdyn_discountAmount: "msdyn_discountamount",
        msdyn_discountPercent: "msdyn_discountpercent",
        msdyn_duration: "msdyn_duration",
        msdyn_durationToBill: "msdyn_durationtobill",
        msdyn_estimateCalculatedUnitAmount: "msdyn_estimatecalculatedunitamount",
        msdyn_estimateDiscountAmount: "msdyn_estimatediscountamount",
        msdyn_estimateDiscountPercent: "msdyn_estimatediscountpercent",
        msdyn_estimateDuration: "msdyn_estimateduration",
        msdyn_estimateSubtotal: "msdyn_estimatesubtotal",
        msdyn_estimateTotalAmount: "msdyn_estimatetotalamount",
        msdyn_estimateTotalCost: "msdyn_estimatetotalcost",
        msdyn_estimateUnitAmount: "msdyn_estimateunitamount",
        msdyn_estimateUnitCost: "msdyn_estimateunitcost",
        msdyn_internalDescription: "msdyn_internaldescription",
        msdyn_lineOrder: "msdyn_lineorder",
        msdyn_lineStatus: "msdyn_linestatus",
        msdyn_minimumChargeAmount: "msdyn_minimumchargeamount",
        msdyn_minimumChargeDuration: "msdyn_minimumchargeduration",
        msdyn_name: "msdyn_name",
        msdyn_priceList: "msdyn_pricelist",
        msdyn_service: "msdyn_service",
        msdyn_subtotal: "msdyn_subtotal",
        msdyn_taxable: "msdyn_taxable",
        msdyn_totalAmount: "msdyn_totalamount",
        msdyn_totalCost: "msdyn_totalcost",
        msdyn_unit: "msdyn_unit",
        msdyn_unitAmount: "msdyn_unitamount",
        msdyn_unitCost: "msdyn_unitcost",
        msdyn_workOrder: "msdyn_workorder",
        msdyn_workOrderIncident: "msdyn_workorderincident",
        msdyn_workOrderServiceId: "msdyn_workorderserviceid",
        statusCode: "statuscode",
        transactionCurrencyId: "transactioncurrencyid"
    }
};

FS.Schema.WorkOrderServiceTask = {
    name: "msdyn_workorderservicetask",
    properties: {
        msdyn_customerAsset: "msdyn_customerasset",
        msdyn_guideid: "msdyn_guideid",
        msdyn_percentComplete: "msdyn_percentcomplete",
        msdyn_workOrder: "msdyn_workorder",
        msdyn_taskType: "msdyn_tasktype",
        msdyn_workOrderIncident: "msdyn_workorderincident",
        msdyn_estimatedDuration: "msdyn_estimatedduration",
        msdyn_description: "msdyn_description"
    }
};

FS.Schema.WorkOrderSubStatus = {
    name: "msdyn_workordersubstatus",
    properties: {
        msdyn_systemStatus: "msdyn_systemstatus",
        msdyn_defaultSubStatus: "msdyn_defaultsubstatus"
    }
};

FS.Schema.WorkOrderType = {
    name: "msdyn_workordertype",
    properties: {
        msdyn_priceList: "msdyn_pricelist",
        msdyn_taxable: "msdyn_taxable"
    }
};
