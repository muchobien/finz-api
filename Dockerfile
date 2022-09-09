# syntax=docker/dockerfile:1.4
FROM node:16.17.0-alpine3.16 as builder

WORKDIR /home/node

COPY package*.json ./
COPY yarn.lock ./
COPY prisma ./prisma/

RUN --mount=type=cache,target=/home/node/.yarn,rw --mount=type=cache,target=/var/cache/apk,rw <<EOF
apk update
apk add jq
YARN_CACHE_FOLDER=/home/node/.yarn yarn install --frozen-lockfile
EOF

COPY --chown=node:node . .

RUN <<EOF
yarn build
yarn remove $(cat package.json | jq -r '.devDependencies | keys | join(" ")')
EOF

FROM node:16.17.0-alpine3.16
ENV NODE_ENV production
WORKDIR /home/node

RUN <<EOF
apk add --no-cache ca-certificates
EOF

USER node

COPY --from=builder --chown=node:node /home/node/package*.json ./
COPY --from=builder --chown=node:node /home/node/node_modules/ ./node_modules/
COPY --from=builder --chown=node:node /home/node/dist/ ./dist/

CMD ["node", "--experimental-specifier-resolution=node", "dist/main.js"]
