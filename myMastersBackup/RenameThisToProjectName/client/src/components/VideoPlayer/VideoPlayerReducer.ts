import * as actions from './ActionTypes';

const INITIAL_STATE = {
  videoPlayer: null,
  currentTime: null,
  highlightEndTime: Number.MIN_SAFE_INTEGER,
  commentEndTime:  Number.MIN_SAFE_INTEGER,
  dimensions: null,
  highlightData: null,
  highlightColor: null,
  isHighlightedPlaying: false,
  isCommentedPlaying: false,
  currentHighlightIndex: null,
  currentCommentIndex: null,
  commentData: null,
  commentColor: null,
  commentIndex: null,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case actions.VIDEO_PLAYER_INIT:
      return {
        ...state,
        videoPlayer: action.videoPlayer,
      };

    case actions.VIDEO_PLAYER_RESIZE:
      if (state.videoPlayer) {
        state.videoPlayer.height(action.dimensions.height);
        state.videoPlayer.width(action.dimensions.width);
      }
      return {
        ...state,
        dimensions: action.dimensions,
      };

    case actions.VIDEO_PLAYER_CURRENT_TIME_UPDATE:
      return {
        ...state,
        currentTime: action.currentTime,
      };

    case actions.VIDEO_PLAYER_SEEK:
      state.videoPlayer.currentTime(action.timeStamp);
      return {
        ...state,
        isHighlightedPlaying: false,
        highlightData: null,
        highlightColor: null,
        currentHighlightIndex: null,
        highlightEndTime: Number.MIN_SAFE_INTEGER,
      };

    case actions.VIDEO_PLAYER_DESTORY:
      return INITIAL_STATE;

    case actions.VIDEO_PLAYER_PLAY_HIGHLIGHT_START:
      console.log("SS Reducer has clicked on highlight.");
      console.log(action.highlightData);
      state.videoPlayer.play();
      if (action.highlightData.length > 0) {
        return {
          ...state,
          isHighlightedPlaying: true,
          currentHighlightIndex: -1,
          highlightData: action.highlightData,
          highlightColor: action.highlightColor,
        };
      } else {
        return state;
      }

    case actions.VIDEO_PLAYER_COMMENT_CLICK:

      console.log("Comment has been clicked");
      console.log(action.commentData);
      state.videoPlayer.play();
      if (action.commentData[action.commentColor].length > 0) {
        return {
          ...state,
          isCommentedPlaying: true,
          currentCommentIndex: -1,
          commentData: action.commentData,
          commentColor: action.commentColor,
          commentIndex: action.commentIndex,
        };
      } else {
        return state;
      }

    case actions.VIDEO_PLAYER_PLAY_NEXT_HIGHLIGHT_INTERVAL:
      if (state.currentHighlightIndex + 1 < state.highlightData.length) {
        state.videoPlayer.currentTime(state.highlightData[state.currentHighlightIndex + 1].start);
        return {
          ...state,
          highlightEndTime: state.highlightData[state.currentHighlightIndex + 1].end,
          currentHighlightIndex: state.currentHighlightIndex + 1,
        };
      } else {
        state.videoPlayer.pause();
        return {
          ...state,
          isHighlightedPlaying: false,
          highlightData: null,
          highlightColor: null,
          currentHighlightIndex: null,
          highlightEndTime: Number.MIN_SAFE_INTEGER,
        };
      }

      case actions.VIDEO_PLAYER_PLAY_NEXT_COMMENT_INTERVAL:
        if (state.currentCommentIndex + 1 < 1) {
          const commentArr = state.commentData[state.commentColor]
          state.videoPlayer.currentTime(commentArr[state.commentIndex].start);
          return {
            ...state,
            commentEndTime: commentArr[state.commentIndex].end,
            currentCommentIndex: state.currentCommentIndex + 1,
          };
        } else {
          state.videoPlayer.pause();
          return {
            ...state,
            isCommentedPlaying: false,
            commentData: null,
            commentColor: null,
            currentCommentIndex: null,
            commentEndTime: Number.MIN_SAFE_INTEGER,
          };
        }

    default:
      return state;
  }
}
