const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = 3000

// gunakan ejs
app.set('view engine', 'ejs')

// third-party middleware
app.use(expressLayouts)

// built-in middleware
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('index', {
      layout: 'layouts/main-layouts',
    })
  })

  app.get('/ebook', (req, res) => {
    res.render('ebook', {
      layout: 'layouts/main-layouts',
    })
  })

  app.get('/login', (req, res) => {
    res.render('login', {
      layout: 'layouts/main-layouts',
    })
  })
  
  app.get('/register', (req, res) => {
    res.render('register', {
      layout: 'layouts/main-layouts',
    })
  })
  
  app.get('/dart', (req, res) => {
    res.render('dart', {
      layout: 'layouts/main-layouts',
    })
  })
  
  app.get('/cplusplus', (req, res) => {
    res.render('cplusplus', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/csharp', (req, res) => {
    res.render('csharp', {
      layout: 'layouts/main-layouts',
    })
  })

  app.get('/java', (req, res) => {
    res.render('java', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/js', (req, res) => {
    res.render('js', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/perl', (req, res) => {
    res.render('perl', {
      layout: 'layouts/main-layouts',
    })
  })

  app.get('/php', (req, res) => {
    res.render('php', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/python', (req, res) => {
    res.render('python', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/r', (req, res) => {
    res.render('r', {
      layout: 'layouts/main-layouts',
    })
  })
 
  app.get('/ruby', (req, res) => {
    res.render('ruby', {
      layout: 'layouts/main-layouts',
    })
  })
  
  app.get('/swift', (req, res) => {
    res.render('swift', {
      layout: 'layouts/main-layouts',
    })
  })
  
  app.get('/ts', (req, res) => {
    res.render('ts', {
      layout: 'layouts/main-layouts',
    })
  })
  
  
  
  app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1> 404 <h1>')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  