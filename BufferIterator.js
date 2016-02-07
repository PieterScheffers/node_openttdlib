"use strict";

class BufferIterator {
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
	}

    reset() {
        this.offset = 0;

        return this;
    }

    length() {
        return this.buffer.length;
    }

    goto(byteOffset) {
        if( byteOffset > this.length() ) {
            throw "ByteOffset cannot be more as the length of the buffer";
        }

        this.offset = byteOffset;

        return this;
    }

    skip(nrOfBytes) {
        let byteOffset = this.offset + nrOfBytes;

        return this.goto(byteOffset);
    }

    getOffset() {
        return this.offset;
    }

 //    readDoubleBE() {
	// 	return this.buffer.readDoubleBE(this.offset); 
	// }

 //    readDoubleLE() { 
	// 	return this.buffer.readDoubleLE(this.offset); 
	// }

 //    readFloatBE() { 
	// 	return this.buffer.readFloatBE(this.offset); 
	// }

 //    readFloatLE() { 
	// 	return this.buffer.readFloatLE(this.offset); 
	// }

    readInt8() { 
        let offset = this.offset;
        this.offset += 1;
		return this.buffer.readInt8(offset); 
	}

    readInt16BE() { 
        let offset = this.offset;
        this.offset += 2;
		return this.buffer.readInt16BE(offset); 
	}

    readInt16LE() { 
        let offset = this.offset;
        this.offset += 2;
		return this.buffer.readInt16LE(offset); 
	}

    readInt32BE() { 
        let offset = this.offset;
        this.offset += 4;
		return this.buffer.readInt32BE(offset); 
	}

    readInt32LE() { 
        let offset = this.offset;
        this.offset += 4;
		return this.buffer.readInt32LE(offset); 
	}

    readInt64BE() { 
        let offset = this.offset;
        this.offset += 8;
        return this.buffer.readIntBE(offset, 8);
    }

    readInt64LE() { 
        let offset = this.offset;
        this.offset += 8;
        return this.buffer.readIntLE(offset, 8);
    }

    readIntBE(byteLength) {
        let offset = this.offset;
        this.offset += byteLength;
		return this.buffer.readIntBE(offset, byteLength);
	}

    readIntLE(byteLength) { 
        let offset = this.offset;
        this.offset += byteLength;
		return this.buffer.readIntLE(offset, byteLength);
	}

    readUInt8() { 
        let offset = this.offset;
        this.offset += 1;
		return this.buffer.readUInt8(offset); 
	}

    readUInt16BE() { 
        let offset = this.offset;
        this.offset += 2;
		return this.buffer.readUInt16BE(offset); 
	}

    readUInt16LE() { 
        let offset = this.offset;
        this.offset += 2;
		return this.buffer.readUInt16LE(offset); 
	}

    readUInt32BE() { 
        let offset = this.offset;
        this.offset += 4;
		return this.buffer.readUInt32BE(offset); 
	}

    readUInt32LE() { 
        let offset = this.offset;
        this.offset += 4;
		return this.buffer.readUInt32LE(offset); 
	}

    readUInt64BE() {
        let offset = this.offset;
        this.offset += 8;
        return this.buffer.readUIntBE(offset, 8); 
    }

    readUInt64LE() {
        let offset = this.offset;
        this.offset += 8;
        return this.buffer.readUIntLE(offset, 8); 
    }

    readUIntBE(byteLength) { 
        let offset = this.offset;
        this.offset += byteLength;
		return this.buffer.readUIntBE(offset, byteLength); 
	}

    readUIntLE(byteLength) { 
        let offset = this.offset;
        this.offset += byteLength;
		return this.buffer.readUIntLE(offset, byteLength); 
	}

    readString(encoding, endingChar) {
        if( typeof encoding === 'undefined' ) encoding = 'utf8';
        if( typeof endingChar === 'undefined' ) endingChar = 0;

        let endStr = this.buffer.indexOf(endingChar, this.offset);
        let offset = this.offset;
        this.offset = endStr + 1;

        return this.buffer.toString(encoding, offset, endStr);
    }

}

module.exports = BufferIterator;
