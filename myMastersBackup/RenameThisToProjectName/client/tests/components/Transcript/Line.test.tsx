import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { mount, render, shallow } from 'enzyme';
import Line from '../../../src/components/Transcript/Line';

const minProps = {
  transcriptArr: [
    { formattedTime: '',
      id: 0,
      sentenceArr: [
        { id: 0, text: 'what', start: 32.25, end: 32.5 },
        { id: 1, text: 'is', start: 32.5, end: 32.75 },
        { id: 2, text: 'going', start: 32.75, end: 32.95 },
      ],
      startTime: '0.000',
    },
  ],
  transcript: {
    startTime: '0.1',
    endTime: '0.5',
    id: '0',
  },
  activeVideo: {
    currentTime: '0.3',
  },
};

describe('Transcript: Line Render', () => {
  it('Check Line component render', () => {
    const wrapper = shallow(<Line {...minProps} />);
    expect(wrapper).to.have.length(1);
  });
  it('Check Child components for sentence array', () => {
    const wrapper = shallow(<Line {...minProps} />);
    expect(wrapper.find('span').children()).to.have.length(3);
  });
});
