import { build, emptyDir } from "https://deno.land/x/dnt@0.30.0/mod.ts";

await emptyDir("./npm");

await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    package: {
        // package.json properties
        name: "@intellcreatio/plugins",
        version: Deno.args[0],
        description: "Plugins support for IntellCreatio",
        license: "MIT",
        repository: {
            type: "git",
            url: "git+https://github.com/intellcreatio/plugins.git",
        },
    },
});

Deno.copyFileSync("README.md", "npm/README.md");
