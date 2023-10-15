/**
 * This class contains the configuration for the module.
 */
class ManaBaseModule {

    // Config stuff
    static ID = 'mana-base';
    static VERSION = "0.2.0"; // The version is used to determine if the data models need to be updated.

    // The flags used in the module.
    static FLAGS = {
        STATE: "state",
        ATTRIBUTES: "attributes",
        // The flags below are considered "internal".
        // They are not meant to be accessed by other modules.
        MODULE_VERSION: "_module-version", // The version of the module that the data models were last updated for.
        DEPENDENT_ATTRIBUTES: "_dependent-attributes", // Attributes that mana attributes are dependent on.
        DISPLAY_UI: "_display-ui", // Whether or not to display mana UI in an actor.
        EXPANDED_UI: "_expanded-ui" // The expanded UI shows all the mana attributes.
    }

    // The Handlebars templates used in the module.
    static TEMPLATES = {
        ATTRIBUTE_PANE_UI: `modules/${this.ID}/templates/attribute-mana-ui.hbs`,
        SPELLBOOK_PANE_UI: `modules/${this.ID}/templates/spellbook-mana-ui.hbs`
    }

    /**
     * Used to log messages to the console with the module ID as a prefix.
     * @param {boolean} force   Whether or not to force the log message to be displayed. 
     * @param  {...any} args    The arguments to pass to the console.log function.
     */
    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

}