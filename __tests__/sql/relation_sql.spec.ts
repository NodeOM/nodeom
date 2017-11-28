import "jest"
import { GatewaySQL, RelationSQL } from "../../src"
import { createTestSQLGatewayWithSchemas, ITestGateway, IUserAttributes } from "../support"

describe("RelationSQL", () => {
  let gateway: GatewaySQL<ITestGateway>
  let relation: RelationSQL<IUserAttributes>

  beforeEach(async () => {
    gateway = await createTestSQLGatewayWithSchemas()
    relation = gateway.relation("users")
  })

  describe("#select", async () => {
    describe("when selecting the id and email", () => {
      it("doesn't return the name property", async () => {
        const user = await relation
          .select("id", "email")
          .first()

        expect(Object.keys(user)).not.toContain("name")
      })
    })
  })

  describe("#byPk", () => {
    it("returns the user 2", async () => {
      const user = await relation
        .select("id")
        .byPk(2)

      expect(user).toEqual({ id: 2 })
    })
  })

  describe("#first", () => {
    it("returns the first user", async () => {
      const user = await relation
        .select("id")
        .first()

      expect(user).toEqual({ id: 1 })
    })
  })

  describe("#where", () => {
    it("returns the filtered users", async () => {
      const users = await relation
        .where({ email: "test2@test.com" })
        .select("id")
        .toArray()

      expect(users).toEqual([{ id: 2 }])
    })
  })

  describe("#limit", () => {
    it("returns an array with the limit count", async () => {
      const users = await relation
        .select("id")
        .limit(2)
        .toArray()

      expect(users).toEqual([{ id: 1 }, { id: 2 }])
    })
  })
})
