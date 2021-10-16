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
            }
        });
    };

    return (
        <>
            {!props.user || props.user !== "totem" && <Redirect to={"/"} />}
            <Container className="bg-dark min-height-100 justify-content-center align-items-center " style={{ display: 'flex' }} fluid>
                {services &&
                    <>
                        <Row className="justify-content-center">
                            <Col md="auto" className="mx-2">
                                {
                                    services.map((s) => {
                                        return (
                                            <Row className="my-3 justify-content-center" key={s}>
                                                <Button className="" variant="success" size="lg" onClick={() => handleSubmit(s)}>{s}</Button>
                                            </Row>
                                        )
                                    })
                                }
                            </Col>
                        </Row>
                        <MyModal ticketNumber={ticketNumber} ticketService={ticketService} show={ticketShow} onHide={() => { setTicketShow(false); setTicketNumber(undefined); setTicketService(undefined) }} />
                    </>
                }
            </Container>
        </>
    );
}

function MyModal(props) {

    useEffect(() => {
        setTimeout(() => props.onHide(), 8000);
    })
    return (
        <Modal
            {...props}
            size="auto"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Body>
                <Row className="justify-content-center">
                    <Col md="auto">
                        <h3>Ticket information</h3>
                        <h4>Ticket number: {props.ticketNumber}</h4>
                        <h4>Ticket service: {props.ticketService}</h4>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
}

export default MyTotem;