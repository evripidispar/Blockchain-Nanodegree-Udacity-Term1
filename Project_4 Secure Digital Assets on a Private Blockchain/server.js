const express = require('express')
const bodyParser = require('body-parser')
const Block = require('./block')
const BlockChain = require('./simpleChain')
const app = express()
const Mempool = require('./mempool-utils')

//create mempool to store the validation requests
const mempool = []
const timeoutRequests = []
const mempoolValid = []

let MemPoolObj = new Mempool(mempool, timeoutRequests, mempoolValid);

// Create the blockchain object
let blockChain = new BlockChain();

app.use(bodyParser.json())
app.listen(8000, () => console.log('API listening on port 8000'))
app.get('/', (req, res) => res.status(404).json({
	status: 404,
	message: 'Check README.md for accepted endpoints'
}))

//Web API POST Endpoint that validates request returning a JSON response
app.post('/requestValidation', (req, res) => {
	//Check if there is address parameter
	const address = req.body.address
	try{
		if(!req.body.address){
			throw new Error('Fill the address parameter of POST request')
		}
	} catch (error) {
		res.status(401).json({
		status: 401,
		message: error.message
	})
	}

	requestObject = MemPoolObj.AddRequestValidation(address)
	res.json(requestObject)


	/*const timestamp = Date.now()
	const message = `${address}:${timestamp}:starRegistry`
	const validationWindow = 300

	const data = {
		walletAddress: address,
		requestTimeStamp: timestamp,
		validationWindow: validationWindow,
		message: message
	}

	const TimeoutRequestsWindowTime = 5*1000

	//Add request validation
	if(!mempool.hasOwnProperty(address)){
		mempool[address] = {message, timestamp, validationWindow, isVerified: false}
		timeoutRequests[address] = setTimeout(function(){delete mempool[address]}, TimeoutRequestsWindowTime)
		res.json(data)
		console.log('Add new request')
	}
	else {
		//Check if request is expired (maybe redundant)
		//if(mempool[address].timestamp < (Date.now() - (TimeoutRequestsWindowTime))){
		//	delete mempool[address]
		//	mempool[address] = {message, timestamp, validationWindow, isVerified: false}
		//	timeoutRequests[address] = setTimeout(function(){delete mempool[address]}, TimeoutRequestsWindowTime)
		//	res.json(data)
		//	console.log('updated request')
		//}
		//Update validation Window time
		//else{
		let timeElapse = Date.now() - mempool[address].timestamp
		let timeLeft = Math.floor((TimeoutRequestsWindowTime-timeElapse)/1000)

		mempool[address].validationWindow = timeLeft
		data.validationWindow = timeLeft
		res.json(data)
		console.log('existing request')
		//}
	}*/
})

//Web API POST message signature validation endpoint
app.post('/message-signature/validate', (req, res)=>{
	const {address, signature} = req.body

	try{
		if((!address) || (!signature)) {
			throw new Error('Fill the address and signatures parameters of POST request')
		}
		validRequestObj = MemPoolObj.validateRequestByWallet(address, signature)
		res.json(validRequestObj)
	} catch (error) {
		res.status(401).json({
		status: 401,
		message: error.message
	})
	}
})

// POST Block endpoint using key/value pair within request body. Example URL path http://localhost:8000/block

 app.post('/block', async (req, res)=> {
 	const MAX_BYTES = 500
 	const isASCII = ((str) => /^[\x00-\x7F]*$/.test(str))
 	const body = {address, star} = req.body

 	try{
 		if((!address) || (!star)) {
 			throw new Error('Fill the address and star parameters of block POST request')
 		}
 		if (new Buffer(star.story).length > MAX_BYTES) {
      		throw new Error('Your star story should have maximum size of 500 bytes')
    	}
 		if (typeof star.dec !== 'string' || typeof star.ra !== 'string' || typeof star.story !== 'string' || !star.dec.length || !star.ra.length || !star.story.length) {
      		throw new Error('Your star information should include non-empty string properties dec, ra and story')
    	}
    	if (!isASCII(star.story)) {
      		throw new Error('Your star story contains non-ASCII symbols')
    	}

    	let isValid = MemPoolObj.verifyAddressRequest(address)
   		if (isValid){
   			body.star = {
 				ra: star.ra,
 				dec: star.dec,
 				mag: star.mag,
 				cen: star.cen,
 				story: new Buffer(star.story).toString('hex') //encode story
 			}

 			await blockChain.addBlock(new Block(body))
  			const height = await blockChain.getBlockHeight()
  			const block = await blockChain.getBlockByHeight(height)

  			MemPoolObj.removeValidationRequest(address)
  			//block created
  			res.status(201).json(block)
   			}
   		//else {
   		//	throw new Error('The request has not been validated')
   		//}
  	} catch (error) {
		res.status(401).json({
		status: 401,
		message: error.message
	})
	}
 })


 //GET Block endpoint using URL path with block hash parameter. Example URL path http://localhost:8000/stars/hash:hash
 app.get('/stars/hash:hash', async (req, res) => {
 	try {
 		const hash = req.params.hash.slice(1)
 		const response = await blockChain.getBlockByHash(hash)
 		res.send(response)
 	} catch (error) {
 		res.status(404).json({
			status: 404,
			message: 'Block not found'
		})
 	}
 })

 //GET Block endpoint using URL path with wallet address parameter. Example URL path http://localhost:8000/stars/address:address
 app.get('/stars/address:address', async (req, res) => {
 	try {
 		const address = req.params.address.slice(1)
 		const response = await blockChain.getBlocksByAddress(address)
 		res.send(response)
 	} catch (error) {
 		res.status(404).json({
			status: 404,
			message: 'Block not found'
		})
 	}
 })

//GET Block endpoint using URL path with block height parameter. Example URL path http://localhost:8000/block/:height
 app.get('/block/:height', async (req, res) => {
 	try {
 		const blockheight = req.params.height
 		const response = await blockChain.getBlockByHeight(blockheight)
 		res.send(response)
 	} catch (error) {
 		res.status(404).json({
			status: 404,
			message: 'Block not found'
		})
 	}
 })
