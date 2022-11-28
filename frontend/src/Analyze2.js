import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import "./Home.css"

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
                <label htmlFor="numin">I want to select the top</label>
                <input
                    type="number"
                    id="num"
                    name="num"
                    value={numin}
                    onChange={handleNumChange}
                />
                <span>review count restaurants</span>
                <br />
                <button className="button" type="submit">Submit</button>
            </form>
        </div>
    );
}