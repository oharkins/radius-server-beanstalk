const radius = require('radius');
const dgram = require("dgram");
const wifi_users = require('./table_utils')
require ('dotenv').config();

const secret = process.env.SECRET;
const server = dgram.createSocket("udp4");
 

server.on("message", async function (msg, rinfo) {
  var code, username, password, packet;
  packet = radius.decode({ packet: msg, secret: secret });

  if (packet.code != 'Access-Request') {
    console.log('unknown packet type: ', packet.code);
    return;
  }

  switch (packet.code){
    case 'Access-Request':
      username = packet.attributes['User-Name'];
      password = packet.attributes['User-Password'];
      console.log('Access-Request for ' + username);      
      code = await wifi_users.getCode(username,password);
      break;
    case 'Accounting-Request':
      code = 'Accounting-Response';
      console.log(packet.code);
    default:
      console.log(packet.code);
      
  }
 
  var response = radius.encode_response({
    packet: packet,
    code: code,
    secret: secret
  });

  console.log('Sending ' + code + ' for user ' + username);
  server.send(response, 0, response.length, rinfo.port, rinfo.address, function (err, bytes) {
    if (err) {
      console.log('Error sending response to ', rinfo);
    }else{
      console.log("Sended to" + rinfo.address);
    }
  });
  
});


server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
    address.address + ":" + address.port);
});

server.bind(1812);