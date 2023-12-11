import { DNDActor } from "../config/types";

export default class DND5eSystemApi {}

export function getProficiencyBonus(actor: DNDActor): number {
  return actor.system.attributes.prof;
}

export function getAbilityModifiers(actor: DNDActor) {
  return {
    strMod: actor.system.abilities.str.mod,
    dexMod: actor.system.abilities.dex.mod,
    conMod: actor.system.abilities.con.mod,
    intMod: actor.system.abilities.int.mod,
    wisMod: actor.system.abilities.wis.mod,
    chaMod: actor.system.abilities.cha.mod,
  };
}
