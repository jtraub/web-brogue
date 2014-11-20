var wsPort = 8080;
var WebSocketServer = require("ws").Server;
var wss = new WebSocketServer({port: wsPort});

console.log("ws server listening on port %s", wsPort);

var brogue = require("./brogue");

var router = require("./router");
router.recieve.registerHandlers({
    "new" : brogue.spawn
});

wss.on("connection", function(ws) {
        
    var brogueSocket = new brogue.Socket(ws, router);
    
    ws.on("message", function(rawMsg){
       var msg = router.recieve.prepareData(rawMsg);
       router.recieve.route(msg);
       console.log("recieved %s", msg);
    });
    
});