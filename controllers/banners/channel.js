const fs=require("fs");


const comingData=require("../../general/db/return_data").comingData;
const select_query=require("../../general/db/create_query").select_query;


exports.returnInfo=function (req,res){
    if (typeof req.body.id === 'undefined') {
        res.status(400).json({"response":"The request does not contain enough data to process!!!"});
        // the variable is defined
        return;
    }else if(isNaN(req.body.id) || req.body.id <1){
        res.status(400).json({"response":"The coming data uncorrect!!!"});
        return;
    }
    json_data=JSON.parse(fs.readFileSync('./general/query/data.json'))["banner_channel"];
    const query=select_query(json_data,{"id":req.body.id});
    comingData(query["sql"],query["prepare"])().then(function(results){
        res.status(200).json(results);
    }).catch(function(err){
        res.status(400).json("something wrong with database");
    })  
}