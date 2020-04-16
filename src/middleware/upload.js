const multer = require('multer');

// Especifiando objeto a ser upado
const upload = multer({
    limits:{
        fileSize:1000000,
    },
    fileFilter(req,file,callback){
        if(!file.originalname.match(/\.(png|jpg|jpge)$/)){
             return callback(new Error(" You should upload a jpg,jpge or a png file "))
        }
        callback(undefined,true)
    }
})


module.exports = upload;