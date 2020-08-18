var Web3 = require('web3')
const metadata=require("./ContractMetaData");
const Route = require('../models/Route')
const RouteStatus = require('../models/RouteStatus')


const  initRoutes =async () =>{
    console.log("Init routes from ETH Smart Contract")
    const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/42f42a255e264be7a6bc8373c4308e96"))
    const contract = await new web3.eth.Contract(metadata.abi,metadata.address)

    contract.methods.getRoutesCount().call().then((value) =>{
        var i;
        for(i=0;i<value;i++){
            contract.methods.routes(i).call().then( async value=>{
            try {
                const route = new Route({
                    routeId: value.routeId,
                    maker: value.maker,
                    taker: value.taker,
                    startLocationLatitude: parseFloat(getCoordinateFromString(value.startLocation,1)),
                    startLocationLongitude: parseFloat(getCoordinateFromString(value.startLocation,2)),
                    endLocationLatitude: parseFloat(getCoordinateFromString(value.endLocation,1)),
                    endLocationLongitude: parseFloat(getCoordinateFromString(value.endLocation,2)),
                    isStarted: value.isStarted,
                    isFinished: value.isFinished
                })
                const routeStatus = new RouteStatus({
                    routeId: value.routeId,
                    dataPoints: 0,
                    startLocationVisited:false,
                    routeFinished: false,
                    distance:0,
                    time:0
                })
                const routeCount = await Route.find({routeId:value.routeId}).countDocuments()
                const routeStatusCount = await RouteStatus.find({routeId:value.routeId}).countDocuments()
                 if(routeCount>0){}else{route.save()}
                 if(routeStatusCount>0){}else {routeStatus.save()}

            }catch{
                console.log("Error importing route")
            }})
        }
    })
}

const getCoordinateFromString = (s,index) =>{
    var string = ''
    if(index === 1){
        string =s.substring(0,s.indexOf(','))
        return string
    }else{
        string = s.substring(s.indexOf(',')+1,s.length)
        if(string[0] === ' ') string = string.substring(1,string.length)
        return string
    }

}



module.exports = {
    initRoutes
}
