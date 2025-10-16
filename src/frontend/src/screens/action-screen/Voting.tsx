import React from "react";
import { MainLayout } from "../../components/main-layout";
import { AssetOwnership, AssetProposal } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { AuthContext } from "../../context/AuthContext";
import { LoaderComponent } from "../../components/LoaderComponent";
import UserOwnershipTable from "../../components/dashboard/user-ownership";

export function VotingScreen() {
    const [loadedOwnership, setLoadedOwnership] = React.useState<AssetOwnership[]>([]);
    const [displayedProposals, setDisplayedProposals] = React.useState<AssetProposal[]>([]);

    const [assetid, setAssetid] = React.useState<string | null>(null);

    const { userPrincipal } = React.useContext(AuthContext);

    const [loading, setLoading] = React.useState<boolean>(false);

    async function getAssetProposal(id: string) {
        try {
            setLoading(true);
            const proposalsRes = await backendService.getAssetProposals(id);
            setDisplayedProposals(proposalsRes);
        } catch (error) {
            setDisplayedProposals([]);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        async function init() {
            setLoading(true);
            try {
                if (!userPrincipal) throw new Error("User principal is null");
                const data = await backendService.getMyOwnerships(userPrincipal);
                setLoadedOwnership(data);
            } catch (error) {
                setLoadedOwnership([])
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    React.useEffect(() => {
        if (assetid) {
            getAssetProposal(assetid);
        }
        console.log(displayedProposals);
    }, [assetid])

    if (loading) return <LoaderComponent />;

    return (
        <MainLayout needProtection={true}>
            <div className="p-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Asset Proposal Voting Center
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-2xl">
                        Review active asset proposals and cast your vote to approve or reject them.
                    </p>
                </div>
                <UserOwnershipTable ownerships={loadedOwnership} setSelectedId={setAssetid} />
            </div>
        </MainLayout>
    );
}
