import { Relation } from "./relation"

/*
 * This is a special index for getting the relation inside a gateway. This type enforces that the
 * attributes and associations definitions types contain a key in both defintions
 */
export type RelationCompoundIndex<AttrDef, AssocDef> = keyof AttrDef & keyof AssocDef

/*
 * This is the internal data structure for storing relations. Defintions should define the attributes and
 * associations always.
 */
export type RelationMap<
  AttrDef,
  AssocDef
> = { [i in RelationCompoundIndex<AttrDef, AssocDef>]: Relation<AttrDef[i], AssocDef[i], any> }

export abstract class Gateway<Attr, Assoc, ConnectionType> {
  public relations = {} as RelationMap<Attr, Assoc>
  public connection: ConnectionType
}
