import { Idle } from "./idle";
import { SearchItem } from "./search-item";
import bot from "../bot";

export const states = {
	idle: Idle(bot),
	searchItem: SearchItem(bot),
};
