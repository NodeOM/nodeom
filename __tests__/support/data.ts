import { GatewaySQL, RelationSQL, SchemaSQL } from "../../src/sql"

export interface IUserAttributes {
  id?: number
  email: string
  name?: string
  age?: number
}

export interface IBlogAttributes {
  id: number
  name: string
}

export interface IPostAttributes {
  id: number
  text: string
  authorId?: number
  blogId?: number
}

export interface ITestGateway {
  users: IUserAttributes
  blogs: IBlogAttributes
  posts: IPostAttributes
}

export async function createTestSQLGatewayWithSchemas() {
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

  await seedSQLDatabase(gateway)

  return gateway
}

async function seedSQLDatabase(gateway: GatewaySQL<ITestGateway>) {
  const relation = gateway.relation("users") as RelationSQL<IUserAttributes>

  await relation.insert({ id: 1, email: "test1@test.com", name: "Test 1", age: 10 })
  await relation.insert({ id: 2, email: "test2@test.com", name: "Test 2", age: 20 })
  await relation.insert({ id: 3, email: "test3@test.com", name: "Test 3", age: 30 })
  await relation.insert({ id: 4, email: "test4@test.com", name: "Test 4", age: 40 })
}

async function migrateSQLSchema(gateway: GatewaySQL<ITestGateway>) {
  const sb = gateway.connection.schema

  return sb.createTable("users", (table) => {
    table.increments("id")
    table.string("name").nullable()
    table.string("email").nullable()
    table.integer("age").nullable()
  })
  .createTable("blogs", (table) => {
    table.increments("id")
    table.string("name").nullable()
  })
  .createTable("posts", (table) => {
    table.increments("id")
    table.string("text").notNullable()
    table.string("blog_id").references("id").inTable("blogs")
    table.string("author_id").references("id").inTable("users")
  })
}
