import invariant from "tiny-invariant";
import { stringToBoolean } from "../utils/code-utils";

export default class GameAPI {
  private gameInstance: Game;

  constructor(gameInstance: Game = game) {
    this.gameInstance = gameInstance;
  }

  /**
   * Utility function to get an actor from the game.
   * Will throw an error if the actor is not found or if the actors are not initialized.
   * @param actorId The ID of the actor we want to get.
   * @returns The actor.
   */
  getActor(actorId: string): Actor {
    const actors = this.gameInstance.actors;
    invariant(actors, "Actors are not initialized.");
    const actor = actors.get(actorId);
    invariant(actor, "Actor not found.");
    return actor;
  }

  /**
   * Get a given setting as a boolean value or a default value if the parsing fails.
   *
   * @param moduleId The id of the module, used as the namespace of the setting.
   * @param settingId The unique id of the setting.
   * @param defaultValue Fallback default.
   * @returns Setting as boolean.
   */
  getSettingAsBool(
    moduleId: string,
    settingId: string,
    defaultValue: boolean
  ): boolean {
    return stringToBoolean(this.getSetting(moduleId, settingId), defaultValue);
  }

  /**
   * Get an unparsed game setting.
   *
   * @param moduleId The id of the module, used as the namespace of the setting.
   * @param settingId The unique id of the setting.
   * @returns Setting as string.
   */
  getSetting(moduleId: string, settingId: string): string {
    return this.gameInstance.settings.get(moduleId, settingId) as string;
  }
}
