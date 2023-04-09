/**
 * This script is responsible for controlling the UI elements in the actor sheet.
 */

// TODO: Update documentation
// TODO: Refactor code to be more readable.
/**
 * This function is responsible for injecting the mana UI into the actor sheet.
 * This is calibrated for the tidy5e sheet, currently only works with NPCs and PCs.
 * 
 * @param {Application} actorSheet - The Application instance being rendered.
 * @param {jQuery} html - The inner HTML of the document that will be displayed and may be modified.
 */
async function injectUiIntoActorSheet(actorSheet, html) {
    const manaFlags = actorSheet.object.flags[ManaBaseModule.ID];
    const manaId = ManaBaseModule.ID;

    // If the actor has the display mana flag set to false, we don't want to show the UI.
    if (manaFlags[ManaBaseModule.FLAGS.DISPLAY_UI] === false) { 
        return;
    }
    
    // If the user has the client setting to not show mana, we don't want to show the UI.
    if (game.settings.get(ManaBaseModule.ID, "clientShowMana") === false) {
        return;
    }

    const actorId = actorSheet.object._id;
    ActorManaFlagUtils.updateDependentAtts(actorId);

    // Mana Attributes
    const manaCap = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].manaCap;
    const manaX = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].manaX;
    const overchargeCap = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].overchargeCap;
    const manaRegen = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].manaRegen;
    const manaControl = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].manaControl;
    // Mana Pane Values
    const curMana = manaFlags[ManaBaseModule.FLAGS.STATE];
    const maxMana = manaFlags[ManaBaseModule.FLAGS.ATTRIBUTES].manaCap;

    const uiSpellbookTemplate = `modules/${ManaBaseModule.ID}/templates/spellbook-mana-ui.hbs`;
    const uiSpellbookData = {manaId: manaId, curMana: curMana, maxMana: maxMana}; // The data to be passed to the template.
    const uiSpellbookRender = await renderTemplate(uiSpellbookTemplate, uiSpellbookData); // Turns the template into HTML.
    const uiSpellbookElement = htmlToElement(uiSpellbookRender); // Turns the HTML into an element.

    const inventoryFiltersDiv = html[0].querySelectorAll(".spellbook .inventory-filters");
    inventoryFiltersDiv[0].prepend(uiSpellbookElement);             // Adds the mana "box" to the inventory filters div.
    inventoryFiltersDiv[0].style.display = "flex";                  // Makes the inventory filters div a flexbox.
    inventoryFiltersDiv[0].style.justifyContent = "space-between";  // Makes the mana box div and the ineventory filter div align properly.

    // Adds expandable mana attribute pane to the character sheet.
    const extendedUIFlag = ManaFlagUtils.getManaActorFlag(actorId, ManaBaseModule.FLAGS.EXPANDED_UI);
    const extendedUIStyle = extendedUIFlag ? `` : `display: none;`;

    const uiAttributeTemplate = `modules/${ManaBaseModule.ID}/templates/attribute-mana-ui.hbs`;
    const uiAttributeData = {manaId: manaId, curMana: curMana, maxMana: maxMana,
        extendedUIStyle: extendedUIStyle, manaCap: manaCap, manaX: manaX, 
        overchargeCap: overchargeCap, manaRegen: manaRegen, manaControl: manaControl}; // The data to be passed to the template.
    const uiAttributeRender = await renderTemplate(uiAttributeTemplate, uiAttributeData); 
    const uiAttributeElement = htmlToElement(uiAttributeRender); 

    const attributePaneDiv = html[0].querySelectorAll(".attributes .center-pane");
    attributePaneDiv[0].prepend(uiAttributeElement);

    
    // Add event listeners to the input fields
    const currentInput = html.find(`#${manaId}-current`);
    currentInput.on("change", (event) => {
        ManaStateApi.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const maxInput = html.find(`#${manaId}-max`);
    maxInput.on("change", (event) => {
        ManaStateApi.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const currentInputAtt = html.find(`#${manaId}-current-attribute`);
    currentInputAtt.on("change", (event) => {
        ManaStateApi.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const maxInputAtt = html.find(`#${manaId}-max-attribute`);
    maxInputAtt.on("change", (event) => {
        ManaStateApi.setMana(actorId, lazyMana(curMana, event.target.value));
    });

    const regenButton = html.find(`.${manaId}-regen-button`);
    regenButton.on("click", () => {
        ManaStateApi.regenMana(actorId, 1, true);
    });

    // Add event listeners to the toggle extended UI button
    const toggleExtendedUIButton = html.find(`.${manaId}-toggle-extendedUI`);
    toggleExtendedUIButton.on("click", () => {
        
        if (extendedUIFlag) {
            ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.EXPANDED_UI, false);
        } else { 
            ManaFlagUtils.setManaActorFlag(actorId, ManaBaseModule.FLAGS.EXPANDED_UI, true);
        }
    });
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