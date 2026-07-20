import fs from "fs";
import { error } from "./log";

export interface ICommand {
    name: string;
    description: string;
    usage: string;
    message: string;
}

export const statusCommand: ICommand = {
    name: "status",
    description: "Check if the bot is running",
    usage: "RAB status",
    message: "currently running!",
};

export const infoCommand: ICommand = {
    name: "info",
    description: "Show the info command",
    usage: "RAB info",
    message:
        "Made by Robin Bachus\nVersion: " +
        getVersion() +
        "\nCheck my source code here: [GitHub](https://github.com/RobinBachus/DiscordRoleBot)\n\nSorry for spaghetti code 🙃",
};

export const helpCommand: ICommand = {
    name: "help",
    description: "Show the help command",
    usage: "RAB help",
    message: `\`\`\`${"- RAB info:".padEnd(15)}info about the bot\n${"- RAB status:".padEnd(15)}check if the bot is running\`\`\``,
};

function getVersion() {
    try {
        const data = fs.readFileSync("version.txt", "utf8");
        return data;
    } catch (err) {
        error("Failed to get version", err as Error);
    }
}

export const commands = [statusCommand, helpCommand, infoCommand];
