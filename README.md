# Template API app

## Install
To install all packages run from project repository:
```bash
$ yarn
```

## Launch

### Using of docker-compose for local deployment

Run it from root directory:

```bash
$ docker-compose up
```

Using this command will start 3 containers: `redis`, `postgres` and `api`.

After adding any new module to the project directory use:

```bash
$ docker-compose up --build
```

### Using of yarn for local deployment

To start project, run it from project repository:
```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Database
Please fulfill `.env` file base on `.env.template` to run PostgreSQL

## Redis

Please fulfill `.env` file base on `.env.template` to run Redis

## File structure

In case creating a new service, module, controller, entity or spec file, please use default file structure:
* all providers, like database, redis, message queues or another third parties should be stored by `src/providers`
* `src/middleware` uses for middlewares, also it has default `requset-logger.middleware.ts`
* in order to provide additional logs security, you should use LoggerService, stored by `src/logger`
* directory `src/modules` uses default file structure:
  * `src/modules/configurations` only get and validate app configurations
  * `src/modules/cron-scheduler` only to store cron schedule (without any logic)
  * `src/modules/models` only to store low-level services with access only to related database's table/entity
  * `src/modules/processors` to store services with complicated logic with access to more than 1 service from fundamentals or providers
  * `src/modules/utils` to provide access to common for all app utils, like math etc.
  * `src/modules/apis` for all provided by app controllers with related modules/services:
    * `src/modules/apis/admins-api` - all provided by app APIs for administrators part of app
    * `src/modules/apis/common-api` - all provided by app APIs for common part of app

## Entities, models services and DTOs

All entities should be created with extending `/src/modules/models/base/base.entity.ts`

The `BaseEntity` have 3 mandatory fields for any new entity:
* `id: uuid`
* `createdAt: timestamp with tz`
* `updatedAt: timestamp with tz`

You don't need to set this fields additionally (please avoid code duplication).

In similar way you should use `BaseService` and `GetBaseEntityResponseDto` to extending this classes in your fundamentals services and DTOs:
* `/src/modules/models/base/base.service.ts` - implemented `create()`, `findOne()`, `update()`, `remove()` etc. public methods
* `/src/modules/models/base/dtos/get-base-entity-response.dto.ts` - implemented `id`, `createdAt`, `updatedAt` fields with Swagger properties

For all methods of `BaseService`, in case you need database transactions, you have to use `entityManager: EntityManager`.
EntityManager is always the second optional parameter of each `BaseService's` extended method.

## Migrate

Nest.js uses TypeORM. It has built in methods to migrate and synchronize DB.

If you're updating entities, you would need to create and run a migration to apply it.

To generate a migration from entities changes:
```bash
$ yarn typeorm:generate <migration name in pascal case>
```

To create empty migration:
```bash
$ yarn typeorm:create <migration name in pascal case>
```

To manual run migration:
```bash
$ yarn typeorm:run
```

To revert the last migration:
```bash
$ yarn typeorm:revert
```

## Default features

### Request-logger middleware

In order to provide detailed logs with time measurement of response time, has been implemented `RequestLoggerMiddleware`.

If you need add details to default request/response logs, please use `src/middlewares/request-logger.middleware.ts`.

### Default logger

In order to provide unified approach to logger methods, has been implemented `LoggerService`.

To use any logger method, you should provide:
* method name
* log string info
* meta JSON data (optional)

LoggerService also provided hiding from logs restricted fields and other features.
