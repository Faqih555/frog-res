const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const collection = require("./mongodb")
const app = express()
const port = 3000

app.use(express.json())
// gunakan ejs
app.set('view engine', 'ejs')
// third-party middleware
app.use(expressLayouts)
// built-in middleware
app.use(express.urlencoded({extended:false}))
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

  app.post('/register', async (req, res) =>{
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    await collection.insertMany([data])

    res.render('login',{
      layout: 'layouts/main-layouts',
    })

  })
  
  app.post('/login', async (req, res) =>{
    
    try{
      const check = await collection.findOne({name: req.body.name})

      if(check.password === req.body.password){
        res.render('index',{
          layout: 'layouts/main-layouts',
        })
      }else{
        res.send('password anda salah')
      }

    }catch{
      res.send("wrong details")
    }
  })
  
  app.get('/dart', (req, res) => {
    res.render('dart', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/dart.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
  
  app.get('/cplusplus', (req, res) => {
    res.render('cplusplus', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/cplusplus.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/csharp', (req, res) => {
    res.render('csharp', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/csharp.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })

  app.get('/java', (req, res) => {
    res.render('java', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/java.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/js', (req, res) => {
    res.render('js', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/javascript.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/perl', (req, res) => {
    res.render('perl', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/perl.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })

  app.get('/php', (req, res) => {
    res.render('php', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/php.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/python', (req, res) => {
    res.render('python', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/python.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/r', (req, res) => {
    res.render('r', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/r.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
 
  app.get('/ruby', (req, res) => {
    res.render('ruby', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/ruby.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
  
  app.get('/swift', (req, res) => {
    res.render('swift', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/swift.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
  
  app.get('/ts', (req, res) => {
    res.render('ts', {
      layout: 'layouts/main-layouts',
      side: 'layouts/side-bar',
      img: '/logo/typescript.png',
      subMenuDasar1: 'Flex',
      subMenuDasar2: 'Margin',
      subMenuDasar3: 'lol',
      subMenuMahir1: 'lol',
      subMenuMahir2: 'Grid',
      subMenuMahir3: 'Padding',
    })
  })
  
  
  
  app.use('/', (req, res) => {
    res.status(404)
    res.send('<h1> 404 <h1>')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
  