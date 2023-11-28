// Utility functions for updating the data models of actors when the module is updated.

/**
 * During start-up this function is called, and goes through all the actors in the world,
 * updating the data models fo the actors who have outdated data models.
 *
 * It iterates over all the actors in the world, and identifies the actors who have outdated data models,
 * and then calls the update function for that specific version of the data model.
 */
export async function updateModuleDataModels() {
  const actors = game.actors as Actors;
  for (let actor of actors) {
    let actorDataModelVersion = ManaFlagUtils.getManaActorFlag(
      (actor as any)._id,
      ManaBaseModule.FLAGS.MODULE_VERSION
    );
    switch (actorDataModelVersion) {
      case undefined:
        updateV01xToV020(actor);
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
async function updateV01xToV020(actor: any) {
  ManaBaseModule.log(
    true,
    "Updating actor " + actor.name + " from v0.1.x to v0.2.0"
  );
  const actorId = actor._id;

  // Step 1
  const intMod = actor.system.abilities.int.mod;
  const wisMod = actor.system.abilities.wis.mod;
  const chaMod = actor.system.abilities.cha.mod;
  const profBonus = actor.system.attributes.prof;
  const xValue = actor.flags["mana-base"]["attributes"].manaX;
  const actorClass = ActorManaFlagUtils.findOriginalClassIdentifier(
    actorId
  ) as string;

  const manaCap = ManaSystemRules.calculateManaCap(
    wisMod,
    profBonus,
    xValue,
    0
  );
  const manaX = ManaSystemRules.approximateManaX(actorClass);
  const manaRegen = ManaSystemRules.calculateManaRegen(intMod, profBonus, 0);
  const manaControlDice = ManaSystemRules.calculateManaControlDice(chaMod, 0);
  const overchargeCap = ManaSystemRules.calculateOverchargeCap(chaMod, 0);

  const newAttributes = new ManaAttributes(
    manaCap,
    manaX,
    overchargeCap,
    manaRegen,
    manaControlDice
  );
  ManaFlagUtils.setManaActorFlag(actorId, "attributes", newAttributes);

  // Step 2
  ManaFlagUtils.setManaActorFlag(
    actorId,
    "state",
    actor.flags["mana-base"].state
  );

  // Step 3
  const dependentAttributes = {
    wisMod,
    intMod,
    chaMod,
    manaX: xValue,
    profBonus,
    class: actorClass,
  };
  ManaFlagUtils.setManaActorFlag(
    actorId,
    "_dependent-attributes",
    dependentAttributes
  );
  ManaFlagUtils.unsetActorFlag(actorId, "mana-base", "_dependency-attributes");

  // Step 4
  const oldExpandedUiFlag = ManaFlagUtils.getManaActorFlag(
    actorId,
    "_extended-UI"
  )
    ? ManaFlagUtils.getManaActorFlag(actorId, "_extended-UI")
    : false;
  ManaFlagUtils.setManaActorFlag(actorId, "_expanded-ui", oldExpandedUiFlag);
  ManaFlagUtils.unsetActorFlag(actorId, "mana-base", "_extended-UI");

  // Step 5
  ManaFlagUtils.setManaActorFlag(actorId, "_display-ui", true);

  // Step 6
  ManaFlagUtils.setManaActorFlag(actorId, "_module-version", "0.2.0");
}
