import { Hono } from "hono";
import authorsRoutes from "./routes/authors.routes";

const app = new Hono();

app.route("/authors", authorsRoutes);

export default {
	port: process.env.PORT || 3000,
	fetch: app.fetch,
};
