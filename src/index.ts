import 'dotenv/config'; 
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors'; 
console.log('>>> [INDEX] Lendo PORT após dotenv/config:', process.env.PORT);
console.log('>>> [INDEX] Lendo JWT_SECRET após dotenv/config:', process.env.JWT_SECRET ? 'Encontrado!' : 'NÃO ENCONTRADO!');
import { connectDB, sequelize } from './database'; 
import db from './models'; 
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes';

const app: Express = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
  console.log(">>> [INDEX] Rota / ACESSADA!");
  res.send('API de Autenticação e Filmes v1.1 (PostgreSQL/Sequelize) está funcionando!'); 
});


app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(">>> [INDEX] ERRO GLOBAL NÃO TRATADO:", err.stack || err.message || err);
  res.status(err.status || 500).json({
    message: err.message || 'Erro interno inesperado no servidor.',
  });
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`>>> [INDEX] Servidor INICIADO na porta ${PORT}`);
    });
  } catch (error) {
    console.error(">>> [INDEX] FALHA AO INICIAR SERVIDOR:", error);
 process.exit(1); 
 }
};

startServer();