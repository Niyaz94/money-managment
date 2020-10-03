module.exports.set_route = function(app) {
    app.post('*',
      require("./middleware/contentType").check("json"),
    ).put('*',
      require("./middleware/contentType").check("json"),
    );
    app.use('/moneytype',[],require('./routes/money_type'));
    app.use('/expensetype',[],require('./routes/expense_type'));
    app.use('/incometype',[],require('./routes/income_type'));
    app.use('/capitaltype',[],require('./routes/capital_type'));
    app.use('/expense',[],require('./routes/expense'));
    app.use('/income',[],require('./routes/income'));
    app.use('/exchange',[],require('./routes/exchange'));
    app.use('/capital',[],require('./routes/capital'));
    app.use('/property',[],require('./routes/property'));
}
 