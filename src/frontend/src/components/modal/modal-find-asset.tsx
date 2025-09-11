import React from "react";
import { ModalContext } from "../../context/ModalContext";
import { X } from "lucide-react";
import { getAssetStatusText } from "../../helper/rwa-helper";

export default function FindAssetModal() {
    const { setModalKind, findassetmanagement } = React.useContext(ModalContext);

    function closeButtonHandler() {
        setModalKind(null);
    };

    return (
        <div className="w-full h-full p-10 flex items-center justify-center">
            <div className="w-full md:w-[60vw] bg-white rounded-lg border border-gray-300 p-4">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold">Asset</h1>
                        <button
                            className="p-2 bg-red-500 rounded-full cursor-pointer"
                            onClick={closeButtonHandler}
                        >
                            <X size={15} color="white" />
                        </button>
                    </div>
                    <div className="w-full flex flex-col md:flex-row items-start space-x-8">
                        <div className="background-dark w-full h-[40vw] md:w-[40%] md:h-[20vw] rounded-md" />
                        <div className="w-[60%] flex flex-col md:justify-between justify-evenly md:h-[20vw] h-[40vw]">
                            <div className="space-y-3">
                                <h1 className="text-xl">{findassetmanagement.data[0]?.name}</h1>
                                <p className="text-gray-700">{findassetmanagement.data[0]?.description}</p>
                                <div className="flex items-center text-sm space-x-10">
                                    <p className="p-2 bg-blue-900 rounded-lg text-white">{getAssetStatusText(findassetmanagement.data[0]?.assetStatus)}</p>
                                    <p><span>{findassetmanagement.data[0]?.tokenLeft}</span>/<span>{findassetmanagement.data[0]?.totalToken}</span></p>
                                </div>
                                <p>{findassetmanagement.data[0]?.pricePerToken} ICP / Token</p>
                            </div>
                            <button className="background-dark rounded-md p-2 text-white w-full">Take Look</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}