const radius = require('radius');
const dgram = require("dgram");
const wifi_users = require('./table_utils')
require ('dotenv').config();

radius.add_dictionary ('mikrotik.dict');


const secret = "123456789"; // process.env.SECRET;
const server = dgram.createSocket("udp4");



server.on("message", async function (msg, rinfo) {
  var code, username, password, packet;
  
  //console.log('rinfo : ', JSON.stringify(rinfo)); //This is from DHP Server

  packet = radius.decode({ packet: msg, secret: secret });

  console.log('Packet : ', JSON.stringify(packet));


  switch (packet.code){
    case 'Access-Request':
      username = packet.attributes['User-Name'];
      password = packet.attributes['User-Password'];
      console.log('Access-Request for ' + username);      
      code = 'Access-Accept'
      //code = await wifi_users.getCode(username,password);
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
    secret: secret,
    attributes: [
      ['NAS-IP-Address', '10.5.5.5'],
      ['User-Name', 'dealing-deathtraps'],
      ['Vendor-Specific', 14988, [['Mikrotik-Group', 'dairymaids-deprograming']]],
      ['Vendor-Specific', 14988, [['Mikrotik-Address-List', '192.168.1.200/24']]],
      ['Vendor-Specific', 14988, [['Mikrotik-Mark-Id', '10']]],
      ['Vendor-Specific', 14988, [['Mikrotik-Wireless-Comment', 'Comment']]],

    ]
  });

  console.log('Sending ' + code + ' for user ' + username);
  server.send(response, 0, response.length, rinfo.port, rinfo.address, function (err, bytes) {
    if (err) {
      console.log('Error sending response to ', rinfo);
    }else{
      console.log("Sent to " + rinfo.address);
    }
  });
});


server.on("listening", function () {
  var address = server.address();
  console.log("radius server listening " +
    address.address + ":" + address.port);
});

server.bind(1813);