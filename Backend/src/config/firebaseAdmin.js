const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth"); 

let adminApp = null;
let initializedSuccessfully = false;

try {
  if (getApps().length === 0) {
    const base64Config = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

    if (!base64Config) {
      throw new Error("FIREBASE_SERVICE_ACCOUNT_B64 variable is missing from your configuration!");
    }

    
    const decodedJsonString = Buffer.from(base64Config, "base64").toString("utf8");
    const serviceAccountObject = JSON.parse(decodedJsonString);

    adminApp = initializeApp({
      credential: cert(serviceAccountObject) 
    });
    
    initializedSuccessfully = true;
    console.log("Firebase Admin SDK initialized successfully ");
  } else {
    adminApp = getApp();
    initializedSuccessfully = true;
  }
} catch (error) {
  console.error("Critical Error initializing Firebase Admin:", error.message);
}

module.exports = {
  app: adminApp,
  get auth() {
    if (!initializedSuccessfully || !adminApp) {
      throw new Error("Cannot access Firebase Auth because the Admin SDK failed to boot.");
    }
    return getAuth(adminApp);
  }
};
