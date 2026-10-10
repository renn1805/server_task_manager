// Servidor local mínimo para o visualizador da documentação.
// Sem dependências: só o Node. Serve a pasta docs/ e uma lista dos .md em /__tree.
//
// Uso (na raiz do projeto):   node docs\viewer\server.js
// Abrir o navegador sozinho:  node docs\viewer\server.js --open
// Trocar a porta:             set PORT=5000 && node docs\viewer\server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { exec } = require('child_process');

const DOCS = path.resolve(__dirname, '..');          // a pasta docs/
const PORT = Number(process.env.PORT) || 4000;
const SKIP = new Set(['.git', 'node_modules', 'viewer']); // não entram no menu

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.pdf': 'application/pdf', '.txt': 'text/plain; charset=utf-8',
};

// Varre docs/ e devolve pastas, arquivos .md e uma "assinatura" que muda quando algo é alterado.
function scan() {
  const out = { root: path.basename(DOCS), dirs: [], files: [] };
  let sig = '';
  const walk = (dir, rel) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SKIP.has(e.name)) continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) {
        out.dirs.push(r); sig += 'd:' + r + ';';
        walk(path.join(dir, e.name), r);
      } else if (/\.md$/i.test(e.name)) {
        out.files.push(r);
        sig += r + ':' + fs.statSync(path.join(dir, e.name)).mtimeMs + ';';
      }
    }
  };
  walk(DOCS, '');
  out.sig = crypto.createHash('sha1').update(sig).digest('hex');
  return out;
}

function send(res, code, body, type) {
  res.writeHead(code, { 'Content-Type': type || 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); }
  catch (e) { return send(res, 400, 'URL inválida'); }

  if (pathname === '/__tree') return send(res, 200, JSON.stringify(scan()), MIME['.json']);
  if (pathname === '/') { res.writeHead(302, { Location: '/viewer/' }); return res.end(); }

  // Impede acessar arquivos fora da pasta docs (ex.: /../server)
  let file = path.resolve(DOCS, '.' + pathname);
  if (file !== DOCS && !file.startsWith(DOCS + path.sep)) return send(res, 403, 'Acesso negado');

  fs.stat(file, (err, st) => {
    if (!err && st.isDirectory()) file = path.join(file, 'index.html');
    fs.readFile(file, (err2, data) => {
      if (err2) return send(res, 404, 'Não encontrado: ' + pathname);
      send(res, 200, data, MIME[path.extname(file).toLowerCase()] || 'application/octet-stream');
    });
  });
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') console.error(`A porta ${PORT} já está em uso. Feche o outro servidor ou use outra porta (set PORT=5000).`);
  else console.error(e);
  process.exit(1);
});

server.listen(PORT, '127.0.0.1', () => {
  const url = `http://localhost:${PORT}/viewer/`;
  console.log(`Documentação em ${url}\nPasta lida: ${DOCS}\n(Ctrl+C para parar)`);
  if (process.argv.includes('--open')) {
    const cmd = process.platform === 'win32' ? `start "" "${url}"` : process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
    exec(cmd);
  }
});
