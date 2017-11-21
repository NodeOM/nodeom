import { Dissoc } from "subtractiontype.ts"
import { Schema } from "../core"
import { AssociationSQL } from "./association_sql"
import * as Associations from "./associations"
import { AttributeSQL, AttributeSQLType, IAttributeSQLMetadata } from "./attribute_sql"

export type SchemaRename<T, K extends keyof T, J extends string> = Dissoc<T, K> & { [j in J]: T[K] }

const attributeFactory = (
  name: any,
  type: AttributeSQLType,
  meta: IAttributeSQLMetadata,
) => new AttributeSQL(name, type, meta)

export class SchemaSQL<T> extends Schema<T> {
  public readonly attributes: Array<AttributeSQL<keyof T>>
  public readonly associations: Array<AssociationSQL<keyof T, any>> = []

  constructor(
    name: string,
    attributes?: Array<AttributeSQL<keyof T>>,
    associations?: Array<AssociationSQL<keyof T, any>>,
  ) {
    super(attributeFactory, name, attributes)

    this.associations = associations || []
  }

  public clone<K>() {
    return new SchemaSQL<K>(
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

  public attribute(name: keyof T, type: AttributeSQLType, meta?: IAttributeSQLMetadata) {
    this.attributes.push(new AttributeSQL(name, type, meta))

    return this
  }

  public hasMany(name: keyof T, meta?: Associations.IHasManyMetadata) {
    this.associations.push(new Associations.HasMany(name, meta))

    return this
  }

  public hasOne(name: keyof T, meta?: Associations.IHasOneMetadata) {
    this.associations.push(new Associations.HasOne(name, meta))

    return this
  }

  public belongsTo(name: keyof T, meta?: Associations.IBelongsToMetadata) {
    this.associations.push(new Associations.BelongsTo(name, meta))

    return this
  }

  public belongsToMany(name: keyof T, meta?: Associations.IBelongsToManyMetadata) {
    this.associations.push(new Associations.BelongsToMany(name, meta))

    return this
  }

  public addAssociation(a: AssociationSQL<keyof T, any>): this {
    this.associations.push(a)

    return this
  }

  public findAssociation(name: string) {
    return this.associations.find((x) => x.name === name)
  }
}
