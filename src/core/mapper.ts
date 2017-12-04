import { Schema, SchemaObject } from "./schema"

export class Mapper<Attr, Assoc> {
  private schema: Schema<Attr, Assoc>

  constructor(schema: Schema<Attr, Assoc>) {
    this.schema = schema
  }

  public single(result: any): Attr & Assoc {
    return this.mapObject(result)
  }

  public many(result: any[]): Array<Attr & Assoc> {
    return result.map((o) => this.mapObject(o))
  }

  public mapObject(o: any): Attr & Assoc {
    const attributes = this.schema.attributes.reduce((acc, attribute) => {
      return Object.assign(acc, { [attribute.name]: o[attribute.name] })
    }, {} as SchemaObject<Attr>)

    const associations = this.schema.associations.reduce((acc, assoc) => {
      return Object.assign(acc, { [assoc.name]: o[assoc.name] })
    }, {} as SchemaObject<Assoc>)

    return Object.assign({}, attributes, associations)
  }
}
