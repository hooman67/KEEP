import { shallow } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';
import React from 'react';
import {
  defaultCursorPosition,
  defaultDimensionsData,
  defaultFilmstripRowData,
} from '../TestData';
import MouseIndicator from '../../../../src/components/Filmstrip/Indicator/MouseIndicator';
import { IMouseIndicator } from '../../../../src/components/Filmstrip/types';

const defaultProps: IMouseIndicator = {
  cursorPosition: defaultCursorPosition,
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
};

describe('MouseIndicator Component Unit Test', () => {
  it('can render MouseIndicator component', () => {
    const wrapper = shallow(<MouseIndicator {...defaultProps} />);
    expect(wrapper.type()).to.eql('svg');
    expect(wrapper.childAt(0).type()).to.eql('rect');
    expect(wrapper.childAt(1).type()).to.eql('text');
    expect(wrapper.children()).to.have.length(2);
  });

  it('shouldComponentUpdate method', () => {
    const spy = sinon.spy(MouseIndicator.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(<MouseIndicator {...defaultProps} />);

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

    expect(spy.calledTwice).to.equal(false);
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          isOutside: true,
        },
      },
    );
    expect(spy.calledTwice).to.equal(true);
    expect(spy.returnValues[1]).to.equal(true);
  });

  it('MouseIndicator will disappear', () => {
    const wrapper = shallow(<MouseIndicator {...defaultProps} />);
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          isOutside: true,
        },
      },
    );
    expect(wrapper.type()).to.eql(null);
  });
});
