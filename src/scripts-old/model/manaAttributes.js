/**
 * Mana Attributes represents different mana-related attributes, which are 
 * stateless and derivable from other entity attributes (with the exception of manaCap).
 * 
 * The class contains no logic, it is simply a data structure.
 * 
 * Provided attributes will not be lower than 0.
 * @typedef {Object} ManaAttributes
 * @property {number} manaCap       Mana capacity
 * @property {number} manaX         Partly determines Mana capacity, derived from class
 * @property {number} overchargeCap Overcharge mana capacity
 * @property {number} manaRegen     Mana regen value per tick
 * @property {number} manaControl   Number of d8s to roll when manipulating mana
 */
class ManaAttributes {

    manaCap = 0;        // Mana capacity
    manaX = 0;          // Partly determines Mana capacity, derived from class
    overchargeCap = 0;  // Overcharge mana capacity
    manaRegen = 0;      // Mana regen per tick
    manaControl = 0;    // Number of d8s to roll when manipulating mana

    /**
     * Constructor for Mana Attribute class.
     * @param {number} manaCap       Mana capacity
     * @param {number} manaX         Partly determines Mana capacity, derived from class
     * @param {number} overchargeCap Overcharge mana capacity
     * @param {number} manaRegen     Mana regen value per tick
     * @param {number} manaControl   Number of d8s to roll when manipulating mana
     */
    constructor(manaCap, manaX, overchargeCap, manaRegen, manaControl) {
        this.manaCap = Math.max(manaCap, 0);
        this.manaX = Math.max(manaX, 0);
        this.overchargeCap = Math.max(overchargeCap, 0);
        this.manaRegen = Math.max(manaRegen, 0);
        this.manaControl = Math.max(manaControl, 0);
    }

    /**
     * Getter for mana capacity.
     */
    get manaCap() {
        return this.manaCap;
    }

    /**
     * Getter for X value used for calculating mana capacity.
     */
    get manaX() {
        return this.manaX;
    }

    /**
     * Getter for overcharge mana capacity.
     */
    get overchargeCap() {
        return this.overchargeCap;
    }

    /**
     * Getter for mana regneration value.
     */
    get manaRegen() {
        return this.manaRegen;
    }

    /**
     * Getter for mana control dice number.
     */
    get manaControl() {
        return this.manaControl;
    }

}