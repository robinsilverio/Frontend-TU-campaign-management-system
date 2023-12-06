# Choose the Image which has Node installed already
FROM node:lts-alpine AS build-stage

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for development environment with minification
RUN npm run build -- --mode dev

# Production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /app/campaign-management-frontend

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 5173
ENTRYPOINT ["nginx", "-g", "daemon off;"]