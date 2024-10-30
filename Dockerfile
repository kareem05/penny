# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install required packages
RUN apk add --no-cache python3 make g++

# Copy workspace files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Create project directories
RUN mkdir -p api client

# Copy project configurations
COPY api/project.json ./api/
COPY client/project.json ./client/
COPY api/tsconfig*.json ./api/
COPY client/tsconfig*.json ./client/

# Install dependencies
RUN npm ci

# Copy source code
COPY api ./api
COPY client ./client
# Create minimal workspace.json
# RUN echo '{"version":2,"projects":{"api":{"root":"api","sourceRoot":"api/src","projectType":"application"},"client":{"root":"client","sourceRoot":"client/src","projectType":"application"}}}' > workspace.json

# # Build the API using direct esbuild command with additional externals
# RUN cd api && npx esbuild src/main.ts \
#     --bundle \
#     --platform=node \
#     --outfile=../dist/api/main.js \
#     --external:@nestjs/* \
#     --external:@angular/* \
#     --external:express \
#     --external:mock-aws-s3 \
#     --external:aws-sdk \
#     --external:nock \
#     --external:@mapbox/node-pre-gyp \
#     --external:*.html
# Build the API with daemon disabled
RUN NX_DAEMON=false npm run build:api

EXPOSE 3333

CMD ["node", "dist/api/main.js"]
