// Components
const express = require("express")
const app = express()
const {engine} = require("express-handlebars")
const db = require("./mysql/db")
const session = require("express-session")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
const fileUpload = require('express-fileupload')
const path = require("path")

//Config ---
// Active file-upload
app.use(fileUpload());

// Active Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Active Session and Flash
app.use(session({
          secret: 'jk1234uh25@gsafkjg%3ASDF',
          resave: false,
          saveUninitialized: false,
          cookie: { secure: false, maxAge: 1000*60*60*24*7 }
        }))
app.use(flash())

// Database MySQL
db.authenticate()
.then(() => {
          console.log("Banco de dados conectado!")
}).catch((err) => {
          console.log(`ocorreu o erro: ${err}`)
})


// Active Handlebars
app.engine(".hbs", engine({defaultLayout: "main", extname: ".hbs"}))
app.set("view engine", ".hbs")
app.set("views", "./views")

// Static archive
app.use(express.static(path.join(__dirname, "../public")))


// Middlewares ---
// Conect Flas
app.use((req, res, next) => {
  res.locals.erro = req.flash("erro")
  res.locals.success = req.flash("success")

  next()
})

// Validar session
app.use((req, res, next) => {
  
if(req.path === "/logar" || req.path === "/" || req.path === "/login" || req.path === "/salvar/usuario") return next();

else {

if(req.session.userId) return next();

else res.redirect("/")

}

})

// Routs archive
app.use("/", require("./routs"))

// Active server
app.listen(8080, (err) => {
          if(err) {
                    console.log(`Houve o erro: ${err}`)
          } else {
                    console.log("Servidor ativo!")
          }
})