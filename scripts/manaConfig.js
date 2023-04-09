/**
 * The Mana Config class contains various configurations of the mana system 
 * that make sense to be configurable. Different from module settings!.
 * 
 * At this point these aren't modifiable through code, though that may be added
 * once/if there is desire for it.
 * 
 * They could probably be decently easy to configure using the Settings system.
 */
class ManaConfig {

    /**
     * Finds a good approximate of the X value for a character. This is done by looking at the
     * original class of the character and using that to find the X value. 
     * 
     * PS: Note that this may not be accurrate in situations where a character has multi-classed
     * into a class with a higher X value, in these situations different, complex rules apply. 
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} X value int of the character or undefined.
     * 
     * TODO: Split up, so we don't use the actorId to find the class, and then use the class to find the X value.
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
        const xValue = classXValueMap.get(classIdentifier) ? classXValueMap.get(classIdentifier) : 1; 
        // Default to 1 if we can't find a class
        return xValue;
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

}