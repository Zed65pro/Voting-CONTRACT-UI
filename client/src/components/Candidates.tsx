import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../constants/constants";
import CandidateList from "./CandidateList";

export interface Candidate {
  name: string;
  voteCount: number;
}
declare let window: any;

interface CandidatesProps {
  provider: ethers.providers.Web3Provider;
}

const contractAddress = process.env.REACT_APP_CONTRACT_ADDR || "";

const Candidates = ({ provider }: CandidatesProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [checkedCandidateIndex, setCheckedCandidateIndex] = useState<
    number | null
  >(null);
  const [isVoted, setIsVoted] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", handleAccountChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  });

  const handleAccountChange = async (accounts: string[]) => {
    setError(null);
    isVotedCheck();
    setCheckedCandidateIndex(null);
  };

  useEffect(() => {
    getAllCandidates();
    isVotedCheck();
  }, []);

  const getAllCandidates = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log(contract);
    const candidatesContract = await contract.getAllVotesOfCandidates();
    const candidatesCount = candidatesContract.length;
    const candidates: Candidate[] = [];

    for (let i = 0; i < candidatesCount; i++) {
      const candidate = candidatesContract[i];
      candidates.push({
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      });
    }
    setCandidates(candidates);
  };

  const isVotedCheck = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const isVoted = await contract.isVoted(signer.getAddress());
    setIsVoted(isVoted);
  };

  const castVote = async () => {
    if (isVoted) {
      setError("You have already voted!");
      return;
    }
    if (checkedCandidateIndex === null) {
      setError("Please select a candidate!");
      return;
    }

    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    try {
      const tx = await contract.vote(checkedCandidateIndex);
      await tx.wait();

      // Transaction is confirmed, fetch the updated vote count
      setIsVoted(true);
      getAllCandidates();
      setCheckedCandidateIndex(null);
      setSuccess("Successfully voted!");
    } catch (error) {
      setError("Failed to cast vote.");
      setCheckedCandidateIndex(null);
    }
    isVotedCheck();
  };

  const handleCandidateCheck = (index: number) => {
    if (index === checkedCandidateIndex) {
      // Uncheck the candidate if it's already checked
      setCheckedCandidateIndex(null);
    } else {
      // Check the candidate
      setCheckedCandidateIndex(index);
    }
  };

  console.log(candidates);
  if (candidates.length === 0 || isVoted === null) return <div>Loading...</div>;

  return (
    <>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={castVote}
      >
        Vote
      </button>
      {success && <p className="text-green-600 mt-4">{success}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      <CandidateList
        candidates={candidates}
        handleCandidateCheck={handleCandidateCheck}
        checkedCandidateIndex={checkedCandidateIndex}
      />
    </>
  );
};

export default Candidates;
