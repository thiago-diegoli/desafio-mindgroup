
# Case Desafio da Mind Consulting
![Mind Group Logo](  
https://mindconsulting.com.br/wp-content/uploads/2023/08/LOGOTIPO-Mind-Group-Technologies-Branco.png)
## Comandos Básicos

Lista de comandos para execução do projeto:


```bash
cd client
npm i
npm start
```

```bash
cd server
npm i
npm run dev
```

Crie um arquivo ``.env`` dentro do diretório ``/server`` e copie/adapte as informações de ``.env-example`` no mesmo diretório.
Há o dump do banco de dados na pasta dump em SQL, mas também é possível (e mais fácil) executar o comando a baixo dentro da pasta ``server``
```bash
npx ts-node seed.ts
```

Criei um usuário de fácil acesso já cadastrado no banco para teste, segue o email e a senha:
```bash
e-mail: user@email.com
senha: pass123
```

Para verificar a documentação do swagger do backend acesse ``localhost:4000/api/doc``

## Tecnologias Utilizadas 🛠️
[![Tecnologias](https://skillicons.dev/icons?i=ts,react,materialui,express,mysql,prisma,vscode,windows,postman,nodejs)](https://skillicons.dev)
## Licença

The MIT License (MIT) 2024 - [Thiago Diegoli](https://github.com/thiago-diegoli/).
