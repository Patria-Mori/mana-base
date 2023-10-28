// This import is required for styles to be compiled by Vite.
import "../styles/style.scss";
import { module } from "./config/module-config";
import "./config/module-hooks";

/**
 * Used to log messages to the console with the module ID as a prefix.
 * @param input The message to log.
 * @param modId The module ID to prefix the message with.
 */
export function log(input: any, modId = module.id) {
  console.log(`${modId} | ${input}`);
}
