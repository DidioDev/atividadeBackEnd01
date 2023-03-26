import express, { response } from 'express';
import { router } from './router/index';

const server = express();
const port = 3000; //DEFININDO A PORTA DO SERVIDOR;

//INTERCEPTADOR DE DADOS;
server.use(express.json());
server.use(router)

//PRECISA DE UMA PORTA E UMA FUNÇÃO CALLBACK;
server.listen(port, () => {
  console.log(`Servidor ligado - URL: http://localhost:${port}`);

});
