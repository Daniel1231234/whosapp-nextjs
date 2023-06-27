import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

interface Country {
  name: {
    common: string;
  };
}

interface CountrySelectProps {
  setFormData: any;
  formData: User | any;
}

const CountrySelect = ({ setFormData, formData }: CountrySelectProps) => {
  const [countries, setCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get<Country[]>(
          "https://restcountries.com/v3.1/all"
        );
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <div>
      <label
        htmlFor="country"
        className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-50"
      >
        Country
      </label>

      <select
        id="country"
        name="country"
        value={formData.country}
        onChange={(e) =>
          setFormData((prevData: any) => ({
            ...prevData,
            country: e.target.value,
          }))
        }
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 dark:text-gray-50 shadow-sm ring-1 ring-inset dark:bg-slate-800 ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
      >
        {countries.map((country, idx) => (
          <option key={idx} value={country.name.common}>
            {country.name.common}
          </option>
        ))}
        <option value="israel">Israel</option>
      </select>
    </div>
  );
};

export default CountrySelect;
