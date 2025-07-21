import { ActivityLayout } from "../components/layout";
import React, { useState } from "react";
import { backendService } from "../services/backendService"
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
  const [retrivedData, setRetrivedData] = useState<Asset[]>([]);
  const [load, setLoad] = useState(true);
  const [selectedType, setSelectedType] = useState<PropertyTypes | "All">("All");


  React.useEffect(() => {
    const callAssets = async () => {
      const data = await backendService.getAllAssets();
      setRetrivedData(data);

      setLoad(false);
      console.log(data);
    }

    callAssets();

  }, [load])


  const filteredData = retrivedData.filter((asset) => {
    if (selectedType === "All") return true;
    return Object.keys(asset.assetType)[0] === selectedType;
  });

  return (
    <ActivityLayout isLoadPage={load}>
      <div className="p-10 shadow-md min-h-screen">
        {/* filter data */}
        <div>
          {/* start selector here */}
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

          {/* end selector here */}
        </div>
        {/* data */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-4">
          {filteredData.map((asset) => (
            <AssetCard key={asset.id} {...asset} />
          ))}
        </div>
      </div>
    </ActivityLayout>
  );
}
export default Markeatplace;
