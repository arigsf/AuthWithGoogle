# Autenticação com o Google

Este projeto é uma aplicação simples que utiliza autenticação via Google OAuth. O objetivo é demonstrar como implementar autenticação com o Google de forma prática.

## Backend

A API foi desenvolvida em TypeScript com Prisma e Express.

### .env
O .env deve ser inserido dentro da pasta `api` e deve seguir esta estrutura:

```
DATABASE_URL="file:./dev.db"
PORT=3030
NODE_ENV="development"
APP_URL="http://localhost:3000"
SECRET_KEY="mySecretKey"
JWT_EXPIRATION="7d"
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Como rodar
Para rodar o backend, siga os passos abaixo:
1. Navegue para o diretório
```
cd api
```
2. Instale as dependências
```
npm install
```
3. Inicie
```
npm start
```

## Frontend

O frontend foi desenvolvido em JavaScript com React.

### .env
O .env deve ser inserido dentro da pasta `client` e deve seguir esta estrutura:

```
REACT_APP_GOOGLE_CLIENT_ID=
```

O valor desse é o mesmo `GOOGLE_CLIENT_ID` do .env do backend.

### Como rodar
Para rodar o frontend, siga os passos abaixo:
1. Navegue para o diretório
```
cd client
```
2. Instale as dependências
```
npm install
```
3. Inicie
```
npm start
```

## Pronto!

Acesse http://localhost:3000 no navegador para interagir com a aplicação.
