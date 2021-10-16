import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { useState } from 'react';

function MyHomepage(props) {

    const [redirectMonitor, setRedirectMonitor] = useState(false);
    const [redirectLogin, setRedirectLogin] = useState(false);

    return (
        <>
            {redirectMonitor && <Redirect to={"/monitor"} />}
            {redirectLogin && <Redirect to={"/login"} />}
            <Container className="bg-dark min-height-100 justify-content-center align-items-center text-center" fluid>
                <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Queue Management System</h1>
                <h5 className="text-white pt-0 pb-5 pr-0 pl-4 mb-5">Select one of the options</h5>

                <Row className="justify-content-center m-0 p-0 w-100 pt-5">
                    <Col className=" m-0 p-0" sm={6}>
                        <Button size="lg" className="p-4 w-50" onClick={() => { setRedirectMonitor(true) }}><h4>Monitor</h4></Button>
                    </Col>
                </Row>
                <br/>
                <Row className="justify-content-center m-0 p-0 w-100">
                <Col className=" m-0 p-0" sm={6}>
                        <Button size="lg" className="p-4 w-50" onClick={() => { setRedirectLogin(true) }}><h4>Login</h4></Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MyHomepage;