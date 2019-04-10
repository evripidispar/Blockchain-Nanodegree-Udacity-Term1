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

// POST Block endpoint using key/value pair within request body. Example URL path http://localhost:8000/block

 app.post('/block', async (req, res)=> {
 	const body = req.body.body
 	if (body === '') {
 		return res.status(400).json({error: 'cannot create block with empty body string'})
 	}
 	else if (body === undefined){
 		return res.status(400).json({error: 'body parameter is not defined'})
 	}

 	let body = {
 		address: req.body.address,
 		star: {
 			ra: req.body.star.ra,
 			dec: req.body.star.dec,
 			mag: req.body.star.mag,
 			cen: req.body.star.cen,
 			story: new Buffer(req.body.star.story).toString('hex')
 		}
 	}

 	await blockChain.addBlock(new Block(body))
  	const height = await blockChain.getBlockHeight()
  	const block = await blockChain.getBlockByHeight(height)

  	delete mempool[address]
  	//block created
  	res.status(201).json(block)
 })


 //GET Block endpoint using URL path with block hash parameter. Example URL path http://localhost:8000/stars/hash:hash
 app.get('/stars/hash:hash', async (req, res) => {
 	try {
 		const hash = req.params.hash.slice(1)
 		const response = await blockChain.getBlockByHash(hash)
 		res.send(response)
 	}
 	catch (error) {
 		res.status(404).json({
			status: 404
			message: 'Block not found'
		})
 	}
 })

 //GET Block endpoint using URL path with wallet address parameter. Example URL path http://localhost:8000/stars/address:address
 app.get('/stars/address:address', async (req, res) => {
 	try {
 		const address = req.params.address.slice(1)
 		const response = await blockChain.getBlock(address)
 		res.send(response)
 	}
 	catch (error) {
 		res.status(404).json({
			status: 404
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
 	}
 	catch (error) {
 		res.status(404).json({
			status: 404
			message: 'Block not found'
		})
 	}
 })




 



