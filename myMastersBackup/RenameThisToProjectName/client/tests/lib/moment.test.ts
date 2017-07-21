import { expect } from 'chai';
import moment from 'moment';

describe('Lib: moment unit test', () => {
  it('moment: convert seconds/HH:MM:SS', () => {
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(30).format('HH:mm:ss')).to.eql('00:00:30');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(59).format('HH:mm:ss')).to.eql('00:00:59');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(60).format('HH:mm:ss')).to.eql('00:01:00');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(3599).format('HH:mm:ss')).to.eql('00:59:59');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(3600).format('HH:mm:ss')).to.eql('01:00:00');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(86400).format('HH:mm:ss')).to.eql('00:00:00');
  });

  it('moment: convert and round seconds/HH:MM:SS', () => {
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(59.9).format('HH:mm:ss')).to.eql('00:00:59');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(3599.9).format('HH:mm:ss')).to.eql('00:59:59');
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(86399.9).format('HH:mm:ss')).to.eql('23:59:59');
  });

  it('moment: time roll over', () => {
    expect(moment('2000-01-01 00:00:00').startOf('day').seconds(86401).format('HH:mm:ss')).to.eql('00:00:01');
  });
});
