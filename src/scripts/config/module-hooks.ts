import { addManaFlagsToDAE } from "../utils/dependency-utils";
import { module } from "./module-config";
import { TEMPLATES } from "./module-constants";
import { registerModuleSettings } from "./module-settings";

// This section contains all the used hooks and their callbacks.
/**
 * This hook is called by the DevMode module when it is ready.
 */ // @ts-ignore
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  // Registers the module's debug flag with the dev mode module if it is installed.
  registerPackageDebugFlag(module.id);
});

/**
 * A hook event that fires as Foundry is initializing, right before any initialization tasks have begun.
 */
Hooks.once("init", () => {
  registerModuleSettings();
  preloadHandlebarsTemplates();
});

/**
 * A hook event that fires when Foundry has finished initializing but before the game state has been set up.
 * Fires before any Documents, UI applications, or the Canvas have been initialized.
 */
Hooks.on("setup", async function () {
  addManaFlagsToDAE();
});

/**
 * A hook event that fires when the game is fully ready.
 * Useful when you need the game data to be fully initialised.
 */
Hooks.on("ready", async function () {
  // updateModuleDataModels(); TODO
});

/**
 * Preloads and caches the handlebars templates used by the module.
 * @returns Promise that resolves once the templates are loaded.
 */
async function preloadHandlebarsTemplates() {
  const templatePaths = [
    TEMPLATES.ATTRIBUTE_PANE_UI,
    TEMPLATES.SPELLBOOK_PANE_UI,
  ];

  return loadTemplates(templatePaths);
}
