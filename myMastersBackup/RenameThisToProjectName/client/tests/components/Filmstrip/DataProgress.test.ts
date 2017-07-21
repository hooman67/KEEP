import { expect } from 'chai';
import {
  defaultDimensionsData,
  defaultFilmstripRowData,
} from './TestData';
import {
  timestampToPixel,
  pixelToTimestamp,
} from '../../../src/components/Filmstrip/DataProcess';

const defaultData = {
  dimensionsData: defaultDimensionsData,
  filmstripRowData: defaultFilmstripRowData,
};

describe('Filmstrip DataProcess Unit Test', () => {
  it('timestampToPixel unit test', () => {
    expect(timestampToPixel(50, defaultData.filmstripRowData, defaultData.dimensionsData)).to.equal(500);
    expect(timestampToPixel(40, defaultData.filmstripRowData, defaultData.dimensionsData)).to.equal(400);
  });

  it('pixelToTimestamp unit test', () => {
    expect(pixelToTimestamp(500, defaultData.filmstripRowData, defaultData.dimensionsData)).to.equal(50);
    expect(pixelToTimestamp(400, defaultData.filmstripRowData, defaultData.dimensionsData)).to.equal(40);
  });
});
