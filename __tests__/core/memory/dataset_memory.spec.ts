import "jest"
import { DatasetMemory } from "../../../src/core"
import { IUserAttributes } from "../../support"

async function load(dataset: DatasetMemory<IUserAttributes>) {
  await dataset.insert({ id: 1, name: "Test", email: "test@test.com" })
  await dataset.insert({ id: 2, name: "Test 2", email: "test2@test.com" })
}

describe("DatasetMemory", () => {
  let dataset: DatasetMemory<IUserAttributes>

  beforeEach(() => {
    dataset = new DatasetMemory<IUserAttributes>()
  })

  describe("first", () => {
    beforeEach(async () => {
      await load(dataset)
    })

    it("returns the first element", async () => {
      expect(dataset.first()).resolves.toEqual(expect.objectContaining(
        { id: 1, name: "Test", email: "test@test.com" },
      ))
    })
  })

  describe("toArray", () => {
    beforeEach(async () => {
      await load(dataset)
    })

    it("returns all the elements", async () => {
      expect(dataset.toArray()).resolves.toEqual(expect.objectContaining([
        { id: 1, name: "Test", email: "test@test.com" },
        { id: 2, name: "Test 2", email: "test2@test.com" },
      ]))
    })
  })

  describe("insert", () => {
    it("adds the data to the storage", async () => {
      await dataset.insert({ id: 1, name: "Test", email: "test@test.com" })

      expect(dataset.size()).resolves.toBe(1)
    })
  })

  describe("delete", () => {
    beforeEach(async () => {
      await dataset.insert({ id: 1, name: "Test", email: "test@test.com" })
    })

    it("remove the data to the storage", async () => {
      await dataset.delete({ id: 1, name: "Test", email: "test@test.com" })

      expect(dataset.size()).resolves.toBe(0)
    })
  })
})
