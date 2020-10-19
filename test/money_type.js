//calling server should be before calling modules
const server        = require('../bin/www');
require('dotenv').config({path: __dirname + '/.env.test'})

const MONEYTYPE     = require('../models/moneyType');


const chai          = require('chai');
const should        = chai.should();

const chaiHttp      = require('chai-http');



chai.use(chaiHttp);

describe('MoneyType', () => {
    beforeEach(async (done) => {
        //try {
            //await MONEYTYPE.destroy({where: {},truncate: true});
            //await MONEYTYPE.sync({ force: true });
            await MONEYTYPE.destroy({
                force: true,
                //truncate : true, 
                //cascade: false
            })
            //await MONEYTYPE.create({name: 'Titolo3'});
            done();
        //}catch(err){
        //    console.log("Hi");
        //    done();
        //}
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