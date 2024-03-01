import { pathfinder } from "mineflayer-pathfinder";
import { plugin as toolPlugin } from "mineflayer-tool";
import { BotStateMachine, NestedStateMachine, StateMachineWebserver } from "mineflayer-statemachine";
import { states } from "./states";
import bot from "./bot";
import transitions from "./transitions";

const stateMachine = new NestedStateMachine(transitions, states.idle);
const botStateMachine = new BotStateMachine(bot, stateMachine);
const webserver = new StateMachineWebserver(bot, botStateMachine, 80);
webserver.startServer();

bot.loadPlugin(pathfinder);
bot.loadPlugin(toolPlugin);

bot.on("spawn", () => {
	console.log("bot spawned");
});
