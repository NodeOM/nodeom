import { pluralize } from "inflected"
import { RelationSQL } from "./relation_sql"

export interface IAssociationSQLMetadata {
  relationName?: string
}

export abstract class AssociationSQL<T extends string, K extends IAssociationSQLMetadata> {
  public readonly name: T
  public readonly meta?: K
  // @ts-ignore
  protected source: RelationSQL<any>
  protected target: RelationSQL<any>

  constructor(
    name: T,
    meta: K,
  ) {
    this.name = name
    this.meta = meta
  }

  public abstract isMany(): boolean
  public abstract bind(): void

  public targetRelationName() {
    if (this.meta && this.meta.relationName) {
      return this.meta.relationName
    } else {
      return this.isMany() ? this.name : pluralize(this.name)
    }
  }

  public get targetRelation() {
    return this.target
  }

  public setSourceAndTargetRelation(sourceRelation: RelationSQL<any>, targetRelation: RelationSQL<any>) {
    this.source = sourceRelation
    this.target = targetRelation

    this.bind()
  }
}
