class Mana {

    // Config stuff
    static ID = 'pm-mana';

    static FLAGS = {
        MANA: "pm-mana"
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
        let xValue = this.findXValueApproximation(actorId);

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

    /**
     * Finds a good approximate of the X value for a character. This is done by looking at the
     * original class of the character and using that to find the X value. 
     * 
     * PS: Note that this may not be accurrate in situations where a character has multi-classed
     * into a class with a higher X value, in these situations different, complex rules apply. 
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} X value int of the character or undefined.
     */
    static findXValueApproximation(actorId) {
        // TODO: The map should be externalised somewhere, probably a config file of sorts
        const classXValueMap = new Map();
        classXValueMap.set('artificer', 5);
        classXValueMap.set('barbarian', 1);
        classXValueMap.set('bard',      5);
        classXValueMap.set('cleric',    5);
        classXValueMap.set('druid',     5);
        classXValueMap.set('fighter',   1);
        classXValueMap.set('monk',      0); // Monks are weird, blame Lori
        classXValueMap.set('paladin',   3);
        classXValueMap.set('ranger',    3);
        classXValueMap.set('rogue',     1);
        classXValueMap.set('sorcerer',  5);
        classXValueMap.set('warlock',   5);
        classXValueMap.set('wizard',    5);

        const classIdentifier = this.findOriginalClassIdentifier(actorId);
        return classXValueMap.get(classIdentifier);
    }


    /**
     * Attempts to extract the original class of a character. Assumes the character is 5e compliant,
     * and that if it is homebrewed class, it's DataModel is the same as standard classes.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {string|undefined} Returns a lowercase identifier of the class (i.e. "bard") or 
     * undefined if one could not be found.
     */
    static findOriginalClassIdentifier(actorId) {
        let classObj = game.actors.get(actorId)?._classes;
        for (const classIdentifier of Object.keys(classObj)) {
            if (classObj[classIdentifier].system.isOriginalClass) {
                return classIdentifier;
            }
        }
        
        return undefined;
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

    // MISC STUFF, NOT "PRODUCTION" READY
    static _setManaFlag() {
        const manaObj = {
            manaCapacity: this.calculateManaCap(),
        }
        return game.actors.get("PZTrhLxGjhZqEXbx")?.setFlag(Mana.ID, Mana.FLAGS.MANA, manaObj)
    }

    static _calculateManaCap() {
        var id = "PZTrhLxGjhZqEXbx";
        var wisMod = game.actors.get(id)?.system.abilities.wis.mod;
        var profBonus = game.actors.get(id)?.system.attributes.prof;
        var X = 5;
        return (wisMod+1)*profBonus*X;
    }

}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(Mana.ID);
});

class ManaData {

    
    
}