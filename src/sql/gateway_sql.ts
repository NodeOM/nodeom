import * as knex from "knex"
import { Gateway, RelationCompoundIndex } from "../core"
import { KnexDataset } from "./knex/dataset_knex"
import { RelationSQL } from "./relation_sql"
import { SchemaSQL } from "./schema_sql"

export type RelationSQLMap<
  AttrDef,
  AssocDef
> = { [i in RelationCompoundIndex<AttrDef, AssocDef>]: RelationSQL<AttrDef[i], AssocDef[i]> }

export class GatewaySQL<AttrDef, AssocDef> extends Gateway<AttrDef, AssocDef, knex> {
  public relations = {} as RelationSQLMap<AttrDef, AssocDef>
  public config: knex.Config

  constructor(config: knex.Config) {
    super()

    this.config = config
  }

  public async connect() {
    return new Promise((resolve) => {
      this.connection = knex({
        ...this.config,
        debug: false,
        pool: {
          ...this.config.pool,
          afterCreate: async (connection: any, done: (error: Error, connection: any) => void) => {
            done(null, connection)

            resolve()
          },
        },
      })
    })
  }

  public registerSchema<J extends keyof RelationSQLMap<AttrDef, AssocDef>>(schema: SchemaSQL<any, any>): this {
    this.relations[schema.name as J] = new RelationSQL(
      schema.name,
      new KnexDataset(this.connection.table(schema.name)),
      schema as any,
    )

    return this
  }

  public relation<J extends RelationCompoundIndex<AttrDef, AssocDef>>(name: J) {
    return this.relations[name]
  }
}
