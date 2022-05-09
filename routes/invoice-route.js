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


app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const Invoice = require('../models/invoices-model')
const ItemFulfillments = require('../models/itemFulfillments-model')

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

router.get('/invoiceForm/itemdetail&id=:id', (req, res) => {

  console.log("chddd", req.params)


  let route = "pages/purchaseRequestForm"
  let listName = "Purchase Request"
  var { id } = req.params

  console.log("chd", id)
  axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=invoice&internalid=' + id, {
  })
    .then(function (response) {
      console.log(response);

      let tableData = response.data
      let tranId = response.data[0].values["GROUP(tranid)"]
      let location = response.data[0].values["GROUP(locationnohierarchy)"]
      let date = response.data[0].values["GROUP(trandate)"]
      let breadcrumb = { name1 : "", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
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
    let netsuieFileUpload = 'https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=createBill&irid='+id

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

router.post('/invoiceView&irid=:id', upload.single('custpage_file0'), (req, res,next) => {


  const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data
  console.log(req.file)
  let form = new FormData();
  form.append('custpage_file0',req.file)
  // form.append('fieldname', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

  console.log("chddd", req.body)
  console.log("req.file", req.file)
 
  let { id } = req.params

  console.log("chd", id)
  const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=createBill&irid=" + id


  // axios.post(url, form, {
  //           headers: {
  //               'Content-Type': `multipart/form-data; boundary=${form._boundary()}`
  //           }
  //       }).then((responseFromServer2) => {

          
  //           res.send("SUCCESS")
  //       }).catch((err) => {
  //           res.send("ERROR")
  //       })

  let bufferStream = new stream.PassThrough();
  bufferStream.end(req.file.buffer);
  request({
    url, json: true,
    method: "POST",
    body:form,
    headers: {
      "contentType": "multipart/form-data",
    }
  },
    (error, response, body) => {
      if (error) {
        console.log('Unable to connect to suitelet', body)
        res.send("error")
    
      }
      else {
        console.log("check0", response.body)
        res.redirect('/invoiceForm&id=' + response.body)

      }
    })


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

router.get('/invoiceViewGetItemDetail&irid=:id', (req, res) => {

  console.log("chddd", req.params)


  let route = "pages/billDetailView"
  let listName = "Purchase Request"
  let { id } = req.params

  console.log("chd", id)
  axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=itemRecipt&internalid=' + id, {
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