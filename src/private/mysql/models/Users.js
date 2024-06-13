const Sequelize = require("sequelize")
const db = require("../db")
const bcrypt = require("bcryptjs")

// Create table
const Users = db.define("users", {
          photo_perfil: {
                    type: Sequelize.STRING,
                    allowNull: true
          },
          name: {
                    type: Sequelize.STRING,
                    allowNull: false
          },
          lastname: {
                    type: Sequelize.STRING,
                    allowNull: false
          },
          email: {
                    type: Sequelize.STRING,
                    allowNul: false
          },
          password: {
                    type: Sequelize.STRING,
                    allowNul: false
          }
})

Users.sync({force:false})
.then(() => {console.log("Tabela de usuários conectada")})

// Conditions
class ModelUsers {
          constructor(body) {
                    this.body = body;
                    this.user;
                    this.erros = [];
          };

          async AuthCreate() {
                    
                    try {

                              this.user =  await Users.findOne({
                                        where: {email: this.body.email}
                              });

                              if(this.user) this.erros.push("E-mail já cadastrado!");
                              
                    } catch(e) {
                              throw new Error(e);

                    }

          };

          async CreateUser() {

                     try {
                              await this.AuthCreate();

                              if(this.erros.length === 0){

                                        let hashPassword = await bcrypt.hash(this.body.password, 10)

                                        this.user = await Users.create({
                                                  name: this.body.name,
                                                  lastname: this.body.lastname,
                                                  email: this.body.email,
                                                  password: hashPassword
                                        })

                                        return true

                              } else return false;

                     } catch(e) {
                              throw new Error(e);
                     }
          };

          async Login() {

                    try {
                              this.user = await Users.findOne({
                                        where: {email: this.body.email}
                              });

                              if(this.user) {
                                        let validPassword = await bcrypt.compare(this.body.password, this.user.password)

                                        if(validPassword) return true
                                        

                              } else {
                                        this.erros.push("Usuário não cadastrado!")
                                        return false
                              };

                    } catch(e) {
                              throw new Error(e)
                    }

          };

          async Session(userId) {
                    try {
                              this.user = await Users.findByPk(userId);

                              if(this.user) return true;
                              else return false;

                    } catch(e) {
                              throw new Error(e)
                    }
          }
}

module.exports = ModelUsers;