import axios from "axios"
import React from "react"
import { db } from './firebase'
import { ref, set, onValue, remove } from "firebase/database";
import Table from './Table'
// export default function Analyze(props) {
//     // const styles = {
//     //     background: props.isfile === true ? "url('./images/file.png') no-repeat top left" : "url('./images/folder.png') no-repeat top left"
//     // }

//     return (
//         <h1>Analyzation here</h1>
//     )
// }

class Analyze extends React.Component {
    state = {
        pop: 0,
        // searchResult after searcj
        results:[],
        city: '',
        popreq: ''
    }

    // getResult from Backend
    async getResult() {
        const query = ref(db, '/user/user0');
        return onValue(query, (response) => {
            console.log(response.val())
            this.setState({
                results: response.val()
            })
        })
        
    }
    // getHeadings = () => {
    //     console.log(this.state.result[0])
    //     return Object.keys(this.state.result[0]);
    // }

    componentDidMount() {
        this.getResult()
    }

    handleForm = e => {
        const target = e.target

        const value = target.type == 'checkbox'
            ? target.checked
            : target.value

        //获取name
        const name = target.name
        this.setState({
            [name]: value
        })
    }
    render() {
        return (
            <div>
                <h1>Choose the attributes you want to filter</h1>
                
                <label for='city'>City: </label>
                <input id='city' name="city" type='text' value={this.state.city} onChange={this.handleForm}/>
                <br></br>
                <label for='num'>Population: </label>
                <select value={this.state.popreq} onChange={this.handleForm}>
                    <option value="gt"> greater than </option>
                    <option value='lt'> less than </option>
                    <option value='eq'> equal</option>
                </select>
                <input id='population' type='number' name="pop" value={this.state.pop} onChange={this.handleForm}/>
                <input type='submit'></input>

                {this.state.results.map((result) => (
                    <p>{result.id} {result.name}</p>
                ))}
            </div>

            // <div>
            //     <Table theadData={this.getHeadings()} tbodyData={this.state.result}/>
            // </div>
            
        )
    }
    
}

        


export default Analyze