import * as fsPromises from "fs/promises";
import copy from "rollup-plugin-copy";
import scss from "rollup-plugin-scss";
import { defineConfig, loadEnv, Plugin } from "vite";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd(), "") };

  return defineConfig({
    build: {
      sourcemap: true,
      rollupOptions: {
        input: "src/scripts/module.ts",
        output: {
          dir: "dist/scripts",
          format: "es",
          entryFileNames: "module.js",
        },
      },
    },
    plugins: [
      updateModuleManifestPlugin(process.env),
      scss({
        output: "dist/styles/style.css",
        sourceMap: true,
        watch: ["src/**/*"], // Old: 'watch: ["src/styles/*.scss"]', only watches scss files.
      }),
      copy({
        targets: [
          { src: "src/languages", dest: "dist" },
          { src: "src/scripts-old", dest: "dist", rename: "scripts" },
          { src: "src/templates", dest: "dist" },
        ],
        hook: "writeBundle",
      }),
    ],
  });
};

function updateModuleManifestPlugin(env: any): Plugin {
  return {
    name: "update-module-manifest",
    async writeBundle(): Promise<void> {
      const packageContents = JSON.parse(
        await fsPromises.readFile("./package.json", "utf-8")
      ) as Record<string, unknown>;
      const version = env.MODULE_VERSION || (packageContents.version as string);
      const manifestContents: string = await fsPromises.readFile(
        "src/module.json",
        "utf-8"
      );
      const manifestJson = JSON.parse(manifestContents) as Record<
        string,
        unknown
      >;
      manifestJson["version"] = version;
      if (env.GH_PROJECT) {
        const baseUrl = `https://github.com/${env.GH_PROJECT}/releases`;
        manifestJson["manifest"] = `${baseUrl}/latest/download/module.json`;
        if (env.GH_TAG) {
          manifestJson[
            "download"
          ] = `${baseUrl}/download/${env.GH_TAG}/module.zip`;
        }
      }
      await fsPromises.writeFile(
        "dist/module.json",
        JSON.stringify(manifestJson, null, 2)
      );
    },
  };
}
