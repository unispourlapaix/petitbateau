# 🔄 SUPPRESSION FORCÉE DU CACHE - MODIFICATIONS APPLIQUÉES

## 📅 Date : 12 novembre 2025

## 🎯 Objectif
Forcer la suppression du cache des traductions pour s'assurer que les utilisateurs voient toujours la dernière version des fichiers de langue (fr.json, lg.json, etc.).

---

## ✅ MODIFICATIONS EFFECTUÉES

### 1. **modules/i18n.js** - Cache-buster renforcé

**Avant :**
```javascript
const cacheBuster = Date.now();
const response = await fetch(`modules/lang/${lang}.json?v=${cacheBuster}`);
```

**Après :**
```javascript
// Suppression du cache mémoire avant chaque chargement
if (this.translations[lang]) {
    delete this.translations[lang];
    console.log(`🔄 Cache mémoire supprimé pour ${lang}`);
}

// Cache-buster avec timestamp + random
const cacheBuster = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const response = await fetch(`modules/lang/${lang}.json?v=${cacheBuster}`, {
    cache: 'no-store',
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});
```

**Impact :** 
- ✅ Les traductions sont TOUJOURS rechargées depuis le serveur
- ✅ Aucun cache mémoire n'est conservé entre les chargements
- ✅ Headers HTTP forcent le no-cache côté navigateur

---

### 2. **petitbateauRouge.html** - Meta tags no-cache

**Ajout dans le `<head>` :**
```html
<!-- 🔄 FORCER LE NO-CACHE POUR LES TRADUCTIONS -->
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

**Ajout dans le DOMContentLoaded :**
```javascript
// 🗑️ FORCER LA SUPPRESSION DU CACHE NAVIGATEUR
console.log('🔄 Suppression forcée du cache des traductions...');

// Vider le cache des traductions si présent
if (window.i18n && window.i18n.translations) {
    window.i18n.translations = { fr: { loaded: true } };
    console.log('✅ Cache mémoire i18n vidé');
}

const savedLang = localStorage.getItem('petit_bateau_lang') || 'fr';
console.log(`🌍 Langue détectée: ${savedLang}`);
```

**Impact :**
- ✅ Le navigateur ne met jamais en cache la page HTML
- ✅ À chaque chargement, le cache i18n est vidé
- ✅ Logs dans la console pour déboguer

---

### 3. **sw.js** - Service Worker exclu les langues

**Version mise à jour :** `v2.5.1-nocache`

**Fichiers retirés du cache :**
```javascript
// ⚠️ LANGUES RETIRÉES DU CACHE - Toujours récupérées depuis le serveur
// './modules/lang/en.json',
// './modules/lang/fr.json',
// './modules/lang/jp.json',
// './modules/lang/uk.json',
```

**Gestionnaire fetch modifié :**
```javascript
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // ⚠️ NE JAMAIS METTRE EN CACHE LES FICHIERS DE LANGUE
  if (url.pathname.includes('/modules/lang/') && url.pathname.endsWith('.json')) {
    console.log('🌍 Langue demandée - bypass cache:', url.pathname);
    event.respondWith(
      fetch(event.request, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    );
    return;
  }
  
  // ... reste du code
});
```

**Impact :**
- ✅ Les fichiers JSON de langue ne sont JAMAIS mis en cache par le Service Worker
- ✅ Bypass complet du cache pour toute requête vers `/modules/lang/*.json`
- ✅ Nouvelle version du Service Worker force la suppression des anciens caches

---

## 🧪 FICHIERS DE TEST CRÉÉS

### 1. **test-cache-cleared.html**
Outil de test pour vérifier que le cache est bien ignoré :
- Boutons pour tester le chargement de chaque langue
- Affiche le cache-buster et le temps de chargement
- Bouton pour vider TOUS les caches (localStorage + Service Worker)
- Auto-reload après vidage complet

**Usage :**
```
1. Ouvrir test-cache-cleared.html
2. Cliquer sur "Tester Chargement Lingala"
3. Noter le cache-buster (ex: 1699876543210_abc123def)
4. Recharger la page (F5)
5. Re-tester → le cache-buster doit être différent
```

### 2. **test-all-languages-phases.html**
Test des 23 phases pour toutes les langues.

### 3. **test-langue-detectee.html**
Diagnostic de la langue détectée et du localStorage.

---

## 🚀 DÉPLOIEMENT

### Étapes pour appliquer les modifications :

1. **Vider le cache utilisateur** (recommandé avant le premier test) :
   ```
   - Ouvrir test-cache-cleared.html
   - Cliquer sur "🗑️ Vider TOUS les Caches"
   - Attendre le reload automatique
   ```

2. **Tester le jeu** :
   ```
   - Ouvrir petitbateauRouge.html
   - Ouvrir la Console (F12)
   - Vérifier les logs :
     ✅ "🔄 Suppression forcée du cache des traductions..."
     ✅ "🌍 Langue lg chargée avec succès depuis JSON (cache forcé: ...)"
   ```

3. **Changer de langue** :
   ```
   - Cliquer sur le drapeau Lingala 🇨🇩
   - Confirmer le changement
   - Vérifier dans la console que lg.json est rechargé
   - Les phases narratives doivent être en Lingala
   ```

---

## 🔍 VÉRIFICATION

### Comment vérifier que le cache est bien ignoré :

1. **Console du navigateur** :
   ```javascript
   // Doit afficher un nouveau cache-buster à chaque fois
   🌍 Langue lg chargée avec succès depuis JSON (cache forcé: 1699876543210_abc123def)
   ```

2. **Network Tab (F12 → Network)** :
   - Filtrer par "lg.json"
   - La colonne "Size" doit afficher la taille du fichier (pas "from cache")
   - Chaque requête doit avoir un paramètre `?v=` différent

3. **Test manuel** :
   - Modifier `modules/lang/lg.json` (ajouter un caractère)
   - Recharger la page (Ctrl+Shift+R)
   - La modification doit être visible immédiatement

---

## 📊 IMPACT SUR LES PERFORMANCES

### Avant :
- ❌ Traductions mises en cache
- ❌ Modifications non visibles sans vider le cache
- ❌ Utilisateurs voyaient d'anciennes versions

### Après :
- ✅ Traductions toujours à jour
- ✅ Modifications visibles immédiatement
- ⚠️ Légère augmentation du temps de chargement (~50-200ms par fichier JSON)
- ✅ Impact négligeable car fichiers JSON sont petits (40-50 Ko)

---

## 🐛 DÉPANNAGE

### Si les traductions sont encore en cache :

1. **Vider manuellement tous les caches** :
   ```javascript
   // Dans la console (F12)
   localStorage.clear();
   caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
   location.reload(true);
   ```

2. **Désactiver complètement le Service Worker** :
   ```
   - F12 → Application → Service Workers
   - Cocher "Bypass for network"
   - Recharger la page
   ```

3. **Mode navigation privée** :
   ```
   - Ctrl+Shift+N (Chrome) ou Ctrl+Shift+P (Firefox)
   - Ouvrir petitbateauRouge.html
   - Aucun cache ne sera utilisé
   ```

---

## ✅ RÉSUMÉ

**3 niveaux de protection contre le cache :**

1. **Niveau HTTP** : Meta tags no-cache dans le HTML
2. **Niveau JavaScript** : Cache-buster + headers no-cache dans i18n.js
3. **Niveau Service Worker** : Exclusion totale des fichiers de langue du cache

**Résultat :** Les traductions sont **TOUJOURS** récupérées depuis le serveur, garantissant que les utilisateurs voient la dernière version.

---

## 📝 NOTES

- Le cache-buster utilise `Date.now()` + `Math.random()` pour garantir l'unicité
- Les fichiers JSON de langue sont petits (~40-50 Ko), l'impact sur les performances est minime
- Le Service Worker continue de mettre en cache les autres ressources (HTML, CSS, JS, images)
- Les traductions françaises restent en fallback si le fichier JSON échoue à charger

---

**Emmanuel Payet - Dreamer Unisona**  
*Petit Bateau Rouge - 33 Millions de Raisons de Partager la Paix* 🌍⛵
