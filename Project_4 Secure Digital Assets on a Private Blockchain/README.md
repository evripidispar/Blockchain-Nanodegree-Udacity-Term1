# Secure Digital Assets on a Private Blockchain

Star Registry Service that allows users to claim ownership of their favorite star in the night sky.

## Architecture
- Node.js
- Express.js

## Getting Started

### Prerequisites

Installing Node and NPM is pretty straightforward using the installer package available from the (Node.js® web site)[https://nodejs.org/en/].

### Configuring your project
- Clone/Download the project and cd into the root folder
- Install all dependencies via npm.
```
npm install
```

```
npm install <module_name> --save
```

```
"dependencies": {
   "bitcoinjs-lib": "^4.0.2",
   "bitcoinjs-message": "^2.0.0",
   "body-parser": "^1.18.3",
   "crypto-js": "^3.1.9-1",
   "express": "^4.16.4",
   "hex2ascii": "0.0.3",
   "level": "^4.0.0",
 }
```

## Testing

Run the server

```
node server.js
```

Use Postman, a powerful tool used to test web services, or a simple CURL on the terminal to send the requests. Supported endpoints:

### Blockchain ID validation request (POST endpoint)
Endpoint definition
```
http://localhost:8000/requestValidation
```
Parameter(s)
```
address - A bitcoin address, take it from Electrum
```

Example in Postman:


### POST endpoint
Add new block
```
http://localhost:8000/block
```

Example using CURL command:

```
curl -X "POST" "http://localhost:8000/block" -H 'Content-Type: application/json' -d $'{"body":"New block added"}'
```
