import React from "react"
import Nav from 'react-bootstrap/Nav';

export default function AnalyzeNav() {
    return (
        <Nav className="ananav" fill variant="tabs" defaultActiveKey="/analyze">
            <Nav.Item>
                <Nav.Link href="/analyze/rescity">Top rate restaurants in a city</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/analyze/reviewcount">Review count of restaurants</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/analyze/populationrest">Population and restaurants</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/analyze/analyze4">City Population</Nav.Link>
            </Nav.Item>
        </Nav>
    )

}