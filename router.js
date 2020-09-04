
//const systemLogRouter = require('./routes/system_log');
module.exports.set_route = function(app) {
    app.use('/banners',[
        require("./middleware/general/check_requist_method").check_requist_method("POST"),
        require("./middleware/general/check_requist_content_type").check_requist_content_type("json"),
    ],require('./routes/banners'));

    app.use('/movies',[
        require("./middleware/general/check_requist_method").check_requist_method("POST"),
        require("./middleware/general/check_requist_content_type").check_requist_content_type("json"),
    ],require('./routes/movies'));


    //app.use("/systemlog",passport.authenticate('jwt', {session: false}),systemLogRouter);
}
 