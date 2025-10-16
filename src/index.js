import express from 'express';
import dotenv from 'dotenv';


dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: 'Hello, Express!' });
});



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}/`);
});
