# Learn something related with PostgresSQL

- This is just a quick demo for docker, postgressql and nodejs in TS with express.
- This is not a production ready code.

## Install & Local Setups

```bash
 npm i -g yarn # if not yet installed
 yarn init -y 
 yarn add express pg typeorm -S 
 yarn add @types/express nodemon ts-node typescript -D
 npx tsconfig.json # Choose nodejs (Default) topion
 yarn add reflect-metadata # for typeorm dependency required
 yarn add dotenv -D # for environment variables
```


## Docker Setup

```bash
brew install docker-compose
# Just run app with docker compose
docker-compose up
# Stop & delete docker containers
docker-compose down

# PG Docker start (For Local Environment)
docker run --name postgres --network pg-network -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker run --name pgadmin --network pg-network -p 5050:80 -e "PGADMIN_DEFAULT_EMAIL=user@example.com" -e "PGADMIN_DEFAULT_PASSWORD=password" -d dpage/pgadmin4

# PG Docker create database
docker exec -it postgres psql -U postgres -c "CREATE DATABASE minibank;"

# How to stop & delete docker containers
docker stop postgres && docker rm postgres
docker stop pgadmin && docker rm pgadmin
```

## Urls

```bash
# PG Admin
http://localhost:5050/

# PG
http://localhost:5432/

# App
# GETs
http://localhost:1895/api/v1/customers
http://localhost:1895/api/v1/bankers
http://localhost:1895/api/v1/transactions

# POSTs
http://localhost:1895/api/v1/customers
http://localhost:1895/api/v1/bankers
http://localhost:1895/api/v1/transactions

# PATCHs
http://localhost:1895/api/v1/bankers/:id

# DELETEs
http://localhost:1895/api/v1/customers/:id
# http://localhost:1895/api/v1/bankers/:id - not implemented
# http://localhost:1895/api/v1/transactions/:id - not implemented
```

## To be continued ...
