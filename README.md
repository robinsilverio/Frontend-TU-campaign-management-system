# Frontend for the administration tool for creating and managing campaigns/price-promotions.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Headed Component Tests with [Cypress Component Testing](https://on.cypress.io/component)

```sh
npm run test:unit:dev # or `npm run test:unit` for headless testing
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

# Local deployment by using docker
If you want to deploy the application locally using a docker container, you can use docker commands to perform that.
Keep in mind that it is required to install docker engine.
Link to docker installation: https://docs.docker.com/engine/install/

## Steps to reproduce
Below are the steps for ensuring the app deployment:

### Step 1 - Ensure that a Dockerfile and compose file are stored in the project structure.
For now it is not needed, but if there are absence of these files, you must add these.
Dockerfile:
```
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

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy the nginx.conf file (see step 3)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
```
Compose file (store this in a sub directory _docker/_ inside the project structure):
```yml
version: '3.0'
services:
  tu-campaign-management-tool-frontend:
    image: tu-campaign-frontend:0.0.1-SNAPSHOT
    ports:
      - "5173:5173"
    restart: always
```
### Step 2 - Open terminal and navigate to the project.
Use command ```cd <path to the project>```
### Step 3 - Create a docker image.
Issue command to create a docker-image. Remember to use the name of the image that is
declared in the compose file.

Command for creating an docker image: 
```bash
docker build -t tu-campaign-frontend:0.0.1-SNAPSHOT .
```
### Step 4 - Issue command docker compose to start deployment.
Command: 
```bash
docker-compose -f <path to compose yml-file> up -d
```
Step 5 - Access the website by url http://localhost:5173

If you want to stop the deployment locally, then issue this command to stop it.
```
docker-compose -f <path to compose yml-file> down
```

## Troubleshoot
Sometimes it can be a hard time and time consuming to find solutions for problems that
you encounter. But lets list a couple of problems with its solutions that happens during development.

### Error during connect.
Error message after issuing command docker ps (listing containers):
```
$ docker ps
error during connect: this error may indicate that the docker daemon is not running: Get "http://%2F%2F.%2Fpipe%2Fdocker_engine/v1.24/containers/json": open //./pipe/docker_engine: Het systeem kan het opgegeven
 bestand niet vinden.
```
If you see this warning when issuing a command like _docker ps_. It means that a docker-daemon (engine) is not running.
For that, you should open Docker Desktop.