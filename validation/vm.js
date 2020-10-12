//validation middleware
const {validationResult}    = require('express-validator');
const needs                 = require("../util/needs");

module.exports.case1=(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(needs.delete_image(req));
        return res.status(422).json({errors: errors.array()});
    }
    next();
}