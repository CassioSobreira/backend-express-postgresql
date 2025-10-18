import express from 'express';
import dotenv from 'dotenv';
import db from '../database/configdb.js';
import User from '../models/User.js';


dotenv.config();
db.connectDB();


const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello, Express!' });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
