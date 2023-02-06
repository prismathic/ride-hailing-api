# Ride Hailing API

## Introduction
Hi there 👋

This repository contains my submission for an assessment relating to the creation of API endpoints for managing rides (and it's associated entities) for a ride hailing company.

It features a basic REST API responsible for managing drivers, passengers, rides etc.

<p>
The project was built using [Nest.js](https://github.com/nestjs/nest), a framework suited for the purpose of building scalable Node.js server side applications.
</p>

## Prerequisites
To aid with a quick setup of this project on your local environment, I have taken the liberty to add a docker configuration to the setup to make things easier (details regarding this are outlined in the later sections of this document)

However, if you decide not to go the Docker route, the following requirements are needed to successfully run the application:

- NPM (Node Package Manager)
- Node v16+

## Description
This project deals with the management of the following entities

- Drivers (creating a driver, suspending a driver etc)
- Passengers (creating a passenger, listing all passengers)
- Rides (creating a ride, concluding/stopping a ride)

The idea behind this project is to build a simple high-level schema that simulates the process of ordering rides and concluding them.

Seeing that this project is API-based, I have taken the liberty to create a Postman documentation outlining all endpoints on the project (alongside relevant examples). View the documentation [here](https://documenter.getpostman.com/view/13400573/2s935pohwv)

## Installation (With Docker)

- Clone the repository:

```
git clone https://github.com/prismathic/ride-hailing-api.git
```

- Copy the example env file into your env

```
cp .env.example .env
```

- Build the container/image

```
docker-compose up --build
```

- You can now access the project on port <b>5010</b> 🎉

## Installation (Without Docker)

- Clone the repository:

```
git clone https://github.com/prismathic/ride-hailing-api.git
```

- Install dependencies

```bash
$ npm install
```

- Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Links

- [Postman Documentation](https://documenter.getpostman.com/view/13400573/2s935pohwv)
