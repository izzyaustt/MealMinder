import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

// file uploads frrom multer
const upload = multer({ dest: "uploads/" });

//temp list for testing
let fridgeItems = [
  { name: "Milk", expiration: "2025-10-30" },
  { name: "Eggs", expiration: "2025-11-02" },
  { name: "Bananas", expiration: "2025-10-28" },
];

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

//ROUTESSS
// upload route
app.post("/upload", upload.single("receipt"), (req, res) => {
  console.log("uploaded file:", req.file);
  res.json({ message: "File received!", file: req.file, items: fridgeItems, });
});

app.get("/mock-items", (req,res) => {
    res.json(fridgeItems);
});

//adding an item
app.post("/add-item", (req,res) => {
    const { name, expiration } =req.body;
    if(!name || !expiration){
        return res.status(400).json({error: "Name and expiration required!"});

    }
    fridgeItems.push({name, expiration});
    res.json({message: "item added!", fridgeItems});
});

//deleting an item
app.delete("/delete-item/:name", (req, res) => {
    cost {name} = req.params;
    fridgeItems = fridgeItems.filtetr( item => item.name !== name);
    res.json({messgae: "Items deleted!", fridgeItems});
})


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));