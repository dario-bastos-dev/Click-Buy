// Components
const routs = require("express").Router();
const ModelUsers = require("./mysql/models/Users");
const ModelProducts = require("./mysql/models/Products");

// Routs GET
routs.get("/", (req, res) => {
  res.render("login");
});

routs.get("/inicio", (req, res) => {
  let search = req.query.search;
  let query = "%" + search + "%";
  let prod = new ModelProducts();

  if (!search) {
    prod
      .allProducts()
      .then(() => {
        res.render("home", { products: prod.product, cart: req.session.cart });
      })
      .catch((err) => {
        throw new Error(err);
      });
  } else {
    prod.searchProduct(query).then(() => {
      res.render("home", { products: prod.product, cart: req.session.cart });
    });
  }
});

routs.get("/logar", (req, res) => {
  res.render("logar");
});

routs.get("/produtos", (req, res) => {
  let prod = new ModelProducts();

  prod.myProducts(req.session.userId).then((val) => {
    if (val) {
      res.render("my_products", {
        products: prod.product,
        cart: req.session.cart,
      });
    } else {
      res.render("my_products");
    }
  });
});

routs.get("/produtos/cadastrar", (req, res) => {
  res.render("produtos", { id: req.session.userId });
});

routs.get("/produto/:id", (req, res) => {
  let id = req.params.id;

  let prod = new ModelProducts();

  prod
    .Product(id)
    .then((val) => {
      if (val)
        res.render("view_produto", {
          product: prod.product,
          cart: req.session.cart,
        });
      else res.redirect("/inicio");
    })
    .catch((err) => {
      req.flash("erro", "Erro ao buscar produto!" + err);
      res.redirect("/");
    });
});

routs.get("/carrinho", (req, res) => {

    let cart = req.session.cart;
    let prod = new ModelProducts();

    if (!cart) res.render("carrinho");

    else {
      const cartItens = cart.map(async (item) => {

       await prod.Product(item.id);

       let num1 = parseFloat(prod.product.price)
       let num2 = parseFloat(item.quant)
       let totalPrice = num1*num2

       return await {
          ...item,
          image: prod.product.image,
          name: prod.product.name,
          description: prod.product.description,
          price: prod.product.price,
          total: totalPrice.toString().replace(".", ".")
       };

      })

      Promise.all(cartItens)
      .then(result => res.render("carrinho", {products: result}) )

      

    }

});

// Routs POST
routs.post("/login", (req, res) => {
  let user = new ModelUsers(req.body);

  user
    .Login()
    .then((val) => {
      if (val) {
        req.session.userId = user.user.id;
        res.redirect("/inicio");
      } else {
        req.flash("erro", `${user.erros}`);
        res.redirect("/");
      }
    })
    .catch((err) => {
      console.log(err)
      req.flash("erro", "Erro ao buscar usuário!");
      res.redirect("/");
    });
});

routs.post("/salvar/usuario", (req, res) => {
  let user = new ModelUsers(req.body);

  user
    .CreateUser()
    .then((val) => {
      if (val) {
        req.flash("success", "Usuário criado com sucesso!");
        res.redirect("/");
      } else {
        req.flash("erro", `${user.erros}`);
        res.redirect("/logar");
      }
    })
    .catch((err) => {
      console.log(err)
      req.flash("erro", "Erro ao criar usuário!");
      res.redirect("/logar");
    });
});

routs.post("/salvar/produto", (req, res) => {
  let prod = new ModelProducts(req.body, req.files.image.name);

  let date = new Date().getTime();

  prod
    .AddProduct()
    .then((val) => {
      if (val) {
        req.files.image.mv(
          "../public/img/products/" +
            `${date}_${prod.body.seller}_${req.files.image.name}`
        );

        req.flash("success", "Produto adicionado com sucesso!");
        res.redirect("/produtos");
      } else {
        req.flash("erro", `Não foi possível adicionar o produto`);
        res.redirect("/produtos");
      }
    })
    .catch(() => {
      req.flash("erro", "Erro ao cadastrar produto!");
      res.redirect("/produtos");
    });
});

routs.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Não foi possível deslogar");
    } else {
      res.clearCookie("sessionId");

      res.status(200).send("Deslogado com sucesso");
    }
  });
});

routs.post("/add-carrinho", (req, res) => {
  let origin = req.body.origin;
  let id = req.body.id;
  let quant = req.body.quant;
  let cart = req.session.cart;

  let verifyProdut = cart.findIndex((item) => {
    return item.id === id;

  });

  if (verifyProdut > -1) {
          let num1 = parseInt(cart[verifyProdut].quant)
          let num2 = parseInt(quant)
          let quantTotal = num1+num2
          cart[verifyProdut].quant = quantTotal.toString()

  }
  else cart.push({ id, quant });

  req.session.cart = cart;

  if (origin == "form") res.redirect(`/produto/${id}`);
  else res.sendStatus(200);
});

routs.post("/rm-carrinho", (req, res) => {

  let id = req.body.id;
  let quant = req.body.quant;
  let cart = req.session.cart;

  let verifyProdut = cart.findIndex((item) => {
    return item.id === id;
  });

  if (verifyProdut > -1) {

          let num1 = parseInt(cart[verifyProdut].quant)
          let num2 = parseInt(quant)
          let quantTotal = num1-num2
          cart[verifyProdut].quant = quantTotal.toString()

          if(cart[verifyProdut].quant == 0) cart.pop({ id, quant });
  }

  req.session.cart = cart;

  res.redirect(`/carrinho`);
})

module.exports = routs;
