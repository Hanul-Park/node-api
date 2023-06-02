// 테스트 코드
const request = require('supertest');
const should = require('should');
const app = require('../../');
const models = require('../../models');

describe('GET /users는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공 시', () => {
    it('유저 객체를 담은 배열로 응답한다.', (done) => {
      request(app)
        .get('/users')
        .end((err, res) => {
          res.body.should.be.instanceOf(Array);
          done();
        })
    })
    it('최대 limit 갯수 만큼 응답한다.', (done) => {
      request(app)
        .get('/users?limit=2')
        .end((err, res) => {
          res.body.should.have.lengthOf(2)
          done();
        })
    })
  })

  describe('실패 시', () => {
    it('limit이 숫자형이 아니면 400을 응답한다.', (done)=>{
      request(app)
        .get('/users?limit=two')
        .expect(400)
        .end(done)
    })
  })
})

describe('GET /users/:id 는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공 시', () => {
    it('id가 1인 유저 객체를 반환', (done) => {
      request(app)
        .get('/users/1')
        .end((err, res) => {
          res.body.should.have.property('id', 1);
          done()
        })
    })
  })

  describe('실패 시', () => {
    it('id가 숫자가 아닌 경우 400으로 응답', (done) => {
      request(app)
        .get('/users/one')
        .expect(400)
        .end(done)
    })
    it('id로 유저를 찾을 수 없는 경우 404 응답', (done) => {
      request(app)
        .get('/users/5')
        .expect(404)
        .end(done)
    })
  })
})

describe('DELETE /users/:id 는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공 시', () => {
    it('204를 응답', (done) => {
      request(app)
        .delete('/users/1')
        .expect(204)
        .end(done);
    })
  })
  describe('실패 시', () => {
    it('id가 숫자가 아닌 경우 400을 응답', (done) => {
      request(app)
        .delete('/users/one')
        .expect(400)
        .end(done);
    })
  })
})

describe('POST /users 는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공 시', () => {
    // 테스트 케이스가 동작하기 전에 미리 실행되는 것
    let name = 'daniel', body;
    before(done => {
      request(app)
        .post('/users')
        .send({name: 'daniel'})
        .expect(201)
        .end((err, res) => {
          body = res.body;
          done();
        });
    })
    it('생성 된 유저 객체를 반환한다.', () => {
      body.should.have.property('id')
    })

    it('입력한 name을 반환', () => {
      body.should.have.property('name', name)
    })
  })

  describe('실패 시', () => {
    it('파라미터 누락 시 400 반환', done => {
      request(app)
        .post('/users')
        .send({})
        .expect(400)
        .end(done);
    })
    it('name 중복 시 409 반환', done => {
      request(app)
        .post('/users')
        .send({name: 'daniel'})
        .expect(409)
        .end(done);
    })
  })
})

describe('PUT /users/:id는', () => {
  const users = [{name: 'alice'}, {name: 'bek'}, {name: 'chris'}];
  before(() => models.sequelize.sync({force: true}));
  before(() => models.User.bulkCreate(users));

  describe('성공 시', () => {
    it('변경된 name 응답', done => {
      const name = 'bob';
      request(app)
        .put('/users/2')
        .send({ name: name})
        .end((err, res) => {
          res.body.should.have.property('name', name);
          done();
        })
    })
  })

  describe('실패 시', () => {
    it('id가 숫자가 아닌 경우 400 응답', done => {
      request(app)
        .put('/users/one')
        .expect(400)
        .end(done);
    })
    it('name이 없을 경우 400 응답', done => {
      request(app)
        .put('/users/one')
        .send({})
        .expect(400)
        .end(done);
    })
    it('없는 유저인 경우 404 응답', done => {
      request(app)
        .put('/users/6')
        .send({ name: 'foo' })
        .expect(404)
        .end(done);
    })
    it('이름이 중복인 경우 409 응답', done => {
      request(app)
        .put('/users/2')
        .send({ name: 'chris'})
        .expect(409)
        .end(done);
    })
  })
})
