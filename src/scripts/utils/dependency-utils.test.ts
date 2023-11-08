describe("Test basic flag manipulation functionality", () => {
  test("Test that new method to generate list of flags in DAE format produces same output as old method", () => {
    const oldMethodFlags = [];

    const flags = "flags";
    const modId = "mana-base";
    const attribute = "attributes";
    const parameters = [
      "manaCap",
      "manaControl",
      "manaRegen",
      "manaX",
      "overchargeCap",
    ];

    // TODO: Replace with a loop over the enum.
    oldMethodFlags.push(`${flags}.${modId}.${attribute}.manaCap`);
    oldMethodFlags.push(`${flags}.${modId}.${attribute}.manaControl`);
    oldMethodFlags.push(`${flags}.${modId}.${attribute}.manaRegen`);
    oldMethodFlags.push(`${flags}.${modId}.${attribute}.manaX`);
    oldMethodFlags.push(`${flags}.${modId}.${attribute}.overchargeCap`);

    const newMethodFlags = generateDAEFlags(modId, attribute, parameters);

    expect(oldMethodFlags).toStrictEqual(newMethodFlags);
  });

  // TODO: Ideally this should be using the method directly from the script, but I get an Hooks is not defined error when I do.
  function generateDAEFlags(
    moduleId: string,
    attribute: string,
    parameters: string[]
  ) {
    const daeFlag = "flags";
    return parameters.map(
      (parameter) => `${daeFlag}.${moduleId}.${attribute}.${parameter}`
    );
  }
});
