import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router-dom";
import { useState, useEffect } from 'react';
import API from "./API";

function MyTotem(props) {

    const [services, setServices] = useState([]);
    const [reqUpdate, setReqUpdate] = useState(true);
    const [ticketShow, setTicketShow] = useState(false);
    const [ticketNumber, setTicketNumber] = useState();
    const [ticketService, setTicketService] = useState();

    useEffect(() => {
        if (reqUpdate) {
            API.loadServices().then((s) => {
                if (s.error === undefined) {
                    setServices(s);
                    setReqUpdate(false);
                }
                else {
                }
            }).catch((err) => {
            });
        }
    }, [reqUpdate, props.loggedIn]);

    const toHide = () => {
        setTicketShow(false);
        setTicketNumber(undefined);
        setTicketService(undefined);
    }

    const handleSubmit = async (s) => {
        const ticket = {
            service: s
        };

        API.addTicket(ticket).then((response) => {
            if (response.error !== undefined) {
            } else {
                setTicketNumber(() => response);
                setTicketService(() => s);
                setTicketShow(() => true);
                setTimeout(() => toHide(), 5000);
            }
        });
    };

    return (
        <>
            {(!props.user || props.user !== "totem") && <Redirect to={"/"} />}
            <Container className="bg-dark min-height-100 justify-content-center align-items-center text-center m-0 p-0" fluid>
                <h1 className="text-white pt-5 pb-1 pr-0 pl-4">Welcome!</h1>
                <h5 className="text-white pt-0 pb-5 pr-0 pl-4">Please, select one of the services and read your ticket number</h5>

                {services &&
                    <>
                        <Row className="justify-content-center w-100 m-0 p-0">
                            <Col sm={4} className="m-0 p-0"></Col>
                            <Col sm={4} className="m-0 p-0">
                                {
                                    services.map((s) => {
                                        return (
                                            <Row className="mt-4 ml-0 mr-0 p-0 justify-content-center " key={s}>
                                                <Button className="w-100 p-4" variant="primary" size="lg" onClick={() => handleSubmit(s)}>{s}</Button>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                            <Col sm={4} className="m-0 p-0"></Col>
                        </Row>
                        <MyModal ticketNumber={ticketNumber} ticketService={ticketService} show={ticketShow} onHide={() => toHide} />
                    </>
                }
            </Container>
        </>
    );
}

function MyModal(props) {

    useEffect(() => {

    })
    return (
        <Modal
            {...props}
            size="auto"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            centered
        >
            <Modal.Body>
                <Row className="justify-content-center">
                    <h2 className="text-info">Ticket Information</h2>
                </Row>
                <Row className="justify-content-left ml-2 mt-2">
                    <h4>Ticket number: {props.ticketNumber}</h4>

                </Row>
                <Row className="justify-content-left ml-2">
                    <h4>Ticket service: {props.ticketService}</h4>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default MyTotem;