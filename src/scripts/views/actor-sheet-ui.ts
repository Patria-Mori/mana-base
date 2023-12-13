import ActorAPI from "../api/actor-api";
import { getManaAttributesFromFlag, getManaState } from "../api/dnd-api";
import FlagAPI from "../api/flag-api";
import GameAPI from "../api/game-api";
import { ManaAPI } from "../api/mana-api";
import { module } from "../config/module-config";
import { FLAGS, TEMPLATES } from "../config/module-constants";
import { modSettings } from "../config/module-settings";
import { DNDActor } from "../config/types";
import { lazyValue } from "../utils/code-utils";

/**
 * This script is responsible for controlling the UI elements in the actor sheet.
 */
export async function injectUIIntoActorSheet(
  flagApi: FlagAPI,
  gameApi: GameAPI,
  actorApi: ActorAPI,
  manaApi: ManaAPI,
  actorSheet: any,
  html: any //TODO: Determine type
) {
  const actor = actorSheet.object as Actor;
  const dndActor = actor as any as DNDActor; // Not good, but it works
  const actorId = actor.id;

  // If the actor has the display mana flag set to false, we don't want to show the UI.
  if (!actorId || !flagApi.getActorFlag(actor.id, FLAGS.DISPLAY_UI)) {
    return;
  }

  // If the user has the client setting to not show mana, we don't want to show the UI.
  if (!gameApi.getSettingAsBool(module.id, modSettings.showUiClient.id, true)) {
    return;
  }

  actorApi.updateDependentAttributes(actorId);
  const { manaCap, manaX, overchargeCap, manaRegen, manaControl } =
    getManaAttributesFromFlag(dndActor);
  const manaState = getManaState(dndActor);

  const spellbookTabData = {
    manaId: module.id,
    curMana: manaState,
    maxMana: manaCap,
  };
  const spellbookTabUiRender = await renderTemplate(
    TEMPLATES.SPELLBOOK_PANE_UI,
    spellbookTabData
  ); // Turns the template into a HTML string.
  const spellBookTabUiElement = htmlToElement(spellbookTabUiRender); // Turns the HTML into an element.

  const inventoryFiltersDiv = html[0].querySelectorAll(
    ".spellbook .inventory-filters"
  ) as any;
  inventoryFiltersDiv[0].prepend(spellBookTabUiElement); // Adds the mana "box" to the inventory filters div.
  inventoryFiltersDiv[0].style.style.display = "flex"; // Makes the inventory filters div a flex-box.
  inventoryFiltersDiv[0].style.justifyContent = "space-between"; // Makes the mana box div and the inventory filter div align properly.

  // Adds expandable mana attribute pane to the character sheet.
  const extendedUiFlag = flagApi.getActorFlag(actorId, FLAGS.EXPANDED_UI);
  const extendedUiStyle = extendedUiFlag ? "" : "display: none;";

  const attributeTabUiRender = await renderTemplate(
    TEMPLATES.ATTRIBUTE_PANE_UI,
    {
      ...spellbookTabData,
      extendedUiStyle,
      manaCap,
      manaX,
      overchargeCap,
      manaRegen,
      manaControl,
    }
  );
  const attributeTabUiElement = htmlToElement(attributeTabUiRender);

  const attributeTabDiv = html[0].querySelectorAll(".attributes .center-pane");
  attributeTabDiv[0].prepend(attributeTabUiElement);

  // Add event listeners to the input fields
  const setManaLambda = (event: any) => {
    manaApi.setMana(actorId, lazyValue(manaState, event.target.value));
  };

  addListener(html, `#${module.id}-current`, "change", setManaLambda);
  addListener(html, `#${module.id}-max`, "change", setManaLambda);
  addListener(html, `#${module.id}-current-attribute`, "change", setManaLambda);
  addListener(html, `#${module.id}-max-attribute`, "change", setManaLambda);
  addListener(html, `.${module.id}-regen-button`, "click", () => {
    manaApi.regenMana(actorId, 1, true);
  });

  addListener(html, `.${module.id}-toggle-extendedUI`, "click", () => {
    flagApi.setActorFlag(actorId, FLAGS.EXPANDED_UI, !extendedUiFlag);
  });
}

type EventType = "change" | "click";

/**
 * TODO
 * @param html
 * @param findBy
 * @param trigger
 * @param doOn
 */
function addListener(
  html: any,
  findBy: string,
  trigger: EventType,
  doOn: Function
) {
  const element = html.find(findBy);
  element.on(trigger, doOn);
}

/**
 * Utility function to convert a string of HTML code to an element.
 * @param html
 * @returns
 */
function htmlToElement(html: string) {
  var template = document.createElement("template");
  html = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = html;
  return template.content.firstChild;
}
