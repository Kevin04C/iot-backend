import express from 'express';
import { config } from 'dotenv';
config();

const PORT = environment.PORT || 3000;

const app = express();
app.use(express.json());


app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT + "");
})