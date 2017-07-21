import { createSelector } from 'reselect';
import { addHighLightFlags } from './TranscriptHelpers';

const getTranscriptState = state => state.activeVideo.transcript ? state.activeVideo.transcript.transcriptObj : null;
const getHighlightState = state => state.activeVideo.highlight ? state.activeVideo.highlight.highlightData : null;
const getCommentState = state => state.activeVideo.comment ? state.activeVideo.comment.commentData : null;

const getModifiedTranscriptState =
(getTranscriptState, getHighlightState, getCommentState) =>
 getTranscriptState !== null ? addHighLightFlags(getTranscriptState, getHighlightState, getCommentState) : null;

export const transcriptSelector = createSelector(
  getTranscriptState,
  getHighlightState,
  getCommentState,
  getModifiedTranscriptState,
);