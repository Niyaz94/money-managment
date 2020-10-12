const moment = require('moment');
const fs     = require('fs');

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
    static delete_image(req,multi=true,once=true){
        try{
            if(multi==true){
                for (const key in req.files) {
                    for (const second_key in req.files[key]) {
                        fs.unlinkSync(`${req.files[key][second_key]["path"]}`);
                    }
                }
            }
            if(once==true){
                fs.unlinkSync(`${req.file.path}`);
            }
            return true;
        }catch(err){
            return false;
        }
    }
    static delete_old_image(path=[]){
        console.log(path);
        try{
            for (const item of path) {
                console.log(item);
                fs.unlinkSync(`${item}`);
            }
            return true;
        }catch(err){
            return false;
        }
    }
}