import { DiscordJS, IntellCreatio, IntellCreatioConfig } from "./types.ts";

const pluginPermissions = [
    "ConfigurationFile",
    "AccessToClient",
    "InteractionsRouter",
] as const;

export type PluginPermission = typeof pluginPermissions[number];

export class Plugin {
    private client: () => DiscordJS.Client<true> | null;
    private configuration: () => typeof IntellCreatioConfig | null;
    private interactions: () => IntellCreatio.InteractionsRouter | null;

    constructor(
        client: DiscordJS.Client<true>,
        config: typeof IntellCreatioConfig,
        interactions: IntellCreatio.InteractionsRouter,
        private permissionRequester: (permission: PluginPermission) => boolean
    ) {
        this.client = () => {
            if (this.permissionRequester("AccessToClient")) {
                return client;
            } else {
                return null;
            }
        };

        this.configuration = () => {
            if (this.permissionRequester("ConfigurationFile")) {
                return config;
            } else {
                return null;
            }
        };

        this.interactions = () => {
            if (this.permissionRequester("InteractionsRouter")) {
                return interactions;
            } else {
                return null;
            }
        };

        return;
    }

    // Plugin runned
    public run() {}
}

export const createStoragePlugins = (
    client: DiscordJS.Client<true>,
    config: typeof IntellCreatioConfig,
    interactions: IntellCreatio.InteractionsRouter
) => {
    const storage: {
        pl: Plugin;
        config: typeof IntellCreatioConfig;
        p: PluginPermission[];
        interactions: IntellCreatio.InteractionsRouter;
    }[] = [];
    return {
        usePlugin(plugin: typeof Plugin, permissions: PluginPermission[]) {
            storage.push({
                p: permissions,
                config,
                pl: new plugin(client, config, interactions, (permission) => {
                    return permissions.includes(permission);
                }),
                interactions,
            });
        },
        getStorage() {
            return storage;
        },
    };
};
