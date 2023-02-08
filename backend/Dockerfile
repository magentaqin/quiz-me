# STAGE 1: install
FROM node:16.17.0 AS base
WORKDIR /base
# Install dependencies
COPY package.json ./
COPY package-lock.json ./
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
FROM base AS app
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /build ./

EXPOSE 7001
CMD ["npm", "start"]
