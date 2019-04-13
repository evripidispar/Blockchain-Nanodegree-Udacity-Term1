const bitcoinMessage = require('bitcoinjs-message')
const TimeoutRequestsWindowTime = 5*1000

class Mempool{
	constructor(mempool, timeoutRequests, mempoolValid) {
		this.mempool = mempool;
		this.timeoutRequests = timeoutRequests;
		this.mempoolValid = mempoolValid;
	}

	AddRequestValidation(address){
		let timestamp = Date.now()
		let message = `${address}:${timestamp}:starRegistry`
		let validationWindow = TimeoutRequestsWindowTime/1000

		const requestObject = {
			walletAddress: address,
			requestTimeStamp: timestamp,
			validationWindow: validationWindow,
			message: message
		}

		//Add request validation (new or update existing that have not timeout)
		if((!this.mempool.hasOwnProperty(address)) || ((this.mempool.hasOwnProperty(address)) && (this.isExpired(address)))){
			console.log('Add new request')
			this.mempool[address] = {message, timestamp}
			console.log(this.mempool[address])
			//delete this.mempool[address]
			//this.timeoutRequests[address] = setTimeout(function(){delete this.mempool[address]}, TimeoutRequestsWindowTime)
			return requestObject
		}
		else {
			let timeElapse = Date.now() - this.mempool[address].timestamp
			let timeLeft = Math.floor((TimeoutRequestsWindowTime-timeElapse)/1000)
			//this.mempool[address].validationWindow = timeLeft
			requestObject.validationWindow = timeLeft
			console.log('existing request')
			return requestObject
		}
	}

	validateRequestByWallet(address, signature){
		if((mempool.hasOwnProperty(address)) && (!this.isExpired(address))){
		let status = {
			address: address,
			requestTimeStamp: mempool[address].timestamp,
			message: mempool
		}

		}
	}

	removeValidationRequest(address){
		delete this.mempool[address]
		console.log('Timeout of validation request from address:' + address)
	}

	isExpired(address){
		let validationStartTimer = Date.now() - TimeoutRequestsWindowTime
		if (this.mempool[address].timestamp < validationStartTimer){
			return true
		}
		else { 
			return false
		}
	}
}

module.exports = Mempool