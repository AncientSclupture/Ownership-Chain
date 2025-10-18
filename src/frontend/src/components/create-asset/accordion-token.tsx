import React from "react";

export default function TokenAsset({
  isDone,
  setIsDone,
  totalToken,
  tokenLeft,
  minTokenPurchased,
  maxTokenPurchased,
  pricePerToken,
  setTotalToken,
  setTokenLeft,
  setMinTokenPurchased,
  setMaxTokenPurchased,
  setPricePerToken,
}: {
  isDone: boolean;
  setIsDone: React.Dispatch<React.SetStateAction<boolean>>;
  totalToken: bigint;
  tokenLeft: bigint;
  minTokenPurchased: bigint;
  maxTokenPurchased: bigint;
  pricePerToken: number;
  setTotalToken: React.Dispatch<React.SetStateAction<bigint>>;
  setTokenLeft: React.Dispatch<React.SetStateAction<bigint>>;
  setMinTokenPurchased: React.Dispatch<React.SetStateAction<bigint>>;
  setMaxTokenPurchased: React.Dispatch<React.SetStateAction<bigint>>;
  setPricePerToken: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);


  const handleDoneClick = () => {
    // Validasi
    if (
      totalToken <= 0n ||
      tokenLeft <= 0n ||
      minTokenPurchased <= 0n ||
      maxTokenPurchased <= 0n ||
      pricePerToken <= 0n
    ) {
      setError("All values must be greater than 0");
      return;
    }
    if (tokenLeft > totalToken) {
      setError("Token left cannot exceed total token");
      return;
    }
    if (minTokenPurchased > maxTokenPurchased) {
      setError("Minimum token purchased cannot exceed maximum token purchased");
      return;
    }
    if (maxTokenPurchased > totalToken) {
      setError("Maximum token purchased cannot exceed total token");
      return;
    }

    // Validasi lolos
    setError(null);
    setIsDone(true);
  };

  const handleBigIntChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<bigint>>
  ) => {
    try {
      const num = BigInt(value || "0");
      setter(num);
    } catch {
      setter(0n);
    }
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
          Token Asset
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""
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
        className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-fit py-5 px-6" : "max-h-0 px-6"
          }`}
      >
        <div className="space-y-4">
          {/* Input fields */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Total Token
            </label>
            <input
              type="text"
              value={totalToken.toString()}
              onChange={(e) => handleBigIntChange(e.target.value, setTotalToken)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Token Left
            </label>
            <input
              type="text"
              value={tokenLeft.toString()}
              onChange={(e) => handleBigIntChange(e.target.value, setTokenLeft)}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Min Token Purchased
            </label>
            <input
              type="text"
              value={minTokenPurchased.toString()}
              onChange={(e) =>
                handleBigIntChange(e.target.value, setMinTokenPurchased)
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Max Token Purchased
            </label>
            <input
              type="text"
              value={maxTokenPurchased.toString()}
              onChange={(e) =>
                handleBigIntChange(e.target.value, setMaxTokenPurchased)
              }
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Price Per Token
            </label>
            <input
              type="text"
              value={pricePerToken.toString()}
              onChange={(e) => setPricePerToken(Number(e.target.value))}
              className="w-full border rounded-md px-3 py-2"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>

        {/* Button to mark the form as done */}
        <button
          onClick={handleDoneClick}
          className={`mt-6 px-4 py-2 rounded-md text-sm font-medium ${isDone
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
