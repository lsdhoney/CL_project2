let express = require("express");
let app = express();
app.use('/', express.static('public'));
app.use(express.json());

let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});


///////socket codes//////
let io = require('socket.io');
const { isBuffer } = require("util");
io = new io.Server(server);


io.sockets.on('connection', function(socket) {
    console.log("We have a new client: " + socket.id);
    
    //sending visitor count to client   
        let liveCount = io.engine.clientsCount;
        console.log(liveCount);
        io.emit("liveCount", liveCount);
    
    

    //Listen for mousepos data from this client
    socket.on('data', function(data) {
        console.log("Received mousePos");
        console.log(data);
        //Send a response to all clients, including this one
        io.sockets.emit('data', data);

    });

    //listen for msg data from client
    socket.on('msg', function(msgdata) {
        console.log("Received a 'msg' event");
        console.log(msgdata);
        //Send a response to all clients, including this one
         io.sockets.emit('msg', msgdata);
    });
   

    //Listen for this client to disconnect
    socket.on('disconnect', function() {
        console.log("A client has disconnected: " + socket.id);
        let liveCount = io.engine.clientsCount;
        console.log(liveCount);
        io.emit("liveCount", liveCount);
    });
});