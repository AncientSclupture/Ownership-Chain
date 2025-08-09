#!/bin/bash

# ------------------------------
# Function: registUser
# ------------------------------
registUser() {
  local fullName="$1"
  local lastName="$2"
  local phone="$3"
  local country="$4"
  local city="$5"
  local userIDNumber="$6"
  local userIdentity="$7" # example: 'variant { IdentityNumber }'

  dfx canister call backend registUser \
  "(\"$fullName\", \"$lastName\", \"$phone\", \"$country\", \"$city\", \"$userIDNumber\", $userIdentity)"
}

# ------------------------------
# Function: createAsset
# ------------------------------
createAsset() {
  local name="$1"
  local description="$2"
  local totalToken="$3"
  local providedToken="$4"
  local minTokenPurchased="$5"
  local maxTokenPurchased="$6"
  local pricePerToken="$7"
  local locationInfo="$8"
  local documentHash="$9"       # array variant format Motoko
  local assetType="${10}"       # example: 'variant { Property }'
  local assetStatus="${11}"     # example: 'variant { Active }'
  local rule="${12}"            # record type Rule

  dfx canister call backend createAsset \
  "(\"$name\", \"$description\", $totalToken, $providedToken, $minTokenPurchased, $maxTokenPurchased, $pricePerToken, \"$locationInfo\", $documentHash, $assetType, $assetStatus, $rule)"
}

# ------------------------------
# Function: proposedBuyToken
# ------------------------------
proposedBuyToken() {
  local assetId="$1"
  local amount="$2"
  local pricePerToken="$3"

  dfx canister call backend proposedBuyToken \
  "(\"$assetId\", $amount, $pricePerToken)"
}

# ------------------------------
# Function: proceedDownPayment
# ------------------------------
proceedDownPayment() {
  local price="$1"
  local buyProposalId="$2"

  dfx canister call backend proceedDownPayment \
  "($price, \"$buyProposalId\")"
}

# ------------------------------
# Function: finishedPayment
# ------------------------------
finishedPayment() {
  local proposalId="$1"
  local price="$2"

  dfx canister call backend finishedPayment \
  "(\"$proposalId\", $price)"
}

# ------------------------------
# Function: approveBuyProposal
# ------------------------------
approveBuyProposal() {
  local buyProposalId="$1"

  dfx canister call backend approveBuyProposal \
  "(\"$buyProposalId\")"
}

# ------------------------------
# Function: getMyBuyProposals
# ------------------------------
getMyBuyProposals() {
  dfx canister call backend getMyBuyProposals
}

# ------------------------------
# Function: getAllAssets
# ------------------------------
getAllAssets() {
  dfx canister call backend getAllAssets
}

# ------------------------------
# Function: getVotableBuyProposal
# ------------------------------
getVotableBuyProposal() {
  dfx canister call backend getVotableBuyProposal
}

# ------------------------------
# Function: getUsers
# ------------------------------
getUsers() {
  dfx canister call backend getUsers
}

# ------------------------------
# Function: getMyAssets
# ------------------------------
getMyAssets() {
  dfx canister call backend getMyAssets
}

# ------------------------------
# Function: getMyOwnerShip
# ------------------------------
getMyOwnerShip() {
  dfx canister call backend getMyOwnerShip
}

registUser "Alex" "Cinatra" "08123456789" "Indonesia" "Jakarta" "123456789" 'variant { IdentityNumber }'

