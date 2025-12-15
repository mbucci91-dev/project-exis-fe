# 🔧 Fix Rapido: Errore "Can't resolve 'crypto'"

## Problema

```
Module not found: Error: Can't resolve 'crypto' in '.../node_modules/fernet'
BREAKING CHANGE: webpack < 5 used to include polyfills...
```

## Soluzione (5 minuti)

### 1️⃣ Installa i pacchetti necessari

```bash
npm install --save-dev crypto-browserify stream-browserify buffer process react-app-rewired
```

### 2️⃣ Crea il file `config-overrides.js` nella root del progetto

```javascript
const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  
  Object.assign(fallback, {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer")
  });
  
  config.resolve.fallback = fallback;
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer']
    })
  ]);
  
  config.ignoreWarnings = [/Failed to parse source map/];
  
  return config;
};
```

### 3️⃣ Modifica `package.json`

Sostituisci nella sezione `scripts`:

```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test"
  }
}
```

### 4️⃣ Riavvia il server

```bash
npm start
```

## ✅ Fatto!

L'errore dovrebbe essere risolto. L'app ora può usare la libreria `fernet` per la decifratura.

---

**Perché serve?**  
Webpack 5 non include più automaticamente i polyfill Node.js. Il pacchetto `fernet` usa `crypto` che deve essere polyfillato manualmente.

**Più dettagli:** Vedi `WEBPACK_POLYFILL_CONFIG.md`
