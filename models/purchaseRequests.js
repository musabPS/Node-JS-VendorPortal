const mongoose = require("mongoose")

const purchaseRequestSchema = new mongoose.Schema({
    poNumber:{
         type:String,
         required:true,
         trim:true
     },
     date:{
         type: Date
     },
     quantity:{
         type:Number,
         default:0,
         min:0
     },
     amount:{
         type:Number,
         default:0,
         min:0,
     },
     location:{
         type:String
     },
     approvalStatus:{
         type:String,
         trim:true
     },
     syncStatus:{
         type:String,
         trim:true
     },
     lineItems:{
         type:Array
     }
})

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema)

module.exports = PurchaseRequest