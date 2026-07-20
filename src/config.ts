import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

export interface IConfig {
    bot_info: {
        id: string;
        name: string;
    };
    guilds: IGuild[];
}

export interface IGuild {
    guild_name: string;
    guild_id: string;
    roles: IRole[];
    roles_channel: {
        channel_name: string;
        channel_id: string;
        message: string;
    };
}

export interface IRole {
    icon: string;
    name: string;
    role_id: string;
}

export function loadConfig(): IConfig {
    const config = fs.readFileSync(
        `assets/json/${process.env.DEV_MODE ? "dev" : "prod"}.json`,
        "utf8",
    );
    return JSON.parse(config);
}
