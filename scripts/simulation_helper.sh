#!/bin/sh

trap on_abort INT
on_abort(){
    echo "\n[!] CTRL+C pressed. Exiting script."
    echo "using dev back identity";
    dfx identity use findway_dev;
    exit 1
}

run_command() {
    method="$1"
    args="$2"
    echo "\nRunning: dfx canister call backend $method $args"
    echo "$(date): dfx canister call backend $method $args" >> history.log
    dfx canister call backend "$method" "$args" 2>&1 | tee -a history.log
}

# Define each method here:
approveBuyProposal() {
    read -p "Proposal ID: " id
    run_command "approveBuyProposal" "(\"$id\")"
}

confirmBuyProposal() {
    read -p "Proposal ID: " id
    run_command "confirmBuyProposal" "(\"$id\")"
}

createAsset() {
    read -p "Name: " name
    read -p "Description: " description
    read -p "AssetType (e.g., #Property or #Business): " type
    read -p "Total Value: " value
    read -p "Total Supply: " supply
    read -p "Location (optional): " location
    read -p "Documents (comma-separated hashes): " docs
    read -p "Metadata (format: key=value,key2=value2): " metadata

    doc_list=$(echo $docs | awk -F',' '{ for(i=1;i<=NF;i++) printf "\""$i"\"," }' | sed 's/,$//')
    meta_list=$(echo $metadata | awk -F',' '{ for(i=1;i<=NF;i++) { split($i,a,"="); printf "(\""a[1]"\",\""a[2]"\")" } }' | sed 's/)(/),(/g')

    location_json=""
    [ -n "$location" ] && location_json="[\"$location\"]" || location_json="[]"

    run_command "createAsset" \
    "(\"$name\", \"$description\", $type, ${value} : nat, ${supply} : nat, $location_json, vec {$doc_list}, vec {$meta_list})"
}

distributeDividend() {
    read -p "Asset ID: " assetId
    read -p "Total Dividend (nat): " total
    run_command "distributeDividend" "(\"$assetId\", $total)"
}

getAsset() {
    read -p "Asset ID: " assetId
    run_command "getAsset" "(\"$assetId\")"
}

getAssetOwners() {
    read -p "Asset ID: " assetId
    run_command "getAssetOwners" "(\"$assetId\")"
}

getAssetTransactions() {
    read -p "Asset ID: " assetId
    run_command "getAssetTransactions" "(\"$assetId\")"
}

getUserProfilebyId() {
    read -p "User Principal: " principal
    run_command "getUserProfilebyId" "(principal \"$principal\")"
}

proposeBuyTokens() {
    read -p "Asset ID: " assetId
    read -p "Amount: " amount
    read -p "Price Per Token: " price
    run_command "proposeBuyTokens" "(\"$assetId\", $amount : nat, $price : nat)"
}

# No args
simple_call() {
    run_command "$1" "()"
}

# exit
call_exit_command() {
    echo "using dev back identity";
    dfx identity use findway_dev;
    exit 0;
}

show_findway_identity() {
    dfx identity list | grep '^findway_'
}


use_findway_identity() {
    read -p "Identity name: " dfx_identity
    dfx identity use "$dfx_identity"
}

create_findway_identity(){
    read -p "Identity name: " dfx_identity    
    dfx identity new findway_agent_"$dfx_identity"
    dfx identity use findway_agent_"$dfx_identity"
}

call_show_menu(){
    echo "\n=== Backend Canister CLI ==="
    echo "1) approveBuyProposal\t2) confirmBuyProposal\t3) createAsset"
    echo "4) distributeDividend\t5) getAllAssets\t\t6) getAsset"
    echo "7) getAssetOwners\t8) getAssetTransactions\t9) getMyProposals"
    echo "10) getPlatformStats\t11) getProfiles\t\t12) getUserAssets"
    echo "13) getUserProfilebyId\t14) getUserTransactions\t15) getVotableProposals"
    echo "16) proposeBuyTokens\t17) show more identity\t18) use identity"
    echo "19) createFindWayIdentity"
    echo "0) call the menu"
    echo "exit) for exit"
}

call_show_menu;

# Main Menu
while true; do

    read -p "Choose function [0-18, exit]: " choice

    case $choice in
        1) approveBuyProposal ;;
        2) confirmBuyProposal ;;
        3) createAsset ;;
        4) distributeDividend ;;
        5) simple_call "getAllAssets" ;;
        6) getAsset ;;
        7) getAssetOwners ;;
        8) getAssetTransactions ;;
        9) simple_call "getMyProposals" ;;
        10) simple_call "getPlatformStats" ;;
        11) simple_call "getUserProfile" ;;
        12) simple_call "getUserAssets" ;;
        13) getUserProfilebyId ;;
        14) simple_call "getUserTransactions" ;;
        15) simple_call "getVotableProposals" ;;
        16) proposeBuyTokens ;;

        17) show_findway_identity ;;
        18) use_findway_identity ;;
        19) create_findway_identity ;;

        0) call_show_menu ;;
        "exit") call_exit_command ;;
        *) echo "Invalid option."; call_exit_command ;;

    esac

    echo "\nincase you forgot the menu:"
    echo "0) call the menu"
    echo "exit) for exit"
done
