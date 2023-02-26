import { ShardingManager } from "discord.js";

export class ShardManager {
	static start(): void {
		const manager = new ShardingManager("./build/app/app.js", {
			totalShards: "auto",
			token: process.env.DISCORD_TOKEN,
		});

		manager.on("shardCreate", (shard) => console.log(`Launched shard ${shard.id}`));

		manager.spawn();
	}
}
ShardManager.start();
