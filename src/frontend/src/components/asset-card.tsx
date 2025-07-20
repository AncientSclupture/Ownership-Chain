export function AssetCard() {
    return (
        <div className="p-5 shadow-sm hover:shadow-2xl rounded-md space-y-3 border-[1px] border-gray-200 cursor-pointer">
            {/* header card */}
            <div className="w-full flex items-center justify-between">
                <p className="capitalize text-[3vw] md:text-[1.5vw]">Asset Name</p>
                <p className="text-[2vw] md:text-[1vw] font-bold p-1.5 text-blue-600 rounded-lg">Asset ID</p>
            </div>

            {/* content card */}
            <div className="space-y-2 md:text-[1.2vw]">
                <p className="text-gray-600">
                    Excepteur duis laborum minim pariatur incididunt ex irure laborum mollit pariatur elit esse nisi.
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-700">
                    <p className="font-semibold">Value</p>
                    <p>100</p>
                    <p className="font-semibold">Created In</p>
                    <p>10-12-2020</p>
                    <p className="font-semibold">Status</p>
                    <p>Available</p>
                    <p className="font-semibold">Supply</p>
                    <p>Location</p>
                    <p className="font-semibold">Locations</p>
                    <p>EN</p>
                </div>
            </div>

            {/* footer card */}
            <button className="font-semibold text-white p-2 w-full bg-blue-500 rounded-lg hover:bg-blue-800">
                Details
            </button>
        </div>
    );
}
