const Route = require('../models/Route')
const RouteStatus = require('../models/RouteStatus')
const Coordinate = require('../models/Coordinate')
const timeStamp  = require('../data/Timestamp')


const THRESHOLD = 30
let lastCoordinate = null

const processData = async (data) => {
    console.log("Process coordinate")
    console.log(data)

    const route = await Route.findOne({routeId: data.routeId})
    const routeStatus = await RouteStatus.findOne({routeId:data.routeId})
    const coordinate = data.coordinate



    // Check if user visited start location,
    // if he has dont check distance
    if(routeStatus.startLocationVisited === false){
        const distance = getDistance(route.startLocationLatitude,route.startLocationLongitude,
                                    coordinate.latitude,coordinate.longitude)
        if(distance <= THRESHOLD){
            routeStatus.startLocationVisited = true
            routeStatus.save()
            lastCoordinate = coordinate
        }

    }else if (routeStatus.routeFinished === false)
    {
        const distance = getDistance(route.endLocationLatitude,route.endLocationLongitude,
                                     coordinate.latitude,coordinate.longitude)
        if(distance <= THRESHOLD){
            routeStatus.routeFinished = true
            routeStatus.save()
        }

        // Distance
        const progressDistance = getDistance(lastCoordinate.latitude,lastCoordinate.longitude,
                                             coordinate.latitude,coordinate.longitude)
        routeStatus.distance = routeStatus.distance + progressDistance
        //Time
        const timeA= new timeStamp.Timestamp(lastCoordinate.timestamp)
        const timeB = new timeStamp.Timestamp(coordinate.timestamp)
        routeStatus.time = routeStatus.time + timeA.subSeconds(timeB)
        lastCoordinate = coordinate
    }
    // //Data Points
    routeStatus.dataPoints = routeStatus.dataPoints+1
    // Save
    routeStatus.save()

}
function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
        return 0;
    }
    else {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344*1000
        return dist;
    }
}

function getTime(t1,t2){



}


module.exports = {
    processData,
    getDistance
}