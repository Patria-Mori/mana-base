// This section contains all the used hooks and their callbacks.

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
 * @param {Document} document - The new Document instance which has been created.
 * @param {DocumentModificationContext} options - Additional options which modified the creation request.
 * @param {string} userId - The ID of the User who triggered the creation workflow
 */
Hooks.on("createActor", async function (document, options, userId) {
    ActorManaFlagUtils.initActorFlags(document);
});

/**
 * A hook event that fires whenever an Application is rendered. 
 * Substitute the Application name in the hook event to target a specific Application type, for example "renderMyApplication". 
 * Each Application class in the inheritance chain will also fire this hook, i.e. "renderApplication" will also fire. 
 * The hook provides the pending application HTML which will be added to the DOM. 
 * Hooked functions may modify that HTML or attach interactive listeners to it.
 * 
 * @param {Application} actorSheet - The Application instance being rendered.
 * @param {jQuery} html - The inner HTML of the document that will be displayed and may be modified.
 * @param {object} data - The object of data used when rendering the application
 */
Hooks.on("renderActorSheet", async function (actorSheet, html, data) {
    injectUiIntoActorSheet(actorSheet, html);
});