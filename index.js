import express from 'express';
import { config } from 'dotenv';
config();
import ContenedorRoutes from './routes/contenedor/route.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

app.use("/api/contenedor", ContenedorRoutes);

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "");
})
