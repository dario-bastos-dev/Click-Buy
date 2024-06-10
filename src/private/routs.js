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
                              res.render("home", {products: prod.product, cart: req.session.cart})
                    
                    })
                    .catch(err => {
                              throw new Error(err)
                    })

          } else {
                    prod.searchProduct(query)
                    .then(() => {
                              res.render("home", {products: prod.product, cart: req.session.cart})
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
                              res.render("my_products", {products: prod.product, cart: req.session.cart})

                    } else {
                              res.render("my_products")
                    }
          })
})

routs.get("/produtos/cadastrar", (req, res) => {
          res.render("produtos", {id: req.session.userId})
})

routs.get("/produto/:id", (req, res) => {
          let id = req.query.id;

          let prod = new ModelProducts()

          prod.Product(id)
          .then(val => {
                    if(val) res.render("view_produto", {product: prod.product, cart: req.session.cart});

                    else res.redirect("/inicio")

          })
          .catch(err => {
                    req.flash("erro", "Erro ao buscar produto!"+err)
                    res.redirect("/")
          })
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

routs.post("/add-carrinho", (req, res) => {
          let id = req.body.id;
          let quant = req.body.quant;
          let cart = req.session.cart;

          const existingProdut = cart.findIndex(item => {item.id === id})

          if(existingProdut > -1) cart[existingProdut].quant += quant;
          else cart.push({id, quant});

          req.session.cart = cart

          res.status(200).json({ message: 'Produto adicionado ao carrinho', cart });
})

module.exports = routs;