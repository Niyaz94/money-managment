const MONEYTYPE     = require('../models/moneyType');
const chai          = require('chai');
const chaiHttp      = require('chai-http');
const server        = require('../bin/www');
const should        = chai.should();

//process.env.db_name = 'test';
chai.use(chaiHttp);

describe('MoneyType', () => {
    beforeEach((done) => {
        //MONEYTYPE.destroy({
        //    where: {},
        //    truncate: true
        //});
        //MONEYTYPE.sync({ force: true });

    });
    describe('/GET moneyType', () => {
        it('it should GET all money type', (done) => {
            //chai.request(server)
            //    .get('/moneytype')
            //    .end((err, res) => {
            //        res.should.have.status(200);
            //        res.body.should.be.a('array');
            //        res.body.length.should.be.eql(0);
            //    done();
            //});

            MONEYTYPE.create({
                name: 'Titolo'
            }).then( function (moneytype) {
                done();
            });
        });
    });
});