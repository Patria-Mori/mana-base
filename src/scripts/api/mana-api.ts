import invariant from "tiny-invariant";
import { FLAGS } from "../config/module-constants";
import FlagAPI from "./flag-api";
import ManaAttributes from "../model/mana-attributes";

/**
 * The Mana API can be used to manipulate the mana state or attributes of an actor.
 */
export class ManaAPI {
  private flagApi: FlagAPI;

  constructor(flagApi: FlagAPI) {
    this.flagApi = flagApi;
  }

  /**
   * Get the mana state value from an actor.
   * @param actorId The ID of the actor to get the mana state value from.
   * @returns Mana value of the supplied actor.
   */
  getMana(actorId: string): number {
    return this.flagApi.getActorFlag(actorId, FLAGS.STATE);
  }

  /**
   * Set/update the mana state flag for an actor.
   * @param actorId The ID of the actor to set/update the mana state flag for.
   * @returns Promise of updated actor document.
   */
  setMana(actorId: string, newManaVal: number): void {
    this.flagApi.setActorFlag(actorId, FLAGS.STATE, newManaVal);
  }

  /**
   * Get Mana Attribute from a given actor.
   * @param actorId The ID of the actor to get the mana attribute flag from.
   * @returns Mana Attribute object.
   */
  getManaAttributes(actorId: string): ManaAttributes {
    return this.flagApi.getActorFlag(actorId, FLAGS.ATTRIBUTES);
  }

  /**
   * Set Mana Attribute for a given actor.
   * @param actorId The ID of the actor to set the mana attribute flag for.
   * @param newManaAttributes The new mana attribute state to set.
   * @returns Promise of updated actor document.
   */
  setManaAttributes(actorId: string, newManaAttributes: ManaAttributes): void {
    this.flagApi.setActorFlag(actorId, FLAGS.ATTRIBUTES, newManaAttributes);
  }

  /**
   * Safely additively changes mana, meaning that the new value cannot exceed the maximum value or go below 0.
   * @param actorId The ID of the actor to regenerate mana for.
   * @param manaDelta The amount to change the mana value by, negative to reduce mana.
   * @param overcharge If the max capacity should include overcharge or not.
   * @returns New mana state of the actor.
   */
  addManaSafe(actorId: string, manaDelta: number, overcharge = false): number {
    const { manaCap, overchargeCap } = this.getManaAttributes(actorId);

    const newManaRaw = this.getMana(actorId) + manaDelta;
    const maxMana = overcharge ? manaCap + overchargeCap : manaCap;
    const newMana = Math.min(Math.max(newManaRaw, 0), maxMana);

    this.setMana(actorId, newMana);
    invariant(
      newMana === this.getMana(actorId),
      "The new mana value and real mana value do not match!"
    );
    return this.getMana(actorId);
  }

  /**
   * Utility method for regenerating mana as per the mana regeneration rules.
   * Will naturally cap out at either the mana capacity or the overcharge capacity.
   *
   * @param actorId The ID of the actor to regenerate mana for.
   * @param ticks The number of "ticks" used to regenerate mana.
   * @param overcharge If the max capacity should include overcharge or not.
   * @returns New mana state of the actor.
   */
  regenMana(actorId: string, ticks: number, overcharge = false): number {
    const { manaRegen } = this.getManaAttributes(actorId);
    const regeneratedMana = manaRegen * ticks;
    return this.addManaSafe(actorId, regeneratedMana, overcharge);
  }
}
