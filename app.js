const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// User Hash
var userHash = {};

io.on('connection', function(socket) {
  console.log("A user has connected");

  // On Connected Custom Event (Save connected user and notify others)
  socket.on("connected", function (name) {
    var msg = name + " is connected.";
    userHash[socket.id] = name;
    io.sockets.emit("publish", {value: msg});
    console.log(msg);
  });

  // Unity Messages

  // Test Message
  socket.on("message", function(data) {
    console.log("Message recieved!");
    console.log("Value: " + data.value);
    io.sockets.emit("message", {value:data.value});
  });

  // Number of Floors
  socket.on("NumberOfFloors", function(data) {
    console.log("Message recieved!");
    console.log("Value: " + data.value);
    io.sockets.emit("NumberOfFloors", {value:data.value});
  });

  // Floor Height
  socket.on("FloorHeight", function(data) {
    console.log("Message recieved!");
    console.log("Value: " + data.value);
    io.sockets.emit("FloorHeight", {value:data.value});
  });

  // Floor Depth
  socket.on("FloorDepth", function(data) {
    console.log("Message recieved!");
    console.log("Value: " + data.value);
    io.sockets.emit("FloorDepth", {value:data.value});
  });

  // Floor Wifth
  socket.on("FloorWidth", function(data) {
    console.log("Message recieved!");
    console.log("Value: " + data.value);
    io.sockets.emit("FloorWidth", {value:data.value});
  });


  // Relayed messsage from GH
  socket.on("gh", function(data) {
    console.log("Cube data received.");
    console.log(data.length);
    var sendingData = [];
    for (var i = 0; i < data.length; i++){
      var meshData = data[i];
      sendingData.push(meshData.mesh.toString("base64"));
    }
    io.sockets.emit("unity",{"meshes":sendingData});
  });

  // socket.on("gh", function (data) {
  //   console.log(data.length);
  //   var sendingData = [];
  //   for (var i = 0; i < data.length; i++){
  //     var meshData = data[i];
  //     sendingData.push(meshData.mesh.toString("base64"));
  //   }
  //   io.sockets.emit("unity",{"meshes":sendingData});
  // });

  // Custom Event to Send Message
  socket.on("publishing", function (data) {
    console.log("published: " + data.value);
    io.sockets.emit("publish", {value:data.value});
    io.sockets.emit("test", [{mesh:"ABC"},{mesh:"123"}]);
  });


});

http.listen(port, function() {
  console.log('Listening on port 3000...');
});
