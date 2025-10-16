import React from "react";
import { MainLayout } from "../../components/main-layout";
import { AssetDetailTabs, transactiondetailopt, TransactionWrapper } from "../../components/transaction/transaction-content-handler";
import { BuyTransaction } from "../../components/transaction/buy-transaction";
import { TransferTransaction } from "../../components/transaction/transfer-transaction";
import { TransactionHistory } from "../../components/transaction/transaction-history";
import { CashbackTransaction } from "../../components/transaction/cahsback-transaction";

export function TransactionScreen() {
    const [selected, setSelected] = React.useState<transactiondetailopt>(transactiondetailopt.buy);

    const listcontent = [
        { name: transactiondetailopt.buy, component: <BuyTransaction /> },
        { name: transactiondetailopt.transfer, component: <TransferTransaction /> },
        { name: transactiondetailopt.history, component: <TransactionHistory /> },
        { name: transactiondetailopt.cashback, component: <CashbackTransaction /> },
    ];

    return (
        <MainLayout needProtection={true}>
            <div className="max-w-6xl mx-auto px-6 py-10">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Ownership Transactions</h1>
                    <p className="text-gray-600 mt-2">
                        Manage your digital asset operations — buy, transfer, or review past transactions.
                    </p>
                </div>

                {/* Tabs */}
                <AssetDetailTabs selected={selected} onChange={setSelected} />

                {/* Content Wrapper */}
                <TransactionWrapper current={selected} listcontent={listcontent} />
            </div>
        </MainLayout>
    );
}
