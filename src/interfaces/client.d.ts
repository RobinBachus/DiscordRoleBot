import type { Client, Collection, CommandInteraction } from "discord.js";

export interface ClientExtended extends Client {
  commands: Collection<
    string,
    {
      data: {
        options: string[];
        name: string;
        description: string;
        defaultPermission: undefined;
      };
      execute(interaction: CommandInteraction): void;
    }
  >;
}
