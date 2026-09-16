// When running on localhost, the app talks to local Firebase emulators
// instead of a real project, so the site is safe to develop against without
// touching production data. Set to false to always use the real project.
window.FIREBASE_USE_EMULATOR =
  location.hostname === "localhost" || location.hostname === "127.0.0.1";

if (window.FIREBASE_USE_EMULATOR) {
  // Fake config used only against the local emulator suite (see README) —
  // the emulator does not validate these values against a real project.
  window.FIREBASE_CONFIG = {
    apiKey: "demo-key",
    authDomain: "demo-3b-vocab.firebaseapp.com",
    projectId: "demo-3b-vocab",
    storageBucket: "demo-3b-vocab.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000",
  };
} else {
  // TODO: replace with this project's OWN Firebase project's web app config
  // (a separate Firebase project from the 4B site, per the plan for this
  // repo). See FIREBASE_SETUP.md for step-by-step instructions on creating
  // the project and finding these values. Not a secret — this just
  // identifies which Firebase project the site talks to; access is enforced
  // by firestore.rules, not by hiding this value.
  window.FIREBASE_CONFIG = {
    apiKey: "REPLACE_ME",
    authDomain: "REPLACE_ME.firebaseapp.com",
    projectId: "REPLACE_ME",
    storageBucket: "REPLACE_ME.firebasestorage.app",
    messagingSenderId: "REPLACE_ME",
    appId: "REPLACE_ME",
  };
}
