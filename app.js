const express = require('express')
require('./models/mongoose')
const path = require('path')
const mongoose = require('mongoose')
var request = require('request')
var session = require('express-session')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use('/', express.static(path.join(__dirname, './public')))



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



app.use(purchaseRequestRouter)

app.use(itemFulfillmentRouter)

app.use(invoiceRouter)

app.use(billRouter)

app.use(paymentRouter)

app.use(updateDb)




app.get('/login', (req, res) => {

  let route = "pages/login"
  res.render(route)
})

app.post('/login', (req, res) => {

  console.log("check logindata",req.body)
  req.body.type='login'

  const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff"
  request({
      url, json: true,
      method: "POST",
      body: req.body,
      headers: {
          "contentType" : "application/json",
          
      }
  },
      (error, response, body) => {
          if (error) {
              console.log('Unable to connect to suitelet', body)
           }
           else {

             req.session.user_id=response.body
              console.log("sessions",req.session.user_id)

            res.redirect("/") 
          }

      })


})

app.get('/', authCheck, (req, res) => {

  console.log("sesssiondashboard",req.session.user_id)

  let route = "partials/_content"
  res.render("index", { route })

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

