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



export default function App() {
  //html display
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/firebase" element={<HomeFB />} />
        <Route path="/analyze" element={<Analyze />} />
      </Routes>
    </Router>

  )
}
