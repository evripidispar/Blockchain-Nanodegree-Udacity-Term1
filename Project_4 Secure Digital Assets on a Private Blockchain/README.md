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
Parameter
```
address - A bitcoin address, take it from Electrum
```
Example in Postman
<img width="975" alt="Screen Shot 2019-04-15 at 11 33 16 PM" src="https://user-images.githubusercontent.com/5134520/56181560-ff775d00-5fdb-11e9-8aaa-87148055dacc.png">

### Blockchain ID message signature validation (POST endpoint)
Endpoint definition
```
http://localhost:8000/message-signature/validate
```
Parameters
```
address - A bitcoin address, take it from Electrum
signature - Sign/Verify the message using Electrum wallet
```
Example in Postman
<img width="975" alt="Screen Shot 2019-04-15 at 11 34 56 PM" src="https://user-images.githubusercontent.com/5134520/56181559-ff775d00-5fdb-11e9-9591-13040e78ed2f.png">

### Star Registration (POST endpoint)
Endpoint defition
```
http://localhost:8000/block
```
Parameters
```
address - The same bitcoin address you used
star - Containing dec, ra and story with maximum 500 bytes size
```
Example in Postman
<img width="963" alt="Screen Shot 2019-04-15 at 11 43 54 PM" src="https://user-images.githubusercontent.com/5134520/56181558-ff775d00-5fdb-11e9-920d-150f9cf3ee8c.png">

### Get block by hash (GET endpoint)
Endpoint defition
```
http://localhost:8000/stars/hash:[HASH]
```
Parameter
```
hash - The hash of one of the added blocks
```
Example in Postman
<img width="974" alt="Screen Shot 2019-04-15 at 11 48 47 PM" src="https://user-images.githubusercontent.com/5134520/56181556-ff775d00-5fdb-11e9-93c6-7115e837dd3e.png">

### Get block by address (GET endpoint)
Endpoint defition
```
http://localhost:8000/stars/address:[ADDRESS]
```
Parameter
```
address - The same bitcoin address you used
```
Example in Postman
<img width="968" alt="Screen Shot 2019-04-15 at 11 51 15 PM" src="https://user-images.githubusercontent.com/5134520/56181555-ff775d00-5fdb-11e9-9dd5-48be901c9f18.png">

### Get block by height (GET endpoint)
Endpoint defition
```
http://localhost:8000/block/[HEIGHT]
```
Parameter
```
height - The height of the block
```
Example in Postman
<img width="967" alt="Screen Shot 2019-04-15 at 11 45 49 PM" src="https://user-images.githubusercontent.com/5134520/56181557-ff775d00-5fdb-11e9-84e4-49e3311b9984.png">
