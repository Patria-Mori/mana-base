Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(Mana.ID);
});


Hooks.on("init", async function () {
    game.settings.register(Mana.ID, "worldShowManaPCDefault", {
        name: "New PC Actor Mana UI Default",
        hint: "If enabled, all new Player Character actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: true,
    });
    game.settings.register(Mana.ID, "worldShowManaNPCDefault", {
        name: "New NPC Actor Mana UI Default",
        hint: "If enabled, all new Non-Player Character actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: false,
    });
    game.settings.register(Mana.ID, "worldShowManaVehicleDefault", {
        name: "New Vehicle Actor Mana UI Default",
        hint: "If enabled, all new Vehicle actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: true,
    });
    game.settings.register(Mana.ID, "worldShowManaGroupDefault", {
        name: "New Group Actor Mana UI Default",
        hint: "If enabled, all new Group actors will have the mana UI shown by default.",
        scope: "world",
        config: true,
        requiresReload: false,
        type: Boolean,
        default: false,
    });
    game.settings.register(Mana.ID, "clientShowMana", {  //The setting name should be set somewhere else, like in a constants file.
        name: "Display Mana UI in actor sheets",
        hint: "If enabled, mana will be shown in character sheets.",
        scope: "client",
        config: true,
        requiresReload: true,
        type: Boolean,
        default: true,
    });
});

/**
 * Sets up the module.
 */
Hooks.on("setup", async function () {
    setupManaFlags();
});

// This hook is fired when an actor is created, should be used to intialise the module flags on the actor.
Hooks.on("createActor", async function (document, options, userId) {
    initActorModuleFlags(document);
});

// Non-final TODO: Extract HTML to handlebars template.
// TODO: Update documentation
// TODO: Refactor code to be more readable.
Hooks.on("renderActorSheet", function (dndSheet, html) {
    const manaFlags = dndSheet.object.flags[Mana.ID];
    const manaId = Mana.ID;

    // If the actor has the display mana flag set to false, we don't want to show the UI.
    if (manaFlags[Mana.FLAGS.DISPLAY_MANA] === false) { 
        return;
    }
    
    // If the user has the client setting to not show mana, we don't want to show the UI.
    if (game.settings.get(Mana.ID, "clientShowMana") === false) {
        return;
    }

    const actorId = dndSheet.object._id;
    addOrUpdateManaRelevantAtts(actorId);

    // Mana Attributes
    const manaCap = manaFlags[Mana.FLAGS.ATTRIBUTES].manaCap;
    const manaX = manaFlags[Mana.FLAGS.ATTRIBUTES].manaX;
    const overchargeCap = manaFlags[Mana.FLAGS.ATTRIBUTES].overchargeCap;
    const manaRegen = manaFlags[Mana.FLAGS.ATTRIBUTES].manaRegen;
    const manaControl = manaFlags[Mana.FLAGS.ATTRIBUTES].manaControl;
    // Mana Pane Values
    const curMana = manaFlags[Mana.FLAGS.STATE];
    const maxMana = manaFlags[Mana.FLAGS.ATTRIBUTES].manaCap;

    const spellbookPaneRaw = `
    <div class="${manaId}-box-spell">
        <h2 class="${manaId}-label-spell">Mana:</h2>
        <input id="${manaId}-current" type="text" value="${curMana}" data-dtype="Number" placeholder="0" title="Current Mana" maxlength="5">
        <span class="seperator"> / </span>
        <span id="${manaId}-max" title="Maximum Mana Capacity">${maxMana}</span>
    </div>`;
    const spellbookPaneHtml = htmlToElement(spellbookPaneRaw);

    const inventoryFiltersDiv = html[0].querySelectorAll(".spellbook .inventory-filters");
    inventoryFiltersDiv[0].prepend(spellbookPaneHtml);              // Adds the mana "box" to the inventory filters div.
    inventoryFiltersDiv[0].style.display = "flex";                  // Makes the inventory filters div a flexbox.
    inventoryFiltersDiv[0].style.justifyContent = "space-between";  // Makes the mana box div and the ineventory filter div align properly.

    // Adds expandable mana attribute pane to the character sheet.
    const extendedUIFlag = ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.EXTENDED_MANA_UI);
    const extendedUIStyle = extendedUIFlag ? `` : `display: none;`;

    const attributePaneRaw = `
    <div class="${manaId}-box-attribute">
        <ul class="${manaId}-list-attribute">
            <li class="${manaId}-resource">
                <h4 class="${manaId}-label-attribute">Mana</h4>
                <div class="${manaId}-box-attribute">
                    <input id="${manaId}-current-attribute" type="text" value="${curMana}" data-dtype="Number" placeholder="0" title="Current Mana" maxlength="5">
                    <span class="seperator"> / </span>
                    <span id="${manaId}-max-attribute" title="Maximum Mana Capacity">${maxMana}</span>
                </div>
            </li>
        </ul>
        <button type="button" class="${manaId}-regen-button flex0" title="Regen Mana (1 tick)">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
        </button>
        <button type="button" class="${manaId}-toggle-extendedUI flex0" title="Expand/Collapse Mana Attribute Pane - Shows you the Mana Attribute Values">
            <i class="fa-solid fa-expand"></i>
        </button>
        <div class="${manaId}-extendedUI" style="${extendedUIStyle}">
            <h4>Mana Cap: ${manaCap}</h4>
            <h4>Mana X: ${manaX}</h4>
            <h4>Overcharge Cap: ${overchargeCap}</h4>
            <h4>Mana Regen: ${manaRegen}</h4>
            <h4>Mana Control Dice: ${manaControl}</h4>
        </div>
    </div> `;
    const attributePaneHtml = htmlToElement(attributePaneRaw); 

    const attributePaneDiv = html[0].querySelectorAll(".attributes .center-pane");
    attributePaneDiv[0].prepend(attributePaneHtml);

    
    // Add event listeners to the input fields
    const currentInput = html.find(`#${manaId}-current`);
    currentInput.on("change", (event) => {
        ManaState.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const maxInput = html.find(`#${manaId}-max`);
    maxInput.on("change", (event) => {
        ManaState.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const currentInputAtt = html.find(`#${manaId}-current-attribute`);
    currentInputAtt.on("change", (event) => {
        ManaState.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const maxInputAtt = html.find(`#${manaId}-max-attribute`);
    maxInputAtt.on("change", (event) => {
        ManaState.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const regenButton = html.find(`.${manaId}-regen-button`);
    regenButton.on("click", () => {
        ManaState.regenMana(actorId, 1, true);
    });

    // Add event listeners to the toggle extended UI button
    const toggleExtendedUIButton = html.find(`.${manaId}-toggle-extendedUI`);
    toggleExtendedUIButton.on("click", () => {
        
        if (extendedUIFlag) {
            ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.EXTENDED_MANA_UI, false);
        } else { 
            ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.EXTENDED_MANA_UI, true);
        }
    });
});

// Utility functions

/**
 * This function can be used to initialise the mana module flags on an actor.
 * @param {Document} document - The actor document.
 */
function initActorModuleFlags(document) {
    const actorId = document._id;
    // ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.STATE, 0);
    // ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.ATTRIBUTES, null);
    Mana.initialiseManaOnActor(actorId); //TODO: Integrate that function into this one.
    ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MODULE_VERSION, Mana.VERSION); // Sets the module version flag.

    // Determine whether or not to display mana UI based on the default settings.
    const newActorDefault = getDisplayManaDefault(document.type);
    ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.DISPLAY_MANA, newActorDefault); 
    ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.EXTENDED_MANA_UI, false); // Sets the extended mana UI flag to false (collapsed by default).

    // Sets the dependent attributes flags on the actor.
    const dependentAttributes = {
        wisMod : document.system.abilities.wis.mod,
        intMod : document.system.abilities.int.mod,
        chaMod : document.system.abilities.cha.mod,
        xMod : xMod = 1,
        profBonus : document.system.attributes.prof,
        class : undefined
    };
    
    //getManaRelevantAtts(actorId);
    ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.DEPENDENCY_ATTRIBUTES, dependentAttributes);
}

/**
 * Utility function to convert a string of HTML code to an element.
 * @param {string} html 
 * @returns 
 */
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

/**
 * Utility function that determines the default mana UI display value 
 * to set on new actors based on the actor type and the world settings.
 * @param {string} actorType - The actor type.
 * @returns {boolean} The default mana UI display value. 
 */
function getDisplayManaDefault(actorType) {
    switch (actorType) {
        case "character": return game.settings.get(Mana.ID, "worldShowManaPCDefault");
        case "npc": return game.settings.get(Mana.ID, "worldShowManaNPCDefault");
        case "vehicle": return game.settings.get(Mana.ID, "worldShowManaVehicleDefault");
        case "group": return game.settings.get(Mana.ID, "worldShowManaGroupDefault");
        default: return false;
    }
}

/**
 * Calculates the "lazy mana" value. 
 * If lazy mana is just a number it will return that number.
 * If lazy mana contains a + or - it will add or subtract that value from the old mana value.
 * The lower bound is 0.
 *
 * @param {number} oldMana - The old mana value.
 * @param {string} lazyMana - The lazy mana value.
 * @returns {number} - The calculated lazy mana as a number.
 */
function lazyMana(oldMana, lazyMana) {
    let calculatedMana = 0;
  
    if (/^[+|-]\d+$/.test(lazyMana)) {
      calculatedMana = oldMana + parseInt(lazyMana);
    } else {
      calculatedMana = parseInt(lazyMana);
    }
  
    return Math.max(calculatedMana, 0);
}

/**
 * Not the most concise name, but it does what it says on the tin.
 * It checks if the actor has a DEPENDENCY_ATTRIBUTES flag, and if not, it adds it.
 * If it does, it updates the flag if the actor's attributes have changed.
 * If the flag is updated, it also updates the actor's mana attributes.
 * 
 * @param {string} actorId The ID of the actor to check for the flag.
 */
function addOrUpdateManaRelevantAtts(actorId) {
    const oldFlag = ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.DEPENDENCY_ATTRIBUTES);
    if (oldFlag === undefined) {
        const newFlag = getManaDependentAtts(actorId);
        ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.DEPENDENCY_ATTRIBUTES, newFlag);
        Mana.updateManaAttributes(actorId);
    } else {
        const newFlag = getManaDependentAtts(actorId);
        if (!deepEqual(oldFlag, newFlag)) {
            ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.DEPENDENCY_ATTRIBUTES, newFlag);
            Mana.updateManaAttributes(actorId);
        }
    }
}

/**
 * Compares two objects for deep equality. 
 * This means that it will compare the values of the objects, not the references.
 * 
 * @param {*} object1 
 * @param {*} object2 
 * @returns true if the objects are equal, false otherwise.
 */
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}

/**
 * Gets the mana relevant attributes for an actor.
 * 
 * @param {string} actorId The ID of the actor to set the flag for.
 */
function getManaDependentAtts(actorId) {
    let actorObj = game.actors.get(actorId);
    const dependentAttributes = {
        wisMod : wisMod = actorObj.system.abilities.wis.mod,
        intMod : intMod = actorObj.system.abilities.int.mod,
        chaMod : chaMod = actorObj.system.abilities.cha.mod,
        xMod : xMod = actorObj.flags[Mana.ID][Mana.FLAGS.ATTRIBUTES].manaX,
        profBonus : actorObj.system.attributes.prof,
        class : ManaConfig.findOriginalClassIdentifier(actorId)
    };

    return dependentAttributes;
}

function setupManaFlags() {
    Mana.log(true, "Setting up mana flags.")

    const manaFlags = [];

    const flags = "flags";
    const modId = Mana.ID;
    const attribute = Mana.FLAGS.ATTRIBUTES;

    // TODO: Replace with a loop over the enum.
    manaFlags.push(`${flags}.${modId}.${attribute}.manaCap`);
    manaFlags.push(`${flags}.${modId}.${attribute}.manaControl`);
    manaFlags.push(`${flags}.${modId}.${attribute}.manaRegen`);
    manaFlags.push(`${flags}.${modId}.${attribute}.manaX`);
    manaFlags.push(`${flags}.${modId}.${attribute}.overchargeCap`);

    // Adds the flags to the DAE fields, making it easier to select them in the DAE UI.
    // TODO: This is a hacky way to do this. Find a better way.
    if (game.modules.get("dae")) {
        const initDAE = async () => {
            for (let i = 0; i < 100; i++) {
                if (globalThis.DAE) {
                    globalThis.DAE.addAutoFields(manaFlags);
                    return true;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            return false;
        };
        initDAE().then(value => {if (!value)
            console.error(`${Mana.ID} | initDAE settings failed.`)});
    }
}