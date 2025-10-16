import React from "react";
import { AssetProposal } from "../../types/rwa";
import { formatMotokoTime } from "../../helper/rwa-helper";

interface ProposalVotingCardProps {
  proposal: AssetProposal;
}

export const ProposalVotingCard: React.FC<ProposalVotingCardProps> = ({
  proposal,
}) => {
  const totalVotes = proposal.votes.length;
  const totalSupport = proposal.votes.reduce((acc, [, v]) => acc + v, 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors shadow-sm p-6 mb-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Proposal #{proposal.id}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Asset ID: <span className="font-medium text-gray-700">{proposal.assetid}</span>
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {formatMotokoTime(proposal.createdAt)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm text-gray-700 mb-5">
        <p>
          <span className="text-gray-500">Price / Token: </span>
          {proposal.pricePerToken.toString()} ICP
        </p>
        <p>
          <span className="text-gray-500">Total Token: </span>
          {proposal.token.toString()}
        </p>
        <p>
          <span className="text-gray-500">From: </span>
          {proposal.from.toString()}
        </p>
        <p>
          <span className="text-gray-500">Votes: </span>
          {totalVotes} total ({totalSupport} approvals)
        </p>
      </div>

      <div className="flex gap-3">
        <button
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Approve
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Reject
        </button>
      </div>
    </div>
  );
};
