import { Dissoc } from "subtractiontype.ts"
import { Attribute } from "./attribute"

export type AttributeFactory<T> = (name: T, type: any, meta?: any) => Attribute<T>
export type SchemaRename<T, K extends keyof T, J extends string> = Dissoc<T, K> & { [j in J]: T[K] }
export type SchemaObject<T> = { [j in keyof T]: T[j] }

export abstract class Schema<T> {
  public name: string
  public attributes: Array<Attribute<keyof T>>
  protected attributeFactory: AttributeFactory<T>

  constructor(attributeFactory: AttributeFactory<T>, name: string, attributes?: Array<Attribute<keyof T>>) {
    this.attributeFactory = attributeFactory
    this.name = name
    this.attributes = attributes || []
  }

  public abstract clone<K>(): Schema<K>

  public project<K extends keyof T>(...keys: K[]) {
    const s = this.clone<Pick<T, K>>()
    const attrs = s.removeAllAttributes()

    keys.forEach((x) => s.addAttribute(attrs.find((a) => a.name === x)))

    return s
  }

  public rename<K extends keyof T, J extends string>(currentName: K, newName: J): Schema<SchemaRename<T, K, J>> {
    const s = this.clone<SchemaRename<T, K, J>>()

    const oldAttr = this.removeAttribute(currentName)
    const newAttr = this.attributeFactory(newName as any, oldAttr.type, oldAttr.meta)

    s.addAttribute(newAttr as any)

    return s
  }

  public primaryKey() {
    return this.attributes.find((x) => !!x.meta.primaryKey)
  }

  public findAttribute(name: string) {
    return this.attributes.find((x) => x.name === name)
  }

  public addAttribute(a: Attribute<keyof T>) {
    this.attributes.push(a)

    return this
  }

  protected removeAllAttributes() {
    const attrs = this.attributes

    this.attributes = []

    return attrs
  }

  protected removeAttribute(name: string) {
    return this.attributes.slice(
      this.attributes.indexOf(this.findAttribute(name)),
      1,
    )[0]
  }

  protected hasAttribute(name: string): boolean {
    return !!this.findAttribute(name)
  }
}
