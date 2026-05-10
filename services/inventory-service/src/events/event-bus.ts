import { EventEmitter } from "node:events";

export const eventBus = new EventEmitter();

export const EVENTS = {
	STOCK_CREATED: "stock.created",
};
