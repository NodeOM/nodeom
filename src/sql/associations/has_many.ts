import { AssociationOptionsHasMany } from "sequelize"
import { AssociationSQL, IAssociationSQLMetadata } from "../association_sql"

export type IHasManyMetadata = AssociationOptionsHasMany & IAssociationSQLMetadata

export class HasMany<T extends string> extends AssociationSQL<T, IHasManyMetadata> {
  public isMany() {
    return true
  }

  public bind() {
    this.source.dataset.hasMany(this.target.dataset, { ...this.meta, as: this.name } as IHasManyMetadata)
  }
}
