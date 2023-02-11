# PM Mana Foundry Module prototyping thing

This is an early prototype module I use to learn Foundry module development and Foundry's DataModel. Some of it is good and worth looking at (might use in the "real" module), other stuff is garbage and can be ignored.

If you have any insights or comments you can open an issue and I'll consider it, but don't shit on the code quality, this is not designed to be good.

## General guide:

For now everything of interest is in "scripts/mana.js".

That script is divded into sections,

 - //Config stuff is kind of just set-up stuff,

 - //"API" represents somewhat mature utility functions I might move into the real module

## Quick Rundown of Module plans:

At this moment I'm planning on developing 3-4 different Mana modules. I want to develop them individually to support good modifiability and separate concerns. This is up for discussion if somebody else wants to participate in the core development.


Names are not final. Some of the modules have multiple packages/js files, which are briefly explained and not named strictly.

**mana-base/mana-core**: The core module, will supply *some* automation, but most of it is limited to characters and mana regen. Mainly used as a foundation.
 
 - [**Mana API**]: The API can be used by other modules to easily modify their mana, set certain conditions etc. In short is the "official" way for other modules to manipulate a characters mana-related functionality, such as removing or adding mana, etc.
 - [**Mana Config**]: Defines random stuff like which class has what X value, what the names of the circles are, maybe even how mana calculations are defined.
 - [**Character-side automation**]: Internal sub-module, responsible for calculating lots of useful mana-related things, such as mana capacity, regen per tick, etc. Will implement several utility functions which make it easy to restore mana when short/long-resting, etc.
 - [**Character Mana state**]: Class/similar that stores mana stuff, like their current mana, mana crystals, and basically anything "stateful".
  

**mana-circles(-management)**: Module that integrates circle management of characters and spells. Let's players dynamically change their "active" circles. Going to be a pain in the ass most likely.

 - [**Character Circle state**]: Class/similar that stores the state of a characters "active" circles (internal, mage gear, foci, etc). Ideally should replace the numerous spreadsheets players use :dimi:. UI/UX will be very important here.
 - [**Circle "Engine"**]: Basically takes in a "Mana"-Spell (an abstract representation of a spell that focuses on the circles of the spell and whether it's a reaction) and figures out how much mana the spell will cost to cast for the character based on their Character Circle state. 


**mana-/mana-spells**: Module that mainly serves as a "repository" for turning normal 5e Spells into _fancy_ Mana spells (aka attach meta-info about which circles a spell have).

 - [**Spell directory**]: List of all the spells with their circles, should be configurable while application is running.
 - [**Spell circle setter**]: Utility tool for the GM to edit/set the circles of a spell. No more annoying Lori Google sheets, let's just automate that shit.

**mana-godmode**: (Name far from final), A nice utility the GM can use to apply mana conditions on the players. Want to automatically give everyone 1 mana tick's worth of Regen? There's a button for that. Want to apply mana scaricty/mana abundance/some other such bullshit? Create an issue/pull request with your code and Jonas will implement it for you. Probably the most fuzzy module idea so far, but might be valuable.
