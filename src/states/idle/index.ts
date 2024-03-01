import { Bot } from "mineflayer";
import { IdleBehavior } from "./Idle.state";

export function Idle(bot: Bot) {
	return new IdleBehavior(bot);
}
