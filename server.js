var radius = require('radius');
var dgram = require("dgram");
var AWS = require('aws-sdk');

var secret = 'radius_secret';
var server = dgram.createSocket("udp4");
AWS.config.region = 'us-east-1';

var params = {
  Filters: [
    {
      Name: "instance-state-code",
      Values: [
        "0",
        "16"
      ]
    }
  ]
};
try {
  var ec2 = new AWS.EC2();
  ec2.describeInstances(params, function (err, data) {
    console.log("\nIn describe instances:\n");
    if (err) {
      console.log("\nError:\n");
      console.log(err, err.stack) // an error occurred

    }
    else {
      console.log("\nSuccess:\n");
      console.log("\n\n" + JSON.stringify(data) + "\n\n");
    }
  });
} catch (error) {
  console.error(error);
}


server.on("message", function (msg, rinfo) {
  var code, username, password, packet;
  packet = radius.decode({ packet: msg, secret: secret });

  if (packet.code != 'Access-Request') {
    console.log('unknown packet type: ', packet.code);
    return;
  }

  username = packet.attributes['User-Name'];
  password = packet.attributes['User-Password'];

  console.log('Access-Request for ' + username);

  if (username == 'jlpicard' && password == 'beverly123') {
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
});

server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
    address.address + ":" + address.port);
});

server.bind(1812);