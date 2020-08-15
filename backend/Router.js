const bcrypt = require('bcrypt')

class Router {  
    constructor(app, db) {
        this.login(app, db);
        this.logout(app, db);
        this.isLoggedIn(app, db);
        this.signup(app, db);
    }

    login(app, db) {
        app.get('/login', (req, res) => {
            res.redirect('/')
        })

        app.post('/login', (req, res) => {
            // console.log(req.body)
            let {email, password} = req.body;
            email = email.toLowerCase();

            let cols = [email];
            db.query('SELECT * FROM users WHERE email = ? LIMIT 1', cols, (err, data, fields) => {
                if(err) {
                    res.json({
                        success: false,
                        msg: "An error occured please try again later"
                    })
                    return;
                }
                if (data && data.length === 1 ) {
                    bcrypt.compare(password, data[0].password, (err, matched) => {  
                        if(matched) {
                            req.session.userID = data[0].id
                            res.json({
                                success: true,
                                username: data[0].username,
                                msg: `Welcome ${data[0].username}`
                            })
                            // res.redirect('/')
                            return
                        }
                        else {
                            res.json({
                                success: false,
                                msg: 'invalid password'
                            })
                        }
                    } )
                }
                else {
                    res.json({
                        success: false,
                        msg: 'User not found'
                    })
                }
            });
        })
    }

    logout(app, db) {
        app.post('/logout', (req, res) => {
            if(req.session.userID) {
                req.session.destroy();
                res.json({
                    success: true
                })
                return true
            }
            else {
                res.json({
                    success: false
                })
                return false
            }
        });
    }

    isLoggedIn(app, db) {
        app.post('/isLoggedIn', (req, res) => {
            if(req.session.userID) {
                let cols = [req.session.userID];
                db.query('SELECT * from users where id = ? LIMIT 1', cols, (err, data, fields) => {
                    if(data && data.length === 1) {
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return true
                    }
                    else {
                        res.json({
                            success: false
                        })
                    }
                })
            }
            else {
                res.json({
                    success: false
                })
            }
        });
    }

    signup(app, db) {
        app.post('/signup', async (req, res) => {
            const hashedpassword = await bcrypt.hash(req.body.password, 10);
            const newUser = {
              username: req.body.username,
              email: req.body.email,
              password: hashedpassword
            }
            let sql = "INSERT INTO users SET ?";
            db.query(sql, newUser, (err, result) => {
              if(err) {
                console.log(`Failed to load your request to database. ${err}`)
              }
            })
            res.redirect('/')
        })
    }
}

module.exports = Router