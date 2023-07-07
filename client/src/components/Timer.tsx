import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI } from "../constants/constants";

interface Props {
  provider: ethers.providers.Web3Provider;
}

const contractAddress = process.env.REACT_APP_CONTRACT_ADDR || "";

const Timer = ({ provider }: Props) => {
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const formatDigit = (digit: number): string => {
    return digit < 10 ? `0${digit}` : `${digit}`;
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
    <>
      {remainingTime !== null && (
        <div className="text-lg mt-4">
          Remaining Time: {formatTime(remainingTime)}
        </div>
      )}
    </>
  );
};

export default Timer;
