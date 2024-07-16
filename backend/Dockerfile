FROM node:lts-slim as builder

WORKDIR /app
COPY . /app
RUN npm ci && \
    npm run build

FROM node:lts-slim
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl

RUN addgroup --gid 1001 --system app && \
    adduser --no-create-home --shell /bin/false --disabled-password --uid 1001 --system --group app && \
    chown -R 1001:1001 /app

USER app

COPY --from=builder /app/build /app
ENTRYPOINT ["node", "index.js"]