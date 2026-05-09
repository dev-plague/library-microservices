import { EventEmitter } from "node:events";

export const eventBus = new EventEmitter();

export const EVENTS = {
	BOOK_CREATED: "book.created",
	AUTHOR_CREATED: "author.created",
};
