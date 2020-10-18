//validation middleware
const {validationResult}    = require('express-validator');

module.exports.case1=(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        const error = new Error(errors.array()[0]["msg"]);
        error.status =422;
        throw error;
    }
    next();
}