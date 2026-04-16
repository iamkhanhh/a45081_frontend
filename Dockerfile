# ─── Stage 1: Build Angular ──────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=development

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build production (output vào dist/)
RUN npm run build -- --configuration production

# ─── Stage 2: Serve bằng Nginx ───────────────────────────
FROM nginx:alpine

# Xóa config mặc định của nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx config tùy chỉnh
COPY nginx.conf /etc/nginx/conf.d/

# Copy static files từ build stage
COPY --from=builder /app/dist/demo2 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]