const mongoose = require("mongoose")

const configrationSchema = new mongoose.Schema({
    companyId: {
        type: Number,
        trim:true,
        required : true
    },
    comapnyName:{
         type:String,
     },
     externalSuiteletURLProd:{
        type:String,
    },
    externalSuiteletURLSB1:{
        type:String,
    },
    netsuiteAccount:{
        type:String,
    }
     

})

const Configration = mongoose.model('Configration', configrationSchema)

module.exports = Configration 