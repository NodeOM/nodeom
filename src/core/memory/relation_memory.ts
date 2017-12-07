import { Relation } from "../relation"
import { Schema } from "../schema"
import { DatasetMemory } from "./dataset_memory"

export class RelationMemory<Attr, Assoc> extends Relation<Attr, Assoc, DatasetMemory<Attr>> {

  public project<K extends keyof Attr>(...attributes: K[]) {
    const projectedSchema = this.schema.project(...attributes)

    return this.cloneWithSchema(projectedSchema)
  }

  public insert(data: Attr & Assoc) {
    return this.dataset.insert(data)
  }

  public delete(data: Attr & Assoc) {
    return this.dataset.delete(data)
  }

  protected cloneWithDataset(dataset: DatasetMemory<Attr>): RelationMemory<Attr, Assoc> {
    return new RelationMemory(this.name, dataset, this.schema)
  }

  protected cloneWithSchema<NewAttr, NewAssoc>(schema: Schema<NewAttr, NewAssoc>): RelationMemory<NewAttr, NewAssoc> {
    return new RelationMemory(this.name, this.dataset as any, schema)
  }
}
