import { Relation } from "../relation"

export class Loaded<Attr, K extends Relation<Attr, {}, any>> {
  private source: K
  private collection: Attr[]

  constructor(source: K, collection: Attr[]) {
    this.source = source
    this.collection = collection
  }

  public async one() {
    return this.first()
  }

  public toArray() {
    return this.mapper().many(this.collection)
  }

  public async first() {
    return this.mapper().single(this.collection[0])
  }

  private mapper() {
    return this.source.mapper()
  }
}
