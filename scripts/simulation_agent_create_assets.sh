#!/bin/bash


registUser() {
  local fullName="$1"
  local lastName="$2"
  local phone="$3"
  local country="$4"
  local city="$5"
  local userIDNumber="$6"
  local userIdentity="$7"

  dfx canister call backend registUser \
  "(\"$fullName\", \"$lastName\", \"$phone\", \"$country\", \"$city\", \"$userIDNumber\", $userIdentity)"
}

createAsset() {
  local name="$1"
  local description="$2"
  local totalToken="$3"
  local providedToken="$4"
  local minTokenPurchased="$5"
  local maxTokenPurchased="$6"
  local pricePerToken="$7"
  local locationInfo="$8"
  local documentHash="$9"
  local assetType="${10}"
  local assetStatus="${11}"
  local rule="${12}"

  dfx canister call backend createAsset \
  "(\"$name\", \"$description\", $totalToken, $providedToken, $minTokenPurchased, $maxTokenPurchased, $pricePerToken, \"$locationInfo\", $documentHash, $assetType, $assetStatus, $rule)"
}

proposedBuyToken() {
  local assetId="$1"
  local amount="$2"
  local pricePerToken="$3"

  dfx canister call backend proposedBuyToken \
  "(\"$assetId\", $amount, $pricePerToken)"
}

proceedDownPayment() {
  local price="$1"
  local buyProposalId="$2"

  dfx canister call backend proceedDownPayment \
  "($price, \"$buyProposalId\")"
}

finishedPayment() {
  local proposalId="$1"
  local price="$2"

  dfx canister call backend finishedPayment \
  "(\"$proposalId\", $price)"
}

approveBuyProposal() {
  local buyProposalId="$1"

  dfx canister call backend approveBuyProposal \
  "(\"$buyProposalId\")"
}

createInvestorProposal() {
  local assetId="$1"
  local incomingInvestor="$2"
  local amount="$3"
  local pricePerToken="$4"

  dfx canister call backend createIvestorProposal \
  "(\"$assetId\", principal \"$incomingInvestor\", $amount, $pricePerToken)"
}

approveInvestorProposal() {
  local investorProposalId="$1"

  dfx canister call backend approveInvestorProposal \
  "(\"$investorProposalId\")"
}

finishTheInvitation() {
  local investorProposalId="$1"
  local price="$2"

  dfx canister call backend finishTheInvitation \
  "(\"$investorProposalId\", $price)"
}

getMyBuyProposals() {
  dfx canister call backend getMyBuyProposals
}

getAllAssets() {
  dfx canister call backend getAllAssets
}

getVotableBuyProposal() {
  dfx canister call backend getVotableBuyProposal
}

getUsers() {
  dfx canister call backend getUsers
}

getMyAssets() {
  dfx canister call backend getMyAssets
}

getMyOwnership() {
  dfx canister call backend getMyOwnerShip
}


dfx identity use findway_agent1

registUser "John" "Doe" "08123456789" "Indonesia" "Jakarta" "ID123" 'variant { IdentityNumber }'

createAsset "Rumah" "Deskripsi" 1000 500 10 100 1000000 "Jakarta" \
'vec { record { name = "Sertifikat"; description = "Hak Milik"; hash = "abc123" } }' \
'variant { Property }' \
'variant { Active }' \
'record { sellSharing = true; sellSharingNeedVote = false; sellSharingPrice = 100; needDownPayment = true; minDownPaymentPercentage = 0.10; downPaymentCashback = 0.5; downPaymentMaturityTime = 30; paymentMaturityTime = 60; details = vec { "Info1"; "Info2" } }'

createAsset "Rumah Lagi" "Deskripsi" 1000 500 10 100 1000000 "Jakarta" \
'vec { record { name = "Sertifikat"; description = "Hak Milik"; hash = "abc123" } }' \
'variant { Property }' \
'variant { Open }' \
'record { sellSharing = true; sellSharingNeedVote = false; sellSharingPrice = 100; needDownPayment = true; minDownPaymentPercentage = 0.10; downPaymentCashback = 0.5; downPaymentMaturityTime = 30; paymentMaturityTime = 60; details = vec { "Info1"; "Info2" } }'


