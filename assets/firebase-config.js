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
  // kt-ai-learn-primarychinese3b Firebase project's web app config. Not a
  // secret — this just identifies which Firebase project the site talks to;
  // access is enforced by firestore.rules, not by hiding this value.
  window.FIREBASE_CONFIG = {
    apiKey: "AIzaSyBJLkUxThyOGckHlXpoxtz_EZsZb_VpLvc",
    authDomain: "kt-ai-learn-primarychinese3b.firebaseapp.com",
    projectId: "kt-ai-learn-primarychinese3b",
    storageBucket: "kt-ai-learn-primarychinese3b.firebasestorage.app",
    messagingSenderId: "220356593792",
    appId: "1:220356593792:web:286abdb5524ff37ce5fe65",
  };
}
