import { Schema, SchemaObject } from "./schema"

export class Mapper<T> {
  private schema: Schema<T>

  constructor(schema: Schema<T>) {
    this.schema = schema
  }

  public single(result: any): T {
    return this.mapObject(result)
  }

  public many(result: any[]): T[] {
    return result.map((o) => this.mapObject(o))
  }

  public mapObject(o: any): T {
    return this.schema.attributes.reduce((acc, attribute) => {
      return Object.assign(acc, { [attribute.name]: o[attribute.name] })
    }, {} as SchemaObject<T>)
  }
}
