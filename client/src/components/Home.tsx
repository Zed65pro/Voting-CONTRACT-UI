import React from "react";
import { ethers } from "ethers";
import Candidates from "./Candidates";
import Timer from "./Timer";
import Status from "./Status";

interface HomeProps {
  account: string;
  provider: ethers.providers.Web3Provider;
  logout: () => void;
}

const Home = ({ account, provider, logout }: HomeProps) => {
  return (
    <div className="flex flex-col items-center pt-5 h-screen bg-gray-200">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Welcome, people of high intellect
      </h1>
      <span className="text-lg text-gray-800">Account: {account}</span>

      <Status provider={provider} />

      <Timer provider={provider} />
      <Candidates provider={provider} />
    </div>
  );
};

export default Home;
