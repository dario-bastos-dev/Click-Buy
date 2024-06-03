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
.then(() => {})


class ModelProducts {
          constructor(body, image) {
                    this.body = body,
                    this.image = image,
                    this.products,
                    this.erros = []
          };
};

module.exports = ModelProducts;