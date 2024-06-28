import express from 'express'
import { Router } from 'express';

import usuariosRouter from './routes/usuarios';
import esportesRouter from './routes/esportes';



const app = express();
const port = 3001;

app.use(express.json());
app.use('/usuarios', usuariosRouter);
app.use('/esportes', esportesRouter);



app.get('/', (req, res) => {
  res.send('API de agenda de quadras!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta:${port}`)
})

