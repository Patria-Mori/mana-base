import { addManaFlagsToDAE } from "../utils/dependency-utils";
import { updateModuleDataModels } from "../utils/upgrade-util";
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
  updateModuleDataModels();
});

/**
 * A hook event that fires for every embedded Document type after conclusion of a creation workflow.
 * Substitute the Document name in the hook event to target a specific type, for example "createToken".
 * This hook fires for all connected clients after the creation has been processed.
 *
 * @param document - The new Document instance which has been created.
 * @param options - Additional options which modified the creation request.
 * @param userId - The ID of the User who triggered the creation workflow
 */
Hooks.on(
  "createActor",
  async function (document: Document, _options: unknown, _userId: unknown) {
    // ActorManaFlagUtils.initActorFlags(document);
  }
);

/**
 * A hook event that fires whenever an Application is rendered.
 * Substitute the Application name in the hook event to target a specific Application type, for example "renderMyApplication".
 * Each Application class in the inheritance chain will also fire this hook, i.e. "renderApplication" will also fire.
 * The hook provides the pending application HTML which will be added to the DOM.
 * Hooked functions may modify that HTML or attach interactive listeners to it.
 *
 * @param actorSheet - The Application instance being rendered.
 * @param html - The inner HTML of the document that will be displayed and may be modified.
 * @param data - The object of data used when rendering the application
 */
Hooks.on(
  "renderActorSheet",
  async function (actorSheet: Application, html: JQueryStatic, _data: object) {
    // injectUiIntoActorSheet(actorSheet, html);
  }
);

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
