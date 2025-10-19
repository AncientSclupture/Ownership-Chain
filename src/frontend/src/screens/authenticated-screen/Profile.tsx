import React from "react";
import { Sidebar } from "../../components/dashboard/sidebar";
import { MainLayout } from "../../components/main-layout";
import { User } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import { downloadFile, exportKey, getUserStatusText, ReduceCharacters } from "../../helper/rwa-helper";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { NotificationContext } from "../../context/NotificationContext";

export function ProfileScreen() {
    const [loadedUserData, setLoadedUserData] = React.useState<User | null>(null);
    const [isloading, setIsloading] = React.useState(true);
    const { userPrincipal } = React.useContext(AuthContext);
    const { setModalKind } = React.useContext(ModalContext);
    const { setNotificationData } = React.useContext(NotificationContext);

    const [flag, setFlag] = React.useState(false);

    const handleGetBalance = async () => {
        try {
            setIsloading(true);
            const res = await backendService.getBalanceForDemo();
            if (res[0] === false) throw Error(res[1]);
            setNotificationData({ title: "top up success", description: res[1], position: "bottom-right" })
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "top up failed", description: msg, position: "bottom-right" })
        } finally {
            setIsloading(false)
            setFlag(!flag)
        }
    }

    React.useEffect(() => {
        async function init() {
            try {
                setIsloading(true);
                if (!userPrincipal) throw new Error("User Principal is not set up");
                const userRes = await backendService.getRegisteredUser(userPrincipal);
                if (!userRes || userRes.length === 0) throw new Error("User Principal is not set up");
                setLoadedUserData(userRes[0] ?? null);
            } catch (error) {
                setLoadedUserData(null);
            } finally {
                setIsloading(false)
                setFlag(!flag);
            }
        }
        init();
    }, [userPrincipal]);

    React.useEffect(() => {
        async function init() {
            try {
                setIsloading(true);
                if (!userPrincipal) throw new Error("User Principal is not set up");
                const userRes = await backendService.getRegisteredUser(userPrincipal);
                if (!userRes || userRes.length === 0) throw new Error("User Principal is not set up");
                setLoadedUserData(userRes[0] ?? null);
            } catch (error) {
                setLoadedUserData(null);
            } finally {
                setIsloading(false)
            }
        }
        init();
    }, [flag])

    async function generatekey() {
        try {
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
            downloadFile("private.pem", privatePem);
            downloadFile("public.pem", publicPem);
            downloadFile("private.txt", privatePem);
            downloadFile("public.txt", publicPem);
            setNotificationData({ title: "success generated key pairing", description: "", position: "bottom-right" })
        } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            setNotificationData({ title: "failed generated key pairing", description: msg, position: "bottom-right" })
        }
    }

    if (isloading) return <LoaderComponent fullScreen={true} text="Please Wait, While Load User Data" />

    return (
        <MainLayout needProtection={true}>
            <div className="flex min-h-screen">
                <Sidebar />

                <div className="flex-1 p-6 bg-white">
                    <h1 className="text-2xl font-semibold mb-4">View Your Profile and Portofolio here</h1>
                    <div className="text-gray-600">
                        <p>ALl you see here is the mock balance that you can use to do activities in this platform</p>
                    </div>

                    <div className="mt-10">
                        <h1 className="text-2xl font-semibold mb-4">List That You Can Do</h1>
                        <div className="space-y-3">
                            <div className="p-4 rounded-md border border-gray-300">
                                <div className="mt-5 space-y-1 flex flex-col items-start">
                                    {loadedUserData &&
                                        <div className="w-full p-2">
                                            <h2 className="text-lg font-semibold mb-3 text-gray-800">
                                                Register Your KYC Dfinity Account
                                            </h2>
                                            <div className="space-y-2 text-sm text-gray-700">
                                                <div className="flex justify-between pb-1">
                                                    <span className="font-medium text-gray-600">Surname:</span>
                                                    <span>{loadedUserData.surname || "-"}</span>
                                                </div>

                                                <div className="flex justify-between pb-1">
                                                    <span className="font-medium text-gray-600">Principal Address:</span>
                                                    <span className="font-mono text-gray-800">
                                                        {ReduceCharacters(loadedUserData.principalAddress.toText(), 20)}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between pb-1">
                                                    <span className="font-medium text-gray-600">Status:</span>
                                                    <span
                                                        className={`font-semibold ${getUserStatusText(loadedUserData.userStatus) === "Approve"
                                                            ? "text-green-600"
                                                            : getUserStatusText(loadedUserData.userStatus) === "Suspended"
                                                                ? "text-yellow-600"
                                                                : "text-red-500"
                                                            }`}
                                                    >
                                                        {getUserStatusText(loadedUserData.userStatus)}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between">
                                                    <span className="font-medium text-gray-600">Balance:</span>
                                                    <span className="text-gray-800">{loadedUserData.mockBalance}</span>
                                                </div>
                                            </div>
                                        </div>

                                    }
                                    {!loadedUserData &&
                                        <button
                                            onClick={() => {
                                                setModalKind(ModalKindEnum.createkyc);
                                                setFlag(!flag);
                                            }}
                                            className="background-dark p-2 text-white rounded-md cursor-pointer w-fit"
                                        >
                                            Register
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="p-4 rounded-md border border-gray-300">
                                <h1>Generate Your Public and Private Key and Insert Public Key into KYC data</h1>
                                <div className="mt-5 space-y-1 flex flex-col">
                                    <div className="flex space-x-5 items-center">
                                        <button className="background-dark p-2 text-white rounded-md cursor-pointer w-fit" onClick={() => generatekey()}>Generate Keys</button>
                                        {/* {!loadedUserData?.publickey && <button className="background-dark p-2 text-white rounded-md cursor-pointer w-fit">Add Public Key</button>} */}
                                        <button className="background-dark p-2 text-white rounded-md cursor-pointer w-fit" onClick={() => setModalKind(ModalKindEnum.addpubkey)}>Add Public Key</button>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 rounded-md border border-gray-300">
                                <h1>Top Up Mock Balance to do Actifities</h1>
                                <div className="mt-5 space-y-1 flex flex-col">
                                    <button
                                        onClick={handleGetBalance}
                                        disabled={isloading}
                                        className="background-dark p-2 text-white rounded-md cursor-pointer w-fit"
                                    >
                                        {isloading ? "loading..." : "Top Up Mock Balance"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}