# Usa la imagen oficial de Bun como base
FROM oven/bun:latest

WORKDIR /app

COPY package.json ./

RUN bun install

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "bun db:sync && bun dev"]