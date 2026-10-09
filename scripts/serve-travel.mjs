/**
 * Serves the repo so TravelBook.html can fetch TravelBook.md.
 * Run: npm run serve:travel
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8765);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp3': 'audio/mpeg'
};

http
  .createServer(function (req, res) {
    var urlPath = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname);
    if (urlPath === '/') urlPath = '/TravelBook.html';
    var file = path.resolve(root, urlPath.replace(/^[/\\]+/, ''));
    if (!file.startsWith(path.resolve(root))) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    fs.readFile(file, function (err, buf) {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      var ext = path.extname(file).toLowerCase();
      res.writeHead(200, {
        'Content-Type': types[ext] || 'application/octet-stream',
        'Cache-Control': 'no-store'
      });
      res.end(buf);
    });
  })
  .listen(port, function () {
  console.log('Travel Book  http://127.0.0.1:' + port + '/TravelBook.html');
  console.log('Travel Map   http://127.0.0.1:' + port + '/TravelMap.html');
  console.log('Simulator    http://127.0.0.1:' + port + '/simulator.html');
  console.log('Garb system  http://127.0.0.1:' + port + '/GarbSystem.html');
  console.log('Edit TravelBook.md or garb.md, then refresh the page.');
  });
