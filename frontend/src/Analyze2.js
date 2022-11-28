import axios from "axios"
import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import { fetchPlace } from "./fetchPlace";
import "./Home.css"
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';

export default function Analyze2(props) {
    const baseURL = "http://127.0.0.1:8000/api"
    const [num, setNum] = useState('');
    const [datarry, setdatarry] = useState([])
    const [submit, setsubmit] = useState(false)
   

    const handleNumChange = (event) => {
        setNum(event.target.value);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try {
            const res = await axios.get(`${baseURL}/mapreduce/?dataSet=restaurants&top_review_num=${num}`)
            const data = res.data.res
            console.log(data)
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <div className="App">
            <AnalyzeNav />
            <form className="iform" onSubmit={e => handleSubmit(e)}>
                <label htmlFor="num">I want to select the top</label>
                <input
                    type="number"
                    id="num"
                    name="num"
                    value={num}
                    onChange={handleNumChange}
                />
                <span>review count restaurants</span>
                <br />
                <button className="button" type="submit">Submit</button>
            </form>
        </div>
    );
}