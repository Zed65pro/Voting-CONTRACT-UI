import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Login from "./components/Login";
import Home from "./components/Home";

declare let window: any;
const LOCAL_STORAGE_KEY = "metamask_account";

const App = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  const handleLogout = () => {
    // Clear the account from local storage
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAccount(null);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", handleAccountChange);
    const storedAccount = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (storedAccount) {
      setAccount(storedAccount);
    }

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  });

  const handleAccountChange = (accounts: string[]) => {
    if (accounts.length > 0 && account !== accounts[0]) {
      localStorage.setItem(LOCAL_STORAGE_KEY, accounts[0]);
      setAccount(accounts[0]);
    } else {
      setAccount(null);
    }
  };

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Metamask connected:${address}`);

        localStorage.setItem(LOCAL_STORAGE_KEY, address);
        setAccount(address);
      } catch (err) {
        console.error(err);
      }
    } else {
      console.log("Metamask not detected in the browser");
    }
  };

  return (
    <div>
      {account && provider ? (
        <Home account={account} provider={provider} logout={handleLogout} />
      ) : (
        <Login connectToMetamask={connectToMetamask} />
      )}
    </div>
  );
};

export default App;
