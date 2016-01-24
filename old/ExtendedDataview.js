"use strict";

const ord = require('./phpCharcode').ord;

function getStringFromBuffer(buffer, byteOffset) {
    let str = "", index = byteOffset;

    let char = ord(buffer[index]);

    while(char != 0) {
        str += char;
        char = ord(buffer[++index]);
    }
       
    return { 
        string: str, 
        beginIndex: byteOffset,
        lastIndex: index,
        toString: function() {
            return this.string;
        }
    };
}

// function ExtendedDataView(buffer) {
//     this.dv = new DataView(buffer);
// }

// ExtendedDataView.prototype.getString = function(byteOffset) {
//     return getStringFromBuffer(this.dv.buffer, byteOffset).string;
// };

// ExtendedDataView.prototype.stringByteLength = function(byteOffset) {
//     let str = getStringFromBuffer(this.dv.buffer, byteOffset);
//     return str.lastIndex + 1 - byteOffset;
// };

class ExtendedDataView extends DataView {
    getString(byteOffset) {
        return getStringFromBuffer(this.dv.buffer, byteOffset).string;
    }

    stringByteLength(byteOffset) {
        let str = getStringFromBuffer(this.dv.buffer, byteOffset);
        return str.lastIndex + 1 - byteOffset;
    }
}

module.exports = ExtendedDataView;