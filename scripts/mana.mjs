class Mana {

    // Config stuff
    static ID = 'pm-mana';

    static FLAGS = {
        MANA: "mana",
        MANA_STATE: "mana-state",
        MANA_ATTRIBUTE: "mana-attribute",
        MANA_ATTRIBUTE_MODS: "mana-attribute-mods"
    }

    static TEMPLATES = {
        MANA: `modules/${this.ID}/templates/mana.hbs`
    }

    // "API"

    /**
     * Finds the mana capacity of the provided actor.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of maximum mana capacity (not including overload) or NaN if part of the caluclation failed.
     */
    static calculateCharacterManaCap(actorId) {
        let charObj = game.actors.get(actorId);
        let wisMod = charObj.system.abilities.wis.mod;
        let profBonus = charObj.system.attributes.prof;
        let xValue = ManaConfig.findXValueApproximation(actorId);

        //TODO: Account for "extra" value somewhere.
        return this.calcualteManaCap(wisMod, profBonus, xValue, 0);
    }

    /**
     * Finds the standard per tick mana regen of a given character. 
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of mana regen per tick, or NaN if part of the caluclation failed.
     */
    static calculateCharacterManaRegen(actorId) {
        let charObj = game.actors.get(actorId);
        let intMod = charObj.system.abilities.int.mod;
        let profBonus = charObj.system.attributes.prof;

        //TODO: Account for "extra" value somewhere.
        return this.calculateManaRegen(intMod, profBonus, 0);
    }

    /**
     * Finds the standard amount of dice a character can manipulate per turn.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of number of dice to roll, or NaN if part of the calculation failed.
     */
    static calculateCharacterManaControlDice(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        
        //TODO: Account for "extra" value somewhere.
        return this.calculateManaControlDice(chaMod, 0);
    }

    /**
     * Finds the standard amount of overcharge capacity a character has.
     * @param {string} actorId The ID of the actor we look for.
     * @returns {number} Integer value of overcharge capacity (separate from normal Mana Capacity), or NaN if part of the calculation failed.
     */
    static calculateCharacterOverchargeCap(actorId) {
        let charObj = game.actors.get(actorId);
        let chaMod = charObj.system.abilities.cha.mod;
        var extra = 0;

        // TODO: Standardise this and make it non-hard coded (probably some sort of map I guess?)
        if (this.findOriginalClassIdentifier(actorId) === "sorcerer") {
            extra = 10;
        }
        
        return this.calculateOverchargeCap(chaMod, extra);
    }

    /**
     * Utility function to calculate maximum the mana capacity of a character according to 
     * standard rules.
     * @param {number} wisMod Wisdom modifier of the character.
     * @param {number} profBonus Proficiency bonus of the character.
     * @param {number} xValue X Value of a character, usually derived from class/subclass.
     * @param {number} extra Flat extra mana a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of maximum mana capacity, not including overload.
     */
    static calcualteManaCap(wisMod, profBonus, xValue, extra) {
        return ((wisMod + 1) * profBonus * xValue) + extra;
    }

    /**
     * Utility function to calculate the standard mana regeration per tick.
     * @param {number} intMod Intelligence modifier of the character.
     * @param {number} profBonus Proficiency bonus of the character.
     * @param {number} extra Flat extra regen a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of mana regen per tick.
     */
    static calculateManaRegen(intMod, profBonus, extra) {
        return (intMod * profBonus) + 1 + extra;
    }

    /**
     * Utility function to calculate the amount of dice of mana a character can manipulate in one turn.
     * Note that unlike other mana values this is not an absolute value, but instead the number of d8s to roll.
     * @param {number} chaMod Charisma modifier of the character.
     * @param {number} extra Flat extra dice a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of number of dice to roll.
     */
    static calculateManaControlDice(chaMod, extra) {
        return (chaMod + 2) + extra;
    }

    /**
     * Utility function to calculate the maximum overcharge value a character can safely hold beyond the normal
     * maximum. Note that this function does not account for sorcerer's getting +10 to this value.
     * @param {number} chaMod Charisma modifier of the character.
     * @param {number} extra Flat extra dice a character may have for whatever reason (again, I blame Lori).
     * @returns {number} Integer value of Overcharge capacity.
     */
    static calculateOverchargeCap(chaMod, extra) {
        return (chaMod * 3) + extra;
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

}

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(Mana.ID);
});

// Non-final
Hooks.on("renderActorSheet", function (dndSheet, html) {
    const manaFlags = dndSheet.object.flags[Mana.ID];
    const manaId = Mana.ID;
    const curMana = manaFlags[Mana.FLAGS.MANA_STATE];
    const maxMana = manaFlags[Mana.FLAGS.MANA_ATTRIBUTE].manaCap;
    const curManaName = "flags." + manaId + "." + Mana.FLAGS.MANA_STATE;
    const maxManaName = "flags." + manaId + "." + Mana.FLAGS.MANA_ATTRIBUTE + ".manaCap";

    const spellbookPaneRaw = `
    <div class="${manaId}-box-spell">
        <h2 class="${manaId}-label-spell">Mana:</h2>
        <input class="${manaId}-current" type="number" name="${curManaName}" value="${curMana}" data-dtype="Number" placeholder="0" title="Current Mana" maxlength="3">
        <span class="seperator"> / </span>
        <input class="${manaId}-max" type="number" name="${maxManaName}" value="${maxMana}" data-dtype="Number" placeholder="0" title="Maximum Mana Capacity" maxlength="3">
    </div>`;
    const spellbookPaneHtml = htmlToElement(spellbookPaneRaw);

    const inventoryFiltersDiv = html[0].querySelectorAll(".spellbook .inventory-filters");
    inventoryFiltersDiv[0].prepend(spellbookPaneHtml);

    const attributePaneRaw = `
    <li class="${Mana.ID}-resource">
        <h4 class="${Mana.ID}-label-attribute">
            Mana
        </h4>
        <div class="${Mana.ID}-box-attribute">
            <input class="${Mana.ID}-current" type="text" name="${curManaName}" value="${curMana}" data-dtype="Number" placeholder="0" title="Current Mana" maxlength="3">
            <span class="seperator"> / </span>
            <input class="${Mana.ID}-max" type="text" name="${maxManaName}" value="${maxMana}" data-dtype="Number" placeholder="0" title="Maximum Mana Capacity" maxlength="3">
        </div>
    </li> `;
    const attributePaneHtml = htmlToElement(attributePaneRaw);

    const attributesResource = html[0].querySelectorAll(".attributes .resources");
    attributesResource[0].prepend(attributePaneHtml);
});

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