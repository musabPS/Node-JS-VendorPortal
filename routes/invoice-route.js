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



router.get('/invoiceList',async(req,res)=>{
  
     var data = []
     var listName="invoice"
    try {
        data = await Invoice.find() 
        console.log(data)
        //data.purchaseRequests = purchaseRequests
        let route = "pages/transactionTable"
        res.render('index', { route, listName, data, moment: moment })
    }
    catch (e) {
        console.log(e)
    }
    
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