import { Hono } from "hono";
import { createStock, getStocks } from "../controllers/stocks.controller";

const stocks = new Hono();

stocks.get("/", getStocks);
stocks.post("/", createStock);
// booksRoutes.get("/author/:id", getBooksByAuthor);
// booksRoutes.post("/", createBook);
// booksRoutes.patch("/:id", updateBook);
// booksRoutes.delete("/:id", deleteBook);

export default stocks;
