import { log } from "../module";
import { parameterNames } from "../model/mana-attributes";
import { module } from "../config/module-config";
import { FLAGS } from "../config/module-constants";

/**
 * This script contains various utility functions related to other modules.
 */

/**
 * Adds the mana flags to the DAE fields, making it easier to select them in the DAE UI.
 */
export async function addManaFlagsToDAE() {
  if (game.modules.get("dae")) {
    log("Setting up mana flags in DAE.");

    const daeManaFlags = generateDAEFlags(
      module.id,
      FLAGS.ATTRIBUTES,
      Object.values(parameterNames)
    );

    // TODO: This is still bad. It is almost certainly possible to turn this into a few lines.
    const initDAE = async () => {
      for (let i = 0; i < 100; i++) {
        const DAE = (globalThis as any).DAE;
        if (DAE) {
          DAE.addAutoFields(daeManaFlags);
          return true;
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }
      return false;
    };
    initDAE().then((value) => {
      if (!value) console.error(`${module.id} | initDAE settings failed.`);
    });
  }
}

/**
 * Utility function that generates an array of DAE flags in the form of strings.
 * This array can be used to register flags to DAE.
 * @param moduleId The id of the module to register the flags with.
 * @param attribute The attribute or flag the parameters are registered under.
 * @param parameters A list of parameters.
 * @returns Array of strings.
 */
function generateDAEFlags(
  moduleId: string,
  attribute: string,
  parameters: string[]
): string[] {
  const daeFlag = "flags";
  return parameters.map(
    (parameter) => `${daeFlag}.${moduleId}.${attribute}.${parameter}`
  );
}
