import { QueryBuilder } from "knex"
import { SchemaSQL } from "../schema_sql"

export class KnexWritter<Attr, Assoc> {
  private dataset: QueryBuilder
  private schema: SchemaSQL<Attr, Assoc>

  constructor(dataset: QueryBuilder, schema: SchemaSQL<Attr, Assoc>) {
    this.schema = schema
    this.dataset = dataset
  }

  public async insert(data: Attr): Promise<Attr> {
    return this.dataset
      .clone()
      .insert(data)
      .then((pk) => {
        const primaryKeyAttribute = this.schema.primaryKey()

        return Object.assign(data, { [primaryKeyAttribute.name]: pk[0] })
      })
  }
}
