const express = require('express')
require('./models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const bodyParser = require('body-parser');
const axios = require('axios');
var nsrestlet = require('nsrestlet');

// console.log(data)
let publicDirectoryPath = path.join(__dirname, './demo7/public')

const app = express()


const accountSettings = {
  accountId: "TSTDRV925863",
  tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
  tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
  consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
  consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6"
};

const userid = 1603

app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views')) 
app.use('/', express.static(path.join(__dirname, './public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
// app.use(express.static(publicDirectoryPath)) 


const PurchaseRequests = require('./models/purchaseRequests')
const ItemFulfillments = require('./models/itemFulfillments')
const Invoices = require('./models/invoices')

app.get('/',(req,res)=>{
  breadcrumbs = {"noBreadcrumbs" : {name:"",link:""}};
  let route = "partials/_content"

  res.render('index',{route,breadcrumbs})
})
app.get('/purchase-requests', async (req,res)=>{
  var data = []
  try {
    data = await PurchaseRequests.find({})
    console.log(data)
    //data.purchaseRequests = purchaseRequests
}
catch (e) {
    console.log(e)
}
  // app.set('views', path.join(__dirname,'./demo7/views'))
   let route = "pages/table"
  // console.log("trandata",data)
   res.render('index', {route,data}) 
})


app.get('/purchaseRequestList', (req,res)=>{
  let route = "pages/transactionTable"
 let listName ="Purchase Request"
   breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
  res.render('index', {route,listName ,breadcrumbs}) 
})

app.get('/ItemFulfillmentList', (req,res)=>{
  let route = "pages/transactionTable"
 let listName ="ItemFulfillment"
   breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
  res.render('index', {route,listName ,breadcrumbs}) 
})
app.get('/invoiceList', (req,res)=>{
  let route = "pages/transactionTable"
 let listName ="Invoice"
   breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
  res.render('index', {route,listName ,breadcrumbs}) 
})
app.get('/paymentList', (req,res)=>{
  let route = "pages/transactionTable"
 let listName ="Payment List"
   breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
  res.render('index', {route,listName ,breadcrumbs}) 
})
app.get('/purchaseRequestForm', (req,res)=>{
   let route = "pages/purchaseRequestForm"
   let listName ="Purchase Request"

   axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=purchaseRequest', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response.data[0]);
    
    let tableData=response.data
    let tranId=response.data[0].values["GROUP(tranid)"]
    let location=response.data[0].values["GROUP(locationnohierarchy)"]
    let date=response.data[0].values["GROUP(trandate)"]
    breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
    res.render('index', {route,listName ,breadcrumbs,tableData,tranId,location,date}) 
  })
  .catch(function (error) {
    console.log("erorr",error);
  });

  
})
app.get('/itemfulfilmentForm', (req,res)=>{
  let route = "pages/itemFulfillmentForm"
 let listName ="Purchase Request"
 

 axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=itemRecipt', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response.data[0]);
    
    let tableData=response.data
    // let tranId=response.data[0].values["GROUP(tranid)"]
    // let location=response.data[0].values["GROUP(locationnohierarchy)"]
    // let date=response.data[0].values["GROUP(trandate)"]
    breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
    res.render('index', {route,listName ,breadcrumbs,tableData}) 
  })
  .catch(function (error) {
    console.log("erorr",error);
  });


 
})
app.get('/billViewForm', (req,res)=>{
  let route = "pages/BeforeCreateBill_View"
 let listName ="Purchase Request"
   breadcrumbs={"noBreadcrumbs" : {name:"",link:""}};
  res.render('index', {route,listName ,breadcrumbs}) 
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})

