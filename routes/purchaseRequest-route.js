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
const configration = require('../models/configration-model')




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
        console.log("mongo data", data)

      


        let route = "pages/purchaseRequestForm"
        let listName = "Payment List"
        let breadcrumb = { name1 : "Purchase Request List", link1 : "/purchaseRequestList", name2 : ">Purchase Request Form", link2 : "#",name3 : "Home>", link3 : "/" }
        

        let tranId = data.poNumber
        let location = data.location
        let date = data.date
        let status = data.status
        
        date = moment(new Date(date)).format('MM-DD-YYYY')
    
        breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
        res.render('index', { route, listName, breadcrumb, tranId, location, date, status })

        //data.purchaseRequests = purchaseRequests
    }
    catch (e) {
        console.log("Erorr",e)
    }
   
})
router.get('/purchaseRequestForm/itemdetail&id=:id',async (req, res) => {

    console.log("chddd", req.params)


    let route = "pages/purchaseRequestForm"
    let listName = "Purchase Request"
    
    let breadcrumb = { name1 : "", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/"}

    var { id } = req.params 

    console.log("chd", id)

    configrationData = await configration.findOne({ companyId: 1 })
    

    axios.get(configrationData.externalSuiteletURLProd+'&type=purchaseRequest&internalid=' + id, {
    })
        .then(function (response) {
            // console.log(response.data[0]); 
 
            let tableData = response.data
            let tranId = response.data[0].values["GROUP(tranid)"]
            let location = response.data[0].values["GROUP(locationnohierarchy)"]
            let date = response.data[0].values["GROUP(trandate)"]
            res.send(tableData)

          //  res.status(200).send((tableData,breadcrumb));
            //  res.render('index', {route,listName ,breadcrumbs,tableData,tranId,location,date}) 
        })
        .catch(function (error) {
            console.log("erorr", error);
        });

})

router.post('/purchaseRequestForm',async (req, res) => {

    
    console.log(req.body)
    console.log(req.params) 
    var { id } = req.params

   

    // let route = "pages/purchaseRequestForm"
    // let listName = "Payment List"
    configrationData = await configration.findOne({ companyId: 1 })
    const url = configrationData.externalSuiteletURLProd
    request({
        url, json: true,
        method: "POST",
        body: req.body,
        headers: {
            "User-Agent": "Mozilla/5.0",
        },
        timeout: 5000,
    },
        (error, response, body) => {
            if (error) {
                console.log('Unable to connect to suitelet', body)
            }
            else {
                console.log(response.body)
                res.send(response.body)
            }
        })
        var query = { internalId: id };
    
        

})


// router.get('/paymentList', (req, res) => {
//     let route = "pages/paymentsTable"
//     let listName = "Payment List"
//     breadcrumbs = { "noBreadcrumbs": { name: "", link: "" } };
//     res.render('index', { route, listName, breadcrumbs })
// })


router.get('/purchaseRequestList', async (req, res) => {
    var data = []
    var testData=[]
    try 
    {
        data = await PurchaseRequests.find({vendorInternalId:req.session.user_id}).sort({date: -1}).lean()
       // console.log(req.session.user_id)
        let route = "pages/purchaseRequestTable"
        let breadcrumb = { name1 : "Purchase Request List", link1 : "/purchaseRequestList", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
       
        res.render('index', { route, data, data, breadcrumb, moment: moment }) 
      
    }
    catch (e) {
        console.log(e)
    }
   
})


router.get('/purchaseRequestListAjax', async (req, res) => {
    var data = []
    try 
    {

        data = await PurchaseRequests.find({vendorInternalId:944}).sort({date: -1}).lean()
        console.log(req.session.user_id)
        // console.log(data);

        var finalData=[]
        var dataCollection={}
        var recordsTotal=data.length
        var recordsFiltered = data.length
        const statusObject=
        {

            "Pending Bill" : 1,
            "Pending Receipt" : 2,
            "Pending Supervisor Approval" : 3,
            "Fully Billed" : 4,
            "Partially Received": 5,
            "Pending Billing/Partially Received" : 6,
            "Closed" : 7
        }
// console.log("data[i].status",statusObject[data[0].status])
        for(var i=0; i<data.length; i++){
            finalData.push({
                RecordID   :   i,
                poNumber   : '<a href=/purchaseRequestForm&id='+data[i].internalId+' > '+data[i].poNumber+'  </a> ' ,
                date   : moment(data[i].date).format("MM-DD-YY") ,
                quantity   : data[i].quantity,
                amount     : data[i].amount,
                vendorAcceptQuantity : data[i].vendorAcceptQuantity,
                status     : statusObject[data[i].status]
            })
        }
       
        dataCollection = {
            recordsTotal : recordsTotal,
            recordsFiltered : recordsFiltered,
            data : finalData,
            breadcrumb : { name1 : "Item Fulfillment List", link1 : "#", name2 : "Item Fulfillment List", link2 : "#" }
        }

       // console.log(data);


       

        res.send(dataCollection) 
      
    }
    catch (e) {
        console.log(e)
    }
   
})




router.get('/paymentList2',authCheck, async (req, res) => {
    var data = []

    // app.set('views', path.join(__dirname,'./demo7/views'))
    let route = "pages/paymentsTable"
    
    let breadcrumb = { name1 : "Payments List", link1 : "#", name2 : "", link2 : "#", name3 : "Home>", link3 : "/" }
    // console.log("trandata",data)
    res.render('index', { route, data, breadcrumb, data, moment: moment })
})


module.exports = router

