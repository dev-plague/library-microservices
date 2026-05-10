import { eq, getTableColumns } from "drizzle-orm";
import { Hono, type Context } from "hono";
import { db } from "../db";
import { stocks } from "../db/schema";
import { EVENTS, eventBus } from "../events/event-bus";
import { fetch } from "bun";
import type { Stock } from "../../types/stocks";

// GET
export const getStocks = async (c: Context) => {
    try {
        const allStocks = await db.select().from(stocks);
        return c.json(allStocks, 200);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Error interno al consultar inventario de libros" }, 500);
    }
};

// POST
export const createStock = async (c: Context) => {
    try {
        const { bookId, quantity } =
            await c.req.json<Omit<Stock, "id">>();

        if (!bookId || !quantity) {
            return c.json(
                {
                    error:
                        "Los campos (titulo, isbn, autorId y año de publicación) son obligatorios",
                },
                400,
            );
        }

        const response = await fetch(`http://localhost:3000/books/${bookId}`);

        if (response.status === 404) {
            return c.json(
                { error: "No existe un libro con el ID proporcionado" },
                404
            );
        }

        if (!response.ok) {
            return c.json(
                { error: `Error inesperado en el servicio de catálogo: ${response.status}` },
                response.status
            );
        }

        const book = await response.json();
        console.log("Libro encontrado:", book);
        if (!book) {
            return c.json(
                { error: "No existe un autor con el ID proporcionado" },
                404,
            );
        }

        const existStock = await db.query.stocks.findFirst({
            where: eq(stocks.bookId, bookId),
        });

        if (existStock) {
            return c.json(
                { error: "No se permite crear más de un stock para el mismo libro" },
                404,
            );
        }

        const [newStock] = await db
            .insert(stocks)
            .values({
                bookId,
                quantity,
            })
            .returning();

        eventBus.emit(EVENTS.STOCK_CREATED, newStock);

        return c.json(newStock, 201);
    } catch (error) {
        console.error(error);
        return c.json({ error: "Error interno al crear el libro" }, 500);
    }
};