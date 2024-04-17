const { uploadFile } = require('../services/fileService');

const uploadFileController = async (req, res) => {
    console.log("upload start")
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const { originalname, buffer } = req.file;
    const uploadResult = await uploadFile(buffer, originalname);

    res.status(200).json(uploadResult);
  } catch (error) {
    console.error('Error in uploadFileController:', error);
    res.status(500).send(error.message);
  }
};

module.exports = { uploadFileController };
