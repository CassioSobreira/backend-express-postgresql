import express, { Express, Request, Response } from 'express';
import 'dotenv/config';
import connectDB from './database/configdb';
import authRoutes from './routes/authRoutes';


connectDB();


const app: Express = express();

app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.status(200).send({ message: 'API de Autenticação está funcionando!' });
});


app.use('/api/auth', authRoutes);


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor está rodando na porta http://localhost:${PORT}/`);
});

