import React from "react"
import AnalyzeNav from "./components/AnalyzeNav";
import { useState } from "react";
import "./Home.css"

export default function Analyze3(props) {
    const [numin, setNumin] = useState('');
    const [numax, setNumax] = useState('');
    const [submit, toggleSubmit] = useState(false);
    let JsonData = ""
    const [arr, setdatarry] = useState([]);
    let jsonarray = [];

    React.useEffect(() => {
        toggleSubmit(false);
        if (numax < numin) {
            console.log('error')
        }
    }, [numax, numin])

    const handleMinNumChange = event => {
        const limit = 4;
        setNumin(event.target.value.slice(0, limit));
    };

    const handleMaxNumChange = event => {
        const limit = 4;
        setNumax(event.target.value.slice(0, limit));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const result = await fetch(`http://127.0.0.1:8000/api/mapreduce/?dataSet=cityAndRest&rankmin=${numin}&rankmax=${numax}&score=5`)
        JsonData = await result.json();
        jsonarray = JsonData.res;
        console.log("check json arr:")
        console.log(jsonarray)
        let newarr = []
        for (let i = 0; i < jsonarray.length; i++) {
            newarr.push({
                name: jsonarray[i].name,
                rank: jsonarray[i].rank,
                population: jsonarray[i].population,
                resNum: jsonarray[i].restNum,
            })
        }
        console.log(newarr)
        setdatarry(newarr)
        console.log(arr)
        toggleSubmit(true)

    }

    const DisplayData = arr.map((info) => {
        return (
            <tr>
                <td>{info.name}</td>
                <td>{info.rank}</td>
                <td>{info.population}</td>
                <td>{info.resNum}</td>
            </tr>
        )
    }
    )

    return (
        <div className="App">
            <AnalyzeNav />
            <form className="iform" onSubmit={e => handleSubmit(e)}>
                <p>By selecting the population rank min and max value of cities, all the restaurants in these cities will show up and the total value is displayed as well.</p>
                <label htmlFor="numin">Min Rank</label>
                <input
                    type="number"
                    id="numin"
                    name="numin"
                    value={numin}
                    onChange={handleMinNumChange}
                />
                <label htmlFor="num">Max Rank</label>
                <input
                    type="number"
                    id="numax"
                    name="numax"
                    value={numax}
                    onChange={handleMaxNumChange}
                />
                <br />
                <button className="button">Submit</button>
            </form>
            <br />
            {submit && <div className="result table">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Rank</th>
                            <th>Population</th>
                            <th>Number of Restaurants</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DisplayData}
                    </tbody>
                </table>

            </div>}
        </div>
    );
}