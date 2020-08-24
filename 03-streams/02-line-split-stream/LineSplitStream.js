const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._options = options;
    this._cache = '';
  }

  _transform(chunk, encoding, callback) {
    const lines = chunk
      .toString(this._options.encoding)
      .split(os.EOL);

    const lastIndex = lines.length - 1;
    const truncatedLines = lines.slice(1, lastIndex);

    this._cache += lines[0];

    if (lastIndex) {
      this.push(this._cache);
      this._cache = lines[lastIndex];
      
      for (let line of truncatedLines) {
        this.push(line);
      }
    }
    callback();
  }

  _flush(callback) {
    this.push(this._cache);
    callback();
  }
}

module.exports = LineSplitStream;
