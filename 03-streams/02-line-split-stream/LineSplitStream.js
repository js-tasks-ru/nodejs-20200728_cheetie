const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._options = options;
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk
      .toString(this._options.encoding)
      .split(os.EOL);
      
    for (let line of lines) {
      this.push(line);
    }
  }

  _flush(callback) {
  }
}

module.exports = LineSplitStream;
