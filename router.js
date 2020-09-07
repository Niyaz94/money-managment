module.exports.set_route = function(app) {
    app.use('/moneytype',[],require('./routes/money_type'));
    app.use('/expensetype',[],require('./routes/expense_type'));
    app.use('/incometype',[],require('./routes/income_type'));
    app.use('/capitaltype',[],require('./routes/capital_type'));
    app.use('/expense',[],require('./routes/expense'));
    app.use('/income',[],require('./routes/income'));
}
 