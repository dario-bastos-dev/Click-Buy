const Sequelize = require("sequelize")
const db = require("../db")

// Create table
const Products = db.define("products", {
          image: {
                    type: Sequelize.STRING,
                    allowNull: false
          },
          name: {
                    type: Sequelize.STRING,
                    allowNull: false
          },
          description: {
                    type: Sequelize.STRING,
                    allowNull: false
          },
          category: {
                    type: Sequelize.STRING,
                    allowNul: false
          },
          price: {
                    type: Sequelize.STRING,
                    allowNul: false
          },
          amount: {
                    type: Sequelize.STRING,
                    allowNul: false
          },
          seller: {
                    type: Sequelize.STRING,
                    allowNul: false
          }
})

Products.sync({force:false})
.then(() => {console.log("Tabela de produtos conectada")})


class ModelProducts {
          constructor(body, image) {
                    this.body = body,
                    this.image = image,
                    this.product,
                    this.erros = []
          };

          async AddProduct() {
                    try {
                              let date = new Date().getTime()

                    this.product = await Products.create({
                              image: `${date}_${this.body.seller}_${this.image}`,
                              name: this.body.name,
                              description: this.body.description,
                              category: this.body.category,
                              price: this.body.price,
                              amount: this.body.amount,
                              seller: this.body.seller
                    })

                    if(this.product) return true;

          } catch(e) {
                    throw new Error(e);
           }

          };

          async getProducts(session) {

                    this.product = await Products.findAll(
                              {where: {seller: session}}
                    )

                    if(this.product) return true;

          }

};

module.exports = ModelProducts;