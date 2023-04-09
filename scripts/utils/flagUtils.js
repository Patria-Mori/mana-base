/**
 * Simple class containing some useful utility functions for manipulating flags in 
 * the Mana modules.
 */
class ManaFlagUtils {

    /**
     * Generic utility function to get a flag from an actor in the Mana-base module.
     * @param {string} actorId The ID of the actor we want to get the flag from.
     * @param {*} flagKey The key of the flag to get.
     * @returns The value of the flag.
     */
    static getManaActorFlag(actorId, flagKey) {
        return this.getActorFlag(actorId, ManaBaseModule.ID, flagKey);
    }

    /**
     * Generic utility function to get a flag from an actor.
     * @param {string} actorId The ID of the actor we want to get the flag from.
     * @param {string} moduleId The ID of the module we are using to get the flag.
     * @param {*} flagKey The key of the flag to get.
     * @returns The value of the flag.
     */
    static getActorFlag(actorId, moduleId, flagKey) {
        return game.actors.get(actorId)?.getFlag(moduleId, flagKey);
    }

    /**
     * Generic utility function to set a flag on an actor in the Mana-base module.
     * @param {string} actorId The ID of the actor we want to set the flag for.
     * @param {*} flagKey The key of the flag to set.
     * @param {*} flagValue The object to set the flag to.
     * @returns Promise of updated document.
     */
    static setManaActorFlag(actorId, flagKey, flagValue) {
        return this.setActorFlag(actorId, ManaBaseModule.ID, flagKey, flagValue);
    }

    /**
     * Generic utility function to set a flag on an actor.
     * @param {string} actorId The ID of the actor we want to set the flag for.
     * @param {string} moduleId The ID of the module we are setting the flag for.
     * @param {*} flagKey The key of the flag to set.
     * @param {*} flagValue The object to set the flag to.
     * @returns Promise of updated document.
     */
    static setActorFlag(actorId, moduleId, flagKey, flagValue) {
        return game.actors.get(actorId)?.setFlag(moduleId, flagKey, flagValue);
    }

    /**
     * Generic utility function to unset a flag on an actor in the Mana-base module.
     * @param {string} actorId The ID of the actor we want to unset the flag for.
     * @param {*} flagKey The key of the flag to unset.
     * @returns Promise of updated document.
     */
    static unsetManaActorFlag(actorId, flagKey) {
        return this.unsetActorFlag(actorId, ManaBaseModule.ID, flagKey);
    }

    /**
     * Generic utility function to unset a flag on an actor.
     * @param {string} actorId The ID of the actor we want to unset the flag for.
     * @param {string} moduleId The ID of the module we are unsetting the flag for.
     * @param {*} flagKey The key of the flag to unset.
     * @returns Promise of updated document.
     */
    static unsetActorFlag(actorId, moduleId, flagKey) {
        return game.actors.get(actorId)?.unsetFlag(moduleId, flagKey);
    }

}