var Queue = require("bull")

var routeStatusQueue= new Queue("route status calculation",'redis://127.0.0.1:6379')

const data = {
    email: 'userid@domain.com'
};

const options = {
    delay: 6000, // 1 min in ms
    attempts: 2
};
setInterval(function (){
    routeStatusQueue.add(data,options)
},2000)


routeStatusQueue.process( async job => {
    return await Data_Process(job.data.email)
})

function Data_Process(email) {
    return new Promise((resolve,reject) =>{
        console.log(email)
        resolve(true)
    })
}