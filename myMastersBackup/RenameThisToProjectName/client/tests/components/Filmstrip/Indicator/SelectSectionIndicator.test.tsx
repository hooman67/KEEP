import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import {
  defaultDimensionsData,
  defaultFilmstripRowData,
  defaultSelectSection,
} from '../TestData';
import SelectSectionIndicator from '../../../../src/components/Filmstrip/Indicator/SelectSectionIndicator';
import { ISelectSectionIndicator } from '../../../../src/components/Filmstrip/types';

const defaultProps: ISelectSectionIndicator = {
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
  selectSection: defaultSelectSection,
};

describe('SelectSectionIndicator Component Unit Test', () => {
  it('can render SelectSectionIndicator component', () => {
    const wrapper = shallow(<SelectSectionIndicator {...defaultProps} />);
    expect(wrapper.type()).to.eql('rect');
    expect(wrapper.props().x).to.eql(250);
    expect(wrapper.props().width).to.eql(250);
  });

  it('shouldComponentUpdate method', () => {
    const spy = sinon.spy(SelectSectionIndicator.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(<SelectSectionIndicator {...defaultProps} />);

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
    wrapper.setProps(
      {
        ...defaultProps,
        selectSection: {
          ...defaultSelectSection,
          selectSectionStartTime: 40,
        },
      },
    );
    expect(spy.calledTwice).to.equal(true);
    expect(spy.returnValues[1]).to.equal(true);
  });

  it('SelectSectionIndicator will disappear', () => {
    const wrapper = shallow(<SelectSectionIndicator {...defaultProps} />);
    wrapper.setProps(
      {
        ...defaultProps,
        selectSection: {
          ...defaultSelectSection,
          status: 'free',
        },
      },
    );
    expect(wrapper.type()).to.eql(null);
  });

  it('SelectSectionIndicator logic test', () => {
    const wrapper = shallow(<SelectSectionIndicator {...defaultProps} />);
    // cases 1
    wrapper.setProps(
      {
        ...defaultProps,
        filmstripRowData: {
          ...defaultFilmstripRowData,
          startTime: 20,
          endTime: 120,
        },
        selectSection: {
          ...defaultSelectSection,
          selectSectionStartTime: 0,
          selectSectionEndTime: 100,
        },
      },
    );
    expect(wrapper.type()).to.eql('rect');
    expect(wrapper.props().x).to.eql(0);
    expect(wrapper.props().width).to.eql(800);

    // cases 2
    wrapper.setProps(
      {
        ...defaultProps,
        filmstripRowData: {
          ...defaultFilmstripRowData,
          startTime: 20,
          endTime: 120,
        },
        selectSection: {
          ...defaultSelectSection,
          selectSectionStartTime: 40,
          selectSectionEndTime: 140,
        },
      },
    );
    expect(wrapper.type()).to.eql('rect');
    expect(wrapper.props().x).to.eql(200);
    expect(wrapper.props().width).to.eql(800);

    // cases 3
    wrapper.setProps(
      {
        ...defaultProps,
        filmstripRowData: {
          ...defaultFilmstripRowData,
          startTime: 20,
          endTime: 120,
        },
        selectSection: {
          ...defaultSelectSection,
          selectSectionStartTime: 140,
          selectSectionEndTime: 160,
        },
      },
    );
    expect(wrapper.type()).to.eql(null);
  });
});
