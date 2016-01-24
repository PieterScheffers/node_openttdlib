function decToHex(dec) {
    dec = parseInt(dec, 10);
    var hex = dec.toString(16);

    if( (hex.length % 2) > 0) {
        hex = "0" + hex;
    }

    return hex;
}

function hexToDec(hex) {
    return parseInt(hex, 16);
}

function toBoolean(v) {
    return v ? true : false;
}

exports.decToHex = decToHex;
exports.hexToDec = hexToDec;
exports.toBoolean = toBoolean;
