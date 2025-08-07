import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Nat "mo:base/Nat";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import LLM "mo:llm";



actor {

    // data types
    public type AssetType = {
        #Property;
        #Business;
        #Artwork;
        #Vehicle;
        #Equipment;
        #Other : Text;
    };

    public type AssetStatus = {
        #Active;
        #Inactive;
        #UnderMaintenance;
        #Sold;
        #Pending;
    };

    public type Asset = {
        id : Text;
        name : Text;
        description : Text;
        assetType : AssetType;
        totalValue : Nat; // token terkecil
        totalSupply : Nat; // total token yang diterbitkan
        owner : Principal; // pemilik utama/pembuat asset
        status : AssetStatus;
        createdAt : Int;
        updatedAt : Int;
        location : ?Text;
        documents : [Text];
        metadata : [(Text, Text)];
    };

    public type Ownership = {
        assetId : Text;
        owner : Principal;
        amount : Nat; // jumlah token
        percentage : Float; // persentase kepemilikan
        purchaseDate : Int;
        purchasePrice : Nat; // harga beli per token
    };

    public type Transaction = {
        id : Text;
        assetId : Text;
        from : Principal;
        to : Principal;
        amount : Nat;
        pricePerToken : Nat;
        totalPrice : Nat;
        transactionType : TransactionType;
        timestamp : Int;
        status : TransactionStatus;
    };

    public type TransactionType = {
        #Buy;
        #Sell;
        #Transfer;
        #Dividend;
        #Maintenance;
    };

    public type TransactionStatus = {
        #Pending;
        #Completed;
        #Failed;
        #Cancelled;
    };

    public type UserProfile = {
        principal : Principal;
        name : ?Text;
        alias : ?Text;
        verified : Bool;
        createdAt : Int;
        totalAssets : Nat;
        totalValue : Nat;
    };

    // STORAGRE STRUCTURE
    // assets
    private var assets = HashMap.HashMap<Text, Asset>(
        100,
        Text.equal,
        Text.hash,
    );

    // ownerships
    private var ownerships = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, Ownership>>(
        100,
        Text.equal,
        Text.hash,
    );

    // transactiions
    private var transactions = HashMap.HashMap<Text, Transaction>(
        1000,
        Text.equal,
        Text.hash,
    );

    // user profiles
    private var userProfiles = HashMap.HashMap<Principal, UserProfile>(
        1000,
        Principal.equal,
        Principal.hash,
    );

    // user assets
    private var assetsByUser = HashMap.HashMap<Principal, TrieMap.TrieMap<Text, Nat>>(
        1000,
        Principal.equal,
        Principal.hash,
    );

    // Counters untuk ID generation
    private var assetCounter : Nat = 0;
    private var transactionCounter : Nat = 0;

    // ID generate helper
    private func generateAssetId() : Text {
        assetCounter += 1;
        "ASSET_" # Nat.toText(assetCounter);
    };

    private func generateTransactionId() : Text {
        transactionCounter += 1;
        "TXN_" # Nat.toText(transactionCounter);
    };

    // USER Profile Ensure
    private func ensureUserProfile(user : Principal) : async () {
        switch (userProfiles.get(user)) {
            case (?_existing) {};
            case null {
                let anonymousProfile : UserProfile = {
                    principal = user;
                    name = null;
                    alias = null;
                    verified = false;
                    createdAt = Time.now();
                    totalAssets = 0;
                    totalValue = 0;
                };

                userProfiles.put(user, anonymousProfile);
            };
        };
    };

    // USER MANAGEMENT

    public shared (msg) func createUserProfile(
        name : ?Text,
        alias : ?Text,
    ) : async Result.Result<(), Text> {
        let caller : Principal = msg.caller; // msg.caller

        switch (userProfiles.get(caller)) {
            case (?_existing) { #err("User profile already exists") };
            case null {
                let profile : UserProfile = {
                    principal = caller;
                    name = name;
                    alias = alias;
                    verified = false;
                    createdAt = Time.now();
                    totalAssets = 0;
                    totalValue = 0;
                };

                userProfiles.put(caller, profile);
                #ok();
            };
        };
    };

    private func updateUserProfileStats(user : Principal) : async () {
        switch (userProfiles.get(user)) {
            case null {
                // just for sure
                await ensureUserProfile(user);
            };
            case (?profile) {
                var totalAssetCount : Nat = 0;
                var totalPortfolioValue : Nat = 0;

                switch (assetsByUser.get(user)) {
                    case null {};
                    case (?userAssetMap) {
                        for ((assetId, tokenAmount) in userAssetMap.entries()) {
                            if (tokenAmount > 0) {
                                totalAssetCount += 1;

                                switch (assets.get(assetId)) {
                                    case null {};
                                    case (?asset) {
                                        let valuePerToken = asset.totalValue / asset.totalSupply;
                                        totalPortfolioValue += (tokenAmount * valuePerToken);
                                    };
                                };
                            };
                        };
                    };
                };

                let updatedProfile : UserProfile = {
                    principal = profile.principal;
                    name = profile.name;
                    alias = profile.alias;
                    verified = profile.verified;
                    createdAt = profile.createdAt;
                    totalAssets = totalAssetCount;
                    totalValue = totalPortfolioValue;
                };

                userProfiles.put(user, updatedProfile);
            };
        };
    };

    private func updateUserAssets(
        user : Principal,
        assetId : Text,
        amount : Nat,
    ) : async () {
        switch (assetsByUser.get(user)) {
            case null {
                let userAssetMap = TrieMap.TrieMap<Text, Nat>(Text.equal, Text.hash);
                userAssetMap.put(assetId, amount);
                assetsByUser.put(user, userAssetMap);
            };
            case (?userAssetMap) {
                switch (userAssetMap.get(assetId)) {
                    case null {
                        userAssetMap.put(assetId, amount);
                    };
                    case (?existingAmount) {
                        userAssetMap.put(assetId, existingAmount + amount);
                    };
                };
            };
        };

        await updateUserProfileStats(user);
    };

    public shared (msg) func getUserProfile() : async ?{
        profile : UserProfile;
        assets : [(Text, Nat, Nat)]; // (assetId, tokenAmount, currentValue)
        recentTransactions : [Transaction];
    } {
        let user : Principal = msg.caller;

        switch (userProfiles.get(user)) {
            case null {
                await ensureUserProfile(user);

                switch (userProfiles.get(user)) {
                    case null { null };
                    case (?newProfile) {
                        ?{
                            profile = newProfile;
                            assets = [];
                            recentTransactions = [];
                        };
                    };
                };
            };
            case (?profile) {
                var assetsList : [(Text, Nat, Nat)] = [];

                switch (assetsByUser.get(user)) {
                    case null {};
                    case (?userAssetMap) {
                        for ((assetId, tokenAmount) in userAssetMap.entries()) {
                            if (tokenAmount > 0) {
                                switch (assets.get(assetId)) {
                                    case null {};
                                    case (?asset) {
                                        let valuePerToken = asset.totalValue / asset.totalSupply;
                                        let currentValue = tokenAmount * valuePerToken;
                                        assetsList := Array.append(
                                            assetsList,
                                            [(assetId, tokenAmount, currentValue)],
                                        );
                                    };
                                };
                            };
                        };
                    };
                };

                let userTransactions = Array.filter<Transaction>(
                    Iter.toArray(transactions.vals()),
                    func(tx : Transaction) : Bool {
                        tx.from == user or tx.to == user;
                    },
                );

                let sortedTx = Array.sort<Transaction>(
                    userTransactions,
                    func(a : Transaction, b : Transaction) : {
                        #less;
                        #equal;
                        #greater;
                    } {
                        if (a.timestamp > b.timestamp) #less else if (a.timestamp < b.timestamp) #greater else #equal;
                    },
                );

                let recentTx = if (sortedTx.size() > 10) {
                    Array.subArray<Transaction>(sortedTx, 0, 10);
                } else {
                    sortedTx;
                };

                ?{
                    profile = profile;
                    assets = assetsList;
                    recentTransactions = recentTx;
                };
            };
        };
    };

    public query func getUserProfilebyId(user : Principal) : async ?UserProfile {
        userProfiles.get(user);
    };

    // USER MANAGEMENT

    // ASSETS MANAGEMENT

    private func getAvailableTokens(assetId : Text) : async Nat {
        switch (assets.get(assetId)) {
            case null { 0 };
            case (?asset) {
                switch (ownerships.get(assetId)) {
                    case null { 0 };
                    case (?ownershipMap) {
                        switch (ownershipMap.get(asset.owner)) {
                            case null { 0 };
                            case (?ownership) { ownership.amount };
                        };
                    };
                };
            };
        };
    };

    private func updateOwnership(
        assetId : Text,
        buyer : Principal,
        amount : Nat,
        pricePerToken : Nat,
    ) : async () {
        switch (ownerships.get(assetId)) {
            case null {};
            case (?ownershipMap) {
                switch (assets.get(assetId)) {
                    case null {};
                    case (?asset) {
                        // Update owner asal
                        switch (ownershipMap.get(asset.owner)) {
                            case null {};
                            case (?ownerOwnership) {
                                if (ownerOwnership.amount >= amount) {
                                    let updatedOwnerOwnership : Ownership = {
                                        assetId = ownerOwnership.assetId;
                                        owner = ownerOwnership.owner;
                                        amount = ownerOwnership.amount - amount; // KURANGI
                                        percentage = await calculatePercentage(assetId, ownerOwnership.amount - amount);
                                        purchaseDate = ownerOwnership.purchaseDate;
                                        purchasePrice = ownerOwnership.purchasePrice;
                                    };
                                    ownershipMap.put(asset.owner, updatedOwnerOwnership);
                                };
                            };
                        };
                    };
                };

                // Update buyer ownership
                let now = Time.now();

                switch (ownershipMap.get(buyer)) {
                    case null {
                        // New owner
                        let newOwnership : Ownership = {
                            assetId = assetId;
                            owner = buyer;
                            amount = amount;
                            percentage = await calculatePercentage(assetId, amount);
                            purchaseDate = now;
                            purchasePrice = pricePerToken;
                        };
                        ownershipMap.put(buyer, newOwnership);
                    };
                    case (?existingOwnership) {
                        // Existing owner buying more
                        let updatedOwnership : Ownership = {
                            assetId = assetId;
                            owner = buyer;
                            amount = existingOwnership.amount + amount;
                            percentage = await calculatePercentage(assetId, existingOwnership.amount + amount);
                            purchaseDate = existingOwnership.purchaseDate;
                            purchasePrice = ((existingOwnership.purchasePrice * existingOwnership.amount) + (pricePerToken * amount)) / (existingOwnership.amount + amount);
                        };
                        ownershipMap.put(buyer, updatedOwnership);
                    };
                };

                await updateUserAssets(buyer, assetId, amount);
            };
        };
    };

    private func calculatePercentage(
        assetId : Text,
        amount : Nat,
    ) : async Float {
        switch (assets.get(assetId)) {
            case null { 0.0 };
            case (?asset) {
                Float.fromInt(amount) / Float.fromInt(asset.totalSupply) * 100.0;
            };
        };
    };

    // CREATE ASSETS
    public shared (msg) func createAsset(
        name : Text,
        description : Text,
        assetType : AssetType,
        totalValue : Nat,
        totalSupply : Nat,
        location : ?Text,
        documents : [Text],
        metadata : [(Text, Text)],
    ) : async Result.Result<Text, Text> {
        let caller : Principal = msg.caller;

        await ensureUserProfile(caller);

        if (totalSupply == 0) {
            return #err("Total supply must be greater than 0");
        };

        let assetId = generateAssetId();
        let now = Time.now();

        let asset : Asset = {
            id = assetId;
            name = name;
            description = description;
            assetType = assetType;
            totalValue = totalValue;
            totalSupply = totalSupply;
            owner = caller;
            status = #Active;
            createdAt = now;
            updatedAt = now;
            location = location;
            documents = documents;
            metadata = metadata;
        };

        assets.put(assetId, asset);

        let ownershipMap = TrieMap.TrieMap<Principal, Ownership>(Principal.equal, Principal.hash);

        let initialOwnership : Ownership = {
            assetId = assetId;
            owner = caller;
            amount = totalSupply;
            percentage = 100.0;
            purchaseDate = now;
            purchasePrice = totalValue / totalSupply;
        };

        ownershipMap.put(caller, initialOwnership);
        ownerships.put(assetId, ownershipMap);

        await updateUserAssets(caller, assetId, totalSupply);

        await updateUserProfileStats(caller);

        #ok(assetId);
    };

    // FRACTIONAL OWNERSHIP DATA [SPECIFIC PROB]
    public type BuyProposal = {
        id : Text;
        assetId : Text;
        buyer : Principal;
        amount : Nat;
        pricePerToken : Nat;
        totalPrice : Nat;
        approvals : HashMap.HashMap<Principal, Bool>;
        createdAt : Int;
    };

    private var buyProposals = HashMap.HashMap<Text, BuyProposal>(100, Text.equal, Text.hash);

    // FRACTIONAL OWNERSHIP WITH VOTING SYSTEM
    // Proposal first with voting based on ownership percentage
    public shared (msg) func proposeBuyTokens(
        assetId : Text,
        amount : Nat,
        pricePerToken : Nat,
    ) : async Result.Result<Text, Text> {
        let caller = msg.caller;

        await ensureUserProfile(caller);

        switch (assets.get(assetId)) {
            case null { return #err("Asset not found") };
            case (?asset) {
                if (asset.status != #Active) return #err("Asset not active");

                let availableTokens = await getAvailableTokens(assetId);
                if (availableTokens < amount) return #err("Not enough tokens available");

                // Check if caller is already an owner (owners cannot buy more through voting)
                switch (ownerships.get(assetId)) {
                    case null { return #err("No ownership data found") };
                    case (?ownershipMap) {
                        switch (ownershipMap.get(caller)) {
                            case (?_) {
                                return #err("Existing owners cannot buy more tokens through voting system. Use direct transfer instead.");
                            };
                            case null {
                                // Non-owner can proceed with proposal
                                let proposalId = generateTransactionId();
                                let newApprovals = HashMap.HashMap<Principal, Bool>(10, Principal.equal, Principal.hash);

                                let proposal : BuyProposal = {
                                    id = proposalId;
                                    assetId = assetId;
                                    buyer = caller;
                                    amount = amount;
                                    pricePerToken = pricePerToken;
                                    totalPrice = amount * pricePerToken;
                                    approvals = newApprovals;
                                    createdAt = Time.now();
                                };

                                buyProposals.put(proposalId, proposal);
                                return #ok("Proposal created with ID: " # proposalId # ". Current owners need to vote for approval.");
                            };
                        };
                    };
                };
            };
        };
    };

    public shared (msg) func approveBuyProposal(proposalId : Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;

        switch (buyProposals.get(proposalId)) {
            case null { return #err("Proposal not found") };
            case (?proposal) {
                if (proposal.buyer == caller) {
                    return #err("Buyer cannot vote on their own proposal");
                };

                switch (ownerships.get(proposal.assetId)) {
                    case null {
                        return #err("No ownership data for this asset");
                    };
                    case (?ownershipMap) {
                        // Check if caller is an owner of this asset
                        switch (ownershipMap.get(caller)) {
                            case null {
                                return #err("You are not an owner of this asset and cannot vote");
                            };
                            case (?ownerOwnership) {
                                // Check if already voted
                                switch (proposal.approvals.get(caller)) {
                                    case (?true) {
                                        return #err("You have already approved this proposal");
                                    };
                                    case _ {
                                        // Record the approval by modifying the existing HashMap
                                        proposal.approvals.put(caller, true);

                                        // Calculate total approval percentage
                                        var totalApprovalPercentage = 0.0;
                                        for ((voter, agreed) in proposal.approvals.entries()) {
                                            if (agreed) {
                                                switch (ownershipMap.get(voter)) {
                                                    case (?voterOwnership) {
                                                        totalApprovalPercentage += voterOwnership.percentage;
                                                    };
                                                    case null {
                                                        // This shouldn't happen, but handle gracefully
                                                    };
                                                };
                                            };
                                        };

                                        if (totalApprovalPercentage >= 50.0) {
                                            return #ok("Proposal approved! Total approval: " # Float.toText(totalApprovalPercentage) # "%. Buyer can now confirm the purchase.");
                                        } else {
                                            return #ok("Vote recorded. Your ownership: " # Float.toText(ownerOwnership.percentage) # "%. Total approval: " # Float.toText(totalApprovalPercentage) # "% (need 50%+)");
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
        };
    };

    public shared (msg) func confirmBuyProposal(proposalId : Text) : async Result.Result<Text, Text> {
        let caller = msg.caller;

        switch (buyProposals.get(proposalId)) {
            case null { return #err("Proposal not found") };
            case (?proposal) {
                if (proposal.buyer != caller) {
                    return #err("Only the buyer can confirm this proposal");
                };

                switch (ownerships.get(proposal.assetId)) {
                    case null {
                        return #err("No ownership data found for this asset");
                    };
                    case (?ownershipMap) {
                        // Recalculate total approval percentage to ensure it's still valid
                        var totalApprovalPercentage = 0.0;
                        for ((voter, agreed) in proposal.approvals.entries()) {
                            if (agreed) {
                                switch (ownershipMap.get(voter)) {
                                    case (?voterOwnership) {
                                        totalApprovalPercentage += voterOwnership.percentage;
                                    };
                                    case null {
                                        // Voter is no longer an owner, skip
                                    };
                                };
                            };
                        };

                        if (totalApprovalPercentage < 50.0) {
                            return #err("Proposal no longer has sufficient approval (" # Float.toText(totalApprovalPercentage) # "%). Need 50%+");
                        };

                        // Check if there are still enough tokens available
                        let availableTokens = await getAvailableTokens(proposal.assetId);
                        if (availableTokens < proposal.amount) {
                            buyProposals.delete(proposalId);
                            return #err("Not enough tokens available anymore");
                        };

                        // Execute the purchase
                        await updateOwnership(proposal.assetId, caller, proposal.amount, proposal.pricePerToken);

                        // Create transaction record
                        let transactionId = generateTransactionId();
                        let transaction : Transaction = {
                            id = transactionId;
                            assetId = proposal.assetId;
                            from = Principal.fromText("2vxsx-fae"); // System/platform principal for new purchases
                            to = caller;
                            amount = proposal.amount;
                            pricePerToken = proposal.pricePerToken;
                            totalPrice = proposal.totalPrice;
                            transactionType = #Buy;
                            timestamp = Time.now();
                            status = #Completed;
                        };
                        transactions.put(transactionId, transaction);

                        await updateUserProfileStats(caller);

                        // Clean up the proposal
                        buyProposals.delete(proposalId);

                        return #ok("Token purchase completed successfully! Bought " # Nat.toText(proposal.amount) # " tokens at " # Nat.toText(proposal.pricePerToken) # " per token. Total: " # Nat.toText(proposal.totalPrice));
                    };
                };
            };
        };
    };

    // Helper function to get current approval status of a proposal
    public query func getProposalStatus(proposalId : Text) : async ?{
        proposal : {
            id : Text;
            assetId : Text;
            buyer : Principal;
            amount : Nat;
            pricePerToken : Nat;
            totalPrice : Nat;
            createdAt : Int;
        };
        currentApprovalPercentage : Float;
        approvalDetails : [(Principal, Float, Bool)]; // (voter, ownership%, voted)
        isApproved : Bool;
    } {
        switch (buyProposals.get(proposalId)) {
            case null { null };
            case (?proposal) {
                switch (ownerships.get(proposal.assetId)) {
                    case null { null };
                    case (?ownershipMap) {
                        var totalApprovalPercentage = 0.0;
                        var approvalDetails : [(Principal, Float, Bool)] = [];

                        // Get all owners and their voting status
                        for ((owner, ownership) in ownershipMap.entries()) {
                            let hasVoted = switch (proposal.approvals.get(owner)) {
                                case (?voted) { voted };
                                case null { false };
                            };

                            if (hasVoted) {
                                totalApprovalPercentage += ownership.percentage;
                            };

                            approvalDetails := Array.append(
                                approvalDetails,
                                [(owner, ownership.percentage, hasVoted)],
                            );
                        };

                        ?{
                            proposal = {
                                id = proposal.id;
                                assetId = proposal.assetId;
                                buyer = proposal.buyer;
                                amount = proposal.amount;
                                pricePerToken = proposal.pricePerToken;
                                totalPrice = proposal.totalPrice;
                                createdAt = proposal.createdAt;
                            };
                            currentApprovalPercentage = totalApprovalPercentage;
                            approvalDetails = approvalDetails;
                            isApproved = totalApprovalPercentage >= 50.0;
                        };
                    };
                };
            };
        };
    };

    // Function to get all active proposals for an asset
    public query func getAssetProposals(assetId : Text) : async [{
        id : Text;
        assetId : Text;
        buyer : Principal;
        amount : Nat;
        pricePerToken : Nat;
        totalPrice : Nat;
        createdAt : Int;
    }] {
        let allProposals = Iter.toArray(buyProposals.vals());
        let filtered = Array.filter<BuyProposal>(
            allProposals,
            func(proposal : BuyProposal) : Bool {
                proposal.assetId == assetId;
            },
        );

        Array.map<BuyProposal, { id : Text; assetId : Text; buyer : Principal; amount : Nat; pricePerToken : Nat; totalPrice : Nat; createdAt : Int }>(filtered, func(proposal : BuyProposal) { { id = proposal.id; assetId = proposal.assetId; buyer = proposal.buyer; amount = proposal.amount; pricePerToken = proposal.pricePerToken; totalPrice = proposal.totalPrice; createdAt = proposal.createdAt } });
    };

    // Function to get all proposals that a user can vote on
    public shared (msg) func getVotableProposals() : async [{
        id : Text;
        assetId : Text;
        buyer : Principal;
        amount : Nat;
        pricePerToken : Nat;
        totalPrice : Nat;
        createdAt : Int;
    }] {
        let caller = msg.caller;
        let allProposals = Iter.toArray(buyProposals.vals());

        let filtered = Array.filter<BuyProposal>(
            allProposals,
            func(proposal : BuyProposal) : Bool {
                // User can vote if they own part of the asset and are not the buyer
                if (proposal.buyer == caller) return false;

                switch (ownerships.get(proposal.assetId)) {
                    case null { false };
                    case (?ownershipMap) {
                        switch (ownershipMap.get(caller)) {
                            case null { false };
                            case (?_) { true };
                        };
                    };
                };
            },
        );

        Array.map<BuyProposal, { id : Text; assetId : Text; buyer : Principal; amount : Nat; pricePerToken : Nat; totalPrice : Nat; createdAt : Int }>(filtered, func(proposal : BuyProposal) { { id = proposal.id; assetId = proposal.assetId; buyer = proposal.buyer; amount = proposal.amount; pricePerToken = proposal.pricePerToken; totalPrice = proposal.totalPrice; createdAt = proposal.createdAt } });
    };

    // Function for buyer to check their own proposals status
    public shared (msg) func getMyProposals() : async [{
        id : Text;
        assetId : Text;
        assetName : ?Text;
        amount : Nat;
        pricePerToken : Nat;
        totalPrice : Nat;
        createdAt : Int;
        currentApprovalPercentage : Float;
        isApproved : Bool;
        canConfirm : Bool;
        votersDetails : [(Principal, Float, Bool)]; // (voter principal, ownership%, hasVoted)
    }] {
        let caller = msg.caller;
        let allProposals = Iter.toArray(buyProposals.vals());

        // Filter proposals that belong to the caller
        let myProposals = Array.filter<BuyProposal>(
            allProposals,
            func(proposal : BuyProposal) : Bool {
                proposal.buyer == caller;
            },
        );

        // Map each proposal to include status information
        var result : [{
            id : Text;
            assetId : Text;
            assetName : ?Text;
            amount : Nat;
            pricePerToken : Nat;
            totalPrice : Nat;
            createdAt : Int;
            currentApprovalPercentage : Float;
            isApproved : Bool;
            canConfirm : Bool;
            votersDetails : [(Principal, Float, Bool)];
        }] = [];

        for (proposal in myProposals.vals()) {
            // Get asset name
            let assetName = switch (assets.get(proposal.assetId)) {
                case (?asset) { ?asset.name };
                case null { null };
            };

            // Calculate approval status
            var currentApprovalPercentage = 0.0;
            var votersDetails : [(Principal, Float, Bool)] = [];

            switch (ownerships.get(proposal.assetId)) {
                case null {};
                case (?ownershipMap) {
                    // Get all owners and their voting status
                    for ((owner, ownership) in ownershipMap.entries()) {
                        let hasVoted = switch (proposal.approvals.get(owner)) {
                            case (?voted) { voted };
                            case null { false };
                        };

                        if (hasVoted) {
                            currentApprovalPercentage += ownership.percentage;
                        };

                        votersDetails := Array.append(
                            votersDetails,
                            [(owner, ownership.percentage, hasVoted)],
                        );
                    };
                };
            };

            let isApproved = currentApprovalPercentage >= 50.0;
            let canConfirm = isApproved;

            let proposalStatus = {
                id = proposal.id;
                assetId = proposal.assetId;
                assetName = assetName;
                amount = proposal.amount;
                pricePerToken = proposal.pricePerToken;
                totalPrice = proposal.totalPrice;
                createdAt = proposal.createdAt;
                currentApprovalPercentage = currentApprovalPercentage;
                isApproved = isApproved;
                canConfirm = canConfirm;
                votersDetails = votersDetails;
            };

            result := Array.append(result, [proposalStatus]);
        };

        result;
    };

    // DIVIDEND DISTRIBUTION
    public shared (msg) func distributeDividend(
        assetId : Text,
        totalDividend : Nat,
    ) : async Result.Result<Nat, Text> {
        let caller : Principal = msg.caller;

        switch (assets.get(assetId)) {
            case null { #err("Asset not found") };
            case (?asset) {
                // unauthorized account
                if (asset.owner != caller) {
                    return #err("You are not the asset original owner");
                };
                switch (ownerships.get(assetId)) {
                    case null { #err("No ownership data found") };
                    case (?ownershipMap) {
                        var distributedCount : Nat = 0;

                        for ((owner, ownership) in ownershipMap.entries()) {
                            let dividendAmount = (totalDividend * ownership.amount) / asset.totalSupply;

                            // Create dividend transaction
                            let transactionId = generateTransactionId();
                            let transaction : Transaction = {
                                id = transactionId;
                                assetId = assetId;
                                from = asset.owner;
                                to = owner;
                                amount = ownership.amount;
                                pricePerToken = dividendAmount;
                                totalPrice = dividendAmount;
                                transactionType = #Dividend;
                                timestamp = Time.now();
                                status = #Completed;
                            };

                            transactions.put(transactionId, transaction);
                            distributedCount += 1;
                        };

                        #ok(distributedCount);
                    };
                };
            };
        };
    };

    // ASSET STATUS MANAGEMENT
    public func updateAssetStatus(
        assetId : Text,
        newStatus : AssetStatus,
    ) : async Result.Result<(), Text> {
        switch (assets.get(assetId)) {
            case null { #err("Asset not found") };
            case (?asset) {
                let updatedAsset : Asset = {
                    id = asset.id;
                    name = asset.name;
                    description = asset.description;
                    assetType = asset.assetType;
                    totalValue = asset.totalValue;
                    totalSupply = asset.totalSupply;
                    owner = asset.owner;
                    status = newStatus;
                    createdAt = asset.createdAt;
                    updatedAt = Time.now();
                    location = asset.location;
                    documents = asset.documents;
                    metadata = asset.metadata;
                };

                assets.put(assetId, updatedAsset);
                #ok();
            };
        };
    };

    // ASSETS MANAGEMENT

    // STATISTICS

    public query func getPlatformStats() : async {
        totalAssets : Nat;
        totalUsers : Nat;
        totalTransactions : Nat;
        totalValueLocked : Nat;
        assetsByType : [(AssetType, Nat)];
    } {
        let allAssets = Iter.toArray(assets.vals());
        var totalValueLocked : Nat = 0;
        var propertyCount : Nat = 0;
        var businessCount : Nat = 0;
        var artworkCount : Nat = 0;
        var vehicleCount : Nat = 0;
        var equipmentCount : Nat = 0;
        var otherCount : Nat = 0;

        for (asset in allAssets.vals()) {
            totalValueLocked += asset.totalValue;
            switch (asset.assetType) {
                case (#Property) { propertyCount += 1 };
                case (#Business) { businessCount += 1 };
                case (#Artwork) { artworkCount += 1 };
                case (#Vehicle) { vehicleCount += 1 };
                case (#Equipment) { equipmentCount += 1 };
                case (#Other(_)) { otherCount += 1 };
            };
        };

        {
            totalAssets = assets.size();
            totalUsers = userProfiles.size();
            totalTransactions = transactions.size();
            totalValueLocked = totalValueLocked;
            assetsByType = [
                (#Property, propertyCount),
                (#Business, businessCount),
                (#Artwork, artworkCount),
                (#Vehicle, vehicleCount),
                (#Equipment, equipmentCount),
                (#Other("Other"), otherCount),
            ];
        };
    };

    // STATISTICS

    // LLM

    public func prompt(prompt : Text) : async Text {
        await LLM.prompt(#Llama3_1_8B, prompt);
    };

    public func chat(messages : [LLM.ChatMessage]) : async Text {
        let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

        switch (response.message.content) {
            case (?text) text;
            case null "";
        };
    };

    // LLM

    // QUERIES

    public query func getAsset(assetId : Text) : async ?Asset {
        assets.get(assetId);
    };

    public query func getAllAssets() : async [Asset] {
        Iter.toArray(assets.vals());
    };

    public query func getAssetsByType(assetType : AssetType) : async [Asset] {
        let filtered = Array.filter<Asset>(
            Iter.toArray(assets.vals()),
            func(asset : Asset) : Bool { asset.assetType == assetType },
        );
        filtered;
    };

    public query func getAssetOwners(assetId : Text) : async [(Principal, Ownership)] {
        switch (ownerships.get(assetId)) {
            case null { [] };
            case (?ownershipMap) { Iter.toArray(ownershipMap.entries()) };
        };
    };

    // Fungsi internal (private)
    private func isOriginalOwner(assetId : Text, user : Principal) : Bool {
        switch (assets.get(assetId)) {
            case (?asset) asset.owner == user;
            case null false;
        };
    };

    public shared (msg) func getUserAssets() : async [(Text, Nat, Bool)] {
        let user : Principal = msg.caller;

        switch (assetsByUser.get(user)) {
            case null { [] };
            case (?userAssetMap) {
                Iter.toArray(
                    Iter.map<(Text, Nat), (Text, Nat, Bool)>(
                        userAssetMap.entries(),
                        func(entry : (Text, Nat)) : (Text, Nat, Bool) {
                            let assetId = entry.0;
                            let amount = entry.1;
                            let isOwner = isOriginalOwner(assetId, user);
                            (assetId, amount, isOwner);
                        },
                    )
                );
            };
        };
    };

    public query func getTransaction(transactionId : Text) : async ?Transaction {
        transactions.get(transactionId);
    };

    public query func getAssetTransactions(assetId : Text) : async [Transaction] {
        let filtered = Array.filter<Transaction>(
            Iter.toArray(transactions.vals()),
            func(tx : Transaction) : Bool { tx.assetId == assetId },
        );
        filtered;
    };

    public shared (msg) func getUserTransactions() : async [Transaction] {
        let user : Principal = msg.caller;
        let filtered = Array.filter<Transaction>(
            Iter.toArray(transactions.vals()),
            func(tx : Transaction) : Bool { tx.from == user or tx.to == user },
        );
        filtered;
    };

    // QUERIES
};
