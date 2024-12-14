<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank">
    <img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" />
  </a>
</p>

## Description

API of VanillaTech repository.

## Project structure
```bash
credentials
src/
├── entities/
│   ├── disease-record.entity.ts
│   ├── disease.entity.ts
│   ├── record.entity.ts
│   ├── refresh-token.entity.ts
│   └── user.entity.ts
├── modules/
│   ├── auth/
│   │   ├── dtos/
│   │   │   ├── login.dto.ts
│   │   │   └── register.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── diseases/
│   │   ├── disease.controller.ts
│   │   ├── disease.service.ts
│   │   └── disease.module.ts
│   ├── health/
│   │   ├── health-check.controller.ts
│   │   ├── health-check.service.ts
│   │   └── health-check.module.ts
│   ├── record/
│   │   ├── dtos/
│   │   │   └── create.dto.ts
│   │   ├── record.controller.ts
│   │   ├── record.service.ts
│   │   └── record.module.ts
│   ├── scan/
│   │   ├── scan.controller.ts
│   │   ├── scan.service.ts
│   │   └── scan.module.ts
│   └── user/
│       ├── dtos/
│       │   ├── login.dto.ts
│       │   └── register.dto.ts
│       ├── user.controller.ts
│       ├── user.service.ts
│       └── user.module.ts
├── common/
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── rate-limiter.middleware.ts
│   └── guards/
│       ├── auth.guard.ts
│       └── guest.guard.ts
├── config/
│   └── orm.config.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
.env
Dockerfile
package.json
tsconfig.build.json
tsconfig.json
README.md
```

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production
$ npm run start:prod
```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
