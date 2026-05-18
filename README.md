# Pixel Breeders Movies

Aplicação de busca e avaliação de filmes, consumindo a API do TMDB.
Permite pesquisar filmes, ver detalhes (sinopse, elenco, data de lançamento),
avaliar de 1 a 5 estrelas (criar, editar e remover a nota) e consultar uma
página com todos os filmes avaliados.

## Tecnologias

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Python + Flask
- **Banco de dados:** MySQL
- **Orquestração:** Docker + Docker Compose

## Funcionalidades

- [x] Busca de filmes na API do TMDB
- [x] Listagem de resultados com pôster e título
- [x] Modal de detalhes: sinopse, data de lançamento, elenco
- [x] Avaliação de 1 a 5 estrelas (criar, editar, remover)
- [x] Página "Filmes Avaliados" com as notas do usuário
- [x] Estados de carregamento e tratamento de erros
- **Bônus:** 
    - [x] paginação ("Carregar mais")
    - [x] filtro por gênero e ano
    - [x] dockerização

## Pré-requisitos

Apenas **Docker** e **Docker Compose** instalados.

## Como rodar (Docker)

1. Clone o repositório e entre na pasta do projeto.

2. Crie um arquivo `.env` na raiz, baseado no `.env.example`:

```
   TMDB_TOKEN=seu_api_read_token_do_tmdb
   MYSQL_ROOT_PASSWORD=uma_senha_qualquer
   MYSQL_DATABASE=pixel_breeders
```

   O `TMDB_TOKEN` é o "API Read Access Token", gerado em
   https://www.themoviedb.org/settings/api

3. Suba a aplicação com um único comando:

```
   docker compose up --build
```

4. Acesse no navegador:

   - Frontend: http://localhost:5173
   - Backend (API): http://localhost:5000

A primeira execução pode demorar alguns minutos.
O banco de dados e suas tabelas são criados automaticamente.

Para parar: `Ctrl+C` e depois `docker compose down`.
Para parar e apagar também os dados do banco: `docker compose down -v`.


## Estrutura do projeto

```
pixel-breeders-movies/
├── docker-compose.yml      # Orquestra os três serviços (banco, backend, frontend)
├── README.md
├── .env                    # Variáveis de ambiente do Docker
├── .env.example            # Modelo das variáveis necessárias
│
├── backend/                # API
│   ├── app.py              # Ponto de entrada: cria a aplicação e registra os módulos
│   ├── config.py           # Centraliza as configurações lidas do ambiente
│   ├── extensions.py       # Instâncias compartilhadas (banco, cache)
│   ├── requirements.txt    # Dependências
│   ├── Dockerfile
│   ├── models/             # Camada de dados
│   ├── routes/             # Camada de rotas
│   └── services/           # Camada de integração externa
│
└── frontend/               # Aplicação cliente
    ├── Dockerfile
    ├── nginx.conf          # Configuração do servidor que entrega a aplicação
    └── src/
        ├── main.tsx        # Ponto de entrada da aplicação
        ├── App.tsx         # Componente raiz e definição das rotas de navegação
        ├── types/          # Definições de tipos
        ├── api/            # Comunicação com o backend
        ├── components/     # Componentes reutilizáveis de interface
        └── pages/          # Telas completas da aplicação
```

### Como as camadas se organizam

O projeto separa responsabilidades em camadas bem definidas, tanto no backend quanto no frontend, de forma que cada parte tenha um único motivo para mudar.

**Backend**

Os **models** representam as tabelas do banco de dados. Cada modelo descreve a estrutura de uma entidade e concentra a lógica de conversão dos registros para um formato pronto para ser enviado como resposta. É a única camada que conhece o formato dos dados persistidos.

As **routes** definem os endpoints da API e tratam o ciclo de cada requisição: recebem os dados enviados pelo cliente, validam se estão completos e corretos, acionam a camada apropriada para processar o pedido e devolvem a resposta com o código de status adequado. Não contêm regras de integração externa nem detalhes de persistência, apenas coordenam o fluxo entre quem chamou a API e as demais camadas.

Os **services** isolam a comunicação com a API externa de filmes. Eles montam as requisições para o serviço de terceiros, enviam as credenciais necessárias e devolvem os dados já tratados. Qualquer mudança na API externa afeta um único lugar, sem impactar as rotas.

Os arquivos da raiz dão suporte a essas camadas: o **config** reúne as configurações da aplicação a partir de variáveis de ambiente, o **extensions** mantém as instâncias compartilhadas entre os módulos, e o **app** monta a aplicação, conecta as extensões e registra os grupos de rotas.

**Frontend**

Os **types** definem os formatos dos dados que circulam pela aplicação. Servem como um contrato que descreve o que se espera receber do backend e o que cada componente manipula, garantindo consistência em todas as camadas.

A camada **api** centraliza toda a comunicação com o backend. Cada função corresponde a uma operação da API e devolve os dados já no formato esperado, de modo que o restante da aplicação nunca lida diretamente com requisições, apenas chama funções.

Os **components** são as peças reutilizáveis de interface, como a barra de busca, o cartão de filme, o modal e o seletor de estrelas. Cada componente recebe os dados de que precisa de quem o utiliza e comunica as interações do usuário de volta, sem assumir onde está sendo usado, o que permite reaproveitá-lo em telas diferentes.

As **pages** representam as telas completas e funcionam como orquestradoras: combinam vários componentes, controlam o estado daquela tela, decidem quando buscar dados e tratam as situações de carregamento e erro. São elas que dão sentido ao conjunto, conectando os componentes menores ao fluxo de dados da aplicação.

Essa divisão segue um princípio comum às duas pontas do projeto: as camadas mais externas (routes e pages) coordenam, enquanto as camadas internas (models, services, components, api) cuidam de responsabilidades específicas e isoladas.