/**
 * Compares two objects for deep equality.
 * This means that it will compare the values of the objects, not the references.
 *
 * @param object1
 * @param object2
 * @returns true if the objects are equal, false otherwise.
 */
export function deepEqual(object1: any, object2: any) {
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
      (areObjects && !deepEqual(val1, val2)) ||
      (!areObjects && val1 !== val2)
    ) {
      return false;
    }
  }
  return true;
}

function isObject(object: any) {
  return object != null && typeof object === "object";
}

/**
 * Takes in a string and tries to parse it to a boolean value.
 * If it fails it will return the defaultValue.
 *
 * @param input Any string.
 * @param defaultValue Fallback if parsing fails.
 * @returns Parsed boolean or default.
 */
export function stringToBoolean(input: string, defaultValue: boolean): boolean {
  const lowercaseInput = input.toLowerCase();

  if (lowercaseInput === "true") {
    return true;
  } else if (lowercaseInput === "false") {
    return false;
  } else {
    return defaultValue;
  }
}
