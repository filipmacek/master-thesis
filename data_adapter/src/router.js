const express = require('express')
const Queue = require("bull")
const router = express.Router()
const Coordinate = require('./models/Coordinate')
const worker = require('./workers/RouteWorker')
const RouteStatus = require('./models/RouteStatus')


const routeStatusQueue = new Queue('route status processing','redis://redis:6379')
routeStatusQueue.process(async (job) =>{
    return  await worker.processData(job.data)
})




router.post('/route/:routeId',async (req,res)=>{
    try {
        const coordinate = new Coordinate({
            routeId: req.params.routeId,
            timestamp: req.body.timestamp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            index: parseInt(req.body.index)
        })
        routeStatusQueue.add({coordinate:coordinate,routeId:req.params.routeId})
        coordinate.save()
        res.status(200)
        res.send(coordinate)

    }catch (e) {
        res.status(404)
        res.send("Coordinates has not been published")
        
    }
})

router.post('/route/:routeId/clear',async (req,res)=>{
    try{
        Coordinate.deleteMany({routeId:req.params.routeId},(err)=>{
            if(err) console.log("Error ",err)
            console.log(`Data for route with id:${req.params.routeId}`)})
        // Update Route status
        const routeStatus = await RouteStatus.findOne({routeId:req.params.routeId})
        routeStatus.dataPoints=0
        routeStatus.startLocationVisited = false
        routeStatus.routeFinished = false
        routeStatus.distance = 0
        routeStatus.time = 0
        await routeStatus.save()
        res.status(200)
        res.send()

    }catch (e) {
       res.status(404)
       res.send("Data has NOT been cleared")
    }
})

router.get('/route/:routeId',async (req,res)=> {
    try{
        const routes = await Coordinate.find({routeId:req.params.routeId})
        res.status(200)
        res.send(routes)

    }catch {
        res.status(404)
        res.send("Error")
    }
})
router.get('/route/status/:routeId',async (req,res)=> {
    res.status(200)
    const routeStatus = await RouteStatus.findOne({routeId:req.params.routeId})
    res.send(routeStatus)
})

router.get('/ready',async (req,res)=>{
    res.json({status:"Ready"})
})
module.exports = router