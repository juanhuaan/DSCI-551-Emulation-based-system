import axios from "axios"
import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import { fetchPlace } from "./fetchPlace";
import "./Home.css"
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';

export default function Analyze1(props) {
    const [city, setCity] = useState("");
    const [autocompleteCities, setAutocompleteCities] = useState([]);
    const [autocompleteErr, setAutocompleteErr] = useState("");

    const handleCityChange = async (e) => {
        setCity(e.target.value);
        if (!city) return;

        const res = await fetchPlace(city);
        !autocompleteCities.includes(e.target.value) &&
            res.features &&
            setAutocompleteCities(res.features.map((place) => place.place_name));
        res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
    };

    return (
        <div>
            <AnalyzeNav />
            <div className="App">
                <form className="iform">
                    <p>When selecting the one of the city in California and the range of restaurant rating, results of the restaurants will show up below as a list</p>
                    <div className="placesAutocomplete">
                        <div className="placesAutocomplete__inputWrap">
                            <label htmlFor="city" className="label">
                                Your city
                                {autocompleteErr && (
                                    <span className="inputError">{autocompleteErr}</span>
                                )}
                            </label>
                            <input
                                list="places"
                                type="text"
                                id="city"
                                name="city"
                                onChange={handleCityChange}
                                value={city}
                                required
                                pattern={autocompleteCities.join("|")}
                                autoComplete="on"
                            />
                            <datalist id="places">
                                {autocompleteCities.map((city, i) => (
                                    <option key={i}>{city}</option>
                                ))}
                            </datalist>
                            <br />
                            <Form.Label>Rating Range</Form.Label>
                            <Form.Range />
                            <br />
                            <button className="button" type="submit">Submit</button>
                        </div>
                    </div>
                    <div>
                    </div>

                </form>
            </div>
        </div>
    )
}