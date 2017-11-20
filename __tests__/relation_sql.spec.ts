import "jest"
import { GatewaySQL, RelationSQL, SchemaSQL } from "../src"

const config = {
  dialect: "sqlite",
  storage: ":memory:",
}

interface IUserAttributes {
  id: number
  email: string
  name?: string
  age?: number
  blogId?: number
  blog?: IBlogAttributes
  posts?: IPostAttributes[]
}

interface IBlogAttributes {
  id: number
  name: string
  users?: IUserAttributes[]
}

interface IPostAttributes {
  id: number
  authorId?: number
  author?: IUserAttributes
}

describe("RelationSQL", () => {
  let gateway: GatewaySQL
  let rUser: RelationSQL<IUserAttributes>
  let rBlog: RelationSQL<IBlogAttributes>
  let rPost: RelationSQL<IPostAttributes>

  beforeEach(async () => {
    gateway = new GatewaySQL(config)

    const userSchema = new SchemaSQL<IUserAttributes>("users")
    const blogSchema = new SchemaSQL<IBlogAttributes>("blogs")
    const postSchema = new SchemaSQL<IPostAttributes>("posts")

    userSchema.attribute("id", "INTEGER", { primaryKey: true })

    userSchema.attribute("email", "STRING")
    userSchema.attribute("name", "STRING")
    userSchema.attribute("age", "INTEGER")
    userSchema.attribute("blogId", "INTEGER")
    userSchema.belongsTo("blog")
    userSchema.hasMany("posts", { foreignKey: "authorId" })

    blogSchema.attribute("id", "INTEGER", { primaryKey: true })
    blogSchema.attribute("name", "STRING")
    blogSchema.hasMany("users")

    postSchema.attribute("id", "INTEGER", { primaryKey: true })
    postSchema.attribute("authorId", "INTEGER")
    postSchema.belongsTo("author", { relationName: "users" })

    gateway.registerSchemas([userSchema, blogSchema, postSchema])

    rUser = gateway.relations.find((x) => x.name === "users")
    rBlog = gateway.relations.find((x) => x.name === "blogs")
    rPost = gateway.relations.find((x) => x.name === "posts")

    await rUser.dataset.sync({ force: true })
    await rBlog.dataset.sync({ force: true })
    await rPost.dataset.sync({ force: true })

    await rBlog.insert({ id: 1, name: "blogTable 1" })
    await rBlog.insert({ id: 2, name: "blogTable 2" })

    await rUser.insert({ id: 1, email: "test1@test.com", name: "Test 1", age: 10, blogId: 1 })
    await rUser.insert({ id: 2, email: "test2@test.com", name: "Test 2", age: 20, blogId: 2 })
    await rUser.insert({ id: 3, email: "test3@test.com", name: "Test 3", age: 30 })
    await rUser.insert({ id: 4, email: "test4@test.com", name: "Test 4", age: 40 })

    await rPost.insert({ id: 1, authorId: 1 })
  })

  describe("#select", async () => {
    describe("when selecting the id and email", () => {
      it("doesn't return the name property", async () => {
        const user = await rUser
          .select("id", "email")
          .first()

        expect(Object.keys(user)).not.toContain("name")
      })
    })
  })

  describe("#join", async () => {
    describe("when performing a simple join", () => {
      it("returns only the matching blogs", async () => {
        const blogs = await rBlog
          .join("users")
          .select("id")
          .toArray()

        expect(blogs).toEqual([{ id: 1 }, { id: 2 }])
      })
    })

    describe("when performing a deep join", () => {
      it("returns only the matching blogs that contain users that have posts", async () => {
        const blogs = await rBlog
          .join({ users: "posts" })
          .select("id")
          .toArray()

        expect(blogs).toEqual([{ id: 1 }])
      })
    })
  })

  describe("#byPk", () => {
    it("returns the user 2", async () => {
      const user = await rUser
        .select("id")
        .byPk(2)

      expect(user).toEqual({ id: 2 })
    })
  })

  describe("#first", () => {
    it("returns the first user", async () => {
      const user = await rUser
        .select("id")
        .first()

      expect(user).toEqual({ id: 1 })
    })
  })

  describe("#where", () => {
    describe("when using one where condition", () => {
      it("returns the filtered users", async () => {
        const users = await rUser
          .where({ name: "Test 2" })
          .select("id")
          .toArray()

        expect(users).toEqual([{ id: 2 }])
      })
    })

    describe("when chaining where conditions", () => {
      it("returns the filtered users", async () => {
        const users = await rUser
          .where({ email: { $like: "%@test.com" }})
          .where({ age: { $gte: 35 }})
          .select("id")
          .toArray()

        expect(users).toEqual([{ id: 4 }])
      })
    })
  })

  describe("#limit", () => {
    it("returns an array with the limit count", async () => {
      const users = await rUser
        .select("id")
        .limit(2)
        .toArray()

      expect(users).toEqual([{ id: 1 }, { id: 2 }])
    })
  })
})
