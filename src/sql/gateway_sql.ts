import * as knex from "knex"
import { Gateway } from "../core"
import { RelationSQL } from "./relation_sql"
import { SchemaSQL } from "./schema_sql"

export type RelationSQLMap<R> = { [k in keyof R]: RelationSQL<R[k]> }

export class GatewaySQL<R> extends Gateway<R> {
  public relations = {} as RelationSQLMap<R>
  // public relations: RelationSQL<any>[] = []
  public config: knex.Config
  public connection: knex

  constructor(config: knex.Config) {
    super()

    this.config = config
  }

  public async connect() {
    return new Promise((resolve) => {
      this.connection = knex({
        ...this.config,
        debug: true,
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

  public registerSchemas(schemas: Array<SchemaSQL<any>>): this {
    this.relations = schemas.reduce((acc, x) => {
      return Object.assign(acc, { [x.name]: new RelationSQL(x.name, this.connection.table(x.name), x) })
    }, {} as RelationSQLMap<R>)

    return this
  }

  public relation<K extends keyof R>(name: K): RelationSQL<R[K]> {
    return this.relations[name]
  }
}
