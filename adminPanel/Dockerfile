# ----------------------------
# STAGE 1 - BUILD
# ----------------------------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json & package-lock.json first for caching
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Vite app (base is /medblink-customer/)
RUN npm run build

# ----------------------------
# STAGE 2 - SERVE
# ----------------------------
FROM nginx:alpine

# Copy the build output to /usr/share/nginx/html/medblink-admin
COPY --from=build /app/medblink-admin /usr/share/nginx/html/medblink-admin

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]