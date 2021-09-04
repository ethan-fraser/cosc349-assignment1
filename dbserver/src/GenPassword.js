const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// let pswrd = bcrypt.hashSync('54321', 9);
// console.log(pswrd)

function randomString(size = 8) {  
    return crypto
      .randomBytes(size)
      .toString('hex')
      .slice(0, size)
}

console.log(randomString())