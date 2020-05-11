const radius = require('radius');
const dgram = require("dgram");
const wifi_users = require('./wifi_users');

var secret = 'radius_secret';
const server = dgram.createSocket("udp4");



server.on("message", async function (msg, rinfo) {
  var code, username, password, packet;
  packet = radius.decode({ packet: msg, secret: secret });

  if (packet.code != 'Access-Request') {
    console.log('unknown packet type: ', packet.code);
    return;
  }

  username = packet.attributes['User-Name'];
  password = packet.attributes['User-Password'];

  console.log('Access-Request for ' + username);
  if (await wifi_users.access(username, password)) {
    code = 'Access-Accept';
  } else {
    code = 'Access-Reject';
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