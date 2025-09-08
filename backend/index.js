import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import notificationsRouter from './notifications.js';


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/notifications', notificationsRouter);

app.get("/", (req, res) => {
  res.send("Hello from Fly Media");
});

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Upload file route
app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ fileName: req.file.filename, filePath: `/uploads/${req.file.filename}` });
});

// Serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Get all uploaded files
app.get("/files", (req, res) => {
  fs.readdir("uploads", (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Unable to read uploaded files" });
    }
    res.json(files);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
