import { MainLayout } from "../layout/main-layout"
import { AssetMainContent, AssetSecondaryContent } from "../components/asset-details-component";

function Asset() {
  return (
    <MainLayout>
      <div className="px-5 pt-15 pb-5 md:px-20 space-y-5 md:space-y-10">
        {/* main content */}
        <AssetMainContent />
        {/* secondary content */}
        <div>
          <AssetSecondaryContent />
        </div>
      </div>
    </MainLayout>
  );
}

export default Asset;
