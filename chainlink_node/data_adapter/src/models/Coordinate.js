const mongoose = require('mongoose')

const schema = mongoose.Schema({
    routeId: String,
    timestamp: String,
    latitude: String,
    longitude: String,
    index:Number
})


module.exports = mongoose.model("Coordinate",schema)
