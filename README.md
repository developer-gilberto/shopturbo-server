# ShopTurbo-server API

Uma API REST para fazer a integração do meu SaaS ShoptTurbo com a API oficial da Shopee.  Desenvolvida usando TypeScript, Node.js, Express, Prisma ORM, Postgres, Docker. Ele oferece funcionalidades para:

-   Gerenciamento de lojas na Shopee (editar, consultar vendas, pedidos, frete, tarifas da Shopee, enfim, ter controle da sua loja na Shopee).
-   Gerenciamento de produtos da sua loja na Shopee (editar, postar na loja, consultar lucros, impostos, remover da loja e muito mais).
-   Autenticação de usuários
-   Integração com Shopee Partner API
-   Gerenciamento de tokens de acesso

## Exemplo de resposta rota `GET /api/shop/shop_id/products`
<img width="762" height="822" alt="get" src="https://github.com/user-attachments/assets/7f8c67c6-3741-4055-aab2-48c7a1f50c7d" />

## Exemplo de resposta rota `POST /api/shop/shop_id/products`
<img width="761" height="658" alt="post" src="https://github.com/user-attachments/assets/0bb583c7-d5e7-482a-a528-96a6e1da88d2" />

## Exemplo de resposta rota `GET /api/shop/profile/shop_id`
<img width="765" height="501" alt="get-shop-prof" src="https://github.com/user-attachments/assets/628eddaa-0b45-4fbe-b8df-856f0b73986d" />


## ⚠️ Antes de continuar

Este projeto ainda está em desenvolvimento, se você encontrar algum problema,  comportamento inesperado, bugs, você pode ajudar muito no desenvolvimento do projeto simplesmente reportando o problema ao desenvolvedor:

Ao reportar, inclua:

-   Passos para reproduzir o bug
-   O que você esperava que acontecesse
-   O que realmente aconteceu
-   Logs ou prints se possível

👉 [Reportar bug ao desenvolvedor](https://github.com/developer-gilberto/shopturbo-server/issues/new)

Saiba mais sobre o desenvolvedor no final dessa documentação.

## 🚀 Tecnologias

-   **Node.js** - Runtime JavaScript
-   **TypeScript** - Superset tipado do JavaScript
-   **Express.js** - Framework web
-   **Prisma** - ORM para banco de dados
-   **PostgreSQL** - Banco de dados relacional
-   **JWT** - Autenticação baseada em tokens
-   **Docker** - Containerização
-   **pnpm** - Gerenciador de pacotes

## 📦 Dependências Principais

-   `@prisma/client` - Cliente do Prisma ORM
-   `express` - Framework web
-   `jsonwebtoken` - Autenticação JWT
-   `bcryptjs` - Hash de senhas
-   `axios` - Cliente HTTP
-   `zod` - Validação de schemas
-   `helmet` - Middleware de segurança
-   `cors` - Cross-Origin Resource Sharing

## 🛠️ Instalação

### Pré-requisitos

-   Node.js 22+
-   pnpm ou gerenciador de pacotes de sua preferência
-   PostgreSQL ou Docker(recomendado)

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
NODE_ENV='development'
FRONTEND_URL='http://localhost:3000'
PORT=5000
JWT_SECRET='your-jwt-secret'

POSTGRES_USER='postgres'
POSTGRES_PASSWORD='password1234'
POSTGRES_DB='db_shopturbo'

DATABASE_URL='postgresql://postgres:password1234@localhost:5432/db_shopturbo?schema=public'

PARTNER_ID=1234
PARTNER_KEY='your-api-key'
AUTH_PARTNER_HOST='https://openplatform.sandbox.test-stable.shopee.sg'

AUTHORIZATION_URL_PATH=/api/v2/shop/auth_partner
GET_ACCESS_TOKEN_PATH=/api/v2/auth/token/get
GET_REFRESH_TOKEN_PATH=/api/v2/auth/access_token/get
GET_SHOP_PROFILE_PATH=/api/v2/shop/get_profile
GET_SHOP_INFO_PATH=/api/v2/shop/get_shop_info
GET_ITEM_BASE_INFO_PATH=/api/v2/product/get_item_base_info
GET_ITEM_LIST_PATH=/api/v2/product/get_item_list
GET_ORDER_LIST_PATH=/api/v2/order/get_order_list
GET_ORDER_DETAIL_PATH=/api/v2/order/get_order_detail

REDIRECT_URL='your-frontend-url-callback->http://localhost:3000'
```

### Banco de Dados

1. Inicie o PostgreSQL com Docker:

```bash
docker compose up -d
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

## 🌱 Seed

Este seed tem como objetivo criar um usuário de teste no banco de dados para facilitar o desenvolvimento e testes da aplicação, especialmente o login e funcionalidades que dependem de usuários.

1. Execute o seed:

```bash
pnpm prisma:seed
```

2. O comando irá rodar o arquivo `prisma/seed.ts`, criar o usuário de teste no banco e imprimir logs no console informando o resultado da execução.

3. O usuário criado com o seed possui as seguintes credenciais:

###

| Campo | Valor               |
| ----- | ------------------- |
| Nome  | fakeUser            |
| Email | teste@shopturbo.com |
| Senha | 1234                |

4. Use essas credenciais para fazer login na aplicação.

5. Caso queira desfazer o seed (apagar o registro do usuário criado pelo seed), basta executar:

```bash
pnpm prisma:reset-seed
```

## 🌐 API Endpoints

### Documentação

| Método | Endpoint | Descrição                     |
| ------ | -------- | ----------------------------- |
| GET    | `/docs`  | Documentação da API ShopTurbo |

##

### Autenticação

| Método | Endpoint   | Descrição                           |
| ------ | ---------- | ----------------------------------- |
| POST   | `/signup`  | Registrar novo usuário              |
| POST   | `/signin`  | Login do usuário                    |
| POST   | `/signout` | Logout do usuário                   |
| GET    | `/ping`    | Verificar autenticação (requer JWT) |

##

### Shopee

| Método | Endpoint                   | Descrição                 |
| ------ | -------------------------- | ------------------------- |
| GET    | `/api/shopee/auth-url`     | Obter URL de autorização  |
| GET    | `/api/shopee/access-token` | Obter token de acesso     |
| PATCH  | `/api/shopee/access-token` | Atualizar token de acesso |

#### Exemplo de requisição para rota `PATCH /api/shopee/access-token`:
Corpo da requisição deve conter um objeto no formato JSON com as seguintes propriedades: `shopId` e `refreshToken` ambas do tipo string.

**http://localhost:5000/api/shopee/access-token**

`body (json)`:
```
{
	"shopId": "1234",
	"refreshToken": "jwt"
}
```

##

### Shop

| Método | Endpoint                            | Descrição                     |
| ------ | ----------------------------------- | ----------------------------- |
| GET    | `/api/shopee/shop/profile/:shop_id` | Obter dados do perfil da loja |
| GET    | `/api/shopee/shop/info/:shop_id`    | Obter informações da loja     |

Os parâmetros da rota GET /api/shopee/shop/profile/:shop_id e GET /api/shopee/shop/info/:shop_id são os mesmos e a requisição é feita da mesma maneira também.

#### \* Parâmetros da rota -> `GET /api/shopee/shop/profile/:shop_id`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.

#### Exemplo de requisição para rota `GET /api/shopee/shop/profile/:shop_id`:

**http://localhost:5000/api/shopee/shop/profile/1234**

##

### Produtos na Shopee

| Método | Endpoint                                     | Descrição                               |
| ------ | -------------------------------------------- | --------------------------------------- |
| GET    | `/api/shopee/shop/:shop_id/products/id-list` | Obter IDs dos produtos                  |
| GET    | `/api/shopee/shop/:shop_id/products/full-info` | Obter informações dos produtos |

#### \* Parâmetros da rota -> `GET /api/shopee/shop/:shop_id/products/id-list`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.
-   `offset`: Parâmetro de consulta. Offset para paginação. Se não for passado valor, a api shopturbo vai usar o valor padrão: 0 (zero).
-   `page_size`: Parâmetro de consulta. Tamanho da página. Se não for passado valor, a api shopturbo vai usar o valor padrão: 10 (dez). Valor máximo é 100 (cem).
-   `item_status`: Parâmetro de consulta. Status do produto. Deve ser uma das seguintes opções -> "NORMAL", "BANNED", "UNLIST", "REVIEWING", "SELLER_DELETE", "SHOPEE_DELETE".

#### Exemplo de requisição para rota `GET /api/shopee/shop/:shop_id/products/id-list`:

**http://localhost:5000/api/shopee/shop/1234/products/id-list?offset=0&page_size=100&item_status=NORMAL**


#### \* Parâmetros da rota -> `GET /api/shopee/shop/:shop_id/products/full-info`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.
-   `item_id_list`: Parâmetro de consulta. Pode ser o ID de um único produto específico ou um array com o ID dos produtos que deseja consultar (Máximo 50 IDs por requisição).

#### Exemplo de requisição para rota `GET /api/shopee/shop/:shop_id/products/full-info`:

**http://localhost:5000/api/shopee/shop/1234/products/full-info?item_id_list=892607435,885174198,875174199**

##

### Produtos no ShopTurbo

| Método | Endpoint                                     | Descrição                               |
| ------ | -------------------------------------------- | --------------------------------------- |
| POST   | `/api/shop/:shop_id/products`                | Salvar produtos no banco de dados |
| GET    | `/api/shop/:shop_id/products`                | Obter produtos do banco de dados  |


#### \* Parâmetros da rota -> `POST /api/shop/:shop_id/products`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja salvar os produtos.
-   `body`: Corpo da requisição com um array de objetos no formato JSON. (máximo 100 produtos por requisição). Onde cada objeto representa um produto.

#### Exemplo de requisição para rota `POST /api/shop/:shop_id/products`:

**http://localhost:5000/api/shop/1234/products**

`body (json)`:
```
[
    {
        "id": 892607435,
        "sku": "prod-001",
        "categoryId": 100,
        "name": "Produto Exemplo",
        "stock": 50,
        "sellingPrice": 99.90,
        "costPrice": 50.00,
        "governmentTaxes": 15.00,
        "imageUrl": "https://example.com/image.jpg"
    }
]
```

#### \* Parâmetros da rota -> `GET /api/shop/:shop_id/products`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.
-   `offset`: Parâmetro de consulta. Offset para paginação
-   `page_size`: Parâmetro de consulta. Tamanho da página (número inteiro entre 1 e 100).

#### Exemplo de requisição para rota `GET /api/shop/:shop_id/products`:

**http://localhost:5000/api/shop/1234/products?offset=0&page_size=50**

##

### Pedidos

| Método | Endpoint                                   | Descrição             |
| ------ | ------------------------------------------ | --------------------- |
| GET    | `/api/shopee/shop/:shop_id/orders/id-list` | Obter IDs dos pedidos |
| GET    | `/api/shopee/shop/:shop_id/orders/details` | Obter detalhes dos pedidos |

#### \* Parâmetros da rota -> `GET /api/shopee/shop/:shop_id/orders/id-list`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.
-   `page_size`: Parâmetro de consulta. Tamanho da página. Se não for passado valor, a api shopturbo vai usar o valor padrão: 10 (dez). Valor máximo é 100 (cem).
-   `interval_days`: Parâmetro de consulta. Intervalo de dias a ser considerado. Valor máximo é 15 (quinze).
-   `time_range_field`Parâmetro de consulta. Campo de tempo usado no filtro. Deve ser uma das seguintes opções -> "create_time" ou "update_time".
-   `order_status`: Parâmetro de consulta. Status dos pedidos. Deve ser uma das seguintes opções -> "UNPAID", "READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "IN_CANCEL", "CANCELLED", "INVOICE_PENDING".

#### Exemplo de requisição para rota `GET /api/shopee/shop/:shop_id/orders/id-list`:

**http://localhost:5000/api/shopee/shop/1234/orders/id-list?page_size=100&interval_days=15&time_range_field=create_time&order_status=READY_TO_SHIP**

#### \* Parâmetros da rota -> `GET /api/shopee/shop/:shop_id/orders/details`:

-   `shop_id`: Parâmetro de rota. ID da loja que deseja consultar.
-   `order_id_list`: Parâmetro de consulta. Pode ser uma string com o ID(order_sn) de um único pedido específico ou um array de strings com os IDs(order_sn) dos pedidos que deseja consultar (Máximo 50 IDs por requisição).

#### Exemplo de requisição para rota `GET /api/shopee/shop/:shop_id/orders/details`:

**http://localhost:5000/api/shopee/shop/1234/orders/details?order_id_list=251018D2REYNQ8,251018D2KT6VN9,251018D2K2BSPG,251018D2HSBTPU**



## 🔁 Fluxo da aplicação

1. Execute o comando `pnpm prisma:seed` para registrar no banco de dados um usuário.

2. Faça login em `POST /signin` com as credenciais que o comando seed retornou no terminal. A api shopturbo vai retornar um token de autenticação. Este token deve ser enviado no header como Bearer token em todas as requisições para rotas protegidas. `"Authorization": "Bearer token"`.

3. Solicite a url de autorização em `GET /api/shopee/auth-url`. A api shopturbo vai retornar a url de autorização que serve para o usuário conceder autorização para a api consumir os dados da loja Shopee dele. (É necessário ter uma conta de desenvolvedor na Shopee para obter a PARTNER_ID e PARTNER_KEY necessários para gerar a url). Saiba mais em: [Conta de desenvolvedor Shopee](https://open.shopee.com/developer-guide/12)

4. Ao acessar a url de autorização, você vai ser redirecionado para fazer login na Shopee com uma conta de sua loja Shopee. Caso não tenha uma conta de vendedor na Shopee, use as credenciais dessa loja Shopee que eu criei para fins de testes -> Conta: SANDBOX.e7fcbe2b7aa4184988be, senha: d44cf0bd42e6da27

5. Após conceder a autorização para a api shopturbo, você vai ser redirecionado para rota de callback(redirect_url). A Shopee vai enviar 2 parâmetros de query na url: code e shop_id. Eles serão usados para solicitar o token de acesso da api da Shopee. Exemplo -> `/callback?code=1234&shop_id=1234`.

6. Agora, solicite o token de acesso da api da Shopee em `GET /api/shopee/access-token?code=1234&shop_id=1234`. A api shopturbo vai salvar o token de acesso no banco de dados e vai te retornar somente o shopId.

7. E pronto, agora basta enviar o shopId como parâmetro de rota nas rotas que esperam por um parâmetro :shop_id.
   Exemplo -> `GET /api/shopee/shop/:shop_id/products/full-info`.

8. Se ficou com alguma dúvida, estou à disposição através dos links no final desta documentação.

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas. Onde cada camada tem seu próprio controller, repository, schema, etc:

```
src/
├── domains/              # Lógica de negócio por domínio
│   ├── accessToken/      # Gerenciamento de tokens
│   ├── authorizationUrl/ # URLs de autorização
│   ├── docs/             # Documentação do projeto
│   ├── orders/           # Pedidos
│   ├── products/         # Produtos
│   ├── shop/            # Lojas
│   ├── shopeePartner/   # Integração Shopee
│   └── user/            # Usuários
├── infra/               # Infraestrutura
│   ├── authentication/  # Autenticação
│   ├── authorization/   # Autorização
│   ├── db/             # Conexão com banco
│   ├── integrations/   # Integrações externas
│   └── security/       # Segurança
└── routes/             # Rotas da aplicação
```

## 📊 Modelo de Dados

### User

-   `id`: Identificador único
-   `name`: Nome do usuário
-   `email`: Email único
-   `password`: Senha criptografada
-   `createdAt`: Data de criação
-   `updatedAt`: Data de atualização

### Shop

-   `id`: Identificador da loja (Shopee Shop ID)
-   `userId`: Referência ao usuário dono da loja
-   `name`: Nome da loja
-   `createdAt`: Data de criação
-   `updatedAt`: Data de atualização

### ShopeeAccessToken

-   `id`: Identificador único
-   `shopId`: Referência à loja
-   `refreshToken`: Token de renovação (válido por 30 dias)
-   `accessToken`: Token de acesso (válido por 4h)
-   `expireIn`: Data de expiração
-   `createdAt`: Data de criação
-   `updatedAt`: Data de atualização

## 🔐 Autenticação

O sistema utiliza JWT (JSON Web Tokens) para autenticação:

1. O usuário faz login com email/senha
2. O servidor retorna um JWT válido
3. O token deve ser enviado no header `"Authorization": "Bearer token"` para rotas protegidas
4. Middleware `verifyJWT` valida o token em rotas protegidas

## 🛡️ Segurança

-   **Helmet**: Configurações de segurança HTTP
-   **CORS**: Controle de origem cruzada
-   **bcryptjs**: Hash seguro de senhas
-   **JWT**: Tokens seguros para autenticação
-   **Zod**: Validação rigorosa de dados de entrada

## 📝 Scripts Disponíveis

-   `pnpm dev`: Executa em modo desenvolvimento com hot-reload e inicia debugger no chrome
-   `pnpm build`: Compila o TypeScript para JavaScript
-   `pnpm prod`: Executa em modo produção
-   `pnpm homolog`: Executa em modo homologação
-   `pnpm prisma:generate`: Gera o cliente Prisma
-   `pnpm prisma:migrate`: Executa migrações do banco

## 🐳 Docker

O projeto inclui configuração Docker. Suba o banco com o comando:

```bash
docker compose up
```

## 🚦 HTTP Status Codes

-   `200`: Sucesso
-   `201`: Recurso criado
-   `400`: Dados inválidos
-   `401`: Não autorizado
-   `403`: Acesso negado
-   `404`: Recurso não encontrado
-   `409`: Conflito de dados
-   `500`: Erro interno do servidor

## 🐞 Bugs

Se você encontrou algum problema ou comportamento inesperado no projeto, por favor, ajude a tornar este projeto melhor, reportando o problema ao desenvolvedor:

Ao reportar, inclua:

-   Passos para reproduzir o bug
-   O que você esperava que acontecesse
-   O que realmente aconteceu
-   Logs ou prints se possível

👉 [Reportar bug ao desenvolvedor](https://github.com/developer-gilberto/shopturbo-server/issues/new)

## 🧑‍💻 Desenvolvedor

Feito com muito ❤️ por **Gilberto Lopes** Full Stack Developer.

### Saiba mais sobre o desenvolvedor

-   Email: developer.gilberto@gmail.com
-   [Site pessoal](https://gilbertolopes.dev)
-   [LinkedIn](https://linkedin.com/in/gilbertolopes-dev)
-   [GitHub](https://github.com/developer-gilberto)
-   [Instagran](https://www.instagram.com/developer.gilberto/)

Exceto conforme expressamente estabelecido de outra forma por escrito, o titular dos direitos autorais deste software e qualquer outra pessoa que controle os direitos autorais reserva todos os direitos a respeito do software distribuído.

Nenhuma permissão é concedida para cópia, distribuição, modificação ou sublicenciamento do software. O uso comercial deste software requer uma licença comercial válida emitida pelo titular dos direitos autorais.

Para obter permissão, entre em contato com o criador e desenvolvedor do ShopTurbo-server® Gilberto Lopes developer.gilberto@gmail.com

## ShopTurbo-server®
### All Rights Reserved ®
### © Copy Right
### Todos os Direitos Reservados
