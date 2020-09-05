const connection=require("./connection");

module.exports.exec=function (sql,condition){
    return function(){
        return new Promise(function(resolve, reject){
            connection.query(sql,condition, function(err, result){                       
                if(err){
                    reject(new Error("Something wrong with insertion"));
                }else{
                    resolve(result);
                }
            }
        )}
    )}
}
