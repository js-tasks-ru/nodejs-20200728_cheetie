const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._options = options;
    this._length = 0;
  }

  _transform(chunk, encoding, callback) {
    this._length += chunk.length;
    
    if (this._length > this._options.limit) {
      return callback(new LimitExceededError());
    }
    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
