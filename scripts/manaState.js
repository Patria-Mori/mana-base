class ManaState {


    static getMana(actorId) {
        return game.actors.get(actorId)?.getFlag(Mana.ID, Mana.FLAGS.MANA_STATE);
    }

    static setMana(actorId, newManaVal) {
        return game.actors.get(actorId)?.setFlag(Mana.ID, Mana.FLAGS.MANA_STATE, newManaVal);
    }

    static unsetMana(actorId) {
        return game.actors.get(actorId)?.unsetFlag(Mana.ID, Mana.FLAGS.MANA_STATE);
    }

    static addManaSafe(actorId, manaDelta) {
        const newMana = this.getMana(actorId) + manaDelta;
        const manaCap = this.getManaProps(actorId).manaCap;
        return ((newMana > manaCap) ? this.setMana(actorId, manaCap) : this.setMana(actorId, newMana));
    }

    static addMana(actorId, manaDelta) {
        return this.setMana(actorId, (this.getMana(actorId) + manaDelta));
    }

    static removeMana(actorId, manaDelta) {
        const newMana = this.getMana(actorId) - manaDelta;
        return ((newMana < 0) ? this.setMana(0) : this.setMana(newMana));
    }

    static regenMana(actorId, ticks, overcharge) {
        const manaProps = this.getManaProps(actorId);
        const regMana = manaProps.manaRegen * ticks;
        const newMana = this.getMana(actorId) + regMana;
        
        const maxMana = overcharge ? manaProps.manaCap + manaProps.overchargeCap : manaProps.manaCap;
        return newMana > maxMana ? this.setMana(actorId, maxMana) : this.setMana(actorId, newMana);
    }

    static getManaProps(actorId) {
        return game.actors.get(actorId)?.getFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY);
    }

    /**
     * 
     * @param {string} actorId 
     * @param {ManaAttributeState} newManaProps Mana Properties.
     */
    static setManaProps(actorId, newManaProps) {
        return game.actors.get(actorId)?.setFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY, newManaProps);
    }

    static unsetManaProps(actorId) {
        return game.actors.get(actorId)?.unsetFlag(Mana.ID, Mana.FLAGS.MANA_PROPERTY);
    }

}

/**
 * Mana Attribute State represents different mana-related attributes, which are 
 * stateless and derivable from other entity attributes.
 * 
 * NB: These should not include Mana Attribute Modifiers, as that would make them 
 * stateless. This is also why there are no setters, create a new one if you have to.
 */
class ManaAttributeState {

    #manaCap = 0;       // Mana capacity
    #overchargeCap = 0; // Overcharge mana capacity
    #manaRegen = 0;     // Mana regen per tick
    #manaControl = 0;   // Number of d8s to roll when manipulating mana

    /**
     * Constructor for Mana Attribute class.
     * @param {number} manaCap       Mana capacity
     * @param {number} overchargeCap Overcharge mana capacity
     * @param {number} manaRegen     Mana regen value per tick
     * @param {number} manaControl   Number of d8s to roll when manipulating mana
     */
    constructor(manaCap, overchargeCap, manaRegen, manaControl) {
        this.#manaCap = manaCap;
        this.#overchargeCap = overchargeCap;
        this.#manaRegen = manaRegen;
        this.#manaControl = manaControl;
    }

    /**
     * Getter for mana capacity.
     */
    get manaCap() {
        return this.#manaCap;
    }

    /**
     * Getter for overcharge mana capacity.
     */
    get overchargeCap() {
        return this.#overchargeCap;
    }

    /**
     * Getter for mana regneration value.
     */
    get manaRegen() {
        return this.#manaRegen;
    }

    /**
     * Getter for mana control dice number.
     */
    get manaControl() {
        return this.#manaControl;
    }

}

/**
 * Mana Attribute Modifiers are all the different flat modifiers to Mana Attributes, 
 * such as flat bonuses to Mana Capacity, etc.
 * 
 * Unlinke Mana Attributes, which are the products of multiple properties and singular,
 * these modifiers are stackable, meaning you can have multiple positive or negative modifiers
 * of any given attribute.
 * 
 * The class contains a builder and constructor that take in arrays for ease of use.
 */
class ManaAttributeMods {

    #manaCapModsMap = null;         // Map of modifiers that increase/decrease Mana Capacity
    #manaRegenModsMap = null;       // Map of modifiers that increase/decrease Mana Regeneration
    #manaControlModsMap = null;     // Map of modifiers that increase/decrease Mana Control Dice
    #manaOverchargeModsMap = null;  // Map of modifiers that increase/decrease Mana Overcharge Capacity

    /**
     * Mana Attribute Mods constructor, takes in arrays of String:Number pairs.
     * @param {Array} manaCapModsArr        Array of modifers that increase/decrease Mana Capacity
     * @param {Array} manaRegenModsArr      Array of modifers that increase/decrease Mana Regeneration
     * @param {Array} manaControlModsArr    Array of modifers that increase/decrease Mana Control Dice
     * @param {Array} manaOverchargeModsArr Array of modifers that increase/decrease Mana Overcharge Capacity
     */
    constructor(manaCapModsArr, manaRegenModsArr, manaControlModsArr, manaOverchargeModsArr) {
        this.#manaCapModsMap = new Map(manaCapModsArr);
        this.#manaRegenModsMap = new Map(manaRegenModsArr);
        this.#manaControlModsMap = new Map(manaControlModsArr);
        this.#manaOverchargeModsMap = new Map(manaOverchargeModsArr);
    }

    /**
     * Builder class for ManaAttributeMods for ease of use.
     */
    static Builder = class {

        #manaCapModsArr = [];
        #manaRegenModsArr = [];
        #manaControlModsArr = [];
        #manaOverchargeModsArr = [];
        
        setCapExtras(manaCapModsArr) {
            this.#manaCapModsArr = manaCapModsArr;
            return this;
        }

        setRegenExtas(manaRegenModsArr) {
            this.#manaRegenModsArr = manaRegenModsArr;
            return this;
        }

        setControlExtra(manaControlModsArr) {
            this.#manaControlModsArr = manaControlModsArr;
            return this;
        }

        setOverchargeExtra(manaOverchargeModsArr) {
            this.#manaOverchargeModsArr = manaOverchargeModsArr;
            return this;
        }

        build() {
            const manaAttributeMods = new ManaAttributeMods(
                this.#manaCapModsArr,
                this.#manaRegenModsArr,
                this.#manaControlModsArr,
                this.#manaOverchargeModsArr
            );
            return manaAttributeMods;
        }

    }

    /**
     * Adds new Mana Capacity modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaCapMod(modId, value) {
        this.#manaCapModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Regeneration modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaRegenMod(modId, value) {
        this.#manaRegenModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Control modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaControlMod(modId, value) {
        this.#manaControlModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Overcharge modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaOverchargeMod(modId, value) {
        this.#manaOverchargeModsMap.set(modId, value);
    }

    /**
     * Removes a Mana Capacity modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaCapMod(modId) {
        this.#manaCapModsMap.delete(modId);
    }

    /**
     * Removes a Mana Regeneration modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaRegenMod(modId) {
        this.#manaRegenModsMap.delete(modId);
    }

    /**
     * Removes a Mana Control modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaControlMod(modId) {
        this.#manaControlModsMap.delete(modId);
    }

    /**
     * Removes a Mana Overcharge modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaOverchargeMod(modId) {
        this.#manaOverchargeModsMap.delete(modId);
    }

    /**
     * The sum of all Mana Capacity modifiers
     */
    get sumManaCapMods() {
        return _sumNumMap(this.#manaCapModsMap);
    }

    /**
     * The sum of all Mana Regeneration modifiers
     */
    get sumManaRegenMods() {
        return _sumNumMap(this.#manaRegenModsMap);
    }

    /**
     * The sum of all Mana Control modifiers
     */
    get sumManaControlMods() {
        return _sumNumMap(this.#manaControlModsMap);
    }

    /**
     * The sum of all Mana Overcharge modifiers
     */
    get sumManaOverchargeMods() {
        return _sumNumMap(this.#manaOverchargeModsMap);
    }

    /**
     * Utility method that sums the numbers in a X:number map
     * @param {Map} numMap A map with numbers as values.
     * @returns Sum of all numbers in the map
     */
    static _sumNumMap(numMap) {
        let sum = 0;
        for (let mod of numMap.values()) {
            sum += mod;
        }
        return sum;
    }

}