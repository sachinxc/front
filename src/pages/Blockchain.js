import React, { useState, useEffect } from "react";
import "./Blockchain.css"; // Import the custom CSS file
import Wallet from "../components/blockchain/Wallet"; // Import the Wallet component

function Blockchain() {
  const [blockchain, setBlockchain] = useState([]);

  // Fetch the blockchain data
  const fetchBlockchain = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_BLOCKCHAIN_API_URL);
      const data = await response.json();
      setBlockchain(data);
    } catch (error) {
      console.error("Error fetching blockchain data:", error);
    }
  };

  useEffect(() => {
    // Fetch blockchain data when the component mounts
    fetchBlockchain();
  }, []);

  // Toggle the wallet visibility
  const [showWallet, setShowWallet] = useState(false);

  const toggleWallet = () => {
    setShowWallet(!showWallet);
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Blockchain & Wallet</h1>

      {/* Button to toggle wallet visibility */}
      <button onClick={toggleWallet} className="btn-primary">
        {showWallet ? "Hide Wallet" : "Show Wallet"}
      </button>

      {/* Conditionally render the Wallet component */}
      {showWallet && <Wallet fetchBlockchain={fetchBlockchain} />}

      <hr className="divider" />

      <h2>Blockchain</h2>
      <div className="blockchain-section">
        {blockchain.map((block, index) => (
          <div key={index} className="block-card">
            <h3>Block {index + 1}</h3>
            <p>
              <strong>Hash:</strong> {block.hash}
            </p>
            <p>
              <strong>Previous Hash:</strong> {block.previousHash}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(block.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Nonce:</strong> {block.nonce}
            </p>
            <p>
              <strong>Contribution:</strong> {block.contribution || "N/A"}
            </p>
            <h4>Transactions:</h4>
            <ul>
              {block.transactions.map((tx, txIndex) => (
                <li key={txIndex} className="transaction-item">
                  <p>
                    <strong>Transaction Hash:</strong> {tx.transactionId}
                  </p>
                  <p>
                    <strong>Sender:</strong> {tx.sender || "Action Chain"}
                  </p>
                  <p>
                    <strong>Recipient:</strong> {tx.recipient}
                  </p>
                  <p>
                    <strong>Amount:</strong> {tx.amount} tokens
                  </p>
                  <p>
                    <strong>Signature:</strong>{" "}
                    {tx.signature || "Rewarded by Action Chain"}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blockchain;
