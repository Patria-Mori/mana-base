/**
 * This file contains the code for registering and managing module settings.
 */

/**
 * Register module settings
 */
function registerModuleSettings() {
    game.settings.register(ManaBaseModule.ID, "worldShowManaPCDefault", {
        name: "New PC Actor Mana UI Default",
        hint: "If enabled, all new Player Character actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: true,
    });
    game.settings.register(ManaBaseModule.ID, "worldShowManaNPCDefault", {
        name: "New NPC Actor Mana UI Default",
        hint: "If enabled, all new Non-Player Character actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: false,
    });
    game.settings.register(ManaBaseModule.ID, "worldShowManaVehicleDefault", {
        name: "New Vehicle Actor Mana UI Default",
        hint: "If enabled, all new Vehicle actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: true,
    });
    game.settings.register(ManaBaseModule.ID, "worldShowManaGroupDefault", {
        name: "New Group Actor Mana UI Default",
        hint: "If enabled, all new Group actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: false,
    });
    game.settings.register(ManaBaseModule.ID, "clientShowMana", {  //The setting name should be set somewhere else, like in a constants file.
        name: "Display Mana UI in actor sheets",
        hint: "If enabled, mana will be shown in character sheets.",
        scope: "client",
        config: true,
        requiresReload: true,
        type: Boolean,
        default: true,
    });
}

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