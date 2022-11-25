import React from "react";
import StartFirebase from "../firebaseConfig";
import { ref, set, get, update, remove, child } from "firebase/database";
import InputForm from "../components/InputForm";

export class Crud extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            isfile: true,
            name: ""
        }
    }

    conponentDidMount() {
        this.setState({
            db: StartFirebase()
        })
    }

    render() {
        return (
            <InputForm />
        )
    }

    getAllInputs() {
        return {
            id: this.state.id,
            isfile: this.state.isfile,
            name: this.state.name
        }
    }

    insertData() {
        const db = this.state.db;
        const data = this.getAllInputs();
        set(ref(db, 'Customer/' + data.username),
            {
                id: data.id,
                isfile: data.phone,
                name: data.name
            })
    }


    deleteData() {
        const db = this.state.db;
        const data = this.getAllInputs();
        remove(ref(db, 'Customer/' + data.username))
    }

    selectData() {
        const dbref = ref(this.state.db);
        const username = this.getAllInputs().username;
        get(child(dbref, 'Customer/' + username)).then((snapshot) => {
            if (snapshot.exists()) {
                this.setState({
                    id: snapshot.val().id,
                    isfile: snapshot.val().isfile,
                    name: snapshot.val.name
                })
            }
            else {
                alert("no data found!")
            }
        })
    }


}