import { expect } from 'chai';
import FilmstripReducer from '../../src/reducers/FilmstripReducer';
import * as actions from '../../src/actions/ActionTypes';

const INITIAL_STATE = {
  duration: null,
  media_id: null,
  nb_frames: null,
  width: null,
  height: null,
  fps: null,
  rawThumbnailData: null,
  heatmapCrowdData: null,
  dimensionsData: null,
  filmstripRowData: null,
  thumbnailData: null,
  isInitialized: false,
  isThumbnailReady: true,
  isCrowdHeatmapReady: true,
};

const defaultPayloadData = {
  duration: 326.6,
  media_id: '58efc347d41c8884c27e94d1',
  nb_frames: 3266,
  width: 640,
  height: 480,
  fps: 10,
  src_data: [
    {
      directory: 'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/100/',
      height: 100,
      width: 133,
      frame_interval: 1,
    },
    {
      directory: 'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/200/',
      height: 200,
      width: 266,
      frame_interval: 1,
    },
    {
      directory: 'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/300/',
      height: 300,
      width: 400,
      frame_interval: 1,
    },
  ],
};

describe('Filmstrip Reducer Test', () => {
  it('handles action with unknown type', () => {
    expect(FilmstripReducer({...INITIAL_STATE}, {})).to.eql(INITIAL_STATE);
  });

  it('FILMSTRIP_FETCH_THUMBNAIL', () => {
    const action = {
      type: actions.FILMSTRIP_FETCH_THUMBNAIL,
      payload: {
        data: defaultPayloadData,
      },
    };

    expect(FilmstripReducer({...INITIAL_STATE}, action))
      .to.eql({
      ...INITIAL_STATE,
      duration: defaultPayloadData.duration,
      media_id: defaultPayloadData.media_id,
      nb_frames: defaultPayloadData.nb_frames,
      width: defaultPayloadData.width,
      height: defaultPayloadData.height,
      fps: defaultPayloadData.fps,
      rawThumbnailData: defaultPayloadData.src_data,
      isThumbnailReady: true,
    });
  });

  it('FILMSTRIP_RESIZE', () => {
    const data = FilmstripReducer(
      {...INITIAL_STATE},
      {
        type: actions.FILMSTRIP_FETCH_THUMBNAIL,
        payload: {
          data: defaultPayloadData,
        },
      },
    );

    expect(FilmstripReducer(
      {...data},
      {
        type: actions.FILMSTRIP_RESIZE,
        dimensions: {
          height: 110,
          width: 1100,
        },
      }))
      .to
      .eql({
        ...data,
        isInitialized: true,
        isThumbnailReady: true,
        dimensionsData: {
          filmstripCoreHeight: 110,
          filmstripCoreWidth: 1100,
          filmstripRow: 1,
          thumbnailColumn: 8,
          thumbnailWidth: 137.5,
          thumbnailHeight: 103.125,
          generalWidth: 1100,
          generalHeight: 103.125,
          thumbnailLayerHeight: 103.125,
          heatmapLayerHeight: 17.1875,
          highlightLayerHeight: 17.1875,
          indicatorLayerHeight: 103.125,
        },
        filmstripRowData: [
          {startTime: 0, endTime: 326.6},
        ],
        thumbnailData: {
          numThumbnailDisplay: 48,
          duration: 326.6,
          sourceTotalNumber: 3266,
          src: 'https://research.hct.ece.ubc.ca/myview/thumbnails/58cb6d06e5719b13ee9a1cba/100/',
        },
      });
  });
});
