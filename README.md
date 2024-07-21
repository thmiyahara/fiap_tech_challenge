# Tech Challenge Fase 2

O projeto consiste em uma aplicação que gerencia uma coleção de livros. Utilizamos Node.js, Express.js e Supabase como banco de dados para armazenar e manipular os dados dos livros. A API permite operações básicas de CRUD (Create, Read, Update, Delete) para gerenciar livros, apresentando uma forma eficiente e escalável de interagir com os dados.

## Tecnologias Utilizadas

- Node.js
- Express
- Supabase

## Funcionalidades

- Criar novos livros
- Buscar todos os livros
- Atualizar informações de um livro
- Deletar um livro

## Requisitos

- Node.js
- Conta no Supabase

## Como posso utilizar

- Execute o Servidor: node server.js
// Isso iniciará seu servidor localmente. Você deve ver uma mensagem no terminal indicando que o servidor está rodando.

- Testando a API:

A API estará disponível em http://localhost:3000/api/books.
Utilize ferramentas como Postman para enviar requisições HTTP para os seguintes endpoints:
POST /api/books: Adiciona um novo livro.
GET /api/books: Obtém todos os livros.
PUT /api/books/:id: Atualiza um livro existente.
DELETE /api/books/:id: Deleta um livro.