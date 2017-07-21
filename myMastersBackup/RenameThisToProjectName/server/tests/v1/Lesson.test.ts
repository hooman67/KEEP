import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import * as chai from 'chai';
import {
  InitTestDatabase,
} from '../tools/InitTestDatabase';
import '../../src/models';
import {
  ICourseSchema,
} from '../../src/types';

const courseModel = mongoose.model('Course');
const userLessonModel = mongoose.model('UserLesson');

const chaiHttp = require('chai-http');
const server = require('../../src/server');
const should = chai.should();
chai.use(chaiHttp);

describe('Lesson API End Point Unit Test', () => {

  describe('GET /lesson:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: None Subscriber Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000099')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Subscriber Account', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end(async (err, res) => {
          try {
            res.should.have.status(200);
            const expectResult = {
              ID: '00000000-0001-0000-0000-000000000001',
              Name: 'FHWHZ',
              Owner: '00000000-0000-0000-0002-000000000001',
              Summary: 'YFBRF',
              Status: 'Ready',
              ReleaseDate: new Date(2017, 1, 2).toISOString(),
              Video: {
                StreamingManifestUrl: 'YPITH',
                DownloadUrl: 'PBKRB',
              },
              Transcript: 'PRBAH',
              PreviewImages: 'ABCDE',
            };

            console.log('Expected: ');
            console.log(expectResult);
            console.log('Actual:');
            console.log(res.body);

            _.isEqual(expectResult, res.body).should.equal(true);
            // Verify Course Data is Correct
            const newCourse = <ICourseSchema> await courseModel.findById('00000000-0000-0001-0000-000000000001');
            newCourse.PlayLists.should.be.a('array');
            newCourse.PlayLists.length.should.equal(1);
            newCourse.PlayLists[0].Name.should.equal('default');
            newCourse.PlayLists[0].Lessons.should.be.a('array');
            newCourse.PlayLists[0].Lessons.length.should.equal(1);
            newCourse.PlayLists[0].Lessons[0].should.equal('00000000-0001-0000-0000-000000000001');
            done();
          } catch (error) {
            done(error);
          }
        });
    });
  });

  describe('PUT /lesson:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account Not Owner', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000002')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Teacher Account Owner & No Modification', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            ID: '00000000-0001-0000-0000-000000000001',
            Name: 'FHWHZ',
            Owner: '00000000-0000-0000-0002-000000000001',
            Summary: 'YFBRF',
            Status: 'Ready',
            ReleaseDate: new Date(2017, 1, 2).toISOString(),
            Video: {
              StreamingManifestUrl: 'YPITH',
              DownloadUrl: 'PBKRB',
            },
            Transcript: 'PRBAH',
            PreviewImages: 'ABCDE',
          };
          _.isEqual(expectResult, res.body).should.equal(true);
          done();
        });
    });

    it('Reject Request: Teacher Account Owner & Illegal Modification', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .send({Owner: '00000000-0000-0000-0002-000000000002'})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });

    it('Approve Request: Teacher Account Owner & With Modifications', (done) => {
      chai.request(server)
        .put('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .send({ Name: 'DASFL', Summary: 'EDCBA', Transcript: 'ABCDE' })
        .end((err, res) => {
          res.should.have.status(200);
          const expectResult = {
            ID: '00000000-0001-0000-0000-000000000001',
            Name: 'DASFL',
            Owner: '00000000-0000-0000-0002-000000000001',
            Summary: 'EDCBA',
            Status: 'Ready',
            ReleaseDate: new Date(2017, 1, 2).toISOString(),
            Video: {
              StreamingManifestUrl: 'YPITH',
              DownloadUrl: 'PBKRB',
            },
            Transcript: 'ABCDE',
            PreviewImages: 'ABCDE',
          };
          _.isEqual(expectResult, res.body).should.equal(true);
          done();
        });
    });
  });

  describe('DELETE /lesson:id', () => {
    before((done) => {
      InitTestDatabase(done);
    });

    it('Reject Request: Empty Account', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000003')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Student Account', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000099')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Subscriber Account', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Reject Request: Teacher Account Not Owner', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000002')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.message.should.equal('Unauthorized Access');
          done();
        });
    });

    it('Approve Request: Teacher Account Owner', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end(async (err, res) => {
          res.should.have.status(200);
          const newCourse = <ICourseSchema> await courseModel.findById('00000000-0000-0001-0000-000000000001');
          newCourse.PlayLists.should.be.a('array');
          newCourse.PlayLists.length.should.equal(1);
          newCourse.PlayLists[0].Name.should.equal('default');
          newCourse.PlayLists[0].Lessons.should.be.a('array');
          newCourse.PlayLists[0].Lessons.length.should.equal(0);
          const userLessonData = await userLessonModel.findById('0b2d6f0734391d7ca8794c413c0c1ffba65411721473fb466757a51d390a4e10');
          _.isEqual(userLessonData, null).should.equal(true);
          done();
        });
    });

    it('GET Test: Reject Request: Old Subscriber Cannot Access The Content', (done) => {
      chai.request(server)
        .get('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0001-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });

    it('GET Test: Reject Request: Old Owner Cannot Access The Content', (done) => {
      chai.request(server)
        .del('/api/v1/lesson/00000000-0001-0000-0000-000000000001')
        .set('UserUUID', '00000000-0000-0000-0002-000000000001')
        .end((err, res) => {
          res.should.have.status(404);
          res.body.message.should.equal('Resource Not Found');
          done();
        });
    });
  });
});
