const multer = require("multer");
const storage = multer.memoryStorage(); // Ensures files are stored in memory
const upload = multer({ storage: storage });
const { uploadFile } = require("../services/fileService");
const fs = require("fs").promises; // Use fs promises for asynchronous operations
const { calculatePrice } = require("../services/pricingService");
const musicSheetController = require("./musicSheetController");
const productService = require("../services/createProductServices");
require("dotenv").config();

// Assuming your route setup might look like this

exports.uploadPDFs = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send("No files uploaded.");
  }

  try {
    const project = {
      shopwareId: "njo32",
      pagesQuantity: 1,
      price: 0,
      singlePrice: 0,
      format: "true",
      paperFormat: 0,
      color: "false",
      projectType: 0,
      bindingType: "true",
      productName: "nicht korrekt",
      hasCover: false,
      productQuantity: 1,
      isUploaded: true,
      isWhitePaper: false,
      step1Valid: false,
      productionTime: "1–3 Tage",
      voices: [],
      notesFile: {
        name: "",
        downloadUrl: "",
      },
      coverFile: {
        name: "",
        downloadUrl: "",
      },
    };
    console.log("Files received:", req.files.length);

    for (let i = 0; i < req.files.length; i++) {
      console.log("ist ist:", i)
      const file = req.files[i];

      try {
        const fileBuffer = await fs.readFile(file.path);
        console.log(file, "file2:");
        if (i === 0) {
          const uploadResult = await uploadFile(fileBuffer, file.originalname);
          project.pagesQuantity = uploadResult.pages;
          project.paperFormat = uploadResult.format.formatID;
          project.format = uploadResult.format.isUpright ? "true" : "false";
          project.notesFile.downloadUrl = uploadResult.downloadUrl;
          project.notesFile.name = file.originalname;
          project.productName = file.originalname;
        } else {
          console.log("voice time")
          newVoice = {
            url: "",
            name: "Stimmen ",
            pages: 12,
            quantity: 1,
            uploadName: "",
            downloadUrl: "",
          };
          // Now pass this buffer to the uploadFile function
          const uploadResult = await uploadFile(fileBuffer, file.originalname);
          newVoice.pages = uploadResult.pages;
          newVoice.downloadUrl = uploadResult.downloadUrl;
          newVoice.name = file.originalname;
          newVoice.uploadName = file.originalname;
          project.voices.push(newVoice);
        }
        await fs.unlink(file.path);
      } catch (error) {
        console.error(`Error processing file ${i}:`, error);
        // Hndle error appropriately

        try {
        } catch (error) {
          console.error(`Error processing file ${i}:`, error);
          // Handle error appropriately
        }
      }
    }
    const result = calculatePrice(project);
    project.price = result.price;
    project.productionTime = result.productionTime;
    project.singlePrice = result.singlePrice;
    console.log("project: ", project);

    const newProduct = await productService.createProduct(project); // Await the promise from the service layer
    project.shopwareId = newProduct.id;
    await musicSheetController.createMusicSheet(project);
    capellaProjectUrl =
      process.env.CORS_ORIGIN +
      "sheet-configuration-v4/?shopwareid=" +
      project.shopwareId;

    res.json({ success: true, productUrl: capellaProjectUrl });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Error uploading files.");
    next(error);
  }
};
