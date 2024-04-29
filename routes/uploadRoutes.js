const express = require('express');
const multer = require('multer');
const { uploadFileController } = require('../controllers/uploadController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

// This route now effectively becomes /api/upload
router.post('/upload', upload.single('upload'), (req, res, next) => {
    next();
}, uploadFileController);


module.exports = router;
