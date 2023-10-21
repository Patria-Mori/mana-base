/**
 * This file contains the code for registering and managing module settings.
 */

/**
 * Utility function that determines the default mana UI display value 
 * to set on new actors based on the actor type and the world settings.
 * @param {string} actorType - The actor type.
 * @returns {boolean} The default mana UI display value. 
 */
function getDisplayUIDefault(actorType) {
    switch (actorType) {
        case "character": return game.settings.get(ManaBaseModule.ID, "worldShowManaPCDefault");
        case "npc": return game.settings.get(ManaBaseModule.ID, "worldShowManaNPCDefault");
        case "vehicle": return game.settings.get(ManaBaseModule.ID, "worldShowManaVehicleDefault");
        case "group": return game.settings.get(ManaBaseModule.ID, "worldShowManaGroupDefault");
        default: return false;
    }
}