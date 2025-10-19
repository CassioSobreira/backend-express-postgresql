import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('ERRO: A variável de ambiente MONGO_URI não foi definida.');
      process.exit(1);
    }
    
    
    const options = {
      dbName: process.env.MONGO_DB_NAME,
    };

    await mongoose.connect(mongoURI, options);
    console.log('MongoDB conectado com sucesso.');

  } catch (error: any) { 
    console.error('Erro na conexão com o MongoDB:', error.message);
    process.exit(1); 
  }
};


export default connectDB;
