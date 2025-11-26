const fs = require('fs');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const config = require('./config.js');

module.exports = function (app) {

    // session initialization
    app.use(session({
        secret: '49521cff-f6b6-46d5-8ed6-4428822c1b00',
        resave: false,
        saveUninitialized: true,
        cookie: {
            maxAge: 24 * 60 * 60 * 1000
        }
    }));
    
    app.use(passport.initialize()); // init passport on every route call
    app.use(passport.session());    //allow passport to use 'express-session'

    var authUser = (name, password, done) => {
        const users = config.authenticate.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == name && users[i].password === password)
            return done(null, users[i]);
        }
        return done(null, false);
    };

    passport.use(new LocalStrategy(authUser));

    passport.serializeUser((user, done) => { 
        done(null, user.id)
    });

    passport.deserializeUser((id, done) => {
        const users = config.authenticate.users;
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == id)
            return done(null, users[i]);
        }
        return done(null, false);  
    });

    app.get('/login', (req, res) => {
        const fromTemplate = (template, input) => {
            for (let item in input) {
              template = template.replaceAll(`{${item}}`, input[item]);
            }
            return template;
        }

        const html = fs.readFileSync(`${require.main.path}/${config.folders.assets}/templates/login.html`, 'utf-8');
        const input = {
            show: req.session?.messages ? '' : 'none',
            message: !req.session?.messages ? '' : req.session.messages[req.session.messages.length - 1]
        }
        res.set('Content-Type', 'text/html');
        res.end(fromTemplate(html, input));
    });

    app.get('/logout', (req, res) => {
        req.logOut(() => res.redirect('/login'));
    });
    
    app.post('/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureMessage: 'Invalid user or password. Please try again!'
    }));

    return passport;
}