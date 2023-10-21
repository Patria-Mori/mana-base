import invariant from "tiny-invariant";

/**
 * Simple class containing some useful utility functions for manipulating flags in Foundry.
 * In addition to the class, there are a number of static methods that can be used to manipulate flags.
 */
export class FlagAPI {
  private moduleId: string;

  constructor(moduleId: string) {
    this.moduleId = moduleId;
  }

  /**
   * Utility function to get a flag from an actor.
   * @param actorId The ID of the actor we want to get the flag from.
   * @param flagKey The key of the flag to get.
   * @returns The value of the flag.
   */
  getActorFlag(actorId: string, flagKey: any): any {
    const actor: Actor = getActor(actorId);
    const flag = actor.getFlag(this.moduleId, flagKey);
    invariant(flag, "Flag not found.");
    return flag;
  }

  /**
   * Utility function to set a flag on an actor.
   * @param actorId The ID of the actor we want to set the flag for.
   * @param flagKey The key of the flag to set.
   * @param flagValue The object to set the flag to.
   */
  setActorFlag(actorId: string, flagKey: any, flagValue: any): void {
    const actor: Actor = getActor(actorId);
    actor.setFlag(this.moduleId, flagKey, flagValue);
  }

  /**
   * Utility function to unset a flag on an actor.
   * @param actorId The ID of the actor we want to unset the flag for.
   * @param flagKey The key of the flag to unset.
   */
  unsetActorFlag(actorId: string, flagKey: any): void {
    const actor: Actor = getActor(actorId);
    actor.unsetFlag(this.moduleId, flagKey);
  }
}

// In addition to the class, these static methods can be used to manipulate flags, by passing in the module ID.
/**
 * Utility function to get a flag from an actor.
 * @param actorId The ID of the actor we want to get the flag from.
 * @param moduleId The ID of the module we are using to get the flag.
 * @param flagKey The key of the flag to get.
 * @returns The value of the flag.
 */
export function getActorFlag(
  actorId: string,
  moduleId: string,
  flagKey: any
): any {
  const actor: Actor = getActor(actorId);
  const flag = actor.getFlag(moduleId, flagKey);
  invariant(flag, "Flag not found.");
  return flag;
}

/**
 * Utility function to set a flag on an actor.
 * @param actorId The ID of the actor we want to set the flag for.
 * @param moduleId The ID of the module we are setting the flag for.
 * @param flagKey The key of the flag to set.
 * @param flagValue The object to set the flag to.
 */
export function setActorFlag(
  actorId: string,
  moduleId: string,
  flagKey: any,
  flagValue: any
): void {
  const actor: Actor = getActor(actorId);
  actor.setFlag(moduleId, flagKey, flagValue);
}

/**
 * Utility function to unset a flag on an actor.
 * @param actorId The ID of the actor we want to unset the flag for.
 * @param moduleId The ID of the module we are unsetting the flag for.
 * @param flagKey The key of the flag to unset.
 */
export function unsetActorFlag(
  actorId: string,
  moduleId: string,
  flagKey: any
): void {
  const actor: Actor = getActor(actorId);
  actor.unsetFlag(moduleId, flagKey);
}

/**
 * Utility function to get an actor from the game.
 * Will throw an error if the actor is not found or if the actors are not initialized.
 * @param actorId The ID of the actor we want to get.
 * @returns The actor.
 */
function getActor(actorId: string): Actor {
  const actors = game.actors;
  invariant(actors, "Actors are not initialized.");
  const actor = actors.get(actorId);
  invariant(actor, "Actor not found.");
  return actor;
}
