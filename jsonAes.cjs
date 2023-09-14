
let fs = require('fs');
const { name, version, client } = require('./package');

let CryptoJS = require("crypto-js");

//读取配置文件
let routes = require('./public/cdn/common/routes.json');

routes.appCode = name;
routes.version = version;
routes.client = client;

// console.log(routes);

let key = '1234567890HZINFO1234567890ABCDEF';
let sRoutes =  JSON.stringify(routes);
// console.log("明文:"+sRoutes);
// key = CryptoJS.enc.Hex.parse(key);

key = CryptoJS.enc.Utf8.parse(key)
var encryptedData = CryptoJS.AES.encrypt(sRoutes, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
})
encryptedData = encryptedData.ciphertext.toString()
// console.log("加密后："+encryptedData)


fs.writeFile('./dist/cdn/common/routes.json', encryptedData, 'utf8', function (err) {
  if (err){
    console.log(err)
  }
});
//// 以下是解密的代码
var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData)
// console.log("解密前hex："+encryptedHexStr)
var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
// console.log("解密前："+encryptedBase64Str)

var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
})
var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8)
// console.log("解密后:"+decryptedStr)


