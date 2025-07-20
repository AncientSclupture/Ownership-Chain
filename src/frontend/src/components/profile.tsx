function CreateAvatar({ name = "noname", alias = "unknown" }: { name?: string, alias?: string }) {
  return name[0] + alias[0];
}

export function UserProfile() {
    return (
        <div className="flex items-center justify-between md:flex-col md:items-start md:space-y-2">
            {/* simple avatar */}
            <div className="w-fit flex items-center space-x-5">
                <div className="bg-blue-600 uppercase text-white font-bold text-4xl rounded-full w-[20vw] h-[20vw] md:w-[8vw] md:h-[8vw] flex justify-center items-center">
                    {CreateAvatar({})}
                </div>
                {/* Name & Alias */}
                <div className="text-start">
                    <p className="text-lg font-semibold">Username</p>
                    <p className="text-sm text-gray-500">Alias</p>
                </div>
            </div>

            {/* Stats */}
            <div className="w-[40%] grid grid-cols-2  gap-2">
                <p className="text-sm text-gray-500">Assets</p>
                <p className="font-semibold">100</p>
                <p className="text-gray-500">Tokens</p>
                <p className="font-semibold">20</p>
                <p className="text-gray-500">Status</p>
                <p>Verified</p>
            </div>
        </div>
    );
}