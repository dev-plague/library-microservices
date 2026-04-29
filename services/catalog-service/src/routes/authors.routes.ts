import { Hono } from "hono";
import {
	createAuthor,
	getAuthorById,
	getAuthors,
} from "../controllers/authors.controller";

const authorsRoutes = new Hono();

authorsRoutes.post("/", createAuthor);
authorsRoutes.get("/", getAuthors);
authorsRoutes.get("/:id", getAuthorById);

export default authorsRoutes;
