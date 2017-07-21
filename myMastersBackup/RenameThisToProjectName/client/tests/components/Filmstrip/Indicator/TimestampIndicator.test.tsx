import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import {
  defaultDimensionsData,
  defaultFilmstripRowData,
  defaultCurrentTime,
} from '../TestData';
import TimestampIndicator from '../../../../src/components/Filmstrip/Indicator/TimestampIndicator';
import { ITimestampIndicator } from '../../../../src/components/Filmstrip/types';

const defaultProps: ITimestampIndicator = {
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
  currentTime: defaultCurrentTime,
};

describe('TimestampIndicator Component Unit Test', () => {
  it('can render TimestampIndicator component', () => {
    const wrapper = shallow(<TimestampIndicator {...defaultProps} />);
    expect(wrapper.type()).to.eql('rect');
    expect(wrapper.props().x).to.eql(498.5);
    expect(wrapper.props().height).to.eql(defaultDimensionsData.generalHeight);
  });

  it('shouldComponentUpdate method', () => {
    const spy = sinon.spy(TimestampIndicator.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(<TimestampIndicator {...defaultProps} />);

    expect(spy.calledOnce).to.equal(false);
    wrapper.setProps(
      {
        ...defaultProps,
        currentTime: 60,
      },
    );
    expect(spy.calledOnce).to.equal(true);
    expect(spy.returnValues[0]).to.equal(true);
    // TODO: NEED TO CHANGE DIMENSION DATA STRUCTURE
    wrapper.setProps(
      {
        ...defaultProps,
        dimensionsData: {
          ...defaultDimensionsData,
          generalHeight: 200,
        },
      },
    );
    expect(spy.calledTwice).to.equal(true);
    expect(spy.returnValues[1]).to.equal(true);
  });

  it('TimestampIndicator will disappear', () => {
    const wrapper = shallow(<TimestampIndicator {...defaultProps} />);
    expect(wrapper.type()).to.eql('rect');
    wrapper.setProps(
      {
        ...defaultProps,
        currentTime: 100,
      },
    );
    expect(wrapper.type()).to.eql(null);
  });
});
