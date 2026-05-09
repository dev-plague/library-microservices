import { Hono } from "hono";
import {
	createBook,
	deleteBook,
	getBookById,
	getBooks,
	getBooksByAuthor,
	updateBook,
} from "../controllers/books.controller";

const booksRoutes = new Hono();

booksRoutes.get("/", getBooks);
booksRoutes.get("/:id", getBookById);
booksRoutes.get("/author/:id", getBooksByAuthor);
booksRoutes.post("/", createBook);
booksRoutes.patch("/:id", updateBook);
booksRoutes.delete("/:id", deleteBook);

export default booksRoutes;
