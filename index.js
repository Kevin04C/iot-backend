import express from 'express';
import { config } from 'dotenv';
import cors from 'cors'
config();
import ContenedorRoutes from './routes/contenedor/route.js';

const PORT = process.env.PORT || 4500;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/contenedor", ContenedorRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "");
})
