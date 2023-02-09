/**
 * The Mana State class is used to manipulate the mana state of an actor, or 
 * to set/unset mana-state related flags.
 * 
 * Note that it does not provide automation for setting flags, that should be done elsewhere.
 */
class ManaState {

    /**
     * Get the mana state value from an actor.
     * @param {string} actorId The ID of the actor to get the mana state value from.
     * @returns Mana value of the supplied actor.
     */
    static getMana(actorId) {
        return ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_STATE);
    }

    /**
     * Set/update the mana state flag for an actor.
     * @param {string} actorId The ID of the actor to set/update the mana state flag for.
     * @returns Promise of updated actor document.
     */
    static setMana(actorId, newManaVal) {
        return ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MANA_STATE, newManaVal);
    }

    /**
     * Unset the mana state flag for an actor, normally shouldn't need to be used.
     * @param {string} actorId The ID of the actor to remove the mana state flag from.
     * @returns Promise of updated actor document.
     */
    static _unsetMana(actorId) {
        return ManaUtils.unsetManaActorFlag(actorId, Mana.FLAGS.MANA_STATE);
    }

    /**
     * Safely additatively changes mana, meaning that the new value cannot exceed the mana cap value or go below 0.
     * @param {string} actorId The ID of the actor to regenerate mana for.
     * @param {number} manaDelta The amount to change the mana value by, negative to reduce mana.
     * @returns Promise of updated actor document.
     */
    static addManaSafe(actorId, manaDelta) {
        return this.addManaSafe(actorId, manaDelta, false);
    }

    /**
     * Safely additatively changes mana, meaning that the new value cannot exceed the maximum value or go below 0.
     * @param {string} actorId The ID of the actor to regenerate mana for.
     * @param {number} manaDelta The amount to change the mana value by, negative to reduce mana.
     * @param {boolean} overcharge Boolean determining max capacity, 
     * true for mana cap + overcharge cap, false for only mana cap 
     * @returns Promise of updated actor document.
     */
    static addManaSafe(actorId, manaDelta, overcharge) {
        const newMana = this.getMana(actorId) + manaDelta;
        const minMana = 0;
        const maxMana = overcharge ? manaAtts.manaCap + manaAtts.overchargeCap : manaAtts.manaCap; // Accounts for overcharge

        if (newMana < minMana) { 
            return this.setMana(actorId, minMana);
        } else if (newMana > maxMana) {
            return this.setMana(actorId, maxMana);
        } else {
            return this.setMana(actorId, newMana);
        }
    }

    /**
     * Utility method for regenerating mana as per the mana regeneration rules.
     * Will naturally cap out at either the mana capacity or the overcharge capacity.
     * 
     * @param {string} actorId The ID of the actor to regenerate mana for.
     * @param {number} ticks The number of "ticks" used to renerate mana.
     * @param {boolean} overcharge Boolean determining max capacity, 
     * true for mana cap + overcharge cap, false for only mana cap 
     * @returns Promise of updated actor document.
     */
    static regenMana(actorId, ticks, overcharge) {
        const manaAtts = this.getManaAttributeMods(actorId);
        const regMana = manaAtts.manaRegen * ticks;
        const newMana = this.getMana(actorId) + regMana;
        
        // Max mana is either just mana capacity or mana capacity + mana overcharge capacity.
        const maxMana = overcharge ? manaAtts.manaCap + manaAtts.overchargeCap : manaAtts.manaCap;
        // Set new mana to newMana value or maxMana value, whichever is lower.
        return newMana > maxMana ? this.setMana(actorId, maxMana) : this.setMana(actorId, newMana);
    }

    /**
     * Get Mana Attribute from a given actor.
     * NB: This applies modifiers to the returned object.
     * @param {string} actorId The ID of the actor to get the mana attribute flag from.
     * @returns Mana Attribute object.
     */
    static getManaAttributes(actorId) {
        const manaAtts = ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE);
        const manaAttMods = ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE_MODS);

        const newManaCap = manaAtts.manaCap + manaAttMods.sumManaCapMods;
        const newOverchargeCap = manaAtts.overchargeCap + manaAttMods.sumManaOverchargeMods;
        const newManaRegen = manaAtts.manaRegen + manaAttMods.sumManaRegenMods;
        const newManaControl = manaAtts.manaControl + manaAttMods.sumManaControlMods;

        return new ManaAttributeState(newManaCap, newOverchargeCap, newManaRegen, newManaControl);
    }

    /**
     * Get Mana Attribute from a given actor, without mods applied
     * @param {string} actorId The ID of the actor to get the mana attribute flag from.
     * @returns Mana Attribute object.
     */
    static getBaseManaAttributes(actorId) {
        return ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE);
    }

    /**
     * Set Mana Attribute for a given actor.
     * @param {string} actorId The ID of the actor to set the mana attribute flag for.
     * @returns Promise of updated actor document.
     */
    static setManaAttributes(actorId, newManaAttributes) {
        return ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE, newManaAttributes);
    }

    /**
     * Unset Mana Attribute for a given actor.
     * @param {string} actorId The ID of the actor to unset the mana attribute flag for.
     * @returns Promise of updated actor document.
     */
    static unsetManaAttributes(actorId) {
        return ManaUtils.unsetManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE);
    }

    /**
     * Get Mana Attribute Mods from a given actor.
     * @param {string} actorId The ID of the actor to get the mana attribute mods flag from.
     * @returns Mana Attribute Mods object.
     */
    static getManaAttributeMods(actorId) {
        return ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE_MODS);
    }

    /**
     * Set Mana Attribute Mods for a given actor.
     * @param {string} actorId The ID of the actor to set the mana attribute mods flag for.
     * @returns Promise of updated actor document.
     */
    static setManaAttributeMods(actorId, newManaAttributeMods) {
        return ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE_MODS, newManaAttributeMods);
    }

    /**
     * Unset Mana Attribute Mods for a given actor.
     * @param {string} actorId The ID of the actor to unset the mana attribute mods flag for.
     * @returns Promise of updated actor document.
     */
    static unsetManaAttributeMods(actorId) {
        return ManaUtils.unsetManaActorFlag(actorId, Mana.FLAGS.MANA_ATTRIBUTE_MODS);
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

    manaCap = 0;       // Mana capacity
    overchargeCap = 0; // Overcharge mana capacity
    manaRegen = 0;     // Mana regen per tick
    manaControl = 0;   // Number of d8s to roll when manipulating mana

    /**
     * Constructor for Mana Attribute class.
     * @param {number} manaCap       Mana capacity
     * @param {number} overchargeCap Overcharge mana capacity
     * @param {number} manaRegen     Mana regen value per tick
     * @param {number} manaControl   Number of d8s to roll when manipulating mana
     */
    constructor(manaCap, overchargeCap, manaRegen, manaControl) {
        this.manaCap = manaCap;
        this.overchargeCap = overchargeCap;
        this.manaRegen = manaRegen;
        this.manaControl = manaControl;
    }

    /**
     * Getter for mana capacity.
     */
    get manaCap() {
        return this.manaCap;
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

    manaCapModsMap = null;         // Map of modifiers that increase/decrease Mana Capacity
    manaRegenModsMap = null;       // Map of modifiers that increase/decrease Mana Regeneration
    manaControlModsMap = null;     // Map of modifiers that increase/decrease Mana Control Dice
    manaOverchargeModsMap = null;  // Map of modifiers that increase/decrease Mana Overcharge Capacity

    /**
     * Mana Attribute Mods constructor, takes in arrays of String:Number pairs.
     * @param {Array} manaCapModsArr        Array of modifers that increase/decrease Mana Capacity
     * @param {Array} manaRegenModsArr      Array of modifers that increase/decrease Mana Regeneration
     * @param {Array} manaControlModsArr    Array of modifers that increase/decrease Mana Control Dice
     * @param {Array} manaOverchargeModsArr Array of modifers that increase/decrease Mana Overcharge Capacity
     */
    constructor(manaCapModsArr, manaRegenModsArr, manaControlModsArr, manaOverchargeModsArr) {
        this.manaCapModsMap = new Map(manaCapModsArr);
        this.manaRegenModsMap = new Map(manaRegenModsArr);
        this.manaControlModsMap = new Map(manaControlModsArr);
        this.manaOverchargeModsMap = new Map(manaOverchargeModsArr);
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
        this.manaCapModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Regeneration modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaRegenMod(modId, value) {
        this.manaRegenModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Control modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaControlMod(modId, value) {
        this.manaControlModsMap.set(modId, value);
    }

    /**
     * Adds new Mana Overcharge modifier to the map.
     * @param {string} modId The identifier used to store the modifier.
     * @param {number} value The numerical value (negative/positive) of the modifier
     */
    addManaOverchargeMod(modId, value) {
        this.manaOverchargeModsMap.set(modId, value);
    }

    /**
     * Removes a Mana Capacity modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaCapMod(modId) {
        this.manaCapModsMap.delete(modId);
    }

    /**
     * Removes a Mana Regeneration modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaRegenMod(modId) {
        this.manaRegenModsMap.delete(modId);
    }

    /**
     * Removes a Mana Control modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaControlMod(modId) {
        this.manaControlModsMap.delete(modId);
    }

    /**
     * Removes a Mana Overcharge modifier if it exists in the map.
     * @param {string} modId The identifier used to store the modifier.
     */
    removeManaOverchargeMod(modId) {
        this.manaOverchargeModsMap.delete(modId);
    }

    /**
     * The sum of all Mana Capacity modifiers
     */
    get sumManaCapMods() {
        return _sumNumMap(this.manaCapModsMap);
    }

    /**
     * The sum of all Mana Regeneration modifiers
     */
    get sumManaRegenMods() {
        return _sumNumMap(this.manaRegenModsMap);
    }

    /**
     * The sum of all Mana Control modifiers
     */
    get sumManaControlMods() {
        return _sumNumMap(this.manaControlModsMap);
    }

    /**
     * The sum of all Mana Overcharge modifiers
     */
    get sumManaOverchargeMods() {
        return _sumNumMap(this.manaOverchargeModsMap);
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