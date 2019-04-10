/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);
const Block = require('./block');



/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  constructor(){
    this.getBlockHeight().then((height)=>{
      //Add Genesis Block
      if (height === -1){
        this.addBlock(new Block("First block in the chain - Genesis block")).then(() =>
          console.log('Genesis Block'));
      }   
    })
  }

  // Add new block
  async addBlock(newBlock){
    let height = await this.getBlockHeight()
    //this.getBlockHeight().then((height)=>{
    newBlock.height = height + 1;
    //})
    // Block height
    console.log('Block Height:'+ newBlock.height);
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    console.log('Block Timestamp:'+ newBlock.time)
    // previous block hash
    if(newBlock.height>0){
      const previousBlock = JSON.parse(await this.getBlock(height));
      newBlock.previousBlockHash = previousBlock.hash;
      console.log('Previous Hash:'+ previousBlock.hash);
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
    console.log('Block Hash:' + newBlock.hash)
    // Adding block object to chain
    await this.addBlockDB(newBlock.height, JSON.stringify(newBlock));
  }

  // Get block height (modified with promise)
    getBlockHeight(){
      return new Promise(function(resolve,reject){
        let i = -1;
        db.createReadStream().on('data',function(data) {
          i++;
        })
        .on('error', function(err){
          console.log('Unable to read Data Stream', err);
          reject(err);
        })
        .on('close', function(){
          resolve(i);
        });
      });
    }

    // get block (modified with promise)
    getBlock(key){
      return new Promise((resolve,reject) => {
        db.get(key, function(err,value){
          if (err) {
            reject(err);
            return console.log('Not found Block#'+ key);
          }
          else{
            resolve(value);
          }          
        });
      });
    }

    //get block by height (added for Web API GET endpoint), JSON response
    getBlockByHeight(key){
      return new Promise((resolve, reject)=>{
        db.get(key, function(err, value){
          //if (value === undefined){
          //  return reject('Not found Block#'+key)
          //}
          if (err){
            reject(err)
            return console.log('Not found Block#'+ key);
          }
          else{
            value =JSON.parse(value)
            if (parseInt(key) > 0) {
              value.body.star.storyDecoded = new Buffer(value.body.star.story, 'hex').toString()
            }
            return resolve(value)
          }
        })
      })
    }

    //get block by Hash (added for Web API GET endpoint), JSON response
    getBlockByHash(hash){
      let block
      return new Promise((resolve,reject) => {
        db.createReadStream().on('data', function(data){
          block = JSON.parse(data.value)

          if (block.hash === hash){
            //Check if not Genesis Block
            if (parseInt(data.key)>0){
              block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
              return resolve(block)
            }
            else {
              return resolve(block)
            }
          }
        })
        .on('error', function(err){
          console.log('Unable to read Data Stream', err);
          return reject(err)
        })
        .on('close', function(){
          return reject('Not found')
        })
      })
    }

    //get block by Address (added for Web API GET endpoint), JSON response
    getBlocksByAddress(address){
      const blocks = []
      let block
      return new Promise((resolve,reject) => {
        db.createReadStream().on('data', function(data){
            
            //Check not Genesis Block
            if (parseInt(data.key)>0){
              block = JSON.parse(data.value)

              if (block.body.address === address){
                block.body.star.storyDecoded = new Buffer(block.body.star.story, 'hex').toString()
                blocks.push(block)
              }
            }
          })
        .on('error', function(err){
          console.log('Unable to read Data Stream', err);
          return reject(err)
        })
        .on('close', function(){
          return resolve(blocks)
        })
      })
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = JSON.parse(await this.getBlock(blockHeight));
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = "";
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
          //console.log('Valid Block Comparison');
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    async validateChain(){
      let errorLog = [];
      let height = await this.getBlockHeight();
      let previousHash = "";

      for (var i = 0; i <= height; i++) {
        // validate block
        let block = JSON.parse(await this.getBlock(i));
        //this.getBlock(i).then((block)=>{
          //let blockJson = JSON.parse(block);
        if (!this.validateBlock(i))errorLog.push(i);
        if (block.previousBlockHash!=previousHash) {
          errorLog.push(i);
        }
        previousHash = block.hash;
      }  
        if (errorLog.length>0) {
            console.log('Block errors = ' + errorLog.length);
            console.log('Blocks: '+ errorLog);
        } else {
            console.log('No errors detected');
        }
    }


  //Level DB functions
  // Add data to levelDB with key/value pair
    addBlockDB(key,value){
      return new Promise(function(resolve,reject){
        db.put(key, value, function(err) {
          if (err) {
            console.log('Block ' + key + ' submission failed', err);
            reject(err);
          }
          else{
            console.log('Added block #'+ key)
            resolve();
          }
        })
      });
    }
}

/*let myBlockChain = new Blockchain();

(function theLoop (i) {
    setTimeout(function () {
        let blockTest = new Block("Test Block - " + (i + 1));
        myBlockChain.addBlock(blockTest).then((result) => {
            //console.log(result);
            i++;
            if (i < 10) theLoop(i);
        });
    }, 200);
  })(0);


setTimeout(() => myBlockChain.validateChain(), 5000)*/

module.exports = Blockchain
