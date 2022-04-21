const express = require('express')
require('./models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
var request = require('request')
var session = require('express-session')
const axios = require('axios');
const app = express()

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use('/', express.static(path.join(__dirname, './public')))

const authenticateUserRouter = require('./routes/authenticateUser-route')

const purchaseRequestRouter = require('./routes/purchaseRequest-route')

const itemFulfillmentRouter = require('./routes/itemfulfillment-route')

const invoiceRouter = require('./routes/invoice-route')

const billRouter = require('./routes/bill-route')

const paymentRouter = require('./routes/payment-route')

const updateDb = require('./routes/dbUpdate-route')



app.use(session({
  secret: "keyy",
}))
const authCheck = (req, res, next) => {
  if (! req.session.user_id) {
    return res.redirect('/login')

  }
   next()
}


app.use(authenticateUserRouter)

app.use(purchaseRequestRouter)

app.use(itemFulfillmentRouter)

app.use(invoiceRouter)

app.use(billRouter)

app.use(paymentRouter)

app.use(updateDb)



app.get('/', authCheck, (req, res) => {

  var tableData;
  console.log("session id",req.session.user_id)

  axios.get('https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff&type=dashboard')
      .then(function (response) {
          console.log(response.data);

           tableData = JSON.parse(response.data)
           let route = "partials/_content" 
           res.render("index", { route, tableData })
  
      }) 
      .catch(function (error) {
          console.log("erorr", error);
      });

 

})
 


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Serving on port ${port}`)
})






// const accountSettings = {
//   accountId: "TSTDRV925863",
//   tokenKey: "6aa795846f7c09f0389b64ee9c09b7a094ec7122ba1f7dc84bbd6dbe3ab1cee3",
//   tokenSecret: "2e4c10d0f4f04b4677dd622bbe30febd095445b4c3be6e76cae6674ca8491014",
//   consumerKey: "a00aa59a331a17fb8e80b0c19f1fc670059d88b9515820f56cf075599363032c",
//   consumerSecret: "2b25e96ffe13ea48e93f2efb06b0e7d2eb7b417fd3a3a84c68fbd5a393b2f6c6"
// };

// const userid = 1603

//let publicDirectoryPath = path.join(__dirname, './demo7/public')

