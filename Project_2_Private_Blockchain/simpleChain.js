/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);


/* ===== Block Class ==============================
|  Class with a constructor for block          |
|  ===============================================*/

class Block{
  constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain    |
|  ================================================*/

class Blockchain{
  constructor(){
    this.getBlockHeight().then((height)=>{
      //Add Genesis Block
      if (height === -1){
        this.addBlock(new Block("First block in the chain - Genesis block")).then(() =>
          console.log('Genesis Block Added'));
      }   
    })
  }

  // Add new block
  async addBlock(newBlock){
    this.getBlockHeight().then((height)=>{
      newBlock.height = height + 1;
    })
    // Block height
    console.log('Block Height:'+ newBlock.height);
    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3);
    console.log('Block Timestamp:'+ newBlock.time)
    // previous block hash
    if(newBlock.height>0){
      const previousBlock = await this.getBlock(height);
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
          if (err) return console.log('Not found Block#'+ key);
          resolve(value);
        });
      });
    }

    // validate block
    async validateBlock(blockHeight){
      // get block object
      let block = await this.getBlock(blockHeight);
      // get block hash
      let blockHash = block.hash;
      // remove block hash to test block integrity
      block.hash = '';
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString();
      // Compare
      if (blockHash===validBlockHash) {
          return true;
        } else {
          console.log('Block #'+blockHeight+' invalid hash:\n'+blockHash+'<>'+validBlockHash);
          return false;
        }
    }

   // Validate blockchain
    async validateChain(){
      let errorLog = [];

      const height = await this.getBlockHeight();

      for (var i = 0; i < height; i++) {
        // validate block
        this.getBlock(i).then((block)=>{
          if (!this.validateBlock(i))errorLog.push(i);
          // compare blocks hash link
          let blockHash = block.hash;
          let nextBlock = await this.getBlock(i+1);
          let previousHash = nextBlock.previousBlockHash;
          if (blockHash!==previousHash) {
            errorLog.push(i);
          }
        })
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
