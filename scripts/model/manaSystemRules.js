/**
 * The Mana System Rules class contains all of the formalised rules of the PM mana system.
 * If any tweaks are made to the rules, they should be made here.
 * 
 * The rules are expressed as static functions that can be called from anywhere.
 * The rules are also stateless, and should have a low level of abstraction.
 * (I.e. They should not be calling other functions or classes, and should not interact with Foundry at all).
 * 
 * The class is static and need not be instantiated.
 */
class ManaSystemRules {

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
     * Finds a good approximate of the X value for a character. This is done by looking at the
     * original class of the character and using that to find the X value. 
     * 
     * PS: Note that this may not be accurrate in situations where a character has multi-classed
     * into a class with a higher X value, in these situations different, complex rules apply. 
     * @param {string} actorClass The class of the character.
     * @returns {number} X value int of the character or undefined.
     */
    static approximateManaX(actorClass) {
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
        
        const approximateManaX = classXValueMap.get(actorClass) ? classXValueMap.get(actorClass) : 1; 
        // Default to 1 if we can't find a class
        return approximateManaX;
    }

}