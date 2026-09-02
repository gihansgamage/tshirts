/**
 * Professional T-Shirt Printing Business Configuration
 */
const CONFIG = {
  business: {
    name: "කොලිටි",
    tagline: "Custom & Couple T-Shirt Printing",
    phoneDisplay: "+94 77 324 8579",
    whatsappNumber: "94773248579",
    location: "Sri Lanka",
    currency: "LKR",
    currencySymbol: "Rs.",
  },

  // Google Sheets Web App Endpoint (Private: Paste your deployed Google Apps Script URL here)
  googleSheets: {
    webAppUrl: "https://script.google.com/macros/s/AKfycbwP2RGhIIUxHpMPrqaLEYzHlCKQ7Uk-ZFm40guJwqzOmQ20OOPnqEWpbBsMwFVbegAZvg/exec", // Paste your Apps Script Web App URL here
    enableLocalBackup: true,
  },

  // Color Swatches mapped to 3D models & t-shirts folder
  colors: [
    {
      id: "white",
      name: "White",
      hex: "#FFFFFF",
      border: "#CBD5E1",
      girlImage: "assets/3d-models/girl/white.png",
      boyImage: "assets/3d-models/boy/white.png",
      flatImage: "t-shirts/white.jpeg"
    },
    {
      id: "black",
      name: "Black",
      hex: "#18181B",
      border: "#27272A",
      girlImage: "assets/3d-models/girl/black.png",
      boyImage: "assets/3d-models/boy/black.png",
      flatImage: "t-shirts/black.jpeg"
    },
    {
      id: "light_blue",
      name: "Light Blue",
      hex: "#93C5FD",
      border: "#60A5FA",
      girlImage: "assets/3d-models/girl/light_blue.png",
      boyImage: "assets/3d-models/boy/light_blue.png",
      flatImage: "t-shirts/light_blue.jpeg"
    },
    {
      id: "light_green",
      name: "Light Green",
      hex: "#86EFAC",
      border: "#4ADE80",
      girlImage: "assets/3d-models/girl/light_green.png",
      boyImage: "assets/3d-models/boy/light_green.png",
      flatImage: "t-shirts/light_green.jpeg"
    },
    {
      id: "light_pink",
      name: "Pastel Pink",
      hex: "#F9A8D4",
      border: "#F472B6",
      girlImage: "assets/3d-models/girl/light_pink.png",
      boyImage: "assets/3d-models/boy/light_pink.png",
      flatImage: "t-shirts/light_pink.jpeg"
    },
    {
      id: "light_purple",
      name: "Lavender",
      hex: "#C4B5FD",
      border: "#A78BFA",
      girlImage: "assets/3d-models/girl/light_purple.png",
      boyImage: "assets/3d-models/boy/light_purple.png",
      flatImage: "t-shirts/light_purple.jpeg"
    },
    {
      id: "light_yellow",
      name: "Light Yellow",
      hex: "#FDE047",
      border: "#FACC15",
      girlImage: "assets/3d-models/girl/light_yellow.png",
      boyImage: "assets/3d-models/boy/light_yellow.png",
      flatImage: "t-shirts/light_yellow.jpeg"
    }
  ],

  // Available Sizes
  sizes: ["XS", "S", "M", "L", "XL", "XXL", "3XL"],

  // Size Surcharges (per t-shirt): XS, S, M = 0; L, XL = +100; XXL, 3XL = +200
  sizeSurcharges: {
    "XS": 0,
    "S": 0,
    "M": 0,
    "L": 100,
    "XL": 100,
    "XXL": 200,
    "3XL": 200
  },

  // 2 Packages
  packages: {
    couple: {
      id: "couple",
      name: "Couple T-Shirt",
      basePrice: 5000,
      price: 5000,
      description: "Set of 2 customized t-shirts with couple name initials, individual color selection, and sizes."
    },
    name: {
      id: "name",
      name: "Name Printing",
      basePrice: 2700,
      price: 2700,
      description: "Single customized t-shirt with your custom name, color selection, and size."
    }
  },

  // Size chart measurements (in inches & cm)
  sizeChart: [
    { size: "XS", chestIn: "34 - 36", lengthIn: "26", chestCm: "86 - 91", lengthCm: "66" },
    { size: "S",  chestIn: "36 - 38", lengthIn: "27", chestCm: "91 - 96", lengthCm: "69" },
    { size: "M",  chestIn: "38 - 40", lengthIn: "28", chestCm: "96 - 102", lengthCm: "71" },
    { size: "L",  chestIn: "40 - 42", lengthIn: "29", chestCm: "102 - 107", lengthCm: "74" },
    { size: "XL", chestIn: "42 - 44", lengthIn: "30", chestCm: "107 - 112", lengthCm: "76" },
    { size: "XXL",chestIn: "44 - 46", lengthIn: "31", chestCm: "112 - 117", lengthCm: "79" },
    { size: "3XL",chestIn: "46 - 48", lengthIn: "32", chestCm: "117 - 122", lengthCm: "81" }
  ]
};
