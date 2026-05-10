import { EVENTS, eventBus } from "./event-bus";
import type { Stock } from "../../types/stocks";

eventBus.on(EVENTS.STOCK_CREATED, (stock: Stock) => {
	console.log(
		`[EVENTO RECIBIDO]: Se ha registrado stock: "${stock.id}"`,
	);
});
