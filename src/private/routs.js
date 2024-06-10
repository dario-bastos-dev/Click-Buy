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
          let search = req.query.search
          let query = '%'+search+'%'
          let prod = new ModelProducts()
          
          if(!search) {
                    prod.allProducts()
                    .then(() => {
                              res.render("home", {products: prod.product})
                    
                    })
                    .catch(err => {
                              throw new Error(err)
                    })

          } else {
                    prod.searchProduct(query)
                    .then(() => {
                              res.render("home", {products: prod.product})
                    })
          }
})

routs.get("/logar", (req, res) => {
          res.render("logar")
})

routs.get("/produtos", (req, res) => {
          let prod = new ModelProducts()

          prod.myProducts(req.session.userId).then((val) => {

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

routs.post("/logout", (req, res) => {
          
          req.session.destroy(err => {
                    if(err) {
                              return res.status(500).send('Não foi possível deslogar');

                    } else {
                    res.clearCookie("sessionId")

                    res.status(200).send('Deslogado com sucesso');
          }
          })
})

module.exports = routs;