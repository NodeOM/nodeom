import { Association, IAssociationMetadata } from "../association"

// tslint:disable:no-empty-interface
export interface IBelongsToMetadata extends IAssociationMetadata { }
// tslint:enable:no-empty-interface
//
export class BelongsTo<T extends string> extends Association<T, IBelongsToMetadata> {
  public isMany() {
    return false
  }
}
