/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */

const modules = [
   'N/record',
   'N/log',
   'N/search',
   'N/runtime',
   'N/url',
   'N/https'
];

define(modules, function (record, log, search, runtime, url, https) {


   function afterSubmit(context) {


      var customerRecord = context.newRecord;
      log.debug("contexttype", context.type);
      log.debug("contexttype", customerRecord.type);

      if (context.type == 'create') {


         if (customerRecord.type == "purchaseorder") {
            try {
               var filterType = "PurchOrd"
               var getPOData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id)
               log.debug("checkpo", getPOData)
               var newObjForMongo = generateNewObject(getPOData)
   
               var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://b795-2400-adc1-18f-5d00-ddb2-d56b-53ee-7e2f.ngrok.io/createPurchaseRequest')
   
               mongooseResponse = JSON.parse(mongooseResponse)
   
               if (mongooseResponse.success) {
                  mongoSyncSuccessUpdate('purchaseorder', customerRecord.id, mongooseResponse)
               }
   
               else {
                  mongoSyncFailUpdate(type, id, mongooseResponse)
               }
   
               log.debug("newObjForMongo", mongooseResponse)
            }
            catch(ex){
               log.error("POST DATA TO VP >>>> PURCHASE ORDER", ex)
            }
           
         }

         if (customerRecord.type == "itemreceipt") {
            var filterType = "ItemRcpt"
            var getPOData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id)
            log.debug("checkpo", getPOData)
            var newObjForMongo = generateNewObject(getPOData)
            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://b795-2400-adc1-18f-5d00-ddb2-d56b-53ee-7e2f.ngrok.io/createItemFulfillments')

            if (mongooseResponse.success) {
               log.debug("check mongoreturn on sucess", mongooseResponse)
               mongoSyncSuccessUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            else {
               log.debug("check mongoreturn", mongooseResponse)
               mongoSyncFailUpdate(customerRecord.type, customerRecord.id, mongooseResponse)
            }

            log.debug("newObjForMongo", newObjForMongo)
         }

         if (customerRecord.type == "getvendorBillSavedSearch") {
            var filterType = "ItemRcpt"
            var getPOData = getvendorBillSavedSearch(customerRecord.id)
            log.debug("checkpo", getPOData)
            var newObjForMongo = generateNewObject_forgetvendorBillSavedSearch(getPOData)

            log.debug("newObjForMongo", newObjForMongo)
         }

         if (customerRecord.type == "vendorpayment") {
            var filterType = "ItemRcpt"
            var getPOData = getPaymentSavedSearch(customerRecord.id)
            log.debug("checkpo", getPOData)
            //var newObjForMongo = generateNewObject_forgetvendorBillSavedSearch(getPOData)

            log.debug("newObjForMongo", newObjForMongo)
         }



      }

      if (context.type == 'edit') {


         if (customerRecord.type == "purchaseorder") {
            var filterType = "PurchOrd"
            var getPOData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id)
            log.debug("checkpo", getPOData)
            var newObjForMongo = generateNewObject(getPOData)

            log.debug("newObjForMongo", newObjForMongo)


            var mongooseResponse = sendDataToMongoose(newObjForMongo, 'https://b795-2400-adc1-18f-5d00-ddb2-d56b-53ee-7e2f.ngrok.io/updatePurchaseRequest')

            mongooseResponse = JSON.parse(mongooseResponse)

            var Record = record.load({
               type: 'purchaseorder',
               id: customerRecord.id,
            });

            if (mongooseResponse.success) {
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: true })
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '1' })
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', value: new Date(mongooseResponse.currentDateTime) })
               Record.save();
            }

            else {
               Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: false })
               Record.setValue({ fieldId: 'custbody_nodejsvendorportal_syncerror', value: mongooseResponse.error })
               Record.save();

            }



            log.debug("newObjForMongo", mongooseResponse.success)
            return

         }

         if (customerRecord.type == "itemreceipt") {
            var filterType = "ItemRcpt"
            var getPOData = getSavedSearchData(customerRecord.type, filterType, customerRecord.id)
            log.debug("checkpo", getPOData)
            var newObjForMongo = generateNewObject(getPOData)

            log.debug("newObjForMongo", newObjForMongo)
         }

         if (customerRecord.type == "getvendorBillSavedSearch") {
            var filterType = "ItemRcpt"
            var getPOData = getvendorBillSavedSearch(customerRecord.id)
            log.debug("checkpo", getPOData)
            var newObjForMongo = generateNewObject_forgetvendorBillSavedSearch(getPOData)

            log.debug("newObjForMongo", newObjForMongo)
         }



      }

      var customerRecord = context.newRecord;
      // if (customerRecord.getValue('salesrep')) {
      //     var call = record.create({
      //         type: record.Type.PHONE_CALL,
      //         isDynamic: true
      //     });
      //     call.setValue('title', 'Make follow-up call to new customer');
      //     call.setValue('assigned', customerRecord.getValue('salesrep'));
      //     call.setValue('phone', customerRecord.getValue('phone'));
      //     try {
      //         var callId = call.save();
      //         log.debug('Call record created successfully', 'Id: ' + callId);
      //     } catch (e) {
      //         log.error(e.name);
      //     }
      // }

      function getSavedSearchData(type, filtertype, internalid) {
         var purchaseorderSearchObj = search.create({
            type: type,
            filters:
               [
                  ["type", "anyof", filtertype],
                  "AND",
                  ["mainline", "is", "F"],
                  "AND",
                  ["internalid", "anyof", internalid],

               ],
            columns:
               [
                  search.createColumn({
                     name: "tranid",
                     summary: "GROUP",
                     label: "Document Number"
                  }),
                  search.createColumn({
                     name: "trandate",
                     summary: "GROUP",
                     label: "Date"
                  }),
                  search.createColumn({
                     name: "quantity",
                     summary: "SUM",
                     label: "Quantity"
                  }),
                  search.createColumn({
                     name: "statusref",
                     summary: "GROUP",
                     label: "Status"
                  }),
                  search.createColumn({
                     name: "amount",
                     summary: "SUM",
                     label: "Amount"
                  })
                  ,
                  search.createColumn({
                     name: "location",
                     summary: "GROUP",
                     label: "Location"
                  }),
                  search.createColumn({
                     name: "internalid",
                     summary: "GROUP",
                     label: "Internal ID"
                  }),
                  search.createColumn({ name: 'internalid', join: 'vendor', summary: "GROUP" }),
                  search.createColumn({ name: 'entityid', join: 'vendor', summary: "GROUP" }),
                  search.createColumn({ name: 'custbody_pointstarvendor_accept', summary: "GROUP" }),
               ]
         });
         var isData = purchaseorderSearchObj.run();
         var isFinalResult = isData.getRange(0, 999);
         var DataResult = JSON.parse(JSON.stringify(isFinalResult))

         return DataResult

      }

      function generateNewObject(getPOData) {
         var newObj = []
         var vendorAccept = ""

         if (getPOData[0].values["GROUP(custbody_pointstarvendor_accept)"]) {
            vendorAccept = "Yes"
         }
         else {
            vendorAccept = "NO"
         }

         newObj.push({
            internalId: parseInt(getPOData[0].values["GROUP(internalid)"][0].value),
            poNumber: getPOData[0].values["GROUP(tranid)"],
            date: new Date(getPOData[0].values["GROUP(trandate)"]),
            quantity: parseInt(getPOData[0].values["SUM(quantity)"]),
            status: getPOData[0].values["GROUP(statusref)"][0].text,
            amount: getPOData[0].values["SUM(amount)"],
            location: getPOData[0].values["GROUP(location)"][0].text,
            vendorInternalId: getPOData[0].values["GROUP(vendor.internalid)"][0].value,
            vendorName: getPOData[0].values["GROUP(vendor.entityid)"],
            vendorAccept: vendorAccept




         })

         return newObj
      }

      function getvendorBillSavedSearch(internalId) {
         var purchaseorderSearchObj = search.create({
            type: "purchaseorder",
            filters:
               [
                  ["type", "anyof", "PurchOrd"],
                  "AND",
                  ["mainline", "is", "F"],
                  "AND",
                  ["applyingtransaction.internalid", "anyof", internalId],
                  "AND",
                  ["applyingtransaction.type", "anyof", "VendBill"]
               ],
            columns:
               [
                  search.createColumn({
                     name: "tranid",
                     summary: "GROUP",
                     label: "Document Number"
                  }),
                  search.createColumn({
                     name: "trandate",
                     summary: "GROUP",
                     label: "Date"
                  }),
                  search.createColumn({
                     name: "quantity",
                     summary: "SUM",
                     label: "Quantity"
                  }),
                  search.createColumn({
                     name: "amount",
                     summary: "SUM",
                     label: "Amount"
                  }),
                  search.createColumn({
                     name: "quantitybilled",
                     summary: "SUM",
                     label: "Quantity Billed"
                  }),
                  search.createColumn({
                     name: "formulanumeric",
                     summary: "SUM",
                     formula: "SUM({quantitybilled}*{rate})",
                     label: "Bill Amount"
                  }),
                  search.createColumn({
                     name: "statusref",
                     summary: "GROUP",
                     label: "Status"
                  }),
                  search.createColumn({
                     name: "location",
                     summary: "GROUP",
                     label: "Location"
                  }),
                  search.createColumn({
                     name: "internalid",
                     summary: "GROUP",
                     label: "internalid"
                  }),
                  search.createColumn({
                     name: "applyingtransaction",
                     summary: "GROUP",
                     label: "Applying Transaction"
                  }),
               ]
         });
         var isData = purchaseorderSearchObj.run();
         var isFinalResult = isData.getRange(0, 1000);
         isFinalResult = JSON.parse(JSON.stringify(isFinalResult));

         return isFinalResult
      }

      function generateNewObject_forgetvendorBillSavedSearch(getPOData) {
         var newObj = []

         newObj.push({
            internalId: getPOData[0].values["GROUP(applyingtransaction)"][0].value,
            poNumber: getPOData[0].values["GROUP(tranid)"],
            date: getPOData[0].values["GROUP(trandate)"],
            quantity: getPOData[0].values["SUM(quantity)"],
            status: getPOData[0].values["GROUP(statusref)"][0].text,
            amount: getPOData[0].values["SUM(amount)"][0].text,
            location: getPOData[0].values["GROUP(location)"][0].text,
            billNo: getPOData[0].values["GROUP(applyingtransaction)"][0].text,
            billQunatity: getPOData[0].values["SUM(quantitybilled)"],

         })

         return newObj
      }

      function getPaymentSavedSearch(internalId) {
         var transactionSearchObj = search.create({
            type: "transaction",
            filters:
               [
                  ["type", "anyof", "VendBill", "VendPymt"],
                  "AND",
                  ["internalid", "anyof", internalId],
                  "AND",
                  ["applyingtransaction.internalid", "noneof", "@NONE@"]
               ],
            columns:
               [
                  search.createColumn({ name: "trandate", label: "Bill Date" }),
                  search.createColumn({ name: "internalid", label: "Bill internalid" }),
                  search.createColumn({ name: "tranid", label: "Invoice Number" }),
                  search.createColumn({ name: "entity", label: "Name" }),
                  search.createColumn({ name: "amount", label: "Bill Amount" }),
                  search.createColumn({
                     name: "trandate",
                     join: "applyingTransaction",
                     label: "Payment Date"
                  }),
                  search.createColumn({
                     name: "internalid",
                     join: "applyingTransaction",
                     label: "Bill payment internalid"
                  }),
                  search.createColumn({
                     name: "tranid",
                     join: "applyingTransaction",
                     label: "Invoice Payment Number"
                  }),
                  search.createColumn({ name: "applyinglinkamount", label: "Payment Amount" }),
                  search.createColumn({
                     name: "formulacurrency",
                     formula: "{amount}-{applyinglinkamount}",
                     label: "Bill Payment Amount"
                  }),
                  search.createColumn({ name: "statusref", label: "Status" })
               ]
         });

         var isData = transactionSearchObj.run();
         var isFinalResult = isData.getRange(0, 1000);
         var gridDataResult = JSON.parse(JSON.stringify(isFinalResult));

      }

      function generateNewObject_forgetvendorPaymentSavedSearch(getPOData) {
         var newObj = []

         newObj.push({
            internalid: getPOData[0].values["applyingtransaction"][0].value,
            poNumber: getPOData[0].values["tranid"],
            date: getPOData[0].values["randate"],
            quantity: getPOData[0].values["SUM(quantity)"],
            status: getPOData[0].values["GROUP(statusref)"][0].text,
            amount: getPOData[0].values["SUM(amount)"][0].text,
            location: getPOData[0].values["GROUP(location)"][0].text,
            billNo: getPOData[0].values["GROUP(applyingtransaction)"][0].text,
            billQunatity: getPOData[0].values["SUM(quantitybilled)"],

         })

         return newObj
      }

      function sendDataToMongoose(allData, link) {

         var neObj = { "netsuiteData": allData }
         var headers1 = [];
         headers1['Content-Type'] = 'application/json';
         log.debug("check data", JSON.stringify(allData))
         var postRequest = https.post({
            url: link,
            body: JSON.stringify(neObj),
            headers: headers1
         })

         log.debug('title', postRequest.body);
         return postRequest.body
      }

      function mongoSyncSuccessUpdate(type, id, mongooseResponse) {
         var Record = record.load({
            type: type,
            id: id,
         });


         Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: true })
         if (mongooseResponse.type == "Update") {
            Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '1' })
         }
         else {
            Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_upd', value: '0' })
         }

         Record.setText({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', text: new Date(mongooseResponse.currentDateTime) })
         Record.setValue({ fieldId: 'custbody_nodejs_vendorportalfield_obj', value: mongooseResponse.mongoObjId })

         Record.save();

      }

      function mongoSyncFailUpdate(type, id, mongooseResponse) {
         var mongooseResponse = JSON.parse(mongooseResponse)
         log.debug("mongoose response", mongooseResponse.type + " mongooseResponse.date " + mongooseResponse.currentDateTime + " mongooseResponse.error " + mongooseResponse["error"] + " mongooseResponse.error json " + JSON.stringify(mongooseResponse["error"]))
         var Record = record.load({
            type: type,
            id: id,
         });

         var values = {}

         values["custbody_nodejsvendorportal_syncerror"] = mongooseResponse.error.message
         values["custbody_nodejs_vendorportal_issync"] = false
         values["custbody_nodejs_vendorportal_syncdatet"] = mongooseResponse.currentDateTime
         log.debug("values", values)
         var sf = record.submitFields({
            type: "itemreceipt",
            id: id,
            values: values,
            options: {
               ignoreMandatoryFields: true
            }
         });
          log.debug("sf", sf)
         // Record.setValue({ fieldId: 'custbody_nodejs_vendorportal_issync', value: false })
         // Record.setValue({ fieldId: 'custbody_nodejsvendorportal_syncerror', value: JSON.stringify(mongooseResponse.error) })
         // Record.setText({ fieldId: 'custbody_nodejs_vendorportal_syncdatet', text: mongooseResponse.date })

         // Record.save();

      }

   }

   return {
      afterSubmit: afterSubmit
   };

});