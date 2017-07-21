import { expect } from 'chai';
import activeVideoReducer from '../../src/reducers/ActiveVideoReducer';
import * as actions from '../../src/actions/ActionTypes';

const INITIAL_STATE = {
  userId: null,
  mediaId: null,
  videoSrc: null,
  transcriptSrc: null,
  currentTime: null,
  startTime: null,
  endTime: null,
  playbackRate: null,
  transcriptObj: null,
  heatmapData: null,
  highlightData: null,
  isPaused: false,
  isHighlightedPlaying: false,
  isHighlightedHidden: false,
  cachedHighlightData: null,
  removeMultiColorHighlights: false,
  removeHighLight: false,
  seekToPoint: null,
  activePlayerColor: null,
  activeHighlightColor: null,
  savePending: null,
  saveSucceeded: null,
  saveError: null,
  currentHighlightIndex: null,
  finalHighlightedIndex: null,
  highlightPlaybackStarted: false,
  isReady: false,
  playerFrameWidth: null,
  playerFrameHeight: null,
  heatmapUpdate: [],
  lastValidTime: null,
  selectSection: {
    selectSectionStartTime: null,
    selectSectionEndTime: null,
    status: 'free',
  },
};

describe('Active Video Reducer Test', () => {
  it('handles action with unknown type', () => {
    expect(activeVideoReducer(undefined, {})).to.eql(INITIAL_STATE);
  });

  it('VIDEO_PLAYER_PAUSE_VIDEO', () => {
    const action = { type: actions.VIDEO_PLAYER_PAUSE_VIDEO };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        isPaused: true,
      });
  });

  it('VIDEO_PLAYER_PLAY_VIDEO', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAY_VIDEO };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      isPaused: true,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        isPaused: false,
      });
  });

  it('HIGHLIGHT_SELECT_COLOR', () => {
    const action = { type: actions.HIGHLIGHT_SELECT_COLOR, color: 'red' };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      activeHighlightColor: 'red',
      removeHighLight: true,
    }, action))
      .to.deep.equal({
        ...INITIAL_STATE,
        activeHighlightColor: 'red',
        removeHighLight: false,
      });
  });

  it('VIDEO_PLAYER_PLAY_SELECT_HIGHLIGHT_COLOR', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAY_SELECT_HIGHLIGHT_COLOR, color: 'red' };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        activePlayerColor: 'red',
      });
  });

  // TODO: HIGHLIGHT_SEND_SELECTION

  it('HIGHLIGHT_REMOVE_MULTIPLE', () => {
    const action = { type: actions.HIGHLIGHT_REMOVE_MULTIPLE };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        removeMultiColorHighlights: true,
      });
  });

  it('HIGHLIGHT_STATUS_TOGGLE', () => {
    const action = { type: actions.HIGHLIGHT_STATUS_TOGGLE };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        isHighlightedHidden: true,
      });
  });

  // TODO: HIGHLIGHT_TOGGLE

  // TODO: HIGHLIGHT_TRANSCRIPT_TOGGLE

  it('VIDEO_PLAYER_PLAY_HIGHLIGHT_START', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAY_HIGHLIGHT_START };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      activePlayerColor: 'red',
      highlightData: {
        red: [
          { start: 10, end: 20 },
          { start: 30, end: 40 },
          { start: 50, end: 60 },
        ],
      },
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        activePlayerColor: 'red',
        highlightData: {
          red: [
            { start: 10, end: 20 },
            { start: 30, end: 40 },
            { start: 50, end: 60 },
          ],
        },
        isHighlightedPlaying: true,
        startTime: 10,
        endTime: 20,
        currentHighlightIndex: 0,
        finalHighlightedIndex: 2,
      });
  });

  // TODO: HIGHLIGHT_FILMSTRIP_PLAY_HIGHLIGHT

  it('VIDEO_PLAYER_PLAY_NEXT_HIGHLIGHT_INTERVAL', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAY_NEXT_HIGHLIGHT_INTERVAL };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      activePlayerColor: 'red',
      highlightData: {
        red: [
          { start: 10, end: 20 },
          { start: 30, end: 40 },
          { start: 50, end: 60 },
        ],
      },
      isHighlightedPlaying: false,
      startTime: 10,
      endTime: 20,
      currentHighlightIndex: 1,
      finalHighlightedIndex: 2,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        activePlayerColor: 'red',
        highlightData: {
          red: [
            { start: 10, end: 20 },
            { start: 30, end: 40 },
            { start: 50, end: 60 },
          ],
        },
        isHighlightedPlaying: true,
        startTime: 50,
        endTime: 60,
        currentHighlightIndex: 2,
        finalHighlightedIndex: 2,
      });
  });

  it('VIDEO_PLAYER_PLAY_HIGHLIGHT_END', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAY_HIGHLIGHT_END };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      isHighlightedPlaying: true,
      startTime: 50,
      endTime: 60,
      currentHighlightIndex: 2,
      finalHighlightedIndex: 2,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        isHighlightedPlaying: false,
        startTime: null,
        endTime: null,
        currentHighlightIndex: null,
        finalHighlightedIndex: null,
      });
  });

  it('VIDEO_PLAYER_HIGHLIGHT_PLAYBACK_START', () => {
    const action = { type: actions.VIDEO_PLAYER_HIGHLIGHT_PLAYBACK_START };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      highlightPlaybackStarted: false,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        highlightPlaybackStarted: true,
      });
  });

  it('VIDEO_PLAYER_HIGHLIGHT_PLAYBACK_END', () => {
    const action = { type: actions.VIDEO_PLAYER_HIGHLIGHT_PLAYBACK_END };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      highlightPlaybackStarted: true,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        highlightPlaybackStarted: false,
      });
  });

  // TODO: VIDEO_PLAYER_CURRENT_TIME_UPDATE

  it('VIDEO_PLAYER_PLAYBACK_RATE_UPDATE', () => {
    const action = { type: actions.VIDEO_PLAYER_PLAYBACK_RATE_UPDATE, playbackRate: 2 };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        playbackRate: 2,
      });
  });

  it('VIDEO_PLAYER_SEEK_TO_POINT', () => {
    const action = { type: actions.VIDEO_PLAYER_SEEK_TO_POINT, seekToPoint: 10 };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        seekToPoint: 10,
      });
  });

  it('VIDEO_PLAYER_RESET_SEEK_POINT', () => {
    const action = { type: actions.VIDEO_PLAYER_RESET_SEEK_POINT };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      seekToPoint: 10,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
      });
  });

  // TODO: PERSISTING_TO_DATABASE, PERSIST_SUCCESS, PERSIST_FAILURE

  it('HIGHLIGHT_REMOVE_ENABLE', () => {
    const action = { type: actions.HIGHLIGHT_REMOVE_ENABLE };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        removeHighLight: true,
      });
  });

  it('UPDATE_CROWD_HEATMAP', () => {
    const action = { type: actions.UPDATE_CROWD_HEATMAP };
    expect(activeVideoReducer({
      ...INITIAL_STATE,
      lastValidTime: 55,
      heatmapUpdate: [], // need to add valid data
    }, action))
      .to.eql({
        ...INITIAL_STATE,
        lastValidTime: null,
        heatmapUpdate: [],
      });
  });
});
