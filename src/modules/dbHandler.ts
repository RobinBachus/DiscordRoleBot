import dotenv from "dotenv";
import path from "path";
import {
	Collection,
	Document,
	MongoClient,
	MongoNetworkError,
	UpdateResult,
} from "mongodb";
import type { logging } from "./logging";

dotenv.config();

const cert = path.join(
	__dirname,
	"../../",
	process.env.DB_TLS_CERTIFICATE || ""
);
const connectionString = process.env.DB_CONNECTION_STRING + cert;

//TODO: Delete test type
interface testForm {
	_id: string;
	string: string;
	number: number;
}

export class dbHandler {
	/**
	 * Create a dbHandler object used for interacting with the database
	 *
	 * @param logger The logging object to use for logging
	 */
	constructor(logger: logging) {
		this.logger = logger;
		this.client = new MongoClient(connectionString, {
			connectTimeoutMS: 5000,
			serverSelectionTimeoutMS: 5000,
		});
	}

	private client: MongoClient;
	private logger: logging;

	/**
	 * Returns the collection to execute an operation on
	 *
	 * @param name Name of the collection to return (Default is "Guilds")
	 *
	 * @returns the collection
	 */
	private getDBCollection(name?: "Guilds"): Collection<IGuild>;
	private getDBCollection(name: "BotInfo"): Collection<IBotInfo>;
	private getDBCollection(name: "Test"): Collection<testForm>;
	private getDBCollection(name = "Guilds") {
		const database = this.client.db("RoleBotData");
		switch (name) {
			case "Guilds":
				return database.collection<IGuild>("Guilds");
			case "BotInfo":
				return database.collection<IBotInfo>("BotInfo");
			case "Test":
				return database.collection<testForm>("Test");
			default:
				throw new TypeError("Unknown collection");
		}
	}

	async init() {
		let result: Document | undefined;
		try {
			result = await this.testConnection();
		} catch (e) {
			result = undefined;
			this.logger.logProcessResult(false, e as string);
		}

		this.logger.logProcessStart("Setting database bot info");
		if (!result) {
			this.logger.logProcessResult(false, "Connection test failed", true);
			return false;
		} else {
			const date = Date.now() + 3.6e6;
			try {
				await this.updateBotInfo({
					$set: {
						start_date: {
							$date: { $numberLong: `${date}` },
						},
						last_update: {
							$date: { $numberLong: `${date}` },
						},
						version: process.env.npm_package_version || "not set",
					},
				});
				this.logger.logProcessResult(true);
				return true;
			} catch (e: any) {
				this.logger.logProcessResult(false, e);
				throw new Error(e);
			}
		}
	}

	/**
	 * Test the connection to the database by sending a ping command
	 *
	 * @returns `{ ok : 1 }` if the ping succeeds
	 * @throws MongoNetworkError if the ping fails
	 */
	async testConnection() {
		let error: any;
		this.logger.logProcessStart("Testing database connection");
		let response: Document | undefined = undefined;
		try {
			response = await this.client.connect().then(async (_) => {
				return await this.client.db("RoleBotData").command({ ping: 1 });
			});
			if (!response || response.ok !== 1) {
				const res = JSON.stringify(response);
				throw new EvalError(`Ping returned '${res}' (expected '{"ok":1}')`);
			}
			this.logger.logProcessResult(true);
		} catch (e) {
			error = e;
		} finally {
			await this.client.close();
		}

		if (response && !error) return response;
		throw new MongoNetworkError(error);
	}

	async getBotInfo() {
		let botInfo: IBotInfo | null | undefined;
		let error: any;
		await this.client.connect();
		try {
			const collection = this.getDBCollection("BotInfo");
			const cursor = collection.find<IBotInfo>({
				bot_id: "926211660849500190",
			});
			botInfo = await cursor.next();
		} catch (e) {
			error = e;
		} finally {
			await this.client.close();
		}

		if (botInfo) return botInfo;
		else
			throw new Error(
				"There was a problem retrieving bot information from the database => " +
					error
			);
	}

	/**
	 * Updates values in the BotInfo Collection of the database.
	 *
	 * @param newInfo The new values to set. If undefined, only the last_update date will be changed.
	 * @param date The date in unix
	 * @returns
	 */
	async updateBotInfo(
		newInfo: IUpdate<IBotInfo> = {
			$set: {},
		},
		date?: number
	) {
		let result: UpdateResult | undefined;
		let error: any;
		try {
			date = date || Date.now() + 3.6e6;
			newInfo.$set.last_update = { $date: { $numberLong: `${date}` } };
			await this.client.connect();
			const collection = this.getDBCollection("BotInfo");
			result = await collection.updateOne(
				{
					bot_id: "926211660849500190",
				},
				newInfo
			);
		} catch (e) {
			error = e;
		} finally {
			await this.client.close();
		}
		if (result) return result;
		else throw Error("There was a problem updating bot info => " + error);
	}

	//TODO: make find available for other collections
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
			await this.client.close();
		}
		if (limit === 1) return guilds[0];
		return guilds;
	}

	insertMany = async (guild: testForm[]) => {
		try {
			const collection = this.getDBCollection("Test");
			const result = await collection.insertMany(guild);
			return result;
		} finally {
			await this.client.close();
		}
	};

	insertOne = async (guild: testForm) => {
		try {
			const collection = this.getDBCollection("Test");
			const result = await collection.insertOne(guild);
			return result;
		} finally {
			await this.client.close();
		}
	};

	updateMany = async (search: Partial<testForm>, update: IUpdate<testForm>) => {
		try {
			const collection = this.getDBCollection("Test");
			const result = await collection.updateMany(search, update);
			return result;
		} finally {
			await this.client.close();
		}
	};

	updateOne = async (search: Partial<testForm>, update: IUpdate<testForm>) => {
		try {
			const collection = this.getDBCollection("Test");
			const result = await collection.updateOne(search, update);
			return result;
		} finally {
			await this.client.close();
		}
	};
}
