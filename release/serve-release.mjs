import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const root = resolve(fileURLToPath(new URL('./game/', import.meta.url)));
const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.glb': 'model/gltf-binary', '.webp': 'image/webp', '.png': 'image/png',
  '.woff2': 'font/woff2', '.wasm': 'application/wasm',
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
    if (!path.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const data = await readFile(path);
    response.writeHead(200, {'Content-Type': types[extname(path)] || 'application/octet-stream'}).end(data);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

server.listen(0, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${server.address().port}`;
  console.log(`Riftborne: ${url}\nKeep this window open while playing.`);
  if (process.platform === 'win32' && !process.env.RIFTBORNE_NO_OPEN)
    spawn('rundll32', ['url.dll,FileProtocolHandler', url], {windowsHide: true, stdio: 'ignore'});
});
