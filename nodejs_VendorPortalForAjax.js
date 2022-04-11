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
  
  ], function (render, file, search, redirect, url, https,format,record,email) {
  
  
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
            context.response.write(getPurchaseOrder())
            return 
          }
          if(context.request.parameters.type=="itemRecipt")
          {
            log.debug("check",getItemRecipt())

            context.response.write(getItemRecipt())
            return 
          }
         
            
           // var username=context.request.parameters.username
           //  username=username.split(',')
           // log.debug("check username",username[0])

           
           // handleGetRequest(context, model.getHeaderInfo(context.request.parameters.poid), model.getTableData(context.request.parameters.poid), context.request.parameters.poid,username)
        }
        if (context.request.method === "POST")  
        {
          log.debug("POST voidTicket", context.request);
          context.response.write(getPurchaseOrder())
          return;
        }
       
    }

    function getPurchaseOrder()
  {

    var purchaseorderSearchObj = search.create({
      type: "purchaseorder",
      filters:
      [
         ["type","anyof","PurchOrd"], 
         "AND", 
         ["mainline","is","F"], 
         "AND", 
         ["name","anyof","944"], 
         "AND", 
         ["quantity","isnotempty",""], 
         "AND", 
         ["internalid","anyof","26357"]
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
  function getItemRecipt()
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
			   ["internalid","anyof",34073]
			],
			columns:
			[
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
			   })
			]
		 });
		 var isData = itemreceiptSearchObj.run();
         var isFinalResult = isData.getRange(0, 1000);
         var gridDataResult = JSON.stringify(isFinalResult);
  }
    return {
        onRequest: onRequest
    }
  
  });
  