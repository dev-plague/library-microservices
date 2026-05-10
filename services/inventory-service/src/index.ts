import { Hono } from "hono";
import stocksRoutes from "./routes/stocks.ruotes";
import "./events/subscribers";
import loansRoutes from "./routes/loans.routes";

const app = new Hono();

app.route("/stocks", stocksRoutes);
app.route("/loans", loansRoutes);

export default {
	port: process.env.PORT || 3000,
	fetch: app.fetch,
};
