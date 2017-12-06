import { Dataset } from "../relation"
import { compare } from "./compare"

export class DatasetMemory<Attr> extends Dataset<Attr> {
  private storage = [] as Attr[]

  constructor(storage?: Attr[]) {
    super()

    this.storage = storage || []
  }

  public async insert(data: Attr) {
    this.storage.push(data)

    return this
  }

  public async delete(data: Attr) {
    const index = this.storage.indexOf(this.storage.find((x) => compare(x, data))) + 1

    this.storage = this.storage.slice(index, index + 1)

    return this
  }

  public async toArray() {
    return this.storage
  }

  public async first() {
    return this.storage[0]
  }
}
