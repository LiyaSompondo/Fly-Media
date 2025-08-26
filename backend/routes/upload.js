const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const ruoter = express.Router();

//Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); //uploads folder
    },
    filename: function(req, file,cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9 );
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

//file upload
router.post('/', upload.single('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({message: 'File not uploaded' });
    }
    const uploadedFiles = req.files.map(file => ({
        originalName: file.originalname,
        storeName: file.filename,
        path: file.path,
    }));

    res.status(200).json({
        message: 'File uploaded successfully',
        files: uploadedFiles,
    });
});

module.exports = router;