"use strict";

const toBoolean = require('./utils').toBoolean;
const decToHex = require('./utils').decToHex;

const VEHICLETYPES = [
    "train",
    "truck",
    "bus",
    "airplane",
    "boat"
];

const STATIONTYPES = [
    "train",
    "truck",
    "bus",
    "airplane",
    "boat"
];

function processServerGeneralInfo(b) {
    let i, j, info = {
        infoVersion: b.readUInt8()
    };

    switch( info.infoVersion ) {
        case 4:

            info.grfCount = b.readUInt8();
            info.grf = [];

            for (i = 0; i < info.grfCount; i++) {
                let grf = {
                    id: decToHex( b.readUInt32BE() ).toUpperCase(),
                    md5: []
                };

                for (j = 0; j < 16; j++) {
                    grf.md5.push( decToHex(b.readUInt8()) );
                }

                grf.md5 = grf.md5.join('').toUpperCase();

                info.grf.push(grf);
            }

        case 3:

            info.gameDate = b.readUInt32LE();
            info.startDate = b.readUInt32LE();

        case 2:

            info.companiesMax  = b.readUInt8();
            info.companiesOn   = b.readUInt8();
            info.spectatorsMax = b.readUInt8();

        case 1:

            info.name = b.readString('ascii');
            info.revision = b.readString('ascii');
            info.language = b.readUInt8();
            info.usePassword = toBoolean( b.readUInt8() );
            info.clientsMax = b.readUInt8();
            info.clientsOn = b.readUInt8();
            info.spectatorsOn = b.readUInt8();

            if( info.infoVersion < 3 ) {
                let daysTillOriginalBaseYear = ( 365 * 1920 + 1920 / 4 - 1920 / 100 + 1920 / 400 );
                info.gameDate = b.readUInt16LE() + daysTillOriginalBaseYear;
                info.startDate = b.readUInt16LE() + daysTillOriginalBaseYear;
            }

            info.mapName = b.readString('ascii');
            info.mapWidth = b.readUInt16LE();
            info.mapHeight = b.readUInt16LE();
            info.mapSet = b.readUInt8();
            info.dedicated = toBoolean( b.readUInt8() );

            info.online = true;

            break;
        default:
            throw `Can only process info version 1,2,3 and 4. It is version ${info.detailVersion}`;
    }

    return info;
}


function processServerDetailInfo(b) {
    let details = {
        detailVersion: b.readUInt8(),
        numberOfCompanies: b.readUInt8(),
        companies: []
    };

    switch( details.detailVersion ) {
        case 6:

            for (var i = 0; i < details.numberOfCompanies; i++) {

                let company = companyDetails(b);
                details.companies.push( company );

            }

            break;
        default:
            throw `Can only process detail version 6. It is version ${details.detailVersion}`;
    }

    return details;
}


function companyDetails(b) {
    let i;

    let company = {       
        current: b.readUInt8()
    };

    // $c->current       = $this->_packet->Recv_uint8();
    // $c->company_name  = $this->_packet->Recv_string();
    // $c->inaugurated   = $this->_packet->Recv_uint32();
    // $c->company_value = $this->_packet->Recv_uint64();
    // $c->money         = $this->_packet->Recv_uint64();
    // $c->income        = $this->_packet->Recv_uint64();
    // $c->performance   = $this->_packet->Recv_uint16();
    // $c->password      = $this->_packet->Recv_uint8();

    company.name        = b.readString('ascii');
    company.inaugurated = b.readUInt32LE();
    company.value       = b.readUInt64LE();
    company.money       = b.readInt64LE();
    company.income      = b.readInt64LE();
    company.performance = b.readUInt16LE();
    company.password    = toBoolean( b.readUInt8() );

    // company vehicles
    company.vehicles = {};
    for (i = 0; i < VEHICLETYPES.length; i++) {
        company.vehicles[ VEHICLETYPES[i] ] = b.readUInt16LE();
    }

    // company stations
    company.stations = {};
    for (i = 0; i < STATIONTYPES.length; i++) {
        company.stations[ STATIONTYPES[i] ] = b.readUInt16LE();
    }

    company.client = [];

    company.ai = toBoolean( b.readUIntLE() );

    return company;

}

exports.processServerGeneralInfo = processServerGeneralInfo;
exports.processServerDetailInfo  = processServerDetailInfo;