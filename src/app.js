require('dotenv').config()
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const {collection, upload} = require("./mongodb");
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const session = require("express-session");

const app = express();
const port = 3000;

// middleware
app.use(express.json());
app.use(expressLayouts);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret-key", // Kunci rahasia untuk menyimpan session
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layouts",
  });
});

app.get("/ebook", (req, res) => {
  res.render("ebook", {
    layout: "layouts/main-layouts",
  });
});

app.get("/login", (req, res) => {
  res.render("login", {
    layout: "layouts/main-layouts",
  });
});

app.get("/register", (req, res) => {
  res.render("register", {
    layout: "layouts/main-layouts",
  });
});

app.post(
  "/register",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong");
      }
      return true;
    }),
    body("email").custom(async (value) => {
      if (value == "") {
        throw new Error("email tidak boleh kosong");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong");
      }
      return true;
    }),
    body("name").custom(async (value) => {
      const duplikat = await collection.findOne({ name: value });
      if (duplikat) {
        throw new Error("nama sudah terdaftar");
      }
      return true;
    }),
    body("email").custom(async (value) => {
      const duplikat = await collection.findOne({ email: value });
      if (duplikat) {
        throw new Error("email sudah terdaftar");
      }
      return true;
    }),
    check("email", "invalid email address").isEmail(),
    check("password", "minimum password legth is 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10); // Melakukan hashing password dengan bcryptjs
    const data = {
      name: name,
      email: email,
      password: hashedPassword, // Menggunakan password yang sudah di-hash
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("register", {
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } else {
      await collection.insertMany([data]);

      res.render("login", {
        layout: "layouts/main-layouts",
      });
    }
  }
);

app.post(
  "/login",
  [
    body("name").custom(async (value) => {
      if (value == "") {
        throw new Error("nama tidak boleh kosong");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      if (value == "") {
        throw new Error("password tidak boleh kosong");
      }
      return true;
    }),
    body("name").custom(async (value) => {
      const user = await collection.findOne({ name: value });
      if (!user) {
        throw new Error("nama belum terdaftar");
      }
      return true;
    }),
    body("password").custom(async (value) => {
      const user = await collection.findOne({ password: value });
      if (!user) {
        throw new Error("password anda salah");
      }
      return true;
    }),
  ],
  async (req, res) => {
    const {name, password} = req.body

    const datauser = await collection.findOne({$or: [{name: name}, {email: name}]})
    if(datauser){
      const passwordUser = await bcryptjs.compare(password, datauser.password)
      if(passwordUser){
        const data ={
          id: datauser._id
        }
        const token = await jsonwebtoken.sign(data, process.env.JWS_SECRET)
        return res.render("index", {
          layout: "layouts/main-layouts",
          token: token
        });
      }
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() });
      res.render("login", {
        layout: "layouts/main-layouts",
        errors: errors.array(),
      });
    } 
  }
);

app.get("/dart", async (req, res) => {
  req.session.source = 'dart' // Set nilai session "source" menjadi "dart"
  let source = req.session.source

  const artikel = await upload.findOne({source})
  res.render("dart", {
    artikel,
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
  })
})

app.get("/cplusplus", async (req, res) => {
  req.session.source = 'cplusplus'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("cplusplus", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/csharp", async(req, res) => {
  req.session.source = 'csharp'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("csharp", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/java", async(req, res) => {
  req.session.source = 'java'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("java", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/js", async(req, res) => {
  req.session.source = 'js'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("js", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/perl", async(req, res) => {
  req.session.source = 'perl'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("perl", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/php", async(req, res) => {
  req.session.source = 'php'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("php", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/python", async(req, res) => {
  req.session.source = 'python'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("python", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/r", async(req, res) => {
  req.session.source = 'r'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("r", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/ruby", async(req, res) => {
  req.session.source = 'ruby'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("ruby", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    artikel,
    source,
  })
})

app.get("/swift", async(req, res) => {
  req.session.source = 'swift'

  let source = req.session.source
  const artikel = await upload.findOne({source})

  res.render("swift", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
    artikel,
  })
})

app.get("/ts", async (req, res) => {
  req.session.source = 'ts'

  let source = req.session.source
  const artikel = await upload.findOne({source})
  res.render("ts", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
    artikel,
  })
})

app.get("/upload", async (req, res) => {
  let source = req.session.source

  const artikel = await upload.findOne({source})
  res.render("upload", {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
    artikel,
  })
})

app.post("/upload", async (req, res) => {
  const { judul, konten } = req.body;

  let source = req.session.source || ""; // Mendapatkan nilai variabel 'source' dari session

  const data = {
    judul,
    konten,
    source: source,
  };
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    const artikel = upload.findOne({source})
    res.render("upload", {
      layout: "layouts/main-layouts",
      side: "layouts/side-bar",
      artikel,
      errors: errors.array(),
    });
  } else {
    await upload.insertMany([data]);

    const artikel = await upload.findOne({source})
    res.render(source, {
      layout: "layouts/main-layouts",
      side: "layouts/side-bar",
      source,
      artikel,
    });
  }
});

app.get('/:source/:judul', async (req, res) => {
  const source = req.params.source || req.session.source; // mengambil nilai dari parameter path atau dari req.session.source jika tidak ada parameter path
  const artikel = await upload.findOne({source})
  res.render('konten', {
    layout: "layouts/main-layouts",
    side: "layouts/side-bar",
    source,
    artikel,
  })
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1> 404 <h1>");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
