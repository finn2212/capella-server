// propertyMappings.js

const propertyMappings = {
    projectTypes: {
      1: { id: "a2dcd3008de644c784d2cdfec32d91d0", name: "Notenheft ohne Instrumentalstimmen", category: "Projekt Typ" },
      2: { id: "92c1ed6e0a11440aa5c544d87fc780c9", name: "Notenheft mit Instrumentalstimmen", category: "Projekt Typ" },
      3: { id: "587a3d6981404ed4b9de471d120e14ad", name: "Stimmensatz / Chorsatz", category: "Projekt Typ" }
    },
    formats: {
      false: { id: "e1d6ac670a3442448644bc34a7f0d469", name: "Querformat", category: "Ausrichtung" },
      true: { id: "bb3741f73af54d46b1d0808f74f3923d", name: "Hochformat", category: "Ausrichtung" }
    },
    colors: {
      false: { id: "7c2ad08862fb4011ae45d912c1ca4c3d", name: "Schwarz Weiß", category: "Farbigkeit" },
      true: { id: "cfdae0f64bf240a6ae5202db7579f8a0", name: "Farbig", category: "Farbigkeit" }
    },
    bindingTypes: {
      false: { id: "b5559576c3634ab0ba178c92194b5691", name: "Spiralbindung", category: "Bindungsart" },
      true: { id: "d5e18caaadd34f70877e38b742ad22ff", name: "Klammerheftung", category: "Bindungsart" }
    },
    envelopes: {
      false: { id: "242e68c2dfde4ec2afe3fd478e2a0f85", name: "Ohne", category: "Umschlag" },
      true: { id: "28e2313979804380b8f303e0f21ffcad", name: "Mit", category: "Umschlag" }
    },
    paperFormatMappings: {
      1: { id: "bdac9a79733341129bdc32cceaa29ddb", name: "DIN A4 (21 x 29,7 cm)", category: "Format" },
      2: { id: "afe5b55949fc41d399ac39e5ff24f4b6", name: "Klavierauszug (19 x 27 cm)", category: "Format" },
      3: { id: "6753f984ea17467794b4068f294053be", name: "Concert (22,8 x 30,5 cm)", category: "Format" },
      4: { id: "4ddf6e278920458cba821346e53b04e9", name: "DIN B4 (25 x 35,3 cm)", category: "Format" },
      5: { id: "2866e65da9a749cd88a84412e212f12a", name: "DIN A3 (29,7 x 42 cm)", category: "Format" },
      6: { id: "378502b6aa384914b27369996fabd0bc", name: "Dirigent (31,5 x 46 cm)", category: "Format" }
    },
  };
  
  module.exports = propertyMappings;
  