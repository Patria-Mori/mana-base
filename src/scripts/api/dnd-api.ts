import { FLAGS } from "../config/module-constants";
import { DNDActor } from "../config/types";
import ManaAttributes from "../model/mana-attributes";

/**
 * Get the proficiency bonus of an actor.
 *
 * @param actor Actor object.
 * @returns Proficiency bonus of the actor.
 */
export function getProficiencyBonus(actor: DNDActor): number {
  return actor.system.attributes.prof;
}

/**
 * Get all of the ability modifiers from the actor.
 *
 * @param actor Actor object.
 * @returns Ability modifiers of the actor.
 */
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

/**
 * Get the manaX value from an actor.
 * This is retrieved from the actor's flag.
 *
 * @param actor Actor object.
 * @returns manaX value.
 */
export function getManaXValue(actor: DNDActor): number {
  return getManaAttributesFromFlag(actor).manaX;
}

/**
 * Get the mana attributes from the actor's flag.
 * These will be the values after active effects are applied.
 *
 * @param actor Actor object.
 * @returns Mana attributes.
 */
export function getManaAttributesFromFlag(actor: DNDActor): ManaAttributes {
  return actor.flags[module.id][FLAGS.ATTRIBUTES];
}

/**
 * Get the state (how much they currently hold) of an actor's mana from their flag.
 *
 * @param actor Actor object.
 * @returns Mana state value.
 */
export function getManaState(actor: DNDActor): number {
  return actor.flags[module.id][FLAGS.STATE];
}
