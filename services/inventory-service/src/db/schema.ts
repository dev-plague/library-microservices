import { pgTable, uuid, integer, date } from "drizzle-orm/pg-core";

// Table of stocks
export const stocks = pgTable("stocks", {
  id: uuid("id").primaryKey().defaultRandom(),
  bookId: uuid("book_id")
    .notNull()
    .unique(),
  quantity: integer("quantity").notNull(),
});

// Table of loans
export const loans = pgTable("loans", {
  id: uuid("id").primaryKey().defaultRandom(),
  stockId: uuid("stock_id")
    .notNull()
    .references(() => stocks.id),
  document: integer("document").notNull(),
  date: date("date"),

});