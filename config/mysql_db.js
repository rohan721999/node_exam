const mysql = require('mysql');

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'deep70',
    database:'node_app'
})

const connection = con.connect();

module.exports = connection;