const connection=require("./connection");

module.exports.exec=function (sql,condition,numRow=0){
    return function(){
        return new Promise(function(resolve, reject){
            if(numRow==0){
                connection.query(sql,condition, function(err,result, fields){                       
                    if(err){
                        reject(new Error("Something wrong with insertion"));
                    }else{
                        resolve(result);
                    }
                })
            }else if(numRow==1){
                connection.query(sql,condition, function(err,[row], fields){                       
                    if(err){
                        reject(new Error("Something wrong with insertion"));
                    }else{
                        resolve(row);
                    }
                })
            }else if(numRow==2){
                connection.query(sql,condition, function(err,[{total}], fields){                       
                    if(err){
                        reject(new Error("Something wrong with insertion"));
                    }else{
                        resolve(total);
                    }
                })
            }
            
        }
    )}
}
