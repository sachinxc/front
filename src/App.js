import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import CreateContribution from "./pages/CreateContribution";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Blockchain from "./pages/Blockchain";
import PostPage from "./pages/PostPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/create" element={<CreateContribution />} />
              <Route path="/blockchain" element={<Blockchain />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/post/:id" element={<PostPage />} />
            </Route>
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
