import React from "react"
import { Asset, Ownership } from "../../types/rwa";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { backendService } from "../../services/backendService";
import { backend } from "../../../../declarations/backend";
import { formatMotokoTime, getAssetStatusText } from "../../helper/rwa-helper";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";

function OwnershipRow({ ownershipdata }: { ownershipdata: Ownership }) {
    return (
        <div className="grid grid-cols-5 gap-5 border-b border-gray-700 pb-2 px-4 items-center">
            <div>{ownershipdata.id}</div>
            <div>{ownershipdata.purchasePrice}</div>
            <div>{ownershipdata.tokenOwned}</div>
            <div>{ownershipdata.maturityDate === BigInt(0) ? 'no expired date' : formatMotokoTime(ownershipdata.maturityDate)}</div>
            <div className="flex gap-2 flex-col md:flex-row">
                <button
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
                >
                    Sell
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
                >
                    Transfer
                </button>
            </div>
        </div>
    );
}

function OwnershipTable({ ownershipdata }: { ownershipdata: Ownership[] }) {
    return (
        <div className="text-gray-600 space-y-3">
            <h1 className="text-xl">My Ownership</h1>
            {ownershipdata.length === 0 ? (
                <div className="w-full flex items-center justify-center">
                    <p className="text-gray-500">No Data</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-5 gap-5 border-b border-gray-700 pb-2 px-4">
                        <div>ID</div>
                        <div>Price</div>
                        <div>Token</div>
                        <div>Expiry Date</div>
                        <div>Action</div>
                    </div>
                    {ownershipdata.map((d, idx) =>
                        <OwnershipRow ownershipdata={d} key={idx} />
                    )}
                </>
            )}
        </div>
    );
}

function AssetRow({ assetdata }: { assetdata: Asset }) {
    const { setModalKind, assetidmanagement } = React.useContext(ModalContext)
    return (
        <div className="grid grid-cols-5 gap-5 border-b border-gray-700 pb-2 px-4 items-center">
            <div>{assetdata.id}</div>
            <div>{assetdata.name}</div>
            <div>{assetdata.tokenLeft}</div>
            <div>{getAssetStatusText(assetdata.assetStatus)}</div>
            <div className="flex gap-2 flex-col md:flex-row">
                <button
                    onClick={() => {
                        assetidmanagement.setter(assetdata.id)
                        setModalKind(ModalKindEnum.changeassetstatus)
                    }}
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
                >
                    {getAssetStatusText(assetdata.assetStatus) !== 'Open For Sale' ? 'open' : 'close'}
                </button>
                <button
                    className="px-3 py-1 rounded bg-gray-500 text-white hover:bg-gray-600 text-sm"
                >
                    dividend
                </button>
            </div>
        </div>
    );
}

function AssetTable({ assetData }: { assetData: Asset[] }) {
    return (
        <div className="text-gray-600 space-y-3">
            <h1 className="text-xl">My Assets</h1>
            {assetData.length === 0 ? (
                <div className="w-full flex items-center justify-center">
                    <p className="text-gray-500">No Data</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-5 gap-5 border-b border-gray-700 pb-2 px-4">
                        <div>ID</div>
                        <div>Name</div>
                        <div>Token left</div>
                        <div>Status</div>
                        <div>Action</div>
                    </div>
                    {assetData.map((d, idx) =>
                        <AssetRow assetdata={d} key={idx} />
                    )}
                </>
            )}
        </div>
    );
}

export function AssetAndOwnerDashboard() {
    const [isLoading, setIsLoading] = React.useState(true);

    const [myasset, setMyasset] = React.useState<Asset[]>([]);
    const [myownership, setMyownership] = React.useState<Ownership[]>([]);

    const { setNotificationData } = React.useContext(NotificationContext);

    React.useEffect(() => {
        async function fetchData() {
            setIsLoading(true)
            try {
                const myassetData = await backendService.getMyAssets();
                setMyasset(myassetData);
                const myownershipData = await backend.getMyOwnerShip();
                setMyownership(myownershipData);
            } catch (error) {
                setNotificationData({
                    title: "error fecthing data",
                    description: "",
                    position: "bottom-right"
                });
            } finally {
                setIsLoading(false)
            }
        }

        fetchData();
    }, [])


    if (isLoading) {
        return <LoaderComponent fullScreen={true} />
    }

    return (
        <div className="space-y-5">
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <AssetTable assetData={myasset} />
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-white">
                <OwnershipTable ownershipdata={myownership} />
            </div>
        </div>
    )
}