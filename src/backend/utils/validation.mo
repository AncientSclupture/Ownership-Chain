import DataType "../data/dataType";
import Result "mo:base/Result";


module {
    public func validateAssetInput(
        totalToken: Nat,
        providedToken: Nat,
        minTokenPurchased: Nat,
        maxTokenPurchased: Nat,
        pricePerToken: Nat,
        rule: DataType.Rule,
        documentHash: [DataType.DocumentHash]
    ) : Result.Result<(), Text> {
        if (totalToken == 0) {
            return #err("Total token must be greater than 0.");
        };

        if (minTokenPurchased == 0 or maxTokenPurchased == 0) {
            return #err("Minimum or maximum token purchase must be greater than 0.");
        };

        if (minTokenPurchased > maxTokenPurchased) {
            return #err("Minimum token purchase cannot be greater than maximum.");
        };

        if (providedToken > totalToken) {
            return #err("Provided token cannot exceed total token.");
        };

        if (pricePerToken == 0) {
            return #err("Cannot create free token assets to avoid money laundering.");
        };

        if (not rule.sellSharing and rule.sellSharingPrice > 0) {
            return #err("Sell sharing is disabled, so price must be 0.");
        };

        if (documentHash.size() == 0){
            return #err("You need to add at least one document hash legality or documentation.");
        };

        if (not rule.needDownPayment and rule.downPaymentCashback > 0.0) {
            return #err("No down payment required, so cashback must be 0.");
        };

        if (rule.downPaymentCashback > 1.0) {
            return #err("Cashback cannot exceed 100%.");
        };

        if (rule.paymentMaturityTime == 0) {
            return #err("Payment maturity time must be greater than 0.");
        };

        if (rule.details.size() == 0) {
            return #err("Rule details cannot be empty.");
        };

        return #ok(());
    };
};

