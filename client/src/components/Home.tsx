import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractABI } from "../constants/constants";
import Candidates from "./Candidates";

interface HomeProps {
  account: string;
  provider: ethers.providers.Web3Provider;
  logout: () => void;
}

const contractAddress = process.env.REACT_APP_CONTRACT_ADDR || "";

const Home: React.FC<HomeProps> = ({
  account,
  provider,
  logout,
}: HomeProps) => {
  const [status, setStatus] = useState<boolean | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const getCurrentStatus = async () => {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, contractABI, signer);

    const status = await contract.getVotingStatus();
    setStatus(status);
  };

  const formatTime = (time: number | null): string => {
    if (time === null) {
      return "00:00:00";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    return `${formatDigit(hours)}:${formatDigit(minutes)}:${formatDigit(
      seconds
    )}`;
  };

  const formatDigit = (digit: number): string => {
    return digit < 10 ? `0${digit}` : `${digit}`;
  };

  useEffect(() => {
    const getRemainingTime = async () => {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const remainingTime = await contract.getRemainingTime();
      setRemainingTime(parseInt(remainingTime, 10));
    };

    getRemainingTime(); // Initial call to get the remaining time

    const intervalId = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        if (prevRemainingTime !== null && prevRemainingTime > 0) {
          return prevRemainingTime - 1;
        } else {
          clearInterval(intervalId);
          return null;
        }
      });
    }, 1000); // Update the time every second

    return () => {
      clearInterval(intervalId);
    };
  }, [provider]);

  return (
    <div className="flex flex-col items-center pt-5 h-screen bg-gray-200">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome, people of high intellect
      </h1>
      <span className="text-lg text-gray-800">Account: {account}</span>

      <div className="flex flex-col items-center justify-center bg-gray-200">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={getCurrentStatus}
        >
          Check Voting Status
        </button>

        {status !== null && (
          <span className="text-lg mt-4">
            {status
              ? "Voting is still ongoing!"
              : "Voting session has expired!"}
          </span>
        )}

        {remainingTime !== null && (
          <div className="text-lg mt-4">
            Remaining Time: {formatTime(remainingTime)}
          </div>
        )}
        <Candidates provider={provider} />
      </div>
    </div>
  );
};

export default Home;
