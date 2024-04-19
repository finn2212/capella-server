const { supabase } = require("../supabase-config");
const { PDFDocument, waitForTick } = require("pdf-lib");

const formats = {
  A4: {
    width: 595.28,
    height: 841.89,
    id: 1,
    tolerance: { width: 595.28 * 0.05, height: 841.89 * 0.05 },
  },
  Klavierauszug: {
    width: 556.3,
    height: 783.46,
    id: 2,
    tolerance: { width: 556.3 * 0.05, height: 783.46 * 0.05 },
  },
  Concert: {
    width: 662.89,
    height: 881.89,
    id: 3,
    tolerance: { width: 662.89 * 0.05, height: 881.89 * 0.05 },
  },
  B4: {
    width: 725.01,
    height: 1018.11,
    id: 4,
    tolerance: { width: 725.01 * 0.05, height: 1018.11 * 0.05 },
  },
  A3: {
    width: 858.27,
    height: 1204.72,
    id: 5,
    tolerance: { width: 858.27 * 0.05, height: 1204.72 * 0.05 },
  },
  Dirigierpartitur: {
    width: 909.45,
    height: 1320.47,
    id: 6,
    tolerance: { width: 909.45 * 0.05, height: 1320.47 * 0.05 },
  },
};

const uploadFile = async (fileBuffer, originalName) => {
  try {
    try {
      // Attempt to upload the file to Supabase Storage
      await uploadAction(fileBuffer, originalName);
    } catch (error) {
      if (!error.message.includes("resource already exists")) {
        throw error; // Re-throw if error is not because the resource already exists
      }
      // If the file already exists, the flow continues to fetch the URL
    }

    const downloadUrl = await getDownloadUrl(originalName);
    const { matchedFormat, pages } = await checkPdfData(fileBuffer);
    return {
      message: "File uploaded successfully",
      pages: pages,
      downloadUrl: downloadUrl,
      format: matchedFormat,
    };
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw new Error("Failed to upload file");
  }
};

const uploadAction = async (fileBuffer, originalName) => {
  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(originalName, fileBuffer, {
      upsert: true,
      contentType: "application/pdf",
    });
  if (error) {
    throw error;
  }
};

const getDownloadUrl = async (originalName) => {
  const { data } = supabase.storage.from("uploads").getPublicUrl(originalName);
  return data.publicUrl;
};

async function checkPdfData(fileBuffer) {
  const pdfDoc = await PDFDocument.load(fileBuffer);
  const pages = pdfDoc.getPages().length;
  const matchedFormat = await checkPdfFormat(fileBuffer);  // Placeholder for actual format checking logic
  return { matchedFormat, pages };
}

async function checkPdfFormat(fileBuffer) {
  try {
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const numPages = pdfDoc.getPageCount();

    let formatMatches = [];
    let orientations = [];
    let formatID = 0; // ID of the matched format

    for (let i = 0; i < numPages; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();

      const orientation = width > height ? false : true;
      orientations.push(orientation); // Add orientation for each page

      // Compare each format with tolerance
      let matched = false;
      for (const [formatName, { width: fmtWidth, height: fmtHeight, tolerance, id }] of Object.entries(formats)) {
        if (Math.abs(width - fmtWidth) <= tolerance.width && Math.abs(height - fmtHeight) <= tolerance.height) {
          formatMatches.push(formatName);
          formatID = id; // Store the ID of the matched format
          matched = true;
          break; // Stop checking if a match is found
        }
      }
      if (!matched) formatMatches.push("No match found");
    }

    return {
      message: numPages === formatMatches.length ? "All pages match specified formats" : "Not all pages match specified formats",
      matchedFormat: formatMatches[0], // Assuming the first page's format applies to all for simplicity
      formatID: formatID,
      isUpright: orientations[0]// Return the ID of the matched format
    };
  } catch (error) {
    console.error("Error loading or analyzing PDF:", error);
    throw error;
  }
}

module.exports = { uploadFile };
