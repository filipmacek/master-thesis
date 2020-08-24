const forge = require('node-forge')
const doubleHash = (input) =>{

    //1.hash
    var md1 = forge.md.sha256.create()
    md1.update(input)
    const hash1= md1.digest().toHex()
//2.hash
    var md2 = forge.md.sha256.create()
    md2.update(hash1)
    const hash2 = md2.digest().toHex()
    console.log("Hash2:  ",hash2)

    return hash2
}
module.exports = {
    doubleHash
}

