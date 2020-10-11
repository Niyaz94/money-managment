const multer        = require("multer");
const path          = require("path"); 
const mkdirp        = require('mkdirp')


module.exports.single=(imagePath,filedName)=>{
    const imageUpload = multer({
            storage: multer.diskStorage({
                destination: (req, file, next) => {
                    mkdirp(imagePath).then(made =>{
                        next(null, imagePath)
                    });
                },
                filename: (req, file, next) => {
                    const uniqueSuffix = Date.now()+ Math.round(Math.random() * 1E9)
                    next(null,uniqueSuffix+path.extname(file.originalname))
                }
            }),
            fileFilter: (req, file, next)=>{
                const ext = path.extname(file.originalname)
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
                    return next(new Error('goes wrong on the mimetype'));
                }
                return next(null, true)
            },
            limits: { 
                fileSize: 2*1024 *1024 // 2MB
            }
        }).single(filedName);
        
    return (req, res, next) => {
        imageUpload(req,res,(err)=>{
            if(err){
                return res.status(400).json(err.message)
            }
            next()
        })
    }
    
}