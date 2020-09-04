const fs=require("fs");


const comingData=require("../../general/db/return_data").comingData;
const select_query=require("../../general/db/create_query").select_query;

exports.returnInfo=function(req,res){
    json_data=JSON.parse(fs.readFileSync('./general/query/movies/data.json'))["category"];
    const query=select_query(json_data,{});
    comingData(query["sql"],query["prepare"])().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })  
}