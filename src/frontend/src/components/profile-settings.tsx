export enum UserOptionsType {
  MyAssets = "My Assets",
  Transactions = "Transactions",
  Vote = "Vote",
}

export function ProfileSettings({
  selectedType,
  setSelectedType,
  setOpenModal
}: {
  selectedType: UserOptionsType;
  setSelectedType: (type: UserOptionsType) => void;
  setOpenModal: (d: boolean) => void;

}) {
  return (
    <div className="hidden md:block space-y-5">
      <div>
        <p className="text-sm text-gray-700">Filter the data you want to display</p>
        <div className="flex space-x-2 p-2 rounded-md">
          {Object.values(UserOptionsType).map((type) => (
            <div
              key={type}
              className={`text-sm lowercase p-2 rounded-md cursor-pointer hover:bg-blue-300 ${selectedType === type ? "font-bold bg-blue-800 text-white hover:bg-blue-800" : ""
                }`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-700">
          There are some steps you must fulfill to create new assets
        </p>
        <div className="font-semibold text-white p-2 w-full bg-blue-500 rounded-sm hover:bg-blue-600 cursor-pointer text-center" onClick={() => setOpenModal(true)}>
          Click Here To Create Assets
        </div>
      </div>
    </div>
  );
}
