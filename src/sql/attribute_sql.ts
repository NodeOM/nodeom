import { Attribute, IAttributeMeta } from "../core"

export type AttributeSQLType = any

// tslint:disable:no-empty-interface
export interface IAttributeSQLMetadata extends IAttributeMeta { }
// tslint:enable:no-empty-interface

export class AttributeSQL<T> extends Attribute<T> {
  public readonly type: AttributeSQLType
  public readonly meta?: IAttributeSQLMetadata

  constructor(
    name: T,
    type: AttributeSQLType,
    meta?: IAttributeSQLMetadata,
  ) {
    super(name, type, meta)
  }

  get columnName() {
    return this.name
  }
}
