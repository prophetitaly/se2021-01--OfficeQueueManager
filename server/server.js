'use strict';

const express = require('express');
const morgan = require("morgan");
const { check, query, validationResult } = require("express-validator");
const path = require("path");

const officeDao = require("./officeDao");
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./userDao'); // module for accessing the users in the DB
const dao = require('./db'); // module for accessing the users in the DB
const url = require('url');


/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (username, password, done) {
    userDao.getUser(username, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;
app.use(morgan("dev"));
app.use(express.json()); // parse the body in JSON format => populate req.body attributes

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** APIs ***/

// GET next ticket number
app.get('/api/ticket', async (req, res) => {
  try {
    const result = await officeDao.getNextNumber();
    if (result.err)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// GET all tickets in queue
app.get('/api/tickets', async (req, res) => {
  try {
    const result = await officeDao.getTickets();
    if (result.err)
      res.status(404).json(result);
    else
      res.json(result);
  } catch (err) {
    res.status(500).end();
  }
});

// POST /api/ticket/
//new ticket
app.post('/api/ticket/', [
  check('service').isString()
], isLoggedIn, (req, res, next) => {
  if (req.user.username === "totem")
    return next();
  return res.status(401).json({ error: 'restricted access' });
}, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  const ticket = req.body;

  try {
    ticket.number = await officeDao.getNextNumber();
    if (ticket.number.err)
      res.status(404).json(result);
    else {
      const result = await officeDao.addTicket(ticket);
      if (result.err)
        res.status(404).json(result);
      else
        res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: `${err}.` });
    return;
  }

});

// GET counter informations
app.get('/api/counters', isLoggedIn, (req, res, next) => {
  if (req.user.username === "manager")
    return next();
  return res.status(401).json({ error: 'restricted access' });
}, async (req, res) => {
  try {
    const counters = await officeDao.getCounterInfo();
    if (counters.error) {
      res.status(404).json(counters);
    }
    else {
      res.json(counters);
    }
    /*
    } else if(counters.username == req.user.id){
        res.json(counters);
    } else {
        res.status(401).send("Not authorized");
    }*/
  } catch (err) {
    res.status(500).end();
  }
});


// GET services
app.get('/api/services', isLoggedIn, (req, res, next) => {
  if (req.user.username === "totem" || req.user.username === "manager")
    return next();
  return res.status(401).json({ error: 'restricted access' });
}, async (req, res) => {
  try {
    const service = await officeDao.getServices();
    if (service.error) {
      res.status(404).json(service);
    }
    else {
      res.json(service);
    }
    /*
    } else if(counters.username == req.user.id){
        res.json(counters);
    } else {
        res.status(401).send("Not authorized");
    }*/
  } catch (err) {
    console.log(err)
    res.status(500).end();
  }
});

//POST counter informations
app.post('/api/counters/', isLoggedIn, (req, res, next) => {
  if (req.user.username === "manager")
    return next();
  return res.status(401).json({ error: 'restricted access' });
}, async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: errors.array() });
  }
  const counters = req.body;

  try {
    for (let i = 0; i < counters.length; i++) {
      await officeDao.updateCounter(counters[i]);

    }
    res.status(200).end();


  } catch (err) {
    res.status(500).json({ error: `${err}.` });
    return;
  }

});

// GET next ticket
app.get('/api/nextCustomer/', isLoggedIn, (req, res, next) => {
  var queryString = url.parse(req.url).query;
  const id = "counter" + queryString.replace("counter_id=", "")
  if (req.user.username === id)
    return next();
  return res.status(401).json({ error: 'restricted access' });
}, async (req, res) => {
  try {
    var queryString = url.parse(req.url).query;
    const id = "counter" + queryString.replace("counter_id=", "")
    var services = await officeDao.getServicesOfCounterX(id);
    var list_of_services = [];
    services = (services.replace("[", "").replace("]", "").replace(" ", "")).split(",");
    for (var i = 0; i < services.length; i++) {
      var list = await officeDao.getTicketsOfService(services[i].replace(" ", "").slice(1, -1));
      list_of_services.push(list);
    }
    // Now in list_of_services I have the lists of all the open tickets of each service
    const lists_size = list_of_services.map((elem) => elem.length)
    var max = 0;
    console.log(lists_size)
    lists_size.forEach((elem) => {
      if (elem > max) max = elem
    })
    // I have no open ticket in the db
    if (max < 1) { res.json({ 'ticket': 0 }); return; }
    var indici = []
    var index = lists_size.indexOf(max);
    // indexOf returns -1 if there is no elem equal to max
    indici.push(index)
    while (true) {
      if ((index = lists_size.indexOf(max, index + 1)) != -1) {
        indici.push(index)
      }
      else {
        break;
      }
    }
    // I have a service with a queue longer than the others
    if (indici.length == 1) {
      console.log("only a service")
      const ticket = await officeDao.getMinTicket(services[indici[0]].replace(" ", "").slice(1, -1))
      officeDao.setTicketAsServed(ticket, id)
      res.json({ 'ticket': ticket })
      return;
    }
    console.log("More than one service")
    var services_with_max = []
    for (var i = 0; i < lists_size.length; i++) {
      if (lists_size[i] == max) {
        services_with_max.push(services[i].replace(" ", "").slice(1, -1))
      }
    }
    console.log("services_with_max")
    console.log(services_with_max)
    var minimum = Number.MAX_SAFE_INTEGER
    var selected_service;

    for (var i = 0; i < services_with_max.length; i++) {
      var e = services_with_max[i];
      const min = await officeDao.selectService(e)
      if (min < minimum) {
        minimum = min; selected_service = e; console.log(e);
      }
    }

    const ticket = await officeDao.getMinTicket(selected_service)
    officeDao.setTicketAsServed(ticket, id)
    res.json({ 'ticket': ticket })
    return;


  }
  catch (err) {
    console.log("Error api/nextCustomer");
    console.log(err);
  }
})

/*** User APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      console.log(user)
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});


// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.status(200).end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

