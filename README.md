
## Note

Because this is a public portfolio repository, some internal or sensitive files are intentionally **not pushed** to GitHub, including:

- `src/common/`
- `src/cores/`
- `src/infrastructures/`
- `src/middlewares/`

These directories may contain core logic, middleware, or reusable components that are proprietary or not meant for public distribution. The purpose of this repository is to showcase general structure and coding style only.

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

This boilerplate use **DDD Archicture**, please read the [Official article](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) to get more information about DDD Architecture.

## Prerequisite

This project requires docker to run services, such as Database, Cache, SMTP, etc.

```
- Docker
```

Please visit the [Docker official site](https://www.docker.com/products/docker-desktop/) to download docker and the [Documentation](https://docs.docker.com/) to get more information about docker usage.

#### Services
- [MySQL](https://hub.docker.com/_/mysql) (default)
- [Redis](https://hub.docker.com/_/redis) (default) - switch to [Dragonfly](https://www.dragonflydb.io/) for performance
- [Fake SMTP](https://hub.docker.com/r/rnwood/smtp4dev) (default)
- [MQTT5](https://hub.docker.com/_/eclipse-mosquitto) (default)

## Installation

#### Project

```bash
# install node modules
$ pnpm install

# copy the env example file to local env mode - [local, development, productionn]
$ cp .env.example .env.local
```

#### Docker

To run docker service, type:
```bash
$ docker compose up -d
```

To stop docker service, type:
```bash
$ docker compose down
```

To run MQTT5 you must edit the password, in the following way:
```bash
# show running docker container
$ docker ps

# login interactively into the mqtt container
$ docker exec -it <container-id-mqqt-service> sh

# Create new password file and add user and it will prompt for password
$ mosquitto_passwd -c /mosquitto/config/pwfile root

# exit
exit
```

## Running the app


#### Documentation

```bash
$ pnpm run doc
```

#### App

```bash
# production
$ pnpm run start

# watch local mode [env.local environment]
$ pnpm run start:local

# watch development mode [env.development.local environment]
$ pnpm run start:dev

# watch production mode [env.production.local environment]
$ pnpm run start:prod
```

## Test

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
