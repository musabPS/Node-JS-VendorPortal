const mongoose = require("mongoose")

const billPaymentSchema = new mongoose.Schema({
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
   
     date:{
         type: Date
     },
     amount:{
         type:Number,
         default:0,
         min:0,
     },
     billPaymentNumber:{
        type:String,
        trim:true,
    },
    billNumber:{
        type:String,
    },
    billAmount:{
        type:Number,
    },
     syncStatus:{
         type:Number,
         trim:true
     },
     lineItems:{
         type:Array
     }
})

const billPayments = mongoose.model('billpayments', billPaymentSchema)

module.exports = billPayments 