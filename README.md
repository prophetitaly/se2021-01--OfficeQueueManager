# se2021-02--OfficeQueueManager

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