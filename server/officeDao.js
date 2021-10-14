" use strict ";

const dayjs = require('dayjs');
const db = require('./db');

//get services
exports.getServices = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT services FROM management';
        db.all(sql, [], function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            if (rows !== undefined) {        
                resolve(rows);
            }
            else {
                resolve(null);
            }
        });
    });
};

//get next ticket number
exports.getNextNumber = async () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT max (number) as newTicket FROM tickets WHERE date = ?';
        db.all(sql, [dayjs().format('YYYY-MM-DD')], function (err, rows) {
            if (err) {
                reject(err);
                return;
            }
            if (rows !== undefined) {
                const number = rows[0].newTicket + 1;
                resolve(number);
            }
            else {
                resolve(1);
            }
        });
    });
};

// insert a new ticket
exports.addTicket = async (ticket) => {
    try {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO tickets(number, date, service, counter) VALUES (?, ?, ?, ?)';
            db.run(sql, [ticket.number, dayjs().format('YYYY-MM-DD'), ticket.service, null], function (err) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(ticket.number);
            });
        });
    } catch (err) {
        return;
    }
};