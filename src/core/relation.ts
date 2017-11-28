import { Schema } from "./schema"

export type Select<S> = keyof S

export class Relation<Structure, Dataset> {
  public readonly name: string
  public readonly schema: Schema<Structure>
  public readonly dataset: Dataset

  constructor(name: string, dataset: Dataset, schema: Schema<Structure>) {
    this.name = name
    this.dataset = dataset
    this.schema = schema
  }
}
