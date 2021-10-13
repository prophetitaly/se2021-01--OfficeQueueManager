import { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import API from "./API";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

function MyLogin(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [errorMessageUsername, setErrorMessageUsername] = useState("");
    const [errorMessagePassword, setErrorMessagePassword] = useState("");

    const history = useHistory();

    function checkValid(username, password) {
        if (username === "") {
            setErrorMessageUsername((e) => {
                return "Should have some characters";
            });
        } else {
            setErrorMessageUsername("");
        }
        if (password === "") {
            setErrorMessagePassword((e) => {
                return "Should have some characters";
            });
        } else {
            setErrorMessagePassword("");
        }
    }

    function handleSubmit(ev) {
        ev.preventDefault();

        let valid = true;
        if (username === "") {
            valid = false;
        }
        if (password === "") {
            valid = false;
        }

        if (valid) {
            resetForm();
            API.login({ username: username, password: password }).then((response) => {
                if (response.error === undefined) {
                    API.isLoggedIn().then((response) => {
                        if (response.error === undefined) {
                            //props.setUser(() => response);
                            //props.setLoggedIn(() => true);
                            //props.setFirstLogin(() => true);
                            history.push("/" + username);
                        }
                    });
                } else {
                    setError(() => response.error);
                }
            });
        }
    }

    function resetForm() {
        setErrorMessageUsername(() => "");
        setErrorMessagePassword(() => "");
        setError(() => "");
    }

    useEffect(() => {
        if (error.length !== 0) {
            setTimeout(() => setError(""), 3000);
        }
    }, [error]);

    return (
        <>
            <Container className="bg-dark min-height-100 justify-content-center" style={{ display: 'flex' }} fluid>

                <Row className=" justify-content-center align-items-center">

                    <div id="loginContainerDiv">
                        <Form className="p-3">
                            <Form.Group controlId="formusername" className="mt-1">
                                <Form.Label className="text-info">Username</Form.Label>
                                <Form.Control
                                    type="username"
                                    placeholder="Enter username"
                                    required
                                    isInvalid={errorMessageUsername}
                                    onChange={(ev) => { setUsername(ev.target.value); checkValid(ev.target.value, password) }}
                                    value={username}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessageUsername}
                                </Form.Control.Feedback>
                                <Form.Text className="text-muted"></Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formPassword" className={errorMessageUsername ? "pt-1" : "pt-3"}>
                                <Form.Label className="text-info">Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Password"
                                    required
                                    isInvalid={errorMessagePassword}
                                    onChange={(ev) => { setPassword(ev.target.value); checkValid(username, ev.target.value); }}
                                    value={password}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errorMessagePassword}
                                </Form.Control.Feedback>
                            </Form.Group>
                            {error.length !== 0 && (
                                <div
                                    className="alert alert-danger alert-float-static fade show"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}
                            <Button
                                variant="success"
                                type="submit"
                                className={errorMessagePassword ? "mt-1" : "mt-3 float-right mr-4"}
                                onClick={(ev) => handleSubmit(ev)}
                            >
                                Login
                            </Button>
                        </Form>
                    </div>
                </Row>
            </Container>
        </>
    );
}

export default MyLogin;
