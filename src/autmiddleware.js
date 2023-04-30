exports.requireLogin = (req, res, next)=>{
    if(req.session.userId){
        return next()
    } else {
        res.redirect("login")
    }
}


exports.checkAuth = (req, res, next) =>{
    if (req.url === '/login') {
        return next();
      }
    if (req.session.userId) {
      res.locals.isLoggedIn = true;
    } else {
      res.locals.isLoggedIn = false;
    }
    next();
  }
