const multer = require("multer");
const path = require("path")
const uuid = require("uuid")

const markedAddressUploader=(address)=>{
return multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null, `./uploads/${address}`)
  },
  filename:(req, file, cb)=>{
    const extension = path.parse(file.originalname).ext;
    const randomName = uuid.v4()+extension;
    cb(null, randomName)
  }
})
}
const multerUploader=(address)=>{
  return multer({storage:markedAddressUploader(address)})
}

module.exports = multerUploader
