const mongoose = require('mongoose')

const schema = mongoose.Schema({
    routeId:String,
    maker:String,
    taker:String,
    startLocation:String,
    endLocation:String,
    isStarted:Boolean,
    isFinished:Boolean
})
module.exports = mongoose.model("Route",schema)