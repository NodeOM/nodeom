# NodeOM [![npm version](https://badge.fury.io/js/nodeom.svg)](https://badge.fury.io/js/nodeom) [![codecov](https://codecov.io/gh/NodeOM/nodeom/branch/master/graph/badge.svg)](https://codecov.io/gh/NodeOM/nodeom) [![CircleCI](https://circleci.com/gh/NodeOM/nodeom.svg?style=svg)](https://circleci.com/gh/NodeOM/nodeom)

NodeOM is a persistence library written in Typescript for Node. It supports high level abstractions to manipulate data from different persistence engines in a typesafe manner. Inspired by [rom-rb](http://rom-rb.org/) ❤️

> Active development. Not ready for usage at this moment. ⚠️

## Concepts

NodeOM defines multiple abstractions that are independent from the the data storage. This abstractions allow the interoperation between different persistence engines. For example, you can have a relation backed by Postgres database and another relation powered by Redis and operate between them.

### Schema

A schema defines how data is structured. Schemas are powered by Generics to allow type safety operations between them.

### Relations

A relation is a set of tuples that provide database specific APIs for reading and writing. A sql adapter will expose the common operations that are allowed in sql like `select`, `where` or `join` while a redis adapter will expose operations like `hget`, `set` or `lpop`

### Gateway

A gateway is database specific object that manages the connection with the database. Gateways are also aware of the relations that belong to him.

## Example

This is a very simple example of what is possible at the moment with NodeOM.

```typescript
export interface IUserAttributes {
  id?: number
  email: string
  name?: string
  age?: number
}

export interface ITestGateway {
  users: IUserAttributes
  // blogs: IBlogAttributes
  // posts: IPostAttributes
}

const gateway = new GatewaySQL<ITestGateway>({
  client: "sqlite3",
  connection: {
    filename: ":memory:",
  },
})

await gateway.connect()

await migrateSQLSchema(gateway)

const userSchema = new SchemaSQL<IUserAttributes>("users")

userSchema.attribute("id", "INTEGER", { primaryKey: true })
userSchema.attribute("email", "STRING")
userSchema.attribute("name", "STRING")
userSchema.attribute("age", "INTEGER")

gateway.registerSchemas([userSchema])

// Select only the attribute you need.
gateway.relation("users").select("id", "email").toArray()

// Find by primaryKey
gateway.relation("users").byPk(44)

// Find the first tuple
gateway.relation("users").first()

// All tuples
gateway.relation("users").toArray()

// Filter by some condition (only equals is supported)
gateway.relation("users").where({ name: "John" }).toArray()

// Limit the returned tuples
gateway.relation("users").limit(10).toArray()
```
