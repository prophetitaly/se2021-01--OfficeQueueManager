'use strict';

const sqlite = require('sqlite3');

// open the database
const db = new sqlite.Database('officeDB.db', (err) => {
  if (err) throw err;
});



// get all counters
exports.getCounterInfo = () => {
  return new Promise((resolve, reject) => {
    
    const sql = 'SELECT * FROM management WHERE services!=?';
    db.all(sql, ["null"] ,(err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((t) => ({ id: t.id, username: t.username, services: t.services }));
      resolve(tasks);
    });
  });
};



// get all counters
exports.getServices = () => {
  return new Promise((resolve, reject) => { 
    const sql = 'SELECT * FROM services';
    db.all(sql ,(err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const tasks = rows.map((t) => ({ service: t.service, extimatedTime: t.extimatedTime }));
      resolve(tasks);
    });
  });
};