import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import React from "react";
import { isSameAssetType, text2AssetStatus, text2AssetType } from "../../helper/rwa-helper";
import { AssetType } from "../../types/rwa";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";

export function MarketPlacePagination(
  {
    paginationNumber,
    setPagination,
    assetCount
  }: {
    paginationNumber: bigint,
    setPagination: React.Dispatch<React.SetStateAction<bigint>>,
    assetCount: bigint
  }
) {
  const TOTAL_ITEM = 6;

  const totalPages = Math.ceil(Number(assetCount) / TOTAL_ITEM);
  const currentPage = Number(paginationNumber);

  function handleNext() {
    const maxValue = totalPages - 1;
    if (currentPage < maxValue) {
      setPagination(BigInt(currentPage + 1));
    } else {
      setPagination(BigInt(maxValue));
    }
  }

  function handlePrev() {
    if (currentPage > 0) {
      setPagination(BigInt(currentPage - 1));
    } else {
      setPagination(BigInt(0));
    }
  }

  function getVisiblePages() {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(0);

      const start = Math.max(1, currentPage - 1);
      const end = Math.min(totalPages - 2, currentPage + 1);

      if (start > 1) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages - 1);
    }

    return pages;
  }

  const visiblePages = getVisiblePages();

  return (
    <div className={`w-full flex items-center justify-center my-10 ${assetCount === BigInt(0) ? 'hidden' : ''}`}>
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePrev}
          className="md:min-w-[3.2vw] min-w-[8vw] aspect-square rounded-md background-dark flex items-center justify-center cursor-pointer"
        >
          <ChevronLeft color="white" />
        </button>

        {visiblePages.map((p, idx) =>
          p === "..." ? (
            <span key={idx} className="px-2">...</span>
          ) : (
            <button
              key={p}
              onClick={() => setPagination(BigInt(p))}
              className={`md:min-w-[3.2vw] min-w-[8vw] aspect-square rounded-md ${currentPage === p ? "background-dark text-white" : "bg-gray-400"} cursor-pointer`}
            >
              {Number(p) + 1}
            </button>
          )
        )}

        <button
          onClick={handleNext}
          className="md:min-w-[3.2vw] min-w-[8vw] aspect-square rounded-md background-dark flex items-center justify-center cursor-pointer"
        >
          <ChevronRight color="white" />
        </button>
      </div>
    </div>
  );
};

export function MarketPlaceTypeFilter(
  { setAssetType }: { setAssetType: React.Dispatch<React.SetStateAction<AssetType[]>> }
) {
  function handleTypeFilter(value: string) {
    const newType = text2AssetType(value);

    setAssetType((prev) => {
      const exists = prev.some((t) => isSameAssetType(t, newType));

      if (exists) {
        return prev.filter((t) => !isSameAssetType(t, newType));
      } else {
        return [...prev, newType];
      }
    });
  }

  return (
    <div>
      <div className="w-full border border-gray-300 rounded-md p-5 md:w-[20vw]">
        <h1 className="text-xl text-gray-500 mb-7">Asset Types</h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" name="property" id="property"
              className="w-5 h-5"
              onClick={() => handleTypeFilter("property")}
            />
            <label htmlFor="property">property</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" name="business" id="business"
              className="w-5 h-5"
              onClick={() => handleTypeFilter("business")}
            />
            <label htmlFor="business">business</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" name="artwork" id="artwork"
              className="w-5 h-5"
              onClick={() => handleTypeFilter("artwork")}

            />
            <label htmlFor="artwork">artwork</label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox" name="equipment" id="equipment"
              className="w-5 h-5"
              onClick={() => handleTypeFilter("equipment")}

            />
            <label htmlFor="equipment">equipment</label>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MarketPlaceSearchAsset() {
  const [seacrhQuery, setSeacrhQuery] = React.useState("");
  const [assetType, setAssetType] = React.useState("all");
  const [isLoad, setIsLoad] = React.useState(false);

  const { setNotificationData } = React.useContext(NotificationContext);
  const {setModalKind, findassetmanagement} = React.useContext(ModalContext)

  async function handleSearch() {
    setIsLoad(true);
    try {
      const res = await backendService.searchAsset(seacrhQuery, [text2AssetStatus(assetType)])
      findassetmanagement.setter(res)
      setModalKind(ModalKindEnum.findassetsearch);
    } catch (error) {
      setNotificationData({
        title: `Asset ${seacrhQuery} not found`,
        description: "cannot find data you are searching for, insert proper name of asset",
        position: "bottom-right",
        duration: 3500
      });
    } finally {
      setIsLoad(false)
    }
  }

  return (
    <div className="w-full flex items-center justify-center">
      <div className="shadow-lg w-full md:w-[60vw] rounded-md border border-gray-300 my-8 bg-white">
        <div className="p-4 space-y-5 w-full md:flex md:items-center md:space-x-3 md:space-y-0">
          <input
            type="text" name="search" id="search"
            className="border border-gray-300 w-full rounded-md p-2 md:w-[70%]"
            placeholder="cosmic girls"
            value={seacrhQuery}
            onChange={(e) => setSeacrhQuery(e.target.value)}
            disabled={isLoad}
          />
          <select
            name="status" id="status" className="w-full border border-gray-300 rounded-md p-2 md:w-[15%]"
            onChange={(e) => setAssetType(e.target.value)}
            disabled={isLoad}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">In active</option>
          </select>
          <button
            disabled={isLoad}
            onClick={() => handleSearch()}
            className="background-dark p-2 rounded-md w-full flex items-center justify-center space-x-3 cursor-pointer md:w-[15%]"
          >
            <Search size={20} color="white" />
            <p className="text-white">Search</p>
          </button>
        </div>
      </div>
    </div>
  )
}