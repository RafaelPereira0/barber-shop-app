# Sistema Completo para Barbearia (Full Stack)

Este é um sistema completo (Full Stack) para gerenciamento de agendamentos de barbearia. O projeto conta com uma API REST robusta desenvolvida em Node.js e um painel web interativo construído em React.

## 🏗️ Arquitetura do Projeto

O projeto é dividido em duas partes principais:

### 1. 🖥️ Frontend (`/frontend`)
- Desenvolvido em **React** (com Vite e TypeScript).
- Gerenciamento de rotas autenticadas (proteção de telas).
- Consumo da API utilizando **Axios**.
- Armazenamento do Token JWT no `localStorage` para persistência da sessão.

### ⚙️ 2. Backend (`/backend`)
Seguindo o princípio de **Responsabilidade Única (SRP)**:
- **Controllers:** Recebem as requisições HTTP e devolvem as respostas.
- **Services:** Onde residem as regras de negócio (criptografia, geração de tokens, validações).
- **Repositories:** Camada isolada de comunicação com o banco de dados via **Prisma ORM**.
- **Middlewares:** Interceptadores de segurança para validação do Token JWT.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React, TypeScript, Vite, Axios, React Router Dom.
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, JWT, BcryptJS, Cors.
