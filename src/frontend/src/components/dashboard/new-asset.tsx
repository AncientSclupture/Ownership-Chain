import { FileBox, Plus, Upload, X } from "lucide-react";
import ToggleComponent from "../toggle";
import React from "react";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { ReduceCharacters, text2AssetStatus, text2AssetType } from "../../helper/rwa-helper";
import { DocumentHash, LocationType, Rule } from "../../types/rwa";
import { CityCountryInterface, countriesData, CountriesDataInterface } from "../countries";
import { MapsLocation } from "../map-component";
import { NotificationContext } from "../../context/NotificationContext";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";

export function NewAsset() {

    const { adddocumentmanagement, setModalKind, adddruledetailmanagement, locationdetailmanagement } = React.useContext(ModalContext)
    const { setNotificationData } = React.useContext(NotificationContext)

    const [isLoading, setIsLoading] = React.useState(false);

    const [name, setName] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const [assettype, setAssettype] = React.useState("Property");
    const [assetstatus, setAssetstatus] = React.useState("Open");

    const [totaltoken, setTotaltoken] = React.useState<bigint>(BigInt(0));
    const [providedtoken, setProvidedtoken] = React.useState<bigint>(BigInt(0));
    const [minimaltoken, setMinimaltoken] = React.useState<bigint>(BigInt(0));
    const [maximaltoken, setMaximaltoken] = React.useState<bigint>(BigInt(0));
    const [tokenprice, setTokenprice] = React.useState<bigint>(BigInt(0));

    const [docData, setDocData] = React.useState<Array<DocumentHash> | []>([])

    {/* rule states */ }
    const [isSellOwnership, setIsSellOwnership] = React.useState(false);
    const [sellOwnershipNeedVote, setSellOwnershipNeedVote] = React.useState(false);
    const [sellSharingPrice, setSellSharingPrice] = React.useState<bigint>(BigInt(0));
    const [needDonePayment, setNeedDonePayment] = React.useState(false);
    const [mindppercent, setMindppercent] = React.useState<number>(0);
    const [dpcashback, setDpcashback] = React.useState<number>(0);
    const [dpmaturitytime, setDpmaturitytime] = React.useState<bigint>(BigInt(0));
    const [ruledetails, setRuledetails] = React.useState<Array<string>>([]);
    const [ownershipmaturityTime, setOwnershipmaturityTime] = React.useState(true);
    const [ownershiptime, setOwnershiptime] = React.useState(BigInt(0));

    {/* location states */ }
    const [country, setCountry] = React.useState<CountriesDataInterface>(countriesData[0]);
    const [city, setCity] = React.useState<CityCountryInterface>(country.cities[0]);

    React.useEffect(() => {
        setSellOwnershipNeedVote(false);
        setSellSharingPrice(BigInt(0));
    }, [isSellOwnership]);

    React.useEffect(() => {
        setMindppercent(0);
        setDpcashback(0);
        setDpmaturitytime(BigInt(0));
    }, [needDonePayment]);

    React.useEffect(() => {
        setDocData(adddocumentmanagement.data);
    }, [adddocumentmanagement.data])

    React.useEffect(() => {
        if (!ownershipmaturityTime) {
            setOwnershiptime(BigInt(0))
        }
    }, [ownershipmaturityTime])


    React.useEffect(() => {
        setRuledetails(adddruledetailmanagement.data);
    }, [adddruledetailmanagement.data])

    async function handleCreateAsset() {
        setIsLoading(true);
        const locationInfo: LocationType = {
            lat: city.lat,
            long: city.lng,
            details: locationdetailmanagement.data
        }

        const ruleAsset: Rule = {
            sellSharing: isSellOwnership,
            sellSharingNeedVote: sellOwnershipNeedVote,
            sellSharingPrice: sellSharingPrice,
            needDownPayment: needDonePayment,
            minDownPaymentPercentage: mindppercent / 100,
            downPaymentCashback: dpcashback / 100,
            downPaymentMaturityTime: dpmaturitytime,
            details: adddruledetailmanagement.data,
            paymentMaturityTime: BigInt(4),
            ownerShipMaturityTime: ownershiptime
        }
        const res = await backendService.createAsset(
            name, desc, totaltoken, providedtoken, minimaltoken, maximaltoken, tokenprice,
            locationInfo, docData, text2AssetType(assettype), text2AssetStatus(assetstatus),
            ruleAsset
        )
        setNotificationData({
            title: "asset created",
            description: `${res}`,
            position: "bottom-right"
        })
        try {
        } catch (error) {
            setNotificationData({
                title: "failed to create asset",
                description: "",
                position: "bottom-right"
            })
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <LoaderComponent fullScreen={true} />
    }

    return (
        <div className="space-y-5">
            {/* name type status description */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="my-4 text-lg">Asset Information</div>
                <div className="space-y-5">
                    <div className="w-full flex md:flex-row flex-col space-x-3 md:space-y-0 space-y-5">
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="name">name</label>
                            <input
                                type="text" name="name" id="name"
                                className="p-2 border border-gray-300 rounded-md"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="type">type</label>
                            <select
                                name="type" id="type"
                                className="p-2 border border-gray-300 rounded-md"
                                value={assettype}
                                onChange={(e) => setAssettype(e.target.value)}
                            >
                                <option value="Property">Property</option>
                                <option value="Business">Business</option>
                                <option value="Artwork">Artwork</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="Equipment">Equipment</option>
                            </select>
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="status">status</label>
                            <select
                                name="status" id="status"
                                className="p-2 border border-gray-300 rounded-md"
                                value={assetstatus}
                                onChange={(e) => setAssetstatus(e.target.value)}
                            >
                                <option value="Open">Open</option>
                                <option value="Active">Active</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col space-x-1 w-full">
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description" id="description"
                            className="p-2 border border-gray-300 rounded-md resize-none md:h-[15vw] h-[30vw]"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* total-token price-pertoken max min */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="my-4 text-lg">Tokenize Your Asset</div>
                <div className="space-y-5">
                    <div className="w-full flex md:flex-row flex-col space-x-3 md:space-y-0 space-y-5">
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="total">total token</label>
                            <input
                                type="text" name="total" id="total"
                                className="p-2 border border-gray-300 rounded-md"
                                value={totaltoken.toString()}
                                onChange={(e) => setTotaltoken(BigInt(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="provided">provided token</label>
                            <input
                                type="text" name="provided" id="provided"
                                className="p-2 border border-gray-300 rounded-md"
                                value={providedtoken.toString()}
                                onChange={(e) => setProvidedtoken(BigInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="w-full flex md:flex-row flex-col space-x-3 md:space-y-0 space-y-5">
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="min">minimal token can be bought</label>
                            <input
                                type="text" name="min" id="min"
                                className="p-2 border border-gray-300 rounded-md"
                                value={minimaltoken.toString()}
                                onChange={(e) => setMinimaltoken(BigInt(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="max">maximal token can be bought</label>
                            <input
                                type="text" name="max" id="max"
                                className="p-2 border border-gray-300 rounded-md"
                                value={maximaltoken.toString()}
                                onChange={(e) => setMaximaltoken(BigInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="w-full flex md:flex-row flex-col space-x-3 md:space-y-0 space-y-5">
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="price">price per token</label>
                            <input
                                type="text" name="price" id="price"
                                className="p-2 border border-gray-300 rounded-md"
                                value={tokenprice.toString()}
                                onChange={(e) => setTokenprice(BigInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* document */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="my-4 text-lg">Asset Document</div>
                <div className="space-y-2">
                    {docData.map((docs, idx) =>
                        <div
                            key={idx}
                            className="flex w-full justify-between items-center p-2 bg-gray-100 rounded-md "
                        >
                            <div className="flex items-center space-x-2 cursor-pointer">
                                <FileBox size={20} />
                                <p>{ReduceCharacters(docs.name)}</p>
                            </div>
                            <button onClick={() => adddocumentmanagement.remover(docs.name)} className="p-2 bg-red-200 rounded-md"><X size={20} /></button>
                        </div>
                    )}
                    <div
                        onClick={() => setModalKind(ModalKindEnum.adddocument)}
                        className="w-full md:h-[8vw] h-[15vw] bg-gray-50 rounded-md flex flex-col items-center justify-center space-y-1 cursor-pointer"
                    >
                        <Upload size={28} color="black" />
                        <p className="text-sm">add new documentation</p>
                    </div>
                </div>
            </div>

            {/* rule */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="my-4 text-lg">Asset Ownership Rule</div>
                <div className="space-y-5">
                    {/* sell sharing | sell sharing need vote | sell sharing price */}
                    <div className="flex space-x-3 border-b border-gray-400 pb-2">
                        <ToggleComponent value={isSellOwnership} setValue={() => setIsSellOwnership(!isSellOwnership)} />
                        <div>Allow ownership holder to sell their ownership ?</div>
                    </div>
                    <div className={`sapce-y-5 md:w-[60vw] w-full py-3 md:px-0 px-3 space-y-3 ${isSellOwnership ? '' : 'hidden'}`}>
                        <div className="flex flex-row space-x-1 w-full">
                            <ToggleComponent value={sellOwnershipNeedVote} setValue={() => setSellOwnershipNeedVote(!sellOwnershipNeedVote)} />
                            <div>Need vote for selling this asset ?</div>
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="sellsharingprice">ownership holder can sell this asset with the highest price at</label>
                            <input
                                type="text" name="sellsharingprice" id="sellsharingprice"
                                className="p-2 border border-gray-300 rounded-md"
                                value={sellSharingPrice.toString()}
                                onChange={(e) => setSellSharingPrice(BigInt(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* need done payment | done payment cashback | done payment percentage | done payment maturity time */}
                    <div className="flex space-x-3 border-b border-gray-400 pb-2">
                        <ToggleComponent value={needDonePayment} setValue={() => setNeedDonePayment(!needDonePayment)} />
                        <div>Require done payment to own this asset ?</div>
                    </div>
                    <div className={`sapce-y-5 md:w-[60vw] w-full py-3 md:px-0 px-3 space-y-3 ${needDonePayment ? '' : 'hidden'}`}>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="donepaymentpercentage">minimal done payment percentage (0-100) <span className="text-sm font-semibold">(calculated from user proposal price)</span></label>
                            <input
                                type="text" name="donepaymentpercentage" id="donepaymentpercentage"
                                className="p-2 border border-gray-300 rounded-md"
                                value={mindppercent.toString()}
                                onChange={(e) => setMindppercent(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="donepaymentcashbackpercentage">done payment cahsback percentage (0-100) <span className="text-sm font-semibold">(calculated from user donepayment)</span></label>
                            <input
                                type="text" name="donepaymentcashbackpercentage" id="donepaymentcashbackpercentage"
                                className="p-2 border border-gray-300 rounded-md"
                                value={dpcashback.toString()}
                                onChange={(e) => setDpcashback(Number(e.target.value))}
                            />
                        </div>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="donepaymentmaturitytime">done paymenent maturiry time (in days)</label>
                            <input
                                type="text" name="donepaymentmaturitytime" id="donepaymentmaturitytime"
                                className="p-2 border border-gray-300 rounded-md"
                                value={dpmaturitytime.toString()}
                                onChange={(e) => setDpmaturitytime(BigInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3 border-b border-gray-400 pb-2">
                        <ToggleComponent value={ownershipmaturityTime} setValue={() => setOwnershipmaturityTime(!ownershipmaturityTime)} />
                        <div>Let the asset holder have their ownership forever ?</div>
                    </div>
                    <div className={`sapce-y-5 md:w-[60vw] w-full py-3 md:px-0 px-3 space-y-3 ${!ownershipmaturityTime ? '' : 'hidden'}`}>
                        <div className="flex flex-col space-x-1 w-full">
                            <label htmlFor="donepaymentpercentage">asset holder will have their ownership up until <span className="text-sm font-semibold">(calculated days from the user fnished final payment, in days)</span></label>
                            <input
                                type="text" name="donepaymentpercentage" id="donepaymentpercentage"
                                className="p-2 border border-gray-300 rounded-md"
                                value={ownershiptime.toString()}
                                onChange={(e) => setOwnershiptime(BigInt(e.target.value))}
                            />
                        </div>
                    </div>
                    {/* rule details */}
                    <div className="flex space-x-3 items-center border-b border-gray-400 pb-2">
                        <button onClick={() => setModalKind(ModalKindEnum.addruledetails)} className="p-2 bg-gray-200 rounded-md cursor-pointer"><Plus size={20} /></button>
                        <div>Add Some Rule Details Here</div>
                    </div>
                    <div className={`w-full space-y-2 ${ruledetails.length !== 0 ? '' : 'hidden'}`}>
                        {ruledetails.map((rule, idx) =>
                            <div className="flex items-center space-x-2" key={idx}>
                                <button
                                    className="p-2 bg-red-200 rounded-md"
                                    onClick={() => adddruledetailmanagement.remover(rule)}
                                >
                                    <X size={20} />
                                </button>
                                <p>{rule}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* location */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="my-4 text-lg">Asset Access Info</div>
                <p className="text-sm my-4 text-gray-800">
                    Set the Country and city near by your asset was took placed
                </p>
                <div className="flex w-full space-x-2">
                    <div className="flex flex-col space-y-2 w-full">
                        <label htmlFor="country">Country</label>
                        <select
                            id="country"
                            className="p-2 border border-gray-300 rounded-md"
                            value={country.name}
                            onChange={(e) => {
                                const selectedCountry = countriesData.find(
                                    (c) => c.name === e.target.value
                                )!;
                                setCountry(selectedCountry);
                                setCity(selectedCountry.cities[0]); // reset city ke yang pertama
                            }}
                        >
                            {countriesData.map((c, idx) => (
                                <option value={c.name} key={idx}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col space-y-2 w-full">
                        <label htmlFor="city">City</label>
                        <select
                            id="city"
                            className="p-2 border border-gray-300 rounded-md"
                            value={city.name}
                            onChange={(e) => {
                                const selectedCity = country.cities.find(
                                    (c) => c.name === e.target.value
                                )!;
                                setCity(selectedCity);
                            }}
                        >
                            {country.cities.map((c, idx) => (
                                <option value={c.name} key={idx}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="flex items-center space-x-2 my-4">
                    <p className="text-gray-950 text-sm p-2 bg-gray-100 rounded-md">{city.lat}</p>
                    <p className="text-gray-950 text-sm p-2 bg-gray-100 rounded-md">{city.lng}</p>
                </div>
                <div className="space-y-4">
                    <MapsLocation lat={city.lat} long={city.lng} />
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2 my-5">
                            <button onClick={() => setModalKind(ModalKindEnum.addlocationdetails)} className="p-2 rounded-md bg-gray-300 cursor-pointer"><Plus size={20} /></button>
                            <p>Add new location details</p>
                        </div>
                        {locationdetailmanagement.data.map((locationdata, idx) =>
                            <div className="flex items-center space-x-2" key={idx}>
                                <button
                                    className="p-2 bg-red-200 rounded-md"
                                    onClick={() => locationdetailmanagement.remover(locationdata)}
                                >
                                    <X size={20} />
                                </button>
                                <p>{ReduceCharacters(locationdata)}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* term and condition */}
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <div className="space-y-6 text-sm leading-relaxed">
                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">By submitting this document and asset, I consciously declare that:</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>
                                If at any point it is proven that my asset constitutes plagiarism, fraud,
                                manipulation, or any form of scam, all ownership rights to the asset may be revoked
                                without compensation, and I agree to accept any administrative sanctions or penalties as required.
                            </li>
                            <li>
                                I am fully responsible for completing all administrative obligations,
                                including dividend distribution, profit sharing, and business closure in the event of
                                bankruptcy or liquidation.
                            </li>
                            <li>
                                I take full responsibility for the control and management of the asset,
                                and I am required to comply with all regulations and provisions that I have
                                established in the <span className="font-semibold">Asset Rules</span> section.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">I hereby truthfully declare that:</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>All documents I upload are accurate, valid, and their authenticity can be accounted for.</li>
                            <li>I have set the location, type, and total token amount with full awareness and responsibility.</li>
                            <li>I understand that any mistakes in data entry or negligence are entirely my own responsibility.</li>
                        </ul>
                    </div>

                    <div className="space-y-2 border-b border-gray-300 pb-4">
                        <h1 className="font-bold text-base">Additional Terms</h1>
                        <ul className="list-decimal list-inside space-y-1">
                            <li>I acknowledge that there are market, legal, and technological risks that may affect the value and sustainability of the asset.</li>
                            <li>I agree to provide clarification, additional evidence, or supporting documents if requested by an authorized party.</li>
                            <li>I accept that any violation of these terms and conditions may result in suspension, freezing, or removal of the asset.</li>
                            <li>By submitting, I confirm that I have read, understood, and agreed to all the applicable terms & conditions.</li>
                        </ul>
                    </div>

                    <button
                        onClick={() => handleCreateAsset()}
                        className="p-2 background-dark rounded-md text-white cursor-pointer"
                    >
                        Create Asset
                    </button>
                </div>
            </div>
        </div>
    )
}