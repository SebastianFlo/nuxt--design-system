# Pull the Node Image
FROM node:14.17.5
LABEL version="1.0.0"

ARG GIT_COMMIT=unspecified
LABEL git_commit=$GIT_COMMIT

RUN echo Building Preview server with commit $GIT_COMMIT

# Switch to the app root directory
WORKDIR /usr/src/app

# Copy app source
COPY . .

# Setup environment
ENV NODE_ENV=production
ENV PORT=3000

# Install packages
RUN npm install

# Build application
RUN npm run build

# Start the server
EXPOSE 3000
CMD ["node", "preview.js"]
