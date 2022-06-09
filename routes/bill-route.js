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
// const Invoices = require('./models/invoices')
const configration = require('../models/configration-model')


router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

router.get('/billViewForm', async (req, res) => {
    let route = "pages/BeforeCreateBill_View"
    let listName = "Purchase Request"

    configrationData = await configration.findOne({ companyId: 1 })

    axios.get(configrationData.externalSuiteletURLProd+'&type=itemRecipt', {
        firstName: 'Fred',
        lastName: 'Flintstone'
    })
        .then(function (response) {
            console.log(response.data[0]);

            let tableData = response.data
            
            // let tranId=response.data[0].values["GROUP(tranid)"]
            // let location=response.data[0].values["GROUP(locationnohierarchy)"]
            // let date=response.data[0].values["GROUP(trandate)"]

            let breadcrumb = { name1 : "", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
            res.render('index', { route, listName, breadcrumb, tableData })
        })
        .catch(function (error) {
            console.log("erorr", error);
        });

})

module.exports = router