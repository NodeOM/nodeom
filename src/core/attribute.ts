export interface IAttributeMeta {
  primaryKey?: boolean
  foreignKey?: boolean
  alias?: string
}

export class Attribute<T> {
  constructor(
    public readonly name: T,
    public readonly type: any,
    public readonly meta?: IAttributeMeta,
  ) { }
}
