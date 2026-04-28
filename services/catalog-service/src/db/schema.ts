import { pgTable, uuid, varchar, date, integer } from "drizzle-orm/pg-core";

// Table of authors
export const authors = pgTable("authors", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  nationality: varchar("nationality", { length: 100 }).notNull(),
  birthDate: date("birth_date"),
});

// Table of books
export const books = pgTable("books", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  isbn: varchar("isbn", { length: 13 }).notNull().unique(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => authors.id, { onDelete: "restrict" }),
  publishedYear: integer("published_year").notNull(),
});