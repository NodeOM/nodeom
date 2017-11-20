import { AssociationOptionsHasOne } from "sequelize"
import { AssociationSQL, IAssociationSQLMetadata } from "../association_sql"

export type IHasOneMetadata = AssociationOptionsHasOne & IAssociationSQLMetadata

export class HasOne<T extends string> extends AssociationSQL<T, IHasOneMetadata> {
  public isMany() {
    return false
  }

  public bind() {
    this.source.dataset.hasOne(this.target.dataset, { ...this.meta, as: this.name } as IHasOneMetadata)
  }
}
