const mongoose = require("mongoose")

const purchaseRequestSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    vendorInternalId: {
        type: Number,
        trim:true,
        required : true
    },
    vendorName: {
        type: String,
    },
    vendorName: {
        type: String,
    },
    vendorAccept : { 
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
         type:Number,
         trim:true
     },
     lineItems:{
         type:Array
     }
})

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema)

module.exports = PurchaseRequest 