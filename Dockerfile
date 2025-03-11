FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Copy the entire project
COPY . .

# Expose the API port
EXPOSE 8080

# Set environment variable
ENV NODE_ENV=production

# Start the application
CMD ["node", "index.js"]
