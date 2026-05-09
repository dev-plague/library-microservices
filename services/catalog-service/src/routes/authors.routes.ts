import { Hono } from "hono";
import {
	createAuthor,
	deleteAuthor,
	getAuthorById,
	getAuthors,
	updateAuthor,
} from "../controllers/authors.controller";

const authorsRoutes = new Hono();

authorsRoutes.get("/", getAuthors);
authorsRoutes.get("/:id", getAuthorById);
authorsRoutes.post("/", createAuthor);
authorsRoutes.patch("/:id", updateAuthor);
authorsRoutes.delete("/:id", deleteAuthor);

export default authorsRoutes;
