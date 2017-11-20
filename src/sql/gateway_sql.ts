import * as Sequelize from "sequelize"
import { Gateway } from "../core"
import { RelationSQL } from "./relation_sql"
import { SchemaSQL } from "./schema_sql"
import { SchemaBuilder } from "./sequelize/schema_builder"

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
    this.relations = new SchemaBuilder(this.connection).build(schemas)

    return this
  }
}
