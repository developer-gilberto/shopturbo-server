# ShopTurbo-server

Um servidor backend Node.js para integração com a API oficial da Shopee, fornecendo autenticação, gerenciamento de lojas e produtos.

## 📋 Descrição

O ShopTurbo Server é uma API REST construída em TypeScript que facilita a integração com a API oficial da Shopee. Ele oferece funcionalidades para:

- Gerenciamento de lojas na Shopee (editar, consultar vendas, pedidos, frete, etc...)
- Gerenciamento de produtos da sua loja na Shopee (editar, postar na loja, consultar lucros, remover da loja, etc...)
- Autenticação de usuários
- Integração com Shopee Partner API
- Gerenciamento de tokens de acesso

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript
- **Express.js** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **Docker** - Containerização
- **pnpm** - Gerenciador de pacotes

## 📦 Dependências Principais

- `@prisma/client` - Cliente do Prisma ORM
- `express` - Framework web
- `jsonwebtoken` - Autenticação JWT
- `bcryptjs` - Hash de senhas
- `axios` - Cliente HTTP
- `zod` - Validação de schemas
- `helmet` - Middleware de segurança
- `cors` - Cross-Origin Resource Sharing

## 🛠️ Instalação

### Pré-requisitos

- Node.js 22+
- pnpm ou gerenciador de pacotes de sua preferência
- PostgreSQL ou Docker

### Configuração do Ambiente

1. Clone o repositório:
```bash
git clone https://github.com/developer-gilberto/shopturbo-server.git
cd shopturbo-server
```

2. Instale as dependências:
```bash
pnpm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Database
POSTGRES_USER='postgres'
POSTGRES_PASSWORD='senha123'
POSTGRES_DB='db_shopturbo'
DATABASE_URL='postgresql://postgres:senha123@localhost:5432/db_shopturbo?schema=public'

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# JWT
JWT_SECRET='seuSegredoJWT'

# Shopee API
PARTNER_ID=your-partner-id
PARTNER_KEY=your-partner-key

REDIRECT_URL=your-redirect-url

AUTHORIZATION_URL_PATH=/api/v2/shop/auth_partner
GET_ACCESS_TOKEN_PATH=/api/v2/auth/token/get
GET_REFRESH_TOKEN_PATH=/api/v2/auth/access_token/get
GET_SHOP_PROFILE_PATH=/api/v2/shop/get_profile
GET_ITEM_BASE_INFO_PATH=/api/v2/product/get_item_base_info
GET_ITEM_LIST_PATH=/api/v2/product/get_item_list
AUTH_PARTNER_HOST=https://partner.shopeemobile.com
```

### Banco de Dados

1. Inicie o PostgreSQL com Docker:
```bash
docker-compose up -d postgres
```

2. Execute as migrações:
```bash
pnpm prisma:migrate
```

3. Gere o cliente Prisma:
```bash
pnpm prisma:generate
```

## 🏃 Execução

### Desenvolvimento
```bash
pnpm dev
```

### Produção
```bash
pnpm build
pnpm prod
```

### Homologação
```bash
pnpm build
pnpm homolog
```

## 🌐 API Endpoints

### Documentação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/docs` | Documentação da API ShopTurbo |

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/signup` | Registrar novo usuário |
| POST | `/signin` | Login do usuário |
| POST | `/signout` | Logout do usuário |
| GET | `/ping` | Verificar autenticação (requer JWT) |

### Shopee Integration

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/shopee/auth-url` | Obter URL de autorização |
| GET | `/api/shopee/access-token` | Obter token de acesso |
| PATCH | `/api/shopee/access-token` | Atualizar token de acesso |

### Shop (Loja)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/shopee/shop/profile/:shop_id` | Obter perfil da loja |

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/shopee/shop/:shop_id/products` | Listar todos os produtos |
| GET | `/api/shopee/shop/:shop_id/product/:item_id` | Obter produto específico |

### Parâmetros de Query para rota Produtos GET `/api/shopee/shop/:shop_id/products`

- `offset`: Offset para paginação. Se não for passado valor, a api vai usar o valor padrão: 0(zero).
- `page_size`: Tamanho da página (padrão: 10). Se não for passado valor, a api vai usar o valor padrão: 10(dez)
- `item_status`: Status do item (NORMAL, BANNED, UNLIST, REVIEWING, SELLER_DELETE, SHOPEE_DELETE)

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas. Onde cada camada tem seu próprio controller, repository, schema, etc:

```
src/
├── domains/              # Lógica de negócio por domínio
│   ├── accessToken/      # Gerenciamento de tokens
│   ├── authorizationUrl/ # URLs de autorização
│   ├── products/         # Produtos
│   ├── shop/            # Lojas
│   ├── shopeePartner/   # Integração Shopee
│   └── user/            # Usuários
├── infra/               # Infraestrutura
│   ├── authentication/ # Autenticação
│   ├── authorization/   # Autorização
│   ├── db/             # Conexão com banco
│   ├── integrations/   # Integrações externas
│   └── security/       # Segurança
└── routes/             # Rotas da aplicação
```

## 📊 Modelo de Dados

### User
- `id`: Identificador único
- `name`: Nome do usuário
- `email`: Email único
- `password`: Senha criptografada
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### Shop
- `id`: Identificador da loja (Shopee Shop ID)
- `userId`: Referência ao usuário dono da loja
- `name`: Nome da loja
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

### ShopeeAccessToken
- `id`: Identificador único
- `shopId`: Referência à loja
- `refreshToken`: Token de renovação (válido por 30 dias)
- `accessToken`: Token de acesso (válido por 4h)
- `expireIn`: Data de expiração
- `createdAt`: Data de criação
- `updatedAt`: Data de atualização

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. O usuário faz login com email/senha
2. O servidor retorna um JWT válido
3. O token deve ser enviado no header `"Authorization": "Bearer token"` para rotas protegidas
4. Middleware `verifyJWT` valida o token em rotas protegidas

## 🛡️ Segurança

- **Helmet**: Configurações de segurança HTTP
- **CORS**: Controle de origem cruzada
- **bcryptjs**: Hash seguro de senhas
- **JWT**: Tokens seguros para autenticação
- **Zod**: Validação rigorosa de dados de entrada

## 📝 Scripts Disponíveis

- `pnpm dev`: Executa em modo desenvolvimento com hot-reload e inicia debugger no chrome
- `pnpm build`: Compila o TypeScript para JavaScript
- `pnpm prod`: Executa em modo produção
- `pnpm homolog`: Executa em modo homologação
- `pnpm prisma:generate`: Gera o cliente Prisma
- `pnpm prisma:migrate`: Executa migrações do banco

## 🐳 Docker

O projeto inclui configuração Docker. Suba o banco com o comando:

```bash
docker-compose up
```

## 🚦 HTTP Status Codes

- `200`: Sucesso
- `200`: Recurso criado
- `400`: Dados inválidos
- `401`: Não autorizado
- `403`: Acesso negado
- `404`: Recurso não encontrado
- `409`: Conflito de dados
- `500`: Erro interno do servidor

## 🧑‍💻 Desenvolvedor

Feito com muito ❤️ por **Gilberto Lopes** Full Stack Developer.

### Saiba mais sobre o desenvolvedor

- [gilbertolopes.dev](https://gilbertolopes.dev)
- [GitHub](https://github.com/developer-gilberto)
- [Instagran](https://www.instagram.com/developer.gilberto/)
