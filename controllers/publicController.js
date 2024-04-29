const multer = require('multer');
const storage = multer.memoryStorage(); // Ensures files are stored in memory
const upload = multer({ storage: storage });
const { uploadFile } = require('../services/fileService');
const fs = require('fs').promises; // Use fs promises for asynchronous operations
const productsController = require("./productsController");


// Assuming your route setup might look like this


exports.uploadPDFs = async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    try {
      const project = {
        shopwareId: "njo",
        pagesQuantity: 0,
        price: 0,
        singlePrice: 0,
        format: "",
        paperFormat: 0,
        color: "false",
        projectType: 0,
        bindingType: "true",
        productName: "",
        hasCover: false,
        productQuantity: 0,
        isUploaded: true,
        isWhitePaper: false,
        step1Valid: false,
        productionTime: "1–3 Tage",
        voices: [],
        notesFile: {
          name: "",
          downloadUrl: ""
        },
        coverFile: {
          name: "",
          downloadUrl: ""
        }
      }
        console.log("Files received:", req.files.length);

        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          console.log(file);
      
          try {
              // Read the file into a buffer
              const fileBuffer = await fs.readFile(file.path);
      
              // Now pass this buffer to the uploadFile function
              const uploadResult = await uploadFile(fileBuffer, file.originalname);
              console.log(`Upload result for file ${i}:`, uploadResult);
              project.pagesQuantity = uploadResult.pages;
              project.paperFormat = uploadResult.format.formatID;
              project.format = uploadResult.format.isUpright;
              project.notesFile.downloadUrl = uploadResult.downloadUrl;
              project.notesFile.productName = file.originalname;

      
              // Optionally delete the file after upload if it's no longer needed
              await fs.unlink(file.path);
          } catch (error) {
              console.error(`Error processing file ${i}:`, error);
              // Handle error appropriately
          }
      }
      const price = await productsController.calculatePrice(
        project
      );
      console.log(price, "price")

        res.send({ message: 'Files uploaded successfully!' });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).send('Error uploading files.');
        next(error);
    }
};


