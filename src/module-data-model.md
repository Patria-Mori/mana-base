# mana-base Data Model documentation 

This documents the various data models (flag structure) used in each of the versions of the mod. This is used to make translating/porting the data models between versions easier.

In this document we describe the data model with a tree structure outlining the various flags and the value of their type.
Additionally, for each version after the first, we also explain the differences between the last and current version.

## Alpha releases - v0.1.x

The alpha releases are characterised by an ad hoc approach, and changes were expected, though the "old data model" challenge was only discovered after the bugs in v0.1.0 were discovered and patched (requiring a change in the data model).

### v0.1.0

```
├── flags.mana-base
│   ├── attributes
│   │   ├── manaCap : number
│   │   ├── manaControl : number
│   │   ├── manaRegen : number
│   │   ├── manaX : number
│   │   ├── overchargeCap : number
│   ├── state : number
│   ├── _dependency-attributes
│   │   ├── chaMod : number
│   │   ├── class : string
│   │   ├── intMod : number
│   │   ├── profBonus : number
│   │   ├── wisMod : number
│   ├── _extended-ui : boolean
└──
```

### v0.1.1

```
├── flags.mana-base
│   ├── attributes
│   │   ├── manaCap : number
│   │   ├── manaControl : number
│   │   ├── manaRegen : number
│   │   ├── manaX : number
│   │   ├── overchargeCap : number
│   ├── state : number
│   ├── _dependency-attributes
│   │   ├── chaMod : number
│   │   ├── class : string
│   │   ├── intMod : number
│   │   ├── profBonus : number
│   │   ├── wisMod : number
│   │   ├── xMod : number
│   ├── _extended-ui : boolean
└──
```

**Changes:**
 - xMod was added as a dependent attribute, since manaCap depends on it, however, the name should've been manaX, not "xMod", which references the depracated ManaAttributesMod class (this was probably just a mistake when I created v0.1.1). 
 - The dependent attribute being called "xMod" is still fine though, because the dependent attributes are only used to detect changes, not for updating the mana attributes. 


## Beta releases - v0.2.x

### v0.2.0

```
├── flags.mana-base
│   ├── attributes
│   │   ├── manaCap : number
│   │   ├── manaControl : number
│   │   ├── manaRegen : number
│   │   ├── manaX : number
│   │   ├── overchargeCap : number
│   ├── state : number
│   ├── _dependent-attributes
│   │   ├── chaMod : number
│   │   ├── class : string
│   │   ├── intMod : number
│   │   ├── manaX : number
│   │   ├── profBonus : number
│   │   ├── wisMod : number
│   ├── _display-ui : boolean
│   ├── _expanded-ui : boolean
│   ├── _module-version : string
└──
```

**Changes:**
- "_display-ui" flag added, used to turn on/off the module UI on a actor-by-actor basis.
- "_module-version" flag added, used to identify which version of the mod the data model was created from.
- Renamed a few flags:
  - "_dependency-attributes" -> "_dependent-attributes".
    - "xMod" -> "manaX" (corrected the mistake from v0.1.1).
  - "_expanded-ui" -> "_expanded-ui".

### v0.2.1

No changes.