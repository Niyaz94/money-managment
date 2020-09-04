const db_connection=require("./db_connection");

module.exports.comingData=function (sql,condition){
    return function(){
        return new Promise(function(resolve, reject){
            db_connection.query(sql,condition, function(err, rows){                                                
                if(rows === undefined){
                    reject(new Error("Error rows is undefined"));
                }else{
                    resolve(rows);
                }
            }
        )}
    )}
}
