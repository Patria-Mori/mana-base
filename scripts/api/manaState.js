/**
 * The Mana State API class is used to manipulate the mana state of an actor, or 
 * to set/unset mana-state related flags.
 * 
 * It is a static API class, meaning that it does not need to be instantiated.
 * 
 */
class ManaStateApi {

    /**
     * Get the mana state value from an actor.
     * @param {string} actorId The ID of the actor to get the mana state value from.
     * @returns Mana value of the supplied actor.
     */
    static getMana(actorId) {
        return ManaFlagUtils.getManaActorFlag(actorId, ManaBaseModule.FLAGS.STATE);
    }

    /**
     * Set/update the mana state flag for an actor.
     * @param {string} actorId The ID of the actor to set/update the mana state flag for.
     * @returns Promise of updated actor document.
     */
    static setMana(actorId, newManaVal) {
        return ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.STATE, newManaVal);
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
        const manaAtts = this.getManaAttributes(actorId);
        const regMana = manaAtts.manaRegen * ticks;
        const newMana = this.getMana(actorId) + regMana;

        // Max mana is either just mana capacity or mana capacity + mana overcharge capacity.
        const maxMana = overcharge ? manaAtts.manaCap + manaAtts.overchargeCap : manaAtts.manaCap;
        // Set new mana to newMana value or maxMana value, whichever is lower.
        return newMana > maxMana ? this.setMana(actorId, maxMana) : this.setMana(actorId, newMana);
    }

    /**
     * Get Mana Attribute from a given actor.
     * @param {string} actorId The ID of the actor to get the mana attribute flag from.
     * @returns Mana Attribute object.
     */
    static getManaAttributes(actorId) {
        return ManaFlagUtils.getManaActorFlag(actorId, ManaBaseModule.FLAGS.ATTRIBUTES);
    }

    /**
     * Set Mana Attribute for a given actor.
     * @param {string} actorId The ID of the actor to set the mana attribute flag for.
     * @param {ManaAttributes} newManaAttributes The new mana attribute state to set.
     * @returns Promise of updated actor document.
     */
    static setManaAttributes(actorId, newManaAttributes) {
        return ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.ATTRIBUTES, newManaAttributes);
    }

}
