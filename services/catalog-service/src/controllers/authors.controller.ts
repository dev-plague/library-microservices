import type { Author } from "@library/shared-types";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { db } from "../db";
import { authors } from "../db/schema";

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

		// 4. Respuesta de éxito
		return c.json(newAuthor, 201);
	} catch (error) {
		console.error(error);
		return c.json({ error: "Error interno al crear el autor" }, 500);
	}
};

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
