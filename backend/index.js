const express    = require('express');
const app        = express();
const path       = require('path')
const mysql      = require('mysql')
const session    = require('express-session')
const MySqlStore = require('express-mysql-session')(session)
const Router     = require('./Router')
const cors       = require('cors')

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: false}))

const port = process.env.PORT || 4000;

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'admin1234',
    password : 'admin1234',
    database : 'login'
});

db.connect(err => {
    if(err) {
        console.log('Error in DB');
        throw err;
        return false;
    }
})

const sessionStore =  new MySqlStore({
    expiration: (1825 * 86400 * 1000),
    endConnectionOnClose: false
}, db);

app.use(session({
    key: 'kjkaksdsad',
    secret: 'slkndsflkajhdfnlaskn',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: (1825 * 86400 * 1000),
        httpOnly: false 
    }
}));

new Router(app, db);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
});

app.listen(port, console.log("server started on port: ", port ))
