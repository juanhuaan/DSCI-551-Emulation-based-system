import React from "react"
import "./Home.css"
import AnalyzeNav from "./components/AnalyzeNav";
import Analyze1 from "./Analyze1";
import Analyze2 from "./Analyze2.js";
import Analyze3 from "./Analyze3";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Redirect,
  } from "react-router-dom";

export default function Analyze(props) {
  
    return (
        <div className="App">   
            <AnalyzeNav/> 
            <div className="intro">
                <legend>You can select the above tabs for different analyzation groups</legend>
                <h5>We have four different datasets</h5>
                <ul>
                    <li>City</li>
                    <li>Rate</li>
                    <li>Rest</li>
                    <li>User</li>
                </ul>
            </div>
        </div>
    );
}

// class Analyze extends React.Component {
//     state = {
//         pop: 0,
//         // searchResult after searcj
//         results:[],
//         city: '',
//         popreq: ''
//     }

//     // getResult from Backend
//     async getResult() {
//         const query = ref(db, '/user/user0');
//         return onValue(query, (response) => {
//             console.log(response.val())
//             this.setState({
//                 results: response.val()
//             })
//         })
        
//     }
//     // getHeadings = () => {
//     //     console.log(this.state.result[0])
//     //     return Object.keys(this.state.result[0]);
//     // }

//     componentDidMount() {
//         this.getResult()
//     }

//     handleForm = e => {
//         const target = e.target

//         const value = target.type == 'checkbox'
//             ? target.checked
//             : target.value

//         //获取name
//         const name = target.name
//         this.setState({
//             [name]: value
//         })
//     }
//     render() {
//         return (
//             <div>
//                 <h1>Choose the attributes you want to filter</h1>
                
//                 <label for='city'>City: </label>
//                 <input id='city' name="city" type='text' value={this.state.city} onChange={this.handleForm}/>
//                 <br></br>
//                 <label for='num'>Population: </label>
//                 <select value={this.state.popreq} onChange={this.handleForm}>
//                     <option value="gt"> greater than </option>
//                     <option value='lt'> less than </option>
//                     <option value='eq'> equal</option>
//                 </select>
//                 <input id='population' type='number' name="pop" value={this.state.pop} onChange={this.handleForm}/>
//                 <input type='submit'></input>

//                 {this.state.results.map((result) => (
//                     <p>{result.id} {result.name}</p>
//                 ))}
//             </div>

//             // <div>
//             //     <Table theadData={this.getHeadings()} tbodyData={this.state.result}/>
//             // </div>
            
//         )
//     }
    
// }

        


// export default Analyze