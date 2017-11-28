import { Dissoc } from "subtractiontype.ts"
import { Schema } from "../core"
import { AttributeSQL, AttributeSQLType, IAttributeSQLMetadata } from "./attribute_sql"

export type SchemaRename<T, K extends keyof T, J extends string> = Dissoc<T, K> & { [j in J]: T[K] }

const attributeFactory = (
  name: any,
  type: AttributeSQLType,
  meta: IAttributeSQLMetadata,
) => new AttributeSQL(name, type, meta)

export class SchemaSQL<T> extends Schema<T> {
  public readonly attributes: Array<AttributeSQL<keyof T>>

  constructor(name: string, attributes?: Array<AttributeSQL<keyof T>>) {
    super(attributeFactory, name, attributes)
  }

  public clone<K>() {
    return new SchemaSQL<K>(this.name, this.attributes as any)
  }

  public project<K extends keyof T>(...keys: K[]): SchemaSQL<Pick<T, K>> {
    return super.project(...keys) as SchemaSQL<Pick<T, K>>
  }

  public rename<K extends keyof T, J extends string>(currentName: K, newName: J): SchemaSQL<SchemaRename<T, K, J>> {
    return super.rename(currentName, newName) as SchemaSQL<SchemaRename<T, K, J>>
  }

  public primaryKey() {
    return super.primaryKey() as AttributeSQL<keyof T>
  }

  public attribute(name: keyof T, type: AttributeSQLType, meta?: IAttributeSQLMetadata) {
    this.addAttribute(new AttributeSQL(name, type, meta))

    return this
  }
}
