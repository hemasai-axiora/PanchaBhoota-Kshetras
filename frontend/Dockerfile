# Stage 1: Build the Angular App
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build -- --configuration=production

# Stage 2: Serve the App using Nginx
FROM nginx:alpine

COPY --from=builder /usr/src/app/dist/frontend/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
