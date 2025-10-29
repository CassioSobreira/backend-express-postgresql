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
    console.log(`>>> [MODELS] Configurando associações para ${model.name}`);
    model.associate(db);
  }
});

console.log('>>> [MODELS] Modelos Sequelize inicializados e associados.');

export default db;

