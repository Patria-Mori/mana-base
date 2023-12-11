import invariant from "tiny-invariant";

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
}
