const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

function error_messager(res, errorCode, errorMessage) {
  res.statusCode = errorCode;
  res.end(`${errorMessage}\n`);
}

server.on('request', (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (pathname.indexOf('/')>0) {
        res.statusCode = 400;
        res.end('Directory not exist')
      }
      
      const stream = fs.createReadStream(`${filepath}`);

      stream.pipe(res);

      stream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          error_messager(res, 404, 'File not found\n');
        } else {
          error_messager(res, 500, 'Internal server error\n');
        }
      });

      req.on('aborted', () => {
        stream.destroy();
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;