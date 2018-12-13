const express = require('express')
const bodyParser = require('body-parser')
const Block = require('./block')
const BlockChain = require('./simpleChain')

const app = express()

// Create the blockchain object
let blockChain = new BlockChain();

app.use(bodyParser.json())

app.get('/', (req, res) => res.status(404).send({error: 'Accepted endpoints: POST /block or GET /block/{Blockheight}'}))


 //GET Block endpoint using URL path with block height parameter. Example URL path http://localhost:8000/block/{Blockheight}
 
 app.get('/block/:Blockheight', async (req, res) => {
 	try {
 		const blockheight = req.params.Blockheight
 		const block = await blockChain.getBlock(blockheight)
 		res.json(block)
 	}
 	catch (error) {
 		res.status(404).json({ error: 'Block could not be found in the blockchain'})
 	}
 })

// POST Block endpoint using key/value pair within request body. Example URL path http://localhost:8000/block

 app.post('/block', async (req, res)=> {
 	const body = req.body.body
 	if (body === '') {
 		return res.status(400).json({ error: 'cannot create block with empty body string'})
 	}
 	else if (body === undefined){
 		return res.status(400).json({error: 'body parameter is not defined'})
 	}

 	await blockChain.addBlock(new Block(body))
  	const height = await blockChain.getBlockHeight()
  	const block = await blockChain.getBlock(height)
  	res.status(201).json(block)
 })

 app.listen(8000, () => console.log('API listening on port 8000'))



