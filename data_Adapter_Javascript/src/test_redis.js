var redis = require("redis"),
    client = redis.createClient();
client.on("error", function (err) {
    console.log(err);
});
client.set("akey", "string val", redis.print);
client.get("akey", redis.print);