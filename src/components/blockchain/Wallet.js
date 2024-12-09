import React, { useState } from "react";
import "./Wallet.css";

function Wallet({ fetchBlockchain }) {
  const [wallet, setWallet] = useState({
    privateKey: "",
    publicKey: "",
    balance: 0,
  });
  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [manualPrivateKey, setManualPrivateKey] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionStatus, setTransactionStatus] = useState("");
  const [recipientError, setRecipientError] = useState("");
  const [privateKeyError, setPrivateKeyError] = useState("");
  const [loadWalletError, setLoadWalletError] = useState("");
  const [amountError, setAmountError] = useState("");

  const walletApiUrl = process.env.REACT_APP_WALLET_API_URL;

  // Validate that the recipient's address is a valid public key (hexadecimal string)
  const isValidPublicKey = (address) => {
    const hexRegex = /^[0-9a-fA-F]{130}$/;
    return hexRegex.test(address);
  };

  // Validate that the private key is a valid 64-character hexadecimal string
  const isValidPrivateKey = (key) => {
    const hexRegex = /^[0-9a-fA-F]{64}$/; // 64 characters long, hex format
    return hexRegex.test(key);
  };

  // Generate a new wallet
  const generateWallet = async () => {
    try {
      const response = await fetch(`${walletApiUrl}/create`, {
        method: "POST",
      });
      const data = await response.json();
      setWallet({ ...data, balance: 0 });
      setPrivateKeyInput(data.privateKey);
      checkBalance(data.publicKey);
    } catch (error) {
      console.error("Error generating wallet:", error);
    }
  };

  // Load an existing wallet
  const loadWallet = async () => {
    // Validate the private key
    if (!isValidPrivateKey(privateKeyInput)) {
      setLoadWalletError(
        "Invalid private key. It should be a 64-character hexadecimal string."
      );
      return; // Stop execution if private key is invalid
    }

    try {
      const response = await fetch(`${walletApiUrl}/load`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ privateKey: privateKeyInput }),
      });

      if (response.ok) {
        const data = await response.json();
        setWallet(data);
        checkBalance(data.publicKey);
        setLoadWalletError("");
      } else {
        setLoadWalletError("Failed to load wallet: Invalid private key");
      }
    } catch (error) {
      console.error("Error loading wallet:", error);
    }
  };

  // Check balance
  const checkBalance = async (publicKey) => {
    try {
      const response = await fetch(`${walletApiUrl}/balance/${publicKey}`);
      const data = await response.json();
      setWallet((prevWallet) => ({ ...prevWallet, balance: data.balance }));
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  // Handle recipient input change with validation
  const handleRecipientChange = (e) => {
    const value = e.target.value;
    setRecipient(value);

    if (!isValidPublicKey(value)) {
      setRecipientError(
        "Invalid recipient address. It should be a 130-character hexadecimal string."
      );
    } else {
      setRecipientError("");
    }
  };

  // Handle private key input change with validation
  const handlePrivateKeyChange = (e) => {
    const value = e.target.value;
    setManualPrivateKey(value);

    if (!isValidPrivateKey(value)) {
      setPrivateKeyError(
        "Invalid private key. It should be a 64-character hexadecimal string."
      );
    } else {
      setPrivateKeyError("");
    }
  };

  // Handle amount input change with validation
  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);

    if (isNaN(value) || parseFloat(value) <= 0) {
      setAmountError("Please enter a valid number greater than zero.");
    } else {
      setAmountError("");
    }
  };

  // Send a transaction
  const sendTransaction = async () => {
    const privateKeyToUse = manualPrivateKey || wallet.privateKey;

    if (!privateKeyToUse) {
      setTransactionStatus("Private key is required to sign the transaction.");
      return;
    }

    if (!isValidPublicKey(recipient)) {
      setRecipientError("Please enter a valid recipient address.");
      return;
    }

    if (manualPrivateKey && !isValidPrivateKey(manualPrivateKey)) {
      setPrivateKeyError("Please enter a valid private key.");
      return;
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      setAmountError("Please enter a valid number greater than zero.");
      return;
    }

    try {
      const response = await fetch(`${walletApiUrl}/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: wallet.publicKey,
          recipient,
          amount: parseFloat(amount),
          privateKey: privateKeyToUse,
        }),
      });

      if (response.ok) {
        setTransactionStatus("Transaction successfully created!");
        checkBalance(wallet.publicKey);
        fetchBlockchain(); // Update blockchain after transaction
      } else {
        setTransactionStatus(
          `Failed to send transaction: ${await response.text()}`
        );
      }
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <div className="wallet-container">
      <h1 className="app-title">Wallet</h1>

      <div className="wallet-section">
        <h2>Create a New Wallet</h2>
        <button onClick={generateWallet} className="btn-primary">
          Generate New Wallet
        </button>
      </div>

      <hr className="divider" />

      <div className="wallet-section">
        <h2>Load Existing Wallet</h2>
        <input
          type="text"
          value={privateKeyInput}
          onChange={(e) => setPrivateKeyInput(e.target.value)}
          placeholder="Enter your private key"
          className="input-field"
        />
        {loadWalletError && <p className="error-message">{loadWalletError}</p>}
        <button onClick={loadWallet} className="btn-primary">
          Load Wallet
        </button>
      </div>

      {wallet.publicKey && (
        <div className="wallet-info">
          <p>
            <strong>Private Key:</strong> {wallet.privateKey}
          </p>
          <p>
            <strong>Public Key:</strong> {wallet.publicKey}
          </p>
          <p>
            <strong>Balance:</strong> {wallet.balance} tokens
          </p>
          <button
            onClick={() => checkBalance(wallet.publicKey)}
            className="btn-secondary"
          >
            Refresh Balance
          </button>
        </div>
      )}

      <hr className="divider" />

      {wallet.publicKey && (
        <>
          <div className="wallet-section">
            <h2>Send Tokens</h2>
            <input
              type="text"
              value={recipient}
              onChange={handleRecipientChange}
              placeholder="Enter recipient's public key"
              className="input-field"
            />
            {recipientError && (
              <p className="error-message">{recipientError}</p>
            )}

            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              className="input-field"
            />
            {amountError && <p className="error-message">{amountError}</p>}

            <input
              type="text"
              value={manualPrivateKey}
              onChange={handlePrivateKeyChange}
              placeholder="Enter private key for this transaction (optional)"
              className="input-field"
            />
            {privateKeyError && (
              <p className="error-message">{privateKeyError}</p>
            )}

            <button onClick={sendTransaction} className="btn-primary">
              Send Tokens
            </button>
            <p className="status-message">{transactionStatus}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Wallet;
