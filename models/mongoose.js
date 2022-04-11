const mongoose = require('mongoose')
//const validator= require('validator')
const mongodbLocal = 'mongodb://localhost:27017/vendor-portal-app'
//const mongodbGcp =  'mongodb://jasim:jasim123@35.240.200.56:27017/admin'

const mongodbAtlas = 'mongodb+srv://pointstar:poinstar123@cluster0.nenzn.mongodb.net/vendor-portal-app?retryWrites=true&w=majority'

mongoose.connect( mongodbAtlas ,{
    useNewUrlParser:true,

}).then(()=>{
    console.log("Mongo connection open")
})
.catch(err=>{
    console.log(err)
})
var db = mongoose.connection
db.on('error',console.error.bind(console,'MongoDB connection error:'))

