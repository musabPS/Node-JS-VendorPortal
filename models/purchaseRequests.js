const mongoose = require("mongoose")

const purchaseRequestSchema = new mongoose.Schema({
    internaid: {
        type: Number,
        trim:true,
        required : true
    },
    invoiceNumber: {
        type: String,
        trim:true
    },
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
     status:{
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