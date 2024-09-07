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
  borders: ["string"];
}

interface CountryInfo {
  borderCountries: BorderCountry[];
  populationData: string[];
}

interface FlagData {
  name: string;
  flag: string;
  iso2: string;
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
        setCountryInfo(null);
      }
    };

    const fetchData = async () => {
      try {
        const flags = await fetchFlagData();
        if (!flags) {
          setFlagData([]);
        }
        setFlagData(flags);
        fetchCountryInfo();
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [countryCode]);

  return (
    <div className="xs:px-10 md:px-20 py-20 w-full">
      <h1 className="text-2xl font-bold mt-20 my-4 text-center">
        List of Border Countries for {countryCode}
      </h1>

      {loading ? (
        <div className="relative flex flex-col gap-3 justify-center items-center py-20">
          <p className="text-center font-bold">Loading</p>
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      ) : (
        <div>
          {countryInfo && countryInfo?.borderCountries.length > 0 ? (
            <ul className="gap-4 md:w-2/4 h-[30rem] overflow-y-auto py-5 border mx-auto flex flex-col justify-center items-center">
              {countryInfo?.borderCountries.map((border) => {
                const flag = flagData.find(
                  (flag) => flag.iso2 === border.countryCode
                );
                const flagUrl = flag?.flag;
                return (
                  <li
                    key={border.countryCode}
                    className=" py-5 bg-gray-100  hover:bg-blue-300 hover:text-white xs:w-[15rem] lg:w-[20rem]  rounded-md shadow-sm flex items-center justify-center   gap-2 "
                  >
                    {flagUrl && (
                      <img
                        src={flagUrl}
                        alt={`${border.countryCode} flag`}
                        className="w-8 h-5 mr-2"
                      />
                    )}

                    <Link
                      to={`/country/${countryCode}`}
                      className=" hover:underline  w-10   "
                    >
                      {border.commonName}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-center  mx-auto w-[25rem] py-5 text-red-500 font-bold">
              No border countries found
            </p>
          )}

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
