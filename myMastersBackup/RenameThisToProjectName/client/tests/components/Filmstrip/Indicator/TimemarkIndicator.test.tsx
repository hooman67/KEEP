import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import {
  defaultDimensionsData,
  defaultFilmstripRowData,
} from '../TestData';
import TimemarkIndicator from '../../../../src/components/Filmstrip/Indicator/TimemarkIndicator';
import { ITimemarkIndicator } from '../../../../src/components/Filmstrip/types';

const defaultProps: ITimemarkIndicator = {
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
};

describe('TimemarkIndicator Component Unit Test', () => {
  it('can render TimemarkIndicator component', () => {
    const wrapper = shallow(<TimemarkIndicator {...defaultProps} />);
    expect(wrapper.type()).to.eql('svg');
    expect(wrapper.childAt(0).type()).to.eql('text');
    expect(wrapper.childAt(1).type()).to.eql('text');
    expect(wrapper.children()).to.have.length(2);
  });

  it('shouldComponentUpdate method', () => {
    const spy = sinon.spy(TimemarkIndicator.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(<TimemarkIndicator {...defaultProps} />);

    // TODO: NEED TO CHANGE DIMENSION DATA STRUCTURE
    expect(spy.calledOnce).to.equal(false);
    wrapper.setProps(
      {
        ...defaultProps,
        dimensionsData: {
          ...defaultDimensionsData,
          generalHeight: 200,
        },
      },
    );
    expect(spy.calledOnce).to.equal(true);
    expect(spy.returnValues[0]).to.equal(true);

    // TODO: NEED TO CHANGE DIMENSION DATA STRUCTURE
    expect(spy.calledTwice).to.equal(false);
    wrapper.setProps(
      {
        ...defaultProps,
        filmstripRowData: {
          ...defaultFilmstripRowData,
          startTime: 0,
          endTime: 200,
        },
      },
    );
    expect(spy.calledTwice).to.equal(true);
    expect(spy.returnValues[1]).to.equal(true);
  });
});
