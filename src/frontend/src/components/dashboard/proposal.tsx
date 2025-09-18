import React from "react"
import { ProposalResult } from "../../types/rwa";
import { backendService } from "../../services/backendService";
import { NotificationContext } from "../../context/NotificationContext";
import { LoaderComponent } from "../LoaderComponent";
import { formatMotokoTime } from "../../helper/rwa-helper";
import { ModalContext, ModalKindEnum } from "../../context/ModalContext";

function ProposalCard({ proposal }: { proposal: ProposalResult }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const { setModalKind, assetidmanagement } = React.useContext(ModalContext);

    function handlePorceedDp() {
        setModalKind(ModalKindEnum.proceeddp);
        assetidmanagement.setter(proposal.id);
    }

    function handleFinishedPayment() {
        setModalKind(ModalKindEnum.finishedpayment);
        assetidmanagement.setter(proposal.id);
    }

    return (
        <div className={`border border-gray-400 p-2 rounded-md ${isOpen ? 'space-y-3' : 'space-y-0'}`}>
            <div className="flex justify-between items-center" >
                <div className="cursor-pointer w-full" onClick={() => setIsOpen(!isOpen)}>
                    <p className="uppercase">proposal <span className="font-semibold">{proposal.id}</span></p>
                    <p className="text-sm">{formatMotokoTime(proposal.createdAt)}</p>
                </div>
                {!proposal.downPaymentStatus ? (
                    <button onClick={() => handlePorceedDp()} className="background-dark md:w-[10%] w-[30%] text-white py-1 px-2 rounded-md cursor-pointer">proceed dp</button>
                ) : (
                    <div className={`font-semibold ${proposal.voterPercentage > 0.51 ? 'text-green-800' : 'text-gray-800'}`}>{proposal.voterPercentage * 100}%</div>
                )}
            </div>

            <div className={`${isOpen ? '' : 'hidden'} space-y-1 text-sm`}>
                <p>You are proposed to buy this asset with asset id <span className="font-bold">{proposal.assetId}</span></p>
                <p>Total token you proposed is <span className="font-semibold">{proposal.amount} tokens</span></p>
                <p>Each token you proposed in price <span className="font-semibold">{proposal.pricePerToken}</span></p>
                <p>Total Payment you must pay is <span className="font-semibold">{proposal.totalPrice}</span></p>
                <p>Current Voter Status: <span className={`font-semibold ${proposal.voterPercentage > 0.51 ? 'text-green-800' : 'text-gray-800'}`}>{proposal.voterPercentage * 100}%</span></p>
                {proposal.voterPercentage >= 0.51 &&
                    <button
                        onClick={() => handleFinishedPayment()}
                        className="background-dark text-white rounded-md p-2 cursor-pointer mt-5"
                    >
                        Finish Payment
                    </button>
                }
            </div>
        </div>
    )
}

export function Proposal() {
    const [myProposal, setMyProposal] = React.useState<[ProposalResult[]] | []>();
    const [isLoading, setIsLoading] = React.useState(true);

    const { setNotificationData } = React.useContext(NotificationContext);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await backendService.getMyProposal();
                setMyProposal(res);
                console.log(res)
                setNotificationData({ title: "success to fecth data", description: "", position: "bottom-right" })
            } catch (error) {
                setNotificationData({ title: "failed to fecth data", description: "", position: "bottom-right" })
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [])

    if (isLoading) return <LoaderComponent fullScreen={true} text="fetching data, please wait" />

    return (
        <div className="p-4 border border-gray-200 rounded-md bg-white">
            <h1 className="text-xl pb-2 border-b border-gray-300 my-3">Propsal</h1>
            <div>
                {!myProposal || myProposal.length === 0 ? (
                    <div className="p-5 bg-blue-100 rounded-md text-center">No data</div>
                ) : myProposal[0].length === 0 ? (
                    <div className="p-5 bg-blue-100 rounded-md text-center">No data</div>
                ) : (
                    <div className="p-1 space-y-2">
                        {myProposal[0].map((d, idx) => (
                            <ProposalCard key={idx} proposal={d} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}