import invariant from "tiny-invariant";
import GameAPI from "./game-api";

/**
 * Simple class containing some useful utility functions for manipulating flags in Foundry.
 */
export default class FlagAPI {
  private moduleId: string;
  private gameApi: GameAPI;

  constructor(moduleId: string, gameApi = new GameAPI()) {
    this.moduleId = moduleId;
    this.gameApi = gameApi;
  }

  /**
   * Utility function to get a flag from an actor.
   * @param actorId The ID of the actor we want to get the flag from.
   * @param flagKey The key of the flag to get.
   * @returns The value of the flag.
   */
  getActorFlag(actorId: string, flagKey: any): any {
    const actor: Actor = this.gameApi.getActor(actorId);
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
    game.actors?.get("")?.getFlag;
    const actor: Actor = this.gameApi.getActor(actorId);
    actor.setFlag(this.moduleId, flagKey, flagValue);
  }

  /**
   * Utility function to unset a flag on an actor.
   * @param actorId The ID of the actor we want to unset the flag for.
   * @param flagKey The key of the flag to unset.
   */
  unsetActorFlag(actorId: string, flagKey: any): void {
    const actor: Actor = this.gameApi.getActor(actorId);
    actor.unsetFlag(this.moduleId, flagKey);
  }
}
