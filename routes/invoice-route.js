const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');

const app = express()

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

//const PurchaseRequests = require('../models/purchaseRequests')
// const ItemFulfillments = require('../models/itemFulfillments')
// const Invoices = require('./models/invoices')


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const authCheck = (req, res, next) => {
    if (! req.session.user_id) {
      return res.redirect('/login')
  
    }
     next()
  }



router.get('/invoiceList',authCheck,async(req,res)=>{
  
     var data = []
     var listName="invoice"
    try {
        data = await Invoice.find({vendorInternalId:req.session.user_id}) 
        console.log(data)
        //data.purchaseRequests = purchaseRequests
        let route = "pages/invoice_Table"
        res.render('index', { route, listName, data, moment: moment })
    }
    catch (e) {
        console.log(e)
    }
    
  })

  router.get('/invoiceForm&id=:id',async (req,res)=>{
    console.log("checkparam", req.params)
    var { id } = req.params
    var data = []
    var listName="invoice"
   try {
       data = await Invoice.findOne({ invoiceNumber: parseInt(id) }) 
       console.log(data)
       var date = moment(data.date).format("DD-MMM-YYYY")
    //    var date = data.date
       var tranId = data.invoiceNumber
       var location = data.location
       console.log(data.date)
       //data.purchaseRequests = purchaseRequests
       let route = "pages/invoiceForm"
       res.render('index', { route, listName, data, moment: moment , date , tranId , location })
   }
   catch (e) {
       console.log(e)
   }
   
 })

 router.get('/invoiceForm/itemdetail&id=:id',(req, res) => {

    console.log("chddd", req.params)


    let route = "pages/purchaseRequestForm"
    let listName = "Purchase Request"
    var { id } = req.params

    console.log("chd", id)
    axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=invoice&internalid=' + id, {
    })
        .then(function (response) {
            // console.log(response.data[0]);

            let tableData = response.data
            let tranId = response.data[0].values["GROUP(tranid)"]
            let location = response.data[0].values["GROUP(locationnohierarchy)"]
            let date = response.data[0].values["GROUP(trandate)"]
            breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
            res.send(tableData)
            //  res.render('index', {route,listName ,breadcrumbs,tableData,tranId,location,date}) 
        })
        .catch(function (error) {
            console.log("erorr", error);
        });

})


//   router.get('/invoiceForm&id=:id',async (req, res) => {


//     var { id } = req.params
//     var data = []
//     var query = { internalId: id };
//     try {
//         console.log("query", query)
//         data = await Invoice.findOne(query)
//         console.log("data", data)

//         var tranId   = data["invoiceNumber"]
//         var date     = moment(data["date"]).format("MM-DD-YYYY")
//         var totalQty = data["quantity"]
//         var location = data["location"]
//         var totalAmount  = 0 

//         //data.purchaseRequests = purchaseRequests
//     }
//     catch (e) {
//         console.log(e)
//     }

//     let route = "pages/invoiceForm"
//     let listName = "Invoice"

//        breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
//        res.render('index', { route, listName, breadcrumbs,tranId,date,totalQty,totalAmount,location})

// })

 
  module.exports = router