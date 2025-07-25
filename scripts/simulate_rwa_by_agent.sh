#!/bin/bash

# Argumen: name, asset_type, variant_value, total_value, total_supply, location, documents (vec[]), metadata (vec[])
create_asset() {
  local name="$1"
  local asset_type="$2"
  local variant_value="$3"
  local total_value="$4"
  local total_supply="$5"
  local location="$6"
  local documents="$7"
  local metadata="$8"

  [[ -z "$documents" ]] && documents="vec {}"
  [[ -z "$metadata" ]] && metadata="vec {}"
  [[ -z "$location" ]] && location="null"
  [[ "$location" != "null" ]] && location="opt \"$location\""

  if [[ "$asset_type" == "Other" ]]; then
    assetTypeStr="variant { Other = \"$variant_value\" }"
  else
    assetTypeStr="variant { $asset_type }"
  fi

  echo "> Creating asset: $name, type: $assetTypeStr, value: $total_value, supply: $total_supply"

  dfx canister call backend createAsset \
    "(\"$name\", \"Description of $name\", $assetTypeStr, $total_value, $total_supply, $location, $documents, $metadata)"
}

echo "Simulation Content: "
echo "> create dfx identity agent1 and agent2"
echo "> agent1 create 3 properties, 2 business, 5 equipments, and 1 other assets"
echo "> agent2 create 5 artwork, 2 vehicle, and 2 properties assets"
echo "> agent1 buy token from random agent2 assets!"
echo "> agent2 buy token from random agent1 assets!"
echo

# Membuat identitas
echo "> creating agent1 and agent2"
dfx identity new findway_agent1 --force
dfx identity new findway_agent2 --force

# Ganti ke agent1
dfx identity use agent1

echo "> agent1 creating 3 property assets"
for i in {1..3}; do
  create_asset "agent1 property $i" "Property" "" $((1*100)) $((1*20)) null "" ""
done

echo "> agent1 creating 2 business assets"
for i in {1..2}; do
  create_asset "agent1 business $i" "Business" "" $((1*1500)) $((1*100)) null "" ""
done

echo "> agent1 creating 5 equipment assets"
for i in {1..5}; do
  create_asset "agent1 equipment $i" "Equipment" "" $((1*800)) 300 null "" ""
done

echo "> agent1 creating 1 other asset"
create_asset "agent1 rare collectible" "Other" "Barang Langka" $((1*1200)) 100 null "" ""

# Ganti ke agent2
dfx identity use agent2

echo "> agent2 creating 5 artwork assets"
for i in {1..5}; do
  create_asset "agent2 artwork $i" "Artwork" "" $((1*200)) $((1*5)) null "" ""
done

echo "> agent2 creating 2 vehicle assets"
for i in {1..2}; do
  create_asset "agent2 vehicle $i" "Vehicle" "" $((1*300)) $((1*10)) null "" ""
done

echo "> agent2 creating 2 property assets"
for i in {1..2}; do
  create_asset "agent2 property $i" "Property" "" $((1*100)) $((1*2)) null "" ""
done


echo "> change identity to findway-dev again"
dfx identity use findway_dev

echo "✅ Simulation Finished!"
