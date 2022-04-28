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
         log.debug("POST voidTicket parameters", context.request.parameters);
         log.debug("POST voidTicket body", context.request.body);
         var parseBody= JSON.parse( context.request.body)
         var internalId = parseBody.pointernalid
         var date       =  parseBody.changeallitemdate
         var lineCount=parseBody.linenumbertop
         var selectedLine=[]
         log.debug("selectlinein loop", parseBody.save)
         if(parseBody.save=="lineDate")
         {
            saveId = updateSelectRow(parseBody.internalId,parseBody.data)
            log.debug("saveID",saveId)
            var saveObj={
               internalId : saveId
            }

            context.response.write( JSON.stringify(saveObj))
            return 
         }

         if(parseBody.type=="login")
         {     
            var getInternalID=getVendorDataSavedSEarch(parseBody.username,parseBody.password)[0].id
            log.debug("typelogin",getInternalID)
            
            
            context.response.write(getInternalID)
         }

         if(context.request.parameters.type == "fileUpload")
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


            var fileObj = file.create({
               name: 'testwwwww.csv',
               fileType: file.Type.PLAINTEXT,
               contents: `approvalStatus,billAmount,billNo,billQunatity,date,internalId,location,poAmount,poNumber,poQuantity,vendorInternalId,vendorName
               Fully Billed,0,- None -,10,2021-08-29T19:00:00.000Z,22046,BHG,0,PO140001CM,10,944,Alexander Valley Vineyards
               Pending Supervisor Approval,150,- None -,5,2019-05-30T19:00:00.000Z,11747,- None -,150,PO140006CM,5,1305,AL Systems Ltd
               Fully Billed,5,- None -,5,2019-12-11T19:00:00.000Z,11776,- None -,5,PO140016CM,5,2336,Jasim startup
               Fully Billed,1500,- None -,3,2019-12-11T19:00:00.000Z,11784,- None -,1500,PO140017CM,3,2336,Jasim startup
               Pending Bill,,- None -,1,2019-12-11T19:00:00.000Z,11792,- None -,1000,PO140018CM,,2336,Jasim startup
               Fully Billed,400,- None -,10,2019-12-12T19:00:00.000Z,11809,- None -,400,PO140019CM,10,2336,Jasim startup
               Fully Billed,400,- None -,10,2019-12-11T19:00:00.000Z,11797,- None -,400,PO140019CM,10,2336,Jasim startup
               Fully Billed,2500000,- None -,5000,2019-12-12T19:00:00.000Z,11804,- None -,2500000,PO140020CM,5000,2336,Jasim startup
               Fully Billed,44000,- None -,89,2019-12-12T19:00:00.000Z,11816,- None -,43500,PO140021CM,88,2339,Jasim & co
               Fully Billed,250000,- None -,500,2019-12-15T19:00:00.000Z,11834,- None -,250000,PO140022CM,500,2339,Jasim & co
               Partially Received,1584.6,- None -,47,2020-08-04T19:00:00.000Z,12592,- None -,1584.6,PO140113CM,47,38,American Computers
               Fully Billed,299,- None -,1,2021-09-09T19:00:00.000Z,22050,Dapur Solo - Panglima,299,PO140130CM,1,1436,China Manufacturer
               Pending Receipt,30,- None -,1,2020-09-23T19:00:00.000Z,20965,CM00Z001 Jade e Services (MTA),30,PO140137CM,1,949,Bausch & Lomb
               Fully Billed,299,- None -,1,2021-09-16T19:00:00.000Z,22058,Dapur Solo - Panglima,299,PO140138CM,1,1436,China Manufacturer
               Closed,1.25,- None -,2,2021-09-23T19:00:00.000Z,22091,Tangs,0,PO140141CM,0,944,Alexander Valley Vineyards
               Partially Received,400,- None -,4,2021-09-25T19:00:00.000Z,22127,- None -,500,PO140149CM,5,944,Alexander Valley Vineyards
               Partially Received,400,- None -,4,2022-03-30T19:00:00.000Z,34048,- None -,500,PO140149CM,5,944,Alexander Valley Vineyards
               Pending Billing/Partially Received,110,343423,1,2021-09-26T19:00:00.000Z,22161,- None -,110,PO140150CM,1,944,Alexander Valley Vineyards
               Partially Received,400,- None -,8,2021-10-25T19:00:00.000Z,22317,- None -,19076,PO140151CM,56,944,Alexander Valley Vineyards
               Partially Received,700,- None -,7,2021-09-26T19:00:00.000Z,22138,- None -,500,PO140151CM,5,944,Alexander Valley Vineyards
               Partially Received,700,- None -,7,2021-09-26T19:00:00.000Z,22140,- None -,500,PO140151CM,5,944,Alexander Valley Vineyards
               Partially Received,400,- None -,8,2021-10-25T19:00:00.000Z,22323,- None -,500,PO140151CM,10,944,Alexander Valley Vineyards
               Partially Received,700,- None -,7,2021-09-26T19:00:00.000Z,22134,- None -,500,PO140151CM,5,944,Alexander Valley Vineyards
               Partially Received,400,- None -,8,2021-10-25T19:00:00.000Z,22324,- None -,500,PO140151CM,10,944,Alexander Valley Vineyards
               Fully Billed,85,ees,5,2021-11-23T19:00:00.000Z,24293,Tangs,85,PO140162CM,5,944,Alexander Valley Vineyards
               Partially Received,500,- None -,5,2021-09-27T19:00:00.000Z,22268,- None -,500,PO140169CM,5,944,Alexander Valley Vineyards
               Pending Billing/Partially Received,110,556,1,2021-09-27T19:00:00.000Z,22274,- None -,110,PO140170CM,1,944,Alexander Valley Vineyards
               Partially Received,1480,- None -,26,2021-09-27T19:00:00.000Z,22278,CM00H014 BHC Tampines,1480,PO140171CM,26,944,Alexander Valley Vineyards
               Partially Received,109.45,- None -,55,2021-09-27T19:00:00.000Z,22283,CM00H014 BHC Tampines,109.45,PO140172CM,55,944,Alexander Valley Vineyards
               Partially Received,1480,- None -,26,2021-09-27T19:00:00.000Z,22280,CM00H014 BHC Tampines,1480,PO140172CM,26,944,Alexander Valley Vineyards
               Partially Received,500,- None -,10,2021-10-25T19:00:00.000Z,22328,BHG : CM00H010,1000,PO140173CM,20,944,Alexander Valley Vineyards
               Partially Received,500,- None -,10,2021-10-20T19:00:00.000Z,22290,BHG : CM00H010,1000,PO140175CM,20,944,Alexander Valley Vineyards
               Partially Received,1300,- None -,20,2021-10-21T19:00:00.000Z,22301,BHG : CM00H010,1800,PO140176CM,30,944,Alexander Valley Vineyards
               Partially Received,1300,888,20,2021-10-21T19:00:00.000Z,22306,BHG : CM00H010,1800,PO140181CM,30,944,Alexander Valley Vineyards
               Partially Received,110,- None -,1,2021-11-07T19:00:00.000Z,22390,Singapore : East Coast,110,PO140187CM,1,944,Alexander Valley Vineyards
               Partially Received,910,- None -,11,2021-11-07T19:00:00.000Z,22397,BHG : CM00H010,910,PO140192CM,11,944,Alexander Valley Vineyards
               Partially Received,1000,- None -,20,2022-03-31T19:00:00.000Z,34067,BHG : CM00H010,1000,PO140194CM,20,944,Alexander Valley Vineyards
               Partially Received,6769.75,- None -,76,2022-03-30T19:00:00.000Z,34057,BHG : CM00H010,6769.75,PO140203CM,76,944,Alexander Valley Vineyards
               Fully Billed,1000,- None -,20,2021-11-14T19:00:00.000Z,24233,OG,1000,PO140219CM,20,944,Alexander Valley Vineyards
               Partially Received,300,demo 001,6,2022-03-31T19:00:00.000Z,34074,Metro : CM00H022 Paragon,300,PO140595CM,6,944,Alexander Valley Vineyards
               Fully Billed,6770,- None -,85,2012-07-02T19:00:00.000Z,1294,- None -,6770,PO14000000001015CM,85,965,Computer Depot Pacific
               Fully Billed,2425,- None -,45,2012-06-14T19:00:00.000Z,1069,- None -,2425,PO14000000001016CM,45,963,Computer Glory
               Fully Billed,4400,- None -,20,2012-06-14T19:00:00.000Z,1067,- None -,4400,PO14000000001018CM,20,964,Computer Systems LTD
               Fully Billed,1990,- None -,10,2012-06-19T19:00:00.000Z,1132,CM00Z001 Jade e Services (MTA),1990,PO14000000001026CM,10,927,Drive Medical Design & Manufacturing
               Fully Billed,1990,- None -,10,2012-06-19T19:00:00.000Z,1136,CM00Z001 Jade e Services (MTA),1990,PO14000000001027CM,10,929,Invacare Corporation
               Fully Billed,1200,- None -,10,2012-06-19T19:00:00.000Z,1139,CM00Z001 Jade e Services (MTA),1200,PO14000000001028CM,10,929,Invacare Corporation
               Fully Billed,18772.5,- None -,200,2012-03-02T19:00:00.000Z,1226,CM00Z001 Jade e Services (MTA),18772.5,PO14000000001034CM,200,1053,Polaroid
               Fully Billed,18772.5,- None -,200,2012-07-02T19:00:00.000Z,1228,Dapur Solo - Panglima,18772.5,PO14000000001035CM,200,1053,Polaroid
               Fully Billed,26019.25,- None -,50,2012-07-02T19:00:00.000Z,1244,CM00Z001 Jade e Services (MTA),26019.25,PO14000000001036CM,50,1054,Nikon
               Fully Billed,26019.25,- None -,50,2012-07-02T19:00:00.000Z,1240,Dapur Solo - Panglima,26019.25,PO14000000001037CM,50,1054,Nikon
               Fully Billed,9250,- None -,10,2012-07-02T19:00:00.000Z,1232,CM00Z001 Jade e Services (MTA),9250,PO14000000001038CM,10,1056,"Canon, Inc."
               Fully Billed,9250,- None -,10,2012-07-02T19:00:00.000Z,1230,Dapur Solo - Panglima,9250,PO14000000001039CM,10,1056,"Canon, Inc."
               Fully Billed,3749,- None -,20,2012-07-02T19:00:00.000Z,1242,CM00Z001 Jade e Services (MTA),3749,PO14000000001040CM,20,1061,Digital Supply
               Fully Billed,3749,- None -,20,2012-07-02T19:00:00.000Z,1238,Dapur Solo - Panglima,3749,PO14000000001041CM,20,1061,Digital Supply
               Fully Billed,1950,- None -,10,2012-07-02T19:00:00.000Z,1234,CM00Z001 Jade e Services (MTA),1950,PO14000000001042CM,10,1061,Digital Supply
               Fully Billed,1950,- None -,10,2012-07-02T19:00:00.000Z,1236,Dapur Solo - Panglima,1950,PO14000000001043CM,10,1061,Digital Supply
               Fully Billed,8391.75,- None -,80,2012-07-02T19:00:00.000Z,1259,CM00Z001 Jade e Services (MTA),8391.75,PO14000000001044CM,80,1057,Merlin
               Fully Billed,10640.8,- None -,85,2012-07-02T19:00:00.000Z,1260,Dapur Solo - Panglima,10640.8,PO14000000001045CM,85,1057,Merlin
               Fully Billed,3750,- None -,15,2012-07-02T19:00:00.000Z,1258,CM00Z001 Jade e Services (MTA),3750,PO14000000001046CM,15,1058,Motorola
               Fully Billed,4500,- None -,18,2012-07-02T19:00:00.000Z,1258,Dapur Solo - Panglima,4500,PO14000000001047CM,18,1058,Motorola
               Fully Billed,4146.4,- None -,218,2012-07-02T19:00:00.000Z,1262,CM00Z001 Jade e Services (MTA),4146.4,PO14000000001048CM,218,1060,Ramsey Electronic Supply
               Fully Billed,4559.73,- None -,225,2012-07-02T19:00:00.000Z,1261,Dapur Solo - Panglima,4559.73,PO14000000001049CM,225,1060,Ramsey Electronic Supply
               Fully Billed,3375,- None -,27,2012-07-02T19:00:00.000Z,1266,CM00Z001 Jade e Services (MTA),3375,PO14000000001050CM,27,1059,Panasonic
               Fully Billed,4275,- None -,31,2012-07-02T19:00:00.000Z,1268,Dapur Solo - Panglima,4275,PO14000000001051CM,31,1059,Panasonic
               Fully Billed,16144,- None -,320,2012-07-02T19:00:00.000Z,1300,CM00Z001 Jade e Services (MTA),16144,PO14000000001052CM,320,1078,Boston Ophthalmology
               Partially Received,3000,- None -,60,2022-03-03T19:00:00.000Z,33926,CM00Z001 Jade e Services (MTA),3000,PO14000000001054CM,60,944,Alexander Valley Vineyards
               Fully Billed,3250,- None -,10,2012-03-10T19:00:00.000Z,1341,CM00Z001 Jade e Services (MTA),3250,PO14000000001055CM,10,994,Herman Miller Inc.
               Fully Billed,12350,- None -,250,2012-04-04T19:00:00.000Z,1383,CM00Z001 Jade e Services (MTA),12350,PO14000000001056CM,250,944,Alexander Valley Vineyards
               Fully Billed,19.98,- None -,2,2012-04-24T19:00:00.000Z,1751,CM00Z001 Jade e Services (MTA),19.98,PO14000000001080CM,2,931,Coopers Office Furniture
               Fully Billed,849,- None -,1,2011-12-14T19:00:00.000Z,1854,CM00Z001 Jade e Services (MTA),849,PO14000000001109CM,1,902,HP Corporation
               Fully Billed,9.99,- None -,1,2012-03-14T19:00:00.000Z,1859,CM00Z001 Jade e Services (MTA),9.99,PO14000000001110CM,1,933,The Office Shop Inc
               Fully Billed,964.9,- None -,5,2012-03-06T19:00:00.000Z,1924,CM00Z001 Jade e Services (MTA),964.9,PO14000000001111CM,5,931,Coopers Office Furniture
               Fully Billed,6724.15,- None -,60,2012-03-07T19:00:00.000Z,1936,CM00Z001 Jade e Services (MTA),6724.15,PO14000000001112CM,60,931,Coopers Office Furniture
               Fully Billed,2593.4,- None -,80,2012-03-07T19:00:00.000Z,1949,Dapur Solo - Panglima,2593.4,PO14000000001113CM,80,39,Koka Office Supplies
               Fully Billed,2851.9,- None -,18,2012-03-12T19:00:00.000Z,2006,CM00Z001 Jade e Services (MTA),2851.9,PO14000000001116CM,18,931,Coopers Office Furniture
               Fully Billed,59.99,- None -,1,2022-03-02T19:00:00.000Z,33914,CM00Z001 Jade e Services (MTA),59.99,PO14000000001121CM,1,944,Alexander Valley Vineyards
               Fully Billed,45000,- None -,7200,2011-01-14T19:00:00.000Z,3460,CM00Z001 Jade e Services (MTA),45000,PO14000000001158CM,7200,962,"Clancy Machine Tool, Inc."
               Fully Billed,25000,- None -,500,2011-03-14T19:00:00.000Z,3463,CM00Z001 Jade e Services (MTA),25000,PO14000000001159CM,500,12,"Best Fixture, Inc."
               Fully Billed,21950,- None -,50,2011-01-14T19:00:00.000Z,3464,CM00Z001 Jade e Services (MTA),21950,PO14000000001160CM,50,937,Computers Extreme
               Fully Billed,21950,- None -,50,2011-01-14T19:00:00.000Z,3464,Dapur Solo - Panglima,21950,PO14000000001161CM,50,937,Computers Extreme
               Fully Billed,26340,- None -,60,2011-01-14T19:00:00.000Z,3464,CM00Z001 Jade e Services (MTA),26340,PO14000000001162CM,60,937,Computers Extreme
               Fully Billed,26340,- None -,60,2011-01-14T19:00:00.000Z,3464,Dapur Solo - Panglima,26340,PO14000000001163CM,60,937,Computers Extreme
               Fully Billed,65850,- None -,150,2011-08-14T19:00:00.000Z,3468,CM00Z001 Jade e Services (MTA),65850,PO14000000001164CM,150,937,Computers Extreme
               Fully Billed,65850,- None -,150,2011-08-14T19:00:00.000Z,3468,Dapur Solo - Panglima,65850,PO14000000001165CM,150,937,Computers Extreme
               Fully Billed,96580,- None -,220,2011-08-14T19:00:00.000Z,3468,CM00Z001 Jade e Services (MTA),96580,PO14000000001166CM,220,937,Computers Extreme
               Fully Billed,96580,- None -,220,2011-08-14T19:00:00.000Z,3468,Dapur Solo - Panglima,96580,PO14000000001167CM,220,937,Computers Extreme
               Fully Billed,109750,- None -,250,2011-11-14T19:00:00.000Z,3478,CM00Z001 Jade e Services (MTA),109750,PO14000000001168CM,250,937,Computers Extreme
               Fully Billed,109750,- None -,250,2011-11-14T19:00:00.000Z,3478,Dapur Solo - Panglima,109750,PO14000000001169CM,250,937,Computers Extreme
               Fully Billed,4350,- None -,150,2010-12-12T19:00:00.000Z,3459,CM00Z001 Jade e Services (MTA),4350,PO14000000001170CM,150,1059,Panasonic
               Fully Billed,4350,- None -,150,2010-12-12T19:00:00.000Z,3459,Dapur Solo - Panglima,4350,PO14000000001171CM,150,1059,Panasonic
               Fully Billed,2900,- None -,100,2011-03-14T19:00:00.000Z,3467,CM00Z001 Jade e Services (MTA),2900,PO14000000001172CM,100,1059,Panasonic
               Fully Billed,2900,- None -,100,2011-03-14T19:00:00.000Z,3467,Dapur Solo - Panglima,2900,PO14000000001173CM,100,1059,Panasonic
               Fully Billed,2175,- None -,75,2011-09-14T19:00:00.000Z,3471,CM00Z001 Jade e Services (MTA),2175,PO14000000001174CM,75,1059,Panasonic
               Fully Billed,2175,- None -,75,2011-09-14T19:00:00.000Z,3471,Dapur Solo - Panglima,2175,PO14000000001175CM,75,1059,Panasonic
               Fully Billed,1450,- None -,50,2011-09-14T19:00:00.000Z,3471,CM00Z001 Jade e Services (MTA),1450,PO14000000001176CM,50,1059,Panasonic
               Fully Billed,1450,- None -,50,2011-09-14T19:00:00.000Z,3471,Dapur Solo - Panglima,1450,PO14000000001177CM,50,1059,Panasonic
               Fully Billed,1160,- None -,40,2011-12-12T19:00:00.000Z,3480,CM00Z001 Jade e Services (MTA),1160,PO14000000001178CM,40,1059,Panasonic
               Fully Billed,1160,- None -,40,2011-12-12T19:00:00.000Z,3480,Dapur Solo - Panglima,1160,PO14000000001179CM,40,1059,Panasonic
               Fully Billed,16827,- None -,213,2010-12-12T19:00:00.000Z,3459,CM00Z001 Jade e Services (MTA),16827,PO14000000001180CM,213,1059,Panasonic
               Fully Billed,16827,- None -,213,2011-12-12T19:00:00.000Z,3480,Dapur Solo - Panglima,16827,PO14000000001181CM,213,1059,Panasonic
               Fully Billed,39500,- None -,500,2011-09-14T19:00:00.000Z,3471,CM00Z001 Jade e Services (MTA),39500,PO14000000001182CM,500,1059,Panasonic
               Fully Billed,39500,- None -,500,2011-09-14T19:00:00.000Z,3471,Dapur Solo - Panglima,39500,PO14000000001183CM,500,1059,Panasonic
               Fully Billed,59250,- None -,750,2011-12-12T19:00:00.000Z,3480,CM00Z001 Jade e Services (MTA),59250,PO14000000001184CM,750,1059,Panasonic
               Fully Billed,59250,- None -,750,2011-12-12T19:00:00.000Z,3480,Dapur Solo - Panglima,59250,PO14000000001185CM,750,1059,Panasonic
               Fully Billed,15000,- None -,150,2011-03-14T19:00:00.000Z,3462,CM00Z001 Jade e Services (MTA),15000,PO14000000001186CM,150,975,Iron Horse Bicycles
               Fully Billed,15000,- None -,150,2011-03-14T19:00:00.000Z,3462,Dapur Solo - Panglima,15000,PO14000000001187CM,150,975,Iron Horse Bicycles
               Fully Billed,50000,- None -,500,2011-03-14T19:00:00.000Z,3462,CM00Z001 Jade e Services (MTA),50000,PO14000000001188CM,500,975,Iron Horse Bicycles
               Fully Billed,50000,- None -,500,2011-03-14T19:00:00.000Z,3462,Dapur Solo - Panglima,50000,PO14000000001189CM,500,975,Iron Horse Bicycles
               Fully Billed,30000,- None -,300,2011-08-14T19:00:00.000Z,3470,CM00Z001 Jade e Services (MTA),30000,PO14000000001190CM,300,975,Iron Horse Bicycles
               Fully Billed,30000,- None -,300,2011-08-14T19:00:00.000Z,3470,Dapur Solo - Panglima,30000,PO14000000001191CM,300,975,Iron Horse Bicycles
               Fully Billed,10000,- None -,100,2011-08-14T19:00:00.000Z,3470,CM00Z001 Jade e Services (MTA),10000,PO14000000001192CM,100,975,Iron Horse Bicycles
               Fully Billed,10000,- None -,100,2011-08-14T19:00:00.000Z,3470,Dapur Solo - Panglima,10000,PO14000000001193CM,100,975,Iron Horse Bicycles
               Fully Billed,15000,- None -,150,2012-01-14T19:00:00.000Z,3477,CM00Z001 Jade e Services (MTA),15000,PO14000000001194CM,150,975,Iron Horse Bicycles
               Fully Billed,15000,- None -,150,2012-01-14T19:00:00.000Z,3477,Dapur Solo - Panglima,15000,PO14000000001195CM,150,975,Iron Horse Bicycles
               Fully Billed,50000,- None -,500,2012-01-14T19:00:00.000Z,3477,CM00Z001 Jade e Services (MTA),50000,PO14000000001196CM,500,975,Iron Horse Bicycles
               Fully Billed,50000,- None -,500,2012-01-14T19:00:00.000Z,3477,Dapur Solo - Panglima,50000,PO14000000001197CM,500,975,Iron Horse Bicycles
               Fully Billed,30000,- None -,150,2010-11-02T19:00:00.000Z,3461,CM00Z001 Jade e Services (MTA),30000,PO14000000001198CM,150,1057,Merlin
               Fully Billed,30000,- None -,150,2010-11-02T19:00:00.000Z,3461,Dapur Solo - Panglima,30000,PO14000000001199CM,150,1057,Merlin
               Fully Billed,60000,- None -,300,2011-09-14T19:00:00.000Z,3474,CM00Z001 Jade e Services (MTA),60000,PO14000000001200CM,300,1057,Merlin
               Fully Billed,60000,- None -,300,2011-09-14T19:00:00.000Z,3474,Dapur Solo - Panglima,60000,PO14000000001201CM,300,1057,Merlin
               Fully Billed,10000,- None -,50,2011-11-14T19:00:00.000Z,3479,CM00Z001 Jade e Services (MTA),10000,PO14000000001202CM,50,1057,Merlin
               Fully Billed,10000,- None -,50,2011-11-14T19:00:00.000Z,3479,Dapur Solo - Panglima,10000,PO14000000001203CM,50,1057,Merlin
               Fully Billed,1500,- None -,100,2011-03-14T19:00:00.000Z,3466,CM00Z001 Jade e Services (MTA),1500,PO14000000001204CM,100,1058,Motorola
               Fully Billed,1500,- None -,100,2011-03-14T19:00:00.000Z,3466,Dapur Solo - Panglima,1500,PO14000000001205CM,100,1058,Motorola
               Fully Billed,9000,- None -,600,2011-08-14T19:00:00.000Z,3472,CM00Z001 Jade e Services (MTA),9000,PO14000000001206CM,600,1058,Motorola
               Fully Billed,9000,- None -,600,2011-08-14T19:00:00.000Z,3472,Dapur Solo - Panglima,9000,PO14000000001207CM,600,1058,Motorola
               Fully Billed,450,- None -,30,2011-12-14T19:00:00.000Z,3476,CM00Z001 Jade e Services (MTA),450,PO14000000001208CM,30,1058,Motorola
               Partially Received,9089.25,- None -,152,2021-12-27T19:00:00.000Z,26350,Metro : CM00H022 Paragon,7389.75,PO141208CM,82,944,Alexander Valley Vineyards
               Partially Received,9089.25,- None -,152,2021-12-27T19:00:00.000Z,26351,Metro : CM00H022 Paragon,7389.75,PO141208CM,82,944,Alexander Valley Vineyards
               Partially Received,2549.25,- None -,105,2021-12-27T19:00:00.000Z,26352,Metro : CM00H022 Paragon,849.75,PO141208CM,35,944,Alexander Valley Vineyards
               Partially Received,6540,- None -,47,2021-12-27T19:00:00.000Z,26353,Metro : CM00H022 Paragon,6540,PO141208CM,47,944,Alexander Valley Vineyards
               Fully Billed,450,- None -,30,2011-12-14T19:00:00.000Z,3476,Dapur Solo - Panglima,450,PO14000000001209CM,30,1058,Motorola
               Fully Billed,58,- None -,1,2022-04-12T19:00:00.000Z,34429,- None -,58,PO141209CM,1,2499,weWS Vendor
               Fully Billed,25000,- None -,500,2011-03-14T19:00:00.000Z,3463,Dapur Solo - Panglima,25000,PO14000000001210CM,500,12,"Best Fixture, Inc."
               Fully Billed,25000,- None -,500,2011-03-14T19:00:00.000Z,3463,Dapur Solo - Panglima,25000,PO14000000001211CM,500,12,"Best Fixture, Inc."
               Fully Billed,25000,- None -,500,2011-03-14T19:00:00.000Z,3463,CM00Z001 Jade e Services (MTA),25000,PO14000000001212CM,500,12,"Best Fixture, Inc."
               Fully Billed,25000,- None -,500,2011-09-14T19:00:00.000Z,3473,CM00Z001 Jade e Services (MTA),25000,PO14000000001213CM,500,12,"Best Fixture, Inc."
               Fully Billed,25000,- None -,500,2011-09-14T19:00:00.000Z,3473,Dapur Solo - Panglima,25000,PO14000000001214CM,500,12,"Best Fixture, Inc."
               Fully Billed,10000,- None -,200,2012-01-14T19:00:00.000Z,3482,CM00Z001 Jade e Services (MTA),10000,PO14000000001215CM,200,12,"Best Fixture, Inc."
               Fully Billed,10000,- None -,200,2012-01-14T19:00:00.000Z,3482,Dapur Solo - Panglima,10000,PO14000000001216CM,200,12,"Best Fixture, Inc."
               Fully Billed,45000,- None -,7200,2011-01-14T19:00:00.000Z,3460,Dapur Solo - Panglima,45000,PO14000000001217CM,7200,962,"Clancy Machine Tool, Inc."
               Fully Billed,38900,- None -,100,2011-03-14T19:00:00.000Z,3465,CM00Z001 Jade e Services (MTA),38900,PO14000000001218CM,100,1056,"Canon, Inc."
               Fully Billed,640,- None -,8,2021-11-29T19:00:00.000Z,24300,- None -,640,PO141218CM,8,2499,weWS Vendor
               Fully Billed,550,- None -,5,2021-12-07T19:00:00.000Z,24325,- None -,550,PO141219CM,5,2499,weWS Vendor
               Fully Billed,38900,- None -,100,2011-03-14T19:00:00.000Z,3465,CM00Z001 Jade e Services (MTA),38900,PO14000000001219CM,100,1056,"Canon, Inc."
               Fully Billed,440,- None -,4,2021-12-06T19:00:00.000Z,24303,- None -,440,PO141220CM,4,2499,weWS Vendor
               Fully Billed,75466,- None -,194,2011-03-14T19:00:00.000Z,3465,Dapur Solo - Panglima,75466,PO14000000001220CM,194,1056,"Canon, Inc."
               Fully Billed,58350,- None -,150,2011-03-14T19:00:00.000Z,3465,CM00Z001 Jade e Services (MTA),58350,PO14000000001221CM,150,1056,"Canon, Inc."
               Fully Billed,58350,- None -,150,2011-03-14T19:00:00.000Z,3465,Dapur Solo - Panglima,58350,PO14000000001222CM,150,1056,"Canon, Inc."
               Fully Billed,77800,- None -,200,2011-10-14T19:00:00.000Z,3469,CM00Z001 Jade e Services (MTA),77800,PO14000000001223CM,200,1056,"Canon, Inc."
               Fully Billed,77800,- None -,200,2011-10-14T19:00:00.000Z,3469,Dapur Solo - Panglima,77800,PO14000000001224CM,200,1056,"Canon, Inc."
               Fully Billed,82857,- None -,213,2011-10-14T19:00:00.000Z,3469,CM00Z001 Jade e Services (MTA),82857,PO14000000001225CM,213,1056,"Canon, Inc."
               Fully Billed,82857,- None -,213,2011-10-14T19:00:00.000Z,3469,Dapur Solo - Panglima,82857,PO14000000001226CM,213,1056,"Canon, Inc."
               Fully Billed,101140,- None -,260,2011-10-14T19:00:00.000Z,3469,CM00Z001 Jade e Services (MTA),101140,PO14000000001227CM,260,1056,"Canon, Inc."
               Pending Billing/Partially Received,50,- None -,1,2022-04-20T19:00:00.000Z,34499,Metro : CM00H022 Paragon,1000,PO141228CM,20,944,Alexander Valley Vineyards
               Fully Billed,101140,- None -,260,2011-10-14T19:00:00.000Z,3469,Dapur Solo - Panglima,101140,PO14000000001228CM,260,1056,"Canon, Inc."
               Partially Received,1800,- None -,30,2021-12-28T19:00:00.000Z,26372,Metro : CM00H022 Paragon,1800,PO141229CM,30,944,Alexander Valley Vineyards
               Fully Billed,50959,- None -,131,2012-02-14T19:00:00.000Z,3483,CM00Z001 Jade e Services (MTA),50959,PO14000000001229CM,131,1056,"Canon, Inc."
               Fully Billed,50959,- None -,131,2012-02-14T19:00:00.000Z,3483,Dapur Solo - Panglima,50959,PO14000000001230CM,131,1056,"Canon, Inc."
               Fully Billed,20000,- None -,1100,2012-01-14T19:00:00.000Z,3481,CM00Z001 Jade e Services (MTA),20000,PO14000000001231CM,1100,962,"Clancy Machine Tool, Inc."
               Fully Billed,16500,- None -,900,2011-06-14T19:00:00.000Z,3475,CM00Z001 Jade e Services (MTA),16500,PO14000000001232CM,900,962,"Clancy Machine Tool, Inc."
               Fully Billed,53750,- None -,2750,2011-01-14T19:00:00.000Z,3460,Dapur Solo - Panglima,53750,PO14000000001233CM,2750,962,"Clancy Machine Tool, Inc."
               Fully Billed,400,- None -,5,2022-01-23T19:00:00.000Z,32053,- None -,400,PO141233CM,5,2499,weWS Vendor
               Fully Billed,12500,- None -,1,2010-12-01T19:00:00.000Z,3288,Dapur Solo - Panglima,12500,PO14000000001236CM,1,992,Allsteel
               Partially Received,69.65,- None -,35,2022-02-20T19:00:00.000Z,33907,- None -,49.75,PO141236CM,25,944,Alexander Valley Vineyards
               Partially Received,0,- None -,0,2022-02-20T19:00:00.000Z,33908,- None -,400,PO141236CM,12,944,Alexander Valley Vineyards
               Fully Billed,1185,- None -,1,2010-11-30T19:00:00.000Z,3291,Dapur Solo - Panglima,1185,PO14000000001237CM,1,992,Allsteel
               Fully Billed,249,- None -,1,2010-11-30T19:00:00.000Z,3294,Dapur Solo - Panglima,249,PO14000000001238CM,1,992,Allsteel
               Fully Billed,144,- None -,1,2012-03-13T19:00:00.000Z,3531,Dapur Solo - Panglima,144,PO14000000001239CM,1,1061,Digital Supply
               Fully Billed,1.99,1111,1,2022-03-30T19:00:00.000Z,34046,- None -,1.99,PO141243CM,1,944,Alexander Valley Vineyards
               Fully Billed,1500,- None -,20,2012-03-21T19:00:00.000Z,3569,Dapur Solo - Panglima,1500,PO14000000001243CM,20,1313,Eric Givens
               Partially Received,750,- None -,10,2012-03-21T19:00:00.000Z,3616,Dapur Solo - Panglima,1500,PO14000000001244CM,20,1313,Eric Givens
               Partially Received,2375,- None -,5,2012-03-07T19:00:00.000Z,3614,Dapur Solo - Panglima,4750,PO14000000001245CM,10,1305,AL Systems Ltd
               Pending Bill,32500,- None -,3.25,2012-03-07T19:00:00.000Z,3647,Dapur Solo - Panglima,40000,PO14000000001246CM,4,1305,AL Systems Ltd
               Pending Bill,32500,- None -,3.25,2012-03-24T19:00:00.000Z,3652,Dapur Solo - Panglima,40000,PO14000000001246CM,4,1305,AL Systems Ltd
               Partially Received,12000,- None -,128,2012-03-24T19:00:00.000Z,3651,Dapur Solo - Panglima,24000,PO14000000001247CM,256,1313,Eric Givens
               Partially Received,12000,- None -,128,2012-03-14T19:00:00.000Z,3649,Dapur Solo - Panglima,24000,PO14000000001247CM,256,1313,Eric Givens
               Fully Billed,185,- None -,9,2012-02-01T19:00:00.000Z,3681,Dapur Solo - Panglima,185,PO14000000001248CM,9,994,Herman Miller Inc.
               Fully Billed,85,- None -,5,2022-04-12T19:00:00.000Z,34288,Tangs,85,PO141249CM,5,944,Alexander Valley Vineyards
               Fully Billed,192.98,- None -,1,2012-01-17T19:00:00.000Z,3692,Dapur Solo - Panglima,192.98,PO14000000001249CM,1,931,Coopers Office Furniture
               Fully Billed,150,- None -,1,2012-01-14T19:00:00.000Z,3691,Dapur Solo - Panglima,150,PO14000000001250CM,1,994,Herman Miller Inc.
               Fully Billed,225,- None -,5,2012-03-01T19:00:00.000Z,3700,Dapur Solo - Panglima,225,PO14000000001251CM,5,994,Herman Miller Inc.
               Fully Billed,189.99,- None -,1,2012-04-11T19:00:00.000Z,3711,Dapur Solo - Panglima,189.99,PO14000000001252CM,1,931,Coopers Office Furniture
               Fully Billed,100,- None -,4,2012-05-01T19:00:00.000Z,3718,Dapur Solo - Panglima,100,PO14000000001253CM,4,994,Herman Miller Inc.
               Fully Billed,25,- None -,1,2012-03-01T19:00:00.000Z,3726,Dapur Solo - Panglima,25,PO14000000001254CM,1,994,Herman Miller Inc.
               Fully Billed,60,- None -,4,2012-04-01T19:00:00.000Z,3741,Dapur Solo - Panglima,60,PO14000000001255CM,4,994,Herman Miller Inc.
               Pending Receipt,6250,- None -,250,2012-03-24T19:00:00.000Z,3857,CM00Z001 Jade e Services (MTA),6250,PO14000000001259CM,250,12,"Best Fixture, Inc."
               Partially Received,995,- None -,3203.28,2016-11-09T19:00:00.000Z,9887,CM00Z001 Jade e Services (MTA),995,PO14000000001263CM,3203.28,994,Herman Miller Inc.
               Fully Billed,995,- None -,3200,2016-11-09T19:00:00.000Z,9887,CM00Z001 Jade e Services (MTA),995,PO14000000001264CM,3200,994,Herman Miller Inc.
               Fully Billed,0,- None -,10400,2012-03-25T19:00:00.000Z,4594,Dapur Solo - Panglima,0,PO14000000001271CM,10400,994,Herman Miller Inc.
               Fully Billed,995,- None -,3200,2011-07-30T19:00:00.000Z,4597,Dapur Solo - Panglima,995,PO14000000001272CM,3200,994,Herman Miller Inc.
               Fully Billed,29900,- None -,100,2017-05-15T19:00:00.000Z,10589,CM00Z001 Jade e Services (MTA),29900,PO14000000001277CM,100,1436,China Manufacturer
               Fully Billed,30411,- None -,109,2017-05-15T19:00:00.000Z,10589,Dapur Solo - Panglima,30411,PO14000000001279CM,109,1436,China Manufacturer
               Fully Billed,29900,PI-005,100,2017-05-15T19:00:00.000Z,10593,Dapur Solo - Panglima,29900,PO14000000001280CM,100,1436,China Manufacturer
               Fully Billed,29900,PI-005,100,2017-05-15T19:00:00.000Z,10593,Dapur Solo - Panglima,29900,PO14000000001281CM,100,1436,China Manufacturer
               Fully Billed,59800,- None -,200,2012-06-07T19:00:00.000Z,5071,Dapur Solo - Panglima,59800,PO14000000001286CM,200,1436,China Manufacturer
               Fully Billed,2000,Inv#003,200,2012-07-31T19:00:00.000Z,5221,VIS-JAKARTA WH,2000,PO14000000001289CM,200,1608,Ateja
               Fully Billed,500,INV#3091930,50,2012-07-11T19:00:00.000Z,5206,VIS-BANDUNG WH,500,PO14000000001290CM,50,1609,VANIA-Jkt
               Fully Billed,4000,- None -,1640,2012-07-11T19:00:00.000Z,5212,VIS-BANDUNG WH,4000,PO14000000001291CM,1640,1608,Ateja
               Pending Receipt,299,- None -,1,2012-07-12T19:00:00.000Z,5219,- None -,299,PO14000000001292CM,1,1436,China Manufacturer
               Pending Bill,800,Inv#007,10,2012-10-09T19:00:00.000Z,5395,VIS-JAKARTA WH,800,PO14000000001298CM,10,1608,Ateja
               Fully Billed,960,- None -,12,2012-10-09T19:00:00.000Z,5402,VIS-JAKARTA WH,800,PO14000000001299CM,10,1635,V0004 Test Vendor
               Fully Billed,100,- None -,2,2022-04-13T19:00:00.000Z,34449,- None -,100,PO141299CM,2,2499,weWS Vendor
               Pending Receipt,8000,- None -,100,2012-10-09T19:00:00.000Z,5404,VIS-JAKARTA WH,8000,PO14000000001300CM,100,1608,Ateja
               Pending Bill,800,- None -,10,2012-10-10T19:00:00.000Z,5407,VIS-JAKARTA WH,800,PO14000000001301CM,10,1635,V0004 Test Vendor
               Pending Bill,800,Inv#008,10,2012-10-10T19:00:00.000Z,5410,VIS-JAKARTA WH,800,PO14000000001302CM,10,1635,V0004 Test Vendor
               Fully Billed,2000,- None -,25,2012-10-10T19:00:00.000Z,5416,VIS-JAKARTA WH,1600,PO14000000001303CM,20,1635,V0004 Test Vendor
               Fully Billed,2000,- None -,25,2012-10-10T19:00:00.000Z,5419,VIS-JAKARTA WH,1600,PO14000000001303CM,20,1635,V0004 Test Vendor
               Fully Billed,110,12345,1,2012-10-30T19:00:00.000Z,5451,CM00Z001 Jade e Services (MTA),110,PO14000000001305CM,1,964,Computer Systems LTD
               Fully Billed,360,- None -,12,2013-06-25T19:00:00.000Z,5606,- None -,360,PO14000000001321CM,12,1602,Test Vendor
               Fully Billed,3000,Test VB,100,2013-06-24T19:00:00.000Z,5590,- None -,3000,PO14000000001322CM,100,1602,Test Vendor
               Fully Billed,3000,Test Bill-8,100,2013-06-25T19:00:00.000Z,5602,- None -,3000,PO14000000001324CM,100,1602,Test Vendor
               Pending Receipt,389.61,vend bill,39,2014-03-02T19:00:00.000Z,6485,- None -,389.61,PO14000000001331CM,39,43,"Sullivan Distributors, Inc."
               Fully Billed,90,PI-002,3,2017-05-15T19:00:00.000Z,10591,- None -,90,PO-000001-14,3,1893,PR_VEND PR_VEND_Company
               Fully Billed,90,- None -,3,2017-05-15T19:00:00.000Z,10592,- None -,90,PO-000001-14,3,1893,PR_VEND PR_VEND_Company
               Fully Billed,90,PI-001,3,2017-05-15T19:00:00.000Z,10590,- None -,90,PO-000001-14,3,1893,PR_VEND PR_VEND_Company
               Fully Billed,90,bill 1,3,2014-02-27T19:00:00.000Z,6481,- None -,90,PO-000001-14,3,1893,PR_VEND PR_VEND_Company
               Fully Billed,19.5615,Test ExR,1,2014-07-17T19:00:00.000Z,7168,CM00Z001 Jade e Services (MTA),19.56,Test ExR,1,1602,Test Vendor
               Fully Billed,19.5615,Yesy ExR-1,1,2014-07-17T19:00:00.000Z,7175,CM00Z001 Jade e Services (MTA),19.56,Test ExR-1,1,1602,Test Vendor
               Fully Billed,8000,bill 1,100,2014-03-02T19:00:00.000Z,6484,- None -,8000,Test PO-New,100,1602,Test Vendor
               ,NaN,,68,,NaN,,6180065.98,,68,,
               Pending Billing/Partially Received,100,test sync,,2022-04-20T19:00:00.000Z,34508,Metro : CM00H022 Paragon,1000,po434343343,20,944,
               Pending Billing/Partially Received,150,test sync 2,,2022-04-20T19:00:00.000Z,34509,Metro : CM00H022 Paragon,1000,PO141228CM,20,944,
               `,
               description: 'This is a plain text file.',
               encoding: file.Encoding.UTF8,
               folder: 1917,
               isOnline: true
           });

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
         name: "line",
         summary: "GROUP",
         sort: search.Sort.ASC,
         label: "Line ID"
      }),

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
 function updateSelectRow(internalId,data)
 {
   
     var Record = record.load({
         type: 'purchaseorder',
         id: internalId,
      isDynamic: true
      });
          

          var itemlines = Record.getLineCount({ sublistId: "item"});



          for(i=0; i <data.length; i++)
          {
              log.debug("line:data.lineId",data[i].lineId)
              Record.selectLine({ sublistId:'item' , line: data[i].lineId });
              if(data[i].date)
              {
               newDate=new Date(moment(new Date(data[i].date), "M/D/YYYY").add(1, 'days'))
               log.audit("newDate",newDate);
               Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'expectedreceiptdate' ,value: newDate }); 
              }
              
              Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'custcol_pointstarvendor_originalqty' ,value:data[i].quantity});
              Record.commitLine({sublistId: 'item'});  
          }
          var saveid=  Record.save();
          log.debug("save",saveid)

          
          return saveid

      
      // for(var i=0; i<itemlines; i++)
      // {
      //    log.audit("checkqtyinloop",i)
      //       //Record.setSublistText({ sublistId:'item',fieldId:'expectedreceiptdate' ,line:i })
           
      //       for(var j=0;j<lines.length;j++)
      //       {
      //        log.audit("checkqtyinloop",i+'-'+lines[j]+'-qty'+data["qty"+i])
      //          if(i==lines[j])
      //          {
      //            log.audit("incondition",i+'-'+lines[j])
      //           Record.selectLine({ sublistId:'item' ,line:i });
      //           if(date)
      //           { 
      //             // log.audit("cheekcdate",Date.parse(date))
      //            //  log.audit("new Date(date)",new Date(date+1))
                  
                   
      //             // var newdate = format.format({value: date,    type: format.Type.DATE});
      //             // newDate=new Date(date).setDate(1);
      //            //  var new_date = moment.moment(date, "M/D/YYYY").add(2, 'days');
      //              //log.audit("dateChange",moment(new Date(date), "M/D/YYYY").add(2, 'days'))
      //              newDate=new Date(moment(new Date(date), "M/D/YYYY").add(1, 'days'))
      //             log.audit("newDate",newDate);
      //              Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'expectedreceiptdate' ,value: newDate });}  

      //            Record.setCurrentSublistValue({ sublistId:'item' ,fieldId:'custcol_pointstarvendor_originalqty' ,value:data["qty"+i]});
      //           Record.commitLine({sublistId: 'item'});
      //          }
      //       }
      //       Record.setValue({fieldId : 'custbody_pointstarvendor_accept', value: true})
      //       Record.setValue({fieldId : 'custbody_ps_vendor_isreject', value: false})
      // }

   // var saveid=  Record.save();
     // log.debug("save",saveid)
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
 