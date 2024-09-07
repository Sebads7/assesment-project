import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Country {
  countryCode: string;
  name: string;
}

const Home: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const { data } = await axios.get<Country[]>(
          `${API_URL}/api/countries/available`
        );
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold mt-20 py-10 text-center">
        Country List
      </h1>

      <ul className="xs:w-full  lg:w-[70rem] border overflow-y-auto h-[30rem]  shadow-sm lg:px-20">
        {countries.map((country) => (
          <li
            key={country.countryCode}
            className="py-5 bg-gray-100  hover:bg-blue-300 hover:text-white w-[20rem] my-5  rounded-md shadow-sm flex items-center justify-center mx-auto  gap-2  "
          >
            <Link
              to={`/country/${country.countryCode}`}
              className=" hover:underline"
            >
              {country.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
