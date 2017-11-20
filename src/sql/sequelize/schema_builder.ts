import * as Sequelize from "sequelize"
import { Dataset, RelationSQL } from "../relation_sql"
import { SchemaSQL } from "../schema_sql"

export class SchemaBuilder {
  private connection: Sequelize.Sequelize

  constructor(connection: Sequelize.Sequelize) {
    this.connection = connection
  }

  public build(schemas: Array<SchemaSQL<any>>) {
    const schemasWithDatasets = schemas.map((x) => {
      return { schema: x, dataset: this.createDataset(x) }
    })

    const relations = schemasWithDatasets.map((x) => new RelationSQL(x.schema.name, x.dataset, x.schema))

    this.loadAssociations(relations)

    return relations
  }

  private createDataset(schema: SchemaSQL<any>): Dataset<any> {
    const options = schema.attributes.reduce((acc, x) => {
      return { ...acc, [x.name]: { ...x.meta, type: x.type } }
    }, {})

    return this.connection.define(schema.name, options)
  }

  private loadAssociations(relations: Array<RelationSQL<any>>) {
    relations.forEach((relation) => {
      relation.schema.associations.forEach((assoc) => {
        const targetRelation = relations.find((r) => r.name === assoc.targetRelationName())

        assoc.setSourceAndTargetRelation(relation, targetRelation)
      })
    })

    return this
  }
}
