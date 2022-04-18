const mongoose = require("mongoose")

const itemFulfillmentSchema = new mongoose.Schema({
    internalId: {
        type: Number,
        trim:true,
        required : true
    },
    invoiceNumber: {
        type: String,
        trim:true
    },
    ifNumber:{
        type:String,
        required:true,
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

const ItemFulfillment = mongoose.model('ItemFulfillment', itemFulfillmentSchema)

module.exports = ItemFulfillment