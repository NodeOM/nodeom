import { Schema, SchemaRename } from "../core"
import { AttributeSQL, AttributeSQLType, IAttributeSQLMetadata } from "./attribute_sql"

const attributeFactory = (
  name: any,
  type: AttributeSQLType,
  meta: IAttributeSQLMetadata,
) => new AttributeSQL(name, type, meta)

export class SchemaSQL<Attr, Assoc> extends Schema<Attr, Assoc> {
  public readonly attributes: Array<AttributeSQL<keyof Attr>>

  constructor(name: string, attributes?: Array<AttributeSQL<keyof Attr>>) {
    super(attributeFactory, name, attributes)
  }

  public clone<NewAttr, NewAssoc>() {
    return new SchemaSQL<NewAttr, NewAssoc>(this.name, this.attributes as any)
  }

  public project<K extends keyof Attr>(...keys: K[]): SchemaSQL<Pick<Attr, K>, Assoc> {
    return super.project(...keys) as SchemaSQL<Pick<Attr, K>, Assoc>
  }

  public rename<
    K extends keyof Attr,
    J extends string
  >(currentName: K, newName: J): SchemaSQL<SchemaRename<Attr, K, J>, Assoc> {
    return super.rename(currentName, newName) as SchemaSQL<SchemaRename<Attr, K, J>, Assoc>
  }

  public primaryKey() {
    return super.primaryKey() as AttributeSQL<keyof Attr>
  }

  public attribute(name: keyof Attr, type: AttributeSQLType, meta?: IAttributeSQLMetadata) {
    this.addAttribute(new AttributeSQL(name, type, meta))

    return this
  }
}
