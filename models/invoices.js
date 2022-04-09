const mongoose = require("mongoose")

const invoiceSchema = new mongoose.Schema({
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

const Invoice = mongoose.model('Product', invoiceSchema)

module.exports = Invoice