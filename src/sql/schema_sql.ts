import { DataTypes } from "sequelize"
import { Dissoc } from "subtractiontype.ts"
import { Attribute, AttributeFactory, Schema } from "../core"
import { RelationSQL } from "./relation_sql"

export enum AssociationType {
  BelongsTo,
  BelongsToMany,
  HasOne,
  HasMany,
}

export interface IAssociationMetadata {
  relation?: string
  foreignKey?: string
  type: AssociationType
}

export type AttributeSQLType = keyof DataTypes
export type SchemaRename<T, K extends keyof T, J extends string> = Dissoc<T, K> & { [j in J]: T[K] }

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

export class Association<T> {
  public readonly name: T
  public readonly meta?: Partial<IAssociationMetadata>
  // @ts-ignore
  private target: RelationSQL<any>

  constructor(
    name: T,
    meta: IAssociationMetadata,
  ) {
    this.name = name
    this.meta = meta
  }

  public get targetRelation() {
    return this.target
  }

  public setTargetRelation(targetRelation: RelationSQL<any>) {
    this.target = targetRelation
  }
}

export class SchemaSQL<T> extends Schema<T> {
  public readonly attributes: Array<AttributeSQL<keyof T>>
  public readonly associations: Array<Association<keyof T>> = []

  constructor(
    attributeFactory: AttributeFactory<T>,
    name: string,
    attributes?: Array<AttributeSQL<keyof T>>,
    associations?: Array<Association<keyof T>>,
  ) {
    super(attributeFactory, name, attributes)

    this.associations = associations || []
  }

  public clone<K>() {
    return new SchemaSQL<K>(
      this.attributeFactory as any,
      this.name,
      this.attributes as any,
      this.associations as any,
    )
  }

  public project<K extends keyof T>(...keys: K[]): SchemaSQL<Pick<T, K>> {
    return super.project(...keys) as SchemaSQL<Pick<T, K>>
  }

  public rename<K extends keyof T, J extends string>(currentName: K, newName: J): SchemaSQL<SchemaRename<T, K, J>> {
    return super.rename(currentName, newName) as SchemaSQL<SchemaRename<T, K, J>>
  }

  public primaryKey(): AttributeSQL<keyof T> {
    return this.attributes.find((x: AttributeSQL<keyof T>) => !!x.meta.primaryKey)
  }

  public addAssociation(a: Association<keyof T>): this {
    this.associations.push(a)

    return this
  }

  public findAssociation(name: string) {
    return this.associations.find((x) => x.name === name)
  }
}
