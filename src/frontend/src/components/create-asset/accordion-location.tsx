import React from "react";
import { LocationType } from "../../types/rwa";
import { MapsLocation } from "../map-component";
import { CityCountryInterface, countriesData, CountriesDataInterface } from "../countries";

export default function LocationAsset({
    isDone,
    setIsDone,
    setLocationInfo,
}: {
    isDone: boolean;
    setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
    setLocationInfo: React.Dispatch<React.SetStateAction<[LocationType] | []>>;
}) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [country, setCountry] = React.useState<CountriesDataInterface>(countriesData[0]);
    const [city, setCity] = React.useState<CityCountryInterface>(country.cities[0]);

    // Optional: Sync city/country changes to parent locationInfo state
    React.useEffect(() => {
        setLocationInfo([{ lat: city.lat, long: city.lng, details: [country.name, city.name] }]);
    }, [city, country, setLocationInfo]);

    return (
        <div className="bg-white rounded-xl border border-gray-200">
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center px-6 py-4 text-left transition-colors rounded-t-xl"
            >
                <span className={`${isDone ? "text-green-700" : "text-gray-800"} font-medium`}>
                    Asset Location Info
                </span>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Accordion Content */}
            <div
                className={`overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[1000px] py-5 px-6" : "max-h-0 px-6"}`}
            >
                <p className="text-sm my-3 text-gray-600">
                    Select the country and city where your asset is located.
                </p>

                {/* Country & City Select */}
                <div className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-4">
                    <div className="flex flex-col w-full">
                        <label htmlFor="country" className="mb-1 text-gray-700 font-medium">Country</label>
                        <select
                            id="country"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={country.name}
                            onChange={(e) => {
                                const selectedCountry = countriesData.find(c => c.name === e.target.value)!;
                                setCountry(selectedCountry);
                                setCity(selectedCountry.cities[0]);
                            }}
                        >
                            {countriesData.map((c, idx) => (
                                <option value={c.name} key={idx}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col w-full">
                        <label htmlFor="city" className="mb-1 text-gray-700 font-medium">City</label>
                        <select
                            id="city"
                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                            value={city.name}
                            onChange={(e) => {
                                const selectedCity = country.cities.find(c => c.name === e.target.value)!;
                                setCity(selectedCity);
                            }}
                        >
                            {country.cities.map((c, idx) => (
                                <option value={c.name} key={idx}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Coordinates */}
                <div className="flex items-center space-x-2 mt-4">
                    <span className="text-gray-900 text-sm bg-gray-100 p-2 rounded-md">Lat: {city.lat}</span>
                    <span className="text-gray-900 text-sm bg-gray-100 p-2 rounded-md">Lng: {city.lng}</span>
                </div>

                {/* Map */}
                <div className="mt-4 rounded-lg overflow-hidden">
                    <MapsLocation lat={city.lat} long={city.lng} />
                </div>

                {/* Mark as Done Button */}
                <button
                    onClick={() => setIsDone(!isDone)}
                    className={`px-4 py-2 mt-6 rounded-md text-sm font-medium transition-all ${isDone
                        ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
                        : "background-dark text-white hover:brightness-110"
                        }`}
                >
                    {isDone ? "Mark as Not Done" : "Mark as Done"}
                </button>
            </div>
        </div>
    );
}
