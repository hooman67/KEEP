import { shallow } from 'enzyme';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  defaultCursorPosition,
  defaultDimensionsData,
  defaultFilmstripRowData,
  defaultThumbnailData,
} from '../TestData';
import ThumbnailCore from '../../../../src/components/Filmstrip/Thumbnail/ThumbnailCore';
import { IThumbnailCore } from '../../../../src/components/Filmstrip/types';

const defaultProps: IThumbnailCore = {
  cursorPosition: { ...defaultCursorPosition, isOutside: true },
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
  thumbnailData: defaultThumbnailData,
  className: 'ThumbnailCore',
};

const expectDefaultResult = [
  'http://videx.ece.ubc.ca/thumbnail/60.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/160.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/260.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/360.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/460.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/560.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/660.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/760.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/860.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/960.jpeg',
];

const expectOnCursorMoveResult = [
  'http://videx.ece.ubc.ca/thumbnail/60.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/160.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/260.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/360.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/460.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/500.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/660.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/760.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/860.jpeg',
  'http://videx.ece.ubc.ca/thumbnail/960.jpeg',
];

describe('ThumbnailCore Component Test', () => {
  it('can render ThumbnailCore component', () => {
    const wrapper = shallow(<ThumbnailCore {...defaultProps} />);
    expect(wrapper.children()).to.have.length(10);
    for (let i = 0; i < 10; i += 1) {
      expect(wrapper.childAt(i).props().src).to.eql(expectDefaultResult[i]);
    }
  });

  it('test cursor movement', () => {
    const wrapper = shallow(<ThumbnailCore {...defaultProps} />);
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
        },
      },
    );
    expect(wrapper.children()).to.have.length(10);
    for (let i = 0; i < 10; i += 1) {
      expect(wrapper.childAt(i).props().src).to.eql(expectOnCursorMoveResult[i]);
    }
  });

  it('should call shouldComponentUpdate on update', () => {
    const spy = sinon.spy(ThumbnailCore.prototype, 'shouldComponentUpdate');
    const wrapper = shallow(<ThumbnailCore {...defaultProps} />);

    expect(spy.calledOnce).to.equal(false);
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
        },
      },
    );
    expect(spy.calledOnce).to.equal(true);
    expect(spy.returnValues[0]).to.equal(true);

    expect(spy.calledTwice).to.equal(false);
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
});
