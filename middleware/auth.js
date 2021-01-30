module.exports = {
    ensureAuth: function(req, res, next){
        if(req.isAuthenticated()){ // check if user is authenticated 
            return next() // continue 
        }
        else{
            res.redirect('/')
        }
    },
    ensureGuest: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/dashboard')
        }
        else{
            return next()
        }
    }
}