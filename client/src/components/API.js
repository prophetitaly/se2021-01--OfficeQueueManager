const URL = "http://localhost:3000"

async function loadServices() {
    let myURL = URL + "/api/services";
    const response = await fetch(myURL);
    if (response.ok) {
        const fetchedServices = await response.json();
        return fetchedServices.map((s)=> s.service);
    } else return { 'error': 'Failed to load services from server' }
}

async function loadQueues() {
    let myURL = URL + "/api/tickets";
    const response = await fetch(myURL);
    if (response.ok) {
        const fetchedQueues = await response.json();
        return fetchedQueues;
    } else return { 'error': 'Failed to load queues from server' }
}

async function loadServings() {
    let myURL = URL + "/api/tickets/now";
    const response = await fetch(myURL);
    if (response.ok) {
        const fetchedTickets = await response.json();
        return fetchedTickets;
    } else return { 'error': 'Failed to load last tickets from server' }
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

const API = { loadServices, loadQueues, loadServings, addTicket, login, logout, isLoggedIn };
export default API;