const { supabase } = require("../supabase-config");

exports.createMusicSheet = async (musicSheetProject) => {
  // Log the incoming object for debugging
  console.log("Received musicSheetProject:", musicSheetProject);

  // Check if shopwareId is present and not empty
  if (!musicSheetProject.shopwareId) {
    throw new Error("shopwareId is required and cannot be empty.");
  }

  // Prepare the object for insertion with lowercase keys
  const dbEntry = {
    shopwareid: musicSheetProject.shopwareId,
    pagesquantity: musicSheetProject.pagesQuantity,
    price: musicSheetProject.price.replace(",", "."),
    singleprice: musicSheetProject.singlePrice.replace(",", "."),
    format: musicSheetProject.format,
    paperformat: musicSheetProject.paperFormat,
    color: musicSheetProject.color,
    projecttype: musicSheetProject.projectType,
    bindingtype: musicSheetProject.bindingType,
    productname: musicSheetProject.productName,
    hascover: musicSheetProject.hasCover, // Convert from string to boolean if necessary
    productquantity: musicSheetProject.productQuantity,
    isuploaded: musicSheetProject.isUploaded,
    iswhitepaper: musicSheetProject.isWhitePaper,
    step1valid: musicSheetProject.step1Valid,
    productiontime: musicSheetProject.productionTime,
    notesfile: musicSheetProject.notesFile, // Assuming notesFile is already a proper object
    coverfile: musicSheetProject.coverFile,
  };

  // Attempt to insert the processed data into the database
  const { data, error } = await supabase
    .from("musicsheetprojects")
    .insert([dbEntry]);

  if (error) {
    console.error("Error inserting data into musicsheetprojects:", error);
    throw error; // Rethrow or handle as needed
  }

  return { success: true, data };
};

exports.getMusicSheetByShopwareId = async (req, res) => {
  try {
    const { shopwareId } = req.params;
    const { data, error } = await supabase
      .from("musicsheetprojects")
      .select("*")
      .eq("shopwareid", shopwareId); // Ensure this is the correct field name as per your DB schema

    if (error) throw error;
    if (data.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Music sheet not found" });
    }

    // Transform the data to match the original format
    const formattedData = data.map((item) => ({
      shopwareId: item.shopwareid,
      pagesQuantity: item.pagesquantity,
      price: parseFloat(item.price).toFixed(2).replace(".", ","), // Assuming price is stored as a string in the DB
      singlePrice: parseFloat(item.singleprice).toFixed(2).replace(".", ","),
      format: item.format,
      paperFormat: item.paperformat,
      color: item.color,
      projectType: item.projecttype,
      bindingType: item.bindingtype,
      productName: item.productname,
      hasCover: item.hascover,
      productQuantity: item.productquantity,
      isUploaded: item.isuploaded,
      isWhitePaper: item.iswhitepaper,
      step1Valid: item.step1valid,
      productionTime: item.productiontime,
      notesFile: item.notesfile,
      coverFile: item.coverfile,
    }));

    res.json({ success: true, musicSheet: formattedData[0] });
  } catch (error) {
    console.error("Error retrieving music sheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve music sheet",
      error: error.message,
    });
  }
};

exports.updateMusicSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase
      .from("musicsheetprojects")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    if (data.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Music sheet not found" });

    res.json({ success: true, musicSheet: data[0] });
  } catch (error) {
    console.error("Error updating music sheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update music sheet",
      error: error.message,
    });
  }
};

exports.deleteMusicSheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("musicsheetprojects")
      .delete()
      .eq("id", id);

    if (error) throw error;
    if (data.length === 0)
      return res
        .status(404)
        .json({ success: false, message: "Music sheet not found" });

    res.json({ success: true, message: "Music sheet deleted successfully" });
  } catch (error) {
    console.error("Error deleting music sheet:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete music sheet",
      error: error.message,
    });
  }
};

exports.getAllMusicSheets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("MusicSheetProjects")
      .select("*");

    if (error) throw error;
    res.json({ success: true, musicSheets: data });
  } catch (error) {
    console.error("Error retrieving all music sheets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve music sheets",
      error: error.message,
    });
  }
};
