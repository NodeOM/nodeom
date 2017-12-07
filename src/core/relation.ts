import { Mapper } from "./mapper"
import { Loaded } from "./relation/loaded"
import { Schema } from "./schema"

export type Select<S> = keyof S

export abstract class Dataset<Attr> {
  public abstract toArray(): Promise<Attr[]>

  public async size() {
    return this.toArray().then((x) => x.length)
  }
}

export class Relation<Attr, Assoc, K extends Dataset<Attr>> {
  public readonly name: string
  public readonly schema: Schema<Attr, Assoc>
  public readonly dataset: K

  constructor(name: string, dataset: K, schema: Schema<Attr, Assoc>) {
    this.name = name
    this.dataset = dataset
    this.schema = schema
  }

  public async call(): Promise<Loaded<Attr, Relation<Attr, {}, any>>> {
    const collection = await this.dataset.toArray()

    return new Loaded(this as any, collection)
  }

  public mapper() {
    return new Mapper(this.schema)
  }
}
