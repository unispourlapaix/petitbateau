const CACHE_NAME = 'petit-bateau-v1.1.0'; // Nouvelle version pour mise à jour des icônes
const urlsToCache = [
  './petitbateauRouge.html',
  './manifest.json',
  // Ajouter les nouvelles icônes au cache
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  './modules/audio-manager.js',
  './modules/corbeau-module.js',
  './modules/game-manager.js',
  './modules/i18n.js',
  './modules/index.js',
  './modules/info-auteur.js',
  './modules/kawaii_objects_module.js',
  './modules/language-selector.js',
  './modules/narration-bridge.js',
  './modules/narration-data.json',
  './modules/narration-manager.js',
  './modules/phase-bonus-mur.js',
  './modules/phase1-intro.js',
  './modules/phase2-exploration.js',
  './modules/phase3-revelation.js',
  './modules/saisonefect.js',
  './modules/secret-mode.js',
  './modules/supabase-scores.js',
  './modules/config/game-config.js',
  './modules/graphics/boat-renderer.js',
  './modules/graphics/environment-renderer.js',
  './modules/graphics/heart-renderer.js',
  './modules/graphics/lantern-renderer.js',
  './modules/lang/en.json',
  './modules/lang/fr.json',
  './modules/lang/jp.json',
  './modules/lang/uk.json',
  './modules/styles/ui-styles.css',
  './modules/systems/chapter-manager.js',
  './modules/systems/corbeau-system.js',
  './modules/systems/particle-system.js',
  './modules/systems/scoring-system.js',
  './modules/translations/fr.json'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  console.log('🔧 Installation du Service Worker Petit Bateau');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Mise en cache des ressources');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Installation terminée');
        self.skipWaiting();
      })
      .catch(error => {
        console.error('❌ Erreur lors de l\'installation:', error);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  console.log('🚀 Activation du Service Worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression du cache obsolète:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Activation terminée');
      self.clients.claim();
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourner la ressource mise en cache si disponible
        if (response) {
          return response;
        }

        // Sinon, récupérer depuis le réseau
        return fetch(event.request).then(response => {
          // Vérifier si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cloner la réponse pour la mise en cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // En cas d'erreur, afficher une page d'erreur personnalisée
        if (event.request.destination === 'document') {
          return caches.match('./petitbateauRouge.html');
        }
        // Pour les autres ressources, retourner une réponse vide
        return new Response('{}', {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      })
  );
});

// Gestion des messages depuis l'application
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({version: CACHE_NAME});
  }
});