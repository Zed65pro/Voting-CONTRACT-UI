import React from "react";

interface LoginProps {
  connectToMetamask: () => Promise<void>;
}

const Login = ({ connectToMetamask }: LoginProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-300">
      <h1 className="text-2xl mb-4 font-bold">Login to MetaMask to continue</h1>
      <button
        className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={connectToMetamask}
      >
        MetaMask Login
      </button>
    </div>
  );
};

export default Login;
