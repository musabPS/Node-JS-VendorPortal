const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
let request = require('request')
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const app = express()
const FormData = require('form-data');
const fs = require('fs');
var stream = require('stream');
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
let formidable = require('formidable');
var ajaxrequest = require('ajax-request');


app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)
app.use(upload.array()); 

const Invoice = require('../models/invoices-model')
const ItemFulfillments = require('../models/itemFulfillments-model')
const configration = require('../models/configration-model')

const { append } = require('express/lib/response')

//const PurchaseRequests = require('../models/purchaseRequests')
// const ItemFulfillments = require('../models/itemFulfillments')
// const Invoices = require('./models/invoices')


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const authCheck = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login')

  }
  next()
}



router.get('/invoiceList', authCheck, async (req, res) => {

  var data = []
  var listName = "invoice"
  console.log("check", req.session.user_id)
  try {
    data = await Invoice.find({ vendorInternalId: 944 }).sort({date: -1})
    // data = await Invoice.find({ vendorInternalId: 944 },{"sort" : ['datefield', 'desc']})
    //data = await Invoice.find({ vendorInternalId: 944 }).sort({datefield: -1})
  
    //data.purchaseRequests = purchaseRequests
    let route = "pages/invoiceTable" 
    let breadcrumb = { name1 : "Invoice List", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/"}
    res.render('index', { route, listName, data,breadcrumb, moment: moment })
  }
  catch (e) {
    console.log(e)
  }

})

router.get('/invoiceListAjax', authCheck, async (req, res) => {

  var data = []
  var listName = "invoice"
  console.log("check", req.session.user_id)
  try {
    data = await Invoice.find({ vendorInternalId: 944 }).sort({date: -1})

    // console.log("data",data)

    var finalData=[]
    var dataCollection={}
    var recordsTotal=data.length
    var recordsFiltered = data.length
 
   for(var i=0; i<data.length; i++){
       finalData.push({
           RecordID   :   i,
           poNumber   : '<a href=/invoiceForm&id='+data[i].internalId+' > '+data[i].poNumber+'  </a> ' ,
           date   : moment(data[i].date).format("MM-DD-YY") ,
           quantity   : data[i].poQuantity,
           amount     : data[i].poAmount,
           billQuantity     : data[i].billQuantity,
           billAmount     : data[i].billAmount,
           status : data[i].approvalStatus
       })
   }

   dataCollection = {
       recordsTotal : recordsTotal,
       recordsFiltered : recordsFiltered,
       data : finalData
   }
  //  console.log("dadad",dataCollection)
  //console.log("final data",finalData)

   res.send(dataCollection) 
    //data.purchaseRequests = purchaseRequests
   
  }
  catch (e) {
    console.log(e)
  }

})

router.get('/invoiceForm&id=:id', async (req, res) => {
  console.log("checkparam", req.params)
  var { id } = req.params
  var data = []
  var listName = "invoice"

  try {
    data = await Invoice.findOne({ invoiceNumber: parseInt(id) })
    console.log(data)
    var date = moment(data.date).format("DD-MMM-YYYY")
    //    var date = data.date
    var tranId = data.invoiceNumber
    var location = data.location
    var status = data.approvalStatus
    let breadcrumb = { name1 : "Invoice List", link1 : "/invoiceList", name2 : ">Invoice Form", link2 : "#", name3 : "Home>", link3 : "/" }
    console.log(data.date)
    //data.purchaseRequests = purchaseRequests
    let route = "pages/invoiceForm"
    res.render('index', { route, listName, data, breadcrumb, moment: moment, date, tranId, location, status })
  }
  catch (e) {
    console.log(e)
  }

})

router.get('/invoiceForm/itemdetail&id=:id',async (req, res) => {

  console.log("chddd", req.params)


  let route = "pages/purchaseRequestForm"
  let listName = "Purchase Request"
  var { id } = req.params

  console.log("chd", id)

  configrationData = await configration.findOne({ companyId: 1 })
    
    axios.get(configrationData.externalSuiteletURLProd+'&type=invoice&internalid=' + id, {
  })
    .then(function (response) {
      console.log(response);

      let tableData = response.data
      // let tranId = response.data[0].values["GROUP(tranid)"]
      // let location = response.data[0].values["GROUP(locationnohierarchy)"]
      // let date = response.data[0].values["GROUP(trandate)"]
      // let breadcrumb = { name1 : "", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
      res.send(tableData)
      //  res.render('index', {route,listName ,breadcrumbs,tableData,tranId,location,date}) 
    })
    .catch(function (error) {
      console.log("erorr", error);
    });

})
router.get('/invoiceView&irid=:id', authCheck, async (req, res) => {


  try { 
    console.log("chddd", req.params)


    let route = "pages/billDetailView"
    let listName = "Purchase Request"
    let { id } = req.params
    let query = { internalId: id };
    console.log("chd", id)
    data = await ItemFulfillments.findOne(query)
    console.log("data", data)

    let tranId = data["ifNumber"]
    let date = moment(data["date"]).format("MM-DD-YYYY")
    let totalQty = data["quantity"]
    let location = data["location"]
    let totalAmount = data["amount"]
    let poNumber = data["poNumber"]
    configrationData = await configration.findOne({ companyId: 1 })
    let netsuieFileUpload = configrationData.externalSuiteletURLProd+'&type=createBill&irid='

    breadcrumb = { "noBreadcrumbs": { name: "", link: "" } };
     res.render('index', { route, listName, breadcrumb, tranId, date, totalQty, totalAmount, location, poNumber, netsuieFileUpload })
    // let breadcrumb = { name1 : "Invoice List", link1 : ">invoiceList", name2 : ">Invoice Form", link2 : "#", name3 : "Home>", link3 : "/" }
  
  //  res.render('index', { route, listName, breadcrumb, tranId, date, totalQty, totalAmount, location, poNumber, fileUpload })
  }

  catch (e) 
  {
    console.log("Error", e)
  }

})

router.post('/invoiceView&irid=:id', async (req, res) => {
  var { id } = req.params

  //Create an instance of the form object
  // let form = new formidable.IncomingForm();
  // var formData = new FormData();
   console.log("req.body",req.body)


  

  // form.parse(req, function (error, fields, file) {
  //   console.log("req.fields",fields)
  //   console.log("req.param",req.params)
  //   console.log("file",file)

  // // formData.append('jsonData',{ first: 'Saeid', last: 'Alidadi' })
   
  //  formData.append('data', JSON.stringify(fields));
  //  console.log(formData)
  //   // formData = {
  //   //   name: { first: 'Saeid', last: 'Alidadi' }
  //   // }
  // });

  configrationData = await configration.findOne({ companyId: 1 })

  let url = configrationData.externalSuiteletURLProd+'&type=createBill&irid='+id
  
  request({
    url, json: true,
    method: "POST",
    body: req.body,
    headers: {
      "contentType": "application/json",

    }
  },
    (error, response, body) => {
      if (error) {
        console.log('Unable to connect to suitelet', body)
      }
      else {

        console.log("check id",response.body)
        
        res.send(JSON.stringify(response.body))
     
      }

    })


//   let http = require('http');
// let formidable = require('formidable');
// let fs = require('fs');

// http.createServer(function (req, res) {

//   //Create an instance of the form object
//   let form = new formidable.IncomingForm();

//   //Process the file upload in Node
//   form.parse(req, function (error, fields, file) {
//     let filepath = file.fileupload.filepath;
//     let newpath = 'C:/upload-example/';
//     newpath += file.fileupload.originalFilename;

//     //Copy the uploaded file to a custom folder
//     fs.rename(filepath, newpath, function () {
//       //Send a NodeJS file upload confirmation message
//       res.write('NodeJS File Upload Success!');
//       res.end();
//     });
//   });


// ajaxrequest.post({
//   url: url,
//   data: formData,
//   enctype: "multipart/form-data", 
//   processData: false,
//   contentType: false,
// })

// ajaxrequest({
//   url: url,
//   method: 'POST',
//   data: {
//     query1: 'value1'
//   },
//   headers: {
//           "contentType": "application/json",
//         }

// }, function(err, res, body) {
//   console.log("res",res)
  
//   console.log("err",err)
// });

// }).listen(80);
// ajaxrequest({
//     url, json: true,
//     method: "POST",
//     body: {"data":"asad"},
//     headers: {
//       "contentType": "application/json",
//     }
//   },
//     (error, response, body) => {
//       if (error) {
//         console.log('Unable to connect to suitelet', body)
//       }
//       else {

//         req.session.user_id = response.body
//         console.log("check0",response.body)

//         res.redirect("/")
//       }

//     })

})

function uploadAttachedFiles(auth, file, folderId) {
  log(`uploadAttachedFiles() ... `, fileName);
  drive = google.drive({ version: 'v3', auth });

  log(`checking if file && file.length > 0 file = ${file}... `, fileName);
  if (file && file.length > 0) {
      for (var i = 0; i < file.length; i++) {
          drive = google.drive({ version: 'v3', auth })
          let bufferStream = new stream.PassThrough();
          bufferStream.end(file[i].buffer);
          drive = google.drive({ version: 'v3', auth })
          drive.files.create({
              media: {
                  mimeType: ["image/png", "image/jpeg", 'application/pdf'],
                  body: bufferStream
              },
              resource: {
                  name: file[i].originalname,
                  // if you want to store the file in the root, remove this parents
                  parents: [folderId]
              },
              fields: 'id',
          }).then(function (resp) {
              console.log(resp, 'resp');
          }).catch(function (error) {
              console.log(error);
          })



      }
  }

}

router.get('/invoiceViewGetItemDetail&irid=:id', async(req, res) => {

  console.log("chddd", req.params)


  let route = "pages/billDetailView"
  let listName = "Purchase Request"
  let { id } = req.params


  configrationData = await configration.findOne({ companyId: 1 })
  console.log("chd", id)
  axios.get(configrationData.externalSuiteletURLProd+'&type=itemRecipt&internalid=' + id, {
  })
    .then(function (response) {
      console.log(response.data);

      let tableData = response.data
      let tranId = response.data[0].values["GROUP(tranid)"]
      let location = response.data[0].values["GROUP(locationnohierarchy)"]
      let date = response.data[0].values["GROUP(trandate)"]
      breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } }; 
     let breadcrumb = { name1 : "t", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
      res.send(tableData)
    })
    .catch(function (error) {
      console.log("erorr", error);
    });

})



// var axios = require('axios');
// var FormData = require('form-data');
// var data = new FormData();
// data.append('data', 'asldkfjalsdkjf');

// var config = {
//   method: 'post',
//   url: 'https://some-domain.com/formdata',
//   headers: { 
//     ...data.getHeaders()
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });

// router.post('/uploadFile&irid=:id', multer.single('fileFieldName'), (req, res) => {

//   // console.log("chddd", req.body)

//   // const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data
//   // console.log(req.file)

//   //  let form = new FormData();
//   // form.append('fileFieldName', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

//   // let route = "pages/billDetailView"
//   // let listName = "Purchase Request"
//   // let { id } = req.params

//   // axios.post("https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=fileUpload&irid="+id, form, {
//   //         headers: {
//   //             'Content-Type': `multipart/form-data; boundary=${form._boundary}`
//   //         }
//   //     }).then((responseFromServer2) => {


//   //         console.log("responseFromServer2",responseFromServer2)
//   //         res.send("SUCCESS")
//   //     }).catch((err) => {
//   //         res.send("ERROR")
//   //     })

//   // console.log("chd", id)
//   // const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=createBill&irid="+id
//   // request({
//   //     url, json: true,
//   //     method: "POST",
//   //     body: req.body,
//   //     headers: {
//   //         "contentType": "application/json",
//   //     }
//   //    },
//   //     (error, response, body) => {
//   //         if (error)
//   //          {
//   //             console.log('Unable to connect to suitelet', body)
//   //          }
//   //         else 
//   //         {
//   //             console.log("check0",response.body)     

//   //             res.redirect('/invoiceForm&id='+response.body)
//   //         }
//   //     })


// })



module.exports = router