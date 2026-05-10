import { eq, getTableColumns } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../db";
import { authors, books } from "../db/schema";
import { EVENTS, eventBus } from "../events/event-bus";
import type { Author } from "../types";

// GET
export const getAuthors = async (c: Context) => {
	try {
		const allAuthors = await db.select().from(authors);
		return c.json(allAuthors, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al consultar los autores" }, 500);
	}
};

export const getAuthorById = async (c: Context) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "Debe ingresar un ID de autor valido" }, 400);
		}

		const author = await db.query.authors.findFirst({
			where: eq(authors.id, id),
		});

		if (!author) {
			return c.json(
				{ error: "No existe un autor con el ID proporcionado" },
				404,
			);
		}

		return c.json(author, 200);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al consultar el autor" }, 500);
	}
};

// POST
export const createAuthor = async (c: Context) => {
	try {
		// 1. Extraer el cuerpo de la petición
		const body = await c.req.json<Omit<Author, "id">>();

		// 2. Validación básica
		if (!body.name || !body.nationality) {
			return c.json(
				{ error: "El nombre y la nacionalidad son obligatorios" },
				400,
			);
		}

		// 3. Inserción en la DB usando Drizzle
		// .returning() nos devuelve el registro creado (incluyendo el UUID generado)
		const [newAuthor] = await db
			.insert(authors)
			.values({
				name: body.name,
				nationality: body.nationality,
				birthDate: body.birthDate,
			})
			.returning();

		eventBus.emit(EVENTS.AUTHOR_CREATED, newAuthor);

		// 4. Respuesta de éxito
		return c.json(newAuthor, 201);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al crear el autor" }, 500);
	}
};

// PATCH
export const updateAuthor = async (c: Context) => {
	try {
		const id = c.req.param("id");
		const { name, nationality, birthDate } =
			await c.req.json<Partial<Author>>();

		if (!id) {
			return c.json(
				{ error: "Debe proporcionar un ID válido del autor a editar" },
				400,
			);
		}

		const author = await db.query.authors.findFirst({
			where: eq(authors.id, id),
		});

		if (!author) {
			return c.json(
				{ error: "No existe un autor con el ID proporcionado" },
				404,
			);
		}

		const updatedAuthor = await db
			.update(authors)
			.set({
				name,
				nationality,
				birthDate,
			})
			.where(eq(authors.id, id))
			.returning();

		return c.json(updatedAuthor, 200);
	} catch (error) {
		console.log(error);
		return c.json(
			{ error: "Error interno al intentar actualizar el autor" },
			500,
		);
	}
};

// DELETE
export const deleteAuthor = async (c: Context) => {
	try {
		const id = c.req.param("id");

		if (!id) {
			return c.json({ error: "Debe ingresar un ID del autor a eliminar" }, 400);
		}

		const authorBooks = await db
			.select({ ...getTableColumns(books) })
			.from(books)
			.leftJoin(authors, eq(books.authorId, authors.id))
			.where(eq(books.authorId, id));

		if (authorBooks.length !== 0) {
			return c.json(
				{ error: "No es posible eliminar a un autor con libros asociados" },
				400,
			);
		}

		const deletedAuthor = await db
			.delete(authors)
			.where(eq(authors.id, id))
			.returning();

		return c.json(deletedAuthor, 200);
	} catch (error) {
		console.error(error);
		return c.json(
			{ error: "Error interno al intentar eliminar el autor" },
			500,
		);
	}
};
