import * as dotenv from "dotenv";

dotenv.config();

const tokens = process.env.GUILD_TOKENS ?? "";

const someVar = tokens.split(",");

console.log(someVar);
