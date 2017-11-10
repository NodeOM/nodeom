import * as sequelize from "sequelize"
import { Relation } from "../core"
import { Join, Reading, Select, Where } from "./relation/reading"
import { Writing } from "./relation/writing"
import { SchemaSQL } from "./schema_sql"

export type Dataset<T> = sequelize.Model<sequelize.Instance<T>, T>

export class RelationSQL<T> extends Relation<T, Dataset<T>> {
  public readonly schema: SchemaSQL<T>
  private readonly reading: Reading<T>

  constructor(
    name: string,
    dataset: Dataset<T>,
    schema: SchemaSQL<T>,
    reading?: Reading<T>,
  ) {
    super(name, dataset, schema)

    this.reading = reading || new Reading()
  }

  public insert(data: T): Promise<T> {
    return new Writing(data).insert(this)
  }

  public select<K extends Select<T>>(...attributes: K[]) {
    return new RelationSQL(
      this.name,
      this.dataset as any,
      this.schema.project(...attributes) as SchemaSQL<Pick<T, K>>,
      this.reading.clone() as any,
    )
  }

  public where(c: Where<T>): RelationSQL<T> {
    return new RelationSQL(
      this.name,
      this.dataset,
      this.schema,
      this.reading.addCondition(c).clone(),
    )
  }

  public limit(l: number) {
    return new RelationSQL(
      this.name,
      this.dataset,
      this.schema,
      this.reading.addLimit(l).clone(),
    )
  }

  public join(j: Join<T>): RelationSQL<T> {
    return new RelationSQL(
      this.name,
      this.dataset,
      this.schema,
      this.reading.addJoin(j).clone(),
    )
  }

  public async byPk(pk: any): Promise<T> {
    return this.reading.byPk(this, pk)
  }

  public async first(): Promise<T> {
    return this.reading.first(this)
  }

  public async toArray(): Promise<T[]> {
    return this.reading.toArray(this)
  }
}
