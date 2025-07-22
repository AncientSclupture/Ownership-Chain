import { UserProfile as UserProfileTypes } from "../types/rwa";

function CreateAvatar({ name = "noname", alias = "unknown" }: { name?: string, alias?: string }) {
    return name[0] + alias[0];
}


export function UserProfile({ setOpenModal, userprof = null }: { setOpenModal: (d: boolean) => void, userprof?: UserProfileTypes | null }) {

    return (
        <div className="flex items-center justify-between md:flex-col md:items-start md:space-y-2">
            {/* simple avatar */}
            <div className="w-fit flex items-center space-x-5">
                <div className="bg-blue-600 uppercase text-white font-bold text-4xl rounded-full w-[20vw] h-[20vw] md:w-[8vw] md:h-[8vw] flex justify-center items-center">
                    {CreateAvatar({ alias: userprof?.alias[0], name: userprof?.name[0], })}
                </div>
                {/* Name & Alias */}
                <div className="text-start">
                    <p className="text-lg font-semibold">{userprof?.name[0] ?? "Unknown"}</p>
                    <p className="text-sm text-gray-500">{userprof?.alias[0] ?? "Unknown"}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="w-[40%] grid grid-cols-2  gap-2">
                <p className="text-gray-500">Assets</p>
                <p className="font-semibold">{userprof?.totalAssets ?? "-"}</p>
                <p className="text-gray-500">Tokens</p>
                <p className="font-semibold">{userprof?.totalValue ?? "-"}</p>
                <p className="text-gray-500">Status</p>
                <p>{userprof?.verified ? "listed" : "anonimous"}</p>
                <div className="space-y-1 col-span-2 md:hidden">
                    <div className="text-sm font-semibold text-white p-2 w-full bg-blue-500 rounded-sm hover:bg-blue-600 cursor-pointer text-center" onClick={() => setOpenModal(true)}>
                        Create Asset
                    </div>
                </div>
            </div>
        </div>
    );
}