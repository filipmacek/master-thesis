const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = 3000
const router = require('./router')
var uri = 'mongodb://admin:password@mongo:27017/movement'
const init = require('./service/init')

mongoose.connect(uri,{useUnifiedTopology:true,useNewUrlParser:true})
    .then(() =>{
        console.log("Connection has been established")
        // Init route
        init.initRoutes()


        const app=express()
        app.use(bodyParser.json())
        app.use('/api',router)
        app.listen(port,()=>{
            console.log("Server has started")
        })
    })


