# STAGE 1: install
FROM node:16.7-alpine AS base
WORKDIR /base
# Install dependencies
COPY package.json ./
COPY package-lock.json ./
# This makes sure to not only copy the schema.prisma into the Docker image,
# but also includes the migrations directory. 
# This is necessary as prisma migrate deploy only executes the migration history files.
COPY prisma ./prisma/ 
RUN npm ci
# Copy project 
COPY . .

# STAGE 2: build
FROM base AS build
ENV NODE_ENV=production
WORKDIR /build
COPY --from=base /base ./
RUN npm run build

# STAGE 3: app
FROM node:16.7-alpine AS app
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build ./

EXPOSE 7001
CMD [ "./run.sh" ]
