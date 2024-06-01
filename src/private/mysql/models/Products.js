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
          value: {
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

module.exports = Products;