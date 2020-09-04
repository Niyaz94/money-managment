module.exports.check_requist_method =function (request_method="POST"){
    if(request_method=="POST"){
        return  function(req,res,next) {
            if (req.method!=request_method){
                res.status(400).json({"response":"this page not found!!!"});
            }else{
                next();
            }
        };
    }
}