import { Relation, SchemaObject } from "../core"
import { KnexDataset, Select, Where } from "./knex/dataset_knex"
import { KnexWritter } from "./knex/writer"
import { SchemaSQL } from "./schema_sql"

export class RelationSQL<Attr, Assoc> extends Relation<Attr, Assoc, KnexDataset<Attr, Assoc>> {
  public readonly schema: SchemaSQL<Attr, Assoc>

  public async insert(data: Attr) {
    return new KnexWritter(this.dataset.rawDataset, this.schema).insert(data)
  }

  public select<K extends Select<Attr>>(...attributes: K[]) {
    const projectedSchema = this.schema.project(...attributes) as SchemaSQL<Pick<Attr, K>, Assoc>

    return this
      .cloneWithDataset(this.dataset.select(attributes as any) as any)
      .cloneWithSchema(projectedSchema)
  }

  public where(c: Where<Attr>) {
    return this.cloneWithDataset(
      this.dataset.where(c),
    )
  }

  public limit(l: number) {
    return this.cloneWithDataset(
      this.dataset.limit(l),
    )
  }

  public async byPk(pk: any) {
    const primaryKey = this.schema.primaryKey()

    return this
      .where({ [primaryKey.columnName]: pk } as SchemaObject<Attr>)
      .call()
      .then((x) => x.one())
  }

  public async first(): Promise<Attr> {
    return this.limit(1).call().then((x) => x.first())
  }

  public async toArray(): Promise<Attr[]> {
    return this.call().then((x) => x.toArray())
  }

  protected cloneWithDataset(dataset: KnexDataset<Attr, Assoc>): RelationSQL<Attr, Assoc> {
    return new RelationSQL(this.name, dataset.clone<Attr, Assoc>(), this.schema)
  }

  protected cloneWithSchema<NewAttr, NewAssoc>(schema: SchemaSQL<NewAttr, NewAssoc>): RelationSQL<NewAttr, NewAssoc> {
    return new RelationSQL(this.name, this.dataset.clone(), schema)
  }
}
