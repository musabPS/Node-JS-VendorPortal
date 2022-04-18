module.exports = {
    libs: function () {
        const express = require('express')
        require('./models/mongoose')
        const path = require('path')
        const mongoose = require('mongoose')
        const methodOverride = require('method-override')
        const bodyParser = require('body-parser');
        const axios = require('axios');
        var nsrestlet = require('nsrestlet');
        var moment = require('moment');

        const app = express()

        app.use(express.urlencoded({ extended: true }))
        app.set('view engine', 'ejs')
        app.set('views', path.join(__dirname, './views'))


        app.use('/', express.static(path.join(__dirname, './public')))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json());
        app.use(express.urlencoded({ extended: true }))
        app.use(methodOverride('_method'))

    }
}




