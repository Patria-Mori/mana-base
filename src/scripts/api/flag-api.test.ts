import { gameMock } from "../mock/game-mock";

describe("Test basic flag manipulation functionality", () => {
  const flagMock = gameMock.actors.get("");
  beforeEach(() => {
    flagMock.clearAll;
  });

  const scope = "test-mod";
  const flagKey = "test";
  const flagValue = "TEST VALUE";

  test("Flag is set and read correctly", () => {
    flagMock.setFlag(scope, flagKey, flagValue);
    expect(flagMock.getFlag(scope, flagKey)).toBe(flagValue);
  });

  test("Flag is set and unset, flag is removed", () => {
    flagMock.setFlag(scope, flagKey, flagValue);
    flagMock.unsetFlag(scope, flagKey);
    expect(flagMock.getFlag(scope, flagKey)).toBe(undefined);
  });
});
