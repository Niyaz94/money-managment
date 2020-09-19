const moment = require('moment');

module.exports=class needs {
    constructor (){

    }
    static isDate (date){
        return moment(date, "YYYY-MM-DD", true).isValid();
    }
    static is_object(variable){
        return variable!==null && variable.constructor.name==="Object";
    }
    static empty_object(variable){
        return variable.constructor.name==="Object"  && Object.keys(variable).length === 0;
    }
    static is_set(variable){
        return typeof variable !== 'undefined';
    }
}