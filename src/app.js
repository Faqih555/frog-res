require('dotenv').config()
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const { body, validationResult, check } = require("express-validator")
const {collection, upload, bahasa} = require("./mongodb")
const {requireLogin, checkAuth} = require("./autmiddleware")
const {addFirstCharToLocals} = require("./firstchar")
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const session = require("express-session")
const app = express()
const port = 3000


app.use(express.json())
app.use(expressLayouts)
app.use(express.static("public"))
app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: false }))
app.use(
  session({
    secret: "secret-key", // Kunci rahasia untuk menyimpan session
    resave: false,
    saveUninitialized: false,
  })
)
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.userId != null;
  next();
});
app.use(addFirstCharToLocals)


app.get("/", async (req, res) => {
  const source = req.session.source
  const search = await bahasa.find({})
  const artikels = await upload.find().sort({ tanggal: -1 }).limit(5).exec();

  res.render("index", {
    layout: "layouts/main-layouts",
    search,
    source,
    artikels,
    background: "bg-[#343131]",
    searched: false,
  })
})

app.get("/ebook", (req, res) => {
  res.render("ebook", {
    layout: "layouts/main-layouts",
    background: "bg-[#584E4E]",
  })
})

app.get("/login",  (req, res) => {
  res.render("login", {
      searched: false,
      isLoggedIn: req.session.userId != null,
      layout: "layouts/main-layouts",
      background: "bg-[#343131]",
  })
})

app.get("/register", (req, res) => {
  res.render("register", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
  })
})

app.post(
  "/register",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong")
      }
      return true
    }),
    body("email").custom(async (value) => {
      if (value == "") {
        throw new Error("email tidak boleh kosong")
      }
      return true
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong")
      }
      return true
    }),
    body("name").custom(async (value) => {
      const duplikat = await collection.findOne({ name: value })
      if (duplikat) {
        throw new Error("nama sudah terdaftar")
      }
      return true;
    }),
    body("email").custom(async (value) => {
      const duplikat = await collection.findOne({ email: value })
      if (duplikat) {
        throw new Error("email sudah terdaftar")
      }
      return true
    }),
    check("email", "invalid email address").isEmail(),
    check("password", "minimum password legth is 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body
    const hashedPassword = await bcryptjs.hash(password, 10) // Melakukan hashing password dengan bcryptjs
    const data = {
      name: name,
      email: email,
      password: hashedPassword, // Menggunakan password yang sudah di-hash
    };
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.render("register", {
        layout: "layouts/main-layouts",
        background: "bg-[#343131]",
        errors: errors.array(),
      })
    } else {
      await collection.insertMany([data])

      res.redirect("login")
    }
  }
)

app.post(
  "/login",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong")
      }
      return true;
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong")
      }
      return true
    }),
    body("name").custom(async (value) => {
      const user = await collection.findOne({ name: value })
      if (!user) {
        throw new Error("nama belum terdaftar")
      }
      return true;
    }),
    body("password").custom(async (value) => {
      const user = await collection.findOne({ password: value })
      if (!user) {
        throw new Error("password anda salah")
      }
      return true
    }),
  ],
  async (req, res) => {
    const {name, password} = req.body

    const datauser = await collection.findOne({$or: [{name: name}, {email: name}]})
    
    if(datauser){
      const passwordUser = await bcryptjs.compare(password, datauser.password)
      req.session.userId = datauser.id
      if(passwordUser){
        const data ={
          id: datauser._id
        }
        req.session.name = datauser.name
        req.session.email = datauser.email
        const token = await jsonwebtoken.sign(data, process.env.JWS_SECRET)
        return res.redirect("/")
      }
    }
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("login", {
        layout: "layouts/main-layouts",
        background: "bg-[#343131]",
        errors: errors.array(),
      })
    } 
  }
)

app.get("/dart", async (req, res) => {
  req.session.source = 'dart' // Set nilai session "source" menjadi "dart"
  let source = req.session.source
  req.session.namaBahasa = 'DART'

  let namaBahasa = req.session.namaBahasa 
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})
  res.render("dart", {
    artikel,
    namaBahasa,
    artikels,
    background: "bg-[#343131]",
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
  })
})

app.get("/cplusplus", async (req, res) => {
  req.session.source = 'cplusplus'
  req.session.namaBahasa = 'C++'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("cplusplus", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/csharp", checkAuth, async(req, res) => {
  req.session.source = 'csharp'
  req.session.namaBahasa = 'c#'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("csharp", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/java", async(req, res) => {
  req.session.source = 'java'
  req.session.namaBahasa = 'JAVA'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("java", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    namaBahasa,
    artikel,
    artikels, 
    source,
  })
})

app.get("/javascript", async(req, res) => {
  req.session.source = 'javascript'
  req.session.namaBahasa = 'JAVASCRIPT'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("javascript", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/perl", async(req, res) => {
  req.session.source = 'perl'
  req.session.namaBahasa = 'PERL'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("perl", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    namaBahasa,
    artikel,
    artikels,
    source,
  })
})

app.get("/php", async(req, res) => {
  req.session.source = 'php'
  req.session.namaBahasa = 'PHP'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("php", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/python", async(req, res) => {
  req.session.source = 'python'
  req.session.namaBahasa = 'PYTHON'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("python", {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    side: "layouts/side-bar",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/r", async(req, res) => {
  req.session.source = 'r'
  req.session.namaBahasa = 'R'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("r", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    artikel,
    artikels,
    namaBahasa,
    source,
  })
})

app.get("/ruby", async(req, res) => {
  req.session.source = 'ruby'
  req.session.namaBahasa = 'RUBY'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})

  res.render("ruby", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    artikel,
    namaBahasa,
    artikels,
    source,
  })
})

app.get("/swift", async(req, res) => {
  req.session.source = 'swift'
  req.session.namaBahasa = 'SWIFT'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})
  res.render("swift", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    source,
    namaBahasa,
    artikel,
    artikels,
  })
})

app.get("/typescript", async (req, res) => {
  req.session.source = 'typescript'
  req.session.namaBahasa = 'TYPESCRIPT'

  let namaBahasa = req.session.namaBahasa 
  let source = req.session.source
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})
  res.render("typescript", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    namaBahasa,
    source,
    artikel,
    artikels,
  })
})

app.get("/upload", checkAuth, requireLogin, async (req, res) => {
  let namaBahasa = req.session.namaBahasa
  let source = req.session.source
  let penulis = req.session.name
  const artikels = await upload.find({source}).lean()
  const artikel = await upload.findOne({source})
  res.render("upload", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    namaBahasa,
    source,
    penulis,
    artikel,
    artikels,
  })
})

app.post("/upload", checkAuth, requireLogin, async (req, res) => {
  const { judul, konten } = req.body;

  let source = req.session.source || "" // Mendapatkan nilai variabel 'source' dari session
  let penulis = req.session.name || ""

  const data = {
    judul,
    konten,
    source,
    penulis
  };
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    const artikel = await upload.findOne({source})
    const artikels = await upload.find({source})
    res.render("upload", {
      layout: "layouts/main-layouts",
      side: "layouts/side-bar",
      background: "bg-[#343131]",
      artikel,
      artikels,
      errors: errors.array(),
    });
  } else {
    await upload.insertMany([data])
    const artikels = await upload.find({source}).lean()
    const artikel = await upload.findOne({source})
    res.redirect(source)
  }
})

app.get('/:source/:judul', async (req, res) => {
  let namaBahasa = req.session.nama
  const source = req.params.source || req.session.source // mengambil nilai dari parameter path atau dari req.session.source jika tidak ada parameter path
  const {judul} = req.params
  const artikel = await upload.findOne({judul})
  const artikels = await upload.find({source}).lean()
  res.render('konten', {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    background: "bg-[#343131]",
    source,
    namaBahasa,
    artikel,
    artikels,
  })
})

app.get('/search', async (req, res) => {
  const query = req.query.q; // Mendapatkan query pencarian dari parameter "q" di URL
  const search = await bahasa.find({ nama: new RegExp(query, 'i') })
  const artikels = await upload.find().sort({ createdAt: 'desc' }).limit(5).exec();
  const source = req.session.source

  res.render('index', {
    layout: "layouts/main-layouts",
    background: "bg-[#343131]",
    artikels,
    source,
    query,
    search,
    searched: true,
  })
})

app.get('/logout', (req, res) => {
  const { name, email } = req.session;
  res.render('logout', {
    layout: "layouts/main-layouts",
    background: "bg-black",
    name,
    email,
  })
})

app.post("/logout", checkAuth, (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

app.use("/", (req, res) => {
  res.status(404)
  res.send("<h1> 404 <h1>")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
