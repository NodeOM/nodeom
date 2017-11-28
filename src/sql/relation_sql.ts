import { QueryBuilder } from "knex"
import { Mapper, Relation, SchemaObject } from "../core"
import { SchemaSQL } from "./schema_sql"

export type Where<T>      = Partial<SchemaObject<T>>
export type Select<T>     = keyof T
export type Join<T>       = NestedJoin<Partial<T>> | keyof T
export type NestedJoin<T> = { [P in keyof T]: NestedJoin<Partial<T[P]>> | keyof T[P] }

export interface ICloneOptions<T> {
  dataset?: QueryBuilder
  schema?: SchemaSQL<T>
}

export class RelationSQL<T> extends Relation<T, QueryBuilder> {
  public readonly schema: SchemaSQL<T>

  public async insert(data: T): Promise<T> {
    return this.clone()
      .dataset
      .insert(data)
      .then((pk) => {
        const primaryKeyAttribute = this.schema.primaryKey()

        return Object.assign(data, { [primaryKeyAttribute.name]: pk[0] })
      })
  }

  public select<K extends Select<T>>(...attributes: K[]) {
    return new RelationSQL(
      this.name,
      this.dataset,
      this.schema.project(...attributes) as SchemaSQL<Pick<T, K>>,
    )
  }

  public where(c: Where<T>): RelationSQL<T> {
    return this.clone({ dataset: this.dataset.where(c) })
  }

  public limit(l: number) {
    return this.clone({ dataset: this.dataset.limit(l) })
  }

  public async byPk(pk: any): Promise<T> {
    const primaryKey = this.schema.primaryKey()

    return this
      .where({ [primaryKey.columnName]: pk } as SchemaObject<T>)
      .first()
  }

  public async first(): Promise<T> {
    return this.dataset
      .first()
      .select(this.schema.attributes.map((x) => x.columnName))
      .then((r) => new Mapper(this.schema).single(r))
  }

  public async toArray(): Promise<T[]> {
    return this.dataset
      .select(this.schema.attributes.map((x) => x.columnName))
      .then((r) => {
        console.info(r)
        return new Mapper(this.schema).many(r)
      })
  }

  protected clone<K>(options?: ICloneOptions<K>): RelationSQL<K> {
    const dataset = options && options.dataset ? options.dataset : this.dataset
    const schema  = options && options.schema ? options.schema : this.schema

    return new RelationSQL(this.name, dataset.clone(), schema as any)
  }
}
