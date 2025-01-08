const mongoose = require("mongoose")

exports.shapeMongooseObjectId=(id)=>{
    if(typeof id ==="string"){
        return new mongoose.Types.ObjectId(id)
    }
    return id
}