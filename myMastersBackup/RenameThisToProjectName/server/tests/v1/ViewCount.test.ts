import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as chai from 'chai';
import {
  InitTestDatabase,
} from '../tools/InitTestDatabase';
import '../../src/models';
import {
  IUserLessonSchema,
  ISingleViewCount,
} from '../../src/types';

const userLessonModel = mongoose.model('UserLesson');
const chaiHttp = require('chai-http');
const server = require('../../src/server');
const should = chai.should();
chai.use(chaiHttp);

const expectResult0 = <ISingleViewCount> {
  StartTimeStamp: 0,
  EndTimeStamp: 100,
  Counter: 10,
};

const expectResult1 = <ISingleViewCount> {
  StartTimeStamp: 100,
  EndTimeStamp: 110,
  Counter: 10,
};

const expectResult2 = <ISingleViewCount> {
  StartTimeStamp: 150,
  EndTimeStamp: 160,
  Counter: 100,
};

const expectResult3 = <ISingleViewCount> {
  StartTimeStamp: 155,
  EndTimeStamp: 165,
  Counter: 100,
};

describe('ViewCount API End Point Unit Test', () => {
  describe('POST /lesson/:id/viewcounts', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Invalid Lesson', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000003/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Reject Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Not Subscriber', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Empty Data', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Valid Data', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          ViewCounts: [
            {
              StartTimeStamp: 0,
              EndTimeStamp: 100,
              Counter: 10,
            },
            {
              StartTimeStamp: 100,
              EndTimeStamp: 110,
              Counter: 10,
            },
            {
              StartTimeStamp: 150,
              EndTimeStamp: 160,
              Counter: 100,
            },
            {
              StartTimeStamp: 155,
              EndTimeStamp: 165,
              Counter: 100,
            },
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.ViewCounts.New.should.be.a('array');
          userLessonQueryData.ViewCounts.New.length.should.equal(4);
          _.isEqual(userLessonQueryData.ViewCounts.New[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[1].toObject(), expectResult1).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[2].toObject(), expectResult2).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[3].toObject(), expectResult3).should.equal(true);
          done();
        });
    });

    it('Reject Request: Student Account & Subscriber & Invalid Data', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          ViewCounts: [
            {
              Counter: 10,
            },
            {
              TimeStamp: 0,
            },
            {
              TimeStamp: 0,
              Length: 12,
              Counter: 123,
            },
            {
              Counter: 123,
            },
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Internal Server Error');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.ViewCounts.New.should.be.a('array');
          userLessonQueryData.ViewCounts.New.length.should.equal(4);
          _.isEqual(userLessonQueryData.ViewCounts.New[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[1].toObject(), expectResult1).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[2].toObject(), expectResult2).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[3].toObject(), expectResult3).should.equal(true);
          done();
        });
    });
  });

  describe('get /lesson/:id/viewcounts', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Invalid Lesson', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000003/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Reject Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Not Subscriber', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Empty Result', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          const expectResult =  [
            {
            'Counter': 0,
            'EndTimeStamp': 9007199254740991,
            'StartTimeStamp': 0,
            },
          ];
          _.isEqual(res.body,  expectResult).should.equal(true);
          done();
        });
    });

    it('POST Request Populate Data First', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          ViewCounts: [
            {
              StartTimeStamp: 0,
              EndTimeStamp: 100,
              Counter: 10,
            },
            {
              StartTimeStamp: 100,
              EndTimeStamp: 110,
              Counter: 10,
            },
            {
              StartTimeStamp: 150,
              EndTimeStamp: 160,
              Counter: 100,
            },
            {
              StartTimeStamp: 155,
              EndTimeStamp: 165,
              Counter: 100,
            },
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.ViewCounts.New.should.be.a('array');
          userLessonQueryData.ViewCounts.New.length.should.equal(4);
          _.isEqual(userLessonQueryData.ViewCounts.New[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[1].toObject(), expectResult1).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[2].toObject(), expectResult2).should.equal(true);
          _.isEqual(userLessonQueryData.ViewCounts.New[3].toObject(), expectResult3).should.equal(true);
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/viewcounts')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          const expectResult =  [
            {
              'StartTimeStamp': 0,
              'EndTimeStamp': 110,
              'Counter': 10,
            },
            {
              'StartTimeStamp': 110,
              'EndTimeStamp': 150,
              'Counter': 0,
            },
            {
              'StartTimeStamp': 150,
              'EndTimeStamp': 155,
              'Counter': 100,
            },
            {
              'StartTimeStamp': 155,
              'EndTimeStamp': 160,
              'Counter': 200,
            },
            {
              'StartTimeStamp': 160,
              'EndTimeStamp': 165,
              'Counter': 100,
            },
            {
              'StartTimeStamp': 165,
              'EndTimeStamp': Number.MAX_SAFE_INTEGER,
              'Counter': 0,
            },
          ];
          _.isEqual(res.body,  expectResult).should.equal(true);
          done();
        });
    });
  });
});
