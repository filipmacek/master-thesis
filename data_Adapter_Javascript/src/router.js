const express = require('express')
const router = express.Router()
const Coordinate = require('./models/Coordinates')



router.post('/route/:routeId',async (req,res)=>{
    try {
        const coordinate = new Coordinate({
            routeId: req.params.routeId,
            timestamp: req.body.timestamp,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            index: parseInt(req.body.index)
        })
        await coordinate.save()
        res.status(200)
        res.send(coordinate)

    }catch (e) {
        res.status(404)
        res.send("Coordinates has not been published")
        
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
router.get('/route/:routeId/status',async (req,res)=> {
    res.status(200)
    res.json({status:"true"})
})

router.get('/ready',async (req,res)=>{
    res.json({status:"Ready"})
})
module.exports = router