import { module } from "./module-config";

// The flags used in the module.
export const FLAGS = {
  STATE: "state",
  ATTRIBUTES: "attributes",
  // The flags below are considered "internal".
  // They are not meant to be accessed by other modules.
  MODULE_VERSION: "_module-version", // The version of the module that the data models were last updated for.
  DEPENDENT_ATTRIBUTES: "_dependent-attributes", // Attributes that mana attributes are dependent on.
  DISPLAY_UI: "_display-ui", // Whether or not to display mana UI in an actor.
  EXPANDED_UI: "_expanded-ui", // The expanded UI shows all the mana attributes.
};

export const TEMPLATES = {
  ATTRIBUTE_PANE_UI: `modules/${module.id}/templates/attribute-mana-ui.hbs`,
  SPELLBOOK_PANE_UI: `modules/${module.id}/templates/spellbook-mana-ui.hbs`,
};
