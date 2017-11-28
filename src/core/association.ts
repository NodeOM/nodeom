import { Relation } from "./relation"

// tslint:disable:no-empty-interface
export interface IAssociationMetadata { }
// tslint:enable:no-empty-interface

export abstract class Association<T extends string, K extends IAssociationMetadata> {
  public readonly name: T
  public readonly meta?: K

  protected source: Relation<any, any>
  protected target: Relation<any, any>

  constructor(name: T, meta: K) {
    this.name = name
    this.meta = meta
  }
}
