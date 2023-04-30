exports.addFirstCharToLocals = (req, res, next) => {
    if (req.session.name) {
      const firstChar = req.session.name.charAt(0)
      res.locals.firstChar = firstChar
    }
    next()
  }
  
