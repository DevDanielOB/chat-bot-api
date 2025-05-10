
# 🤖 chat-bot-api

A **chat-bot-api** é uma API back-end construída com **NestJS**, que permite a criação de usuários, autenticação com **JWT** e troca de mensagens em tempo real entre usuários cadastrados, utilizando **WebSocket** e **Redis**.

O Redis é utilizado tanto para o gerenciamento das conexões WebSocket quanto para cache/sessões. A persistência dos dados é feita com **PostgreSQL** e todo o ambiente é orquestrado via **Docker**.

---

## 🚀 Tecnologias Utilizadas

- **[NestJS](https://nestjs.com/)** – Framework back-end Node.js
- **[PostgreSQL](https://www.postgresql.org/)** – Banco de dados relacional
- **[Redis](https://redis.io/)** – Armazenamento em memória para cache/sessões e pub/sub
- **[WebSocket](https://docs.nestjs.com/websockets/gateways)** – Comunicação em tempo real
- **[JWT](https://jwt.io/)** – Autenticação segura
- **[Docker](https://www.docker.com/)** – Contêineres para desenvolvimento e produção

---

## 📦 Clonando o projeto

Clone o repositório em sua máquina local com o comando:

```bash
git clone https://github.com/DevDanielOB/chat-bot-api.git
cd chat-bot-api
```

---

## 🛠️ Executando o projeto

Para rodar a aplicação localmente com Docker, utilize o comando abaixo no terminal:

```bash
docker compose up --build
```

Isso irá iniciar os seguintes serviços:

- API NestJS (porta `3000`)
- Banco de dados PostgreSQL (porta `5432`)
- Redis (porta `6379`)

A aplicação estará acessível em:  
🔗 `http://localhost:3000`

---

## 📬 Funcionalidades

- ✅ Cadastro de usuários
- 🔐 Autenticação com JWT
- 💬 Envio e recebimento de mensagens em tempo real via WebSocket
- ⚡ Redis para controle de sessões, cache e pub/sub
- 🧩 Arquitetura modular e escalável

---

## 📂 Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação JWT
├── users/             # Módulo de usuários
├── messages/          # Gateway WebSocket para mensagens
├── redis/             # Configuração do Redis
└── main.ts            # Arquivo principal de bootstrap
```

---

## 🔐 Exemplo de autenticação

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "senha123"
}
```

### Resposta

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}
```

Use esse token para autenticar as conexões WebSocket e demais endpoints protegidos.

---

## ✅ Pré-requisitos

Certifique-se de ter os seguintes itens instalados:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Portas 3000, 5432 e 6379 liberadas no seu ambiente local


## ✨ Contribuições

Contribuições são bem-vindas!  
Sinta-se à vontade para abrir uma **issue** ou enviar um **pull request**.
```
