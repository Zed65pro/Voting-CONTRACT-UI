import React, { useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../constants/constants";

interface Props {
  provider: ethers.providers.Web3Provider;
}

const Status = ({ provider }: Props) => {
  const [status, setStatus] = useState<boolean | null>(null);

  const contractAddress = process.env.REACT_APP_CONTRACT_ADDR || "";

  const getCurrentStatus = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const status = await contract.getVotingStatus();
    setStatus(status);
  };

  return (
    <>
      <button
        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={getCurrentStatus}
      >
        Check Voting Status
      </button>

      {status !== null && (
        <p
          className={`text-lg mt-4 font=bold ${
            status ? "text-green-600" : "text-red-600"
          }`}
        >
          {status ? "Voting is still ongoing!" : "Voting session has expired!"}
        </p>
      )}
    </>
  );
};

export default Status;
