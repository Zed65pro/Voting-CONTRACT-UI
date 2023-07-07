import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Login from "./components/Login";
import Home from "./components/Home";

declare let window: any;
const SESSION_STORAGE_KEY = "metamask_account";

const App = () => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = () => {
    // Clear the account from sessionStorage
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setAccount(null);
  };

  useEffect(() => {
    const handleRefreshPage = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);
      await provider.send("eth_requestAccounts", []);
    };

    if (account === null) {
      const storedAccount = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedAccount) {
        setAccount(storedAccount);
        handleRefreshPage();
      }
    }
  }, [account]);

  useEffect(() => {
    const handleAccountChange = (accounts: string[]) => {
      if (accounts.length > 0 && account !== accounts[0]) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, accounts[0]);
        setAccount(accounts[0]);
      } else {
        setAccount(null);
      }
    };

    if (!window.ethereum) {
      setError("Metamask not detected in the browser");
      return;
    }

    window.ethereum.on("accountsChanged", handleAccountChange);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  });

  const connectToMetamask = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log(`Metamask connected: ${address}`);

        sessionStorage.setItem(SESSION_STORAGE_KEY, address);
        setAccount(address);
      } catch (err) {
        console.log(err);
      }
    } else {
      setError("Metamask not detected in the browser");
      console.log("Metamask not detected in the browser");
    }
  };
  console.log(error);

  return (
    <div>
      {account && provider ? (
        <Home account={account} provider={provider} logout={handleLogout} />
      ) : (
        <Login connectToMetamask={connectToMetamask} error={error} />
      )}
    </div>
  );
};

export default App;
