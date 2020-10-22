const is_auth = require ("./middleware/is-auth");
module.exports.set_route = function(app) {
  //not working for those request that contain image
    //app.post('*',
    //  require("./middleware/contentType").check("json"),
    //).put('*',
    //  require("./middleware/contentType").check("json"),
    //);
    app.use('/moneytype',[ is_auth ],require('./routes/money_type'));
    app.use('/expensetype',[is_auth],require('./routes/expense_type'));
    app.use('/incometype',[is_auth],require('./routes/income_type'));
    app.use('/capitaltype',[is_auth],require('./routes/capital_type'));
    app.use('/expense',[is_auth],require('./routes/expense'));
    app.use('/income',[is_auth],require('./routes/income'));
    app.use('/exchange',[is_auth],require('./routes/exchange'));
    app.use('/capital',[is_auth],require('./routes/capital'));
    app.use('/property',[is_auth],require('./routes/property'));
    app.use('/user',[is_auth],require('./routes/user'));
    app.use('/login',[],require('./routes/login'));
}
 