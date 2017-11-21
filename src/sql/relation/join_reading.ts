import { AssociationSQL } from "../association_sql"
import { RelationSQL } from "../relation_sql"
import { Join, NestedJoin } from "./reading"

function isSimpleJoin(x: any): x is string {
  return typeof x === "string"
}

export class JoinReading<T> {
  private join: Join<T>

  constructor(join: Join<T>) {
    this.join = join
  }

  public build(relation: RelationSQL<T>): any {
    if (isSimpleJoin(this.join)) {
      return this.simpleJoin(relation, this.join)
    } else {
      return this.nestedJoin(relation, this.join as NestedJoin<T>)
    }
  }

  private simpleJoin(relation: RelationSQL<T>, assocName: string): any {
    const assoc = relation.schema.findAssociation(assocName)

    return [ this.includeCondition(assoc) ]
  }

  private nestedJoin(relation: RelationSQL<T>, join: NestedJoin<T>) {
    return Object.keys(join).map((assocName) => {
      const assoc = relation.schema.findAssociation(assocName)
      const value = join[assocName as keyof T]

      const includeCondition = this.includeCondition(assoc)

      if (isSimpleJoin(value)) {
        const nestedAssoc = assoc.targetRelation.schema.findAssociation(value)

        return {
          ...includeCondition,
          include: [ this.includeCondition(nestedAssoc) ],
        }
      } else {
        return {
          ...includeCondition,
          include: new JoinReading(value as Join<any>).build(relation),
        }
      }
    })
  }

  private includeCondition(assoc: AssociationSQL<any, any>) {
    return {
      required: true,
      model: assoc.targetRelation.dataset,
      as: assoc.name,
      attributes: [] as string[],
    }
  }
}
