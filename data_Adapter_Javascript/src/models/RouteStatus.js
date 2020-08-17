const mongoose = require('mongoose')

const schema = mongoose.Schema({
    routeId:String,
    dataPoints: Number,
    startLocationVisited: Boolean,
    routeFinished: Boolean,
    distanceKm:Number,
    distanceM:Number,
    time:Number,
    averageSpeedKmh: Number,
    averageSpeedMs:Number,
    user_status:Boolean
})

module.exports = mongoose.model("RouteStatus",schema)