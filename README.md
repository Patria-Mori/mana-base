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


## Module code structor

The module consists of several scripts and sub-folders inside the "scripts" folder. This briefly describes them.
 - **api**: Consists of scripts that are intended to be used in the API (in the future).
 - **model**: Defines the relevant models in the mod.
   - **manaAttributes.js**: Contains the ManaAttributes object used to store mana attributes.
   - **manaSystemRules.js**: All of the rules in the PM mana system are expressed as functions in here.
 - **module**: Contains scripts used for managing the module, such as settings.
 - **utils**: Several very useful utility classes, some of which will probably be turned into APIs.
   - **actorUtils.js**: Used to manage and perform actions on actors.
   - **flagUtils.js**: Very simple script to get, set, and unset flags.
   - **moduleUtils.js**: Contains a few useful functions that don't fit elsewhere.
   - **updateUtils.js**: Contains scripts used to port data models from older versions of the mod.
- **view**: Stores scripts responsible for the UI.
- **moduleConfig.js**: Contains the configuration of the module.
- **moduleHooks.js**: Simple script that adds event listener hooks for the module.