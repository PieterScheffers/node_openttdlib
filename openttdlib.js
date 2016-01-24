"use strict";

const nodeify = require('nodeify');
const dgram = require('dgram');
const BufferIterator = require("./BufferIterator");
const processServerGeneralInfo = require("./processPacket").processServerGeneralInfo;
const processServerDetailInfo  = require("./processPacket").processServerDetailInfo;

const UDP_CLIENT_FIND_SERVER    = 0;
const UDP_SERVER_RESPONSE       = 1;
const UDP_CLIENT_DETAIL_INFO    = 2;
const UDP_SERVER_DETAIL_INFO    = 3;
const UDP_CLIENT_GET_NEWGRFS    = 9;
const UDP_SERVER_NEWGRFS        = 10;

function getInfo(req, res, args) {
    let client, timeout;

    function close() {
        if( client != null ) {
            client.close();
            client = null;
        }

        if( timeout != null ) {
            clearTimeout(timeout);
            timeout = null;
        }       
    }

    if( typeof args.host === 'undefined' ) {
        args.host = 'localhost';
    }

    if( typeof args.port === 'undefined' ) {
        args.port = 3979;
    }

    if( typeof args.timeout == 'undefined' ) {
        args.timeout = 30000;
    }

    let udpProm = new Promise((resolve, reject) => {

        client = dgram.createSocket('udp4');

        client.once('error', (err) => {
            //console.error(`Client error: \n${err.stack}`);
            close();
            reject(err);
        });

        client.on('listening', () => {
            let addressInfo = client.address();
            //console.log(`Client listening on ${addressInfo.address}:${addressInfo.port}`);
        });

        client.on('message', (buffer, rinfo) => {
            //console.log( `Message from ${rinfo.address}:${rinfo.port}` );

            let b = new BufferIterator(buffer);

            // skip first 2 bytes with length data
            b.skip(2);

            let messageType = b.readUInt8();

            if( messageType === res ) {
                close();
                resolve(b);
            }
        });

        let message = new Buffer( String.fromCharCode(3) + String.fromCharCode(0) + String.fromCharCode(req) );

        client.send(message, 0, 3, args.port, args.host);
    });

    let timeoutProm = new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
            close();
            reject(new Error('Request timed out'));
        }, args.timeout);
    });

    return Promise.race([ udpProm, timeoutProm ]);
}

function getServerInfo(args, cb) {
    if( ['function', 'undefined'].indexOf(typeof args) !== -1 ) {
        cb = args;
        args = {};
    }

    return nodeify(

        getInfo(UDP_CLIENT_FIND_SERVER, UDP_SERVER_RESPONSE, args)
        .then(processServerGeneralInfo)

    ,cb);
}

function getServerDetail(args, cb) {
    if( ['function', 'undefined'].indexOf(typeof args) !== -1 ) {
        cb = args;
        args = {};
    }

    return nodeify(

        getInfo(UDP_CLIENT_DETAIL_INFO, UDP_SERVER_DETAIL_INFO, args)
        .then(processServerDetailInfo)
        
    ,cb);
}

exports.getServerInfo   = getServerInfo;
exports.getServerDetail = getServerDetail;
