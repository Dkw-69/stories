const express = require('express')
const passport = require('passport')
const router = express.Router()

// @desc. authenticate with google
// @route GET /auth/google
router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}))

// @desc. google auth callback
// @route GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/'
}), (req, res) => {
    res.redirect('/dashboard') // only if googleauth successful
})

// @desc. log out the user
// @route GET /auth/logout
router.get('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})


module.exports = router