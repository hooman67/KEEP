import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as chai from 'chai';
import {
  InitTestDatabase,
} from '../tools/InitTestDatabase';
import '../../src/models';
import { IUserLessonSchema } from '../../src/types';

const userLessonModel = mongoose.model('UserLesson');

const expectResult0 = {
  _id: uuid.v4(),
  TimeRange: {start: 0, end: 1},
  Comment: 'ABC',
  Color: 'red',
};
const expectResult1 = {
  _id: uuid.v4(),
  TimeRange: {start: 2, end: 3},
  Comment: 'DEF',
  Color: 'red',
};
const expectResult2 = {
  _id: uuid.v4(),
  TimeRange: {start: 4, end: 5},
  Comment: 'GHI',
  Color: 'red',
};

const chaiHttp = require('chai-http');
const server = require('../../src/server');
const should = chai.should();
chai.use(chaiHttp);

describe('Note API End Point Unit Test', () => {
  describe('GET /lesson/:id/notes', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Invalid Lesson', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000003/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Reject Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Not Subscriber', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          const highlightData = res.body;
          highlightData.should.be.a('array');
          highlightData.length.should.equal(0);
          done();
        });
    });
  });

  describe('POST /lesson/:id/notes', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Invalid Lesson', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000003/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Reject Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Not Subscriber', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Empty Data', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Correct Data Type', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            expectResult0,
            expectResult1,
            expectResult2,
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.Notes.should.be.a('array');
          userLessonQueryData.Notes.length.should.equal(3);
          _.isEqual(userLessonQueryData.Notes[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.Notes[1].toObject(), expectResult1).should.equal(true);
          _.isEqual(userLessonQueryData.Notes[2].toObject(), expectResult2).should.equal(true);
          done();
        });
    });

    it('Reject Request: Student Account & Subscriber & Duplicate UUID', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            {
              _id: expectResult0._id,
              TimeRange: {start: 2, end: 3},
              Color: 'red',
            },
          ],
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Internal Server Error');
          done();
        });
    });

    it('Reject Request: Student Account & Subscriber & Invalid UUID', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            {
              _id: 'abc',
              TimeRange: {start: 2, end: 3},
              Color: 'green',
            },
          ],
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Internal Server Error');
          done();
        });
    });
  });

  describe('DELETE /lesson/:id/notes', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Invalid Lesson', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000003/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Reject Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account & Not Subscriber', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Delete No Data', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          done();
        });
    });

    it('POST Request Populate Data First', (done) => {
      chai.request(server)
        .post('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            expectResult0,
            expectResult1,
            expectResult2,
          ],
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          done();
        });
    });

    it('Reject Request: Student Account & Subscriber & Invalid UUID', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            'abc',
          ],
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Internal Server Error');
          done();
        });
    });

    it('Approve Request: Student Account & Subscriber & Valid UUID', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            expectResult2._id,
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.Notes.should.be.a('array');
          userLessonQueryData.Notes.length.should.equal(2);
          _.isEqual(userLessonQueryData.Notes[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.Notes[1].toObject(), expectResult1).should.equal(true);
          done();
        });
    });

    it('GET Request: Approve Request: Student Account & Subscriber', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          const highlightData = res.body;
          highlightData.should.be.a('array');
          highlightData.length.should.equal(2);
          _.isEqual(highlightData[0], expectResult0).should.equal(true);
          _.isEqual(highlightData[1], expectResult1).should.equal(true);
          done();
        });
    });

    it('Reject Request: Student Account & Subscriber & (Remove All & More)', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001/notes')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .send({
          Notes: [
            expectResult0._id,
            expectResult1._id,
            uuid.v4(),
          ],
        })
        .end(async (err, res) => {
          res.should.have.status(500);
          res.body.message.should.equal('Internal Server Error');
          const userLessonQueryData = <IUserLessonSchema> await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          userLessonQueryData.Notes.should.be.a('array');
          userLessonQueryData.Notes.length.should.equal(2);
          _.isEqual(userLessonQueryData.Notes[0].toObject(), expectResult0).should.equal(true);
          _.isEqual(userLessonQueryData.Notes[1].toObject(), expectResult1).should.equal(true);
          done();
        });
    });
  });

});
