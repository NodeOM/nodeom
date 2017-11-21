import { AssociationOptionsBelongsTo } from "sequelize"
import { AssociationSQL, IAssociationSQLMetadata } from "../association_sql"

export type IBelongsToMetadata = AssociationOptionsBelongsTo & IAssociationSQLMetadata

export class BelongsTo<T extends string> extends AssociationSQL<T, IBelongsToMetadata> {
  public isMany() {
    return false
  }

  public bind() {
    this.source.dataset.belongsTo(this.target.dataset, { ...this.meta, as: this.name } as IBelongsToMetadata)
  }
}
