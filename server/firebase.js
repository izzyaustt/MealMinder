import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";


dotenv.config();

const storageBucket = process.env.FIREBASE_BUCKET
const serviceAccount = path.resolve("firebase-service-account.json");
console.log(`storage bucket is ${storageBucket}`)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: storageBucket, 
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { admin, db, bucket };
