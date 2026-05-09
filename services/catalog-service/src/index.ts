import { Hono } from "hono";
import authorsRoutes from "./routes/authors.routes";
import booksRoutes from "./routes/books.ruotes";

const app = new Hono();

app.route("/authors", authorsRoutes);
app.route("/books", booksRoutes);

export default {
	port: process.env.PORT || 3000,
	fetch: app.fetch,
};
