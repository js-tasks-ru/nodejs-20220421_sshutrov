const stream = require('stream');
const os = require('os');
const { chunk, transform } = require('lodash');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.data_storage = ''
  }

  _transform(chunk, encoding, callback) {
    let str = chunk.toString();

    if (this.data_storage) {
      str = this.data_storage + str
    }

    let arr = str.toString().split(`${os.EOL}`)
    
    this.data_storage = arr.pop()
  
    for (let i=0;i<arr.length;i++) {
      this.push(arr[i])
    }
    callback()
  }

  _flush(callback) {
    if (this.data_storage) {
      this.push(this.data_storage)
    }
    callback()
  }
}

module.exports = LineSplitStream;