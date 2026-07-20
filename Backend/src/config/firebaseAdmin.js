const { initializeApp, cert, getApps, getApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth"); 
const path = require("path");

let adminApp;

try {
  const serviceAccountPath = path.resolve(__dirname, "../../firebase.json");
  const serviceAccount = require(serviceAccountPath);

  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount)
    });
    console.log("Firebase Admin SDK initialized successfully");
  } else {
    adminApp = getApp();
  }
} catch (error) {
  console.error("Error initializing Firebase Admin:", error.message);
}

module.exports = {
  app: adminApp,
  auth: () => getAuth(adminApp) 
};
