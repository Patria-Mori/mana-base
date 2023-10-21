import { registerModuleSettings } from "./module-settings";

// This section contains all the used hooks and their callbacks.
/**
 * This hook is called by the DevMode module when it is ready.
 */ // @ts-ignore
Hooks.once("devModeReady", ({ registerPackageDebugFlag }) => {
  // Registers the module's debug flag with the dev mode module if it is installed.
  registerPackageDebugFlag(ManaBaseModule.ID);
});

Hooks.once("init", () => {
  registerModuleSettings();
});
