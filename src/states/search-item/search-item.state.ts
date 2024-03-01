import { Bot } from "mineflayer";
import { StateBehavior } from "mineflayer-statemachine";
import items from "../../settings/items.json";
import { goals } from "mineflayer-pathfinder";

export class SearchItemBehavior implements StateBehavior {
	stateName = "search item";
	active: boolean = false;
	bot: Bot;

	constructor(bot: Bot) {
		this.bot = bot;
	}

	async onStateEntered() {
		console.log("searching for items");
		const inventory = this.bot.inventory;
		for (let item of items) {
			if (inventory.count(item.name, null) < item.count) {
				await this.collectBlock(item.name, item.count);
			}
		}
	}

	async collectBlock(name: string, count: number) {
		let blocks = this.bot.findBlocks({
			matching(block) {
				return block.name == name;
			},
			count,
		});
		for (let block of blocks) {
			await this.bot.pathfinder.goto(new goals.GoalBlock(block.x, block.y, block.z));
		}
	}
}
