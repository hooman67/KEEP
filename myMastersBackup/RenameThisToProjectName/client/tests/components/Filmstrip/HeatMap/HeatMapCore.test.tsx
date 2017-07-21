import { shallow } from 'enzyme';
import { expect } from 'chai';
import React from 'react';
import {
  defaultCursorPosition,
  defaultDimensionsData,
  defaultFilmstripRowData,
  defaultHeatmapCrowdData,
  defaultHeatmapIndividualData,
} from '../TestData';
import HeatmapCore from '../../../../src/components/Filmstrip/HeatMap/HeatmapCore';
import { IHeatMapCore } from '../../../../src/components/Filmstrip/types';

const defaultProps: IHeatMapCore = {
  cursorPosition: { ...defaultCursorPosition },
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
  heatmapCrowdData: defaultHeatmapCrowdData,
  heatmapIndividualData: defaultHeatmapIndividualData,
  className: 'HeatMapCore',
};

describe('HeatmapCore Component Test', () => {
  it('can render HeatmapCore component without enlarge', () => {
    const wrapper = shallow(<HeatmapCore {...defaultProps} />);
    expect(wrapper.type()).to.eql('div');
    expect(wrapper.props().style).to.eql({ height: 25, width: 1000 });
  });

  it('test HeatmapCore component enlarge & restore', () => {
    const wrapper = shallow(<HeatmapCore {...defaultProps} />);
    // enlarge
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          y: 75.01,
        },
      },
    );
    expect(wrapper.props().style).to.eql({ height: 50, width: 1000 });

    // restore
    wrapper.setProps(
      {
        ...defaultProps,
        cursorPosition: {
          ...defaultCursorPosition,
          y: 49.99,
        },
      },
    );
    expect(wrapper.props().style).to.eql({ height: 25, width: 1000 });
  });
});
