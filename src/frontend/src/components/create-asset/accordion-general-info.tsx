import React from "react";

export default function GeneralAssetInfo({
  isDone,
  setIsDone,
  name,
  description,
  assetType,
  setName,
  setDescription,
  setAssetType,
}: {
  isDone: boolean;
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  description: string;
  assetType: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  setAssetType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDoneClick = () => {
    if (!name.trim() || !description.trim() || !assetType.trim()) {
      setError("All fields are required.");
      return;
    }
    setError(null);
    setIsDone(true);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-6 py-4 text-left"
      >
        <span
          className={`${isDone ? "text-green-700" : "text-gray-800"} font-medium`}
        >
          General Asset Info
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-fit py-5 px-6" : "max-h-0 px-6"
        }`}
      >
        {/* Form Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Asset Type
            </label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full border rounded-md px-3 py-2"
            >
              <option value="">Select Type</option>
              <option value="Digital">Digital</option>
              <option value="Physical">Physical</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          {/* Error message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Button to mark the form as done */}
        <button
          onClick={handleDoneClick}
          className={`mt-6 px-4 py-2 rounded-md text-sm font-medium ${
            isDone
              ? "bg-green-100 text-green-700 border border-green-300"
              : "background-dark text-white hover:brightness-110"
          }`}
        >
          {isDone ? "Mark as Not Done" : "Mark as Done"}
        </button>
      </div>
    </div>
  );
}
