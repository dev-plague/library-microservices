import type { Book } from "@library/shared-types";
import { eq, getTableColumns } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../db";
import { authors, books } from "../db/schema";
import { EVENTS, eventBus } from "../events/event-bus";

// GET
export const getBooks = async (c: Context) => {
	try {
		const allBooks = await db.select().from(books);
		return c.json(allBooks, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al consultar los libros" }, 500);
	}
};

export const getBooksByAuthor = async (c: Context) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "Debe proporcionar un ID de author" }, 400);
		}

		const authorBooks = await db
			.select({ ...getTableColumns(books) })
			.from(books)
			.leftJoin(authors, eq(books.authorId, authors.id))
			.where(eq(books.authorId, id));

		return c.json(authorBooks, 200);
	} catch (error) {
		console.error(error);
		return c.json(
			{ error: "Error interno al consultar los libros del autor" },
			500,
		);
	}
};

export const getBookById = async (c: Context) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "Debe ingresar un ID de libro valido" }, 400);
		}

		const book = await db.query.books.findFirst({
			where: eq(books.id, id),
		});

		if (!book) {
			return c.json(
				{ error: "No existe un libro con el ID proporcionado" },
				404,
			);
		}

		return c.json(book, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al consultar el libro" }, 500);
	}
};

// POST
export const createBook = async (c: Context) => {
	try {
		const { title, isbn, authorId, publishedYear } =
			await c.req.json<Omit<Book, "id">>();

		if (!title || !isbn || !authorId || !publishedYear) {
			return c.json(
				{
					error:
						"Los campos (titulo, isbn, autorId y año de publicación) son obligatorios",
				},
				400,
			);
		}

		const author = await db.query.authors.findFirst({
			where: eq(authors.id, authorId),
		});

		if (!author) {
			return c.json(
				{ error: "No existe un autor con el ID proporcionado" },
				404,
			);
		}

		const existIsbn = await db.query.books.findFirst({
			where: eq(books.isbn, isbn),
		});

		if (existIsbn) {
			return c.json(
				{ error: "No se permite crear más de un libro con el mismo ISBN" },
				404,
			);
		}

		const [newBook] = await db
			.insert(books)
			.values({
				title,
				isbn,
				authorId,
				publishedYear,
			})
			.returning();

		eventBus.emit(EVENTS.BOOK_CREATED, newBook);

		return c.json(newBook, 201);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al crear el libro" }, 500);
	}
};

// PATCH
export const updateBook = async (c: Context) => {
	try {
		const id = c.req.param("id");
		const { title, isbn, authorId, publishedYear } =
			await c.req.json<Partial<Book>>();

		if (!id) {
			return c.json(
				{ error: "Debe proporcionar un ID válido del libro a editar" },
				400,
			);
		}

		const book = await db.query.books.findFirst({
			where: eq(books.id, id),
		});

		if (!book) {
			return c.json(
				{ error: "No existe un libro con el ID proporcionado" },
				404,
			);
		}

		const updatedBook = await db
			.update(books)
			.set({
				title,
				isbn,
				authorId,
				publishedYear,
			})
			.where(eq(books.id, id))
			.returning();

		return c.json(updatedBook, 200);
	} catch (error) {
		console.log(error);
		return c.json(
			{ error: "Error interno al intentar actualizar el libro" },
			500,
		);
	}
};

// DELETE
export const deleteBook = async (c: Context) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "Debe ingresar un ID del libro a eliminar" }, 400);
		}

		const deletedBook = await db
			.delete(books)
			.where(eq(books.id, id))
			.returning();

		return c.json(deletedBook, 200);
	} catch (error) {
		console.log(error);
		return c.json(
			{ error: "Error interno al intentar eliminar el libro" },
			500,
		);
	}
};
