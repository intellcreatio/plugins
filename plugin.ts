import config from "https://raw.githubusercontent.com/intellcreatio/intellcreatio/master/config.ts";
import { DiscordJS, IntellCreatio, IntellCreatioConfig } from "./types.ts";

const pluginPermissions = [
    "ConfigurationFile",
    "AccessToClient",
    "InteractionsRouter",
] as const;

export type PluginPermission = typeof pluginPermissions[number];

export class Plugin {
    private client: () => DiscordJS.Client<true> | null;

    constructor(
        client: DiscordJS.Client<true>,
        private permissionRequester: (permission: PluginPermission) => boolean
    ) {
        this.client = () => {
            if (this.permissionRequester("AccessToClient")) {
                return client;
            } else {
                return null;
            }
        };
    }
}

export const createStoragePlugins = (client: DiscordJS.Client<true>) => {
    const storage: { pl: Plugin; p: PluginPermission[] }[] = [];
    return {
        usePlugin(plugin: typeof Plugin, permissions: PluginPermission[]) {
            storage.push({
                p: permissions,
                pl: new plugin(client, (permission) => {
                    return permissions.includes(permission);
                }),
            });
        },
        getStorage() {
            return storage;
        },
    };
};
