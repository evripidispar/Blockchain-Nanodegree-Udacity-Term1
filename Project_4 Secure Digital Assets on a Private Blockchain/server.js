const express = require('express')
const bodyParser = require('body-parser')
const Block = require('./block')
const BlockChain = require('./simpleChain')
const app = express()
const compression = require('compression')
const StarClass = require('./star-utils')


//create mempool to store the validation requests
const mempool = {};
const timeoutRequests = {};

// Create the blockchain object
let blockChain = new BlockChain();

//Application-level middleware functions using express

/*validateAdressParameter = async (req, res, next) => {
	const starObj = new StarClass(req)

	try{
		if(!starObj.req.body.address){
			return res.status(400).json({error: 'Please fill the address parameter of POST request'})
		}
	} catch (error) {
		res.status(400).json({

		}
	}
	next()
}

validateSignatureParameter = async (req, res, next) => {
	const starObj = new StarClass(req)
	if(!starObj.req.body.signature){
		return res.status(400).json({error: 'Please fill the signature parameter of POST request'})
	}
	next()
}*/

app.use(compression())
app.use(bodyParser.json())
app.listen(8000, () => console.log('API listening on port 8000'))
app.get('/', (req, res) => res.status(404).json({
	status: 404
	message: 'Check README.md for accepted endpoints'
}))

//Web API POST Endpoint that validates request returning a JSON response
app.post('/requestValidation', (req, res) => {
	//Check if there is address parameter
	try{
		const address = req.body.address
		if(address === ' '){
			throw new Error('Fill the address parameter of POST request')
		}
	} catch (error) {
		res.status(401).json({
		status: 401,
		message: error.message
	})
	}

	const timestamp = Date.now()
	const message = `${address}:${timestamp}:starRegistry`
	const validatioWindow = 300

	const data = {
		walletAddress: address,
		requestTimeStamp: timestamp,
		validationWindow: validationWindow,
		message: message
	}

	const TimeoutRequestsWindowTime = 5*60*1000

	//Add request validation
	if(!mempool.hasOwnProperty(address)){
		mempool[address] = {message, timestamp, validationWindow, isVerified: false}
		timeoutRequests[address] = setTimeout(function(){delete mempool[address]}, TimeoutRequestsWindowTime)
		res.json(data)
	}
	else {
		//Check if request is expired (maybe redundant)
		if(mempool[address].timestamp < (Date.now() - (5*60*100))){
			delete mempool[address]
			mempool[address] = {message, timestamp, validationWindow, isVerified: false}
			timeoutRequests[address] = setTimeout(function(){delete mempool[address]}, TimeoutRequestsWindowTime)
			res.json(data)
		}
		//Update validation Window time
		else{
			let timeElapse = new Date().getTime.toString().slice(0,-3) - timestamp
			let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse
			validationWindow = timeLeft
			mempool[address].validationWindow = validationWindow
		}
	}
})




 //GET Block endpoint using URL path with block height parameter. Example URL path http://localhost:8000/block/{Blockheight}
 
 app.get('/block/:Blockheight', async (req, res) => {
 	try {
 		const blockheight = req.params.Blockheight
 		const block = await blockChain.getBlock(blockheight)
 		res.send(JSON.parse(block))
 	}
 	catch (error) {
 		res.status(404).json({error: 'Block could not be found in the blockchain'})
 	}
 })

// POST Block endpoint using key/value pair within request body. Example URL path http://localhost:8000/block

 app.post('/block', async (req, res)=> {
 	const body = req.body.body
 	if (body === '') {
 		return res.status(400).json({error: 'cannot create block with empty body string'})
 	}
 	else if (body === undefined){
 		return res.status(400).json({error: 'body parameter is not defined'})
 	}

 	await blockChain.addBlock(new Block(body))
  	const height = await blockChain.getBlockHeight()
  	const block = await blockChain.getBlock(height)
  	res.status(201).send(JSON.parse(block))
 })

 



