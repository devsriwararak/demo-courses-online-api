<<<<<<< HEAD
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup.
=======
FROM node:18

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy the local code to the container image.
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Run the web service on container startup.
>>>>>>> master
CMD [ "node", "server.js" ]