# modulo-frontend-react/Dockerfile

FROM node:18

# Crear directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos
COPY package.json package-lock.json ./
RUN npm install

COPY . .

ARG CACHEBUST=1

# Exponer el puerto que Vite usa por defecto
EXPOSE 5173

# Comando por defecto: correr el frontend en modo dev
CMD ["npm", "run", "dev", "--", "--host","0.0.0.0"]