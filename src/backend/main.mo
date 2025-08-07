import DataType "data/dataType";
import HashMap "mo:base/HashMap";
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import HelperId "data/helperID";

actor {

    // data storage

    private transient var assetsStorage = HashMap.HashMap<Text, DataType.Asset>(
        100,
        Text.equal,
        Text.hash,
    );
    private transient var assetCounter : Nat = 0;

    private transient var transactionsStorage = HashMap.HashMap<Text, DataType.Transaction>(
        1000,
        Text.equal,
        Text.hash,
    );
    private transient var transactionCounter : Nat = 0;

    private transient var ownershipsStorage = HashMap.HashMap<Text, TrieMap.TrieMap<Principal, DataType.Ownership>>(
        1000,
        Text.equal,
        Text.hash,
    );

    private transient var usersStorage = HashMap.HashMap<Principal, DataType.User>(
        100,
        Principal.equal,
        Principal.hash
    );
    private transient var userCounter : Nat = 0;


    private transient var buyProposalsStorage = HashMap.HashMap<Text, DataType.BuyProposal>(
        100,
        Text.equal,
        Text.hash,
    );
    private transient var buyProposalsCounter : Nat = 0;


    private transient var investorProposalsStorage = HashMap.HashMap<Text, DataType.InvestorProposal>(
        100,
        Text.equal,
        Text.hash,
    );
    private transient var investorProposalsCounter : Nat = 0;

    private transient var assetsReport = HashMap.HashMap<Text, TrieMap.TrieMap<Text, DataType.Report>>(
        100, 
        Text.equal,
        Text.hash,
    );
    private transient var assetsReportCounter : Nat = 0;

    private transient var assetReportAction = HashMap.HashMap<Text, TrieMap.TrieMap<Text, DataType.ReportAction>>(
        100,
        Text.equal,
        Text.hash,
    );
    private transient var assetsReportActionCounter : Nat = 0;

    
}