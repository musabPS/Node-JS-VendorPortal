const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
var request = require('request')
var multer  = require('multer')();
const FormData = require('form-data');
const fs = require('fs');

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

// const PurchaseRequests = require('../models/purchaseRequests')
 const ItemFulfillments = require('../models/itemFulfillments-model')



router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const authCheck = (req, res, next) => {
    if (! req.session.user_id) {
      return res.redirect('/login')
  
    }
     next()
  }

router.get('/itemFulfillmentList', authCheck, async (req, res) => {


    var data = []
    try {
        data =  await ItemFulfillments.find({vendorInternalId:req.session.user_id}) 
        // data = await ItemFulfillments.findOne({internalId:"6728"})
        console.log("check",data)
        //data.purchaseRequests = purchaseRequests

     let route = "pages/itemfulfillment_table"
     let listName = "ItemFulfillment"

     breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
     res.render('index', { route, listName, breadcrumbs,data,moment })
     }
     catch (e) {
        console.log(e)
     }

})

router.get('/itemfulfillmentForm&id=:id',authCheck,async (req, res) => {


    var { id } = req.params
    var data = []
    var query = { internalId: id };
    try {
        console.log("query", query)
        data = await ItemFulfillments.findOne(query)
        console.log("data", data)

        var tranId   = data["ifNumber"]
        var date     = moment(data["date"]).format("MM-DD-YYYY")
        var totalQty = data["quantity"]
        var location = data["location"]
        var totalAmount  = 0 
        var viewBill  = "/billView&irid="+id
        //data.purchaseRequests = purchaseRequests
    }
    catch (e) {
        console.log(e)
    }

    let route = "pages/itemFulfillmentForm"
    let listName = "Purchase Request"


    // axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=itemRecipt', {
    //     firstName: 'Fred',
    //     lastName: 'Flintstone'
    // })
    //     .then(function (response) {
    //         console.log(response.data[0]);

    //         let tableData = response.data

    //         breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
    //         res.render('index', { route, listName, breadcrumbs, tableData })
    //     })
    //     .catch(function (error) {
    //         console.log("erorr", error);
       // });

       breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
       res.render('index', { route, listName, breadcrumbs,tranId,date,totalQty,totalAmount,location,viewBill})

})

router.get('/itemfulfillmentForm/itemdetail&id=:id',(req, res) => {

    console.log("chddd", req.params)


    let route = "pages/purchaseRequestForm"
    let listName = "Purchase Request"
    var { id } = req.params

    console.log("chd", id)
    axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=itemRecipt&internalid=' + id, {
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

router.get('/billView&irid=:id',authCheck, async(req, res) => {


    try 
    {
        console.log("chddd", req.params)


        let route = "pages/billedDetailView"
        let listName = "Purchase Request"
        var { id } = req.params
        var query = { internalId: id };
        console.log("chd", id)
        data = await ItemFulfillments.findOne(query)
        console.log("data", data)
    
        var tranId   = data["ifNumber"]
        var date     = moment(data["date"]).format("MM-DD-YYYY")
        var totalQty = data["quantity"]
        var location = data["location"]
        var totalAmount  = data["amount"]
        var poNumber   =  data["poNumber"]

        breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
        res.render('index', { route, listName, breadcrumbs,tranId,date,totalQty,totalAmount,location,poNumber})
    }

    catch(e)
     {
        console.log("Error",e)
     }

})
router.get('/getItemDetail&irid=:id',(req, res) => {

    console.log("chddd", req.params)


    let route = "pages/billedDetailView"
    let listName = "Purchase Request"
    var { id } = req.params

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
            res.send(tableData)
        })
        .catch(function (error) {
            console.log("erorr", error);
        });

})

router.post('/billView&irid=:id',(req, res) => {

    console.log("chddd", req.body)


    let route = "pages/billedDetailView"
    let listName = "Purchase Request"
    var { id } = req.params

    console.log("chd", id)
    const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=createBill&irid="+id
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
            else 
            {

                console.log("check0",response.body)         
            }
        })
        

})



module.exports = router