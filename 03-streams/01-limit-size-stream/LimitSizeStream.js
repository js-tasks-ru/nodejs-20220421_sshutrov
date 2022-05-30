const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.transferred = 0;
    this.limit = options.limit;
  }
   
  _transform(chunk, encoding, callback) {
    this.transferred += chunk.length;
    if (this.transferred > this.limit) {
      return callback(new LimitExceededError);
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
