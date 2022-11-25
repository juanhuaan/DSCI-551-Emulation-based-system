import React, { useState } from "react";
import Analyze from "./Analyze"
import Home from "./Home"
import Homecy from "./Homecy"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";


export default function App() {
  //html display
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </Router>

  )
}
