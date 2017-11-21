import { DataTypes } from "sequelize"
import { Attribute } from "../core"

export type AttributeSQLType = keyof DataTypes

export interface IAttributeSQLMetadata {
  primaryKey?: boolean
  allowNull?: boolean,
  defaultValue?: any
  field?: string
}

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
}
