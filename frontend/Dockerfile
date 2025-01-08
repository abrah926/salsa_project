# Use Node.js image to build React app
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json /app/
RUN npm install --silent

COPY . /app/
RUN npm run build

# Serve the built files with nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
