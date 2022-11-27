import React, { useState } from "react";
import Analyze from "./Analyze"
import Home from "./Home"
import HomeFB from "./Home_firebase"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Redirect,
} from "react-router-dom";
import AnalyzeNav from "./components/AnalyzeNav";
import Analyze1 from "./Analyze1";
import Analyze2 from "./Analyze2.js";
import Analyze3 from "./Analyze3";
import Analyze4 from "./Analyze4";
import Menu from "./components/Menu"
// import Nav from 'react-bootstrap/Nav';

export default function App() {
  //html display
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/firebase" element={<HomeFB />} />
        <Route path="/analyze" element={<Analyze />} />
        <Route path="/analyze/rescity" element={<Analyze1 />} />
        <Route path="/analyze/reviewcount" element={<Analyze2 />} />
        <Route path="/analyze/populationrest" element={<Analyze3 />} />
        <Route path="/analyze/analyze4" element={<Analyze4 />} />
      </Routes>
    </Router>
  )
}
