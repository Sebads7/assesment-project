// src/pages/Home.tsx

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
      <h1 className="text-3xl font-bold py-10 text-center">Country List</h1>

      <ul className="w-[70rem] overflow-y-auto h-[30rem] px-20">
        {countries.map((country) => (
          <li
            key={country.countryCode}
            className="w-full py-5 my-2 border text-center"
          >
            <Link
              to={`/country/${country.countryCode}`}
              className="text-blue-500 hover:underline"
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
