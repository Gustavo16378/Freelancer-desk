# freelancer.desk

Dashboard pessoal para freelancers — controle de projetos, agenda, pagamentos e kanban.

## Estrutura

```
freelancer-desk/
├── front/          # Vite 5 + React 18 + TypeScript + Tailwind CSS
├── api/            # Quarkus 3 + Hibernate ORM Panache + PostgreSQL
└── docker-compose.yml
```

## Desenvolvimento local

### Pré-requisitos

- Node.js 20+
- Java 21+
- Maven 3.9+
- Docker + Docker Compose

### Front-end

```bash
cd front
npm install
cp .env.example .env        # ajuste VITE_API_URL e VITE_API_KEY se necessário
npm run dev                 # http://localhost:5173
```

Variáveis de ambiente (`front/.env`):

| Variável       | Padrão                    | Descrição                     |
|----------------|---------------------------|-------------------------------|
| `VITE_API_URL` | `http://localhost:8080`   | URL base da API               |
| `VITE_API_KEY` | `dev-secret-key`          | Chave de acesso à API         |

### Back-end (com Docker)

```bash
# Sobe banco + API (requer build do jar antes)
cd api
mvn package -DskipTests
cd ..
docker compose up --build
```

### Back-end (sem Docker — dev mode)

```bash
cd api
cp .env.example .env        # ajuste DATABASE_URL
# Postgres local rodando na porta 5432 com banco "freelancerdesk"
mvn quarkus:dev
```

A API estará disponível em `http://localhost:8080`.

Variáveis de ambiente (`api/.env`):

| Variável       | Padrão                                                          | Descrição                         |
|----------------|-----------------------------------------------------------------|-----------------------------------|
| `DATABASE_URL` | `jdbc:postgresql://localhost:5432/freelancerdesk`               | JDBC URL do PostgreSQL            |
| `API_KEY`      | `dev-secret-key`                                                | Chave exigida no header `x-api-key` |
| `FRONT_URL`    | `http://localhost:5173`                                         | Origem permitida no CORS          |

## Endpoints da API

Todos os endpoints exigem o header `x-api-key: <API_KEY>`.

| Método | Caminho                         | Descrição                        |
|--------|---------------------------------|----------------------------------|
| GET    | `/api/projects`                 | Lista projetos                   |
| POST   | `/api/projects`                 | Cria projeto                     |
| GET    | `/api/projects/{id}`            | Busca projeto                    |
| PUT    | `/api/projects/{id}`            | Atualiza projeto                 |
| DELETE | `/api/projects/{id}`            | Remove projeto                   |
| GET    | `/api/events`                   | Lista eventos                    |
| POST   | `/api/events`                   | Cria evento                      |
| GET    | `/api/events/{id}`              | Busca evento                     |
| PUT    | `/api/events/{id}`              | Atualiza evento                  |
| DELETE | `/api/events/{id}`              | Remove evento                    |
| GET    | `/api/payments`                 | Lista pagamentos                 |
| POST   | `/api/payments`                 | Cria pagamento                   |
| GET    | `/api/payments/{id}`            | Busca pagamento                  |
| PUT    | `/api/payments/{id}`            | Atualiza pagamento               |
| DELETE | `/api/payments/{id}`            | Remove pagamento                 |
| PUT    | `/api/payments/{id}/received`   | Marca como recebido              |
| PUT    | `/api/payments/{id}/pending`    | Marca como pendente              |
| GET    | `/api/board-cards`              | Lista cards do kanban            |
| POST   | `/api/board-cards`              | Cria card                        |
| GET    | `/api/board-cards/{id}`         | Busca card                       |
| PUT    | `/api/board-cards/{id}`         | Atualiza card                    |
| PUT    | `/api/board-cards/{id}/move`    | Move card de coluna              |
| DELETE | `/api/board-cards/{id}`         | Remove card                      |
| GET    | `/api/updates`                  | Lista atualizações (+ ?projectId)|
| POST   | `/api/updates`                  | Cria atualização                 |
| GET    | `/api/updates/{id}`             | Busca atualização                |
| PUT    | `/api/updates/{id}`             | Atualiza texto                   |
| DELETE | `/api/updates/{id}`             | Remove atualização               |

## Deploy

### Front-end — Cloudflare Pages

1. Conecte o repositório no Cloudflare Pages.
2. Configure o build:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `front`
   - **Node.js version**: `20`
3. Adicione as variáveis de ambiente:
   - `VITE_API_URL` → URL pública da API (ex: `https://freelancer-desk-api.up.railway.app`)
   - `VITE_API_KEY` → mesma chave configurada no back-end

### Back-end — Railway

1. Crie um novo projeto no Railway e conecte o repositório.
2. Configure o serviço para build a partir de `api/`:
   - **Root directory**: `api`
   - **Build command**: `mvn package -DskipTests`
   - **Start command**: `java -jar target/quarkus-app/quarkus-run.jar`
3. Adicione um serviço PostgreSQL no Railway (ou use Neon.tech).
4. Configure as variáveis de ambiente:
   - `DATABASE_URL` → JDBC URL do banco (ex: `jdbc:postgresql://...`)
   - `API_KEY` → chave secreta
   - `FRONT_URL` → URL do Cloudflare Pages (ex: `https://freelancer-desk.pages.dev`)

### Banco de dados — Neon.tech

1. Crie um projeto em [neon.tech](https://neon.tech).
2. Copie a **Connection string** no formato JDBC:
   ```
   jdbc:postgresql://<host>/<db>?sslmode=require&user=<user>&password=<pass>
   ```
3. Use esse valor em `DATABASE_URL`.
4. As migrations do Flyway são aplicadas automaticamente ao iniciar a API.
