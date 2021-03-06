const mongoose = require('mongoose')

const schema = mongoose.Schema({
    routeId:String,
    maker:String,
    taker:String,
    startLocationLatitude: Number,
    startLocationLongitude:Number,
    endLocationLatitude:Number,
    endLocationLongitude:Number,
    isStarted:Boolean,
    isFinished:Boolean,
    isCompleted:Boolean,
    description: String
})
module.exports = mongoose.model("Route",schema)