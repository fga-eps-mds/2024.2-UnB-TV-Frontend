# Use node image version 20 as base
FROM node:20 as angular

# Set working directory
WORKDIR /unb-tv-web

# Update package lists and install Chromium
RUN apt-get update \
    && apt-get install -y chromium

# Set CHROME_BIN environment variable for Angular CLI
ENV CHROME_BIN=/usr/bin/chromium

# Add Node.js binaries to PATH and set NODE_ENV
ENV PATH /unb-tv-web/node_modules/.bin:$PATH
ENV NODE_ENV=dev

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install project dependencies
COPY package.json /unb-tv-web/
RUN npm install

# Copy project files
COPY . /unb-tv-web

# Expose ports for Angular development server and Karma test runner
EXPOSE 4200
EXPOSE 9876