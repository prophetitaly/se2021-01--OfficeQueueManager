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
            <Container className="bg-dark min-height-100 justify-content-center align-items-center " style={{ display: 'flex' }} fluid>
                <Row className="justify-content-center">
                    <Col md="auto" className="mx-2">
                        <Button style={{ width: '125%', height: '125%' }} onClick={() => { setRedirectMonitor(true) }}>Monitor</Button>
                    </Col>
                    <Col md="auto" className="mx-2">
                        <Button style={{ width: '125%', height: '125%' }} onClick={() => { setRedirectLogin(true) }}>Login</Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default MyHomepage;