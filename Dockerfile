# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json /usr/src/app/

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . /usr/src/app

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Run the application
CMD ["npm", "run", "dev"]

# How to use this docker file in production:
# 1. Build the Docker image: docker build -t amc_backend .
# 2. Run the Docker container: docker run -p 3000:3000 amc_backend
# 3. Open web browser and navigate to http://localhost:3000
# 4. Link the backend API to the frontend by using the url: http://localhost:3000/api
