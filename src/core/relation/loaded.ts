import { Mapper } from "../mapper"
import { IDataset, Relation } from "../relation"

export class Loaded<Attr, Assoc, J extends IDataset<Attr, Assoc>, K extends Relation<Attr, Assoc, J>> {
  private relation: K
  private mapper: Mapper<Attr, Assoc>

  constructor(relation: K, mapper: Mapper<Attr, Assoc>) {
    this.relation = relation
    this.mapper   = mapper
  }

  public async one() {
    return this.first()
  }

  public async toArray() {
    return this.relation
      .dataset
      .toArray()
      .then((x) => this.mapper.many(x))
  }

  public async first() {
    return this.relation
      .dataset
      .first()
      .then((x) => this.mapper.single(x))
  }
}
