import vision from "@google-cloud/vision";
import path from "path";

const keyPath = path.resolve("./firebase-service-account.json");

const client = new vision.ImageAnnotatorClient({
    keyFilename: keyPath,

});

export async function detectText(filePath){
    const [result] = await client.textDetection(filePath);
    const detections = result.textAnnotations;
    if (!detections || detections.length === 0) return [];
    //first element is the full text
    const fullText = detections[0].description;
    const lines = fullText.split("\n").filter(Boolean);
    return lines; //return each line as an item
}