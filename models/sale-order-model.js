const mongoose = require("mongoose")

const saleOrderSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    soNumber:{
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
     billingAddress:{
        type:String
    },
    shippingAddress:{
         type:String
     },
     status:{
         type:String,
         trim:true
     },
     customerName:{
        type:String,
        trim:true
    },
    customerInternalId:{
        type:String,
        trim:true
    },
    salePersonId:{
        type:String,
        trim:true
    },
    salePersonName:{
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

const saleOrder = mongoose.model('SaleOrder', saleOrderSchema)

module.exports = saleOrder 