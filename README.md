# se2021-02--OfficeQueueManager

## Installation Guide
 In a window terminal
 
 * git clone https://github.com/prophetitaly/se2021-02--OfficeQueueManager
 * cd se2021-02--OfficeQueueManager
 * cd server
 * npm install
 * nodemon server (nodemon is assumed to be already installed)

 On another terminal window
 * cd se2021-02--OfficeQueueManager
 * cd client
 * npm install
 * npm start

## React Client Application Routes

- Route `/`: main page with links to the monitor or login
- Route `/login`: login form that redirects to different pages according to the user
- Route `/totem`: display the services for the office and enables the user to take a new ticket
- Route `/counter`: display a private interface for a given counter with some functionalities as calling the next customer
- Route `/manager`: display a private interface for the manager with some functionalities as setting services for counters
- Route `/monitor`: display the tickets called for each counter
  
## Database Tables

- Table `management` - contains id username services hash
- Table `tickets` - contains number date service counter
- Table `services` - contains serviceName estimatedTime
- 
## API Server

- POST `/api/sessions`
  - Request parameter: None.
  - Request body: An object representing the user (Content-Type: `application/json`).
  ``` 
  {
    "username": "manager",
    "password": "password"
  }
  ```
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
  - Response body: user info if logged in.
  ```
  {
    "id": 1,
    "username": "manager"}
  }
  ```
  
- GET `/api/sessions/current`
  - Request parameter: None.
  - Request body: None.
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
  - Response body: user info if logged in.
  ```
  {
    "id": 1,
    "username": "manager"}
  }
  ```

- DELETE `/sessions/current`
  - Request parameter: None.
  - Request body: None.
  - Response: `200 OK` (success).
  - Response body: None.  

- GET `/api/services`
  - Request parameter: None.
  - Request body: None.
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
  - Response body: services of the office with extimated time.
  ```
  [
    {
    "service": "Shipping",
    "extimatedTime": 10
    },
    {
    "service": "Payment",
    "extimatedTime": 5
    }
  ]
  ```

  - POST `/api/ticket`
  - Request parameter: None.
  - Request body: An object representing the service requested (Content-Type: `application/json`).
  ``` 
  {
    "service": "payment"
  }
  ```
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
   - Response body: ticket number if logged in.
  ```
  {
    6
  }
  ```

  - GET `/api/counters`
  - Request parameter: None.
  - Request body: None.
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
  - Response body: counters of the office, with the relative available services.
  ```
  [
    { id: 2, username: 'counter1', services: '["Shipping, Payment"]' },
    { id: 3, username: 'counter2', services: '["Shipping"]' },
    { id: 4, username: 'counter3', services: '[]' }
  ]
  ```

    - POST `/api/ticket`
  - Request parameter: None.
  - Request body: An object representing the service requested (Content-Type: `application/json`).
  ``` 
  [
    {
      id: 2,
      username: 'counter1',
      services: '["Shipping","Payment","General"]'
    },
    { id: 3, username: 'counter2', services: '["Shipping"]' },
    { id: 4, username: 'counter3', services: '[]' }
  ]
  ```
  - Response: `200 OK` (success) or `401 Unauthenticated user`.
   - Response body: None.
