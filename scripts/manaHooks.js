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

// Render hooks
/**
 * I've run into an issue with using this method for detecting changes:
 * It doesn't always fire when I need it to.
 * Sometimes it will fire, like with abilities, but it doesn't seem to fire when prof bonus changes, or level changes.
 * Thus, to remedy this problem, I think the best way is to store a state of the actor's relevant attributes and stats,
 * and then compare that state to the current state of the actor to see if anything has changed.
 * 
 * The things I need to store are:
 * - Ability scores (wis, int, cha)
 * - Proficiency bonus
 * - Class
 */
Hooks.on("updateActor", function (actor, data, options, userId) {
    if (game.settings.get(Mana.ID, "showMana") === false) {
        return;
    }

    if (data.system?.abilities) { // This will only be true if the update contains a change to ability scores.
        Mana.updateManaAttributes(actor._id);
    }
});

// Non-final TODO: Extract HTML to handlebars template.
Hooks.on("renderActorSheet", function (dndSheet, html) {
    if (game.settings.get(Mana.ID, "showMana") === false) {
        return;
    }

    const actorId = dndSheet.object._id;
    if (ManaUtils.getManaActorFlag(actorId, Mana.FLAGS.MANA_STATE) === undefined) {
        // If the actor doesn't have a mana state flag, we need to create it and related mana flags.
        Mana.initialiseManaOnActor(actorId);
        return;
    }

    const manaFlags = dndSheet.object.flags[Mana.ID];
    const manaId = Mana.ID;
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