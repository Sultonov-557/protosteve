import { Bot } from "mineflayer";
import { StateBehavior } from "mineflayer-statemachine";

export class IdleBehavior implements StateBehavior {
	stateName = "idle";
	active: boolean = true;
	bot: Bot;

	constructor(bot: Bot) {
		this.bot = bot;
	}

}
