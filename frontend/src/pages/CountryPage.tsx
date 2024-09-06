import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const VITE_FLAGS = import.meta.env.VITE_FLAGS_API_URL;

interface BorderCountry {
  commonName: string;
  officialName: string;
  countryCode: string;
  region: string;
  borders: any;
}

interface CountryInfo {
  borderCountries: BorderCountry[];
  populationData: any;
}

interface FlagData {
  name: string;
  flag: string;
  iso2: string;
  iso3: string;
}

const fetchFlagData = async (): Promise<FlagData[]> => {
  try {
    const response = await axios.get(VITE_FLAGS);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching flag data:", error);
    return [];
  }
};

const CountryPage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const [countryInfo, setCountryInfo] = useState<CountryInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [flagData, setFlagData] = useState<FlagData[]>([]);

  useEffect(() => {
    const fetchCountryInfo = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/countries/${countryCode}`
        );
        setCountryInfo(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching country info:", error);
        setCountryInfo(null); // Handle error by setting countryInfo to null
      }
    };

    const fetchData = async () => {
      try {
        const flags = await fetchFlagData();
        setFlagData(flags);
        fetchCountryInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
        setFlagData([]);
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode]);

  return (
    <div className="xs:px-10 md:px-20 py-20 w-full">
      <h1 className="text-2xl font-bold my-4 text-center">
        Country Information
      </h1>
      <h2 className="text-lg mt-4 text-center mb-4">Border Countries</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div>
          <ul className="gap-4  w-full flex flex-col justify-center items-center">
            {countryInfo?.borderCountries.map((border) => {
              const flag = flagData.find(
                (flag) => flag.iso2 === border.countryCode
              );
              const flagUrl = flag ? flag.flag : "";

              return (
                <li
                  key={border.countryCode}
                  className="border h-20 px-6  rounded-md shadow-sm flex items-center gap-2 "
                >
                  <img
                    src={flagUrl}
                    alt={`${border.countryCode} flag`}
                    className="w-8 h-5 mr-2"
                  />
                  <Link
                    to={`/country/${border.countryCode}`}
                    className="text-blue-500 hover:underline  "
                  >
                    {border.commonName} (Official: {border.officialName})
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="w-full flex mt-5 justify-center">
            <a
              className=" mt-4 border p-4 rounded-lg hover:bg-blue-400 hover:text-white transition duration-300 ease-in-out"
              href="/"
            >
              Return to Home Page
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryPage;
