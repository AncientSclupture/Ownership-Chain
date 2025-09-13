import { BookX, FileBadge, Focus, MapPin, Phone, UserCog, UserRoundCheck } from "lucide-react";
import React from "react";
import { UserOverviewResult } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { LoaderComponent } from "../LoaderComponent";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { getIdentityTypeText, getKYCSstatusText } from "../../helper/rwa-helper";

export function SelfInformationDashboard() {
    const [isLoading, setIsLoading] = React.useState(true);
    const [profileData, setProfileData] = React.useState<UserOverviewResult | null>(null);

    const { isDoneRegist, setModalKind } = React.useContext(ModalContext);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            try {
                const res = await backendService.getMyprofileInfo();
                setProfileData(res);
            } catch (error) {
                setProfileData(null)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();
    }, [isDoneRegist])

    if (isLoading) return <LoaderComponent fullScreen />

    return (
        <div className="space-y-5">
            <div className="p-4 border border-gray-200 rounded-md bg-white space-y-5">
                <div className="space-y-4">
                    <h1 className="text-blue-950 font-stretch-ultra-condensed text-[3vw] md:text-[1.5vw]">Self Information And KYC Parameter</h1>
                    <div className="space-y-3">
                        <p className="font-semibold text-gray-900">The Use and Essence of KYC</p>
                        <div className="space-y-3 text-gray-700 text-sm">
                            <div className="flex items-center space-x-2">
                                <UserCog size={20} className="text-blue-800" />
                                <p>Establishes customer identity to ensure regulatory compliance and trustworthiness.</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <UserCog size={20} className="text-blue-800" />
                                <p>Reduces risk of fraud, identity theft, and other financial crimes.</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <FileBadge size={20} className="text-blue-800" />
                                <p>Provides you with a secure pair of private and public keys to protect and verify your assets.</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Focus size={20} className="text-blue-800" />
                                <p>Enables self-verification using your private key, ensuring authenticity and ownership.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    {!profileData &&
                        <div
                            onClick={() => setModalKind(ModalKindEnum.registuser)}
                            className="flex flex-col items-center justify-center space-y-3 bg-gray-200 p-4 rounded-md cursor-pointer hover:bg-gray-300 border-dashed border-gray-300"
                        >
                            <BookX size={50} color="gray" />
                            <p className="text-sm">no data available</p>
                            <p className="text-sm font-thin">(click to create one)</p>
                        </div>
                    }
                    {profileData &&
                        <div className="text-gray-900 flex items-center space-x-20">
                            <div className="space-y-2 w-full md:w-fit">
                                <p>First name</p>
                                <p>Last name</p>
                                <div className="flex space-x-1 items-center">
                                    <Phone size={15} />
                                    <p>Phone number</p>
                                </div>
                                <div className="flex space-x-1 items-center">
                                    <MapPin size={15} />
                                    <p>Location</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <p className="font-semibold">{getIdentityTypeText(profileData.userIdentity.userIdentity)}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <UserRoundCheck size={15} />
                                    <p>Accounts status</p>
                                </div>
                            </div>
                            <div className="space-y-2 w-full md:w-fit">
                                <p>{profileData.userIdentity.fullName}</p>
                                <p>{profileData.userIdentity.lastName}</p>
                                <p>{profileData.userIdentity.phone}</p>
                                <div className="flex space-x-2 items-center">
                                    <p>{profileData.userIdentity.country}</p>
                                    <p>{profileData.userIdentity.city}</p>
                                </div>
                                <p>{profileData.userIdentity.userIDNumber}</p>
                                <p className="lowercase p-2 text-sm rounded-md bg-gray-400 w-fit">{getKYCSstatusText(profileData.userIdentity.kyc_level.status)}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
            {profileData &&
                <div className="p-4 border border-gray-200 rounded-md bg-white space-y-5">
                    <div className="space-y-4">
                        <h1 className="text-blue-950 font-stretch-ultra-condensed text-[3vw] md:text-[1.5vw]">Overview</h1>
                        <div className="flex items-start flex-col md:flex-row justify-between md:px-10 px-4 space-y-3 md:space-y-0">
                            <div className="md:w-[25vw] w-full border border-gray-300 p-4 rounded-md">
                                <h2>Ownership Information</h2>
                                <div className="mt-3 space-y-1">
                                    <p>{profileData?.ownership.total} Total Counts</p>
                                    <p>{profileData?.ownership.token} Token</p>
                                </div>
                            </div>

                            <div className="md:w-[25vw] w-full border border-gray-300 p-4 rounded-md">
                                <h2>Transactions Information</h2>
                                <div className="mt-3 space-y-1">
                                    <p>{profileData?.transaction.total} Total</p>
                                    <p>{profileData?.transaction.buy} Buy</p>
                                    <p>{profileData?.transaction.dividend} Dividend</p>
                                    <p>{profileData?.transaction.sell} Sell</p>
                                    <p>{profileData?.transaction.transfer} Transfer</p>
                                </div>
                            </div>

                            <div className="md:w-[25vw] w-full border border-gray-300 p-4 rounded-md">
                                <h2>Asset Information</h2>
                                <div className="mt-3 space-y-1">
                                    <p>{profileData?.asset.total} Total Counts</p>
                                    <p>{profileData?.asset.token} Token</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}