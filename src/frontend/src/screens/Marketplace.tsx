import { ActivityLayout } from "../components/layout";
import React from "react";
import { backendService } from "../services/backendService";
import { Asset } from "../types/rwa";
import { AssetCard } from "../components/asset-card";

enum PropertyTypes {
  Property = "Property",
  Business = "Business",
  Artwork = "Artwork",
  Vehicle = "Vehicle",
  Equipment = "Equipment",
  Other = "Other",
}

function Markeatplace() {
  const [retrivedData, setRetrivedData] = React.useState<Asset[]>([]);
  const [load, setLoad] = React.useState(true);
  const [selectedType, setSelectedType] = React.useState<PropertyTypes | "All">("All");
  const [searchId, setSearchId] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 6;

  React.useEffect(() => {
    const callAssets = async () => {
      const data = await backendService.getAllAssets();
      setRetrivedData(data);
      setLoad(false);
    };

    callAssets();
  }, [load]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedType, searchId]);

  const filteredData = retrivedData.filter((asset) => {
    const matchType = selectedType === "All" || Object.keys(asset.assetType)[0] === selectedType;
    const matchSearch = asset.id.toLowerCase().includes(searchId.toLowerCase());
    return matchType && matchSearch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ActivityLayout isLoadPage={load}>
      <div className="p-10 shadow-md min-h-screen">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex space-x-2 p-2 rounded-md overflow-x-auto">
            <div
              className={`text-sm lowercase p-2 rounded-md cursor-pointer ${selectedType === "All" ? 'font-bold bg-blue-800 text-white' : ''}`}
              onClick={() => setSelectedType("All")}
            >
              All
            </div>
            {Object.values(PropertyTypes).map((type) => (
              <div
                className={`text-sm lowercase p-2 rounded-md cursor-pointer ${selectedType === type ? 'font-bold bg-blue-800 text-white' : ''}`}
                onClick={() => setSelectedType(type)}
                key={type}
              >
                {type}
              </div>
            ))}
          </div>

          <div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Search by ID..."
              className="border border-gray-300 rounded px-3 py-2 text-sm w-64"
            />
          </div>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {paginatedData.length > 0 ? (
            paginatedData.map((asset) => (
              <AssetCard key={asset.id} {...asset} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500">
              No assets found.
            </div>
          )}
        </div>

        <div className="flex justify-center items-center space-x-2 mt-4">
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>
    </ActivityLayout>
  );
}

export default Markeatplace;
