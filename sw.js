const CACHE_NAME = 'jogo-velha-pwa-v1'; // Nome do cache específico
const URLS_TO_CACHE = [
  '/',                // Raiz
  'index.html',       // Lobby
  'game.html',        // Jogo da Velha
  'manifest.json',
  'icons/icon-192.png', // Verifique nome
  'icons/icon-512.png', // Verifique nome
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.6.1/firebase-database-compat.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil( caches.open(CACHE_NAME).then((cache) => { console.log('Cache aberto'); const p = URLS_TO_CACHE.map(url => cache.add(url).catch(err => console.warn(`Falha cache ${url}: ${err}`))); return Promise.all(p); }).then(()=>console.log('Cache OK.')).catch(e=>console.error('Cache Falhou:', e)) ); self.skipWaiting();
});
self.addEventListener('activate', (event) => { const w=[CACHE_NAME]; event.waitUntil( caches.keys().then((cN) => Promise.all( cN.map((cN) => { if (w.indexOf(cN) === -1) { console.log('Deletando cache antigo:', cN); return caches.delete(cN); } }) )).then(() => self.clients.claim()) ); });
self.addEventListener('fetch', (event) => { if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) return; event.respondWith( caches.match(event.request).then((response) => { if (response) return response; return fetch(event.request).then( (nR) => { if (nR && nR.ok) { const rTC = nR.clone(); caches.open(CACHE_NAME).then((cache) => { if(event.request.url.startsWith('http')) cache.put(event.request, rTC); }); } return nR; }).catch(e => console.warn('Fetch falhou:', e)); }) ); });
