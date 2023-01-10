import * as io from "@pm2/io";
import * as info from "../json/info.json";

export class Metrics {
  /**
   *
   */
  constructor() {
    this.bot_name.set(info.bot_info.name);
    this.bot_id.set(info.bot_info.id);
    this.version.set(info.bot_info.version);
    this.guilds_managed.set(info.bot_info.guild_amount);
  }

  bot_name = io.metric({
    name: "Bot Name",
    id: "app/bot/name",
  });
  bot_id = io.metric({
    name: "Bot Id",
    id: "app/bot/name",
  });
  version = io.metric({
    name: "Version",
    id: "app/bot/version",
  });
  guilds_managed = io.metric({
    name: "Guilds Managed",
    id: "app/bot/guilds",
  });

  test_val = io.counter({
    name: "test value",
    id: "app/test/test_value",
  });

  Increase_test_val = io.action("Increase Test value", (amount?: number) => {
    this.test_val.inc(amount);
  });
  Decrease_test_val = io.action("Decrease Test value", (amount?: number) => {
    this.test_val.dec(amount);
  });
}
