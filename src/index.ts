import { pathfinder } from "mineflayer-pathfinder";
import { plugin as toolPlugin } from "mineflayer-tool";
import { BotStateMachine, NestedStateMachine, StateMachineWebserver } from "mineflayer-statemachine";
import bot from "./bot";
import transitions from "./transitions";
import { states } from "./states";

bot.loadPlugin(pathfinder);
bot.loadPlugin(toolPlugin);

bot.once("spawn", () => {
	const stateMachine = new NestedStateMachine(Object.values(transitions), states.idle);
	const botStateMachine = new BotStateMachine(bot, stateMachine);
	const webserver = new StateMachineWebserver(bot, botStateMachine, 80);
	webserver.startServer();
	console.log("bot spawned");
});
