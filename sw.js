/**
 * Service Worker for Agile Coach Toolkit
 * Provides offline functionality and caching strategies
 */

const CACHE_NAME = 'agile-toolkit-v1.0.0';
const STATIC_CACHE = 'agile-toolkit-static-v1.0.0';
const DYNAMIC_CACHE = 'agile-toolkit-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/css/main.css',
  '/assets/css/tool-integration.css',
  '/assets/js/main.js',
  '/assets/js/tools-data.js',
  '/assets/js/tools-sync.js',
  '/assets/js/logging-integration.js',
  '/assets/js/tool-integration.js',
  '/assets/icons/icon-192.svg',
  '/assets/icons/icon-512.svg',
  '/assets/icons/favicon.ico',
  '/assets/icons/apple-touch-icon.png'
];

// Tools to cache
const TOOL_FILES = [
  '/tools/example-mapping/',
  '/tools/example-mapping/index.html',
  '/tools/example-mapping/styles.css',
  '/tools/example-mapping/script.js',
  '/tools/planning-poker/',
  '/tools/planning-poker/index.html',
  '/tools/planning-poker/styles.css',
  '/tools/planning-poker/script.js',
  '/tools/agile-fluency/',
  '/tools/agile-fluency/index.html',
  '/tools/velocity-squad/',
  '/tools/velocity-squad/index.html',
  '/tools/velocity-squad/styles.css',
  '/tools/velocity-squad/script.js'
];

// Network-first resources (always try network first)
const NETWORK_FIRST = [
  '/logs/',
  '/stats.html',
  '/api/'
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST = [
  '/assets/images/',
  '/assets/icons/',
  '.png',
  '.jpg',
  '.jpeg',
  '.svg',
  '.webp',
  '.ico'
];

/**
 * Install Event - Cache static resources
 */
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static files
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static files...');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Cache tool files
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('🛠️ Caching tool files...');
        return cache.addAll(TOOL_FILES.filter(file => !file.endsWith('/')));
      })
    ]).then(() => {
      console.log('✅ Service Worker: Installation complete');
      // Force activation of new service worker
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Service Worker: Installation failed', error);
    })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker: Activation complete');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

/**
 * Fetch Event - Handle network requests with caching strategies
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    handleRequest(request)
  );
});

/**
 * Handle different types of requests with appropriate strategies
 */
async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  try {
    // Network-first strategy for dynamic content
    if (NETWORK_FIRST.some(path => pathname.startsWith(path))) {
      return await networkFirst(request);
    }
    
    // Cache-first strategy for static assets
    if (CACHE_FIRST.some(ext => pathname.includes(ext) || pathname.startsWith(ext))) {
      return await cacheFirst(request);
    }
    
    // Stale-while-revalidate for HTML pages and tools
    if (pathname.endsWith('.html') || pathname.endsWith('/') || pathname.includes('/tools/')) {
      return await staleWhileRevalidate(request);
    }
    
    // Default: Network-first with cache fallback
    return await networkFirst(request);
    
  } catch (error) {
    console.error('❌ Request handling failed:', error);
    return await handleOffline(request);
  }
}

/**
 * Network-first strategy
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * Cache-first strategy
 */
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    throw error;
  }
}

/**
 * Stale-while-revalidate strategy
 */
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Always try to update cache in background
  const networkPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, ignore
  });
  
  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // No cache, wait for network
  return await networkPromise;
}

/**
 * Handle offline scenarios
 */
async function handleOffline(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Try to serve from cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Serve offline page for HTML requests
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlinePage = await caches.match('/offline.html');
    if (offlinePage) {
      return offlinePage;
    }
    
    // Fallback offline HTML
    return new Response(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hors ligne - Agile Coach Toolkit</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 2rem;
          }
          .offline-content {
            max-width: 500px;
          }
          .offline-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          .offline-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .offline-message {
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
          }
          .retry-btn {
            background: rgba(255,255,255,0.2);
            border: 1px solid rgba(255,255,255,0.3);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.2s;
          }
          .retry-btn:hover {
            background: rgba(255,255,255,0.3);
          }
        </style>
      </head>
      <body>
        <div class="offline-content">
          <div class="offline-icon">📱</div>
          <h1 class="offline-title">Mode hors ligne</h1>
          <p class="offline-message">
            Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées, 
            mais vous pouvez toujours utiliser les outils mis en cache.
          </p>
          <button class="retry-btn" onclick="window.location.reload()">
            🔄 Réessayer
          </button>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
  
  // Serve placeholder for images
  if (request.headers.get('accept')?.includes('image/')) {
    return new Response(`
      <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f3f4f6"/>
        <text x="100" y="75" text-anchor="middle" fill="#6b7280" font-family="Arial" font-size="14">
          Image non disponible
        </text>
      </svg>
    `, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
  
  // Default offline response
  return new Response('Contenu non disponible hors ligne', {
    status: 503,
    headers: { 'Content-Type': 'text/plain' }
  });
}

/**
 * Background Sync - Handle deferred actions
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync:', event.tag);
  
  if (event.tag === 'sync-logs') {
    event.waitUntil(syncLogs());
  }
  
  if (event.tag === 'sync-usage') {
    event.waitUntil(syncUsageData());
  }
});

/**
 * Sync logs when back online
 */
async function syncLogs() {
  try {
    // Get logs from IndexedDB or localStorage
    const logs = JSON.parse(localStorage.getItem('agile-toolkit-logs') || '[]');
    
    if (logs.length > 0) {
      const response = await fetch('/logs/usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs, source: 'service-worker-sync' })
      });
      
      if (response.ok) {
        // Clear synced logs
        localStorage.removeItem('agile-toolkit-logs');
        console.log('✅ Logs synchronized');
      }
    }
  } catch (error) {
    console.error('❌ Log sync failed:', error);
  }
}

/**
 * Sync usage data when back online
 */
async function syncUsageData() {
  try {
    const syncData = JSON.parse(localStorage.getItem('agile-toolkit-sync') || '{}');
    
    if (Object.keys(syncData).length > 0) {
      const response = await fetch('/api/sync-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncData)
      });
      
      if (response.ok) {
        console.log('✅ Usage data synchronized');
      }
    }
  } catch (error) {
    console.error('❌ Usage sync failed:', error);
  }
}

/**
 * Push notifications (for future use)
 */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192.svg',
    badge: '/assets/icons/icon-192.svg',
    data: data.data,
    actions: data.actions || []
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

/**
 * Handle notification clicks
 */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const data = event.notification.data;
  
  event.waitUntil(
    clients.openWindow(data.url || '/')
  );
});

/**
 * Message handling for communication with main thread
 */
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'CACHE_URLS':
      cacheUrls(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

/**
 * Clear all caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ All caches cleared');
}

/**
 * Cache specific URLs
 */
async function cacheUrls(urls) {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.addAll(urls);
  console.log('📦 URLs cached:', urls);
}

console.log('🚀 Service Worker loaded successfully');