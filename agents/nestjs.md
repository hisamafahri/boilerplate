# AGENTS.md

## General Rules

- Use `pnpm`.
- Follow the existing implementation and conventions at all times, including but not limited to:
  - naming
  - file structure
  - module structure
  - import ordering
  - code ordering
  - dependency injection patterns
  - decorators
  - validation patterns
  - error handling
  - response formats
- Do not introduce new architectural patterns when an existing pattern already exists, unless explicitly asked

## Error Handling

- Do not use exceptions for application/business errors.
- Use error-as-value via `better-result`.
- Do not use `throw` for expected application errors.
- Follow the existing `better-result` patterns in the codebase.

Reference:
https://raw.githubusercontent.com/dmmulroy/better-result/refs/heads/main/README.md

### Standard Error Response

All HTTP errors must follow this format:

```json
{
  "error": "error_code_enum",
  "error_description": "Human readable error description"
}
````

* `error` must use the existing error-code enum/pattern.
* Communicate with me in English.
* Do not expose internal errors, stack traces, database errors, or third-party error messages directly to clients.

## NestJS Architecture

- This is an HTTP service built with NestJS.
- Read the official docs here: https://docs.nestjs.com/llms.txt
- Use NestJS conventions for HTTP-related concerns:

* `controllers`

  * Handle HTTP requests.
  * Define routes and HTTP methods.
  * Validate request payloads, params, query parameters, and headers.
  * Call the appropriate use cases.
  * Map use-case results into HTTP responses.
  * Should contain minimal business logic.
  * Filename suffixed with `.controller.ts`.

* `usecases`

  * Contain application/business logic.
  * Coordinate multiple services when necessary.
  * Should not depend on HTTP-specific concerns such as `Request`, `Response`, HTTP status codes, or NestJS controller decorators.
  * Return `better-result` values rather than throwing application errors.

* `services`

  * Handle interaction with external systems.
  * Examples:

    * database access
    * third-party APIs
    * IAM
    * queues
    * storage
    * external HTTP services
  * Each service function should be atomic: do one thing and do it well.
  * Filename suffixed with `.service.ts`.

* `modules`

  * Define NestJS module boundaries.
  * Register controllers, providers, imports, and exports.
  * Keep module dependencies explicit.

Each architectural layer should have its own directory where appropriate.

Example:

```text
src/
├── modules/
│   └── users/
│       ├── controllers/
│       │   └── users.controller.ts
│       ├── usecases/
│       │   ├── create-user.usecase.ts
│       │   └── get-user.usecase.ts
│       ├── services/
│       │   └── users.service.ts
│       ├── dto/
│       └── users.module.ts
├── common/
└── ...
```

## NestJS Dependency Injection

* Prefer NestJS dependency injection over manually constructing dependencies.
* Use constructor injection unless the existing codebase uses another established pattern.
* Do not instantiate services/providers manually when they are already registered with NestJS.
* Keep providers focused on a single responsibility.
* Do not inject a controller into another controller.
* Avoid circular dependencies. If one already exists, follow the existing implementation unless explicitly asked to refactor it.

## Controllers

Controllers should be thin.

A controller should generally:

1. Receive the HTTP request.
2. Validate/parse the input.
3. Call a use case.
4. Handle the returned `better-result`.
5. Return the appropriate HTTP response.

Do not put substantial business logic inside controllers.

Prefer DTOs for request payloads rather than accepting arbitrary objects.

Follow the existing validation approach in the project. Do not introduce a different validation library or pattern without an explicit reason.

## Use Cases

* Use cases represent application-level operations.
* Prefer one use case per meaningful application operation.
* Use cases should not know about HTTP.
* Use cases should return `better-result` values.
* Use cases should not throw expected application/business errors.
* Keep use cases focused and composable.

Example conceptual flow:

```text
HTTP Request > Controller > Usecase > Service > External system/Database
```

## Services

* Services encapsulate external-system interactions.
* Keep service functions atomic.
* Do not put unrelated business workflows into services.
* Services should return `better-result` values where errors are expected and recoverable.
* Follow existing service abstractions before introducing new ones.

Examples:

```text
IAM client
Database access
S3 / object storage
Redis
Third-party APIs
Message queues
```

## DTOs and Validation

* Follow the existing DTO and validation pattern.
* Do not introduce a second validation approach into an existing module.
* Keep request validation at the controller/DTO boundary.
* Do not duplicate validation unnecessarily inside use cases or services.
* Use explicit types for request and response data.

## TypeScript Rules

* Do not cast types.

Avoid:

```ts
something as Something
something as any
something as unknown
```

Instead, create a properly typed variable or fix the underlying type definition.

* Prefer arrow functions for functions:

```ts
const myFunction = () => {}
```

instead of:

```ts
function myFunction() {}
```

* For checking whether an array contains elements, prefer:

```ts
if (array.length) {}
```

instead of:

```ts
if (array.length !== 0) {}
if (array.length > 0) {}
```

* Use `date-fns` for date-related operations, including:

  * date formatting
  * date comparison
  * checking whether a date is in the past
  * checking whether a date is in the future
  * date arithmetic

* Use `randomUUID` from `node:crypto` for random UUID generation instead of the `uuid` package.

```ts
import { randomUUID } from 'node:crypto'
```

* When using Zod `safeParse`, always use `satisfies ExpectedType` where applicable so incorrect response types are detected at compile time.

Follow the existing project's TypeScript and ESLint configuration. Do not weaken type safety to make code compile.

## NestJS Exceptions

Do not use NestJS exceptions such as:

```ts
throw new BadRequestException(...)
throw new NotFoundException(...)
throw new UnauthorizedException(...)
```

for expected application/business errors.

Use `better-result` instead and let the controller map the result to the appropriate HTTP response.

Do not introduce exception filters as an alternative application-error mechanism unless explicitly requested.

Framework-level exceptions may only be used where required by an existing NestJS/framework mechanism and should follow the existing project convention.

## Comments and Documentation

* Do not add comments to code.
* Do not add comments explaining obvious code.
* Do not add TODO comments unless explicitly requested.
* I will ask if comments are needed.

For documentation:

* Always use Markdown.
* Keep documentation brief and concise.
* Cover the necessary details without unnecessary explanation.
* Do not use emojis.
* Do not use Markdown styling such as bold or italic unless explicitly requested.
