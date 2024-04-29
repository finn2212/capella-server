const propertyMappings = require("../shared/propertyMappings");
const axios = require("axios");
require("dotenv").config();

exports.createProduct = async (musicSheetProject) => {
  try {
    // Call the function to construct the product data from the provided project details
    //const productData = getProductData(musicSheetProject);
    const accessToken = await authenticate();
    console.log(musicSheetProject, "creating with:")
    productData = getProductData(musicSheetProject);

    await createProduct(accessToken, productData);
    const response = await fetchProduct(productData.productNumber);

    const newProduct = response.elements[0];
    console.log(`Product created with ID:`, newProduct);
    return newProduct;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw error;
  }
};

const getProductData = (musicSheetProject) => {
  const propertiesIds = getProperties(musicSheetProject); // Placeholder for your actual properties fetching logic
  const productNumber = createUID();
  const desc = getDesc(musicSheetProject);
  const weight = 0.88; // Assuming weight is a property of musicSheetProject
  const priceAsFloat = parseFloat(musicSheetProject.singlePrice);
  return {
    name: musicSheetProject.productName,
    productNumber: productNumber,
    properties: propertiesIds,
    stock: 10,
    taxId: "49ad39168485457a836441d13c6bd473",
    active: true,
    keywords: "2212",
    description: desc,
    weight: weight,
    media: [
      {
        id: "6bd19a84161f44e3b7efb37e835c5ec2",
        mediaId: "b1c75efd9ff24aee9fc6338c6b175cdc",
        position: 0,
        url: "https://s23511.creoline.cloud/media/9b/e6/96/1687422934/capellaProduct.jpeg",
      },
    ],
    coverId: "6bd19a84161f44e3b7efb37e835c5ec2",
    price: [
      {
        currencyId: "b7d2554b0ce847cd82f3ac9bd1c0dfca",
        gross: priceAsFloat, // Convert to integer cents
        net: priceAsFloat,
        linked: false,
      },
    ],
    customFields: {
      custom_paperformat_: "123",
      custom_paperFormat: "123",
    },
    visibilities: [
      {
        salesChannelId: "fac913bddf1244098e07a811fd301f75",
        visibility: 30,
      },
    ],
  };
};

const createUID = () => {
  return `uid-${Date.now().toString(36)}${Math.random()
    .toString(36)
    .substr(2)}`;
};

const getDesc = (musicSheetProject) => {
  let desc = `<span>Projekt Name: ${musicSheetProject.productName}</span><br/>`;
  // Assuming files is an array in musicSheetProject, each file has a downloadUrl property
  if (musicSheetProject.notesFile && musicSheetProject.notesFile.downloadUrl) {
    desc += `<span>Link: <a href="${musicSheetProject.notesFile.downloadUrl}">Download Notenheft</a></span><br/>`;
  }
  if (musicSheetProject.coverFile && musicSheetProject.coverFile.downloadUrl) {
    desc += `<span>Link: <a href="${musicSheetProject.coverFile.downloadUrl}">Download Umschlag</a></span><br/>`;
  }
  desc += `<span>Seitenzahl: ${musicSheetProject.pagesQuantity}</span><br/><p>\n</p>`;

  musicSheetProject.voices.forEach((voice) => {
    desc +=
      `<span>Stimmenbezeichnung: ${voice.name}</span><br/>` +
      `<span>Link: <a href="${voice.downloadUrl}">Download</a></span><br/>` +
      `<span>Seitenanzahl Inhalt: ${voice.pages}</span><br/>` +
      `<span>Exemplare pro Set: ${voice.quantity}</span><br/><p>\n</p>`;
  });

  return desc;
};

const getProperties = (musicSheetProject) => {
  let ids = [];
  const formatKey = musicSheetProject.format ? "true" : "false";
  const colorKey = musicSheetProject.color ? "true" : "false";
  const bindingTypesKey = musicSheetProject.bindingType ? "true" : "false";
  const envelopesKey = musicSheetProject.hasCover ? "true" : "false";
  const paperTypeKey =
    musicSheetProject.isWhitePaper === "true" ? "white" : "yellow"; // Assuming paperColor is the property determining the paper type

  // Project Types
  if (
    musicSheetProject.projectType >= 1 &&
    musicSheetProject.projectType <= 3
  ) {
    ids.push({
      id: propertyMappings.projectTypes[musicSheetProject.projectType].id,
    });
  }

  // Format
  ids.push({ id: propertyMappings.formats[formatKey].id });

  // Color
  ids.push({ id: propertyMappings.colors[colorKey].id });

  // Binding Types
  ids.push({ id: propertyMappings.bindingTypes[bindingTypesKey].id });

  // Envelopes
  ids.push({ id: propertyMappings.envelopes[envelopesKey].id });

  // Paper Format
  if (propertyMappings.paperFormatMappings[musicSheetProject.paperFormat]) {
    ids.push({
      id: propertyMappings.paperFormatMappings[musicSheetProject.paperFormat]
        .id,
    });
  }

  if (propertyMappings.paperTypes[paperTypeKey]) {
    ids.push({ id: propertyMappings.paperTypes[paperTypeKey].id });
  }
  return ids;
};

const authenticate = async () => {
  const authData = {
    grant_type: "client_credentials",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
  };
  const swEndPoint = process.env.SHOPWARE_ENDPOINT; // Adjust to your actual Shopware API endpoint

  try {
    const response = await axios.post(
      `${swEndPoint}/api/oauth/token`,
      authData
    );
    return response.data.access_token; // Return the access token
  } catch (error) {
    console.error("Authentication error:", error.message);
    throw new Error("Failed to authenticate with Shopware");
  }
};

const createProduct = async (accessToken, productData) => {
  const swEndPoint = process.env.SHOPWARE_ENDPOINT;

  try {
    const response = await axios.post(
      `${swEndPoint}/api/product`,
      productData,
      {
        headers: {
          Accept: "application/json",
          Authorization: accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Better way to check if error is an Axios error
      console.error(
        "Product creation error:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error(
        "An unknown error occurred during product creation:",
        error
      );
    }
    throw error; // Rethrow the error to handle it outside this function if needed
  }
};

const fetchProduct = async (productNumber) => {
  const swEndPoint = process.env.SHOPWARE_ENDPOINT;
  const swAccessKey = process.env.SWACCESSKEY;
  const config = {
    method: "POST",
    url: `${swEndPoint}/store-api/search`,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "sw-access-key": swAccessKey,
    },
    data: {
      search: productNumber,
    },
  };

  try {
    const response = await axios(config);
    return response.data; // Return the response data directly
  } catch (error) {
    // Check if the error is an AxiosError for more specific error handling
    if (axios.isAxiosError(error)) {
      console.error(
        "Fetching product error:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error(
        "An unknown error occurred during product fetching:",
        error
      );
    }
    throw error; // Rethrow the error to handle it outside this function if needed
  }
};
