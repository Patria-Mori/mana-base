/**
 * Contains various utility functions that can be used to interact with actors in the mana system.
 * Works more or less like an API, but is not intended to be used by other modules at this time.
 */
class ActorManaFlagUtils {

    // The calculateActorX functions below are used to find the mana attributes of an actor.
    /**
     * Finds the mana capacity of the provided actor.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of maximum mana capacity (not including overload) or NaN if part of the caluclation failed.
     */
    static calculateActorManaCap(actorId) {
        let charObj = game.actors.get(actorId);
        let wisMod = charObj.system.abilities.wis.mod;
        let profBonus = charObj.system.attributes.prof;
        let xValue = this.getActorManaX(actorId);

        //TODO: Account for "extra" value somewhere.
        return ManaSystemRules.calculateManaCap(wisMod, profBonus, xValue, 0);
    }

    /**
     * Finds the standard per tick mana regen of a given character. 
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of mana regen per tick, or NaN if part of the caluclation failed.
     */
    static calculateActorManaRegen(actorId) {
        let charObj = game.actors.get(actorId);
        let intMod = charObj.system.abilities.int.mod;
        let profBonus = charObj.system.attributes.prof;

        //TODO: Account for "extra" value somewhere.
        return ManaSystemRules.calculateManaRegen(intMod, profBonus, 0);
    }

    /**
     * Finds the standard amount of dice a character can manipulate per turn.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of number of dice to roll, or NaN if part of the calculation failed.
     */
    static calculateActorManaControlDice(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        
        //TODO: Account for "extra" value somewhere.
        return ManaSystemRules.calculateManaControlDice(chaMod, 0);
    }

    /**
     * Finds the standard amount of overcharge capacity a character has.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of overcharge capacity (separate from normal Mana Capacity), or NaN if part of the calculation failed.
     */
    static calculateActorOverchargeCap(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        var extra = 0;

        // TODO: Standardise this and make it non-hard coded (probably some sort of map I guess?)
        if (this.findOriginalClassIdentifier(actorId) === "sorcerer") {
            extra = 10;
        }
        
        return ManaSystemRules.calculateOverchargeCap(chaMod, extra);
    }

    /**
     * Finds the manaX value of a character. This is the value that is used to calculate the mana capacity.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of manaX.
     */
    static getActorManaX(actorId) {
        return ManaSystemRules.approximateManaX(this.findOriginalClassIdentifier(actorId));
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

    // Bundle functions are used to set and update the mana attributes of an actor.
    /**
     * Utility function that updates the mana attributes of a actor.
     * Derives the manaX value from the flag, which may be impacted by Active Effects.
     * 
     * @param {String} actorId The ID of the actor we want to update.
     * @returns Promise that resolves to the updated actor.
     */
    static updateActorManaAttributes(actorId) {
        let charObj = game.actors.get(actorId);
        let wisMod = charObj.system.abilities.wis.mod;
        let profBonus = charObj.system.attributes.prof;
        let xValue = charObj.flags[ManaBaseModule.ID][ManaBaseModule.FLAGS.ATTRIBUTES].manaX

        const manaCap = ManaSystemRules.calculateManaCap(wisMod, profBonus, xValue, 0);
        const manaX = this.getActorManaX(actorId); 
        const manaRegen = ActorManaFlagUtils.calculateActorManaRegen(actorId);
        const manaControlDice = ActorManaFlagUtils.calculateActorManaControlDice(actorId);
        const overchargeCap = ActorManaFlagUtils.calculateActorOverchargeCap(actorId);

        // We still set the manaX value based on the approximation, since we don't want to overwrite the "true" value.
        const attributeState = new ManaAttributes(manaCap, manaX, overchargeCap, manaRegen, manaControlDice);

        return ManaStateApi.setManaAttributes(actorId, attributeState);
    }

    /**
     * Utility function that initialises the mana attributes of a actor.
     * Should only be used when the actor is first created.
     * 
     * @param {String} actorId The ID of the actor we want to initialise.
     * @returns Promise that resolves to the initialised actor.
     */
    static initActorManaAttributes(actorId) {
        const manaCap = ActorManaFlagUtils.calculateActorManaCap(actorId);
        const manaX = this.getActorManaX(actorId);
        const manaRegen = ActorManaFlagUtils.calculateActorManaRegen(actorId);
        const manaControlDice = ActorManaFlagUtils.calculateActorManaControlDice(actorId);
        const overchargeCap = ActorManaFlagUtils.calculateActorOverchargeCap(actorId);

        const attributeState = new ManaAttributes(manaCap, manaX, overchargeCap, manaRegen, manaControlDice);

        return ManaStateApi.setManaAttributes(actorId, attributeState);
    }

    /**
     * Initialises the module flags on a new actor.
     * @param {Document} actorDocument 
     */
    static initActorFlags(actorDocument) {
        const actorId = actorDocument._id;
        const uiDefault = getDisplayUIDefault(actorDocument.type);

        const dependentAttributes = {
            wisMod : actorDocument.system.abilities.wis.mod,
            intMod : actorDocument.system.abilities.int.mod,
            chaMod : actorDocument.system.abilities.cha.mod,
            manaX : 1,
            profBonus : actorDocument.system.attributes.prof,
            class : undefined
        };

        this.initActorManaAttributes(actorId); 
        ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.STATE, 0);
        ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.MODULE_VERSION, ManaBaseModule.VERSION);
        ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.DISPLAY_UI, uiDefault); 
        ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.EXPANDED_UI, false); 
        ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.DEPENDENT_ATTRIBUTES, dependentAttributes);
    }

    /**
     * Compares the dependent attributes on the actor to the ones in the flag,
     * if they are different, then the flag is updated and the actor's mana attributes are updated.
     * 
     * @param {string} actorId The ID of the actor to check for the flag.
     */
    static updateDependentAtts(actorId) {
        const oldFlag = ManaFlagUtils.getManaActorFlag(actorId, ManaBaseModule.FLAGS.DEPENDENT_ATTRIBUTES);
        // The old flag may not have been set yet, so we can just return, as this only happens during initialisation.
        if (oldFlag === undefined) { 
            return;
        }

        const newFlag = this.getDependentAtts(actorId);
        if (!deepEqual(oldFlag, newFlag)) {
            ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.DEPENDENT_ATTRIBUTES, newFlag);
            this.updateActorManaAttributes(actorId);
        }
    }

    /**
     * Gets the mana relevant attributes for an actor.
     * 
     * @param {string} actorId The ID of the actor to set the flag for.
     */
    static getDependentAtts(actorId) {
        let actorObj = game.actors.get(actorId);
        const dependentAttributes = {
            wisMod : actorObj.system.abilities.wis.mod,
            intMod : actorObj.system.abilities.int.mod,
            chaMod : actorObj.system.abilities.cha.mod,
            manaX : actorObj.flags[ManaBaseModule.ID][ManaBaseModule.FLAGS.ATTRIBUTES].manaX,
            profBonus : actorObj.system.attributes.prof,
            class : this.findOriginalClassIdentifier(actorId)
        };

        return dependentAttributes;
    }

}