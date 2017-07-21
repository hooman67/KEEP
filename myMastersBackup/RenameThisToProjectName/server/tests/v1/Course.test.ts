import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as chai from 'chai';
import {
  InitTestDatabase,
} from '../tools/InitTestDatabase';
import '../../src/models';
import {
  ICourseSchema,
  IUserSchema,
  ILessonSchema,
} from '../../src/types';

const courseModel = mongoose.model('Course');
const userModel = mongoose.model('User');
const lessonModel = mongoose.model('Lesson');

const chaiHttp = require('chai-http');
const server = require('../../src/server');
const should = chai.should();
chai.use(chaiHttp);

describe('Course API End Point Unit Test', () => {

  describe('GET /courses', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .get('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Student Account, Return Query Result', (done) => {
      chai.request(server)
        .get('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(2);
          const expectResult0 = {
            _id: '00000000-0000-0001-0000-000000000001',
            Name: 'LWSQU',
            Owner: '00000000-0000-0000-0002-000000000001',
          };
          const expectResult1 = {
            _id: '00000000-0000-0001-0000-000000000002',
            Name: 'JKFQE',
            Owner: '00000000-0000-0000-0002-000000000002',
          };
          _.isEqual(expectResult0, res.body[0]).should.equal(true);
          _.isEqual(expectResult1, res.body[1]).should.equal(true);
          done();
        });
    });

    it('Approve Request: Student Account, Return Empty', (done) => {
      chai.request(server)
        .get('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0001-000000000099')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

  describe('GET /course/:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .get('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: None Subscriber Account', (done) => {
      chai.request(server)
        .get('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000099')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Subscriber Account', (done) => {
      chai.request(server)
        .get('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            courseMetadata: {
              _id: '00000000-0000-0001-0000-000000000001',
              Name: 'LWSQU',
              Owner: '00000000-0000-0000-0002-000000000001',
            },
            courseLessons: [
              {
                _id: '00000000-0001-0000-0000-000000000001',
                Name: 'FHWHZ',
                Summary: 'YFBRF',
                PreviewImages: 'ABCDE',
              },
            ],
          };
          _.isEqual(expectResult, res.body).should.equal(true);
          done();
        });
    });

  });

  describe('PUT /course/:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account Not Owner', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000002')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Teacher Account Owner, No Data Modification', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            _id: '00000000-0000-0001-0000-000000000001',
            Name: 'LWSQU',
            Owner: '00000000-0000-0000-0002-000000000001',
          };
          _.isEqual(res.body, expectResult).should.equal(true);
          done();
        });
    });

    it('Approve Request: Teacher Account Owner, Reject Request To Change Ownership', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .send({Owner: '00000000-0000-0000-0001-000000000001'})
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    it('Approve Request: Teacher Account Owner, Approve Request To Change Ownership', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .send({Owner: '00000000-0000-0000-0002-000000000002', Name: 'LRKCS'})
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            _id: '00000000-0000-0001-0000-000000000001',
            Name: 'LRKCS',
            Owner: '00000000-0000-0000-0002-000000000002',
          };
          _.isEqual(res.body, expectResult).should.equal(true);
          done();
        });
    });

    it('Approve Request: Teacher Account Owner, Approve Request To Change Data', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000002')
        .send({Name: 'LRKCS'})
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            _id: '00000000-0000-0001-0000-000000000001',
            Name: 'LRKCS',
            Owner: '00000000-0000-0000-0002-000000000002',
          };
          _.isEqual(res.body, expectResult).should.equal(true);
          done();
        });
    });

    it('Approve Request: Teacher Account Owner, Reject Request To Change Data', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000002')
        .send({School: 'LRKCS'})
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account Old Owner', (done) => {
      chai.request(server)
        .put('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  });

  describe('DELETE /course/:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .del('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account', (done) => {
      chai.request(server)
        .del('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: None Owner Account', (done) => {
      chai.request(server)
        .del('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000002')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .del('/api/v1/course/00000000-0000-0001-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end(async (err, res) => {
          res.should.have.status(200);
          res.body.message.should.equal('Action Complete');
          const removedCourses = <ICourseSchema> await courseModel.findById('00000000-0000-0001-0000-000000000001');
          _.isEqual(removedCourses, null).should.equal(true);
          const newStudent = <IUserSchema> await userModel.findById('00000000-0000-0000-0001-000000000001').select('_id Courses');
          const newLesson = <ILessonSchema> await lessonModel.findById('00000000-0001-0000-0000-000000000001').select('_id Courses');
          newStudent.Courses.should.be.a('array');
          newLesson.Courses.should.be.a('array');
          newStudent.Courses.length.should.be.equal(1);
          newLesson.Courses.length.should.be.equal(0);
          newStudent.Courses[0].should.equal('00000000-0000-0001-0000-000000000002');
          done();
        });
    });
  });

  describe('POST /courses', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .post('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account', (done) => {
      chai.request(server)
        .post('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account, Name Field Is Not Provided', (done) => {
      chai.request(server)
        .post('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end(async (err, res) => {
          res.should.have.status(400);
          res.body.message.should.equal('Required Fields Are Not Found');
          done();
        });
    });

    it('Approve Request: Teacher Account', (done) => {
      chai.request(server)
        .post('/api/v1/courses')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .send({
          Name: 'EWROS',
        })
        .end(async (err, res) => {
          res.should.have.status(200);
          // Verified Return Result
          const uuid = res.body.UUID;
          const newCourse = <ICourseSchema> await courseModel.findById(uuid);
          newCourse._id.should.equal(uuid);
          newCourse.Name.should.equal('EWROS');
          newCourse.Owner.should.equal('00000000-0000-0000-0002-000000000001');
          newCourse.Subscribers.should.be.a('array');
          newCourse.Subscribers.length.should.be.eql(0);
          newCourse.PlayLists.should.be.a('array');
          newCourse.PlayLists.length.should.be.eql(1);
          newCourse.PlayLists[0].Name.should.equal('default');
          newCourse.PlayLists[0].Lessons.should.be.a('array');
          newCourse.PlayLists[0].Lessons.length.should.equal(0);
          // Verify Updated User Result
          const newUser = <IUserSchema> await userModel.findById('00000000-0000-0000-0002-000000000001');
          (newUser.Courses.includes(uuid)).should.equal(true);
          done();
        });
    });
  });
});
