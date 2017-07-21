import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';
import Index from '../../../src/components/Transcript/Index';

const minProps = {
  formattedTime: 8,
  onCommonTranscriptSeek: () => {},
  startTime: 9,
};

describe('Transcript Component tests', () => {
  it('Check Index component render', () => {
    const wrapper = shallow(<Index {...minProps} />);
    expect(wrapper).to.have.length(1);
  });
  it('Check time render', () => {
    const wrapper = shallow(<Index {...minProps} />);
    expect(wrapper.find('button').text()).to.eq('[8]');
  });
  it('Check Indexing in transcript', () => {
    const seekVideo = sinon.spy(Index.prototype, 'seekVideo');
    const wrapper = shallow(<Index {...minProps} />);
    // wrapper.setProps(
    //   {
    //     ...minProps,
    //     onCommonTranscriptSeek: () => {},
    //   },
    // );
    expect(seekVideo.calledOnce).to.equal(false);
    wrapper.find('button').simulate('click');
    expect(seekVideo.calledOnce).to.equal(true);
  });
});

