require('dotenv').config({path:"../.env"});

console.log(process.env.db_name);

process.env.db_name="test";
process.env.db_pass="61#2d2A2j51^_4";
process.env.db_user="local_admin";

const MONEYTYPE     = require('../models/moneyType');
const chai          = require('chai');
const chaiHttp      = require('chai-http');
const server        = require('../bin/www');
const should        = chai.should();

//process.env.db_name = 'test';
chai.use(chaiHttp);

describe('MoneyType', () => {
    //beforeEach((done) => {
        //MONEYTYPE.destroy({
        //    where: {},
        //    truncate: true
        //});
        //MONEYTYPE.sync({ force: true });
        //done();
    //});
    describe('/GET moneyType', () => {
        it('it should GET all money type', (done) => {
            chai.request(server).get('/moneytype').end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(0);
                done();
            });
            //done();
            //MONEYTYPE.create({
            //    name: 'Titolo'
            //}).then( function (moneytype) {
            //    expect(moneytype).to.equal('promise resolved');
            //    done();
            //}).catch(done);;
        });
    });
});