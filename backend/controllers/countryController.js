const axios = require("axios");
const { DATE_NAGER_API, COUNTRIES_NOW_API } = require("../config");

const getAvailableCountries = async (req, res) => {
  try {
    const response = await axios.get(`${DATE_NAGER_API}/AvailableCountries`);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching available countries:", error);
    res.status(500).json({ message: "Error fetching available countries" });
  }
};

const getCountryInfo = async (req, res) => {
  const { countryCode } = req.params;

  try {
    const [borderResponse, populationResponse, flagResponse] =
      await Promise.all([
        axios.get(`${DATE_NAGER_API}/CountryInfo/${countryCode}`),
        axios.get(`${COUNTRIES_NOW_API}/countries/population`, {
          params: { country: countryCode },
        }),
        axios.get(`${COUNTRIES_NOW_API}/countries/flag/images`),
      ]);

    const borderCountries = borderResponse.data.borders;
    const populationData = populationResponse.data;
    const flagData = flagResponse.data;

    res.json({
      borderCountries,
      populationData,
      flagUrl: flagData[countryCode] || "",
    });
  } catch (error) {
    console.error("Error fetching country info:", error.message);
    res.status(500).json({ message: "Error fetching country info" });
  }
};

module.exports = { getAvailableCountries, getCountryInfo };
