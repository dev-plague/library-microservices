# Usa la imagen oficial de Bun como base
FROM oven/bun:latest

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias primero para aprovechar la caché de Docker
COPY package.json ./

# Instala las dependencias
RUN bun install

# Copia el resto de los archivos de tu proyecto
COPY . .

# Expone el puerto en el que corre tu app (ejemplo: 3000)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["sh", "-c", "bun db:sync && bun dev"]