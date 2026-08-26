# Stage 1: Build React/Vite frontend
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies with caching
COPY package*.json ./
RUN npm ci

# Copy source code and build production bundle
COPY . ./
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
