const radius = require('radius');
const dgram = require("dgram");
const wifi_users = require('./wifi_users');
const config = require ('config');

const secret = config.get('secret'); 
const server = dgram.createSocket("udp4");
 
//messages
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
    }
  });
  console.log('Sended');
});


server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
    address.address + ":" + address.port);
});

server.bind(1812);