# build
FROM node:20-alpine AS builder
WORKDIR /srv
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# run
FROM node:20-alpine
WORKDIR /srv
ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0
COPY --from=builder /srv/node_modules ./node_modules
COPY --from=builder /srv/package*.json ./
RUN npm prune --omit=dev
COPY --from=builder /srv/dist ./dist
EXPOSE 4000
CMD ["node", "dist/index.js"]
