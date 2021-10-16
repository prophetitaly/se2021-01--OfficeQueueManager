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

/* Deprecated
Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
              a.splice(j--, 1);
      }
  }

  return a;
};

// GET services
app.get('/api/services/all', async (req, res) => {
  try {
    const result = await officeDao.getServicesAll();  
    if (result.err)
      res.status(404).json(result);
    else {
      const list = [];
      result.forEach(async (r) => {
        const s = await JSON.parse(r.services);
        if(s != null) list.push(...s);
      });
      const uniqueList = await list;
      res.json(uniqueList.unique());
    }
  } catch (err) {
    res.status(500).end();
  }
});
*/

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

/*** User APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
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

