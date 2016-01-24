#!/usr/bin/env node

"use strict";

let program = require('commander');
const serverInfo = require('./node_openttdlib');

// specify command line options with commander
program
    .version('0.0.1')
    .option('-p, --port <n>', 'Specify port', parseInt)
    .option('-h, --host <n>', 'Specify host')
    .option('-i, --info', 'Get server info')
    .option('-d, --details', 'Get detailed server info')
    .parse(process.argv);

// setup connection details
let connection = {
    host: 'localhost',
    port: '3979'
};

if( program.port ) connection.port = program.port;
if( program.host ) connection.host = program.host;


// Output data
if( program.info && !program.details ) {

    serverInfo.getServerInfo(connection)
    .then((info) => {
        console.log( JSON.stringify(info, null, 2) );
    });

} else if( !program.info && program.details ) {

    serverInfo.getServerDetail(connection)
    .then((details) => {
        console.log( JSON.stringify(details, null, 2) );
    });

} else {

    Promise.all([
        serverInfo.getServerInfo(connection),
        serverInfo.getServerDetail(connection)
    ])
    .then((response) => {
        console.log( JSON.stringify(response, null, 2) );
    });

}