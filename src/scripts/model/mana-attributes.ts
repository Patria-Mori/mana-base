/**
 * Utility to get the parameter names as strings.
 */
export const parameterNames = {
  manaCap: "manaCap",
  manaX: "manaX",
  overchargeCap: "overchargeCap",
  manaRegen: "manaRegen",
  manaControl: "manaControl",
};

/**
 * Simple data structure that encapsulates all mana attributes.
 * The only functionality of the class is to set the minimum value of the attributes to 0.
 */
export default class ManaAttributes {
  public manaCap;
  public manaX;
  public overchargeCap;
  public manaRegen;
  public manaControl;

  /**
   * Constructor for Mana Attribute class.
   * No attribute can be lower than 0, so if a negative value is provided it will be set to 0.
   * @param manaCap       Mana capacity
   * @param manaX         Partly determines Mana capacity, derived from class
   * @param overchargeCap Overcharge mana capacity
   * @param manaRegen     Mana regen per tick
   * @param manaControl   Number of d8s to roll when manipulating mana
   */
  constructor(
    manaCap: number,
    manaX: number,
    overchargeCap: number,
    manaRegen: number,
    manaControl: number
  ) {
    this.manaCap = Math.max(manaCap, 0);
    this.manaX = Math.max(manaX, 0);
    this.overchargeCap = Math.max(overchargeCap, 0);
    this.manaRegen = Math.max(manaRegen, 0);
    this.manaControl = Math.max(manaControl, 0);
  }
}
