import { PMClass } from "./types";

/**
 * Formula used to calculate the mana capacity of a character according to standard rules.
 * @param wisMod Wisdom modifier of the character.
 * @param profBonus Proficiency bonus of the character.
 * @param xValue X Value of a character, usually derived from class/subclass.
 * @returns Maximum mana capacity, not including overload.
 */
export const manaCapFormula = (
  wisMod: number,
  profBonus: number,
  xValue: number
): number => (wisMod + 1) * profBonus * xValue;

/**
 * Formula to calculate the standard mana regeneration per tick.
 * @param intMod Intelligence modifier of the character.
 * @param profBonus Proficiency bonus of the character.
 * @returns Mana regen per tick.
 */
export const manaRegenFormula = (intMod: number, profBonus: number): number =>
  intMod * profBonus + 1;

/**
 * Formula to calculate the amount of dice of mana a character can manipulate in one turn.
 * Note that unlike other mana values this is not an absolute value, but instead the number of dice (d8s) to roll.
 * @param chaMod Charisma modifier of the character.
 * @returns Number of dice to roll.
 */
export const manaControlDiceFormula = (chaMod: number): number => chaMod + 2;

/**
 * Formula to calculate the maximum overcharge value a character can safely hold beyond the normal maximum.
 * Note that this function does not account for sorcerer's getting +10 to this value.
 * @param chaMod Charisma modifier of the character.
 * @param bonus Bonus to value, e.g. Sorcerer's class bonus.
 * @returns Overcharge capacity.
 */
export const overchargeCapFormula = (chaMod: number, bonus: number): number =>
  chaMod * 3 + bonus;

//TODO: Read this in from a JSON file.
const classXValueMap = new Map<PMClass, number>([
  [PMClass.Artificer, 5],
  [PMClass.Barbarian, 1],
  [PMClass.Bard, 5],
  [PMClass.Cleric, 5],
  [PMClass.Druid, 5],
  [PMClass.Fighter, 1],
  [PMClass.Monk, 0],
  [PMClass.Paladin, 3],
  [PMClass.Ranger, 3],
  [PMClass.Rogue, 1],
  [PMClass.Sorcerer, 5],
  [PMClass.Warlock, 5],
  [PMClass.Wizard, 5],
]);

/**
 * Finds a good approximate of the X value for a character. This is done by looking at the
 * original class of the character and using that to find the X value.
 *
 * PS: Note that this may not be accurate in situations where a character has multi-classed
 * into a class with a higher X value, in these situations different, complex rules apply.
 * @param actorClass The class of the character.
 * @returns X value of the character or 1 by default.
 */
export const approximateManaXValue = (actorClass: PMClass): number =>
  classXValueMap.get(actorClass) || 1;
