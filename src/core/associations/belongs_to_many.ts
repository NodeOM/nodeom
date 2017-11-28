import { Association, IAssociationMetadata } from "../association"

// tslint:disable:no-empty-interface
export interface IBelongsToManyMetadata extends IAssociationMetadata { }
// tslint:enable:no-empty-interface

export class BelongsToMany<T extends string> extends Association<T, IBelongsToManyMetadata> {
  public isMany() {
    return true
  }
}
