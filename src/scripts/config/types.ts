// TODO: review best practices for declarations like this.

export enum PMClass {
  Artificer = "artificer",
  Barbarian = "barbarian",
  Bard = "bard",
  Cleric = "cleric",
  Druid = "druid",
  Fighter = "fighter",
  Monk = "monk",
  Paladin = "paladin",
  Ranger = "ranger",
  Rogue = "rogue",
  Sorcerer = "sorcerer",
  Warlock = "warlock",
  Wizard = "wizard",
}

// TODO: Spend some time designing this to match the real actor object (at least the values that we're interested in.)
export interface DNDActor {
  flags: {
    [flagKey: string]: ManaBaseFlag | any; // Should also include ManaCircles once that is ready.
  };
  name: string;
  system: {
    abilities: {
      str: DNDAbility;
      dex: DNDAbility;
      con: DNDAbility;
      int: DNDAbility;
      wis: DNDAbility;
      cha: DNDAbility;
    };
    attributes: {
      prof: number;
    };
  };
  _classes: {
    [dndClass: string]: {
      name: string;
      system: {
        isOriginalClass: boolean;
      };
    };
  };
}

interface ManaBaseFlag {
  state: number;
  attributes: ManaAttributes;
  "_display-ui": boolean;
  "_expanded-ui": boolean;
  "_dependent-attributes": ManaDependentAttributes;
  "_module-version": string;
}

interface DNDAbility {
  value: number;
  mod: number;
}

export interface ManaAttributes {
  manaCap: number;
  manaX: number;
  overchargeCap: number;
  manaRegen: number;
  manaControl: number;
}

export interface ManaDependentAttributes {
  wisMod: number;
  intMod: number;
  chaMod: number;
  manaX: number;
  profBonus: number;
  class: PMClass | undefined;
}

// TODO: These interfaces should be separated, probably want to create a dedicated type/types folder.
