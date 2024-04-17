const express = require('express');
const multer = require('multer');
const { uploadFileController } = require('../controllers/uploadController');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('upload'), (req, res, next) => {
    console.log("Route /upload accessed");
    next();
  }, uploadFileController);
  

module.exports = router;
