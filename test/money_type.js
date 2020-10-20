//calling server should be before calling modules
const server            = require('../bin/www');
const sequelize         = require('../util/database');

//require('dotenv').config({path: __dirname + '/.env.test'})
const MONEYTYPE     = require('../models/moneyType');


const chai          = require('chai');
const should        = chai.should();

const chaiHttp      = require('chai-http');



chai.use(chaiHttp);

describe('MoneyType', () => {
    before(async (done) => {
        try {
            await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', null, { raw: true });
            await MONEYTYPE.sync({force:true}).then(async data=>{
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
                await MONEYTYPE.create({name: 'Titolo1'});
            }).catch(done);

            //await MONEYTYPE.destroy({where: {},truncate: true});
            //await MONEYTYPE.sync({ force: true });
            //MONEYTYPE.sync({ force: true });
            //await MONEYTYPE.destroy({
            //    force: true,
            //    //truncate : true, 
            //    //cascade: false
            //});
            done();
        }catch(err){
            done();
        }
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