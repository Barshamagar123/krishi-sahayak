FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (using faster registry)
RUN npm install --registry=https://registry.npmmirror.com

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

EXPOSE 3002

# Run the compiled JavaScript (for production)
CMD ["node", "dist/index.js"]