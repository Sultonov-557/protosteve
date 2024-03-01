import { StateTransition } from "mineflayer-statemachine";
import { states } from "./states";
import bot from "./bot";
import items from "./settings/items.json";

const SearchToIdle = new StateTransition({
	parent: states.searchItem,
	child: states.idle,
	shouldTransition() {
		const inventory = bot.inventory;
		let output = true;

		for (const item of items) {
			let count = 0;

			let invItems = inventory.items();
			let foundItems = invItems.filter((v) => v.name.includes(item.name)).map((v) => v.count);
			if (foundItems.length > 0) {
				count += foundItems.reduce((p, v) => p + v);
			}
			if (count < item.count) {
				output = false;
			}
		}
		return output;
	},
});

const IdleToSearch = new StateTransition({
	parent: states.idle,
	child: states.searchItem,
	shouldTransition() {
		const inventory = bot.inventory;

		for (const item of items) {
			let count = 0;

			let invItems = inventory.items();
			let foundItems = invItems.filter((v) => v.name.includes(item.name)).map((v) => v.count);
			if (foundItems.length > 0) {
				count += foundItems.reduce((p, v) => p + v);
			}
			if (count < item.count) {
				return true;
			}
		}
		return false;
	},
});

export default { SearchToIdle, IdleToSearch };
