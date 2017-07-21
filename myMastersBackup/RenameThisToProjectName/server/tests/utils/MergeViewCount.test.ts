import * as _ from 'lodash';
import * as chai from 'chai';
import {
  mergeViewCountInterval,
} from '../../src/utils';
import { ISingleViewCount } from '../../src/types/IUserLesson';

const should = chai.should();

describe('MergeViewCout Algorithm Test', () => {
  it('Test 1', (done) => {
    const Data: Array<ISingleViewCount> = [
      <ISingleViewCount> {
        StartTimeStamp: 0,
        EndTimeStamp: Number.MAX_SAFE_INTEGER,
        Counter: 0,
      },
      <ISingleViewCount> {
        StartTimeStamp: 5,
        EndTimeStamp: 15,
        Counter: 5,
      },
      <ISingleViewCount> {
        StartTimeStamp: 5,
        EndTimeStamp: 25,
        Counter: 10,
      },
    ];
    const actualResult = mergeViewCountInterval(Data);
    const expectResult = [
      {
        StartTimeStamp: 0,
        EndTimeStamp: 5,
        Counter: 0,
      },
      {
        StartTimeStamp: 5,
        EndTimeStamp: 15,
        Counter: 15,
      },
      {
        StartTimeStamp: 15,
        EndTimeStamp: 25,
        Counter: 10,
      },
      {
        StartTimeStamp: 25,
        EndTimeStamp: Number.MAX_SAFE_INTEGER,
        Counter: 0,
      },
    ];
    _.isEqual(actualResult, expectResult).should.equal(true);
    done();
  });
});
