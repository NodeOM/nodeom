import { Association, IAssociationMetadata } from "../association"

// tslint:disable:no-empty-interface
export interface IHasOneMetadata extends IAssociationMetadata {}
// tslint:enable:no-empty-interface

export class HasOne<T extends string> extends Association<T, IHasOneMetadata> {
  public isMany() {
    return false
  }
}
