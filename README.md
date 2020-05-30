# Sporen Zoeker

### Project setup

Add `src/firebase.js` with underneath content.

```js
import firebase from 'firebase/app'

var firebaseConfig = {
  apiKey: /* apiKey */,
  authDomain: /* authDomain */,
  databaseURL: /* databaseURL */,
  projectId: /* projectId */,
  storageBucket: /* storageBucket */,
  messagingSenderId: /* messagingSenderId */,
  appId: /* appId */
}

firebase.initializeApp(firebaseConfig)
```

Add `.env.local` with mapbox api-key 

```
VUE_APP_MAPBOX_KEY=pk.eyJ1..
```