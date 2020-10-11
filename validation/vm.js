const fs = require('fs');


//validation middleware
const {validationResult} = require('express-validator');

module.exports.case1=(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        try{
            fs.unlinkSync(`${req.file.path}`);
        }catch(err){}
        return res.status(422).json({errors: errors.array()});
    }
    next();
}