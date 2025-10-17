#!/usr/bin/env bash
set -e

CANISTER_NAME=backend

echo "🚀 Memulai proses seeding data asset ke canister '$CANISTER_NAME'..."
echo

create_asset() {
  local name=$1
  local description=$2
  local totalToken=$3
  local tokenLeft=$4
  local minTokenPurchased=$5
  local maxTokenPurchased=$6
  local pricePerToken=$7
  local lat=$8
  local long=$9
  local details=${10}
  local docname=${11}
  local dochash=${12}
  local docsig=${13}
  local assetType=${14}      # Physical / Digital / Hybrid
  local assetStatus=${15}    # Active / Pending / Inactive
  local rulename=${16}
  local rulecontent=${17}
  local ownershipMaturityTime=${18}

  echo "📦 Membuat asset: $name"

  dfx canister call $CANISTER_NAME createAsset "(
    record {
      name = \"$name\";
      description = \"$description\";
      totalToken = $totalToken;
      tokenLeft = $tokenLeft;
      minTokenPurchased = $minTokenPurchased;
      maxTokenPurchased = $maxTokenPurchased;
      pricePerToken = $pricePerToken;
      locationInfo = opt record {
        lat = $lat;
        long = $long;
        details = vec { \"$details\" };
      };
      documentHash = vec {
        record { name = \"$docname\"; hash = \"$dochash\"; signature = \"$docsig\"; };
      };
      assetType = variant { $assetType };
      assetStatus = variant { $assetStatus };
      rule = vec {
        record { name = \"$rulename\"; content = \"$rulecontent\"; };
      };
      ownershipMaturityTime = $ownershipMaturityTime;
    }
  )"

  echo "✅ Asset '$name' berhasil dibuat."
  echo
}


create_asset \
  "Luxury Villa Bali" \
  "Beachfront villa with private pool and ocean view" \
  1000 700 1 100 10 \
  -8.409518 115.188919 "Bali, Indonesia" \
  "Sertifikat Kepemilikan" "QmHashVilla123" "SigVillaABC" \
  "Physical" "Active" \
  "No Subleasing" "Tidak boleh disewakan kembali tanpa izin." \
  1000

create_asset \
  "Digital Art NFT" \
  "Exclusive NFT art collection by local artist" \
  500 400 1 50 2 \
  0.0 0.0 "Online Gallery" \
  "NFT Metadata" "QmHashArt123" "SigArtXYZ" \
  "Digital" "Active" \
  "Resale" "Boleh dijual kembali dengan royalti 10%." \
  2000

create_asset \
  "Smart Farming System" \
  "IoT-based precision agriculture platform" \
  2000 1500 5 200 15 \
  -7.006606 110.438127 "Semarang, Indonesia" \
  "Technical Whitepaper" "QmHashFarm456" "SigFarmDEF" \
  "Hybrid" "Pending" \
  "Eco Compliance" "Harus mematuhi standar lingkungan hidup." \
  1742688000000000000

create_asset \
  "Jakarta Office Tower" \
  "Premium grade office space in central Jakarta" \
  2500 2000 10 250 20 \
  -6.208763 106.845599 "Jakarta, Indonesia" \
  "IMB Document" "QmHashOffice999" "SigOfficeZZZ" \
  "Physical" "Active" \
  "Fire Safety" "Wajib memiliki sistem proteksi kebakaran aktif." \
  0

create_asset \
  "AR Metaverse Land" \
  "Virtual land parcel in AR metaverse project" \
  10000 9500 50 1000 5 \
  0.0 0.0 "Metaverse Realm #88" \
  "Map Token" "QmHashMeta888" "SigMetaMMM" \
  "Digital" "Inactive" \
  "Usage" "Tidak boleh digunakan untuk promosi ilegal." \
  0

echo "🎉 Semua data asset berhasil dibuat!"
