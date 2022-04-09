const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const PurchaseRequests = require('../models/purchaseRequests')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json());
app.use(router)

router.get('/purchaseRequests', async (req, res) => {
    try {
        const db = {}
        try {
            const purchaseRequests = await PurchaseRequests.find({})
            db.purchaseRequests = purchaseRequests
        }
        catch (ex) {
            console.log("Error In Purchase Requests database call", ex)
        }
        res.render('transactionTable', { db })

    }
    catch (ex) {
        console.log("Error In Purchase Requests Route", ex)
    }


})