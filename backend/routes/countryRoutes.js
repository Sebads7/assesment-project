const express = require("express");
const {
  getAvailableCountries,
  getCountryInfo,
} = require("../controllers/countryController");

const router = express.Router();

// Define routes
router.get("/countries/available", getAvailableCountries);
router.get("/countries/:countryCode", getCountryInfo);

module.exports = router;
