# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the app's dependencies
RUN npm install

# Copy all the files from the current directory to the working directory in the container
COPY . .

ARG DOMAIN
ENV USERDNSDOMAIN=$DOMAIN

# Expose the port that your Node.js app is listening on (assuming it's port 3000)
EXPOSE 3000

# Start the Node.js app
CMD ["node", "server.js"]