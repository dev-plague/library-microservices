import type { Author, Book } from "@library/shared-types";
import { EVENTS, eventBus } from "./event-bus";

eventBus.on(EVENTS.BOOK_CREATED, (book: Book) => {
	console.log(
		`[EVENTO RECIBIDO]: Se ha registrado un nuevo libro: "${book.title}" (ID: ${book.id})`,
	);
});

eventBus.on(EVENTS.AUTHOR_CREATED, (author: Author) => {
	console.log(
		`[EVENTO RECIBIDO]: Se ha registrado un nuevo autor: "${author.name}" (ID: ${author.id})`,
	);
});
