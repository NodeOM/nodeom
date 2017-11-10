import { FindOptions, Instance, Model, WhereOptions } from "sequelize"
import { RelationSQL } from "../relation_sql"
import { JoinReading } from "./join_reading"

export type Select<S>      = keyof S
export type Where<T>       = WhereOptions<T>
export type Dataset<T>     = Model<Instance<T>, T>
export type PrimaryKey<T>  = { [x in keyof T]: number | string }
export type NestedJoin<T>  = { [P in keyof T]: NestedJoin<Partial<T[P]>> | keyof T[P] }
export type Join<T>        = NestedJoin<Partial<T>> | keyof T

export interface IReadingOptions<T> {
  conditions: Array<Where<T>>
  joins: Array<Join<T>>
  limit?: number
}

export class Reading<T> {
  public conditions: Array<Where<T>> = []
  public joins: Array<Join<T>> = []
  public limit?: number

  constructor(options?: IReadingOptions<T>) {
    if (options) {
      this.conditions = options.conditions || []
      this.joins = options.joins || []
      this.limit = options.limit
    }
  }

  public clone() {
    return new Reading<T>({
      conditions: this.conditions,
      joins: this.joins,
      limit: this.limit,
    })
  }

  public addCondition(c: Where<T>) {
    this.conditions.push(c)

    return this.clone()
  }

  public addJoin(j: Join<T>) {
    this.joins.push(j)

    return this.clone()
  }

  public addLimit(l: number) {
    this.limit = l

    return this.clone()
  }

  public async byPk(relation: RelationSQL<T>, pk: any): Promise<T> {
    const condition = {
      [relation.schema.primaryKey().name]: pk,
    } as PrimaryKey<T>

    this.addCondition(condition)

    return relation
      .dataset
      .findOne<T>({
        attributes: relation.schema.attributes.map((x) => x.name),
        where: this.buildConditions(),
      })
      .then((x) => x.get({ plain: true }))
  }

  public async first(relation: RelationSQL<T>): Promise<T> {
    return this
      .addLimit(1)
      .toArray(relation)
      .then((x) => x[0])
  }

  public async toArray(relation: RelationSQL<T>): Promise<T[]> {
    return relation
      .dataset
      .findAll<T>(this.buildFindOptions(relation))
      .then((x) => x.map((o) => o.get({ plain: true })))
  }

  private buildFindOptions(relation: RelationSQL<T>): FindOptions<T> {
    const options: FindOptions<T> =  {
      attributes: relation.schema.attributes.map((x) => x.name),
      where: this.buildConditions(),
      include: this.joins.reduce((acc, x) => {
        return acc.concat(new JoinReading(x).build(relation))
      }, []),
    }

    if (this.limit) {
      options.limit = this.limit
    }

    return options
  }

  private buildConditions(): Where<T> {
    return this.conditions.reduce((acc: Where<T>, next: Where<T>) => {
      return Object.assign(acc, next)
    }, {})
  }
}
