/**
 * Service Worker pour La Quête de Vérité - Version Mobile
 * Permet un fonctionnement hors ligne et des performances optimisées
 */

const CACHE_NAME = 'quete-verite-mobile-v1.0.0';
const STATIC_CACHE = 'quete-verite-static-v1.0.0';

// Ressources critiques à mettre en cache
const CRITICAL_RESOURCES = [
    '/',
    '/index-mobile.html',
    '/css/mobile.css',
    '/js/main.js',
    '/js/mobile-adapter.js',
    '/js/modules/game.js',
    '/js/modules/angel.js',
    '/js/modules/orb.js',
    '/js/modules/buildings.js',
    '/js/modules/rpg.js',
    '/js/modules/ui.js'
];

// Ressources optionnelles
const OPTIONAL_RESOURCES = [
    '/assets/images/',
    '/assets/sounds/'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    console.log('📱 Service Worker Mobile: Installation...');
    
    event.waitUntil(
        Promise.all([
            // Cache des ressources critiques
            caches.open(CRITICAL_CACHE).then(cache => {
                return cache.addAll(CRITICAL_RESOURCES);
            }),
            
            // Cache des ressources statiques
            caches.open(STATIC_CACHE).then(cache => {
                return cache.addAll([
                    '/manifest.json',
                    '/favicon.ico'
                ]).catch(() => {
                    // Ignore les erreurs pour les ressources optionnelles
                });
            })
        ]).then(() => {
            console.log('✅ Service Worker Mobile: Installation terminée');
            // Force l'activation immédiate
            return self.skipWaiting();
        })
    );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    console.log('📱 Service Worker Mobile: Activation...');
    
    event.waitUntil(
        // Nettoyer les anciens caches
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME && 
                        cacheName !== STATIC_CACHE &&
                        cacheName.startsWith('quete-verite-')) {
                        console.log('🗑️ Suppression ancien cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('✅ Service Worker Mobile: Activé');
            // Prendre le contrôle immédiatement
            return self.clients.claim();
        })
    );
});

// Gestion des requêtes (stratégie Cache First pour les ressources statiques)
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Ignorer les requêtes non-GET
    if (event.request.method !== 'GET') {
        return;
    }
    
    // Ignorer les requêtes vers des domaines externes
    if (url.origin !== location.origin) {
        return;
    }
    
    // Stratégie différente selon le type de ressource
    if (isCriticalResource(event.request.url)) {
        // Cache First pour les ressources critiques
        event.respondWith(cacheFirst(event.request));
    } else if (isStaticResource(event.request.url)) {
        // Stale While Revalidate pour les ressources statiques
        event.respondWith(staleWhileRevalidate(event.request));
    } else {
        // Network First pour les autres ressources
        event.respondWith(networkFirst(event.request));
    }
});

// Vérifier si c'est une ressource critique
function isCriticalResource(url) {
    return CRITICAL_RESOURCES.some(resource => 
        url.includes(resource) || url.endsWith(resource)
    );
}

// Vérifier si c'est une ressource statique
function isStaticResource(url) {
    const staticExtensions = ['.css', '.js', '.png', '.jpg', '.svg', '.woff2'];
    return staticExtensions.some(ext => url.includes(ext));
}

// Stratégie Cache First
async function cacheFirst(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Cache First failed:', error);
        
        // Fallback vers une page d'erreur ou une réponse par défaut
        if (request.destination === 'document') {
            return caches.match('/index-mobile.html');
        }
        
        throw error;
    }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Ignorer les erreurs réseau en arrière-plan
    });
    
    return cachedResponse || fetchPromise;
}

// Stratégie Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        throw error;
    }
}

// Gestion des messages du client
self.addEventListener('message', event => {
    if (event.data && event.data.type) {
        switch (event.data.type) {
            case 'SKIP_WAITING':
                self.skipWaiting();
                break;
                
            case 'CACHE_STATS':
                getCacheStats().then(stats => {
                    event.ports[0].postMessage({
                        type: 'CACHE_STATS_RESPONSE',
                        stats
                    });
                });
                break;
                
            case 'CLEAR_CACHE':
                clearOldCaches().then(() => {
                    event.ports[0].postMessage({
                        type: 'CACHE_CLEARED'
                    });
                });
                break;
        }
    }
});

// Obtenir les statistiques de cache
async function getCacheStats() {
    const cacheNames = await caches.keys();
    const stats = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        stats[cacheName] = keys.length;
    }
    
    return stats;
}

// Nettoyer les anciens caches
async function clearOldCaches() {
    const cacheNames = await caches.keys();
    
    return Promise.all(
        cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE) {
                return caches.delete(cacheName);
            }
        })
    );
}

// Notification de mise à jour disponible
self.addEventListener('controllerchange', () => {
    // Notifier le client qu'une nouvelle version est disponible
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'UPDATE_AVAILABLE',
                message: 'Une nouvelle version de La Quête de Vérité est disponible!'
            });
        });
    });
});

// Gestion des erreurs
self.addEventListener('error', event => {
    console.error('❌ Service Worker Error:', event.error);
});

self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker Unhandled Rejection:', event.reason);
});

console.log('📱 Service Worker Mobile: Chargé et prêt!');