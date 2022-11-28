import axios from "axios"
import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import "./Home.css"
import Form from 'react-bootstrap/Form';
import RangeSlider from 'react-bootstrap-range-slider';

export default function Analyze1(props) {
    const baseURL = "http://127.0.0.1:8000/api"
    const [city, setCity] = useState("");
    // const [autocompleteCities, setAutocompleteCities] = useState([]);
    // const [autocompleteErr, setAutocompleteErr] = useState("");
    const [range, setRange ] = React.useState(5);
    const [datarry, setdatarry] = useState([])
    const [submit, setsubmit] = useState(false)


    const handleChange = async (e) => {
        setCity(e.target.value);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        setsubmit(true)
        try {
            const res = await axios.get(`${baseURL}/mapreduce/?dataSet=restaurants&score=${range}&city=${city}`)
            let data = res.data.slice(0,30)
            console.log(data)
            let curdata = []
            
            for (let i = 0; i < data.length; i++) {
                curdata.push ({
                    id : curdata.length,
                    name: data[i].name,
                    score : data[i].rate,
                    review_cnt: data[i].review_cnt,
                    categories:data[i].categories
                })
            }
            setdatarry(curdata)
        } catch(err) {
            console.error(err)
        }
    }

 
  
    const updatedList = datarry.map((item)=>{
        return(
            <tr>
                <td>{item.name}</td>
                <td>{item.score}</td>
                <td>{item.review_cnt}</td>
                <td>{item.categories}</td>
            </tr>
               
            ); 
    });


    return (
        <div>
            <AnalyzeNav />
            <div className="App">
                <form className="iform" onSubmit={e => handleSubmit(e)}>
                    <p>When selecting the one of the city in California and the range of restaurant rating, results of the restaurants will show up below as a list</p>
                    <div className="placesAutocomplete">
                        <div className="placesAutocomplete__inputWrap">
                            <label htmlFor="city" className="label">
                                Your city
                                {/* {autocompleteErr && (
                                    <span className="inputError">{autocompleteErr}</span>
                                )} */}
                            </label>
                            <input
                                type="text"
                                id="city"
                                name="city"
                                onChange={e => handleChange(e)}
                                value={city}
                                required
                                // pattern={autocompleteCities.join("|")}
                                // autoComplete="on"
                            />
                            {/* <datalist id="places">
                                {autocompleteCities.map((city, i) => (
                                    <option key={i}>{city}</option>
                                ))}
                            </datalist> */}
                            <br />
                            

                            <Form.Label>Rating Range</Form.Label>
                            <RangeSlider
                                value={range}
                                onChange={changeEvent => setRange(changeEvent.target.value)}
                                max = {5}
                            />
                            <br />
                            <button className="button">Submit</button>
                        </div>
                    </div>
                    <div>
                    </div>
                </form>

                {/* <ul>{updatedList}</ul> */}

                <br/>
                {submit && <div>
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>name</th>
                            <th>score</th>
                            <th>review_number</th>
                            <th>categories</th>
                        </tr>
                    </thead>
                    <tbody>
                        {updatedList}
                    </tbody>
                </table>

            </div>}
            </div>
        </div>
    )
}

