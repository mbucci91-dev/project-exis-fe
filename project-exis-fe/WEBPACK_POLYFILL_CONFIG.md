# Configurazione Webpack per Polyfill Crypto

## Problema

Webpack 5 (usato da Create React App 5.x) non include più automaticamente i polyfill per moduli Node.js core come `crypto`, `stream`, `buffer`, ecc.

Il pacchetto `fernet` richiede il modulo `crypto` che deve essere polyfillato per funzionare nel browser.

## Soluzione Implementata

### 1. Pacchetti Installati

```bash
npm install fernet                                              # Libreria Fernet
npm install --save-dev crypto-browserify                        # Polyfill crypto
npm install --save-dev stream-browserify                        # Polyfill stream
npm install --save-dev buffer                                   # Polyfill buffer
npm install --save-dev process                                  # Polyfill process
npm install --save-dev react-app-rewired                        # Override webpack config
```

### 2. File Creato: `config-overrides.js`

Questo file permette di modificare la configurazione webpack di Create React App senza fare `eject`:

```javascript
const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  
  // Configura i fallback per i moduli Node.js
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer")
  });
  
  config.resolve.fallback = fallback;
  
  // Fornisce variabili globali necessarie
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  
  // Ignora warning per source maps di terze parti
  config.ignoreWarnings = [/Failed to parse source map/];
  
  return config;
};
```

### 3. Modificato: `package.json`

Gli script sono stati aggiornati per usare `react-app-rewired` invece di `react-scripts`:

```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  }
}
```

## Come Usare

### Sviluppo

```bash
npm start
```

### Build Produzione

```bash
npm run build
```

### Test

```bash
npm test
```

## Cosa Fa Questa Configurazione

1. **Resolve Fallback**: Quando webpack incontra `require('crypto')`, usa `crypto-browserify` invece del modulo Node.js nativo

2. **ProvidePlugin**: 
   - Fornisce `process` globalmente senza doverlo importare
   - Fornisce `Buffer` globalmente per compatibilità

3. **IgnoreWarnings**: Sopprime warning fastidiosi relativi alle source map di librerie di terze parti

## Moduli Polyfillati

| Modulo Node.js | Polyfill Browser | Usato da |
|---------------|------------------|----------|
| `crypto` | `crypto-browserify` | fernet, cifratura |
| `stream` | `stream-browserify` | crypto-browserify |
| `buffer` | `buffer` | fernet, encoding |
| `process` | `process/browser` | varie librerie |

## Alternative

### Opzione 1: Eject (Non Raccomandato)

```bash
npm run eject
```

Espone la configurazione webpack ma rende impossibile beneficiare degli aggiornamenti futuri di CRA.

### Opzione 2: CRACO (Alternativa a react-app-rewired)

```bash
npm install @craco/craco
```

CRACO è un'alternativa più moderna a react-app-rewired, ma react-app-rewired è più semplice per questo caso d'uso.

### Opzione 3: Usare Libreria Diversa

Se i polyfill sono troppo pesanti (aggiungono ~300KB al bundle), considerare:
- Implementare Fernet da zero con Web Crypto API
- Usare una libreria più leggera per AES
- Delegare completamente la decifratura al backend

## Performance Impact

### Bundle Size

I polyfill aggiungono peso al bundle finale:

```
crypto-browserify: ~280KB (uncompressed)
stream-browserify: ~40KB
buffer: ~50KB
process: ~5KB
---
Total: ~375KB (uncompressed)
Gzipped: ~95KB
```

### Mitigazioni

1. **Code Splitting**: Carica crypto solo quando necessario
   ```javascript
   const { decryptFernetData } = await import('./utils/crypto');
   ```

2. **Tree Shaking**: Webpack eliminerà codice non usato

3. **Compression**: Abilita gzip/brotli sul server

## Verifica Funzionamento

Dopo la configurazione, verifica che funzioni:

```bash
npm start
```

Se vedi l'app senza errori "Can't resolve 'crypto'", la configurazione è corretta! ✅

## Debug

Se riscontri ancora problemi:

1. **Pulisci cache**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Verifica versioni**:
   ```bash
   npm list react-scripts
   npm list react-app-rewired
   npm list crypto-browserify
   ```

3. **Controlla console**:
   Apri DevTools → Console → cerca errori webpack

4. **Verifica config-overrides.js**:
   Assicurati che il file sia nella root del progetto (stessa cartella di package.json)

## Risorse

- [Create React App - Custom Webpack Config](https://create-react-app.dev/docs/advanced-configuration/)
- [react-app-rewired GitHub](https://github.com/timarney/react-app-rewired)
- [Webpack 5 Migration Guide](https://webpack.js.org/migrate/5/)
- [Node.js Polyfills](https://webpack.js.org/configuration/resolve/#resolvefallback)

---

**Status:** ✅ Configurazione completata e testata
**Compatibilità:** React 19.x, Create React App 5.x, Webpack 5.x
