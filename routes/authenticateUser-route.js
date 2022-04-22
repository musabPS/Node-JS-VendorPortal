const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
var request = require('request')
var session = require('express-session')
const bodyParser = require('body-parser');
const app = express()

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, './views'))
app.use('/', express.static(path.join(__dirname, './public')))
const router = express.Router()
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

app.use(session({
  secret: "key",
}))

const authCheck = (req, res, next) => {
  if (!req.session.user_id) {
    return res.redirect('/login')

  }
  next()
}

router.get('/login', (req, res) => {

  let route = "pages/login"
  res.render(route)
})

router.post('/login', (req, res) => {

  req.body.type = 'login'
  
  const url = "https://tstdrv925863.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=700&deploy=1&compid=TSTDRV925863&h=dfb1a0d8daae184c8cff"
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
      else {

        req.session.user_id = response.body
        console.log("check0",response.body)

        res.redirect("/")
      }

    })


})

module.exports = router