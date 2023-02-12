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
    let div = document.createElement("div");
    div.setAttribute("class", "mana-box");

    let label = document.createElement("h2");
    label.setAttribute("class", "mana-label");
    label.append("Mana:");

    let currManaInput = document.createElement("input");
    currManaInput.setAttribute("class", "mana-current");
    currManaInput.setAttribute("type", "number");
    currManaInput.setAttribute("name", "TODO"); //TODO: Should be the flag path of the relevant flag 
    currManaInput.setAttribute("value", "30");
    currManaInput.setAttribute("data-dtype", "Number");
    currManaInput.setAttribute("placeholder", "0");
    currManaInput.setAttribute("title", "Current Mana");

    let maxManaInput = document.createElement("input");
    maxManaInput.setAttribute("class", "mana-max");
    maxManaInput.setAttribute("type", "number");
    maxManaInput.setAttribute("name", "TODO"); //TODO: Should be the flag path of the relevant flag 
    maxManaInput.setAttribute("value", "120");
    maxManaInput.setAttribute("data-dtype", "Number");
    maxManaInput.setAttribute("placeholder", "0");
    maxManaInput.setAttribute("title", "Maximum Mana Capacity");
    
    div.append(label);
    div.append(currManaInput);
    div.append(" / ");
    div.append(maxManaInput);


    const inventoryFiltersDiv = html[0].querySelectorAll(".spellbook .inventory-filters");
    inventoryFiltersDiv[0].prepend(div);

    // The below code injects into the Attributes pane, currently hijacking resources styling, which is buggy and bad.
    let li = document.createElement("li");
    li.setAttribute("class", "resource visible");


    let h4 = document.createElement("h4");
    h4.setAttribute("class", "resource-name");
    
    let inp0 = document.createElement("input");
    inp0.setAttribute("name", "system.resources.primary.label");
    inp0.setAttribute("type", "text");
    inp0.setAttribute("value", "Mana");
    inp0.setAttribute("placeholder", "Mana");

    h4.append(inp0);


    let liDiv = document.createElement("div");
    liDiv.setAttribute("class", "resource-value multiple");

    let inp1 = document.createElement("input");
    inp1.setAttribute("class", "res-value");
    inp1.setAttribute("type", "text");
    inp1.setAttribute("name", "TODO"); //TODO: Should be the flag path of the relevant flag 
    inp1.setAttribute("value", "");
    inp1.setAttribute("data-dtype", "Number");
    inp1.setAttribute("placeholder", "0");
    inp1.setAttribute("title", "Current Mana");
    inp1.setAttribute("maxlength", "3");

    let sepSpan = document.createElement("span");
    sepSpan.setAttribute("class", "sep");
    sepSpan.append(" / ");

    let inp2 = document.createElement("input");
    inp2.setAttribute("class", "res-max");
    inp2.setAttribute("type", "text");
    inp2.setAttribute("name", "TODO"); //TODO: Should be the flag path of the relevant flag 
    inp2.setAttribute("value", "");
    inp2.setAttribute("data-dtype", "Number");
    inp2.setAttribute("placeholder", "0");
    inp2.setAttribute("title", "Max Mana");
    inp2.setAttribute("maxlength", "3");

    liDiv.append(inp1);
    liDiv.append(sepSpan);
    liDiv.append(inp2);

    li.append(h4);
    li.append(liDiv);


    const attributesResource = html[0].querySelectorAll(".attributes .resources");
    attributesResource[0].prepend(li);

    Mana.log(true, attributesResource);
});