const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  logging: false,
});

const User = sequelize.define('User', {
  name: {
    type: Sequelize.DataTypes.STRING,
    unique: true,
  }
});

module.exports = {
  Sequelize,
  sequelize,
  User
}

/*

var client = new Client({
  user : 'postgres',
  host : 'db.wbzljzporgczzxlxxftk.supabase.co',
  database : 'postgres',
  password : 'dMoLwdJs4FMMQpJs',
  port : 5432,
})

 */