const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const User = require('../models/User')
const bcrypt = require('bcrypt')
const config = require('../config')

passport.serializeUser((user, cb) => {
    cb(null, user._id)
})

passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
        if (err) {
            return cb(err)
        }
        const cleanUserObject = user.toObject()

        delete cleanUserObject.password

        cb(null, cleanUserObject)
    })
})

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        (email, password, next) => {
            User.findOne({ email }, (err, user) => {
                if (err) {
                    return next(err)
                }
                if (!user) {
                    return next(null, false, { message: 'Incorrect username' })
                }
                if (!bcrypt.compareSync(password, user.password)) {
                    return next(null, false, { message: 'Incorrect password' })
                }

                return next(null, user)
            })
        }
    )
)

passport.use(
    new GoogleStrategy(
        {
            clientID: config.GOOGLE_CLIENT_ID,
            clientSecret: config.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, next) => {
            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        return next(null, user)
                    }

                    const newUser = new User({ googleId: profile.id, email: profile.emails[0].value })

                    newUser.save().then(user => {
                        next(null, newUser)
                    })
                })
                .catch(error => {
                    next(error)
                })
        }
    )
)
