import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

storageBucket: process.env.FIREBASE_BUCKET
const serviceAccount = path.resolve("firebase-service-account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_BUCKET, 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { admin, db, bucket };
