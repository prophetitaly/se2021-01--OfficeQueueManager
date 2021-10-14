const URL = "http://localhost:3000"

async function loadServices() {
    let myURL = URL + "/api/services/all";
    const response = await fetch(myURL);
    if (response.ok) {
        const fetchedImages = await response.json();
        return fetchedImages;
    } else return { 'error': 'Failed to load services from server' }
}

async function addTicket(ticket) {
    const response = await fetch(URL + "/api/ticket/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticket),
        });
    if (response.ok) {
        const ticketNumber = await response.json();
        return ticketNumber;
    } else return { 'error': 'Failed to store data on server' }
}

async function login(user) {
    const response = await fetch(URL + "/api/sessions/",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        });
    if (response.ok) {
        return response.json();
    } else return { 'error': 'Failed to login: invalid username/password' }
}

async function logout() {
    const response = await fetch(URL + "/api/sessions/current/",
        {
            method: "DELETE"
        });
    if (response.ok) {
        return 1;
    } else return { 'error': 'Failed to logout' }
}

async function isLoggedIn() {
    try {
        const response = await fetch(URL + "/api/sessions/current/");
        if (response.ok) {
            return response.json();
        } else return { 'error': 'User is not logged in' };
    } catch (err) {
        return { 'error': 'User is not logged in' };
    }
}

const API = { loadServices, addTicket, login, logout, isLoggedIn };
export default API;