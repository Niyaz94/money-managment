//calling server should be before calling modules
const server            = require('../bin/www');
const chai              = require('chai');
const should            = chai.should();
const chaiHttp          = require('chai-http');

const sequelize         = require('../util/database');
const USER              = require('../models/user');
const jwt               = require("jsonwebtoken");
const { Op }            = require("sequelize");

const TEST_USERS =[
    {name: 'test',password: 'SSyAseYAbYA9',cpassword: 'SSyAseYAbYA9',email: 'test@gmail.com'},
    {name: "niyaz",email: "niyaz@gmail.com",password: "12Yt7$sseWq",cpassword: "12Yt7$sseWq"}
]



chai.use(chaiHttp);

describe('MoneyType', () => {
    before(async () => {
        const created=await USER.create(TEST_USERS[0]);
        process.env.TOKEN=jwt.sign(
            {
                "userId":created.id,
                "name":created.name,
                "email":created.email,
                "type":created.type
            },
            process.env.JWT,
            {expiresIn:'1h'}
        );
    });
    //beforeEach is a block of code that is going to run before each the describe blocks on the same level
    beforeEach(async ()=>{
        await USER.destroy({force:true,where:{id:{[Op.gt]:1}}});
    });
    after(async () => {
        //await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
        await USER.destroy({force:true,truncate: true});
        //await sequelize.query('SET FOREIGN_KEY_CHECKS = 1'); 
    });
    describe('/POST User', () => {
        it('it should not POST a User without {name,password,email} fields', (done) => {
            let {email,uncomplete_user} =TEST_USERS[1];
            chai.request(server).post('/user').set({ Authorization: `Bearer ${process.env.TOKEN}` }).send(uncomplete_user).end((err, res) => {
                res.should.have.status(422);
                res.body.should.be.a('object');
                res.body.should.have.property('message').to.be.a('string').satisfy((str)=>(/name|email|password|cpassword/.test(str))?true:false);
                done();
            });
        });
        it('Check if it insert successfully', (done) => {
            chai.request(server).post('/user').set({ Authorization: `Bearer ${process.env.TOKEN}` }).send(TEST_USERS[1]).end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('status').to.be.a('boolean').eql(true)
                res.body.should.have.property('response').to.be.a('string').to.match(/^The new row has been added with id [0-9]+/);
                done();
            });
        });
    });
    describe('/GET All Users', () => {
        it('it should GET all Users', (done) => {
            chai.request(server).get('/user').set({ Authorization: `Bearer ${process.env.TOKEN}` }).end((err, res) => {      
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
                done();
            });
        });
    });
    describe('/GET/:id User', () => {
        it('it should GET a User by the given id', (done) => {
            USER.create(TEST_USERS[1]).then((new_user)=>{
                chai.request(server).get('/user/' + new_user.id).set({ Authorization: `Bearer ${process.env.TOKEN}` }).send(new_user).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('email');
                    res.body.should.have.property('datetime');
                    res.body.should.have.property('status').to.be.oneOf(['active','inactive']);
                    res.body.should.have.property('type').to.be.oneOf(['normal','admin','developer']);
                    res.body.should.have.property('id').eql(new_user.id).to.be.above(0);
                    done();
                });
            }).catch(err=>{console.log(err);});
  
        });
    });   
    describe('/PUT/:id User', () => {
        it('it should UPDATE a User given the id', (done) => {
            USER.create(TEST_USERS[1]).then((new_user)=>{
                chai.request(server).put('/user/' + new_user.id).set({ Authorization: `Bearer ${process.env.TOKEN}` }).send({name: "niyaz5",email: "niyaz5@gmail.com",password: "12Yt7$sseWq",cpassword: "12Yt7$sseWq"}).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('response').eql('This data has been updated successfully!!!');
                    done();
                });
            }).catch(err=>{console.log(err);});
        });
    });
    describe('/DELETE/:id User', () => {
        it('it should DELETE a User given the id', (done) => {
            USER.create(TEST_USERS[1]).then((new_user)=>{
                chai.request(server).delete('/user/' + new_user.id).set({ Authorization: `Bearer ${process.env.TOKEN}` }).end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('response').eql('This data has been deleted successfully!!!');
                    done();
                });
            }).catch(err=>{console.log(err);});
        });
    });
});