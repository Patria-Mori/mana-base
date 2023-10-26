class ActorMock {
  private flagMock: FlagStoreMock;

  constructor() {
    this.flagMock = new FlagStoreMock();
  }

  get(_actorId: string) {
    return this.flagMock;
  }
}

class FlagStoreMock {
  // The flagMap maps from a scope to another map, which maps from a key to a value
  private flagMap: Map<string, Map<string, any>>;

  constructor(flagMap = new Map()) {
    this.flagMap = flagMap;
  }

  getFlag(scope: string, key: string) {
    this.flagMap.get(scope)?.get(key);
  }

  setFlag(scope: string, key: string, value: any) {
    if (!this.flagMap.get(scope)) {
      this.flagMap.set(scope, new Map());
    }
    this.flagMap.get(scope)?.set(key, value);
  }

  unsetFlag(scope: string, key: string) {
    this.flagMap.get(scope)?.delete(key);
  }

  clearAll() {
    this.flagMap.clear;
  }
}

const actorMock: ActorMock = new ActorMock();
export const gameMock = {
  actors: actorMock,
};
