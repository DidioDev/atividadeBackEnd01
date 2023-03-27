import fs from "node:fs/promises";

const databasePath = new URL("../database.json", import.meta.url);

export class Database {
  database: any = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => {
        this.database = JSON.parse(data);
      })
      .catch(() => {
        this.persist();
      });
  }

  //CATCH = QUANDO O QUE TEM QUE FAZER NÃO É FEITO, ELE TRATA COM OUTRO CALLBACK;
  //PARSE = CONVERTE O OBJETO ESCRITO PARA OBJETO;

  persist() {
    fs.writeFile(databasePath, JSON.stringify(this.database, null, 2));
    //STRINGIFY = CONVERTE O OBJETO PARA OBJETO ESCRITO;
  }

  select(table: string, id?: string): object {
    let data = this.database[table] ?? [];

    //?? = É UM OPERADOR QUE VERIFICA SE A CONDIÇÃO DOS DADOS QUE RECEBE É NULL OU UNDER;
    //CASO FOR NULL ELE ALOCA O ESPAÇO PARA UM DADO JÁ PROGRAMADO;

    if (id) {
      data = data.find((row: any) => {
        return row.id === id;
      });
    }

    return data;
  }

  insert(table: string, data: object): object {
    if (Array.isArray(this.database[table])) {
      //SE SIM ENTRA AQUI;
      this.database[table].push(data);
      this.persist();
    } else {
      //SE NÃO ENTRA AQUI;
      this.database[table] = [data];
    }

    return data;
  }

  delete(table: string, id: string) {
    //PROCURA DE UM ID
    const rowIndex = this.database[table].findIndex(
      (row: any) => row.id === id
    );

    //VALIDANDO O ID E O DELETE;
    if (rowIndex > -1) {
      this.database[table].splice(rowIndex, 1);
      this.persist();
    }
  }

  update(table: string, id: string, data: object) {
    const rowIndex = this.database[table].findIndex(
      (row: any) => row.id === id
    );

    if (rowIndex > -1) {
      this.database[table][rowIndex] = { id, ...data };
      //... = DESCONSTRUIR UM OBJETO;
      this.persist();
    }
  }
}
