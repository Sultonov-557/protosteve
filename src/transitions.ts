import { StateTransition } from "mineflayer-statemachine";
import { states } from "./states";
import bot from "./bot";
import items from "./settings/items.json";

const idleToSearch = new StateTransition({
	parent: states.idle,
	child: states.searchItem,
	shouldTransition() {
		const inventory = bot.inventory;

		for (const item of items) {
			if (inventory.count(item.name, null) < item.count) {
				return true;
			}
		}
		return false;
	},
});

export default [idleToSearch];
