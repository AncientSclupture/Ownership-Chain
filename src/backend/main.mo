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
    };

    // USER MANAGEMENT

    // ASSETS MANAGEMENT

    private func getAvailableTokens(assetId : Text) : async Nat {
        switch (assets.get(assetId)) {
            case null { 0 };
            case (?asset) {
                // all tokens are available for sale
                asset.totalSupply;
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
            case null {}; // just to be sure
            case (?ownershipMap) {
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

        // ownership asset saat ini
        let ownershipMap = TrieMap.TrieMap<Principal, Ownership>(Principal.equal, Principal.hash);

        // pemilik utama mendapat 100% ownership awalnya
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

        // Update user's asset list
        await updateUserAssets(caller, assetId, totalSupply);

        #ok(assetId);
    };

    // FRACTIONAL OWNERSHIP
    public shared (msg) func buyTokens(
        assetId : Text,
        amount : Nat,
        pricePerToken : Nat,
    ) : async Result.Result<Text, Text> {
        let caller : Principal = msg.caller;

        switch (assets.get(assetId)) {
            case null { #err("Asset not found") };
            case (?asset) {
                if (asset.status != #Active) {
                    return #err("Asset is not available for trading");
                };

                // Cek apakah ada token yang tersedia untuk dijual
                let availableTokens = await getAvailableTokens(assetId);
                if (availableTokens < amount) {
                    return #err("Not enough tokens available for sale");
                };

                // asset owner tidak dapat membeli assetsnya sendiri
                if (asset.owner == caller) {
                    return #err("You cannot buy your own asset");
                };

                let totalPrice = amount * pricePerToken;
                let transactionId = generateTransactionId();

                // Dalam implementasi nyata, perlu integrasi dengan payment system
                // Untuk sekarang, assume payment berhasil

                let transaction : Transaction = {
                    id = transactionId;
                    assetId = assetId;
                    from = asset.owner; // Simplified - dalam kenyataan bisa dari multiple sellers
                    to = caller;
                    amount = amount;
                    pricePerToken = pricePerToken;
                    totalPrice = totalPrice;
                    transactionType = #Buy;
                    timestamp = Time.now();
                    status = #Completed;
                };

                transactions.put(transactionId, transaction);

                // Update ownership
                await updateOwnership(assetId, caller, amount, pricePerToken);

                #ok(transactionId);
            };
        };
    };

    // DIVIDEND DISTRIBUTION
    public func distributeDividend(
        assetId : Text,
        totalDividend : Nat,
    ) : async Result.Result<Nat, Text> {
        switch (assets.get(assetId)) {
            case null { #err("Asset not found") };
            case (?asset) {
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

    public query func getOwnership(assetId : Text, owner : Principal) : async ?Ownership {
        switch (ownerships.get(assetId)) {
            case null { null };
            case (?ownershipMap) { ownershipMap.get(owner) };
        };
    };

    public query func getAssetOwners(assetId : Text) : async [(Principal, Ownership)] {
        switch (ownerships.get(assetId)) {
            case null { [] };
            case (?ownershipMap) { Iter.toArray(ownershipMap.entries()) };
        };
    };

    public query func getUserAssets(user : Principal) : async [(Text, Nat)] {
        switch (assetsByUser.get(user)) {
            case null { [] };
            case (?userAssetMap) { Iter.toArray(userAssetMap.entries()) };
        };
    };

    public query func getUserProfile(user : Principal) : async ?UserProfile {
        userProfiles.get(user);
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

    public query func getUserTransactions(user : Principal) : async [Transaction] {
        let filtered = Array.filter<Transaction>(
            Iter.toArray(transactions.vals()),
            func(tx : Transaction) : Bool { tx.from == user or tx.to == user },
        );
        filtered;
    };

    // QUERIES
};
