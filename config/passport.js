const googleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    // create a google strategy
    passport.use(new googleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, 
    async (accessToken, refreshToken, profile, done) => {
        // create a new user object
        const newUser = { 
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value // get the first image from the array of photos
        }
        
        try {
            let user = await User.findOne({
                googleId: profile.id //find a user by their google id
            })
            if(user){ // check if a user exists
                done(null, user)
            }
            else{
                user = await User.create(newUser) //create a user using newUser object
                done(null, user)
            }
        } catch (err) {
            console.error(err)
        }

    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
      })
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user))
      })
}







