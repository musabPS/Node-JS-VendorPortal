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

const PurchaseRequests = require('../models/purchaseRequests-model')



router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

const authCheck = (req, res, next) => {
    if (! req.session.user_id) {
      return res.redirect('/login')
  
    }
     next()
  }


router.get('/purchaseRequestForm&id=:id',authCheck, async (req, res) => {
    console.log("checkparam", req.params)

    var { id } = req.params
    var data = []
    var query = { internalId: id };
    try {
        console.log("id", parseInt(id))
        data = await PurchaseRequests.findOne({ internalId: parseInt(id) })
        console.log("data", data)

        //data.purchaseRequests = purchaseRequests
    }
    catch (e) {
        console.log(e)
    }
    let route = "pages/purchaseRequestForm"
    let listName = "Payment List"

    let tranId = data.poNumber
    let location = data.location
    let date = data.date
    date = moment(new Date(date)).format('MM-DD-YYYY')

    breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
    res.render('index', { route, listName, breadcrumbs, tranId, location, date })
})
router.get('/purchaseRequestForm/itemdetail&id=:id',(req, res) => {

    console.log("chddd", req.params)


    let route = "pages/purchaseRequestForm"
    let listName = "Purchase Request"
    var { id } = req.params

    console.log("chd", id)
    axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=purchaseRequest&internalid=' + id, {
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

router.post('/purchaseRequestForm', authCheck,async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    var { id } = req.params

    let route = "pages/purchaseRequestForm"
    let listName = "Payment List"
    const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff"
    request({
        url, json: true,
        method: "POST",
        body: req.body,
        headers: {
            "User-Agent": "Mozilla/5.0",
        }
    },
        (error, response, body) => {
            if (error) {
                console.log('Unable to connect to suitelet', body)
            }
            else {
                console.log(`response ${response}`)
            }
        })
        var query = { internalId: id };
    
        res.redirect('/purchaseRequestForm&id='+req.body.pointernalid)

})


// router.get('/paymentList', (req, res) => {
//     let route = "pages/paymentsTable"
//     let listName = "Payment List"
//     breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
//     res.render('index', { route, listName, breadcrumbs })
// })


router.get('/purchaseRequestList',authCheck, async (req, res) => {
    var data = []
    try {
        data = await PurchaseRequests.find({vendorInternalId:req.session.user_id}).lean()
        console.log(req.session.user_id)
        //data.purchaseRequests = purchaseRequests
    }
    catch (e) {
        console.log(e)
    }
    // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/table"
    // console.log("trandata",data)
    res.render('index', { route, data, data, moment: moment })
})


router.get('/paymentList2',authCheck, async (req, res) => {
    var data = []

    // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/paymentsTable"
    // console.log("trandata",data)
    res.render('index', { route, data, data, moment: moment })
})


module.exports = router