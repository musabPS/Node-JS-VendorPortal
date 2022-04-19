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

// const PurchaseRequests = require('../models/purchaseRequests')
 const ItemFulfillments = require('../models/itemFulfillments-model')



router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)



router.get('/itemFulfillmentList', async (req, res) => {


    var data = []
    try {
        data =  await ItemFulfillments.find({})
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

router.get('/itemfulfillmentForm', (req, res) => {
    let route = "pages/itemFulfillmentForm"
    let listName = "Purchase Request"


    axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=itemRecipt', {
        firstName: 'Fred',
        lastName: 'Flintstone'
    })
        .then(function (response) {
            console.log(response.data[0]);

            let tableData = response.data

            breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
            res.render('index', { route, listName, breadcrumbs, tableData })
        })
        .catch(function (error) {
            console.log("erorr", error);
        });

})

module.exports = router