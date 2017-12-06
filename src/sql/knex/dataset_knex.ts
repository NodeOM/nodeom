import { QueryBuilder } from "knex"
import { Dataset, SchemaObject } from "../../core"

export type Where<Attr>  = Partial<SchemaObject<Attr>>
export type Select<Attr> = keyof Attr

export class KnexDataset<Attr, Assoc> extends Dataset<Attr> {
  public rawDataset: QueryBuilder

  constructor(rawDataset: QueryBuilder) {
    super()

    this.rawDataset = rawDataset
  }

  public async toArray(): Promise<Array<Attr & Assoc>> {
    return this.rawDataset
  }

  public select<K extends Select<Attr>>(columns: K[]) {
    return this.clone<Pick<Attr, K>, Assoc>(this.rawDataset.select(columns))
  }

  public where(c: Where<Attr>) {
    return this.clone<Attr, Assoc>(this.rawDataset.where(c))
  }

  public limit(l: number) {
    return this.clone<Attr, Assoc>(this.rawDataset.limit(l))
  }

  public clone<NewAttr, NewAssoc>(rawDataset?: QueryBuilder) {
    const newDataset = rawDataset ? rawDataset : this.rawDataset

    return new KnexDataset<NewAttr, NewAssoc>(newDataset.clone())
  }
}
