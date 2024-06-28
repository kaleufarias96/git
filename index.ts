import express from 'express'
import { Router } from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import bcrypt from 'bcrypt';

import usuariosRouter from './routes/usuarios';
import loginsRouter from './routes/login';
import esportesRouter from './routes/esportes';
import quadrasRouter from './routes/quadra';
import agendamentosRouter from './routes/agendamento';

const app = express();
const port = 3002;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

app.use('/usuarios', usuariosRouter);
app.use('/login', loginsRouter);
app.use('/esportes', esportesRouter);
app.use('/quadras', quadrasRouter);
app.use('/agendamentos', agendamentosRouter);


app.get('/', (req, res) => {
  res.send('API de agenda de quadras!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta:${port}`)
})

