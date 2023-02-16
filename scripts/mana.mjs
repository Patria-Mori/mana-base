class Mana {

    // Config stuff
    static ID = 'pm-mana';

    static FLAGS = {
        MANA: "mana",
        MANA_STATE: "mana-state",
        MANA_ATTRIBUTE: "mana-attribute",
        MANA_ATTRIBUTE_MODS: "mana-attribute-mods"
    }

    static TEMPLATES = {
        MANA: `modules/${this.ID}/templates/mana.hbs`
    }

    // "API"

    /**
     * Finds the mana capacity of the provided actor.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of maximum mana capacity (not including overload) or NaN if part of the caluclation failed.
     */
    static calculateCharacterManaCap(actorId) {
        let charObj = game.actors.get(actorId);
        let wisMod = charObj.system.abilities.wis.mod;
        let profBonus = charObj.system.attributes.prof;
        let xValue = ManaConfig.findXValueApproximation(actorId);

        //TODO: Account for "extra" value somewhere.
        return this.calcualteManaCap(wisMod, profBonus, xValue, 0);
    }

    /**
     * Finds the standard per tick mana regen of a given character. 
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of mana regen per tick, or NaN if part of the caluclation failed.
     */
    static calculateCharacterManaRegen(actorId) {
        let charObj = game.actors.get(actorId);
        let intMod = charObj.system.abilities.int.mod;
        let profBonus = charObj.system.attributes.prof;

        //TODO: Account for "extra" value somewhere.
        return this.calculateManaRegen(intMod, profBonus, 0);
    }

    /**
     * Finds the standard amount of dice a character can manipulate per turn.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of number of dice to roll, or NaN if part of the calculation failed.
     */
    static calculateCharacterManaControlDice(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        
        //TODO: Account for "extra" value somewhere.
        return this.calculateManaControlDice(chaMod, 0);
    }

    /**
     * Finds the standard amount of overcharge capacity a character has.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of overcharge capacity (separate from normal Mana Capacity), or NaN if part of the calculation failed.
     */
    static calculateCharacterOverchargeCap(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        var extra = 0;

        // TODO: Standardise this and make it non-hard coded (probably some sort of map I guess?)
        if (this.findOriginalClassIdentifier(actorId) === "sorcerer") {
            extra = 10;
        }
        
        return this.calculateOverchargeCap(chaMod, extra);
    }

    /**
     * Utility function to calculate maximum the mana capacity of a character according to 
     * standard rules.
     * @param {number} wisMod Wisdom modifier of the character.
     * @param {number} profBonus Proficiency bonus of the character.
     * @param {number} xValue X Value of a character, usually derived from class/subclass.
     * @param {number} extra Flat extra mana a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of maximum mana capacity, not including overload.
     */
    static calcualteManaCap(wisMod, profBonus, xValue, extra) {
        return ((wisMod + 1) * profBonus * xValue) + extra;
    }

    /**
     * Utility function to calculate the standard mana regeration per tick.
     * @param {number} intMod Intelligence modifier of the character.
     * @param {number} profBonus Proficiency bonus of the character.
     * @param {number} extra Flat extra regen a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of mana regen per tick.
     */
    static calculateManaRegen(intMod, profBonus, extra) {
        return (intMod * profBonus) + 1 + extra;
    }

    /**
     * Utility function to calculate the amount of dice of mana a character can manipulate in one turn.
     * Note that unlike other mana values this is not an absolute value, but instead the number of d8s to roll.
     * @param {number} chaMod Charisma modifier of the character.
     * @param {number} extra Flat extra dice a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of number of dice to roll.
     */
    static calculateManaControlDice(chaMod, extra) {
        return (chaMod + 2) + extra;
    }

    /**
     * Utility function to calculate the maximum overcharge value a character can safely hold beyond the normal
     * maximum. Note that this function does not account for sorcerer's getting +10 to this value.
     * @param {number} chaMod Charisma modifier of the character.
     * @param {number} extra Flat extra dice a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of Overcharge capacity.
     */
    static calculateOverchargeCap(chaMod, extra) {
        return (chaMod * 3) + extra;
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

}
