import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); 


const env = process.env.NODE_ENV || 'development';
console.log(`>>> [SEQUELIZE] Usando ambiente: ${env}`); 


const configObject = require('../../config/config.cjs'); 

if (!configObject[env]) {
  console.error(`>>> [SEQUELIZE] Erro: Configuração para o ambiente '${env}' não encontrada em config/config.cjs.`);
  process.exit(1);
}

const config = configObject[env];

let sequelize: Sequelize;


if (config.use_env_variable) {
  const dbUrl = process.env[config.use_env_variable];
  console.log(`>>> [SEQUELIZE] Tentando conectar usando ${config.use_env_variable}...`);
  if (!dbUrl) {
    console.error(`>>> [SEQUELIZE] Erro: Variável de ambiente ${config.use_env_variable} não definida.`);
    throw new Error(`Variável de ambiente ${config.use_env_variable} não definida.`);
  }
  
  sequelize = new Sequelize(dbUrl, config);
} else {

  console.log(`>>> [SEQUELIZE] Tentando conectar usando credenciais separadas...`);
  if (!config.database || !config.username) {
     console.error(">>> [SEQUELIZE] Erro: Falta database, username ou password na configuração de desenvolvimento.");
     process.exit(1);
  }
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password, 
    config 
  );
}

const connectDB = async () => {
  try {
    await sequelize.authenticate(); 
    console.log('>>> [SEQUELIZE] Conexão com PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('>>> [SEQUELIZE] Incapaz de conectar ao banco de dados:', error);
    
    throw error; 
  }
};

export { sequelize, connectDB };

