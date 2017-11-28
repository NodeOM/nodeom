import { Association, IAssociationMetadata } from "../association"

// tslint:disable:no-empty-interface
export interface IHasManyMetadata extends IAssociationMetadata {}
// tslint:enable:no-empty-interface

export class HasMany<T extends string> extends Association<T, IHasManyMetadata> {
  public isMany() {
    return true
  }
}
