const express = require('express')
require('../models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');
var moment = require('moment');
var where = require("lodash.where");
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
    let peymentDataarray=[]
    let subList=[]


    try {
        data =  await payments.find({}).sort({date: -1})
        console.log("check",data[0])
        var filterData={}


        for(var i=0; i <data.length;  i++)
        {

            subList =  where(data, {"billPaymentNumber": data[i].billPaymentNumber})

            peymentDataarray.push({
                'RecordID':i,
                'Check#': data[i].billPaymentNumber,
                'Date': moment(data[i].date).format("MM-DD-YYYY") ,
                'CheckAmount': data[i].amount,
                'Orders':subList,
                'Status' :4
              })

            i+=parseInt(subList.length)
        }

        console.log("checkData",peymentDataarray[0])


peymentDataarray= JSON.stringify(peymentDataarray)
     
        let route = "pages/paymentsTable"
        let listName = "Payment List"
        let breadcrumb = { name1 : "Payments List", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
        res.render('index', { route, listName, breadcrumb, data,moment,peymentDataarray,moment})
    }
    catch (e) {
       console.log(e)
    }




   
})

module.exports = router

