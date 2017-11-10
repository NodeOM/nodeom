import { pluralize } from "inflected"
import * as Sequelize from "sequelize"
import { Gateway } from "../core"
import { Dataset, RelationSQL } from "./relation_sql"
import { Association, AssociationType, SchemaSQL } from "./schema_sql"

export class GatewaySQL extends Gateway {
  public relations: Array<RelationSQL<any>> = []
  private connection: Sequelize.Sequelize

  constructor(options: Sequelize.Options) {
    super()

    this.connection = new Sequelize(options)
  }

  public async test() {
    return this.connection.authenticate()
  }

  public registerSchemas(schemas: Array<SchemaSQL<any>>): this {
    const schemasWithDatasets = schemas.map((x) => {
      return { schema: x, dataset: this.createDataset(x) }
    })

    this.relations = schemasWithDatasets.map((x) => {
      return new RelationSQL(x.schema.name, x.dataset, x.schema)
    })

    return this.loadAssociations(schemasWithDatasets)
  }

  private loadAssociations(schemasWithDatasets: Array<{ schema: SchemaSQL<any>, dataset: Dataset<any>}>) {
    schemasWithDatasets.forEach(({ schema, dataset }) => {
      schema.associations.forEach((assoc) => {
        const targetRelation = this.relations.find((r) => r.name === this.targetRelationName(assoc))

        assoc.setTargetRelation(targetRelation)

        switch (assoc.meta.type) {
          case AssociationType.BelongsTo: {
            dataset.belongsTo(targetRelation.dataset, { as: assoc.name })

            break
          }
          case AssociationType.BelongsToMany: {
            dataset.belongsToMany(targetRelation.dataset, { through: "assoc.meta.through" })

            break
          }
          case AssociationType.HasMany: {
            dataset.hasMany(targetRelation.dataset, { as: assoc.name, foreignKey: assoc.meta.foreignKey })

            break
          }
          case AssociationType.HasOne: {
            dataset.hasOne(targetRelation.dataset, { as: assoc.name })

            break
          }
        }
      })
    })

    return this
  }

  private targetRelationName(a: Association<any>): string {
    if (a.meta.relation) {
      return a.meta.relation
    }

    switch (a.meta.type) {
      case AssociationType.BelongsTo: {
        return pluralize(a.name)
      }
      case AssociationType.BelongsToMany: {
        return a.name
      }
      case AssociationType.HasMany: {
        return pluralize(a.name)
      }
      case AssociationType.HasOne: {
        return a.name
      }
    }
  }

  private createDataset(schema: SchemaSQL<any>): Dataset<any> {
    const options = schema.attributes.reduce((acc, x) => {
      return { ...acc, [x.name]: { ...x.meta, type: x.type } }
    }, {})

    return this.connection.define(schema.name, options)
  }
}
