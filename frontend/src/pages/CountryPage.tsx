import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Loading from "../../components/Loading";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
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
        <Loading />
      ) : (
        <div className="md:w-2/4 h-[30rem] overflow-y-auto  py-5 border mx-auto ">
          {countryInfo && countryInfo?.borderCountries.length > 0 ? (
            <ul className="flex flex-col  items-center  gap-4 mt-5 xs:px-2 sm:px-10 xl:px-32  ">
              {countryInfo?.borderCountries.map((border) => {
                const flag = flagData.find(
                  (flag) => flag.iso2 === border.countryCode
                );
                const flagUrl = flag?.flag;
                return (
                  <li
                    key={border.countryCode}
                    className="flex items-center justify-center  py-4  bg-gray-100   hover:bg-blue-300 hover:text-white  rounded-md shadow-sm  gap-4 w-full  "
                  >
                    <div className="w-2/5 flex justify-end ">
                      {flagUrl && (
                        <img
                          src={flagUrl}
                          alt={`${border.countryCode} flag`}
                          className="w-8 h-5 "
                        />
                      )}
                    </div>
                    <Link
                      to={`/country/${border.countryCode}`}
                      className=" hover:underline  w-2/5  flex items-center   gap-4"
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
        </div>
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
  );
};

export default CountryPage;
