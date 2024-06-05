// Components
const routs = require("express").Router()
const session = require("express-session")
const ModelUsers = require("./mysql/models/Users")
const ModelProducts = require("./mysql/models/Products")


// Routs GET
routs.get("/", (req, res) => {
          res.render("login")
})

routs.get("/inicio", (req, res) => {
          res.render("home", {session: req.session.userId})
})

routs.get("/logar", (req, res) => {
          res.render("logar")
})

routs.get("/produtos", (req, res) => {
          let prod = new ModelProducts(req.body, null)

          prod.getProducts(1).then((val) => {

                    if(val) {
                              res.render("my_products", {products: prod.product})

                    } else {
                              res.render("my_products")
                    }
          })
})

routs.get("/produtos/cadastrar", (req, res) => {
          res.render("produtos", {id: req.session.userId})
})

routs.get("/session", (req, res) => {
          let user = new ModelUsers(req.body);
          // Veryfi secssion
          if(req.session.userId) {
                    user.Session(req.session.userId)
                    .then((val) => {
                              if(val) {
                                        res.status(200).json({ isLoggedIn: true });

                              } else {
                                        req.flash("erro", "Usuário não existe!")
                                        res.status(200).json({ isLoggedIn: false });
                              }
                    })
                    .catch(() => {
                              req.flash("erro", "Erro ao buscar usuário!")
                    })
          }
})

// Routs POST
routs.post("/login", (req, res) => {

          let user = new ModelUsers(req.body);

                    user.Login()
                    .then((val) => {

                              if(val) {
                                        req.session.userId = user.user.id;
                                        res.redirect("/inicio")
                              } else {
                                        req.flash("erro", `${user.erros}`)
                                        res.redirect("/")
                              }
                    })
                    .catch(() => {
                              req.flash("erro", "Erro ao buscar usuário!")
                              res.redirect("/")
                    })
})

routs.post("/salvar/usuario", (req, res) => {

          let user = new ModelUsers(req.body);

          user.CreateUser().then((val) => {

                    if(val) {
                              req.flash("success", "Usuário criado com sucesso!")
                              res.redirect("/")

                    } else {
                              req.flash("erro", `${user.erros}`)
                              res.redirect("/logar")
                    };
          }).catch(() => {

                    req.flash("erro", "Erro ao criar usuário!")
                    res.redirect("/logar")

          })

});

routs.post("/salvar/produto",(req, res) => {

          let prod = new ModelProducts(req.body, req.files.image.name)

          let date = new Date().getTime()

          prod.AddProduct().then((val) => {
                    if(val) {
                              req.files.image.mv("../public/img/products/" + `${date}_${prod.body.seller}_${req.files.image.name}`)

                              req.flash("success", "Produto adicionado com sucesso!")
                              res.redirect("/produtos")

                    } else {
                              req.flash("erro", `Não foi possível adicionar o produto`)
                              res.redirect("/produtos")
                    }

          }).catch(() => {

                    req.flash("erro", "Erro ao cadastrar produto!")
                    res.redirect("/produtos")

          })
})

module.exports = routs;