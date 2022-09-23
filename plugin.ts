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

    constructor(
        client: DiscordJS.Client<true>,
        config: typeof IntellCreatioConfig,
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
    }
}

export const createStoragePlugins = (
    client: DiscordJS.Client<true>,
    config: typeof IntellCreatioConfig
) => {
    const storage: {
        pl: Plugin;
        config: typeof IntellCreatioConfig;
        p: PluginPermission[];
    }[] = [];
    return {
        usePlugin(plugin: typeof Plugin, permissions: PluginPermission[]) {
            storage.push({
                p: permissions,
                config,
                pl: new plugin(client, config, (permission) => {
                    return permissions.includes(permission);
                }),
            });
        },
        getStorage() {
            return storage;
        },
    };
};
