import { X } from "lucide-react";
import { ModalContext } from "../../context/ModalContext";
import React from "react";
import { CityCountryInterface, countriesData, CountriesDataInterface } from "../countries";
import { downloadFile, exportKey, text2IdentityType } from "../../helper/rwa-helper";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";

export function RegistUserModal() {
    const [isLoading, setIsLoading] = React.useState(false);

    const { setModalKind, setIsdoneRegist } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);

    const [firstname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [idnum, setIdnum] = React.useState("");
    const [selectedCountry, setSelectedCountry] = React.useState<CountriesDataInterface>(countriesData[0]);
    const [selectedCity, setSelectedCity] = React.useState<CityCountryInterface>(countriesData[0].cities[0]);
    const [idtype, setIdtype] = React.useState("identitynumber");

    function closeButtonHandler() {
        setModalKind(null);
        setSelectedCountry(countriesData[0]);
        setSelectedCity(countriesData[0].cities[0]);
        setIdtype("identitynumber");
    };

    function handleCountryChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const country = countriesData.find(c => c.name === e.target.value);
        if (country) {
            setSelectedCountry(country);
            setSelectedCity(country.cities[0]);
        }
    }

    function handleCityChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const city = selectedCountry.cities.find(c => c.name === e.target.value);
        if (city) setSelectedCity(city);
    }

    const handleRegister = async () => {
        try {
            setIsLoading(true);
            const keyPair = await crypto.subtle.generateKey(
                {
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 2048,
                    publicExponent: new Uint8Array([1, 0, 1]),
                    hash: "SHA-256",
                },
                true,
                ["sign", "verify"]
            );
            const privatePem = await exportKey(keyPair.privateKey, "private");
            const publicPem = await exportKey(keyPair.publicKey, "public");

            const res = await backendService.registUser(firstname, lastname, phone, selectedCountry.name, selectedCity.name, idnum, text2IdentityType(idtype), publicPem);
            console.log(res);
            setNotificationData({
                title: `successfully created user kyc`,
                description: `Result ${res}`,
                position: "bottom-right"
            })
            downloadFile("private.pem", privatePem);
            downloadFile("public.pem", publicPem);
            downloadFile("private.txt", privatePem);
            downloadFile("public.txt", publicPem);
        } catch (error) {
            setNotificationData({
                title: `failed to process`,
                description: `Error happened, ${error}`,
                position: "bottom-right"
            })
        } finally {
            setIsLoading(false)
            closeButtonHandler();
            setIsdoneRegist(true);
        }
    };

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 md:p-4 py-2 px-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl">Register Your Self</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="w-full space-y-2 text-sm">
                        <div className="flex flex-col items-start">
                            <label htmlFor="firstname">firstname</label>
                            <input
                                value={firstname}
                                disabled={isLoading}
                                onChange={(e) => setFirstname(e.target.value)}
                                type="text" name="firstname" id="firstname"
                                className="p-2 rounded-md border border-gray-300 w-full"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="lastname">lastname</label>
                            <input
                                value={lastname}
                                disabled={isLoading}
                                onChange={(e) => setLastname(e.target.value)}
                                type="text" name="lastname" id="lastname"
                                className="p-2 rounded-md border border-gray-300 w-full"
                            />
                        </div>
                        <div className="flex flex-col items-start">
                            <label htmlFor="phone">phone</label>
                            <input
                                value={phone}
                                disabled={isLoading}
                                onChange={(e) => setPhone(e.target.value)}
                                type="text" name="phone" id="phone"
                                className="p-2 rounded-md border border-gray-300 w-full"
                            />
                        </div>

                        <div className="flex flex-col space-y-5 md:flex-row md:space-x-4 w-full">
                            <div className="flex flex-col items-start w-full">
                                <label htmlFor="idnum">id number</label>
                                <input
                                    value={idnum}
                                    disabled={isLoading}
                                    onChange={(e) => setIdnum(e.target.value)}
                                    type="text" name="idnum" id="idnum"
                                    className="p-2 rounded-md border border-gray-300 w-full"
                                />
                            </div>
                            <div className="flex flex-col items-start w-full">
                                <label htmlFor="idtype">id number type</label>
                                <select
                                    name="idtype" id="idtype"
                                    className="p-2 rounded-md border border-gray-300 w-full"
                                    value={idtype}
                                    disabled={isLoading}
                                    onChange={(e) => setIdtype(e.target.value)}
                                >
                                    <option value="identitynumber">identity number</option>
                                    <option value="liscensenumber">liscense number</option>
                                    <option value="pasport">pasport</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col space-y-5 md:flex-row md:space-x-4 w-full">
                            <div className="flex flex-col items-start w-full">
                                <label htmlFor="country">country</label>
                                <select
                                    id="country"
                                    name="country"
                                    className="p-2 rounded-md border border-gray-300 w-full"
                                    value={selectedCountry.name}
                                    disabled={isLoading}
                                    onChange={handleCountryChange}
                                >
                                    {countriesData.map((country) => (
                                        <option key={country.name} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col items-start w-full">
                                <label htmlFor="city">city</label>
                                <select
                                    id="city"
                                    name="city"
                                    className="p-2 rounded-md border border-gray-300 w-full"
                                    value={selectedCity.name}
                                    disabled={isLoading}
                                    onChange={handleCityChange}
                                >
                                    {selectedCountry.cities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleRegister}
                                className="w-full background-dark text-white rounded-md p-2"
                            >
                                Register
                            </button>
                            <p className="text-gray-800 text-[12px]">
                                **with this registration submission, public and private key will be generated
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
