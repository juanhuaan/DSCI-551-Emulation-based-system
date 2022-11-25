import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function InputForm(props) {
    return (
        <form className="iform" onSubmit={props.submit}>
            <label htmlFor="name">Please input the name of File/Directory</label>
            <br></br>
            <input
                type="text"
                placeholder="name"
                onChange={props.change}
                name="name"
                value={props.val}
            />
            <br></br>
            <input
                className="cbox"
                type="checkbox"
                id="isfile"
                checked={props.ischeck}
                onChange={props.change}
                name="isfile"
            />

            <label className="labelforc" htmlFor="isfile">Is this a File?</label>

            <br></br>

            <fieldset>
                <p>If yes, select the number of partitions</p>

                <input
                    type="radio"
                    id="1"
                />
                <label htmlFor="1">1</label>
                <br />

                <input
                    type="radio"
                    id="2"
                />
                <label htmlFor="2">2</label>
                <br />

                <input
                    type="radio"
                    id="3"
                />
                <label htmlFor="3">3</label>
                <br />

            </fieldset>
            <button className="button">Submit</button>
        </form>
    )
}