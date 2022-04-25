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

//const PurchaseRequests = require('../models/purchaseRequests')
// const ItemFulfillments = require('../models/itemFulfillments')
 const payments = require('../models/payments-model')


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

router.get('/paymentList', async (req, res) => {

    var data=[]


    try {
        data =  await payments.find({vendorInternalId:req.session.user_id}) 
        // data = await ItemFulfillments.findOne({internalId:"6728"})
        console.log("check",data)
     
        let route = "pages/paymentsTable"
        let listName = "Payment List"
        breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
        res.render('index', { route, listName, breadcrumbs,data })
    }
    catch (e) {
       console.log(e)
    }




   
})

module.exports = router

