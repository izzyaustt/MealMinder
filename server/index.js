import express from "express";
import cors from "cors";
import multer from "multer";
import { detectText } from "./vision.js";
import admin from "firebase-admin";
import dotenv from "dotenv"
import path from "path"

//config the .env file to get credentials
dotenv.config();

//setting up app
const app = express();
app.use(cors());
var corsOptions = {
  origin: `${process.env.CORSORIGIN}`,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(express.json());

// file uploads frrom multer
const upload = multer({ dest: "uploads/" });

//temp list for testing
let fridgeItems = [
  { name: "Milk", expiration: "2025-10-30" },
  { name: "Eggs", expiration: "2025-11-02" },
  { name: "Bananas", expiration: "2025-10-28" },
];

//firebase admin sdk setup
<<<<<<< HEAD
import serviceAccount from "./firebase-service-account.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_BUCKET
=======
import serviceAccount from "./firebase-key.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
});

//middleware to verify firebase token :p
async function verifyFirebaseToken(req, res, next){
    const authHeader = reqheaders.authorization;
    if(!authHeader) return res.status(401).send("Missing Auth header");

    const token = authHeader.split(" ")[1];
    try{
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;
        next();
    }catch (e) {
        console.error(e);
        res.status(401).status("invalid token");
    }
}

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

//ROUTESSS
// upload route adding ocr
<<<<<<< HEAD
app.post("/upload", cors(corsOptions), /*verifyFirebaseToken,*/ upload.single("receipt"), async (req, res) => {
    try{

        const filePath = req.file.path;

        //calling ocr 
        const extractedLines = await detectText(filePath);

        //convert lines to items
        const extractedItems = extractedLines.map(line => ({
            name: line,
            expiration: "2025-11-03",
        }));

        fridgeItems.push(...extractedItems);

=======
app.post("/upload", verifyFirebaseToken, upload.single("receipt"), async (req, res) => {
    try{
        const filePath = req.file.path;

        //calling ocr 
        const extractedLines = await detectText(filePath);

        //convert lines to items
        const extractedItems = extractedLines.map(line => ({
            name: line,
            expiration: "2025-11-03",
        }));

        fridgeItems.push(...extractedItems);

>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
        res.json({ message: "ocr complete", extractedItems, fridgeItems, });
    }catch(err){
    console.error(err);
    res.status(500).json({error: "OCR failed", details: err.message,});
    }
});

<<<<<<< HEAD
app.get("/mock-items", /*verifyFirebaseToken*/ (req,res) => {
=======
app.get("/mock-items", verifyFirebaseToken, (req,res) => {
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
    res.json(fridgeItems);
});

//adding an item
<<<<<<< HEAD
app.post("/add-item", /*verifyFirebaseToken*/ (req,res) => {
=======
app.post("/add-item", verifyFirebaseToken, (req,res) => {
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
    const { name, expiration } =req.body;
    if(!name || !expiration){
        return res.status(400).json({error: "Name and expiration required!"});

    }
    fridgeItems.push({name, expiration});
    res.json({message: "item added!", fridgeItems});
});

//deleting an item
<<<<<<< HEAD
app.delete("/delete-item/:name", /*verifyFirebaseToken*/ (req, res) => {
=======
app.delete("/delete-item/:name", verifyFirebaseToken, (req, res) => {
>>>>>>> 90d7907e609d7c45cc8145a9582d971783e49bec
    const {name} = req.params;
    fridgeItems = fridgeItems.filter( item => item.name !== name);
    res.json({messgae: "Items deleted!", fridgeItems});
})


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));