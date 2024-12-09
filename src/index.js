// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

// Find the root element
const container = document.getElementById("root");

// Create a root
const root = createRoot(container);

// Initial render
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
