import axios from "axios"
import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import { fetchPlace } from "./fetchPlace";
import "./Home.css"
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';

export default function Analyze2(props) {
    const [numin, setNumin] = useState('');
    const [numax, setNumax] = useState('');


    const handleNumChange = event => {
        const limit = 4;
        setNumin(event.target.value.slice(0, limit));
        setNumax(event.target.value.slice(0, limit));
        if (numax < numin) {
            console.log("error")
        }
    };


    return (
        <div className="App">
            <AnalyzeNav />
            <form className="iform">
                <p>By selecting the population rank min and max value of cities, all the restaurants in these cities will show up and the total value is displayed as well.</p>
                <label htmlFor="numin">Min Rank</label>
                <input
                    type="number"
                    id="numin"
                    name="numin"
                    value={numin}
                    onChange={handleNumChange}
                />
                <label htmlFor="num">Max Rank</label>
                <input
                    type="number"
                    id="numax"
                    name="numax"
                    value={numax}
                    onChange={handleNumChange}
                />
                <br />
                <button className="button" type="submit">Submit</button>
            </form>
        </div>
    );
}