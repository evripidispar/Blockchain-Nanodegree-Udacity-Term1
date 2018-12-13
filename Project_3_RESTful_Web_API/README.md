# RESTful web API - private blockchain

A RESTful blockchain web API that adds new block to blockchain and also let you see the blocks at a particular blockheight

## Architecture
- Node.js
- Express.js

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project
- Clone/Download the project and cd into the root folder
- Install all dependencies via npm.
```
npm install
```

## Testing

Run the server

```
node server.js
```

Use Postman or a simple CURL on the terminal to send the requests to the base url http://localhost:8000 with one of the below supported endpoints:

### GET endpoint
**Fetch block at a particular blockheight**
```
http://localhost:<PORT>/block/blockheight
```

Example using CURL command:

```
 curl http://localhost:8000/block/0
```

### POST endpoint

**Add new block**
```
http://localhost:<PORT>/block
```

Example using CURL command:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"New block added"}'
```