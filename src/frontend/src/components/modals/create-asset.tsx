import { Upload, X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { DocumentHashDataType } from "../../types/rwa";
import countriesData from "../../utils/countries.json"
import { backendService } from "../../services/backendService";
import { mapToIdentityNumberType } from "../../utils/rwa-hepler";
import { PopUpContext } from "../../context/PopUpContext";

export function AddDocumentsModal() {
    const { setModalKind, managementAddDocument } = React.useContext(ModalContext);
    const [file, setFile] = React.useState<File | null>(null);
    const [docName, setDocName] = React.useState("");
    const [docDesc, setDocDesc] = React.useState("");

    function closeButtonHandler() {
        setModalKind(null);
        setFile(null);
        setDocName("");
        setDocDesc("");
    }

    function handleAddDocument() {
        const newDoc: DocumentHashDataType = {
            hash: file?.name || 'abcd',
            name: docName,
            description: docDesc,
        };

        managementAddDocument.setter(newDoc);

        closeButtonHandler();
    }


    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Asset Documents</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="space-y-5">
                        <label
                            htmlFor="file"
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                            <Upload className="w-8 h-8 text-gray-400" />
                            <span className="mt-2 text-sm text-gray-600">Klik untuk upload PDF</span>
                            <input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files?.[0] || null;
                                    setFile(f);
                                    console.log("Selected file:", f);
                                }}
                            />
                        </label>
                        <div className="flex flex-col w-full space-y-2">
                            <label htmlFor="docname">Document Name</label>
                            <input
                                type="text"
                                name="docname"
                                id="docname"
                                placeholder="ex. comp dividend"
                                className="p-2 rounded-md border border-gray-200"
                                value={docName}
                                onChange={(e) => setDocName(e.target.value)}
                            />
                            <label htmlFor="docdesc">Document Description</label>
                            <input
                                type="text"
                                name="docdesc"
                                id="docdesc"
                                placeholder="ex. comp dividend in last 5 years"
                                className="p-2 rounded-md border border-gray-200"
                                value={docDesc}
                                onChange={(e) => setDocDesc(e.target.value)}
                            />
                        </div>
                        <button
                            className="text-white text-sm background-dark p-2 rounded-md cursor-pointer"
                            onClick={handleAddDocument}
                        >
                            Sign and Add Documents
                        </button>
                    </div>
                </div>
            </div>
        </div>

    );
}


export function EditPersonalInfoModal() {
    const { setModalKind, setLoadState } = React.useContext(ModalContext);
    const { setPopUpData } = React.useContext(PopUpContext);

    const [selectedCountry, setSelectedCountry] = React.useState<string>(countriesData[0].name);
    const [selectedCity, setSelectedCity] = React.useState<string>(countriesData[0].cities[0].name);
    const [fisrtname, setFirstname] = React.useState("");
    const [lastname, setLastname] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [idnumber, setIdnumber] = React.useState("");
    const [idtype, setIdtype] = React.useState("");

    function closeButtonHandler() {
        setModalKind(null);
    }

    async function handleSubmit() {
        setLoadState(true)
        try {
            const res = await backendService.registUser(
                fisrtname,
                lastname,
                phone,
                selectedCountry,
                selectedCity,
                idnumber,
                mapToIdentityNumberType(idtype)
            );
            console.log(res);

            setPopUpData({
                title: "Success to regist and set user details as kyc details!",
                description: `user details was created ${res}`,
                position: "bottom-right",
            })
        } catch (error) {
            console.log(error);
            setPopUpData({
                title: "Error To Set User Identity!",
                description: `no changes happened because becasue of error ${error}`,
                position: "bottom-right",
            })
        }
        setLoadState(false)
        
    }

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const country = e.target.value;
        setSelectedCountry(country);
        setSelectedCity(""); // reset city ketika ganti country
    };

    const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCity(e.target.value);
    };

    const availableCities =
        countriesData.find((c) => c.name === selectedCountry)?.cities || [];

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full h-[90%] md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Personal Info</p>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>

                    <div className="space-y-2">
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="firstname">First Name</label>
                                <input
                                    value={fisrtname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    type="text"
                                    name="firstname"
                                    id="firstname"
                                    placeholder="firstname"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="lastname">Last Name</label>
                                <input
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    type="text"
                                    name="lastname"
                                    id="lastname"
                                    placeholder="lastname"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col space-y-1 w-full">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                type="text"
                                name="phone"
                                id="phone"
                                placeholder="phone"
                                className="p-2 rounded-md border border-gray-300"
                            />
                        </div>

                        {/* Country + City */}
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="country">Country</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={selectedCountry}
                                    onChange={handleCountryChange}
                                >
                                    {countriesData.map((country) => (
                                        <option key={country.name} value={country.name}>
                                            {country.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="city">City</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={selectedCity}
                                    onChange={handleCityChange}
                                    disabled={!selectedCountry}
                                >
                                    {availableCities.map((city) => (
                                        <option key={city.name} value={city.name}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Id Section */}
                        <div className="flex space-x-5 w-full">
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="idtype">Id Number Type</label>
                                <select
                                    className="border border-gray-400 p-2 w-full rounded"
                                    value={idtype}
                                    onChange={(e) => setIdtype(e.target.value)}
                                >
                                    <option value={"IdentityNumber"}>Identity Number</option>
                                    <option value={"LiscenseNumber"}>Liscense Number</option>
                                    <option value={"Pasport"}>Pasport</option>
                                </select>
                            </div>
                            <div className="flex flex-col space-y-1 w-full">
                                <label htmlFor="idnum">Id Number</label>
                                <input
                                    value={idnumber}
                                    onChange={(e) => setIdnumber(e.target.value)}
                                    type="text"
                                    name="idnum"
                                    id="idnum"
                                    placeholder="idnum"
                                    className="p-2 rounded-md border border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => handleSubmit()}
                        className="background-dark text-white text-sm p-2 rounded-md cursor-pointer">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}


export function AddRuleDetails() {
    const { setModalKind } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    }
    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[40vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p>Rules Details</p>
                        <button
                            className="p-2 rounded-full cursor-pointer"
                            onClick={() => closeButtonHandler()}
                        >
                            <X size={15} color="red" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="ruledetails"
                            id="ruledetails"
                            placeholder="some rule and details about the token asset"
                            className="p-2 border border-gray-300 rounded-md w-full"
                        />
                        <button className="text-sm text-white background-dark p-2 rounded-md w-full cursor-pointer">Set Rule Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
}