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
        email : ?Text;
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
        Text.hash
    );

    // user profiles
    private var userProfiles = HashMap.HashMap<Principal, UserProfile>(
        1000, 
        Principal.equal, 
        Principal.hash
    );

    // user assets
    private var assetsByUser = HashMap.HashMap<Principal, TrieMap.TrieMap<Text, Nat>>(
        1000, 
        Principal.equal, 
        Principal.hash
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
    
};
