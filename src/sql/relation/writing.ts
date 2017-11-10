import { RelationSQL } from "../relation_sql"

export class Writing<T> {
  private readonly data: T

  constructor(data?: T) {
    this.data = data
  }

  public async insert(relation: RelationSQL<T>): Promise<T> {
    return relation.dataset
      .create(this.data)
      .then((x) => x.get({ plain: true }))
  }
}
