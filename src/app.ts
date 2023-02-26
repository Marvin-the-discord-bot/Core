import { importx } from "@discordx/importer";
import { Interaction, Message, IntentsBitField, BitFieldResolvable, GatewayIntentsString } from "discord.js";
import { Client } from "discordx";
import path from "path";

export class Main {
	private static client: Client;

	private static _intents: BitFieldResolvable<GatewayIntentsString, number> = [
		IntentsBitField.Flags.Guilds,
		IntentsBitField.Flags.GuildMessages,
	];

	static get intents(): BitFieldResolvable<GatewayIntentsString, number> {
		return this._intents;
	}

	static isDebug = !!process.env.ENV ? process.env.ENV === "development" : true;

	static async start(): Promise<void> {
		this.client = new Client({
			intents: this.intents,
			botGuilds: this.isDebug ? [process.env.DEBUG_GUILD!] : undefined,
			silent: false,
		});

		this.client.once("ready", async () => {
			// make sure all guilds are in cache
			await this.client.guilds.fetch();

			// to create/update/delete discord application commands
			await this.client.initApplicationCommands();

			console.log(`${this.client.user?.username} is ready!`);
		});

		this.client.on("interactionCreate", (interaction: Interaction) => {
			this.client.executeInteraction(interaction);
		});

		this.client.on("messageCreate", (message: Message) => {
			this.client.executeCommand(message);
		});

		// Import all commands
		await importx(path.join(...[__dirname, "/commands/**/*.ts"]));

		if (!process.env.DISCORD_TOKEN) {
			throw Error("Could not find DISCORD_TOKEN in your environment");
		}
		await this.client.login(process.env.DISCORD_TOKEN);
	}
}

Main.start();
