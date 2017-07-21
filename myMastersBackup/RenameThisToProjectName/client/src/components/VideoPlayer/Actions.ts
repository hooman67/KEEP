import * as actions from './ActionTypes';
import {
  ActionCreator,
  IAction,
} from '../../services/ActionCreator';

export const onVideoPlayerInit = ActionCreator<IAction>(actions.VIDEO_PLAYER_INIT, 'videoPlayer');
export const onVideoPlayerResize = ActionCreator<IAction>(actions.VIDEO_PLAYER_RESIZE, 'dimensions');
export const onVideoPlayerUpdateCurrentTime = ActionCreator<IAction>(actions.VIDEO_PLAYER_CURRENT_TIME_UPDATE, 'currentTime');
export const onVideoPlayerSeek = ActionCreator<IAction>(actions.VIDEO_PLAYER_SEEK, 'timeStamp');
export const onVideoPlayerDestory = ActionCreator<IAction>(actions.VIDEO_PLAYER_DESTORY);

export const onVideoPlayerPlayHighlightStart = ActionCreator<IAction>(actions.VIDEO_PLAYER_PLAY_HIGHLIGHT_START, 'highlightData', 'highlightColor');
export const onVideoPlayerPlayNextHighlightInterval = ActionCreator<IAction>(actions.VIDEO_PLAYER_PLAY_NEXT_HIGHLIGHT_INTERVAL);
export const onVideoPlayerPlayCommentClick = ActionCreator<IAction>(actions.VIDEO_PLAYER_COMMENT_CLICK, 'commentData', 'commentColor', 'commentIndex');
export const onVideoPlayerPlayNextCommentInterval = ActionCreator<IAction>(actions.VIDEO_PLAYER_PLAY_NEXT_COMMENT_INTERVAL);
