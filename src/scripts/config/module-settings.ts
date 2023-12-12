/**
 * Register module settings
 * Setting types are not updated to v10, so we have to ignore the type errors.
 */
export function registerModuleSettings() {
  game.settings.register(ManaBaseModule.ID, modSettings.showUiOnPlayers.id, {
    name: "New PC Actor Mana UI Default",
    hint: "If enabled, all new Player Character actors will have the mana UI shown by default.",
    scope: modSettings.showUiOnPlayers.scope,
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: modSettings.showUiOnPlayers.default,
  });
  game.settings.register(ManaBaseModule.ID, modSettings.showUiOnNPCs.id, {
    name: "New NPC Actor Mana UI Default",
    hint: "If enabled, all new Non-Player Character actors will have the mana UI shown by default.",
    scope: modSettings.showUiOnNPCs.scope,
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: modSettings.showUiOnNPCs.default,
  });
  game.settings.register(ManaBaseModule.ID, modSettings.showUiOnVehicles.id, {
    name: "New Vehicle Actor Mana UI Default",
    hint: "If enabled, all new Vehicle actors will have the mana UI shown by default.",
    scope: modSettings.showUiOnVehicles.scope,
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: modSettings.showUiOnVehicles.default,
  });
  game.settings.register(ManaBaseModule.ID, modSettings.showUiOnGroups.id, {
    name: "New Group Actor Mana UI Default",
    hint: "If enabled, all new Group actors will have the mana UI shown by default.",
    scope: modSettings.showUiOnGroups.scope,
    config: true,
    // @ts-ignore v10
    requiresReload: false,
    type: Boolean,
    default: modSettings.showUiOnGroups.default,
  });
  game.settings.register(ManaBaseModule.ID, modSettings.showUiClient.id, {
    //The setting name should be set somewhere else, like in a constants file.
    name: "Display Mana UI in actor sheets",
    hint: "If enabled, mana will be shown in character sheets.",
    scope: modSettings.showUiClient.scope,
    config: true,
    // @ts-ignore v10
    requiresReload: true,
    type: Boolean,
    default: modSettings.showUiClient.default,
  });
}

export const modSettings: ModuleSettings = {
  showUiOnPlayers: {
    id: "worldShowManaPCDefault",
    scope: "world",
    default: true,
  },
  showUiOnNPCs: {
    id: "worldShowManaNPCDefault",
    scope: "world",
    default: false,
  },
  showUiOnVehicles: {
    id: "worldShowManaVehicleDefault",
    scope: "world",
    default: true,
  },
  showUiOnGroups: {
    id: "worldShowManaGroupDefault",
    scope: "world",
    default: false,
  },
  showUiClient: {
    id: "clientShowMana",
    scope: "client",
    default: true,
  },
};

type ModuleSettings = {
  [setting: string]: {
    id: string;
    scope: "world" | "client";
    default: boolean;
  };
};
