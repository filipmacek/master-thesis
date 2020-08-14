var Web3 = require('web3')
const metadata=require("./ContractMetaData");
const Route = require('../models/Route')

const  initRoutes =async () =>{
    console.log("Init routes from ETH Smart Contract")
    const web3 = new Web3(new Web3.providers.HttpProvider("https://kovan.infura.io/v3/42f42a255e264be7a6bc8373c4308e96"))
    const contract = await new web3.eth.Contract(metadata.abi,metadata.address)

    contract.methods.getRoutesCount().call().then(value=>{
        var i;
        for(i=0;i<value;i++){
            contract.methods.routes(i).call().then(value=>{
            try {
                const route = new Route({
                    routeId: value.routeId,
                    maker: value.maker,
                    taker: value.taker,
                    startLocation: value.startLocation,
                    endLocation: value.endLocation,
                    isStarted: value.isStarted,
                    isFinished: value.isFinished
                })
                 route.save()
            }catch{
                console.log("Error importing route")
            }})
        }
    })
}

module.exports = {
    initRoutes
}
