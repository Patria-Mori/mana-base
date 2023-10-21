/**
 * Register module settings
 * Setting types are not updated to v10, so we have to ignore the type errors.
 */
export function registerModuleSettings() {
  game.settings.register(ManaBaseModule.ID, "worldShowManaPCDefault", {
    name: "New PC Actor Mana UI Default",
    hint: "If enabled, all new Player Character actors will have the mana UI shown by default.",
    scope: "world",
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register(ManaBaseModule.ID, "worldShowManaNPCDefault", {
    name: "New NPC Actor Mana UI Default",
    hint: "If enabled, all new Non-Player Character actors will have the mana UI shown by default.",
    scope: "world",
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register(ManaBaseModule.ID, "worldShowManaVehicleDefault", {
    name: "New Vehicle Actor Mana UI Default",
    hint: "If enabled, all new Vehicle actors will have the mana UI shown by default.",
    scope: "world",
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: true,
  });
  game.settings.register(ManaBaseModule.ID, "worldShowManaGroupDefault", {
    name: "New Group Actor Mana UI Default",
    hint: "If enabled, all new Group actors will have the mana UI shown by default.",
    scope: "world",
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: false,
  });
  game.settings.register(ManaBaseModule.ID, "clientShowMana", {
    //The setting name should be set somewhere else, like in a constants file.
    name: "Display Mana UI in actor sheets",
    hint: "If enabled, mana will be shown in character sheets.",
    scope: "client",
    config: true,
    // @ts-ignore v10
    requiresReload: true,
    type: Boolean,
    default: true,
  });
}
