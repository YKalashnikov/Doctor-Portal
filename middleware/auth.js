module.exports = {
   authOwner:function(req, res, next) {
     if(req.isAuthenticated()){
         return next()
     } else {
        res.redirect('/')
     }
   },
   authGuest:function(req, res, next) {
    if(req.isAuthenticated()){
        res.redirect('/dashboard')
    } else {
        return next()
    }
  }
}