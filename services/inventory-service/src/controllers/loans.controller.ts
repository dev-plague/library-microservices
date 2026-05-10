import { eq, sql } from "drizzle-orm";
import { type Context } from "hono";
import { db } from "../db";
import { stocks, loans } from "../db/schema";
// GET Loans
export const getLoans = async (c: Context) => {
    try {
        const allLoans = await db
            .select({
                id: loans.id,
                document: loans.document,
                date: loans.date,
                stockDetails: {
                    id: stocks.id,
                    bookId: stocks.bookId,
                },
            })
            .from(loans)
            .leftJoin(stocks, eq(loans.stockId, stocks.id));

        return c.json(allLoans, 200);
    } catch (error) {
        console.error("Error al obtener préstamos:", error);
        return c.json({ error: "Error interno al consultar los préstamos" }, 500);
    }
};

//POST loans
export const createLoan = async (c: Context) => {
    try {
        const { stockId, document } = await c.req.json<{ stockId: string; document: number }>();

        if (!stockId || !document) {
            return c.json({ error: "El ID de stock y el documento son obligatorios" }, 400);
        }

        const result = await db.transaction(async (tx) => {
            
            const currentStock = await tx.query.stocks.findFirst({
                where: eq(stocks.id, stockId),
            });

            if (!currentStock) {
                return { error: "El stock especificado no existe", status: 404 };
            }

            if (currentStock.quantity <= 0) {
                return { error: "No hay unidades disponibles en inventario", status: 400 };
            }

            const [newLoan] = await tx
                .insert(loans)
                .values({
                    stockId: stockId,
                    document: document,
                    date: new Date().toISOString().split('T')[0],
                })
                .returning();

            await tx
                .update(stocks)
                .set({
                    quantity: sql`${stocks.quantity} - 1`,
                })
                .where(eq(stocks.id, stockId));

            return { data: newLoan, status: 201 };
        });

        if ("error" in result) {
            return c.json({ error: result.error }, result.status as any);
        }

        return c.json(result.data, 201);

    } catch (error) {
        console.error("Error al procesar préstamo:", error);
        return c.json({ error: "Error interno al procesar el préstamo" }, 500);
    }
};