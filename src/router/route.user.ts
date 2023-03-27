import { Router } from "express";
import { Database } from '../database';
import { randomUUID } from 'node:crypto';

//VARIÁVEIS;
const userRoute = Router();
const database = new Database();
const table = "user";

//REQUEST = É TUDO QUE VEM QUANDO O USUÁRIO FAZ A REQUISIÇÃO;
//RESPONSE = É O QUE VOCÊ VAI ENTREGAR PARA O USUÁRIO DEPOIS DE ANALISAR A REQUEST;
userRoute.get('/', (request, response ) => {
  const user = database.select(table);

  response.json(user)
});

userRoute.get('/:id', (request, response) => {
  const { id } = request.params
  const result = database.select(table, id);

  if(result === undefined) response.status(400).json({msg:'Erro! Esse usuário não foi encontrado no sistema.'})

  response.json(result)
});

//MÉTODO DE ADICIONAR USUÁRIO;
userRoute.post('/', (request, response ) => {
  const { nome, cpf, cidade, cep } = request.body;

  const user = {
    id: randomUUID(),
    nome,
    cpf,
    cidade,
    cep,
    saldo: 0,
    transacao: []
  };

  database.insert(table, user);
  response.status(201).send({msg:`Sucesso! O usuário ${nome} foi cadastrado no sistema.`});
});

//MÉTODO DE DELETAR USUÁRIO PELO ID
userRoute.delete('/:id', (request, response) => {
  const {id} = request.params
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Erro! Esse usuário não foi encotrado no sistema.'});

    database.delete(table, id)

    response.status(202).json(
      {msg: `Sucesso! O usuário ${userExist.nome} foi deletado do sistema.` });

  //database.select(table, id);
});

//MÉTODO DE EDITAR O USUÁRIO
userRoute.put('/:id', (request,response)=>{
  const { id } = request.params;
  const {nome, cpf, cidade, cep} = request.body;
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Erro! Esse usuário não foi encontrado no sistema.'});

    //CASO O USUÁRIO FOR ENCOTRADO;
    const user:any = {nome, cpf, cidade, cep};

    const filteredUser: any = {};
      for (const key in user) {
        if (user[key] !== undefined) {
      filteredUser[key] = user[key];
    }
  }
    const infoDatabase:any = {...userExist, ...filteredUser}
    database.update(table, id, infoDatabase);

    response.status(202).json(
      {msg: `Sucesso! O usuário ${userExist.nome} teve alterações no sistema.` });
});

//MÉTODO DE RETIRAR DINHEIRO PELO ID;
userRoute.put('/retirada/:id', (request,response)=>{
  const { id } = request.params;
  const {tipo, valor} = request.body;
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Erro! Esse usuário não foi encontrado no sistema.'});

    //CASO O USUÁRIO FOR ENCONTRADO;
    const nome = userExist.nome;
    const cpf = userExist.cpf;
    const cidade = userExist.cidade;
    const cep = userExist.cep;

    if(userExist.saldo >= Number(valor)) {

    let transacao = userExist.transacao;
    transacao.push({tipo, valor});

    let saldo = userExist.saldo;
    database.update(table, id, {id, nome, cpf, cidade, cep, saldo: saldo - Number(valor), transacao});

    response.status(201).json(
      {msg: `Sucesso! Foi retirado o valor de R$${valor}, do usuário: ${nome}.` });

    } else {
      response.status(404).json(
      {msg: `Erro! Você não pode retirar mais dinheiro do que possui.`});
    }
});

//MÉTODO DE DEPÓSITO PELO ID;
userRoute.put('/deposito/:id', (request,response)=>{
  const { id } = request.params;
  const {tipo, valor} = request.body;
  const userExist:any = database.select(table, id);

  if(userExist === undefined)
  return response.status(400).json(
    {msg:'Erro! Esse usuário não foi encontrado no sistema.'});

    //CASO O USUÁRIO FOR ENCONTRADO;
    const nome = userExist.nome;
    const cpf = userExist.cpf;
    const cidade = userExist.cidade;
    const cep = userExist.cep;

    let transacao = userExist.transacao;
    transacao.push({tipo, valor});

    let saldo = userExist.saldo;

    database.update(table, id, {id, nome, cpf, cidade, cep, saldo: saldo + Number(valor), transacao});

    response.status(201).json(
      {msg: `Sucesso! Foi depositado o valor de R$${valor}, na conta do usuário: ${nome}.` });
});

export {userRoute}
