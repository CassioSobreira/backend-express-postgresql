import express, { Express, Request, Response, NextFunction } from 'express';
import 'dotenv/config';

console.log('>>> [INDEX] Tentando ler PORT do .env:', process.env.PORT);
console.log('>>> [INDEX] Tentando ler JWT_SECRET do .env:', process.env.JWT_SECRET ? 'Encontrado!' : 'NÃO ENCONTRADO!');

import connectDB from './database/configdb';
import authRoutes from './routes/authRoutes';
import movieRoutes from './routes/movieRoutes'; 

const app: Express = express();
const PORT = process.env.PORT || 3001;


connectDB();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req: Request, res: Response) => {
  console.log(">>> [INDEX] Rota / ACESSADA!");
  res.send('API de Autenticação e Filmes v1.1 está funcionando!'); 
});


app.use('/api/auth', authRoutes);   
app.use('/api/movies', movieRoutes); 


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(">>> [INDEX] ERRO GLOBAL NÃO TRATADO:", err.stack || err); 
  res.status(err.status || 500).json({ 
    message: err.message || 'Erro interno inesperado no servidor.',
  });
});

app.listen(PORT, () => {
  console.log(`>>> [INDEX] Servidor INICIADO na porta ${PORT}`);
});

