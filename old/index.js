"use strict";

const dgram = require('dgram');
const client = dgram.createSocket('udp4');
const decToHex = require('./utils').decToHex;
const toBoolean = require('./utils').toBoolean;
const BufferIterator = require("./BufferIterator");

const UDP_CLIENT_FIND_SERVER    = 0;
const UDP_SERVER_RESPONSE       = 1;
const UDP_CLIENT_DETAIL_INFO    = 2;
const UDP_SERVER_DETAIL_INFO    = 3;
const UDP_CLIENT_GET_NEWGRFS    = 9;
const UDP_SERVER_NEWGRFS        = 10;

const VEHICLETYPES = [
    "train",
    "unknown",
    "car",
    "airplane",
    "boat"
];

const STATIONTYPES = [
    "train",
    "unknown",
    "car",
    "airplane",
    "boat"
];

const connectionDetails = {
    host: 'localhost', //'192.168.126.180',
    port: 3979
};

client.on('error', (err) => {
    console.error(`Client error: \n${err.stack}`);
    client.close();
});

client.on('message', (buffer, rinfo) => {
    console.log( `Message from ${rinfo.address}:${rinfo.port}` );
    console.log( "Response number:", buffer.readUInt8(2) );
    console.dir(buffer);

    let b = new BufferIterator(buffer);

    // skip first 2 bytes with length data
    b.skip(2);

    // https://nodejs.org/api/buffer.html#buffer_buf_tostring_encoding_start_end

    let messageType = b.readUInt8();

    // check what type of information message it is
    switch( messageType ) {
        case UDP_SERVER_RESPONSE:
            console.log("Server response contains server info");
            let info = processServerGeneralInfo(b);
            console.log("info", info);
            break;
        case UDP_SERVER_DETAIL_INFO:
            console.log("Server response contains server details");
            processServerDetailInfo(buffer);
            break;
    }

    // client.close();
});

client.on('listening', () => {
    let addressInfo = client.address();
    console.log(`Client listening on ${addressInfo.address}:${addressInfo.port}`);
});


var message = new Buffer( String.fromCharCode(3) + String.fromCharCode(0) + String.fromCharCode(0) );

client.send(message, 0, message.length, connectionDetails.port, connectionDetails.host, (err, bytes) => {

    if(err) {
        console.error(`Error on send: ${err}\n${err.stack}`);
    }

    console.log("Received message!", bytes);

});

// client.send(message, 0, message.length, connectionDetails.port, connectionDetails.host);




