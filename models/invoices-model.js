const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    billNo: {
        type: String,
        trim:true
    },
    poNumber:{
        type:String,
        trim:true
    },
    date:{
        type: Date
    },
    poQuantity:{
        type:Number,
        default:0,
        min:0
    },
    poAmount:{
        type:Number,
        default:0,
        min:0,
    },
    billQuantity:{
        type:Number,
        default:0,
        min:0
    },
    billAmount:{
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
    vendorName:{
        type:String,
        trim:true
    },
    vendorInternalId:{
        type:Number
    }
    
})

const Invoice = mongoose.model('Invoice', invoiceSchema)

module.exports = Invoice