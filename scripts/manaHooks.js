Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(Mana.ID);
});


Hooks.on("init", async function () {
    game.settings.register(Mana.ID, "showMana", { 
        name: "Show mana in character sheets",
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

// Non-final TODO: Extract HTML to handlebars template.
// TODO: Update documentation
// TODO: Refactor code to be more readable.
Hooks.on("renderActorSheet", function (dndSheet, html) {
    if (game.settings.get(Mana.ID, "showMana") === false) {
        return;
    }

    const actorId = dndSheet.object._id;
    addOrUpdateManaRelevantAtts(actorId);

    if (ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_STATE) === undefined) {
        // If the actor doesn't have a mana state flag, we need to create it and related mana flags.
        Mana.initialiseManaOnActor(actorId);
        return;
    }

    const manaFlags = dndSheet.object.flags[Mana.ID];
    const manaId = Mana.ID;

    // Mana Attributes
    const manaCap = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaCap;
    const manaX = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaX;
    const overchargeCap = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].overchargeCap;
    const manaRegen = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaRegen;
    const manaControl = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaControl;
    // Mana Pane Values
    const curMana = manaFlags[Mana.FLAGS.MANA_STATE];
    const maxMana = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaCap;

    const spellbookPaneRaw = `
    <div class="${manaId}-box-spell">
        <h2 class="${manaId}-label-spell">Mana:</h2>
        <input id="${manaId}-current" type="text" value="${curMana}" data-dtype="Number" placeholder="0" title="Current Mana" maxlength="5">
        <span class="seperator"> / </span>
        <input id="${manaId}-max" type="text" value="${maxMana}" data-dtype="Number" placeholder="0" title="Maximum Mana Capacity" maxlength="5">
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
                    <input id="${manaId}-max-attribute" type="text" value="${maxMana}" data-dtype="Number" placeholder="0" title="Maximum Mana Capacity" maxlength="5">
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
 * It checks if the actor has a MANA_RELATED_ATTRIBUTES flag, and if not, it adds it.
 * If it does, it updates the flag if the actor's attributes have changed.
 * If the flag is updated, it also updates the actor's mana attributes.
 * 
 * @param {string} actorId The ID of the actor to check for the flag.
 */
function addOrUpdateManaRelevantAtts(actorId) {
    const oldFlag = ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_RELATED_ATTRIBUTES);
    if (oldFlag === undefined) {
        const newFlag = getManaRelevantAtts(actorId);
        ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MANA_RELATED_ATTRIBUTES, newFlag);
        Mana.updateManaAttributes(actorId);
    } else {
        const newFlag = getManaRelevantAtts(actorId);
        if (!deepEqual(oldFlag, newFlag)) {
            ManaUtils.setManaActorFlag(actorId, Mana.FLAGS.MANA_RELATED_ATTRIBUTES, newFlag);
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
function getManaRelevantAtts(actorId) {
    let actorObj = game.actors.get(actorId);
    const relatedFlags = {
        wisMod : wisMod = actorObj.system.abilities.wis.mod,
        intMod : intMod = actorObj.system.abilities.int.mod,
        chaMod : chaMod = actorObj.system.abilities.cha.mod,
        profBonus : actorObj.system.attributes.prof,
        class : ManaConfig.findOriginalClassIdentifier(actorId)
    };

    return relatedFlags;
}

function setupManaFlags() {
    Mana.log(true, "Setting up mana flags.")

    const manaFlags = [];

    const flags = "flags";
    const modId = Mana.ID;
    const attribute = Mana.FLAGS.MANA_ATTRIBUTE;

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