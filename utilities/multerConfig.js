// File: utilities/multerConfig.js
const multer = require('multer');

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    console.log("Handling file:", file.originalname);
    cb(null, './uploads'); // Ensure this directory exists
  },
  filename: function(req, file, cb) {
    const newFilename = `${Date.now()}-${file.originalname}`;
    console.log("Saving file as:", newFilename);
    cb(null, newFilename);
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 } // 10MB file size limit
})

module.exports = upload;
