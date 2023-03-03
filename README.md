# PM Mana - Base

This is the "Base" module of the Patria Mori mana system project. The project is a simple, mostly personal project to mod in support for a homebrewed magic system for D&D 5e. The modules are designed for Foundry VTT.

The Base module is a requirement for all other modules, and serves as the foundation, mostly providing "behind-the-scenes" functionalities that are required by other PM Mana modules, as well as some basic UI for users to interact with it.

As the module is the "Base" module it is intended to be stable and thus likely won't be updated too frequently once a stable release is ready (we're currently in alpha).

## Installation

It's always better and easier to install modules through the in-app browser.

To install this module manually:
1. Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2. Click "Install Module"
3. In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/Patria-Mori/mana-base/master/module.json`
4. Click 'Install' and wait for installation to complete
5. Don't forget to enable the module in game using the "Manage Module" button


## User Guide

TODO

## Explanation of features (OLD)

TODO: Update

 - [**Mana API**]: The API can be used by other modules to easily modify their mana, set certain conditions etc. In short is the "official" way for other modules to manipulate a characters mana-related functionality, such as removing or adding mana, etc.
 - [**Mana Config**]: Defines random stuff like which class has what X value, what the names of the circles are, maybe even how mana calculations are defined.
 - [**Character-side automation**]: Internal sub-module, responsible for calculating lots of useful mana-related things, such as mana capacity, regen per tick, etc. Will implement several utility functions which make it easy to restore mana when short/long-resting, etc.
 - [**Character Mana state**]: Class/similar that stores mana stuff, like their current mana, mana crystals, and basically anything "stateful".
