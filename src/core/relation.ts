import { Schema } from "./schema"

export type Select<S> = keyof S

export class Relation<T, R> {
  public readonly name: string
  public readonly dataset: R
  public readonly schema: Schema<T>

  constructor(name: string, dataset: R, schema: Schema<T>) {
    this.name = name
    this.dataset = dataset
    this.schema = schema
  }
}
