import { gameMock } from "../mock/game-mock";

describe("Test basic flag manipulation functionality", () => {
  const flagMock = gameMock.actors.get("");
  beforeEach(() => {
    flagMock.clearAll;
  });

  const scope = "test-mod";
  const flagKey = "test";

  test("Flag is set and read correctly", () => {
    const flagValue = "TEST VALUE";
    flagMock.setFlag(scope, flagKey, flagValue);
    expect(flagMock.getFlag(scope, flagKey)).toBe(flagValue);
  });

  test.todo("Flag is set and unset, flag is removed");

  test.todo("Trying to read a flag that is not set throws");
});
