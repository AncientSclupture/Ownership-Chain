import { X } from "lucide-react";
import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { useParams } from "react-router-dom";
import { backendService } from "../../services/backendService";

export default function SupportAssetModal() {
    const { assetid } = useParams<{ assetid: string }>();

    const { setModalKind } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);
    const [isSponsor, setIsSponsor] = React.useState(true);
    const [isLoading, setIsLoading] = React.useState(false);

    // guarantee
    const [guaranteecontent, setguaranteecontent] = React.useState("")
    const [guaranteeamount, setGuaranteeamount] = React.useState<bigint>(BigInt(0))

    // sponsorship
    const [sponsorcontent, setSponsorcontent] = React.useState("")
    const [turstValue, setTrustValue] = React.useState<bigint>(BigInt(0))

    function handleclose() {
        setModalKind(null);
        setGuaranteeamount(BigInt(0));
        setguaranteecontent("");
        setSponsorcontent("");
        setTrustValue(BigInt(0));
    };

    async function handleAddGuarantee() {
        setIsLoading(true);
        try {
            if (!assetid) {
                return
            }
            const res = await backendService.createAssetGuarantee(assetid, guaranteecontent, guaranteeamount);
            setNotificationData({ title: "success to suport asset with guarantee", description: `${res}`, position: "bottom-right" })
        } catch (error) {
            setNotificationData({ title: "failed to suport asset with guarantee", description: `${error}`, position: "bottom-right" })
        } finally {
            setIsLoading(false);
            handleclose();
        }
    }

    async function handleSponsor() {
        setIsLoading(true);
        try {
            if (!assetid) {
                return
            }
            const res = await backendService.addNewSponsor(assetid, sponsorcontent, turstValue);
            setNotificationData({ title: "success to suport asset as sponsorship", description: `${res}`, position: "bottom-right" })
        } catch (error) {
            setNotificationData({ title: "failed to suport asset as sponsorship", description: `${error}`, position: "bottom-right" })
        } finally {
            setIsLoading(false);
            handleclose();
        }
    }

    React.useEffect(() => {
        if (isSponsor) {
            setGuaranteeamount(BigInt(0));
            setguaranteecontent("");
        } else {
            setSponsorcontent("");
            setTrustValue(BigInt(0));
        }
    }, [isSponsor]);

    if (isLoading) return <LoaderComponent fullScreen={true} text="processing transaction ...." />

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-[80vw] md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl">Support This asset</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={() => handleclose()}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="w-full py-4">
                        <div className="flex items-center space-x-5">
                            <button
                                onClick={() => setIsSponsor(true)}
                                className={`p-2 cursor-pointer text-white rounded-md text-sm ${isSponsor ? 'bg-gray-700' : 'bg-gray-500'}`}
                            >
                                Sponsorship
                            </button>
                            <button
                                onClick={() => setIsSponsor(false)}
                                className={`p-2 cursor-pointer text-white rounded-md text-sm ${isSponsor ? 'bg-gray-500' : 'bg-gray-700'}`}
                            >
                                Guarantee
                            </button>
                        </div>
                        <div className="mt-5">
                            {/* guarantee */}
                            <div className={`${isSponsor ? 'hidden' : ''} space-y-2`}>
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="guaranteecontent">clarify your gurantee content</label>
                                    <textarea
                                        name="guaranteecontent" id="guaranteecontent"
                                        className="p-1 text-sm resize-none md:h-[8vw] h-[16vw] border border-gray-300 rounded-md"
                                        value={guaranteecontent}
                                        onChange={(e) => setguaranteecontent(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="guaranteecontent">guarantee amount (icp)</label>
                                    <input
                                        type="text" name="guaranteeamount" id="guaranteeamount"
                                        className="p-1 border border-gray-300 rounded-md"
                                        value={guaranteeamount.toString()}
                                        onChange={(e) => setGuaranteeamount(BigInt(e.target.value))}
                                    />
                                </div>
                                <button
                                    onClick={() => handleAddGuarantee()}
                                    className="p-2 text-sm text-white rounded-md background-dark"
                                >
                                    Submit
                                </button>
                            </div>
                            {/* sponsorship */}
                            <div className={`${isSponsor ? '' : 'hidden'} space-y-2`}>
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="sponsorcontent">clarify your sponsorship content</label>
                                    <textarea
                                        name="sponsorcontent" id="sponsorcontent"
                                        className="p-1 text-sm resize-none md:h-[8vw] h-[16vw] border border-gray-300 rounded-md"
                                        value={sponsorcontent}
                                        onChange={(e) => setSponsorcontent(e.target.value)}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <label htmlFor="turstvalue">trust value amount (icp)</label>
                                    <input
                                        type="text" name="turstvalue" id="turstvalue"
                                        className="p-1 border border-gray-300 rounded-md"
                                        value={turstValue.toString()}
                                        onChange={(e) => setTrustValue(BigInt(e.target.value))}
                                    />
                                </div>
                                <button
                                    onClick={() => handleSponsor()}
                                    className="p-2 text-sm text-white rounded-md background-dark"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}