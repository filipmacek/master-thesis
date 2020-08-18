const mongoose = require('mongoose')

const schema = mongoose.Schema({
    routeId:String,
    dataPoints: Number,
    startLocationVisited: Boolean,
    routeFinished: Boolean,
    distance:Number,
    time:Number,
})

module.exports = mongoose.model("RouteStatus",schema)