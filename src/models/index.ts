import pg from 'pg'; 
import { Sequelize } from 'sequelize';
import { sequelize } from '../database'; 
import { initUser } from './User';
import { initMovie } from './Movie';


const User = initUser(sequelize);
const Movie = initMovie(sequelize);


const db = {
  sequelize,
  Sequelize,
  User,
  Movie,
};


Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});


export default db;



