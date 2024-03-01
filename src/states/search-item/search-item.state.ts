import { Bot } from "mineflayer";
import { StateBehavior } from "mineflayer-statemachine";
import items from "../../settings/items.json";
import { goals } from "mineflayer-pathfinder";
import { MCdata } from "../../utils/mcData";
import transitions from "../../transitions";

export class SearchItemBehavior implements StateBehavior {
	stateName = "search item";
	active: boolean = false;
	bot: Bot;

	constructor(bot: Bot) {
		this.bot = bot;
	}

	async onStateEntered() {
		console.log("entered search state");
		console.log("searching for items...");
		const inventory = this.bot.inventory;
		for (let item of items) {
			let count = 0;

			let invItems = inventory.items();
			let foundItems = invItems.filter((v) => v.name.includes(item.name)).map((v) => v.count);
			if (foundItems.length > 0) {
				count += foundItems.reduce((p, v) => p + v);
			}

			console.log(`found ${count} ${item.name}`);
			if (count < item.count) {
				console.log(`collecting ${item.count - count} ${item.name}`);
				await this.getItem(item.name, item.count - count);
			}
		}
		transitions.SearchToIdle.trigger();
	}

	async getItem(name: string, count: number) {
		const craftingTable = this.bot.findBlock({
			matching(block) {
				return block.name == "crafting_table";
			},
		});

		let items = MCdata.itemsArray.filter((v) => v.name.includes(name));

		let recipe;
		for (const block of items) {
			recipe = this.bot.recipesFor(block.id, null, 1, craftingTable || false)[0];
			if (recipe) break;
		}

		if (recipe) {
			try {
				await this.bot.craft(recipe, undefined, craftingTable || undefined);
				console.log(`${name} crafted`);
			} catch {
				console.log(`crafting ${name} failed`);
			}
		} else {
			await this.collectBlock(name, count);
		}
	}

	async collectBlock(name: string, count: number) {
		let blocks = this.bot.findBlocks({
			matching(block) {
				return block.name.includes(name);
			},
			count,
		});
		console.log(`found ${blocks.length} blocks`);

		for (let pos of blocks) {
			try {
				await this.bot.pathfinder.goto(new goals.GoalBlock(pos.x, pos.y, pos.z));
			} catch {
				return false;
			}
			let block = this.bot.blockAt(pos);
			if (block) {
				await this.bot.tool.equipForBlock(block, { requireHarvest: true });
				await this.bot.dig(block, true);
			}
		}
		return true;
	}
}
