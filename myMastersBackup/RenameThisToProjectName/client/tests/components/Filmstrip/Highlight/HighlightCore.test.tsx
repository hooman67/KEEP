import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import {
  defaultCursorPosition,
  defaultDimensionsData,
  defaultFilmstripRowData,
  defaultHighlightData,
  onHighlightFilmstripPlayHighlight,
} from '../TestData';
import HighlightCore from '../../../../src/components/Filmstrip/Highlight/HighlightCore';
import { IHighlightCore } from '../../../../src/components/Filmstrip/types';

const defaultProps: IHighlightCore = {
  cursorPosition: {...defaultCursorPosition, isOutside: true},
  dimensionsData: defaultDimensionsData,
  filmstripRowData: {
    ...defaultFilmstripRowData,
    startTime: 20,
    endTime: 120,
  },
  highlightData: defaultHighlightData,
  onHighlightFilmstripPlayHighlight,
  className: 'HighlightCore',
};

const expectResult = [
  {x: 0, y: 0, width: 300, height: 1 / 30 * 100, fill: 'red'},
  {x: 400, y: 0, width: 100, height: 1 / 30 * 100, fill: 'red'},
  {x: 600, y: 0, width: 400, height: 1 / 30 * 100, fill: 'red'},
  {x: 0, y: 4 / 30 * 100, width: 300, height: 1 / 30 * 100, fill: 'green'},
  {x: 400, y: 4 / 30 * 100, width: 100, height: 1 / 30 * 100, fill: 'green'},
  {x: 600, y: 4 / 30 * 100, width: 400, height: 1 / 30 * 100, fill: 'green'},
];

describe('HighlightCore Component Test', () => {
  it('can render HighlightCore component without enlarge', () => {
    const wrapper = shallow(<HighlightCore {...defaultProps} />);
    expect(wrapper.type()).to.eql('svg');
    expect(wrapper.children()).to.have.length(6);
    for (let i = 0; i < 6; i += 1) {
      expect(wrapper.childAt(i).props().x).equal(expectResult[i].x);
      expect(wrapper.childAt(i).props().y).equal(expectResult[i].y);
      expect(wrapper.childAt(i).props().width).equal(expectResult[i].width);
      expect(wrapper.childAt(i).props().height).equal(expectResult[i].height);
      expect(wrapper.childAt(i).props().fill).equal(expectResult[i].fill);
    }
  });

  it('test HighlightCore component enlarge & restore', () => {
    const wrapper = shallow(<HighlightCore {...defaultProps} />);
    // enlarge
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          y: 24.99,
        },
      },
    );
    expect(wrapper.children()).to.have.length(6);
    for (let i = 0; i < 6; i += 1) {
      expect(wrapper.childAt(i).props().x).equal(expectResult[i].x);
      expect(wrapper.childAt(i).props().y).equal(expectResult[i].y * 2);
      expect(wrapper.childAt(i).props().width).equal(expectResult[i].width);
      expect(wrapper.childAt(i).props().height).equal(expectResult[i].height * 2);
      expect(wrapper.childAt(i).props().fill).equal(expectResult[i].fill);
    }
    // restore
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          y: 50.01,
        },
      },
    );
    for (let i = 0; i < 6; i += 1) {
      expect(wrapper.childAt(i).props().x).equal(expectResult[i].x);
      expect(wrapper.childAt(i).props().y).equal(expectResult[i].y);
      expect(wrapper.childAt(i).props().width).equal(expectResult[i].width);
      expect(wrapper.childAt(i).props().height).equal(expectResult[i].height);
      expect(wrapper.childAt(i).props().fill).equal(expectResult[i].fill);
    }
  });
});
