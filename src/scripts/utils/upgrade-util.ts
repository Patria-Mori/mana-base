import { getOriginalClassIdentifier } from "../api/actor-api";
import FlagAPI from "../api/flag-api";
import {
  approximateManaXValue,
  manaCapFormula,
  manaControlDiceFormula,
  manaRegenFormula,
  overchargeCapFormula,
} from "../config/mana-system-rules";
import { FLAGS } from "../config/module-constants";
import { PMClass } from "../config/types";
import ManaAttributes from "../model/mana-attributes";
import { log } from "../module";

// Utility functions for updating the data models of actors when the module is updated.
/**
 * During start-up this function is called, and goes through all the actors in the world,
 * updating the data models fo the actors who have outdated data models.
 *
 * It iterates over all the actors in the world, and identifies the actors who have outdated data models,
 * and then calls the update function for that specific version of the data model.
 */
export async function updateModuleDataModels(flagApi: FlagAPI) {
  const actors = game.actors as Actors;
  for (let actor of actors) {
    let actorDataModelVersion = flagApi.getActorFlag(
      (actor as any)._id,
      FLAGS.MODULE_VERSION
    );
    switch (actorDataModelVersion) {
      case undefined:
        updateV01xToV020(actor, flagApi);
        break;
      default:
        break;
    }
  }
}

/**
 * This is a specific update function for updating from v0.1.x to v0.2.0 on one actor.
 * The function can handle both v0.1.0 and v0.1.1. because the data model was very similar.
 * This function is called by updateModuleDataModels.
 *
 * The function avoids using "non-pure" functions, to avoid functionality breaking if those functions are changed.
 * We also avoid using the ManaBaseModule.FLAGS enum, because that only represent the latest data model.
 *
 * To update the data model, the function does the following:
 * 1. It creates a new Attributes object, using the old attributes as a base.
 *      The constructor will correct negative values.
 * 2. State is unchanged.
 * 3. Dependent attributes are extracted from the actor, and stored in the flag.
 *      We discard the old flag, because it may not be correct.
 * 4. "_extended-ui" is carried over to "_expanded-ui".
 * 5. "_display-ui" is set to true.
 * 6. "_module-version" is set to "0.2.0".
 */
async function updateV01xToV020(actor: any, flagApi: FlagAPI) {
  log(true, "Updating actor " + actor.name + " from v0.1.x to v0.2.0");
  const actorId = actor._id;

  // Step 1
  const intMod = actor.system.abilities.int.mod;
  const wisMod = actor.system.abilities.wis.mod;
  const chaMod = actor.system.abilities.cha.mod;
  const profBonus = actor.system.attributes.prof;
  const xValue = actor.flags["mana-base"]["attributes"].manaX;
  const actorClass = getOriginalClassIdentifier(actor) || PMClass.Fighter;

  const manaCap = manaCapFormula(wisMod, profBonus, xValue);
  const manaX = approximateManaXValue(actorClass);
  const manaRegen = manaRegenFormula(intMod, profBonus);
  const manaControlDice = manaControlDiceFormula(chaMod);
  const overchargeCap = overchargeCapFormula(chaMod, 0);

  const newAttributes = new ManaAttributes(
    manaCap,
    manaX,
    overchargeCap,
    manaRegen,
    manaControlDice
  );
  flagApi.setActorFlag(actorId, "attributes", newAttributes);

  // Step 2
  flagApi.setActorFlag(actorId, "state", actor.flags["mana-base"].state);

  // Step 3
  const dependentAttributes = {
    wisMod,
    intMod,
    chaMod,
    manaX: xValue,
    profBonus,
    class: actorClass,
  };
  flagApi.setActorFlag(actorId, "_dependent-attributes", dependentAttributes);
  flagApi.unsetActorFlag(actorId, "_dependency-attributes");

  // Step 4
  const oldExpandedUiFlag = flagApi.getActorFlag(actorId, "_extended-UI")
    ? flagApi.getActorFlag(actorId, "_extended-UI")
    : false;
  flagApi.setActorFlag(actorId, "_expanded-ui", oldExpandedUiFlag);
  flagApi.unsetActorFlag(actorId, "_extended-UI");

  // Step 5
  flagApi.setActorFlag(actorId, "_display-ui", true);

  // Step 6
  flagApi.setActorFlag(actorId, "_module-version", "0.2.0");
}
