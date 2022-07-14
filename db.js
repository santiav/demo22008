const mysql = require('mysql');
require('dotenv').config()
// https://github.com/mysqljs/mysql

var conn = mysql.createConnection({
  host     : 'bqg0vqgdtw3fgq37gwoy-mysql.services.clever-cloud.com',
  user     : 'ufwqfm7hv2wkggxk',
  password : 'KeMjtk6AFAQ1TKAL5X98',
  database : 'bqg0vqgdtw3fgq37gwoy'
});

conn.connect(err => {
    if (err) throw err
    console.log('DB esta conectada')
});

setInterval(function () {
    conn.query('SELECT 1');
    console.log("manteniendo viva la conexion")
}, 50000);


module.exports = conn;