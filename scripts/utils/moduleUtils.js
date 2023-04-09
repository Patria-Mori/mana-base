/**
 * This script contains various utility functions related to other modules.
 */

/**
 * Adds the mana flags to the DAE fields, making it easier to select them in the DAE UI.
 */
function addManaFlagsToDAE() {
    // Adds the flags to the DAE fields, making it easier to select them in the DAE UI.
    // TODO: This is a hacky way to do this. Find a better way.
    if (game.modules.get("dae")) {
        ManaBaseModule.log(true, "Setting up mana flags in DAE.")

        const manaFlags = [];

        const flags = "flags";
        const modId = ManaBaseModule.ID;
        const attribute = ManaBaseModule.FLAGS.ATTRIBUTES;

        // TODO: Replace with a loop over the enum.
        manaFlags.push(`${flags}.${modId}.${attribute}.manaCap`);
        manaFlags.push(`${flags}.${modId}.${attribute}.manaControl`);
        manaFlags.push(`${flags}.${modId}.${attribute}.manaRegen`);
        manaFlags.push(`${flags}.${modId}.${attribute}.manaX`);
        manaFlags.push(`${flags}.${modId}.${attribute}.overchargeCap`);

        const initDAE = async () => {
            for (let i = 0; i < 100; i++) {
                if (globalThis.DAE) {
                    globalThis.DAE.addAutoFields(manaFlags);
                    return true;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            return false;
        };
        initDAE().then(value => {if (!value)
            console.error(`${ManaBaseModule.ID} | initDAE settings failed.`)});
    }
}


/**
 * Compares two objects for deep equality. 
 * This means that it will compare the values of the objects, not the references.
 * 
 * @param {*} object1 
 * @param {*} object2 
 * @returns true if the objects are equal, false otherwise.
 */
function deepEqual(object1, object2) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      const val1 = object1[key];
      const val2 = object2[key];
      const areObjects = isObject(val1) && isObject(val2);
      if (
        areObjects && !deepEqual(val1, val2) ||
        !areObjects && val1 !== val2
      ) {
        return false;
      }
    }
    return true;
}

function isObject(object) {
    return object != null && typeof object === 'object';
}