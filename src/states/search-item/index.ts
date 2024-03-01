import { Bot } from "mineflayer";
import { SearchItemBehavior } from "./search-item.state";

export function SearchItem(bot: Bot) {
	return new SearchItemBehavior(bot);
}
