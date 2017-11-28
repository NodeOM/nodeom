import { Relation } from "./relation"

export type RelationMap<R> = { [k in keyof R]: Relation<R[k], any> }

export abstract class Gateway<R> {
  public relations = {} as RelationMap<R>
  public connection: any
}
