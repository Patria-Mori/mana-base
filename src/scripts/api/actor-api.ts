import {
  approximateManaXValue,
  manaCapFormula,
  manaControlDiceFormula,
  manaRegenFormula,
  overchargeCapFormula,
} from "../config/mana-system-rules";
import { module } from "../config/module-config";
import { FLAGS } from "../config/module-constants";
import { DNDActor, ManaDependentAttributes, PMClass } from "../config/types";
import { deepEqual } from "../utils/code-utils";
import {
  getAbilityModifiers,
  getManaXValue,
  getProficiencyBonus,
} from "./dnd-api";
import FlagAPI from "./flag-api";
import GameAPI from "./game-api";
import { ManaAPI } from "./mana-api";

/**
 * Contains various utility functions that can be used to interact with actors in the mana system.
 */
export default class ActorAPI {
  private flagApi: FlagAPI;
  private manaApi: ManaAPI;
  private gameApi: GameAPI;

  constructor(flagApi: FlagAPI, manaApi: ManaAPI, gameApi = new GameAPI()) {
    this.flagApi = flagApi;
    this.manaApi = manaApi;
    this.gameApi = gameApi;
  }

  /**
   * Utility function that updates the mana attributes of a actor.
   * Derives the manaX value from the flag, which may be impacted by Active Effects.
   *
   * @param actorId The ID of the actor to update.
   */
  updateManaAttributes(actorId: string) {
    const actor = this.getDNDActor(actorId);
    this.manaApi.setManaAttributes(
      actorId,
      calculateActorManaAttributes(actor)
    );
  }

  /**
   * Initialises the module flags on a new actor.
   * @param actorId The ID of the actor to initialise flags for.
   * @param uiDefault Whether the mana UI should be enabled/disabled by default.
   */
  initialiseActorFlags(actorId: string, uiDefault: boolean) {
    const actor = this.getDNDActor(actorId);
    const mods = getAbilityModifiers(actor);

    const dependentAttributes: ManaDependentAttributes = {
      wisMod: mods.wisMod,
      intMod: mods.intMod,
      chaMod: mods.chaMod,
      manaX: 1,
      profBonus: getProficiencyBonus(actor),
      class: undefined,
    };

    this.updateManaAttributes;
    this.flagApi.setActorFlag(actorId, FLAGS.STATE, 0);
    this.flagApi.setActorFlag(actorId, FLAGS.MODULE_VERSION, module.version);
    this.flagApi.setActorFlag(actorId, FLAGS.STATE, uiDefault);
    this.flagApi.setActorFlag(actorId, FLAGS.STATE, false);
    this.flagApi.setActorFlag(actorId, FLAGS.STATE, dependentAttributes);
  }

  /**
   * Gets the mana relevant attributes for an actor.
   *
   * @param actorId The ID of the actor to get the attributes from.
   */
  getDependentAttributes(actorId: string): ManaDependentAttributes {
    const actor = this.getDNDActor(actorId);
    const mods = getAbilityModifiers(actor);
    return {
      wisMod: mods.wisMod,
      intMod: mods.intMod,
      chaMod: mods.chaMod,
      manaX: getManaXValue(actor),
      profBonus: getProficiencyBonus(actor),
      class: getOriginalClassIdentifier(actor),
    };
  }

  /**
   * Compares the dependent attributes on the actor to the ones in the flag of the actor,
   * if they are different, then the flag is updated and the actor's mana attributes are updated.
   *
   * @param  actorId The ID of the actor to check for the flag.
   */
  updateDependentAttributes(actorId: string) {
    const oldDependentAttributes = this.flagApi.getActorFlag(
      actorId,
      FLAGS.DEPENDENT_ATTRIBUTES
    ) as ManaDependentAttributes;

    // The old flag may not have been set yet, so we can just return, as this only happens during initialisation.
    if (oldDependentAttributes === undefined) {
      return;
    }

    const calculatedDependentAttributes = this.getDependentAttributes(actorId);
    if (!deepEqual(oldDependentAttributes, calculatedDependentAttributes)) {
      this.flagApi.setActorFlag(
        actorId,
        FLAGS.DEPENDENT_ATTRIBUTES,
        calculateActorManaAttributes
      );
      this.updateManaAttributes(actorId);
    }
  }

  getDNDActor(actorId: string): DNDActor {
    return this.gameApi.getActor(actorId) as any;
  }
}

/**
 * Calculates the various mana-related attributes for an actor.
 *
 * @param actor An actor object.
 * @returns Mana attributes derived from the actor.
 */
export function calculateActorManaAttributes(actor: DNDActor): ManaAttributes {
  const mods = getAbilityModifiers(actor);
  const profBonus = getProficiencyBonus(actor);
  const actorClass = getOriginalClassIdentifier(actor) || PMClass.Fighter;
  // We use an approximation of manaX to avoid issues with overrides.
  const manaXUnmodified = approximateManaXValue(actorClass) || 1;
  // Modified version of the mana x value, used to calculate values that depend on it.
  const manaX = getManaXValue(actor);
  const overchargeCapBonus = actorClass === PMClass.Sorcerer ? 10 : 0;

  return {
    manaCap: manaX
      ? manaCapFormula(mods.wisMod, profBonus, manaX)
      : manaCapFormula(mods.wisMod, profBonus, manaXUnmodified),
    manaX: manaXUnmodified,
    manaRegen: manaRegenFormula(mods.intMod, profBonus),
    manaControl: manaControlDiceFormula(mods.chaMod),
    overchargeCap: overchargeCapFormula(mods.chaMod, overchargeCapBonus),
  };
}

/**
 * Attempts to extract the original class of a character. Assumes the character is 5e compliant,
 * and that if it is homebrewed class, its DataModel is the same as standard classes.
 *
 * @param actor An actor object.
 * @returns Returns the class of the actor or undefined.
 */
export function getOriginalClassIdentifier(
  actor: DNDActor
): PMClass | undefined {
  const classes = actor._classes;
  for (const classIdentifier of Object.keys(classes)) {
    if (classes[classIdentifier].system.isOriginalClass) {
      return classIdentifier as PMClass;
    }
  }
  return undefined;
}
