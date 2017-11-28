import { Dissoc } from "subtractiontype.ts"
import { Association, IAssociationMetadata } from "./association"
import { Attribute } from "./attribute"

/**
 * AttributeFactory helps with the creation of schema specfic attributes for base class operations.
 *
 * If we could have polymorfic class constructors this could be eliminated.
 */
export type AttributeFactory<AttrKey> = (name: AttrKey, type: any, meta?: any) => Attribute<AttrKey>

/**
 * Transforms the schema's attributes by changing the name of one property.
 */
export type SchemaRename<
  Attr,
  AttrKey extends keyof Attr,
  J extends string
> = Dissoc<Attr, AttrKey> & { [j in J]: Attr[AttrKey] }

/**
 * Transform the generics type for attributes or associations into a plain object.
 */
export type SchemaObject<AttrOrAssoc> = { [j in keyof AttrOrAssoc]: AttrOrAssoc[j] }

export abstract class Schema<Attr, Assoc> {
  public name: string
  public attributes: Array<Attribute<keyof Attr>> = []
  public associations: Array<Association<keyof Assoc, IAssociationMetadata>> = []
  protected attributeFactory: AttributeFactory<Attr>

  constructor(attributeFactory: AttributeFactory<Attr>, name: string, attributes?: Array<Attribute<keyof Attr>>) {
    this.attributeFactory = attributeFactory
    this.name = name
    this.attributes = attributes || []
  }

  public abstract clone<NewAttr, NewAssoc>(): Schema<NewAttr, NewAssoc>

  public project<K extends keyof Attr>(...keys: K[]) {
    const s = this.clone<Pick<Attr, K>, Assoc>()
    const attrs = s.removeAllAttributes()

    keys.forEach((x) => s.addAttribute(attrs.find((a) => a.name === x)))

    return s
  }

  public rename<
    K extends keyof Attr,
    J extends string
  >(currentName: K, newName: J): Schema<SchemaRename<Attr, K, J>, Assoc> {
    const s = this.clone<SchemaRename<Attr, K, J>, Assoc>()

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

  public findAssociation(name: string) {
    return this.associations.find((x) => x.name === name)
  }

  public addAttribute(a: Attribute<keyof Attr>) {
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

  protected addAssociation(assoc: Association<keyof Assoc, IAssociationMetadata>) {
    this.associations.push(assoc)

    return this
  }

  protected removeAssociation(name: keyof Assoc) {
    return this.associations.slice(
      this.associations.indexOf(this.findAssociation(name)),
      1,
    )[0]
  }
}
