/* Visualizador da documentação.
   Lê a lista de arquivos em /__tree (server.js) e os .md direto da pasta docs/.
   Bibliotecas: marked (markdown), highlight.js (cores do código), Mermaid (diagramas). */
(() => {
'use strict';

const $ = s => document.querySelector(s);
const INDEX_RE = /^(index|readme)\.md$/i;
const BADGES = { 'planejado': 'planejado', 'em andamento': 'andamento', 'pronto': 'pronto',
                 'atual': 'atual', 'desejado': 'desejado', 'pendente': 'pendente' };

const state = { md: new Map(), titles: new Map(), dirs: [], tree: null, nodes: new Map(),
                root: 'docs', sig: '', open: new Set(), current: '' };
let ctxDir = '';          // pasta do documento que está sendo desenhado (resolve links relativos)
let headIds = new Map();  // evita ids repetidos nos títulos

/* ---------- utilidades ---------- */
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const slug = s => norm(s).replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
const pretty = n => { n = n.replace(/\.md$/i, '').replace(/[-_]+/g, ' '); return n.charAt(0).toUpperCase() + n.slice(1); };
const natural = (a, b) => a.localeCompare(b, 'pt', { numeric: true });
const decodeSafe = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };
const hrefFor = (path, anchor) => '#/' + encodeURI(path) + (anchor ? '#' + anchor : '');

function joinPath(base, rel) {
  const out = base ? base.split('/') : [];
  for (const s of rel.split('/')) {
    if (s === '' || s === '.') continue;
    if (s === '..') out.pop(); else out.push(s);
  }
  return out.join('/');
}

/* ---------- tema ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#hl-light').disabled = t === 'dark';
  $('#hl-dark').disabled = t !== 'dark';
  if (window.mermaid) mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: t === 'dark' ? 'dark' : 'default' });
}

/* ---------- links e imagens ---------- */
function resolveTarget(p) {
  p = p.replace(/\/+$/, '');
  if (state.md.has(p)) return { kind: 'file', path: p };
  if (p && state.md.has(p + '.md')) return { kind: 'file', path: p + '.md' };
  if (state.nodes.has(p)) {
    const d = state.nodes.get(p);
    const idx = d.children.find(c => c.type === 'file' && INDEX_RE.test(c.name));
    return idx ? { kind: 'file', path: idx.path } : { kind: 'dir', path: p };
  }
  return { kind: 'none', path: p };
}

function makeLink(text, href, title) {
  href = href || '';
  const t = title ? ` title="${esc(title)}"` : '';
  if (/^(https?:|mailto:)/i.test(href))
    return `<a href="${esc(href)}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return text;                        // bloqueia javascript:, data: etc.
  if (href[0] === '#')
    return `<a href="#" data-anchor="${esc(slug(decodeSafe(href.slice(1))))}">${text}</a>`;
  const [p, a] = href.split('#');
  const abs = joinPath(ctxDir, decodeSafe(p));
  if (/\.[a-z0-9]{2,5}$/i.test(abs) && !/\.md$/i.test(abs))                  // outro tipo de arquivo (pdf, png...)
    return `<a href="/${encodeURI(abs)}" target="_blank" rel="noopener">${text}</a>`;
  const r = resolveTarget(abs);
  const cls = r.kind === 'none' ? ' class="broken" title="Arquivo não encontrado"' : '';
  return `<a href="${hrefFor(r.kind === 'none' ? abs : r.path, a ? slug(decodeSafe(a)) : '')}"${cls}>${text}</a>`;
}

function imgUrl(src) {
  if (/^https?:/i.test(src) || /^data:image\//i.test(src)) return src;
  return '/' + encodeURI(joinPath(ctxDir, decodeSafe(src)));
}

/* ---------- configuração do marked ---------- */
function setupMarked() {
  marked.use({
    gfm: true,
    renderer: {
      heading(text, level, raw) {
        const plain = raw != null ? raw : String(text).replace(/<[^>]+>/g, '');
        let id = slug(plain.replace(/[`*_\[\]]/g, '')) || 'secao';
        const n = headIds.get(id) || 0; headIds.set(id, n + 1);
        if (n) id += '-' + n;
        return `<h${level} id="h-${id}">${text}</h${level}>`;
      },
      link(href, title, text) { return makeLink(text, href, title); },
      image(href, title, text) { return `<img alt="${esc(text)}" src="${esc(imgUrl(href))}" loading="lazy">`; },
      code(code, info) {
        const lang = ((info || '').match(/\S*/) || [''])[0];
        if (lang === 'mermaid') return `<pre class="mermaid">${esc(code)}</pre>`;
        const body = lang && window.hljs && hljs.getLanguage(lang)
          ? hljs.highlight(code, { language: lang, ignoreIllegals: true }).value
          : esc(code);
        return `<div class="codewrap"><button class="copy" type="button">Copiar</button><pre><code class="hljs${lang ? ' language-' + esc(lang) : ''}">${body}</code></pre></div>`;
      },
      table(header, body) { return `<div class="tw"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`; },
      html(h) { return /^<br\s*\/?>$/i.test(String(h).trim()) ? '<br>' : esc(h); }   // HTML cru aparece como texto (só <br> é aceito)
    }
  });
}

function renderMarkdown(src, dir) {
  ctxDir = dir; headIds = new Map();
  src = src.replace(/\r\n?/g, '\n').replace(/^---\n[\s\S]*?\n---\n/, '').replace(/<!--[\s\S]*?-->/g, '');
  return marked.parse(src);
}

async function renderMermaid() {
  if (!window.mermaid) return;
  for (const n of [...document.querySelectorAll('pre.mermaid')]) {
    const src = n.textContent;
    try {
      await mermaid.parse(src);
      await mermaid.run({ nodes: [n] });
    } catch (err) {
      if (n.isConnected) n.outerHTML = `<div class="mermaid-error"><b>Erro no diagrama Mermaid</b><pre>${esc(err && err.message ? err.message : err)}</pre><pre>${esc(src)}</pre></div>`;
    }
  }
}

/* ---------- carregar dados ---------- */
function orderHint() {
  // A ordem dos links do index.md da raiz define a ordem das pastas no menu.
  const idx = [...state.md.keys()].find(p => !p.includes('/') && INDEX_RE.test(p));
  const hint = [];
  if (!idx) return hint;
  state.md.get(idx).replace(/\]\(\s*([^)#\s]+)/g, (m, u) => {
    const p = joinPath('', decodeSafe(u));
    if (p && !hint.includes(p)) hint.push(p);
    return m;
  });
  return hint;
}

function buildTree() {
  const root = { type: 'dir', name: '', path: '', children: [] };
  const map = new Map([['', root]]);
  const ensure = p => {
    if (map.has(p)) return map.get(p);
    const i = p.lastIndexOf('/');
    const parent = ensure(i < 0 ? '' : p.slice(0, i));
    const n = { type: 'dir', name: p.slice(i + 1), path: p, children: [] };
    parent.children.push(n); map.set(p, n); return n;
  };
  state.dirs.forEach(ensure);
  for (const p of state.md.keys()) {
    const i = p.lastIndexOf('/');
    ensure(i < 0 ? '' : p.slice(0, i)).children.push({ type: 'file', name: p.slice(i + 1), path: p });
  }
  const hint = orderHint();
  const rank = n => INDEX_RE.test(n.name) ? 0 : n.type === 'dir' ? 1 : 2;
  const key = n => { const i = hint.findIndex(h => h === n.path || h.startsWith(n.path + '/')); return i < 0 ? 1e9 : i; };
  const sort = n => {
    n.children.sort((a, b) => rank(a) - rank(b) || key(a) - key(b) || natural(a.name, b.name));
    n.children.forEach(c => c.type === 'dir' && sort(c));
  };
  sort(root);
  state.tree = root; state.nodes = map;
}

async function loadAll(keepScroll) {
  const r = await fetch('/__tree', { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const t = await r.json();
  const md = new Map();
  await Promise.all(t.files.map(async p => {
    const res = await fetch('/' + encodeURI(p), { cache: 'no-store' });
    md.set(p, await res.text());
  }));
  state.md = md; state.dirs = t.dirs; state.root = t.root; state.sig = t.sig;
  state.titles = new Map();
  for (const [p, text] of md) {
    const m = text.match(/^#\s+(.+)$/m);
    state.titles.set(p, (m ? m[1] : pretty(p.split('/').pop())).replace(/[`*_]/g, ''));
  }
  buildTree();
  $('#brand').textContent = '📚 ' + state.root;
  route(keepScroll);
}

async function poll() {            // detecta alterações nos .md e atualiza sozinho
  if (document.hidden) return;
  try {
    const r = await fetch('/__tree', { cache: 'no-store' });
    const t = await r.json();
    if (t.sig !== state.sig) await loadAll(true);
  } catch (e) { /* servidor parado: tenta de novo no próximo ciclo */ }
}

/* ---------- rotas e páginas ---------- */
function route(keepScroll) {
  if (!state.tree) return;
  const y = window.scrollY;
  let h = location.hash.slice(1), anchor = '';
  const k = h.indexOf('#', 1);
  if (k > 0) { anchor = h.slice(k + 1); h = h.slice(0, k); }
  const p = decodeSafe(h).replace(/^\//, '');
  const t = resolveTarget(p);
  if (t.kind === 'file') showFile(t.path);
  else if (t.kind === 'dir') showDir(t.path);
  else showMissing(p);
  expandTo(t.kind === 'dir' ? t.path : t.path.includes('/') ? t.path.slice(0, t.path.lastIndexOf('/')) : '');
  renderTree();
  document.body.classList.remove('menu');
  const target = anchor && document.getElementById('h-' + anchor);
  if (target) target.scrollIntoView();
  else window.scrollTo(0, keepScroll === true ? y : 0);
}

function expandTo(dir) {
  let acc = '';
  for (const s of dir ? dir.split('/') : []) { acc += (acc ? '/' : '') + s; state.open.add(acc); }
}

function crumbs(p) {
  const parts = p ? p.split('/') : [];
  let acc = '';
  const out = [`<a href="#/">${esc(state.root)}</a>`];
  parts.forEach((s, i) => {
    acc += (acc ? '/' : '') + s;
    out.push(i === parts.length - 1 ? `<span>${esc(s)}</span>` : `<a href="${hrefFor(acc)}">${esc(s)}</a>`);
  });
  return `<nav class="crumbs">${out.join(' / ')}</nav>`;
}

function showFile(p) {
  state.current = p;
  const dir = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : '';
  $('#content').innerHTML = crumbs(p) + '<article class="md">' + renderMarkdown(state.md.get(p), dir) + '</article>';
  document.title = state.titles.get(p) + ' — ' + state.root;
  postProcess(); buildToc(); renderMermaid();
}

function showDir(p) {
  state.current = p;
  const n = state.nodes.get(p);
  const count = x => x.children.reduce((s, c) => s + (c.type === 'file' ? 1 : count(c)), 0);
  const items = n.children.map(c => c.type === 'file'
    ? `<li><a href="${hrefFor(c.path)}">${esc(state.titles.get(c.path))}</a><small>${esc(c.name)}</small></li>`
    : `<li><a href="${hrefFor(c.path)}">📁 ${esc(pretty(c.name))}</a><small>${count(c)} documento(s)</small></li>`).join('');
  $('#content').innerHTML = crumbs(p) +
    `<article class="md"><h1>${esc(pretty(n.name || state.root))}</h1>` +
    `<p class="muted">Pasta <code>${esc(p || '/')}</code></p>` +
    (items ? `<ul class="dirlist">${items}</ul>` : '<p><em>Nenhum documento nesta pasta ainda.</em></p>') + '</article>';
  document.title = pretty(n.name || state.root) + ' — ' + state.root;
  $('#toc').innerHTML = '';
}

function showMissing(p) {
  state.current = '';
  $('#content').innerHTML = crumbs('') + `<article class="md"><h1>Não encontrado</h1><p>Não existe <code>${esc(p)}</code> na documentação.</p><p><a href="#/">Voltar ao início</a></p></article>`;
  $('#toc').innerHTML = '';
}

function postProcess() {             // transforma células como "Planejado" em etiquetas coloridas
  document.querySelectorAll('.md td').forEach(td => {
    if (td.children.length) return;
    const k = BADGES[td.textContent.trim().toLowerCase()];
    if (k) td.innerHTML = `<span class="badge b-${k}">${esc(td.textContent.trim())}</span>`;
  });
}

function buildToc() {
  const hs = [...document.querySelectorAll('.md h2, .md h3')];
  $('#toc').innerHTML = hs.length < 2 ? '' :
    '<h4>Nesta página</h4>' + hs.map(h => `<a href="#" class="l${h.tagName[1]}" data-id="${h.id}">${esc(h.textContent)}</a>`).join('');
}

/* ---------- menu lateral ---------- */
function renderTree() {
  const li = n => n.type === 'file'
    ? `<li><a class="f${n.path === state.current ? ' active' : ''}" href="${hrefFor(n.path)}" title="${esc(n.path)}">${esc(state.titles.get(n.path))}</a></li>`
    : `<li><details data-path="${esc(n.path)}"${state.open.has(n.path) ? ' open' : ''}><summary title="${esc(n.path)}/">${esc(pretty(n.name))}</summary>` +
      `<ul>${n.children.map(li).join('') || '<li class="empty">sem documentos</li>'}</ul></details></li>`;
  $('#tree').innerHTML = `<ul>${state.tree.children.map(li).join('')}</ul>`;
}

$('#tree').addEventListener('toggle', e => {
  const d = e.target.closest('details'); if (!d) return;
  d.open ? state.open.add(d.dataset.path) : state.open.delete(d.dataset.path);
}, true);

/* ---------- busca ---------- */
let timer;
$('#q').addEventListener('input', e => { clearTimeout(timer); timer = setTimeout(() => search(e.target.value), 150); });

function search(raw) {
  const q = norm(raw.trim());
  const box = $('#results'), tree = $('#tree');
  if (!q) { box.hidden = true; tree.hidden = false; return; }
  const found = [];
  for (const [p, text] of state.md) {
    const title = state.titles.get(p);
    const inTitle = norm(title).includes(q);
    const line = text.split('\n').find(l => norm(l).includes(q));
    if (!inTitle && !line) continue;
    found.push({ p, title, inTitle, snip: (line || '').replace(/[#*`|>_\[\]]/g, '').trim().slice(0, 140) });
  }
  found.sort((a, b) => b.inTitle - a.inTitle || natural(a.p, b.p));
  tree.hidden = true; box.hidden = false;
  box.innerHTML = found.length
    ? found.map(f => `<a href="${hrefFor(f.p)}"><b>${esc(f.title)}</b><small>${esc(f.p)}</small>${f.snip ? `<span>${esc(f.snip)}</span>` : ''}</a>`).join('')
    : '<p class="muted">Nada encontrado.</p>';
}

/* ---------- eventos ---------- */
window.addEventListener('hashchange', () => route());
$('#menuBtn').onclick = () => document.body.classList.toggle('menu');
$('#theme').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('docs-theme', t); } catch (e) {}
  applyTheme(t);
  route(true);                       // redesenha para os diagramas pegarem o novo tema
};
$('#content').addEventListener('click', e => {
  const copy = e.target.closest('.copy');
  if (copy) {
    const code = copy.parentElement.querySelector('code').textContent;
    navigator.clipboard.writeText(code).then(() => {
      copy.textContent = 'Copiado ✓';
      setTimeout(() => copy.textContent = 'Copiar', 1200);
    });
    return;
  }
  const a = e.target.closest('a[data-anchor]');
  if (!a) return;
  e.preventDefault();
  const t = document.getElementById('h-' + a.dataset.anchor);
  if (t) t.scrollIntoView();
});
$('#toc').addEventListener('click', e => {
  const a = e.target.closest('a[data-id]');
  if (!a) return;
  e.preventDefault();
  document.getElementById(a.dataset.id).scrollIntoView();
});

/* ---------- início ---------- */
function fatal(html) {
  $('#app').hidden = true;
  const m = $('#msg'); m.hidden = false; m.innerHTML = html;
}

async function init() {
  applyTheme(document.documentElement.dataset.theme || 'light');
  if (location.protocol === 'file:')
    return fatal('<h2>Abra pelo servidor</h2><p>Esta página não funciona com duplo clique no arquivo (o navegador bloqueia a leitura dos <code>.md</code>).</p><p>No cmd, na raiz do projeto, rode:</p><pre><code>node docs\\viewer\\server.js --open</code></pre>');
  if (typeof marked === 'undefined')
    return fatal('<h2>Sem as bibliotecas</h2><p>Não consegui carregar o <code>marked</code> (leitor de markdown). Verifique a conexão com a internet e recarregue a página.</p>');
  setupMarked();
  try {
    await loadAll(false);
  } catch (e) {
    return fatal('<h2>Não consegui ler a documentação</h2><p>O servidor está rodando? No cmd, na raiz do projeto:</p><pre><code>node docs\\viewer\\server.js --open</code></pre>');
  }
  setInterval(poll, 2000);
}
init();
})();
