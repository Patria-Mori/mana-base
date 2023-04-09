class Mana {

    // Config stuff
    static ID = 'mana-base';
    static VERSION = "0.2.0"; // The version is used to determine if the data models need to be updated.

    static FLAGS = {
        STATE: "state",
        ATTRIBUTES: "attributes",
        // The flags below are considered "internal".
        // They are not meant to be accessed by other modules.
        MODULE_VERSION: "_module-version", // The version of the module that the data models were last updated for.
        DEPENDENT_ATTRIBUTES: "_dependent-attributes", // Attributes that mana attributes are dependent on.
        DISPLAY_UI: "_display-ui", // Whether or not to display mana UI in an actor.
        EXPANDED_UI: "_expanded-ui" // The expanded UI shows all the mana attributes.
    }

    static TEMPLATES = {
        MANA: `modules/${this.ID}/templates/mana.hbs`
    }

    // "API" TODO: Make this a proper API. 

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
        return this.calculateManaCap(wisMod, profBonus, xValue, 0);
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
        if (ManaConfig.findOriginalClassIdentifier(actorId) === "sorcerer") {
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
    static calculateManaCap(wisMod, profBonus, xValue, extra) {
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

    /**
     * Utility function that updates the mana attributes of a character.
     * @param {String} actorId The ID of the actor we want to update.
     * @returns Promise that resolves to the updated actor.
     */
    static updateManaAttributes(actorId) {
        let charObj = game.actors.get(actorId);
        let wisMod = charObj.system.abilities.wis.mod;
        let profBonus = charObj.system.attributes.prof;
        let xValue = charObj.flags[Mana.ID][Mana.FLAGS.ATTRIBUTES].manaX

        const manaCap = this.calculateManaCap(wisMod, profBonus, xValue, 0);
        const manaX = ManaConfig.findXValueApproximation(actorId); 
        const manaRegen = this.calculateCharacterManaRegen(actorId);
        const manaControlDice = this.calculateCharacterManaControlDice(actorId);
        const overchargeCap = this.calculateCharacterOverchargeCap(actorId);

        // We still set the manaX value based on the approximation, since we don't want to overwrite the "true" value.
        const attributeState = new ManaAttributeState(manaCap, manaX, overchargeCap, manaRegen, manaControlDice);

        return ManaState.setManaAttributes(actorId, attributeState);
    }

    /**
     * Utility function that initialises the mana attributes of a character.
     * Should only be used when the character is first created.
     * 
     * @param {String} actorId The ID of the actor we want to initialise.
     * @returns Promise that resolves to the initialised actor.
     */
    static initialiseManaAttributes(actorId) {
        const manaCap = this.calculateCharacterManaCap(actorId);
        const manaX = ManaConfig.findXValueApproximation(actorId);
        const manaRegen = this.calculateCharacterManaRegen(actorId);
        const manaControlDice = this.calculateCharacterManaControlDice(actorId);
        const overchargeCap = this.calculateCharacterOverchargeCap(actorId);

        const attributeState = new ManaAttributeState(manaCap, manaX, overchargeCap, manaRegen, manaControlDice);

        return ManaState.setManaAttributes(actorId, attributeState);
    }

    /**
     * Utility function that initialises the mana states of a character.
     * @param {String} actorId The ID of the actor we want to initialise mana states for. 
     * @returns Promise that resolves to the updated actor.
     */
    static initialiseManaOnActor(actorId) {
        this.initialiseManaAttributes(actorId);
        return ManaState.setMana(actorId, 0);
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

}
