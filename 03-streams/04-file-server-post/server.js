const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const errorMessager = (error) => {
  if (error) {
    console.log(error.message);
  }
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
        if (pathname.indexOf('/')>0) {
          res.statusCode = 400;
          res.end('Directory not exist')
        }
        const LimitedSizeStream = new LimitSizeStream({limit: 1048576})
        const writeStream = fs.createWriteStream(`${filepath}`, {flags: 'wx'});
        
        req.pipe(LimitedSizeStream).pipe(writeStream)
        
        writeStream.on('finish', () => {
          res.statusCode = 201;
          res.end('OK');
        });

        req.on('aborted', () => {
          writeStream.end();
          fs.rm(filepath, errorMessager);
        })

        LimitedSizeStream.on('error', (error) => {
          if (error.code === 'LIMIT_EXCEEDED') {
            res.statusCode = 413;
            res.end('File size bigger than 1 megabyte');
            writeStream.end();
            fs.rm(filepath, errorMessager);
          }
        });

        writeStream.on('error', (error) => {
          if (error.code === 'EEXIST') {
            res.statusCode = 409;
            res.end('File exist');
            writeStream.end();
            fs.rm(filepath, errorMessager);
          }
        });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
