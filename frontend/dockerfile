# Development stage
FROM node:20-alpine as dev

# Define working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY frontend/package.json ./
RUN npm install

# Copy .env file first
COPY frontend/.env ./

# Copy all files to container
COPY frontend/ .

# Start app in dev
CMD ["npm", "start"]


# Build stage
FROM node:20-alpine as build

# Define working directory in container
WORKDIR /app

# Copy package.json and package-lock.json to container
COPY frontend/package.json ./
RUN npm install

# Copy .env file first
COPY frontend/.env ./

# Copy all files to container
COPY frontend/ .

RUN npm run build


# Production stage
FROM nginx:alpine as prod

COPY --from=build /app/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]