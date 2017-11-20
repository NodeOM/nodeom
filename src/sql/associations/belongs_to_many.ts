import { AssociationOptionsBelongsToMany } from "sequelize"
import { AssociationSQL, IAssociationSQLMetadata } from "../association_sql"

export type IBelongsToManyMetadata = AssociationOptionsBelongsToMany & IAssociationSQLMetadata

export class BelongsToMany<T extends string> extends AssociationSQL<T, IBelongsToManyMetadata> {
  public isMany() {
    return true
  }

  public bind() {
    this.source.dataset.belongsToMany(this.target.dataset, this.meta)
  }
}
