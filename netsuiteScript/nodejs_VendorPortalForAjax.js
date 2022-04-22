/**
* @NApiVersion 2.1
* @NScriptType Suitelet
*/

define([
   'N/render',
   'N/file',
   'N/search',
   'N/redirect',
   'N/url',
   'N/https',
   'N/format',
   'N/record',
   'N/email',
   'SuiteScripts/Vendor Test Theme/moment.js'
 
 ], function (render, file, search, redirect, url, https,format,record,email,moment) {
 
 
   function htmlCont(link,dataSource)
   {
       var pageRenderer = render.create(); //pageRenderer will combine datasource and template
       var templateFile = file.load({
           id: link
       });
       pageRenderer.templateContent = templateFile.getContents(); // template is set
       pageRenderer.addCustomDataSource({ //datasource is set now the template is going to recognize the ds object
           format: render.DataSource.OBJECT,
           alias: 'ds',
           data: dataSource
       });
       var renderedPage = pageRenderer.renderAsString();
 
       return renderedPage
   }
 
   function onRequest(context) {
       // var request = context.request;
       // var response = context.response;
       if (context.request.method === "GET") {

         log.debug("GET voidTicket", context.request.parameters);

         if(context.request.parameters.type=="purchaseRequest")
         {
            var id = context.request.parameters.internalid
            log.debug("chec",getPurchaseOrder(id))
            context.response.write(getPurchaseOrder(id))
            return 
         }
         if(context.request.parameters.type=="itemRecipt")
         {
            var id = context.request.parameters.internalid 
           log.debug("check",getItemRecipt(id))

           context.response.write(getItemRecipt(id))
           return 
         }

         
         if(context.request.parameters.type=="dashboard")
         {
           log.debug("getSalesByWeekForGraph()",getSalesByWeekForGraph())
           log.debug("getItemOrderStatisticsForGraph()",getItemOrderStatisticsForGraph())

           var graphsData = [];

           graphsData.push({
              salesByWeekData : JSON.stringify(getSalesByWeekForGraph()),
              itemStatisticsData : JSON.stringify(getItemOrderStatisticsForGraph())
           })

           log.debug("graphsData",JSON.stringify(graphsData))

           context.response.write(JSON.stringify(graphsData))
           return  
         }

         if(context.request.parameters.type=="invoice")
         {
            var id = context.request.parameters.internalid
           log.debug("check",getInvoice(id))

           context.response.write(getInvoice(id))
           return 
         }



        
           
          // var username=context.request.parameters.username
          //  username=username.split(',')
          // log.debug("check username",username[0])

          
          // handleGetRequest(context, model.getHeaderInfo(context.request.parameters.poid), model.getTableData(context.request.parameters.poid), context.request.parameters.poid,username)
       }
       if (context.request.method === "POST")  
       {
        log.debug("POST voidTicket parameters","POSt");
         log.debug("POST voidTicket parameters", context.request.parameters);
         log.debug("POST voidTicket body", context.request.body);
         var parseBody= JSON.parse( context.request.body)
         var internalId = parseBody.pointernalid
         var date       =  parseBody.changeallitemdate
         var lineCount=parseBody.linenumbertop
         var selectedLine=[]
         log.debug("selectlinein loop", parseBody.save)
         if(parseBody.save=="linedate")
         {
            log.debug("selectlinein loop", "sss")
            for(var i=0; i<lineCount; i++)
            {
                 var lin=parseBody["linenumber"+i]
                 log.debug("selectlinein loop", lin)
                 selectedLine.push(parseInt(lin-1))
            }
            if(parseBody.changeallitemdate)
            {
               formattedDateString = format.format({ value: date,type: format.Type.DATE});
     
            }

            updateSelectRow(internalId,formattedDateString,selectedLine,parseBody.linenumbertop,parseBody)
         }

         if(parseBody.type=="login")
         {     
            var getInternalID=getVendorDataSavedSEarch(parseBody.username,parseBody.password)[0].id
            log.debug("typelogin",getInternalID)
            
            
            context.response.write(getInternalID)
         }

         if(context.request.parameters.type == "createBill")
         {     
            log.debug("createinvoicet",context.request.parameters)
            var fileListId='';
			
			 log.debug("files",context.request.files)
			 if(Object.keys(context.request.files).length>0)  
			 {
               for(var files=0; files<=context.request.parameters.totalfiles; files++)
            {
               var fileObj = context.request.files["custpage_file"+files];
               
               fileObj.folder = 1045;
               var fileId = fileObj.save();
               fileListId+=fileId+','
            }

            fileListId = fileListId.substring(0, fileListId.length - 1);
               
            log.debug("checkfilesid",fileListId)

            }

            var setitem=[]
			var Record = record.load({
				type: 'itemreceipt',
				id: context.request.parameters.irid,
			 isDynamic: true
			 });

			 var tranid= Record.getValue({fieldId:"createdfrom"})
			 var name= Record.getText({fieldId:"entity"})
			 var date= Record.getValue({fieldId:"trandate"})
			 var lines = Record.getLineCount({ sublistId: "item"});
			 var itemData = []
		
			
			 for (var i = 0; i < lines; i++) {
  
				itemData.push({
  
					 'item': Record.getSublistValue({
						 "sublistId": 'item',
						 "fieldId": 'item',
						 "line": i
					 }),
					 'qty': Record.getSublistText({
						 "sublistId": 'item',
						 "fieldId": 'quantity',
						 "line": i
					 }),
				 })
			 }

			 log.debug("checkfilesid",fileListId)

          var transformRecordPromise = record.transform.promise({
			   fromType: "purchaseorder",
			   fromId: tranid,
			   toType: "vendorbill",
			   isDynamic: true,
			   });

          transformRecordPromise.then(function(recordObject) {
            recordObject.setValue({fieldId:'memo',value:'created by vendor'})
           
            for(var i=0;i<itemData.length;i++)
            { 
               var lines = recordObject.getLineCount({ sublistId: 'item' });
               //log.debug("lines in top",lines)
               for(var j=0; j<lines;j++)
               {

                  recordObject.selectLine({ sublistId:'item' ,line:j });
                  vendorBillitem=recordObject.getCurrentSublistValue({ sublistId:'item' ,fieldId:'item'})
                
               //	log.debug("before match",vendorBillitem+'j'+j)
                  if(itemData[i].item==vendorBillitem)
                  {
                     //  log.debug("on mathv",vendorBillitem+'set quanttity'+parseInt(itemData[i].qty))
                      setitem.push(vendorBillitem)
                      recordObject.setCurrentSublistValue({ sublistId:'item' ,fieldId:'quantity' ,value: parseInt(itemData[i].qty) });
                      //set billed on item receipt
                      var index = Record.findSublistLineWithValue({sublistId: "item",
                      fieldId: "item",
                      value: vendorBillitem});
                      Record.selectLine({ sublistId:'item' ,line:index });
                      Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'custcol_psvendorbilledquantity' ,value: parseInt(itemData[i].qty) });
                      //set billed item end								  Record.commitLine({sublistId: 'item'});
                      //  Record.setCurrentSublistValue({"sublistId": 'item',"fieldId": 'custcol_psvendorbilledquantity',}),
                     
                      recordObject.commitLine({sublistId: 'item'});
                  }
                  else
                  {
                     //log.debug("on else",'j'+setitem.indexOf(vendorBillitem))
                     var setitemscheck=setitem.indexOf(vendorBillitem)
                     if(setitemscheck<0)
                     {
                        recordObject.setCurrentSublistValue({ sublistId:'item' ,fieldId:'quantity' ,value: 0 });
                        recordObject.commitLine({sublistId: 'item'});
                     }
                     // log.debug("set items ceheck",setitemscheck)
                     // log.debug("set 0 no match",vendorBillitem+'j'+j)
                                            
                  }
               }
            }

            recordId =   recordObject.save({
               enableSourcing: true
            });

           

            log.debug("checkid",recordId)
            Record.save({
               enableSourcing: true
            });

            context.response.write(JSON.stringify(recordId))



            var vnbillobject = record.load({
               type: 'vendorbill',
               id:recordId,
               isDynamic: true,
            });

            var lines = vnbillobject.getLineCount({ sublistId: 'item' });
            //log.debug("itemcheck after insert",lines)

            for(var k=0;k<lines;k++)
            {
               vnbillobject.selectLine({ sublistId:'item' ,line:k });
              vendorBillitem=vnbillobject.getCurrentSublistValue({ sublistId:'item' ,fieldId:'quantity'})
               if(vendorBillitem==0)
               { 
                  vnbillobject.removeLine({sublistId: "item", line: k});
                 k--
                 lines--
               }
            }
            saveId=vnbillobject.save();


            log.debug("checkidsaveid",saveId)
           
          
            

           //   redirect.toSuitelet({
           // 	scriptId: 'customscript_ps_vendor_billeddetailview',
             // 	deploymentId: 'customdeploy_ps_vendor_billeddetailview',
            //    parameters: {
            // 		'username' : username,
            // 		'billno'   : saveId,
            // 		'fileid'   : fileListId
            // 	}
            //   });

            // 		  log.debug("billno",fileId)
            //        var id = record.attach({
            //        record: {
            //            type: 'file',
            //            id: fileId
            //        },
            //        to: {
            //            type: 'vendorbill',
            //            id: saveId
            //        }
            //    });
      
          // Add any other needed logic that shouldn't execute until
          // after the record is transformed.
      
          log.debug({
          title: 'Record saved',
          //details: 'Id of new record: ' + recordId
          });
      
         }, function(e) {
      
         log.error({
         title: e.name,
         details: e.message
         });
         });



         }





      

       //  context.response.write("jj")
        // return;
       }
      
   }

   function getPurchaseOrder(id)
 {

   var purchaseorderSearchObj = search.create({
     type: "purchaseorder",
     filters:
     [
        ["type","anyof","PurchOrd"], 
        "AND", 
        ["mainline","is","F"], 
        "AND", 
        ["quantity","isnotempty",""], 
        "AND", 
        ["internalid","anyof",id]
     ],
     columns:
     [
        search.createColumn({
           name: "item",
           summary: "GROUP",
           label: "Product"
        }),
        search.createColumn({
           name: "quantity",
           summary: "SUM",
           label: "Requested Qty"
        }),
        search.createColumn({
           name: "custcol_pointstarvendor_originalqty",
           summary: "SUM",
           label: "Accepted Qty"
        }),
        search.createColumn({
           name: "quantityshiprecv",
           summary: "SUM",
           label: "Deilverd Qty"
        }),
        search.createColumn({
           name: "quantitybilled",
           summary: "SUM",
           label: "Billed Qty"
        }),
        search.createColumn({
           name: "rate",
           summary: "MAX",
           label: "Item Rate"
        }),
        search.createColumn({
           name: "formulanumeric",
           summary: "MAX",
           formula: "SUM({rate}*{quantity})",
           label: "Amount"
        }),
        search.createColumn({
           name: "expectedreceiptdate",
           summary: "GROUP",
           label: "Delivery Date"
        }),
        search.createColumn({
           name: "formulatext",
           summary: "GROUP",
           formula: "case when {custcol_pointstarvendor_originalqty}=0 then 'NO' when {quantity}={custcol_pointstarvendor_originalqty} then 'Fully' when {quantity}>{custcol_pointstarvendor_originalqty} then 'Partially'  else 'NO' end",
           label: "Accepted"
        }),
        search.createColumn({
           name: "tranid",
           summary: "GROUP",
           label: "Document Number"
        }),
        search.createColumn({
           name: "locationnohierarchy",
           summary: "GROUP",
           label: "LOCATION (no hierarchy)"
        }),
        search.createColumn({
           name: "trandate",
           summary: "GROUP",
           label: "Date"
        })
     ]
  });
  var isData = purchaseorderSearchObj.run();
  var isFinalResult = isData.getRange(0, 999);
  var DataResult = JSON.stringify(isFinalResult);

  return DataResult

 }
 function getItemRecipt(id)
 {
   var itemreceiptSearchObj = search.create({
        type: "itemreceipt",
        filters:
        [
           ["type","anyof","ItemRcpt"], 
           "AND", 
           ["mainline","is","F"], 
           "AND", 
           ["shipping","is","F"], 
           "AND", 
           ["internalid","anyof",id]
        ],
        columns:
        [
         search.createColumn({
            name: "line",
            summary: "GROUP",
            sort: search.Sort.ASC,
            label: "Line ID"
         }),
           search.createColumn({
             name: "item",
             summary: "GROUP",
             label: "Item"
           }),
           search.createColumn({
             name: "quantity",
             summary: "SUM",
             label: "Quantity"
           }),
           search.createColumn({
           name: "custcol_psvendorbilledquantity",
           summary: "SUM",
           label: "Quantity"
         }),
           search.createColumn({
             name: "quantity",
             join: "appliedToTransaction",
             summary: "SUM",
             label: "Quantity"
           }),
           search.createColumn({
             name: "rate",
             summary: "SUM",
             label: "Item Rate"
           }),
           search.createColumn({
           name: "rate",
           join: "applyingTransaction",
           summary: "SUM",
           label: "Item Rate"
          }),
        
           search.createColumn({
             name: "locationnohierarchy",
             summary: "GROUP",
             label: "LOCATION (no hierarchy)"
           }),
        search.createColumn({
             name: "tranid",
             summary: "GROUP",
             label: "Item"
           }),
        search.createColumn({
             name: "entity",
             summary: "GROUP",
             label: "Item"
           }),
        search.createColumn({
             name: "trandate",
             summary: "GROUP",
             label: "Item"
           }),
        ]
      });
      var isData = itemreceiptSearchObj.run();
        var isFinalResult = isData.getRange(0, 1000);
        var isFinalResult = JSON.stringify(isFinalResult);
        return isFinalResult
 }
 function updateSelectRow(internalId,date,lines,totalline,data)
 {
   
     var Record = record.load({
         type: 'purchaseorder',
         id: internalId,
      isDynamic: true
      });
           log.audit("checkqty",data)
           log.audit("checkqty",lines)

          var itemlines = Record.getLineCount({ sublistId: "item"});
      
      for(var i=0; i<itemlines; i++)
      {
         log.audit("checkqtyinloop",i)
            //Record.setSublistText({ sublistId:'item',fieldId:'expectedreceiptdate' ,line:i })
           
            for(var j=0;j<lines.length;j++)
            {
             log.audit("checkqtyinloop",i+'-'+lines[j]+'-qty'+data["qty"+i])
               if(i==lines[j])
               {
                 log.audit("incondition",i+'-'+lines[j])
                Record.selectLine({ sublistId:'item' ,line:i });
                if(date)
                { 
                  // log.audit("cheekcdate",Date.parse(date))
                 //  log.audit("new Date(date)",new Date(date+1))
                  
                   
                  // var newdate = format.format({value: date,    type: format.Type.DATE});
                  // newDate=new Date(date).setDate(1);
                 //  var new_date = moment.moment(date, "M/D/YYYY").add(2, 'days');
                   //log.audit("dateChange",moment(new Date(date), "M/D/YYYY").add(2, 'days'))
                   newDate=new Date(moment(new Date(date), "M/D/YYYY").add(1, 'days'))
                  log.audit("newDate",newDate);
                   Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'expectedreceiptdate' ,value: newDate });}  

                 Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'custcol_pointstarvendor_originalqty' ,value:data["qty"+i]});
                Record.commitLine({sublistId: 'item'});
               }
            }
            Record.setValue({fieldId : 'custbody_pointstarvendor_accept', value: true})
            Record.setValue({fieldId : 'custbody_ps_vendor_isreject', value: false})
      }

    var saveid=  Record.save();
      log.debug("save",saveid)
 }

 function getVendorDataSavedSEarch(name,password)  //login
 {

   var vendorSearchObj = search.create({
      type: "vendor",
      filters:
      [
         ["email","is",name], 
         "AND", 
         ["custentity_vendor_pointstar_pwd","is",password], 
         "AND", 
         ["custentity_vendor_pointstar_access","is","T"]
      ],
      columns:
      [
         search.createColumn({name: "internalid", label: "Internal ID"}),
         search.createColumn({
            name: "entityid",
            sort: search.Sort.ASC,
            label: "Name"
         })
      ]
   });
   var isData = vendorSearchObj.run();
   var isFinalResult = isData.getRange(0, 1000);
   var isFinalDataResult = JSON.parse( JSON.stringify(isFinalResult));
   return isFinalDataResult
 }

 
    function getSalesByWeekForGraph(){
      var salesorderSearchObj = search.create({
         type: "salesorder",
         filters:
         [
            ["type","anyof","SalesOrd"], 
            "AND", 
            ["salesrep","anyof","1603"], 
            "AND", 
            ["trandate","within","lastmonth"]
            
         ],
         columns:
         [
            search.createColumn({
               name: "trandate",
               summary: "GROUP"
            }),
            search.createColumn({
               name: "total",
               summary: "SUM"
            })
         ]
      });
      
      var data = salesorderSearchObj.run();
      var finalResult = data.getRange(0, 999);
      var totalSalesByWeek = JSON.stringify(finalResult)
      log.debug("totalSalesByWeek",totalSalesByWeek)
      return totalSalesByWeek

    }

    function getItemOrderStatisticsForGraph(){

      var transactionSearchObj = search.create({
         type: "transaction",
         filters:
         [
            ["vendor.internalid","anyof","944"]
         ],
         columns:
         [
            search.createColumn({
               name: "item",
               summary: "GROUP"
            }),
            search.createColumn({
               name: "quantity",
               summary: "SUM",
               sort: search.Sort.DESC
            }),
            search.createColumn({
               name: "amount",
               summary: "SUM"
            })
         ]
      });
    
      var data = transactionSearchObj.run();
      var finalResult = data.getRange(0, 1000);
      var gridDataResult = JSON.stringify(finalResult);

      // var data = [];

      // for (var i = 0; i < gridDataResult.length; i++) {
      //    data.push({
      //       itemName : gridDataResult[i].values["GROUP(item)"],
      //       noOfOrders : gridDataResult[i].values["SUM(quantity)"],
      //       totalSales : gridDataResult[i].values["SUM(amount)"]
      //    })
      // }

      log.debug("top order statistics graph : ",gridDataResult);

      return gridDataResult

    }

    function getInvoice(id)
 {

   var vendorbillSearchObj = search.create({
      type: "vendorbill",
      filters:
      [
         ["type","anyof","VendBill"], 
         "AND", 
         ["mainline","is","F"], 
         "AND", 
         ["internalid","anyof",id]
      ],
      columns:
      [
         search.createColumn({
            name: "internalid",
            summary: "GROUP",
            label: "internalId"
         }),
         search.createColumn({
            name: "tranid",
            summary: "GROUP",
            label: "Bill Number"
         }),
         search.createColumn({
            name: "trandate",
            summary: "GROUP",
            label: "date"
         }),
         search.createColumn({
            name: "item",
            summary: "GROUP",
            label: "Item"
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
            name: "rate",
            summary: "MAX",
            label: "Item Rate"
         })
      ]
   });

   var isData = vendorbillSearchObj.run();
   var isFinalResult = isData.getRange(0, 1000);
   var isFinalResult = JSON.stringify(isFinalResult);
   return isFinalResult

 }




   return {
       onRequest: onRequest
   }
 
 });
 