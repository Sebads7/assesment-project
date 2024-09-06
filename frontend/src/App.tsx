// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CountryPage from "./pages/CountryPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/country/:countryCode" element={<CountryPage />} />
    </Routes>
  );
}

export default App;
