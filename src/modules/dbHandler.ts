import { Collection, MongoClient, MongoParseError } from "mongodb";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const cert = path.join(
	__dirname,
	"../../",
	process.env.DB_TLS_CERTIFICATE || ""
);
const connectionString = process.env.DB_CONNECTION_STRING + cert;

const client = new MongoClient(connectionString);

//TODO: Delete test type
interface testForm {
	_id: string;
	string: string;
	number: number;
}

export class dbHandler {
	/**
	 * Returns the collection to execute an operation on
	 *
	 * @param test If a test collection is used (Default is false)
	 */
	private getDBCollection(test?: false): Collection<IGuild>;
	private getDBCollection(test: true): Collection<testForm>;
	private getDBCollection(test = false) {
		const database = client.db("RoleBotData");
		let collection;
		if (test) collection = database.collection<testForm>("Test");
		else collection = database.collection<IGuild>("Guilds");
		return collection;
	}

	/**
	 * Test the connection to the database by checking if it can find a guild with the provided id
	 * and then check if the name is correct
	 *
	 * @param guildID Optional parameter for overriding the default ID (926158974074638456)
	 * @param guildName Optional parameter for overriding the default name (Bot Test Server)
	 */
	async testConnection(
		guildID = "926158974074638456",
		guildName = "Bot Test Server"
	) {
		try {
			const guild = await this.find({ guild_id: guildID }, 1);
			if (!guild || guild.guild_name !== guildName) {
				throw new GuildNotFoundError(undefined, guildName, guildID);
			}
		} catch (e) {
			throw new Error("Connection test failed => \n" + e);
		}
	}

	/**
	 * Find guilds in the database
	 *
	 * @param query Partial guild(s) to find using MongoDB query elements
	 * @param limit How many guilds should be returned. If this is set to 1 the return type will be an {@link IGuild} object.
	 * Otherwise it will return an array of {@link IGuild} objects
	 */
	find(query: Partial<IGuild>, limit?: number): Promise<IGuild[]>;
	find(query: IMultipleGuildSearch, limit?: number): Promise<IGuild[]>;
	find(query: Partial<IGuild>, limit: 1): Promise<IGuild>;
	find(query: IMultipleGuildSearch, limit: 1): Promise<IGuild>;
	async find(query: Partial<IGuild> | IMultipleGuildSearch, limit?: number) {
		let guilds = new Array<IGuild>();
		try {
			const collection = this.getDBCollection();
			const cursor = collection.find<IGuild>(query);
			if (limit) cursor.limit(limit);
			await cursor.forEach((guild) => {
				guilds.push(guild);
			});
		} finally {
			await client.close();
		}
		if (limit === 1) return guilds[0];
		return guilds;
	}

	insertMany = async (guild: testForm[]) => {
		try {
			const collection = this.getDBCollection(true);
			const result = await collection.insertMany(guild);
			return result;
		} finally {
			await client.close();
		}
	};

	insertOne = async (guild: testForm) => {
		try {
			const collection = this.getDBCollection(true);
			const result = await collection.insertOne(guild);
			return result;
		} finally {
			await client.close();
		}
	};

	updateMany = async (search: Partial<testForm>, update: IUpdate<testForm>) => {
		try {
			const collection = this.getDBCollection(true);
			const result = await collection.updateMany(search, update);
			return result;
		} finally {
			await client.close();
		}
	};

	updateOne = async (search: Partial<testForm>, update: IUpdate<testForm>) => {
		try {
			const collection = this.getDBCollection(true);
			const result = await collection.updateOne(search, update);
			return result;
		} finally {
			await client.close();
		}
	};
}

/**
 * Is thrown if a guild is not found
 */
class GuildNotFoundError extends Error {
	/**
	 * @param message Optional message. The default message is 'Could not find specified guild'
	 * @param guildName Optional guild name to display in errors
	 * @param guildID Optional guild id to display in errors
	 */
	constructor(
		message = "Could not find specified guild",
		guildName?: string,
		guildID?: string
	) {
		super();
		this.message = message;
		if (guildName || guildID) {
			this.message += " ( ";
			if (guildName) this.message += `name: '${guildName} '`;
			if (guildID) this.message += `id: '${guildID}' `;
			this.message += ")";
		}
	}
}
