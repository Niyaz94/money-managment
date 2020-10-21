//calling server should be before calling modules
const server            = require('../bin/www');
const chai              = require('chai');
const should            = chai.should();
const chaiHttp          = require('chai-http');

const sequelize         = require('../util/database');
const MONEYTYPE         = require('../models/moneyType');



chai.use(chaiHttp);

describe('MoneyType', () => {
    before(async () => {
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await MONEYTYPE.destroy({force:true,where: {},truncate: true}); 
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
        await MONEYTYPE.create({name: 'niyaz2Fuck'}); 
    });
    describe('/GET moneyType', () => {
        it('it should GET all money type', (done) => {
            chai.request(server).get('/moneytype').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });
});