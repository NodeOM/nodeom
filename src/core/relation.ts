import { Mapper } from "./mapper"
import { Loaded } from "./relation/loaded"
import { Schema } from "./schema"

export type Select<S> = keyof S

export interface IDataset<Attr, Assoc> {
  toArray(): Promise<Array<Attr & Assoc>>
  first(): Promise<Attr & Assoc>
}

export class Relation<Attr, Assoc, K extends IDataset<Attr, Assoc>> {
  public readonly name: string
  public readonly schema: Schema<Attr, Assoc>
  public readonly dataset: K

  constructor(name: string, dataset: K, schema: Schema<Attr, Assoc>) {
    this.name = name
    this.dataset = dataset
    this.schema = schema
  }

  public call(): Loaded<Attr, Assoc, K, Relation<Attr, Assoc, K>> {
    return new Loaded(this, this.mapper())
  }

  protected mapper() {
    return new Mapper(this.schema)
  }
}
