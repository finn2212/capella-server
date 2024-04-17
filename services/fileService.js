// fileService.js
const { supabase } = require('../supabase-config');
const { PDFDocument } = require('pdf-lib');

const uploadFile = async (fileBuffer, originalName) => {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const pages = pdfDoc.getPages().length;

    // Upload the file to Supabase Storage
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(originalName, fileBuffer, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw new Error(error.message);

    // Generate a public URL for the uploaded file
    const { publicURL, error: urlError } = supabase.storage
      .from('uploads')
      .getPublicUrl(data.Key);

      console.log(data)

    if (urlError) throw new Error(urlError.message);

    return {
      message: 'File uploaded successfully',
      pages: pages,
      downloadUrl: publicURL
    };
  } catch (error) {
    console.error('Failed to upload file:', error);
    throw new Error('Failed to upload file');
  }
};

module.exports = { uploadFile };
