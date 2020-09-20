const http = require('http');
const path = require('path');
const url  = require('url');
const fs   = require ('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const LimitSizeStream = require('./LimitSizeStream');
  const limitStream = new LimitSizeStream({limit: 1048576});

  switch (req.method) {
    case 'POST':
      if (pathname.includes('/') || pathname.includes(path.sep)) {
        res.statusCode = 400;
        res.end('Server Error');
        return;
      }

      const writeStream = fs.createWriteStream(filepath, {flags: 'wx'});
      
      writeStream.on('error', (err) => {
        if (err.code === 'EEXIST') {
          res.statusCode = 409;
          res.end('File exists');
          return;
        }
        fs.unlink(filepath, err => {
          if (err) {
            res.statusCode = 500;
            res.end('Server Error');
          }
        });
      });
      
      writeStream.on('finish', () => {
        res.statusCode = 201;
        res.end('Success');
      });
      
      res.on('close', () => {
        if (res.finished) {
          return;
        }
        fs.unlink(filepath, err => {});
        res.statusCode = 500;
        res.end('Server Error');
      });

      limitStream.on('error', err => {
        if (err) {
          fs.unlink(filepath, err => {});
          if (err.name === 'LimitExceededError') {
            res.statusCode = 413;
            res.end('Server Error');
          } else {
            res.statusCode = 500;
            res.end('Server Error');
          }
        }
      });
      
      req.pipe(limitStream).pipe(writeStream);
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
