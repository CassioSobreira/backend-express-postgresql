Backend Express PostgreSQL - Autenticação JWT e CRUD de Filmes

Este projeto é uma API RESTful desenvolvida com Node.js, Express e TypeScript, utilizando PostgreSQL como base de dados através do ORM Sequelize. Ele implementa autenticação de utilizadores via Token JWT e fornece um CRUD completo para gestão de uma lista de filmes pessoal e protegida por utilizador.

Este repositório representa a evolução de um projeto anterior que utilizava MongoDB, agora adaptado para um ambiente relacional com PostgreSQL.

Funcionalidades Principais

Autenticação JWT:

Registo de novos utilizadores (POST /api/auth/register)

Login de utilizadores existentes (POST /api/auth/login) com geração de token JWT.

Hashing seguro de palavras-passe utilizando bcrypt.

Rota protegida de exemplo (GET /api/auth/protected) para verificar a validade do token.

CRUD de Filmes (Protegido por JWT):

POST /api/movies: Cria um novo filme associado ao utilizador autenticado.

GET /api/movies: Lista todos os filmes pertencentes ao utilizador autenticado.

GET /api/movies?chave=valor: Lista filmes do utilizador, aplicando filtros (ex: ?genre=Ação, ?rating=8). Filtros disponíveis: title, director, genre, year, rating (maior ou igual).

GET /api/movies/:id: Obtém os detalhes de um filme específico do utilizador.

PUT /api/movies/:id: Atualiza todos os dados de um filme específico do utilizador.

PATCH /api/movies/:id: Atualiza parcialmente os dados de um filme específico do utilizador.

DELETE /api/movies/:id: Remove um filme específico do utilizador.

Segurança: Utilizadores só podem aceder, modificar ou apagar os seus próprios filmes. Tentativas de acesso a dados de outros utilizadores resultarão num erro 403 Forbidden.

Estrutura de Camadas: O projeto segue uma arquitetura organizada em camadas (controllers, services, models, routes, middlewares, database).

Tecnologias Utilizadas

Backend: Node.js, Express.js

Linguagem: TypeScript

Base de Dados: PostgreSQL

ORM: Sequelize

Autenticação: JSON Web Tokens (JWT), bcryptjs

Ambiente de Desenvolvimento: Docker, Docker Compose

Variáveis de Ambiente: dotenv

Gestor de Pacotes: npm

Pré-requisitos

Node.js (versão LTS recomendada)

npm (geralmente instalado com o Node.js)

Docker (para executar a base de dados PostgreSQL localmente)

Configuração do Ambiente Local

Clonar o Repositório:

git clone [https://github.com/seu-usuario/backend-express-postgresql.git](https://github.com/seu-usuario/backend-express-postgresql.git)
cd backend-express-postgresql


Instalar Dependências:

npm install


Configurar Variáveis de Ambiente:

Crie um ficheiro chamado .env na raiz do projeto.

Copie o conteúdo do ficheiro .env.example (se existir) ou adicione as seguintes variáveis, ajustando os valores conforme necessário:

# Configuração da Aplicação
PORT=3000
JWT_SECRET=SUA_CHAVE_SECRETA_SUPER_LONGA_E_ALEATORIA_AQUI

# Configuração da Base de Dados PostgreSQL (Desenvolvimento Local - Docker)
DB_USER=devuser         # Ou o utilizador definido no docker-compose.yml
DB_PASSWORD=devpassword # Ou a palavra-passe definida no docker-compose.yml
DB_NAME=backend_db      # Ou o nome da base de dados definido no docker-compose.yml
DB_HOST=localhost
DB_PORT=5432

# Opcional: String de Conexão para Produção (ex: Vercel)
# DATABASE_URL="postgresql://user:pass@host:port/dbname?sslmode=require"


Importante: Substitua SUA_CHAVE_SECRETA... por uma chave segura.

Iniciar a Base de Dados (Docker):

Certifique-se de que o Docker Desktop está em execução.

No terminal, na raiz do projeto, execute:

npm run start:database
# Ou: docker compose up -d


Isto iniciará um contentor PostgreSQL e um Adminer (interface web em http://localhost:8080).

Executar as Migrações:

Este comando cria as tabelas Users e Movies na base de dados Docker.

npx dotenv-cli -e .env -- npx sequelize-cli db:migrate --env development


Pode verificar as tabelas criadas usando o Adminer ou o pgAdmin.

Executar a Aplicação

Modo de Desenvolvimento (com reinício automático):

npm run dev


O servidor estará disponível em http://localhost:3000.

Modo de Produção (requer build prévio):

npm run build   # Compila TypeScript para JavaScript na pasta 'dist/'
npm run start   # Executa o código compilado


Testar a API

Recomenda-se o uso de ferramentas como Postman ou Insomnia para testar os endpoints.

Importar Coleção: Importe o ficheiro postman_collection.json (para Postman) ou requests/requests.yaml (para Insomnia) na sua ferramenta preferida. Estes ficheiros contêm exemplos de requisições para todas as funcionalidades, incluindo casos de sucesso e erro.

Configurar Ambiente: Certifique-se de que a variável baseUrl no ambiente da sua ferramenta está definida como http://localhost:3000/api.

Executar Testes: Siga a ordem lógica:

Registe um novo utilizador.

Faça login para obter um token JWT.

Use o token JWT no cabeçalho Authorization: Bearer <seu_token> para testar as rotas de filmes (/api/movies).

Teste a criação, listagem, obtenção por ID, atualização e exclusão de filmes.

Teste os cenários de erro (sem token, token inválido, acesso a filme de outro utilizador, etc.).

Estrutura de Pastas

.
├── config/             # Configurações do Sequelize (conexão)
├── prisma/             # (Se usou Prisma antes, pode remover ou ignorar)
├── requests/           # Ficheiros de coleção para Insomnia/Postman
├── src/                # Código-fonte da aplicação
│   ├── controllers/    # Controladores (lógica HTTP)
│   ├── database/       # Inicialização da conexão Sequelize
│   ├── middlewares/    # Middlewares (ex: autenticação JWT)
│   ├── migrations/     # Ficheiros de migração do Sequelize
│   ├── models/         # Definições dos modelos Sequelize e inicializador
│   ├── routes/         # Definição das rotas da API
│   ├── seeders/        # (Opcional) Seeders do Sequelize
│   └── services/       # Lógica de negócio e interação com a base de dados
│   └── index.ts        # Ponto de entrada da aplicação
├── .env                # Variáveis de ambiente (NÃO COMMITAR)
├── .env.example        # Exemplo de variáveis de ambiente
├── .gitignore          # Ficheiros a ignorar pelo Git
├── .sequelizerc        # Configuração dos caminhos para Sequelize CLI
├── docker-compose.yml  # Configuração do Docker para base de dados local
├── package-lock.json   # Lockfile das dependências
├── package.json        # Dependências e scripts do projeto
├── README.md           # Este ficheiro
└── tsconfig.json       # Configurações do compilador TypeScript
